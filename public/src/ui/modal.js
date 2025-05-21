import { bind } from "../utils/dom.js"

export function openModal(modalId, event) {
  event.preventDefault();
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
  } else {
    console.warn(`openModal: No modal found with id "${modalId}"`);
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  } else {
    console.warn(`closeModal: No modal found with id "${modalId}"`);
  }
}

export function initModalControls() {
  // Opening triggers
  bind('#preDownloadWhatIsAutoImporter', 'click', event => openModal('whatIsAutoImporterModal', event));
  bind('#postDownloadWhatIsAutoImporter', 'click', event => openModal('whatIsAutoImporterModal', event));
  bind('#howToFindRegisterFile', 'click', event => openModal('whereToFindRegisterModal', event));
  bind('#preDownloadHowToImportLink', 'click', event => openModal('howToManuallyImportModal', event));
  bind('#postDownloadHowToImportLink', 'click', event => openModal('howToManuallyImportModal', event));

  // Close buttons
  document.querySelectorAll('.modal .close').forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal?.id) {
        closeModal(modal.id);
      }
    });
  });

  // Click outside to close
  window.addEventListener('click', event => {
    document.querySelectorAll('.modal').forEach(modal => {
      if (event.target === modal && modal.id) {
        closeModal(modal.id);
      }
    });
  });
}
