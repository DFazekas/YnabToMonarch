import { createFaqCard } from '../../components/FaqCard.js';
import { renderPageLayout } from '../../components/pageLayout.js';

const FAQ_ITEMS = [
  {
    question: 'Does this tool create bank-connected accounts in Monarch Money?',
    body: `<p>No, not directly; this tool can only create <strong>manual</strong> accounts in Monarch Money. However, there are two solutions:
            <br/><br/>(1) Migrate data to an <strong>existing</strong> bank-connected account.
            <br/><br/>(2) Use this tool to create a new manual account, then in Monarch Money, use their <strong>Transfer</strong> tool to migrate data from the manual account to the bank-connected account.</p>
          <p class="text-xs text-gray-600">Follow Monarch Money's official guide on their Transfer tool to migrate data between accounts: <a href="https://help.monarch.com/hc/en-us/articles/14329385694484-Transfer-Balance-and-or-Transaction-History-to-Another-Account" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">https://help.monarch.com/hc/en-us/articles/14329385694484-Transfer-Balance-and-or-Transaction-History-to-Another-Account</a></p>`
  },
  {
    question: 'Is my data secure and private?',
    body: `<p>Yes, your data is completely secure. We use end-to-end encryption and never store your financial information on our servers. Your data is processed temporarily during migration and then permanently deleted.</p>
          <p class="text-xs text-gray-600">We comply with industry-standard security protocols and are committed to protecting your privacy.</p>`
  },
  {
    question: 'How long does the migration process take?',
    body: `<p>The migration typically takes 5-15 minutes depending on the amount of data in your YNAB account. Most users complete the process in under 10 minutes.</p>
          <p class="text-xs text-gray-600">The actual data transfer is instantaneous; the time is mostly spent reviewing and customizing your accounts.</p>`
  },
  {
    question: 'Will my transaction history be preserved?',
    body: `<p>Yes, all your transaction history, payees, categories, and account information are preserved during migration. You can choose to import historical data or start fresh.</p>
          <p class="text-xs text-gray-600">You have full control over which data to migrate during the review step.</p>`
  },
  {
    question: 'Can I migrate only specific accounts?',
    body: `<p>Absolutely! During the review step, you can select which accounts to migrate and even rename them for Monarch Money. Unselected accounts will be ignored.</p>
          <p class="text-xs text-gray-600">This gives you complete flexibility to customize your migration to match your needs.</p>`
  },
  {
    question: 'What if I encounter an error during migration?',
    body: `<p>If you encounter an error, try the following: refresh the page, clear your browser cache, or use a different browser. Most errors are temporary and resolve on retry.</p>
          <p class="text-xs text-gray-600">If the problem persists, contact our support team for assistance. Your data is always safe and you can restart at any time.</p>`
  }
];

export default function initFaqView() {
  const layoutElement = document.getElementById('pageLayout');
  const backText = layoutElement?.dataset.backText || 'Back to App';

  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: false,
      backText
    },
    header: {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions about the YNAB to Monarch migration process.',
      containerId: 'pageHeader'
    }
  });

  const faqContainer = document.querySelector('#faqContainer');

  if (!faqContainer) {
    return;
  }

  faqContainer.innerHTML = '';

  FAQ_ITEMS.forEach((item, index) => {
    faqContainer.appendChild(createFaqCard(item, index));
  });

  faqContainer.querySelectorAll('.faq-toggle').forEach(button => {
    button.addEventListener('click', () => {
      toggleFaqItem(button);
    });
  });
}

function toggleFaqItem(button) {
  const index = button.dataset.index;
  const content = document.querySelector(`.faq-content[data-index="${index}"]`);
  const icon = button.querySelector('.faq-icon');
  const item = button.closest('.faq-item');

  if (!content || !icon || !item) {
    return;
  }

  const isOpen = content.classList.contains('open');

  if (isOpen) {
    content.classList.remove('open');
    content.classList.add('hidden');
    content.style.maxHeight = '0';
    icon.style.transform = 'rotate(0deg)';
    item.classList.remove('border-blue-300', 'bg-blue-50');
  } else {
    content.classList.remove('hidden');
    content.classList.add('open');
    const innerContent = content.querySelector('div');
    const scrollHeight = innerContent ? innerContent.scrollHeight : 0;
    content.style.maxHeight = scrollHeight + 16 + 'px';
    icon.style.transform = 'rotate(180deg)';
    item.classList.add('border-blue-300', 'bg-blue-50');
  }
}
