import { navigate } from './router.js';
import './components/button.js';

// Initial app load
window.addEventListener('DOMContentLoaded', () => {
  // initial view
  navigate('bulkDeleteView');

  // navbar handlers
  document.getElementById('navUpload').addEventListener('click', () => navigate('uploadView'));
  document.getElementById('navManage').addEventListener('click', () => navigate('bulkDeleteView'));
});
