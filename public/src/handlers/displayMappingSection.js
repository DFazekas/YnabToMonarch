import { state } from '../state.js';

export function initializeMappingSection() {
  console.group("initializeMappingSection");
  initializeStep1Section()
  initializeStep2Section()

  renderStep1()
  console.groupEnd("initializeMappingSection");
}

function renderMappingTable() {
  console.group("renderMappingTable");
  const mappingTableBody = document.querySelector("#mappingTable tbody");
  mappingTableBody.innerHTML = "";

  console.log("Selected YNAB accounts:", state.selectedYnabAccounts);

  state.selectedYnabAccounts.forEach((acc, idx) => {
    // auto-match suggestion
    const match = state.monarchAccounts.find(m =>
      m.displayName.toLowerCase().includes(acc.name.toLowerCase())
    );

    // allow typing or selecting; default to matched name or blank
    const defaultValue = match ? match.displayName : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="account-cell">${acc.name}</td>
      <td class="num-txn-cell">${acc.numTransactions} ${acc.numTransactions === 1 ? "Transaction" : "Transactions"}</td>
      <td>
        <input type="text" class="override" list="monarchList" placeholder="Type or select account" value="${defaultValue}">
      </td>
      <td class="remove-cell">
        <button type="button" class="remove-account" title="Remove this account">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5-3h4a2 2 0 0 1 2 2v0H8a2 2 0 0 1 2-2v0z"></path>
          </svg>
        </button>
      </td>
    `;
    mappingTableBody.appendChild(tr);

    // listen for changes
    tr.querySelector(".override").addEventListener("input", updateSummary);
    tr.querySelector(".remove-account").addEventListener("click", (e) => {
      e.preventDefault();
      state.selectedYnabAccounts.splice(idx, 1)
      renderMappingTable();
      updateSummary();
    });
  });

  console.groupEnd("renderMappingTable");
}

function updateStep1Button() {
  console.group("updateStep1Button");
  const toStep2Btn = document.getElementById("toStep2");
  const checkedCount = state.selectedYnabAccounts.length

  console.log("Checked accounts:", state.selectedYnabAccounts);

  if (checkedCount > 0) {
    toStep2Btn.disabled = false
    toStep2Btn.textContent = `Import ${checkedCount} ${checkedCount === 1 ? "account" : "accounts"} →`
  } else {
    toStep2Btn.disabled = true
    toStep2Btn.textContent = `Import →`
  }
  console.groupEnd("updateStep1Button");
}

function updateSummary() {
  console.group("updateSummary");
  const summaryBox = document.getElementById("summary");
  const mappingTableBody = document.querySelector("#mappingTable tbody");

  let useExisting = 0, createNew = 0;
  mappingTableBody.querySelectorAll("tr").forEach((tr, idx) => {
    // If empty, create a new account with the YNAB account name
    let name = tr.querySelector(".override").value.trim()
    if (!name) {
      name = state.selectedYnabAccounts[idx].name;
    }

    // Decide: Existing import vs new creation
    const exists = state.monarchAccounts.some(m => m.displayName === name)
    if (exists) {
      useExisting++
    } else {
      createNew++
    }
  });

  summaryBox.textContent = `
    ${state.selectedYnabAccounts.length} accounts selected →
      ${useExisting} will import into existing,
      ${createNew} will create new accounts.
  `.replace(/\s+/g, " ").trim();

  console.groupEnd("updateSummary");
}

function renderFilteredYnabAccounts() {
  console.group("renderFilteredYnabAccounts");
  const ynabList = document.getElementById("ynabList");
  ynabList.innerHTML = "";

  console.log("Filtered ynab accounts:", state.filteredYnabAccounts);

  state.filteredYnabAccounts.forEach(account => {
    const li = document.createElement("li");
    const id = `chk-${account.name.replace(/\s+/g, "_")}`;
    li.innerHTML = `
      <label for="${id}">
        <input type="checkbox" id="${id}" data-name="${account.name}">
        ${account.name} (${account.numTransactions} ${account.numTransactions === 1 ? "transaction" : "transactions"})
      </label>
    `;
    ynabList.appendChild(li);

    const cb = li.querySelector("input[type=checkbox]")
    cb.checked = state.selectedYnabAccounts.some(a => a.name === account.name)
    cb.addEventListener("change", (e) => handleYnabAccountImportSelection(e, account))
  });

  console.groupEnd("renderFilteredYnabAccounts");
}

function setupYnabAccountFilterControl() {
  console.group("setupYnabAccountFilterControl");
  const ynabSearch = document.getElementById("ynabSearch");
  const term = ynabSearch.value.toLowerCase();

  console.log("Filtered ynab accounts (BEFORE):", state.filteredYnabAccounts);
  // Filter YNAB accounts based on the search term
  state.filteredYnabAccounts = Object.entries(state.ynabAccounts)
    .filter(([name, _]) => name.toLowerCase().includes(term))
    .map(([name, transactions]) => ({ name, numTransactions: transactions.length }))
  console.log("Filtered ynab accounts (AFTER):", state.filteredYnabAccounts);

  renderFilteredYnabAccounts()
  updateStep1Button();
  console.groupEnd("setupYnabAccountFilterControl");
}

function handleYnabAccountImportSelection(event, account) {
  console.group("handleYnabAccountImportSelection");
  if (event.target.checked) {
    if (!state.selectedYnabAccounts.some(a => a.name === account.name)) {
      state.selectedYnabAccounts.push(account);
    }
  } else {
    state.selectedYnabAccounts = state.selectedYnabAccounts.filter(a => a.name !== account.name);
  }
  console.log("State:", state)
  updateStep1Button()
  console.groupEnd("handleYnabAccountImportSelection");
}

function handleFilterInput(event) {
  console.group("handleFilterInput");
  const term = event.target.value.toLowerCase();
  state.filteredYnabAccounts = Object.entries(state.ynabAccounts)
    .filter(([name, _]) => name.toLowerCase().includes(term))
    .map(([name, transactions]) => ({ name, numTransactions: transactions.length }))
  renderFilteredYnabAccounts()
  console.groupEnd("handleFilterInput");
}

function initializeStep1Section() {
  console.log("Initializing Step 1 section...");
  // Set up the YNAB account filter searchbar
  const ynabSearch = document.getElementById("ynabSearch");
  ynabSearch.addEventListener("input", (e) => handleFilterInput(e));

  // Set up the "Select All" button
  const selectAllFiltered = document.getElementById("selectAllFiltered");
  selectAllFiltered.addEventListener("click", (event) => {
    event.preventDefault();
    ynabList.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = true);
    state.selectedYnabAccounts = [...state.filteredYnabAccounts];
    updateStep1Button();
  });

  // Set up the "Deselect All" button
  const deselectAll = document.getElementById("deselectAll");
  deselectAll.addEventListener("click", (event) => {
    event.preventDefault();
    ynabList.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = false);
    state.selectedYnabAccounts = [];
    updateStep1Button();
  });

  // Populate monarch datalist
  const monarchDatalist = document.getElementById("monarchList");
  state.monarchAccounts.forEach(acc => {
    const defaultOption = document.createElement("option");
    defaultOption.value = "Create new account";
    monarchDatalist.appendChild(defaultOption);

    const opt = document.createElement("option");
    opt.value = acc.displayName;
    monarchDatalist.appendChild(opt);
  });

  // Move to Step 2
  const toStep2 = document.getElementById("toStep2");
  toStep2.addEventListener("click", (event) => {
    event.preventDefault();
    state.selectedYnabAccounts = Array.from(ynabList.querySelectorAll("input:checked"))
      .map(cb => state.filteredYnabAccounts.find(a => a.name === cb.dataset.name));
    renderStep2();
  });
}

function initializeStep2Section() {
  console.log("Initializing Step 2 section...");
  const backBtn = document.getElementById("backToStep1");
  const bulkAction = document.getElementById("bulkAction");
  const bulkExisting = document.getElementById("bulkExisting");
  const applyBulk = document.getElementById("applyBulk");
  const mappingTableBody = document.querySelector("#mappingTable tbody");
  const confirmImport = document.getElementById("confirmImport");

  // Set up the "Back" button
  backBtn.addEventListener("click", (event) => {
    event.preventDefault()
    renderStep1();
  });

  // Set up the "Bulk Action" dropdown
  bulkAction.addEventListener("change", () => {
    bulkExisting.classList.toggle("hidden", bulkAction.value !== "import_existing");
  });

  // Set up the "Apply Bulk Action" button
  applyBulk.addEventListener("click", (event) => {
    event.preventDefault();
    const action = bulkAction.value;
    const existingName = bulkExisting.value.trim();
    mappingTableBody.querySelectorAll("tr").forEach((tr, i) => {
      const override = tr.querySelector(".override");
      const skip = tr.querySelector(".skip");
      skip.checked = false;

      if (action === "create_new") {
        override.value = state.selectedYnabAccounts[i].name;
      } else if (action === "import_existing" && existingName) {
        override.value = existingName;
      }
    });
    updateSummary();
  });

  // Set up the "Confirm Import" button
  confirmImport.addEventListener("click", (event) => {
    event.preventDefault();
    const payload = state.selectedYnabAccounts.map((acc, i) => {
      const row = mappingTableBody.rows[i];
      const suggestion = row.querySelector(".suggestion").textContent;
      const override = row.querySelector(".override").value.trim();
      const skip = row.querySelector(".skip").checked;

      if (skip) return { ynab: acc.name, action: "skip" };

      if (override) {
        // decide new vs existing
        const exist = state.monarchAccounts.find(m => m.displayName === override);
        return exist
          ? { ynab: acc.name, action: "import", monarchId: exist.id }
          : { ynab: acc.name, action: "create_new", name: override };
      } else {
        // follow suggestion
        if (suggestion === "Create new account")
          return { ynab: acc.name, action: "create_new", name: acc.name };
        else {
          const exist = monarchAccounts.find(m => m.displayName === suggestion);
          return { ynab: acc.name, action: "import", monarchId: exist.id };
        }
      }
    });

    console.log("Import payload:", payload);
    alert("See console for the final import payload.");
  });
}

export function renderStep1() {
  console.group("renderStep1");
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  step2.classList.add("hidden");
  step1.classList.remove("hidden");

  setupYnabAccountFilterControl()
  console.groupEnd("renderStep1");
}

function renderStep2() {
  console.group("renderStep2");
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  step1.classList.add("hidden");
  step2.classList.remove("hidden");

  renderMappingTable();
  updateSummary();
  console.groupEnd("renderStep2");
}
