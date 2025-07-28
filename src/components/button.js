/**
 * Applies consistent styling and interaction behavior to all elements
 * with the `.ui-button` class based on their data attributes.
 *
 * Supported data attributes:
 * - `data-type`: Defines the button style (`primary`, `secondary`, `text`, `danger`, `warning`).
 * - `data-size`: Sets padding and font size (`small`, `medium`, `large`).
 * - `data-fixed-width`: Explicitly sets a fixed pixel width.
 * - `data-fullwidth`: Makes the button span the full width of its container.
 *
 * Automatically adds `disabled`, `hover`, and `cursor` states where appropriate.
 * Overwrites existing className but preserves consistent styling and behavior.
 *
 * Example:
 * ```html
 * <button class="ui-button" data-type="primary" data-size="large" data-fullwidth>
 *   Submit
 * </button>
 * ```
 */
export function renderButtons() {
  document.querySelectorAll('.ui-button').forEach(button => {
    const type = button.dataset.type || 'primary';
    const size = button.dataset.size || 'medium';
    const fixedWidth = button.dataset.fixedWidth;
    const fullWidth = button.hasAttribute('data-fullwidth');
    const isDisabled = button.hasAttribute('disabled') || button.disabled;

    button.className = 'ui-button';
    button.type = 'button';

    button.classList.add('font-semibold', 'rounded-lg', 'transition-all', 'duration-200', 'ease-in-out');
    button.style.transform = 'none';

    // Apply responsive size classes with better mobile support
    switch (size) {
      case 'small':
        button.classList.add('px-2', 'py-1', 'text-xs', 'sm:px-3', 'sm:py-1.5', 'sm:text-sm');
        break;
      case 'large':
        button.classList.add('px-4', 'py-2.5', 'text-sm', 'sm:px-6', 'sm:py-3', 'sm:text-base', 'md:px-8', 'md:py-4');
        break;
      case 'medium':
      default:
        button.classList.add('px-3', 'py-2', 'text-sm', 'sm:px-5', 'sm:py-2', 'sm:text-sm');
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

    // Apply responsive type styles
    switch (type) {
      case 'primary':
        button.classList.add('bg-[#1993e5]', 'text-white', 'border', 'border-[#1993e5]', 'shadow-sm');
        if (!isDisabled) {
          button.classList.add('hover:bg-blue-600', 'hover:border-blue-600', 'hover:shadow-md', 
                              'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2', 
                              'active:bg-blue-700', 'transform', 'hover:scale-105');
        }
        break;
      case 'secondary':
        button.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300', 'shadow-sm');
        if (!isDisabled) {
          button.classList.add('hover:bg-gray-50', 'hover:border-gray-400', 'hover:text-gray-800',
                              'focus:ring-2', 'focus:ring-gray-500', 'focus:ring-offset-2',
                              'active:bg-gray-100');
        }
        break;
      case 'text':
        button.classList.remove('px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8', 
                               'py-1', 'py-1.5', 'py-2', 'py-2.5', 'py-3', 'py-4', 
                               'sm:px-3', 'sm:px-5', 'sm:px-6', 'sm:px-8',
                               'sm:py-1.5', 'sm:py-2', 'sm:py-3', 'sm:py-4',
                               'md:px-8', 'md:py-4');
        button.classList.add('bg-transparent', 'text-blue-600', 'px-2', 'py-1', 'sm:px-3', 'sm:py-1.5');
        if (!isDisabled) {
          button.classList.add('hover:underline', 'hover:text-blue-700', 
                              'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2');
        }
        break;
      case 'danger':
        button.classList.add('bg-red-500', 'text-white', 'border', 'border-red-500', 'shadow-sm');
        if (!isDisabled) {
          button.classList.add('hover:bg-red-600', 'hover:border-red-600', 'hover:shadow-md',
                              'focus:ring-2', 'focus:ring-red-500', 'focus:ring-offset-2',
                              'active:bg-red-700', 'transform', 'hover:scale-105');
        }
        break;
      case 'warning':
        button.classList.add('bg-orange-500', 'text-white', 'border', 'border-orange-500', 'shadow-sm');
        if (!isDisabled) {
          button.classList.add('hover:bg-orange-600', 'hover:border-orange-600', 'hover:shadow-md',
                              'focus:ring-2', 'focus:ring-orange-500', 'focus:ring-offset-2',
                              'active:bg-orange-700', 'transform', 'hover:scale-105');
        }
        break;
    }

    if (fixedWidth) {
      button.style.width = `${fixedWidth}px`;
    }

    if (fullWidth) {
      button.classList.add('w-full');
    }

    // Add responsive touch improvements for mobile
    if (!isDisabled) {
      button.classList.add('touch-manipulation', 'select-none');
      
      // Add minimum touch target size for mobile accessibility
      button.style.minHeight = '44px'; // iOS minimum touch target
      button.style.minWidth = '44px';
    }
  });
}
