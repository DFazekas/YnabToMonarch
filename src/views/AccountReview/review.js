import state from '../../state.js';
import monarchAccountTypes from '../../../public/static-data/monarchAccountTypes.json';
import { navigate } from '../../router.js';
import { renderButtons } from '../../components/button.js';

let reviewTableBody, importBtn, searchInput;
let currentFilter = 'all';
let searchQuery = '';

export default function initAccountReviewView() {
  reviewTableBody = document.getElementById('reviewTableBody');
  importBtn = document.getElementById('importBtn');
  searchInput = document.getElementById('searchInput');

  renderButtons();

  document.getElementById('filterAll').classList.add('bg-blue-500', 'text-white');

  // Search listener
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.toLowerCase();
    renderTable();
  });

  // Filter listeners
  document.getElementById('filterAll').addEventListener('click', () => { currentFilter = 'all'; updateFilters(); });
  document.getElementById('filterIncluded').addEventListener('click', () => { currentFilter = 'included'; updateFilters(); });
  document.getElementById('filterExcluded').addEventListener('click', () => { currentFilter = 'excluded'; updateFilters(); });

  // Bulk action bar listeners
  document.getElementById('unselectAllBtn').addEventListener('click', () => {
    Object.values(state.accounts).forEach(acc => acc.selected = false);
    renderTable();
  });

  document.getElementById('bulkIncludeBtn').addEventListener('click', () => {
    Object.values(state.accounts).filter(acc => acc.selected).forEach(acc => acc.included = true);
    renderTable();
  });

  document.getElementById('bulkExcludeBtn').addEventListener('click', () => {
    Object.values(state.accounts).filter(acc => acc.selected).forEach(acc => acc.included = false);
    renderTable();
  });

  document.getElementById('bulkRenameBtn').addEventListener('click', () => {
    openBulkRenameModal();
  });

  document.getElementById('bulkTypeBtn').addEventListener('click', () => {
    openBulkTypeModal();
  });

  // Master checkbox listener
  document.getElementById('masterCheckbox').addEventListener('change', masterCheckboxChange);

  // Handle back navigation
  backBtn.addEventListener('click', () => {
    navigate('uploadView');
  });

  // Handle forward navigation
  importBtn.addEventListener('click', () => {
    navigate('methodView');
  });

  renderTable();
}

function updateFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('bg-blue-500', 'text-white', 'hover:bg-blue-100');
    btn.classList.add('bg-transparent', 'text-gray-700', 'hover:bg-blue-100');
  });

  const activeBtn = document.getElementById(`filter${capitalize(currentFilter)}`);
  activeBtn.classList.remove('bg-transparent', 'text-gray-700', 'hover:bg-blue-100');
  activeBtn.classList.add('bg-blue-500', 'text-white');

  renderTable();
}

function renderTable() {
  reviewTableBody.innerHTML = '';

  for (const [_, account] of Object.entries(state.accounts)) {
    if (currentFilter === 'included' && !account.included) continue;
    if (currentFilter === 'excluded' && account.included) continue;
    if (searchQuery && !account.modifiedName.toLowerCase().includes(searchQuery)) continue;

    const row = document.createElement('tr');
    row.classList.add('border-t', 'border-[#dce1e5]');

    // Selection checkbox column
    const checkboxTd = document.createElement('td');
    checkboxTd.className = 'px-2 py-2 text-center';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'w-5 h-5 cursor-pointer';
    checkbox.checked = account.selected;

    checkbox.addEventListener('change', () => {
      account.selected = checkbox.checked;
      console.log('Checkbox clicked:', account.modifiedName, '->', account.selected);

      // Debug full selected list
      const selectedAccounts = Object.values(state.accounts).filter(acc => acc.selected);
      console.log('Currently selected:', selectedAccounts.map(acc => acc.modifiedName));

      updateBulkBar();
      updateMasterCheckbox();
    });
    checkboxTd.appendChild(checkbox);
    row.appendChild(checkboxTd);

    // Account Name (clickable)
    const nameTd = document.createElement('td');
    nameTd.className = 'px-2 py-2 max-w-[300px] truncate cursor-pointer';
    nameTd.title = `Click to rename '${account.modifiedName}'`;
    nameTd.textContent = account.modifiedName;
    nameTd.addEventListener('click', () => openNameEditor(account, nameTd));
    row.appendChild(nameTd);

    // Account Type dropdown
    const typeTd = document.createElement('td');
    typeTd.className = 'px-2 py-2';
    const typeSelect = document.createElement('select');
    typeSelect.className = 'border rounded px-2 py-1 w-full cursor-pointer';
    monarchAccountTypes.data.forEach(type => {
      const opt = document.createElement('option');
      opt.value = type.typeName;
      opt.textContent = type.typeDisplay;
      if (type.typeName === account.type) opt.selected = true;
      typeSelect.appendChild(opt);
    });
    // Tooltip showing the currently selected account type
    typeSelect.title = typeSelect.options[typeSelect.selectedIndex].textContent;
    typeSelect.addEventListener('change', () => {
      account.type = typeSelect.value;
      const selectedType = monarchAccountTypes.data.find(t => t.typeName === account.type);
      account.subtype = selectedType?.subtypes[0]?.name || null;
      renderTable();
    });
    typeTd.appendChild(typeSelect);
    row.appendChild(typeTd);

    // Subtype dropdown
    const subtypeTd = document.createElement('td');
    subtypeTd.className = 'px-2 py-2';
    const subtypeSelect = document.createElement('select');
    subtypeSelect.className = 'border rounded px-2 py-1 w-full cursor-pointer';
    const selectedType = monarchAccountTypes.data.find(t => t.typeName === account.type);
    (selectedType?.subtypes || []).forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.name;
      opt.textContent = sub.display;
      if (sub.name === account.subtype) opt.selected = true;
      subtypeSelect.appendChild(opt);
    });
    subtypeSelect.title = subtypeSelect.options[subtypeSelect.selectedIndex].textContent;
    subtypeSelect.addEventListener('change', () => {
      account.subtype = subtypeSelect.value;
      renderTable();
    });
    subtypeTd.appendChild(subtypeSelect);
    row.appendChild(subtypeTd);

    // Transaction count
    const txTd = document.createElement('td');
    txTd.className = 'px-2 py-2 text-center';
    txTd.textContent = account.transactionCount;
    txTd.title = `${account.transactionCount} transaction${account.transactionCount !== 1 ? 's' : ''}`;
    row.appendChild(txTd);

    // Balance
    const formattedBalance = Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const prettyBalance = (account.balance < 0 ? '-$' : '$') + formattedBalance;
    const balanceTd = document.createElement('td');
    balanceTd.className = 'px-2 py-2 text-[#637988]';
    balanceTd.textContent = prettyBalance
    balanceTd.title = `Balance: ${prettyBalance}`;
    row.appendChild(balanceTd);

    // Include toggle button
    const includeTd = document.createElement('td');
    includeTd.className = 'px-2 py-2';

    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('ui-button');
    toggleBtn.dataset.type = account.included ? 'primary' : 'secondary';
    toggleBtn.dataset.size = 'small';
    toggleBtn.dataset.fixedWidth = '100';
    toggleBtn.textContent = account.included ? 'Included' : 'Excluded';
    toggleBtn.title = account.included ? 'Click to exclude this account' : 'Click to include this account';

    toggleBtn.addEventListener('click', () => {
      account.included = !account.included;
      renderTable();
    });
    includeTd.appendChild(toggleBtn);
    row.appendChild(includeTd);

    reviewTableBody.appendChild(row);
  }

  updateMasterCheckbox();
  updateBulkBar();

  console.log("State accounts:", state.accounts);
  const anyIncluded = Object.values(state.accounts).some(acc => acc.included);
  console.log("Any included accounts:", anyIncluded);
  importBtn.disabled = !anyIncluded;
  importBtn.title = anyIncluded ? '' : 'At least one account must be included to proceed';

  renderButtons();
}

function masterCheckboxChange(e) {
  const checked = e.target.checked;
  Object.values(state.accounts).forEach(acc => {
    acc.selected = checked;
  });
  renderTable();
}

function updateMasterCheckbox() {
  const masterCheckbox = document.getElementById('masterCheckbox');
  const numberOfAccounts = Object.keys(state.accounts).length;
  const numberOfSelectedAccounts = Object.entries(state.accounts).filter(([_, acc]) => acc.selected).length;
  const anySelected = numberOfSelectedAccounts > 0
  const allSelected = anySelected && numberOfSelectedAccounts === numberOfAccounts

  console.log("Any Selected:", anySelected, "\nAll Selected:", allSelected, "\nTotal Accounts:", numberOfAccounts, "\nSelected Count:", numberOfSelectedAccounts);

  masterCheckbox.checked = allSelected;
  masterCheckbox.indeterminate = !allSelected && anySelected;
}

function updateBulkBar() {
  const bar = document.getElementById('bulkActionBar');
  const countSpan = document.getElementById('selectedCount');
  const count = Object.values(state.accounts).filter(acc => acc.selected).length;
  countSpan.textContent = count;

  if (count > 0) {
    bar.classList.remove('hidden');
    requestAnimationFrame(() => bar.classList.add('active'))
  }
  else {
    bar.classList.remove('active');
    setTimeout(() => bar.classList.add('hidden'), 300);
  }
}

function openNameEditor(account, nameCell) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 opacity-0 transition-opacity duration-200';
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('opacity-100'));

  const popup = document.createElement('div');
  popup.className = 'bg-white rounded-lg shadow-lg p-5 w-[400px]';

  const title = document.createElement('h2');
  title.className = 'font-bold mb-3 text-lg';
  title.textContent = 'Edit Account Name';
  popup.appendChild(title);

  const input = document.createElement('input');
  input.type = 'text';
  input.value = account.name;
  input.className = 'border rounded w-full px-3 py-2 mb-4';
  popup.appendChild(input);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'flex justify-end gap-2';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'bg-gray-300 px-4 py-2 rounded';
  cancelBtn.addEventListener('click', () => closeEditor());

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded font-bold';
  saveBtn.addEventListener('click', save);

  buttonRow.appendChild(cancelBtn);
  buttonRow.appendChild(saveBtn);
  popup.appendChild(buttonRow);
  overlay.appendChild(popup);

  input.focus();
  input.select();

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEditor();
    if (e.key === 'Enter') save();
  });

  function closeEditor() {
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    setTimeout(() => document.body.removeChild(overlay), 200);
  }

  function save() {
    account.name = input.value.trim();
    nameCell.textContent = account.name;
    nameCell.title = account.name;
    closeEditor();
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function openBulkRenameModal() {
  const modal = document.getElementById('bulkRenameModal');
  const renamePattern = document.getElementById('renamePattern');
  const indexStartInput = document.getElementById('indexStart');
  const previewDiv = document.getElementById('renamePreview');
  const cancelBtn = document.getElementById('renameCancel');
  const applyBtn = document.getElementById('renameApply');
  const tokenButtons = modal.querySelectorAll('.token-btn');

  modal.classList.remove('hidden');
  renamePattern.focus();

  const selectedAccounts = Object.values(state.accounts).filter(acc => acc.selected);

  // Token insert handlers
  tokenButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const token = btn.dataset.token;
      renamePattern.value += token;
      updatePreview();
    });
  });

  // Live preview
  renamePattern.addEventListener('input', updatePreview);
  indexStartInput.addEventListener('input', updatePreview);

  updatePreview();

  function updatePreview() {
    previewDiv.innerHTML = '';

    const pattern = renamePattern.value;
    const indexStart = parseInt(indexStartInput.value, 10) || 1;

    selectedAccounts.slice(0, 3).forEach((acc, i) => {
      const previewName = applyPattern(pattern, acc, i + indexStart);
      const div = document.createElement('div');
      div.textContent = previewName;
      previewDiv.appendChild(div);
    });
  }

  cancelBtn.onclick = () => modal.classList.add('hidden');

  applyBtn.onclick = () => {
    const pattern = renamePattern.value;
    const indexStart = parseInt(indexStartInput.value, 10) || 1;

    selectedAccounts.forEach((acc, i) => {
      acc.modifiedName = applyPattern(pattern, acc, i + indexStart);
    });

    modal.classList.add('hidden');
    renderTable();
  };
}

function applyPattern(pattern, account, index) {
  const today = new Date().toISOString().split('T')[0];
  return pattern
    .replace(/{{YNAB}}/g, account.originalYnabName || account.name)
    .replace(/{{Index}}/g, index)
    .replace(/{{Upper}}/g, (account.originalYnabName || account.name).toUpperCase())
    .replace(/{{Date}}/g, today);
}

function openBulkTypeModal() {
  const modal = document.getElementById('bulkTypeModal');
  const typeSelect = document.getElementById('bulkTypeSelect');
  const subtypeSelect = document.getElementById('bulkSubtypeSelect');
  const cancelBtn = document.getElementById('bulkTypeCancel');
  const applyBtn = document.getElementById('bulkTypeApply');

  modal.classList.remove('hidden');

  // Populate Type dropdown
  typeSelect.innerHTML = '';
  monarchAccountTypes.data.forEach(type => {
    const opt = document.createElement('option');
    opt.value = type.typeName;
    opt.textContent = type.typeDisplay;
    typeSelect.appendChild(opt);
  });

  // On type change, repopulate subtype dropdown
  function updateSubtypeOptions() {
    const selectedType = monarchAccountTypes.data.find(t => t.typeName === typeSelect.value);
    subtypeSelect.innerHTML = '';

    (selectedType?.subtypes || []).forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.name;
      opt.textContent = sub.display;
      subtypeSelect.appendChild(opt);
    });

    // If no subtypes available, add default empty option
    if ((selectedType?.subtypes || []).length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '-';
      subtypeSelect.appendChild(opt);
    }
  }

  typeSelect.addEventListener('change', updateSubtypeOptions);
  updateSubtypeOptions();

  cancelBtn.onclick = () => modal.classList.add('hidden');

  applyBtn.onclick = () => {
    const typeValue = typeSelect.value;
    const subtypeValue = subtypeSelect.value;

    const selectedAccounts = Object.values(state.accounts).filter(acc => acc.selected);
    selectedAccounts.forEach(acc => {
      acc.type = typeValue;
      acc.subtype = subtypeValue || null;
    });

    modal.classList.add('hidden');
    renderTable();
  };
}
