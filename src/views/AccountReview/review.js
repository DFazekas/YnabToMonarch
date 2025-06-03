import state from '../../state.js';
import monarchAccountTypes from '../../../public/static-data/monarchAccountTypes.json';
import { navigate } from '../../router.js';

let reviewTableBody, importBtn, searchInput;
let currentFilter = 'all';
let searchQuery = '';
let filteredData = [];

export default function initAccountReviewView() {
  reviewTableBody = document.getElementById('reviewTableBody');
  importBtn = document.getElementById('importBtn');
  searchInput = document.getElementById('searchInput');

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
    state.selectedYnabAccounts.clear();
    renderTable();
  });

  document.getElementById('bulkIncludeBtn').addEventListener('click', () => {
    state.registerData.forEach(acc => {
      if (state.selectedYnabAccounts.has(acc.id)) acc.excluded = false;
    });
    renderTable();
  });

  document.getElementById('bulkExcludeBtn').addEventListener('click', () => {
    state.registerData.forEach(acc => {
      if (state.selectedYnabAccounts.has(acc.id)) acc.excluded = true;
    });
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
    navigate('upload');
  });

  renderTable();
}

function updateFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('bg-blue-500', 'text-white', 'bg-gray-100', 'text-gray-800');
    btn.classList.add('bg-gray-100', 'text-gray-800');
  });

  document.getElementById(`filter${capitalize(currentFilter)}`).classList.add('bg-blue-500', 'text-white');
  renderTable();
}

function renderTable() {
  reviewTableBody.innerHTML = '';

  // Filter data
  filteredData = state.registerData.filter(acc => {
    if (acc.transactionCount === 0) acc.excluded = true;
    if (currentFilter === 'included' && acc.excluded) return false;
    if (currentFilter === 'excluded' && !acc.excluded) return false;
    if (searchQuery && !acc.name.toLowerCase().includes(searchQuery)) return false;
    return true;
  });

  filteredData.forEach(account => {
    const row = document.createElement('tr');
    row.classList.add('border-t', 'border-[#dce1e5]');

    // Selection checkbox column
    const checkboxTd = document.createElement('td');
    checkboxTd.className = 'px-2 py-2 text-center';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'w-5 h-5';
    checkbox.checked = state.selectedYnabAccounts.has(account.id);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) state.selectedYnabAccounts.add(account.id);
      else state.selectedYnabAccounts.delete(account.id);
      console.log("State.SelectedYnabAccount:", state.selectedYnabAccounts)
      updateBulkBar();
      updateMasterCheckbox();
    });
    checkboxTd.appendChild(checkbox);
    row.appendChild(checkboxTd);

    // Account Name (clickable)
    const nameTd = document.createElement('td');
    nameTd.className = 'px-2 py-2 max-w-[300px] truncate cursor-pointer';
    nameTd.title = account.name;
    nameTd.textContent = account.name;
    nameTd.addEventListener('click', () => openNameEditor(account, nameTd));
    row.appendChild(nameTd);

    // Account Type dropdown
    const typeTd = document.createElement('td');
    typeTd.className = 'px-2 py-2';
    const typeSelect = document.createElement('select');
    typeSelect.className = 'border rounded px-2 py-1 w-full';
    monarchAccountTypes.data.forEach(type => {
      const opt = document.createElement('option');
      opt.value = type.typeName;
      opt.textContent = type.typeDisplay;
      if (type.typeName === account.type) opt.selected = true;
      typeSelect.appendChild(opt);
    });
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
    subtypeSelect.className = 'border rounded px-2 py-1 w-full';
    const selectedType = monarchAccountTypes.data.find(t => t.typeName === account.type);
    (selectedType?.subtypes || []).forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.name;
      opt.textContent = sub.display;
      if (sub.name === account.subtype) opt.selected = true;
      subtypeSelect.appendChild(opt);
    });
    subtypeSelect.addEventListener('change', () => {
      account.subtype = subtypeSelect.value;
    });
    subtypeTd.appendChild(subtypeSelect);
    row.appendChild(subtypeTd);

    // Transaction count
    const txTd = document.createElement('td');
    txTd.className = 'px-2 py-2 text-center';
    txTd.textContent = account.transactionCount;
    row.appendChild(txTd);

    // Balance
    const balanceTd = document.createElement('td');
    balanceTd.className = 'px-2 py-2 text-[#637988]';
    const formattedBalance = Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    balanceTd.textContent = (account.balance < 0 ? '-$' : '$') + formattedBalance;
    row.appendChild(balanceTd);

    // Include toggle button
    const includeTd = document.createElement('td');
    includeTd.className = 'px-2 py-2';
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'px-2 py-2 rounded font-bold text-sm';
    toggleBtn.textContent = account.excluded ? 'Excluded' : 'Included';
    toggleBtn.classList.add(account.excluded ? 'bg-gray-300' : 'bg-green-500', 'text-white');
    toggleBtn.addEventListener('click', () => {
      account.excluded = !account.excluded;
      renderTable();
    });
    includeTd.appendChild(toggleBtn);
    row.appendChild(includeTd);

    reviewTableBody.appendChild(row);
  });

  updateMasterCheckbox();
  updateBulkBar();

  const anyIncluded = state.registerData.some(acc => !acc.excluded);
  importBtn.disabled = !anyIncluded;
}

function masterCheckboxChange(e) {
  const checked = e.target.checked;
  if (checked) {
    filteredData.forEach(acc => state.selectedYnabAccounts.add(acc.id));
  } else {
    filteredData.forEach(acc => state.selectedYnabAccounts.delete(acc.id));
  }
  renderTable();
}

function updateMasterCheckbox() {
  const masterCheckbox = document.getElementById('masterCheckbox');
  const visible = filteredData;
  const allSelected = visible.every(acc => state.selectedYnabAccounts.has(acc.id));
  const anySelected = visible.some(acc => state.selectedYnabAccounts.has(acc.id));

  masterCheckbox.checked = allSelected;
  masterCheckbox.indeterminate = !allSelected && anySelected;
}

function updateBulkBar() {
  const bar = document.getElementById('bulkActionBar');
  const countSpan = document.getElementById('selectedCount');
  const count = state.selectedYnabAccounts.size;
  countSpan.textContent = count;
  if (count > 0) bar.classList.remove('hidden');
  else bar.classList.add('hidden');
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

  const selectedAccounts = state.registerData.filter(acc => state.selectedYnabAccounts.has(acc.id));

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
      if (!acc.originalYnabName) acc.originalYnabName = acc.name;  // preserve original on first rename
      acc.modifiedName = applyPattern(pattern, acc, i + indexStart);
      acc.name = acc.modifiedName;  // update displayed name
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

    const selectedAccounts = state.registerData.filter(acc => state.selectedYnabAccounts.has(acc.id));
    selectedAccounts.forEach(acc => {
      acc.type = typeValue;
      acc.subtype = subtypeValue || null;
    });

    modal.classList.add('hidden');
    renderTable();
  };
}
