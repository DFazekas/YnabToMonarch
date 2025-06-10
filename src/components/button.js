export function enhanceButtons() {
  document.querySelectorAll('.ui-button').forEach(button => {
    const type = button.dataset.type || 'primary';
    const size = button.dataset.size || 'medium';
    const fixedWidth = button.dataset.fixedWidth;
    const fullWidth = button.hasAttribute('data-fullwidth');
    const isDisabled = button.hasAttribute('disabled') || button.disabled;

    button.className = 'ui-button';
    button.type = 'button';

    button.classList.add('font-semibold', 'rounded-lg', 'transition');
    button.style.transform = 'none';

    // Apply base size classes
    switch (size) {
      case 'small':
        button.classList.add('px-3', 'py-1.5', 'text-sm');
        break;
      case 'large':
        button.classList.add('px-6', 'py-3', 'text-base');
        break;
      case 'medium':
      default:
        button.classList.add('px-5', 'py-2', 'text-sm');
        break;
    }

    if (isDisabled) {
      button.setAttribute('disabled', '');
      button.classList.add('opacity-50', 'cursor-not-allowed');
      button.style.boxShadow = 'none';
    } else {
      button.removeAttribute('disabled');
      button.classList.add('cursor-pointer');
    }

    switch (type) {
      case 'primary':
        button.classList.add('bg-[#1993e5]', 'text-white', 'border', 'border-[#1993e5]');
        if (!isDisabled) button.classList.add('hover:bg-blue-600');
        break;
      case 'secondary':
        button.classList.add('bg-white', 'text-[#111518]', 'border', 'border-gray-300');
        if (!isDisabled) button.classList.add('hover:bg-gray-100');
        break;
      case 'text':
        button.classList.remove('px-3', 'px-5', 'px-6', 'py-1.5', 'py-2', 'py-3');
        button.classList.add('bg-transparent', 'text-blue-600');
        if (!isDisabled) button.classList.add('hover:underline');
        break;
      case 'danger':
        button.classList.add('bg-red-500', 'text-white');
        if (!isDisabled) button.classList.add('hover:bg-red-600');
        break;
    }

    if (fixedWidth) {
      button.style.width = `${fixedWidth}px`;
    }

    if (fullWidth) {
      button.classList.add('w-full');
    }
  });
}
