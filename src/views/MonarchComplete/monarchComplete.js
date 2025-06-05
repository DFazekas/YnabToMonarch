import { navigate } from '../../router.js';

export default function initAutoImportCompleteView() {
  const restartBtn = document.getElementById('restartBtn');

  restartBtn.addEventListener('click', () => {
    // For now, send back to starting page, or wherever your flow restarts
    navigate('upload');
  });
}
