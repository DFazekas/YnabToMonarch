import { state } from '../state.js';
import { openModal, closeModal } from '../ui/modal.js';

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
    const defaultSelect = match ? match.displayName : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" class="row-select"></td>
      <td class="account-cell">${acc.name}</td>
      <td class="num-txn-cell">${acc.numTransactions} ${acc.numTransactions === 1 ? "Transaction" : "Transactions"}</td>
      <td>
        <select class="account-select" data-default="${defaultSelect}" title="${defaultSelect || "Create new account"}">
          <option value="">Create new account</option>
          ${state.monarchAccounts.map(m => `
              <option value="${m.displayName}" ${m.displayName === defaultSelect ? "selected" : ""}>
                ${m.displayName}
              </option>
            `).join("")}
        </select>
        <input 
          type="text"
          title="${acc.name}" 
          class="new-account-name ${defaultSelect ? "hidden" : ""}" 
          placeholder="New account name" 
          value="${acc.name}"
        >
      </td>
      <td class="remove-cell">
        <button type="button" class="remove-account" title="Remove this account from import">
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

    const rowSelect = tr.querySelector("input.row-select");
    const select = tr.querySelector("select.account-select");
    const newInput = tr.querySelector("input.new-account-name");
    const table = document.getElementById("mappingTable");

    // toggle row highlight
    rowSelect.addEventListener("change", () => {
      tr.classList.toggle("selected", rowSelect.checked);
    });

    // make row clickable (toggle checkbox) unless clicking controls
    tr.addEventListener("click", e => {
      if (
        e.target.closest(".remove-account") ||
        e.target.closest("select.account-select") ||
        e.target.closest("input.new-account-name") ||
        e.target === rowSelect
      ) return;
      rowSelect.checked = !rowSelect.checked;
      rowSelect.dispatchEvent(new Event("change"));
      rowSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });

    // mapping change handler
    select.addEventListener("change", () => {
      newInput.classList.toggle("hidden", !!select.value)
      select.title = select.value || "Create new account";
      updateSummary();
    });
    select.dispatchEvent(new Event("change"));

    tr.querySelector(".remove-account").addEventListener("click", (e) => {
      e.preventDefault();
      // Capture which rows (by account name) are currently selected, excluding the one being removed
      const selectedNames = Array.from(
        table.querySelectorAll("tbody .row-select:checked")
      )
        .map(cb => cb.closest("tr").querySelector(".account-cell").textContent)
        .filter(name => name !== acc.name);

      // Remove the clicked account from state
      state.selectedYnabAccounts.splice(idx, 1);

      // Re‐render the table & summary
      renderMappingTable();
      updateSummary();

      // 4) Re‐apply the remaining selections so the bulk bar updates
      Array.from(table.querySelectorAll("tbody tr")).forEach(row => {
        const name = row.querySelector(".account-cell").textContent;
        if (selectedNames.includes(name)) {
          const cb = row.querySelector(".row-select");
          cb.checked = true;
          cb.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
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
  let useExisting = 0, createNew = 0;

  document
    .querySelectorAll("#mappingTable tbody tr")
    .forEach(tr => {
      const select = tr.querySelector("select.account-select");
      if (select.value) useExisting++;
      else createNew++;
    });

  summaryBox.textContent =
    `${state.selectedYnabAccounts.length} accounts selected → ` +
    `${useExisting} will import into existing, ` +
    `${createNew} will create new accounts.`;

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
  const mappingTableBody = document.querySelector("#mappingTable tbody");
  const confirmImport = document.getElementById("confirmImport");
  const bar = document.getElementById("bulkActionBar");
  const cbClose = document.getElementById("bulkClose");
  const cbCreate = document.getElementById("bulkCreate");
  const cbReset = document.getElementById("bulkReset");
  const cbRename = document.getElementById("bulkRename");
  const cbRemove = document.getElementById("bulkRemove");
  const table = document.querySelector("#mappingTable");
  const selectAllRows = document.getElementById("selectAllRows");

  // grab our modal controls
  const renameModal = document.getElementById("bulkRenameModal");
  const patternInput = renameModal.querySelector("#bulkRenamePattern");
  const applyBtn = renameModal.querySelector("#bulkRenameApply");
  const cancelBtn = renameModal.querySelector("#bulkRenameCancel");

  // Helper to update the selectAllRows checkbox state
  function updateSelectAllCheckbox() {
    console.group("updateSelectAllCheckbox");
    const checkboxes = table.querySelectorAll("tbody .row-select");
    const checked = table.querySelectorAll("tbody .row-select:checked");

    console.log("Checkboxes:", checkboxes.length, "Checked:", checked.length);

    if (checked.length === 0) {
      selectAllRows.checked = false;
      selectAllRows.indeterminate = false;
    } else if (checked.length === checkboxes.length) {
      selectAllRows.checked = true;
      selectAllRows.indeterminate = false;
    } else {
      selectAllRows.checked = false;
      selectAllRows.indeterminate = true;
    }
    console.groupEnd("updateSelectAllCheckbox");
  }

  // Call after rendering table to sync state
  function afterRenderTable() {
    console.group("afterRenderTable");
    updateSelectAllCheckbox();
    console.groupEnd("afterRenderTable");
  }

  // Patch renderMappingTable to call afterRenderTable at the end
  const origRenderMappingTable = renderMappingTable;
  renderMappingTable = function () {
    origRenderMappingTable.apply(this, arguments);
    afterRenderTable();
  };

  table.addEventListener("change", e => {
    if (!e.target.classList.contains("row-select")) return;

    updateSelectAllCheckbox()

    // Update the bulk action bar visibility and content
    const selected = document.querySelectorAll(".row-select:checked");
    if (selected.length) {
      bar.classList.remove("hidden");
      cbClose.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span class="label"> ${selected.length} Account${selected.length > 1 ? "s" : ""}</span>
    `;
    } else {
      bar.classList.add("hidden");
    }
  });

  // Listen for clicks on the selectAllRows checkbox
  selectAllRows.addEventListener("click", (event) => {
    console.group("selectAllRows click");
    console.log("event.target:", event.target);

    const checkboxes = table.querySelectorAll("tbody .row-select");
    const checked = table.querySelectorAll("tbody .row-select:checked");

    console.log("Checkboxes:", checkboxes.length, "Checked:", checked.length, "Indeterminate:", selectAllRows.indeterminate, "Checked state:", selectAllRows.checked);

    if (checked.length === checkboxes.length || checked.length > 0) {
      checkboxes.forEach(cb => { cb.checked = false; cb.dispatchEvent(new Event("change", { bubbles: true })); });
    } else {
      checkboxes.forEach(cb => { cb.checked = true; cb.dispatchEvent(new Event("change", { bubbles: true })); });
    }
    updateSelectAllCheckbox();
    console.groupEnd("selectAllRows click");
  });

  cbClose.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelectorAll(".row-select").forEach(cb => cb.checked = false);
    bar.classList.add("hidden");
  });

  cbCreate.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelectorAll(".row-select:checked").forEach(trCb => {
      const tr = trCb.closest("tr");
      tr.querySelector("select.account-select").value = "";
      const inp = tr.querySelector("input.new-account-name");
      inp.value = tr.querySelector(".account-cell").textContent;
      inp.classList.remove("hidden");
    });
    updateSummary();
  });

  cbReset.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelectorAll(".row-select:checked").forEach(trCb => {
      const tr = trCb.closest("tr");
      const sel = tr.querySelector("select.account-select");
      sel.value = sel.dataset.default;

      const newInput = tr.querySelector("input.new-account-name");
      const orig = tr.querySelector(".account-cell").textContent;
      newInput.value = orig;
      newInput.title = orig;

      sel.dispatchEvent(new Event("change"));
    });
    updateSummary();
  });

  cbRename.addEventListener("click", (event) => {
    event.preventDefault();
    patternInput.value = "YNAB - {{origName}}";
    openModal("bulkRenameModal", event);
  });

  // When user clicks Apply in modal
  applyBtn.addEventListener("click", () => {
    const pattern = patternInput.value.trim();
    closeModal("bulkRenameModal");
    if (!pattern) return;
    let counter = 0;
    document.querySelectorAll(".row-select:checked").forEach(trCb => {
      const tr = trCb.closest("tr");
      const sel = tr.querySelector("select.account-select");
      // only rename the “new” rows
      if (!sel.value) {
        const orig = tr.querySelector(".account-cell").textContent;
        const newName = pattern
          .replace(/{{origName}}/g, orig)
          .replace(/{{index}}/g, ++counter);
        tr.querySelector("input.new-account-name").value = newName;
        tr.querySelector("input.new-account-name").title = newName
      }
    });
    updateSummary();
  });

  // Cancel just closes
  cancelBtn.addEventListener("click", () => {
    closeModal("bulkRenameModal");
  });

  // make the modal “×” button also close
  renameModal.querySelector(".close").addEventListener("click", () => {
    closeModal("bulkRenameModal");
  });

  cbRemove.addEventListener("click", (event) => {
    event.preventDefault();
    const rows = Array.from(document.querySelectorAll(".row-select:checked"))
      .map(cb => cb.closest("tr"));
    rows.reverse().forEach(tr => {
      const idx = Array.from(table.tBodies[0].rows).indexOf(tr);
      state.selectedYnabAccounts.splice(idx, 1);
    });
    renderMappingTable();
    updateSummary();
    bar.classList.add("hidden");
  });

  // Set up the "Back" button
  backBtn.addEventListener("click", (event) => {
    event.preventDefault()
    renderStep1();
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
