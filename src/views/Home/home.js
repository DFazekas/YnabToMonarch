import { navigate } from '../../router.js';
import { openModal, closeModal } from '../../components/modal.js';
import { renderButtons } from '../../components/button.js';

export default function initUploadView() {
  const getStartedButton = document.getElementById('getStartedButton');
  const privacyInfoModalButton = document.getElementById('privacyInfoModalButton');
  const migrationInfoModalButton = document.getElementById('migrationInfoModalButton');
  const closePrivacyInfoModal = document.getElementById('closePrivacyInfoModal');
  const closeMigrationInfoModal = document.getElementById('closeMigrationInfoModal');

  renderButtons();

  getStartedButton?.addEventListener('click', (event) => {
    event.preventDefault();
    navigate('/upload');
  });

  privacyInfoModalButton?.addEventListener('click', () => openModal('privacyInfoModal'));
  closePrivacyInfoModal?.addEventListener('click', () => closeModal('privacyInfoModal'));
  migrationInfoModalButton?.addEventListener('click', () => openModal('migrationInfoModal'));
  closeMigrationInfoModal?.addEventListener('click', () => closeModal('migrationInfoModal'));
}
