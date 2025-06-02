import router from '../../router.js';

export default function initMethodSelectView() {
  const manualBtn = document.getElementById('manualImportBtn');
  const autoBtn = document.getElementById('autoImportBtn');

  manualBtn.addEventListener('click', () => {
    console.log("User selected Manual Import");
    router.navigate('manualImport');
  });

  autoBtn.addEventListener('click', () => {
    console.log("User selected Auto Import");
    router.navigate('autoImport');
  });
}
