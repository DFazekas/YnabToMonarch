import { currencyFormatter } from '../utils/format.js';
import monarchAccountTypes from '../../public/static-data/monarchAccountTypes.json';
import { getAccountTypeByDisplayName, getSubtypeByDisplayName } from '../utils/accountTypeUtils.js';

// Shared table row creation for account views
export function createAccountRowElement(account, config = {}) {
  const tr = document.createElement('tr');
  tr.setAttribute('role', 'row')
  tr.className = 'border-t border-[#dce1e5]'

  // selection checkbox cell
  if (config.showCheckbox) {
    tr.appendChild(renderCheckboxCell(account, config.onCheckboxClick));
  }

  // name cell
  tr.appendChild(renderNameCell(account, config.onNameClick));

  // type cell
  tr.appendChild(renderTypeCell(account, config.onTypeChange));

  // subtype cell
  tr.appendChild(renderSubtypeCell(account, config.onSubtypeChange));

  // balance cell
  tr.appendChild(renderBalanceCell(account));

  // include toggle cell
  if (typeof config.onToggleChange === 'function') {
    tr.appendChild(renderToggleCell(account, config.onToggleChange));
  }

  // status cell
  if (account.isFailed) {
    tr.appendChild(renderStatusCell());
  }

  return tr;
}

function renderCheckboxCell(account, onCheckboxClick) {
  const tdCheck = document.createElement('td');
  tdCheck.className = "px-2 py-2 text-center"

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  const id = `account-checkbox-${account.id || account.modifiedName.replace(/\s+/g, '-')}`
  checkbox.id = id
  checkbox.name = id;
  checkbox.setAttribute('aria-label', `Select account: ${account.modifiedName}`);
  checkbox.className = 'w-5 h-5';
  checkbox.checked = account.isSelected;
  checkbox.addEventListener('change', () => {
    if (typeof onCheckboxClick === 'function') {
      onCheckboxClick(account.id, checkbox.checked);
    }
  });
  tdCheck.appendChild(checkbox);
  return tdCheck
}

function renderNameCell(account, onNameClick) {
  const tdName = document.createElement('td');
  tdName.className = 'px-2 py-2 max-w-[300px] truncate';
  tdName.textContent = account.modifiedName;
  if (!account.isProcessed) {
    tdName.classList.add('cursor-pointer');
    tdName.title = `Click to rename '${account.modifiedName}'`;
    tdName.addEventListener('click', () => {
      if (typeof onNameClick === 'function') {
        onNameClick(account, tdName);
      }
    });
  } else {
    tdName.classList.add('text-gray-400', 'cursor-default');
  }
  return tdName
}

function renderTypeCell(account, onTypeChange) {
  const tdType = document.createElement('td');
  tdType.className = 'px-2 py-2';
  const typeId = `type-select-${account.id || account.modifiedName.replace(/\s+/g, '-')}`;
  const typeSelect = document.createElement('select');
  typeSelect.id = typeId;
  typeSelect.name = typeId;
  typeSelect.title = account.type.display
  typeSelect.className = 'border rounded px-2 py-1 w-full';
  typeSelect.disabled = account.isProcessed;
  if (account.isProcessed) typeSelect.classList.add('text-gray-300', 'cursor-default');
  else typeSelect.classList.add('cursor-pointer');
  
  monarchAccountTypes.data.forEach(type => {
    const opt = document.createElement('option');
    opt.value = type.typeDisplay;
    opt.textContent = type.typeDisplay;
    if (type.typeDisplay === account.type.display) opt.selected = true;
    typeSelect.appendChild(opt);
  });
  typeSelect.addEventListener('change', () => {
    if (typeof onTypeChange === 'function') {
      onTypeChange(account, typeSelect.value);
    }
  });
  tdType.appendChild(typeSelect);
  return tdType
}

function renderSubtypeCell(account, onSubtypeChange) {
  const tdSub = document.createElement('td');
  tdSub.className = 'px-2 py-2';
  const subtypeSelect = document.createElement('select');
  const subtypeId = `subtype-select-${account.id || account.modifiedName.replace(/\s+/g, '-')}`;
  subtypeSelect.id = subtypeId;
  subtypeSelect.name = subtypeId;
  subtypeSelect.className = 'border rounded px-2 py-1 w-full';
  subtypeSelect.disabled = account.isProcessed;
  if (account.isProcessed) subtypeSelect.classList.add('text-gray-300', 'cursor-default');
  else subtypeSelect.classList.add('cursor-pointer');
  const selectedType = account.type
  subtypeSelect.title = account.subtype.display
  const availableSubtypes = getAccountTypeByDisplayName(selectedType.display)?.subtypes || [];
  availableSubtypes.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub.display;
    opt.textContent = sub.display;
    if (sub.display === account.subtype.display) opt.selected = true;
    subtypeSelect.appendChild(opt);
  });
  subtypeSelect.addEventListener('change', () => {
    if (typeof onSubtypeChange === 'function') {
      onSubtypeChange(account, subtypeSelect.value);
    }
  });
  tdSub.appendChild(subtypeSelect);
  return tdSub
}

function renderBalanceCell(account) {
  const tdBal = document.createElement('td');
  tdBal.className = 'px-2 py-2 text-[#637988] cursor-default';
  tdBal.textContent = currencyFormatter.format(account.balance);
  tdBal.title = `Balance: ${currencyFormatter.format(account.balance)}`;
  if (account.isProcessed) tdBal.classList.add('text-gray-400');
  return tdBal
}

function renderToggleCell(account, onToggleChange) {
  const tdToggle = document.createElement('td');
  tdToggle.className = 'px-2 py-2 flex items-center gap-2';
  const btn = document.createElement('button');
  btn.classList.add('ui-button');
  btn.dataset.type = account.isIncluded ? 'primary' : 'secondary';
  btn.dataset.size = 'small';
  btn.textContent = account.isProcessed ? 'Processed' : (account.isIncluded ? 'Included' : 'Excluded');
  btn.disabled = account.isProcessed;
  btn.title = account.isProcessed ? 'This account has already been processed' : (account.isIncluded ? 'Click to exclude this account' : 'Click to include this account');
  btn.addEventListener('click', () => {
    if (typeof onToggleChange === 'function') {
      onToggleChange(account);
    }
  });
  tdToggle.appendChild(btn);
  return tdToggle
}

function renderStatusCell() {
  const errorIcon = document.createElement('span');
  errorIcon.className = 'text-red-600 text-xl cursor-default';
  errorIcon.innerHTML = '⚠️';
  errorIcon.title = 'Previously failed to process';
  return errorIcon
}
