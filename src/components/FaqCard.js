export function createFaqCard({ question, body }, index) {
  const card = document.createElement('div');
  card.className = 'faq-item w-full border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors';

  const button = document.createElement('button');
  button.className = 'faq-toggle w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left';
  button.dataset.index = String(index);
  button.innerHTML = `
    <span class="font-semibold text-gray-900">${question}</span>
    <svg class="faq-icon w-5 h-5 text-gray-500 flex-shrink-0 ml-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
  `;
  card.appendChild(button);

  const content = document.createElement('div');
  content.className = 'faq-content hidden overflow-hidden max-h-0 transition-all duration-300';
  content.dataset.index = String(index);
  content.innerHTML = `
    <div class="px-5 py-4 bg-gray-50 border-t border-gray-200 text-gray-700 text-sm space-y-2">
      ${body}
    </div>
  `;
  card.appendChild(content);

  return card;
}
