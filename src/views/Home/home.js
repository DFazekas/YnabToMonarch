import { navigate } from '../../router.js';
import { openModal, closeModal } from '../../components/modal.js';
import { renderPageLayout } from '../../components/pageLayout.js';

export default function initUploadView() {
  const getStartedButton = document.getElementById('getStartedButton');
  const privacyInfoModalButton = document.getElementById('privacyInfoModalButton');
  const migrationInfoModalButton = document.getElementById('migrationInfoModalButton');
  const closePrivacyInfoModal = document.getElementById('closePrivacyInfoModal');
  const closeMigrationInfoModal = document.getElementById('closeMigrationInfoModal');

  renderPageLayout({
    header: {
      title: 'YNAB to Monarch Migration',
      description: 'Moving your financial data from YNAB to Monarch made simple and secure. Choose the method that works best for you, and we\'ll guide you through each step.',
      containerId: 'pageHeader'
    }
  });

  getStartedButton?.addEventListener('click', (event) => {
    event.preventDefault();
    navigate('/upload');
  });

  privacyInfoModalButton?.addEventListener('click', () => openModal('privacyInfoModal'));
  closePrivacyInfoModal?.addEventListener('click', () => closeModal('privacyInfoModal'));
  migrationInfoModalButton?.addEventListener('click', () => openModal('migrationInfoModal'));
  closeMigrationInfoModal?.addEventListener('click', () => closeModal('migrationInfoModal'));
}
