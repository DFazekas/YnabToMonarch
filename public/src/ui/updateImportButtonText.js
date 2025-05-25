export default function updateImportButtonText() {
  const importButton = document.getElementById("importMappingsButton")
  const selects = document.querySelectorAll('.account-mapping select')
  let importCount = 0

  selects.forEach(select => {
    if (select.value !== '') {
      importCount++
    }
  })

  if (importCount > 0) {
    importButton.textContent = `Import (${importCount}) accounts into Monarch`
  } else {
    importButton.textContent = `Import into Monarch`
  }
}