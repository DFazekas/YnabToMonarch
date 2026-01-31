(() => {
  const FOOTER_TEMPLATE_PATH = '/static-data/footer.html';
  const root = document.querySelector('[data-layout-root]');
  if (!root) return;

  const navbarMount = root.querySelector('[data-navbar]');
  const footerMount = root.querySelector('[data-footer]');
  if (!navbarMount || !footerMount) return;

  const isSubpage = root.dataset.subpage === 'true';
  let layoutType = root.dataset.layoutType || 'document';
  const appLayoutRoutes = new Set(['/select-accounts']);
  if (appLayoutRoutes.has(window.location.pathname)) {
    layoutType = 'app';
    root.dataset.layoutType = layoutType;
  }

  const brandIcon = `
    <div class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#005B96] flex-shrink-0">
      <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
      </svg>
    </div>
  `;

  const navbarContent = `
    <header class="border-b border-[#f0f3f4] py-3 px-3 lg:px-8 bg-white sticky top-0 z-40">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          ${brandIcon}
          <h1 class="font-bold text-sm sm:text-base md:text-lg truncate">YNAB to Monarch Money</h1>
        </div>
        ${
          isSubpage
            ? '<a href="/" class="text-blue-600 hover:text-blue-800 text-sm font-medium">← Back to App</a>'
            : '<a href="https://buymeacoffee.com/fazekasdevh" target="_blank" rel="noopener noreferrer" class="flex-shrink-0 hidden xs:block"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" class="h-7 sm:h-8 md:h-10 w-auto"></a>'
        }
      </div>
    </header>
  `;

  navbarMount.outerHTML = navbarContent.trim();
  applyLayoutType(layoutType);

  window.setLayoutType = (nextType) => {
    layoutType = nextType || 'document';
    root.dataset.layoutType = layoutType;
    applyLayoutType(layoutType);
  };

  async function renderFooter() {
    try {
      const response = await fetch(FOOTER_TEMPLATE_PATH);
      if (!response.ok) {
        throw new Error(`Failed to load footer template: ${response.status}`);
      }

      const template = await response.text();
      footerMount.innerHTML = template.trim();
    } catch (error) {
      console.error('Footer render failed', error);
    }
  }

  function applyLayoutType(type) {
    if (type === 'document') {
      renderFooter().then(() => {
        footerMount.classList.remove('hidden');
      });
    } else {
      footerMount.classList.add('hidden');
    }
  }
})();
