import Accounts from '../../schemas/accounts.js';
import { renderPageLayout } from '../../components/pageLayout.js';
import { navigate } from '../../router.js';
import monarchAccountTypes from '../../../public/static-data/monarchAccountTypes.json';
import { getAccountTypeByName } from '../../utils/accountTypeUtils.js';
import { AccountType as YnabAccountType } from '../../utils/enumYnabAccountType.js';

const normalize = (value) => String(value || '').toLowerCase();

const guessMonarchMapping = (account) => {
  const name = normalize(account.ynabName);
  const ynabType = account.ynabType;
  let type = null;
  let subtype = null;
  let confidence = 0.5;

  switch (ynabType) {
    case YnabAccountType.CHECKING:
      type = 'depository';
      subtype = 'checking';
      confidence = 0.9;
      break;
    case YnabAccountType.SAVINGS:
      type = 'depository';
      subtype = 'savings';
      confidence = 0.9;
      break;
    case YnabAccountType.CASH:
      type = 'depository';
      subtype = 'cash_management';
      confidence = 0.75;
      break;
    case YnabAccountType.CREDIT_CARD:
      type = 'credit';
      subtype = 'credit_card';
      confidence = 0.9;
      break;
    case YnabAccountType.LINE_OF_CREDIT:
      type = 'loan';
      subtype = 'line_of_credit';
      confidence = 0.85;
      break;
    case YnabAccountType.MORTGAGE:
      type = 'loan';
      subtype = 'mortgage';
      confidence = 0.9;
      break;
    case YnabAccountType.AUTO_LOAN:
      type = 'loan';
      subtype = 'auto';
      confidence = 0.85;
      break;
    case YnabAccountType.STUDENT_LOAN:
      type = 'loan';
      subtype = 'student';
      confidence = 0.85;
      break;
    case YnabAccountType.PERSONAL_LOAN:
    case YnabAccountType.MEDICAL_DEBT:
    case YnabAccountType.OTHER_DEBT:
      type = 'loan';
      subtype = 'consumer';
      confidence = 0.7;
      break;
    case YnabAccountType.OTHER_ASSET:
      type = 'other_asset';
      subtype = 'other';
      confidence = 0.6;
      break;
    case YnabAccountType.OTHER_LIABILITY:
      type = 'other_liability';
      subtype = 'other';
      confidence = 0.6;
      break;
    default:
      break;
  }

  if (name.includes('mortgage')) {
    type = 'loan';
    subtype = 'mortgage';
    confidence = Math.max(confidence, 0.85);
  }

  if (name.includes('line of credit') || name.includes('loc')) {
    type = 'loan';
    subtype = 'line_of_credit';
    confidence = Math.max(confidence, 0.8);
  }

  if (name.includes('auto') || name.includes('car')) {
    type = 'loan';
    subtype = 'auto';
    confidence = Math.max(confidence, 0.8);
  }

  if (name.includes('student')) {
    type = 'loan';
    subtype = 'student';
    confidence = Math.max(confidence, 0.8);
  }

  if (name.includes('credit') || name.includes('visa') || name.includes('amex') || name.includes('mastercard')) {
    type = 'credit';
    subtype = 'credit_card';
    confidence = Math.max(confidence, 0.8);
  }

  if (name.includes('checking')) {
    type = 'depository';
    subtype = 'checking';
    confidence = Math.max(confidence, 0.8);
  }

  if (name.includes('savings')) {
    type = 'depository';
    subtype = 'savings';
    confidence = Math.max(confidence, 0.8);
  }

  if (name.includes('ira') || name.includes('401k') || name.includes('brokerage') || name.includes('roth')) {
    type = 'brokerage';
    if (name.includes('roth') && name.includes('401')) {
      subtype = 'roth_401k';
    } else if (name.includes('401k')) {
      subtype = 'st_401k';
    } else if (name.includes('ira')) {
      subtype = name.includes('roth') ? 'roth' : 'ira';
    } else if (name.includes('brokerage')) {
      subtype = 'brokerage';
    }
    confidence = Math.max(confidence, 0.75);
  }

  return { type, subtype, confidence };
};

export default async function initAccountMappingView() {
  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Step 3: Review Monarch Account Details',
      description: 'Approve the suggested Monarch mappings before continuing.',
      containerId: 'pageHeader'
    }
  });

  const accounts = new Accounts();
  await accounts.loadFromDb();

  const mappingConfidence = new Map();
  const cardsContainer = document.getElementById('accountMappingTable');
  const statusFilterSelect = document.getElementById('statusFilterSelect');
  const sortSelect = document.getElementById('sortSelect');
  const mappingContinueBtn = document.getElementById('mappingContinueBtn');

  const accountsToReview = accounts.accounts.filter(account => account.included);

  const defaultMappingUpdates = accountsToReview
    .filter(account => !account.monarchType || !account.monarchSubtype)
    .map(account => {
      const guess = guessMonarchMapping(account);
      mappingConfidence.set(account.id, guess.confidence);
      if (!account.monarchType && guess.type) account.monarchType = guess.type;
      if (!account.monarchSubtype && guess.subtype) account.monarchSubtype = guess.subtype;
      return accounts.updateAccount(account);
    });

  await Promise.all(defaultMappingUpdates);

  const sortState = { key: 'ynab', direction: 'asc' };
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  const getStatus = (account) => {
    if (account.isUserApproved) return 'approved';
    if (!String(account.monarchName).trim() || !account.monarchType || !account.monarchSubtype) {
      return 'needs-review';
    }
    return 'pending-approval';
  };

  const getSortValue = (account, key) => {
    switch (key) {
      case 'approved':
        return account.isUserApproved ? 1 : 0;
      case 'ynab':
        return account.ynabName || '';
      case 'monarch':
        return account.monarchName || '';
      case 'type':
        return account.monarchType || '';
      case 'subtype':
        return account.monarchSubtype || '';
      case 'status':
        return getStatus(account);
      default:
        return '';
    }
  };

  const sortAccounts = (list) => {
    const { key, direction } = sortState;
    const multiplier = direction === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      const aVal = getSortValue(a, key);
      const bVal = getSortValue(b, key);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * multiplier;
      }
      return collator.compare(String(aVal), String(bVal)) * multiplier;
    });
  };

  const getFilteredAccounts = () => {
    const statusFilter = statusFilterSelect.value;

    return accountsToReview.filter(account => {
      const status = getStatus(account);
      const matchesStatus = statusFilter === 'all' || statusFilter === status;
      return matchesStatus;
    });
  };

  const updateCounts = () => {
    const approvalComplete = accountsToReview.every(acc => acc.isUserApproved);

    mappingContinueBtn.textContent = approvalComplete
      ? `Next Step`
      : 'Approve All to Continue';
    mappingContinueBtn.disabled = !approvalComplete;
    if (!approvalComplete) {
      mappingContinueBtn.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
    } else {
      mappingContinueBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
    }
  };

  const renderCard = (account) => {
    const container = document.createElement('div');
    container.className = 'bg-white border border-gray-200 rounded-lg p-6 mb-4';

    const isApproved = account.isUserApproved;
    const needsReview = !String(account.monarchName).trim() || !account.monarchType || !account.monarchSubtype;
    const ynabTypeName = Object.entries(YnabAccountType)
      .find(([, value]) => value === account.ynabType)?.[0]
      ?.replace(/_/g, ' ') || account.ynabType;

    // Bank link status section
    const bankLinkSection = document.createElement('div');
    bankLinkSection.className = 'mb-4 pb-4 border-b border-gray-200';
    const bankLinkBadge = document.createElement('span');
    bankLinkBadge.className = 'group relative inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border';
    
    if (account.isDirectImportLinked) {
      bankLinkBadge.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-200');
      bankLinkBadge.innerHTML = `
        Bank Linked
        <svg class="w-4 h-4 cursor-help ml-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <div class="tooltip-container invisible group-hover:visible hover:visible absolute w-56 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
          <p class="break-words mb-2 px-3 py-2">This account is linked to a bank connection in YNAB and cannot be created as a new account in Monarch. You'll need to link it to an existing account in Monarch instead.</p>
          <a href="https://support.yoursite.com/linked-account-workaround" target="_blank" class="text-blue-300 hover:text-blue-200 underline px-3 py-2 block">Learn about the workaround →</a>
          <div class="arrow absolute border-4 border-transparent border-t-gray-900"></div>
        </div>
      `;
      
      // Position tooltip to fit within viewport
      let tooltipHideTimeout;
      
      const showTooltip = () => {
        clearTimeout(tooltipHideTimeout);
        const tooltip = bankLinkBadge.querySelector('.tooltip-container');
        if (!tooltip) return;
        
        tooltip.classList.remove('invisible');
        
        const badgeRect = bankLinkBadge.getBoundingClientRect();
        const tooltipWidth = 224; // w-56 = 14rem = 224px
        const tooltipHeight = tooltip.offsetHeight;
        const viewportWidth = window.innerWidth;
        const padding = 16;
        
        // Remove previous positioning classes
        tooltip.style.top = '';
        tooltip.style.bottom = '';
        tooltip.style.left = '';
        tooltip.style.right = '';
        tooltip.style.transform = '';
        
        const arrow = tooltip.querySelector('.arrow');
        arrow.style.top = '';
        arrow.style.bottom = '';
        arrow.style.left = '';
        arrow.style.right = '';
        arrow.style.borderTop = '';
        arrow.style.borderBottom = '';
        
        // Try to position above first
        if (badgeRect.top > tooltipHeight + 20) {
          tooltip.style.bottom = 'calc(100% + 8px)';
          arrow.style.top = '100%';
          arrow.style.borderTop = '4px solid #111827';
          arrow.style.borderBottom = 'none';
        } else {
          // Position below if not enough space above
          tooltip.style.top = 'calc(100% + 8px)';
          arrow.style.bottom = '100%';
          arrow.style.borderBottom = '4px solid #111827';
          arrow.style.borderTop = 'none';
        }
        
        // Center horizontally, but adjust if it goes off-screen
        const centeredLeft = badgeRect.left + badgeRect.width / 2 - tooltipWidth / 2;
        if (centeredLeft < padding) {
          tooltip.style.left = padding + 'px';
          arrow.style.left = (badgeRect.left + badgeRect.width / 2 - padding) + 'px';
        } else if (centeredLeft + tooltipWidth > viewportWidth - padding) {
          tooltip.style.right = padding + 'px';
          arrow.style.right = (viewportWidth - badgeRect.right - badgeRect.width / 2 + padding) + 'px';
        } else {
          tooltip.style.left = centeredLeft + 'px';
          arrow.style.left = '50%';
          arrow.style.transform = 'translateX(-50%)';
        }
      };
      
      const hideTooltip = () => {
        tooltipHideTimeout = setTimeout(() => {
          const tooltip = bankLinkBadge.querySelector('.tooltip-container');
          if (tooltip) {
            tooltip.classList.add('invisible');
          }
        }, 100);
      };
      
      bankLinkBadge.addEventListener('mouseenter', showTooltip);
      bankLinkBadge.addEventListener('mouseleave', hideTooltip);
      
      // Add hover listener to tooltip itself to prevent hiding
      setTimeout(() => {
        const tooltip = bankLinkBadge.querySelector('.tooltip-container');
        if (tooltip) {
          tooltip.addEventListener('mouseenter', () => {
            clearTimeout(tooltipHideTimeout);
            tooltip.classList.remove('invisible');
          });
          tooltip.addEventListener('mouseleave', hideTooltip);
        }
      }, 0);
    } else {
      bankLinkBadge.classList.add('bg-gray-50', 'text-gray-700', 'border-gray-200');
      bankLinkBadge.textContent = 'Manual Account';
    }
    bankLinkSection.appendChild(bankLinkBadge);
    container.appendChild(bankLinkSection);

    // Grid layout with 4 rows
    const grid = document.createElement('div');
    grid.className = 'space-y-4 mb-4';

    // Helper function to create a row
    const createRow = (ynabLabel, ynabValue, monarchLabel, monarchField, showArrow = true) => {
      const row = document.createElement('div');
      row.className = 'grid grid-cols-[1fr_60px_1fr] gap-4 items-start';

      const leftCell = document.createElement('div');
      leftCell.innerHTML = `
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">${ynabLabel}</label>
        <div class="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-gray-900 text-sm">${ynabValue}</div>
      `;

      const middleCell = document.createElement('div');
      middleCell.className = 'flex justify-center items-start pt-7';
      middleCell.textContent = showArrow ? '→' : '';
      middleCell.style.color = '#9ca3af';
      middleCell.style.fontSize = '18px';

      const rightCell = document.createElement('div');
      rightCell.appendChild(monarchField);

      row.appendChild(leftCell);
      row.appendChild(middleCell);
      row.appendChild(rightCell);
      grid.appendChild(row);
    };

    // Row 1: Name
    const nameField = document.createElement('div');
    nameField.innerHTML = `
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Monarch Name</label>
      <input type="text" value="${account.monarchName || ''}" ${isApproved ? 'disabled' : ''} 
        class="w-full px-3 py-2 border rounded text-sm ${isApproved ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white'} ${!String(account.monarchName || '').trim() ? 'border-yellow-400' : 'border-gray-300'}" 
        data-field="name">
    `;
    const nameInput = nameField.querySelector('input');
    nameInput.addEventListener('change', async (e) => {
      const nextName = String(e.target.value || '');
      if (!nextName.trim()) {
        account._monarchName = '';
      } else {
        account._monarchName = nextName;
      }
      await accounts.updateAccount(account);
      refreshCards();
    });
    createRow('YNAB Name', account.ynabName, 'Monarch Name', nameField, true);

    // Row 2: Type
    const typeField = document.createElement('div');
    typeField.innerHTML = `
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Type</label>
      <select ${isApproved ? 'disabled' : ''} 
        class="w-full px-3 py-2 border rounded text-sm ${isApproved ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white'} ${!account.monarchType ? 'border-yellow-400' : 'border-gray-300'}" 
        data-field="type">
        <option value="">Select type...</option>
      </select>
    `;
    const typeSelect = typeField.querySelector('select');
    monarchAccountTypes.data.forEach(type => {
      const option = document.createElement('option');
      option.value = type.typeName;
      option.textContent = type.typeDisplay;
      option.selected = account.monarchType === type.typeName;
      typeSelect.appendChild(option);
    });
    typeSelect.addEventListener('change', async (e) => {
      account.monarchType = e.target.value;
      account.monarchSubtype = '';
      updateSubtypes();
      await accounts.updateAccount(account);
      refreshCards();
    });
    createRow('YNAB Type', ynabTypeName, 'Type', typeField, true);

    // Row 3: Subtype (no arrow on left side, blank YNAB area)
    const subtypeRow = document.createElement('div');
    subtypeRow.className = 'grid grid-cols-[1fr_60px_1fr] gap-4 items-start';

    const subtypeLeftCell = document.createElement('div');
    subtypeLeftCell.className = '';

    const subtypeMiddleCell = document.createElement('div');
    subtypeMiddleCell.className = 'flex justify-center items-start pt-7';
    subtypeMiddleCell.textContent = '';
    subtypeMiddleCell.style.color = '#9ca3af';

    const subtypeField = document.createElement('div');
    subtypeField.innerHTML = `
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Subtype</label>
      <select ${isApproved ? 'disabled' : ''} 
        class="w-full px-3 py-2 border rounded text-sm ${isApproved ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white'} ${!account.monarchSubtype ? 'border-yellow-400' : 'border-gray-300'}" 
        data-field="subtype">
        <option value="">Select subtype...</option>
      </select>
    `;
    const subtypeSelect = subtypeField.querySelector('select');
    const updateSubtypes = () => {
      subtypeSelect.innerHTML = '<option value="">Select subtype...</option>';
      const selectedType = typeSelect.value;
      const typeData = monarchAccountTypes.data.find(t => t.typeName === selectedType);
      if (typeData && typeData.subtypes) {
        typeData.subtypes.forEach(subtype => {
          const option = document.createElement('option');
          option.value = subtype.name;
          option.textContent = subtype.display;
          option.selected = account.monarchSubtype === subtype.name;
          subtypeSelect.appendChild(option);
        });
      }
      account.monarchSubtype = subtypeSelect.value;
    };
    updateSubtypes();
    subtypeSelect.addEventListener('change', async (e) => {
      account.monarchSubtype = e.target.value;
      await accounts.updateAccount(account);
      refreshCards();
    });

    const subtypeRightCell = document.createElement('div');
    subtypeRightCell.appendChild(subtypeField);

    subtypeRow.appendChild(subtypeLeftCell);
    subtypeRow.appendChild(subtypeMiddleCell);
    subtypeRow.appendChild(subtypeRightCell);
    grid.appendChild(subtypeRow);

    // Row 4: Closed
    const closedField = document.createElement('div');
    closedField.innerHTML = `
      <div class="flex items-center gap-2 mb-1">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Closed</label>
        <div class="group relative">
          <svg class="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <div class="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 w-48 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none z-10">
            <p class="break-words">Mark whether this Monarch account is closed or open.</p>
            <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button 
          type="button"
          class="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors border ${!account.isMonarchClosed
            ? 'bg-blue-100 border-blue-300 text-blue-700'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          } ${isApproved ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
          data-field="open"
          ${isApproved ? 'disabled' : ''}>
          Open
        </button>
        <button 
          type="button"
          class="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors border ${account.isMonarchClosed
            ? 'bg-red-100 border-red-300 text-red-700'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          } ${isApproved ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
          data-field="closed"
          ${isApproved ? 'disabled' : ''}>
          Closed
        </button>
      </div>
    `;
    const openBtn = closedField.querySelector('button[data-field="open"]');
    const closedBtn = closedField.querySelector('button[data-field="closed"]');
    
    openBtn.addEventListener('click', async () => {
      account.isMonarchClosed = false;
      await accounts.updateAccount(account);
      refreshCards();
    });
    
    closedBtn.addEventListener('click', async () => {
      account.isMonarchClosed = true;
      await accounts.updateAccount(account);
      refreshCards();
    });
    
    createRow('Closed', account.isYnabClosed ? 'Closed' : 'Open', 'Closed', closedField, true);

    container.appendChild(grid);

    // Confirm button
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-end gap-2';

    const confirmBtn = document.createElement('button');
    // TODO: Remove hover effect when needsReview.
    confirmBtn.className = `px-4 py-2 rounded-md text-sm font-medium border transition-colors ${needsReview
      ? 'bg-yellow-50 text-yellow-800 border-yellow-300 cursor-not-allowed'
      : isApproved
        ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
      }`;
    confirmBtn.textContent = needsReview ? 'Needs Review' : (isApproved ? 'Modify' : 'Approve');
    confirmBtn.disabled = needsReview;

    confirmBtn.addEventListener('click', async () => {
      if (!isApproved && (!account.monarchType || !account.monarchSubtype)) {
        alert('Please select both Type and Subtype before confirming');
        return;
      }
      account.isUserApproved = !account.isUserApproved;
      await accounts.updateAccount(account);
      refreshCards();
    });

    buttonContainer.appendChild(confirmBtn);
    container.appendChild(buttonContainer);

    return container;
  };

  const refreshCards = () => {
    const filtered = getFilteredAccounts();
    const sorted = sortAccounts(filtered);
    cardsContainer.innerHTML = '';
    
    if (sorted.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'flex flex-col items-center justify-center h-64 text-gray-500';
      emptyState.innerHTML = `
        <svg class="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-lg font-medium">No accounts found</p>
        <p class="text-sm">Try adjusting your filters or search terms</p>
      `;
      cardsContainer.appendChild(emptyState);
    } else {
      sorted.forEach(account => {
        cardsContainer.appendChild(renderCard(account));
      });
    }
    updateCounts(sorted);
  };

  sortSelect.value = sortState.key;
  statusFilterSelect.addEventListener('change', refreshCards);
  sortSelect.addEventListener('change', () => {
    sortState.key = sortSelect.value;
    sortState.direction = 'asc';
    refreshCards();
  });

  mappingContinueBtn.addEventListener('click', () => navigate('/review'));

  refreshCards();
}