import { state } from '../state.js';

export function displayMappingSection() {
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const ynabSearch = document.getElementById("ynabSearch");
  const ynabList = document.getElementById("ynabList");
  const selectAllFiltered = document.getElementById("selectAllFiltered");
  const deselectAll = document.getElementById("deselectAll");
  const toStep2 = document.getElementById("toStep2");
  const monarchDatalist = document.getElementById("monarchList");

  const bulkAction = document.getElementById("bulkAction");
  const bulkExisting = document.getElementById("bulkExisting");
  const applyBulk = document.getElementById("applyBulk");
  const mappingTableBody = document.querySelector("#mappingTable tbody");
  const confirmImport = document.getElementById("confirmImport");


  // Populate monarch datalist
  state.monarchAccounts.forEach(acc => {
    const opt = document.createElement("option");
    opt.value = acc.displayName;
    monarchDatalist.appendChild(opt);
  });


  // Bulk selects
  selectAllFiltered.addEventListener("click", (event) => {
    event.preventDefault();
    ynabList.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = true);
    state.selectedYnabAccounts = [...state.filteredYnabAccounts];
    updateStep1Button();
  });
  deselectAll.addEventListener("click", (event) => {
    event.preventDefault();
    ynabList.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = false);
    state.selectedYnabAccounts = [];
    updateStep1Button();
  });
  ynabSearch.addEventListener("input", () => renderYNABList());


  // Move to Step 2
  toStep2.addEventListener("click", (event) => {
    event.preventDefault();
    state.selectedYnabAccounts = Array.from(ynabList.querySelectorAll("input:checked"))
      .map(cb => state.filteredYnabAccounts.find(a => a.name === cb.dataset.name));
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
    renderMappingTable();
    updateSummary();
  });


  // Bulk action UI
  bulkAction.addEventListener("change", () => {
    bulkExisting.classList.toggle("hidden", bulkAction.value !== "import_existing");
  });
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


  // Confirm & “import”
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

  renderYNABList()
}


function renderMappingTable() {
  const mappingTableBody = document.querySelector("#mappingTable tbody");
  mappingTableBody.innerHTML = "";
  state.selectedYnabAccounts.forEach(acc => {
    // auto-match suggestion
    const match = state.monarchAccounts.find(m =>
      m.displayName.toLowerCase().includes(acc.name.toLowerCase())
    );
    const suggestion = match
      ? match.displayName
      : "Create new account";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="account-cell">
        <span class="account-name">${acc.name}</span>
        <span class="txn-count">${acc.numTransactions} ${acc.numTransactions === 1 ? "Transaction" : "Transactions"}</span>
      </td>
      <td class="suggestion">${suggestion}</td>
      <td>
        <input type="text" class="override" list="monarchList" placeholder="—">
      </td>
      <td><input type="checkbox" class="skip"></td>
    `;
    mappingTableBody.appendChild(tr);

    // listen for changes
    tr.querySelector(".override").addEventListener("input", updateSummary);
    tr.querySelector(".skip").addEventListener("change", updateSummary);
  });
}


function renderYNABList() {
  const ynabSearch = document.getElementById("ynabSearch");
  const term = ynabSearch.value.toLowerCase();

  console.log("Term:", term);
  console.log("YNAB accounts:", state.ynabAccounts);
  console.log("(BEFORE) Filtered YNAB accounts:", state.filteredYnabAccounts);

  state.filteredYnabAccounts = Object.entries(state.ynabAccounts)
    .filter(([name, _]) => name.toLowerCase().includes(term))
    .map(([name, transactions]) => ({ name, numTransactions: transactions.length }))
  console.log("(AFTER) Filtered YNAB accounts:", state.filteredYnabAccounts);

  const ynabList = document.getElementById("ynabList");
  ynabList.innerHTML = "";

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
    cb.addEventListener("change", (e) => {
      if (e.target.checked) {
        if (!state.selectedYnabAccounts.some(a => a.name === account.name)) {
          state.selectedYnabAccounts.push(account);
        }
      } else {
        state.selectedYnabAccounts = state.selectedYnabAccounts.filter(a => a.name !== account.name);
      }
      console.dir(state)
      updateStep1Button()
    })
  });

  updateStep1Button();
}


function updateStep1Button() {
  const toStep2Btn = document.getElementById("toStep2");
  const checkedCount = state.selectedYnabAccounts.length

  if (checkedCount > 0) {
    toStep2Btn.disabled = false
    toStep2Btn.textContent = `Import ${checkedCount} ${checkedCount === 1 ? "account" : "accounts"} →`
  } else {
    toStep2Btn.disabled = true
    toStep2Btn.textContent = `Import →`
  }
}


function updateSummary() {
  const summaryBox = document.getElementById("summary");
  const mappingTableBody = document.querySelector("#mappingTable tbody");

  let skip = 0, useExisting = 0, createNew = 0;
  mappingTableBody.querySelectorAll("tr").forEach(tr => {
    const suggestion = tr.querySelector(".suggestion").textContent;
    const override = tr.querySelector(".override").value.trim();
    const isSkip = tr.querySelector(".skip").checked;

    if (isSkip) {
      skip++;
    } else if (override) {
      // if override matches an existing Monarch account
      const exist = state.monarchAccounts.some(m => m.displayName === override);
      if (exist) useExisting++; else createNew++;
    } else {
      // no override → follow suggestion
      if (suggestion === "Create new account") createNew++;
      else useExisting++;
    }
  });

  summaryBox.textContent = `
    ${state.selectedYnabAccounts.length} accounts selected →
      ${useExisting} will import into existing,
      ${createNew} will create new accounts,
      ${skip} will be skipped.
  `.replace(/\s+/g, " ").trim();
}
