/**
 * AutoStyledButton Web Component
 * Automatically applies and maintains styling based on data attributes
 * No manual renderButtons() calls needed - styles update automatically
 * 
 * Attributes:
 * - data-type: Style variant (solid, outline, text)
 * - data-color: Color theme (blue, red, yellow, grey, white, purple, green)
 * - data-size: Button size (small, medium, large)
 * - data-fullwidth: Makes button full width
 */

const buttonStyles = {
  base: [
    'font-semibold', 'rounded-lg', 'transition-all', 'duration-200',
    'ease-in-out', 'flex', 'items-center', 'justify-center'
  ],

  sizes: {
    small: ['px-2', 'py-1', 'text-xs', 'sm:px-3', 'sm:py-1.5', 'sm:text-sm'],
    medium: ['px-3', 'py-2', 'text-sm', 'sm:px-5', 'sm:py-2', 'sm:text-sm'],
    large: ['px-4', 'py-2.5', 'text-sm', 'sm:px-6', 'sm:py-3', 'sm:text-base', 'md:px-8', 'md:py-4']
  },

  colors: {
    blue: {
      solid: {
        base: ['bg-[#1993e5]', 'text-white', 'shadow-sm'],
        hover: ['hover:bg-blue-600', 'hover:shadow-md',
          'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2',
          'active:bg-blue-700']
      },
      outline: {
        base: ['bg-transparent', 'text-blue-600', 'border', 'border-blue-600', 'shadow-none'],
        hover: ['hover:bg-blue-50', 'hover:border-blue-700', 'hover:text-blue-700',
          'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2',
          'active:bg-blue-100']
      },
      text: {
        base: ['bg-transparent', 'text-blue-600', 'border-none', 'shadow-none'],
        hover: ['hover:underline', 'hover:text-blue-700',
          'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2']
      }
    },
    red: {
      solid: {
        base: ['bg-red-500', 'text-white', 'shadow-sm'],
        hover: ['hover:bg-red-600', 'hover:shadow-md',
          'focus:ring-2', 'focus:ring-red-500', 'focus:ring-offset-2',
          'active:bg-red-700']
      },
      outline: {
        base: ['bg-transparent', 'text-red-600', 'border', 'border-red-600', 'shadow-none'],
        hover: ['hover:bg-red-50', 'hover:border-red-700', 'hover:text-red-700',
          'focus:ring-2', 'focus:ring-red-500', 'focus:ring-offset-2',
          'active:bg-red-100']
      },
      text: {
        base: ['bg-transparent', 'text-red-600', 'border-none', 'shadow-none'],
        hover: ['hover:underline', 'hover:text-red-700',
          'focus:ring-2', 'focus:ring-red-500', 'focus:ring-offset-2']
      }
    },
    black: {
      solid: {
        base: ['bg-gray-800', 'text-white', 'shadow-sm'],
        hover: ['hover:bg-gray-700', 'hover:shadow-md',
          'focus:ring-2', 'focus:ring-black', 'focus:ring-offset-2',
          'active:bg-gray-800']
      },
      outline: {
        base: ['bg-transparent', 'text-black', 'border', 'border-black', 'shadow-none'],
        hover: ['hover:bg-gray-100', 'hover:border-gray-700', 'hover:text-gray-700',
          'focus:ring-2', 'focus:ring-black', 'focus:ring-offset-2',
          'active:bg-gray-200']
      },
      text: {
        base: ['bg-transparent', 'text-black', 'border-none', 'shadow-none'],
        hover: ['hover:underline', 'hover:text-gray-700',
          'focus:ring-2', 'focus:ring-black', 'focus:ring-offset-2']
      }
    },
    yellow: {
      solid: {
        base: ['bg-yellow-500', 'text-white', 'shadow-sm'],
        hover: ['hover:bg-yellow-600', 'hover:shadow-md',
          'focus:ring-2', 'focus:ring-yellow-500', 'focus:ring-offset-2',
          'active:bg-yellow-700']
      },
      outline: {
        base: ['bg-transparent', 'text-yellow-600', 'border', 'border-yellow-600', 'shadow-none'],
        hover: ['hover:bg-yellow-50', 'hover:border-yellow-700', 'hover:text-yellow-700',
          'focus:ring-2', 'focus:ring-yellow-500', 'focus:ring-offset-2',
          'active:bg-yellow-100']
      },
      text: {
        base: ['bg-transparent', 'text-yellow-600', 'border-none', 'shadow-none'],
        hover: ['hover:underline', 'hover:text-yellow-700',
          'focus:ring-2', 'focus:ring-yellow-500', 'focus:ring-offset-2']
      }
    },
    grey: {
      solid: {
        base: ['bg-gray-500', 'text-white', 'shadow-sm'],
        hover: ['hover:bg-gray-600', 'hover:shadow-md',
          'focus:ring-2', 'focus:ring-gray-500', 'focus:ring-offset-2',
          'active:bg-gray-700']
      },
      outline: {
        base: ['bg-transparent', 'text-gray-700', 'border', 'border-gray-300', 'shadow-none'],
        hover: ['hover:bg-gray-50', 'hover:border-gray-400', 'hover:text-gray-800',
          'focus:ring-2', 'focus:ring-gray-500', 'focus:ring-offset-2',
          'active:bg-gray-100']
      },
      text: {
        base: ['bg-transparent', 'text-gray-600', 'border-none', 'shadow-none'],
        hover: ['hover:underline', 'hover:text-gray-700',
          'focus:ring-2', 'focus:ring-gray-500', 'focus:ring-offset-2']
      }
    },
    white: {
      solid: {
        base: ['bg-white', 'text-gray-700', 'border', 'border-gray-300', 'shadow-sm'],
        hover: ['hover:bg-gray-50', 'hover:border-gray-400', 'hover:text-gray-800',
          'focus:ring-2', 'focus:ring-gray-500', 'focus:ring-offset-2',
          'active:bg-gray-100']
      },
      outline: {
        base: ['bg-transparent', 'text-gray-700', 'border', 'border-gray-300', 'shadow-none'],
        hover: ['hover:bg-gray-50', 'hover:border-gray-400', 'hover:text-gray-800',
          'focus:ring-2', 'focus:ring-gray-500', 'focus:ring-offset-2',
          'active:bg-gray-100']
      },
      text: {
        base: ['bg-transparent', 'text-white', 'border-none', 'shadow-none'],
        hover: ['hover:underline', 'hover:text-white',
          'focus:ring-2', 'focus:ring-gray-500', 'focus:ring-offset-2']
      }
    },
    purple: {
      solid: {
        base: ['bg-purple-500', 'text-white', 'shadow-sm'],
        hover: ['hover:bg-purple-600', 'hover:shadow-md',
          'focus:ring-2', 'focus:ring-purple-500', 'focus:ring-offset-2',
          'active:bg-purple-700']
      },
      outline: {
        base: ['bg-transparent', 'text-purple-600', 'border', 'border-purple-600', 'shadow-none'],
        hover: ['hover:bg-purple-50', 'hover:border-purple-700', 'hover:text-purple-700',
          'focus:ring-2', 'focus:ring-purple-500', 'focus:ring-offset-2',
          'active:bg-purple-100']
      },
      text: {
        base: ['bg-transparent', 'text-purple-600', 'border-none', 'shadow-none'],
        hover: ['hover:underline', 'hover:text-purple-700',
          'focus:ring-2', 'focus:ring-purple-500', 'focus:ring-offset-2']
      }
    },
    green: {
      solid: {
        base: ['bg-green-500', 'text-white', 'shadow-sm'],
        hover: ['hover:bg-green-600', 'hover:shadow-md',
          'focus:ring-2', 'focus:ring-green-500', 'focus:ring-offset-2',
          'active:bg-green-700']
      },
      outline: {
        base: ['bg-transparent', 'text-green-600', 'border', 'border-green-600', 'shadow-none'],
        hover: ['hover:bg-green-50', 'hover:border-green-700', 'hover:text-green-700',
          'focus:ring-2', 'focus:ring-green-500', 'focus:ring-offset-2',
          'active:bg-green-100']
      },
      text: {
        base: ['bg-transparent', 'text-green-600', 'border-none', 'shadow-none'],
        hover: ['hover:underline', 'hover:text-green-700',
          'focus:ring-2', 'focus:ring-green-500', 'focus:ring-offset-2']
      }
    },
    amber: {
      solid: {
        base: ['bg-amber-500', 'text-white', 'shadow-sm'],
        hover: ['hover:bg-amber-600', 'hover:shadow-md',
          'focus:ring-2', 'focus:ring-amber-500', 'focus:ring-offset-2',
          'active:bg-amber-700']
      },
      outline: {
        base: ['bg-transparent', 'text-amber-600', 'border', 'border-amber-600', 'shadow-none'],
        hover: ['hover:bg-amber-50', 'hover:border-amber-700', 'hover:text-amber-700',
          'focus:ring-2', 'focus:ring-amber-500', 'focus:ring-offset-2',
          'active:bg-amber-100']
      },
      text: {
        base: ['bg-transparent', 'text-amber-600', 'border-none', 'shadow-none'],
        hover: ['hover:underline', 'hover:text-amber-700',
          'focus:ring-2', 'focus:ring-amber-500', 'focus:ring-offset-2']
      }
    },
    transparent: {
      solid: {
        base: ['bg-transparent', 'text-white'],
        hover: ['hover:bg-white/10', 'hover:shadow-md',
          'focus:ring-2', 'focus:ring-gray-500', 'focus:ring-offset-2',
          'active:bg-gray-700']
      },
      outline: {
        base: ['bg-transparent', 'text-white', 'border', 'border-gray-300', 'shadow-none'],
        hover: ['hover:bg-gray-50', 'hover:border-gray-400', 'hover:text-gray-800',
          'focus:ring-2', 'focus:ring-gray-500', 'focus:ring-offset-2',
          'active:bg-gray-100']
      },
      text: {
        base: ['bg-transparent', 'text-gray-600', 'border-none', 'shadow-none'],
        hover: ['hover:underline', 'hover:text-gray-700',
          'focus:ring-2', 'focus:ring-gray-500', 'focus:ring-offset-2']
      }
    }
  }
};

class AutoStyledButton extends HTMLElement {
  constructor() {
    super();
    this._initialized = false;
  }

  connectedCallback() {
    if (!this._initialized) {
      this.applyStyles();
      this._initialized = true;

      // Watch for attribute changes
      this._observer = new MutationObserver(() => this.applyStyles());
      this._observer.observe(this, {
        attributes: true,
        attributeFilter: ['data-type', 'data-color', 'data-size', 'disabled', 'data-fullwidth']
      });
    }
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  applyStyles() {
    const type = this.dataset.type || 'solid';
    const color = this.dataset.color || 'blue';
    const size = this.dataset.size || 'medium';
    const isDisabled = this.hasAttribute('disabled') || this.disabled;
    const fullWidth = this.hasAttribute('data-fullwidth');

    // Reset classes
    this.className = 'ui-button';

    // Add base styles
    this.classList.add(...buttonStyles.base);

    // Add size styles (skip for text type)
    if (type !== 'text') {
      this.classList.add(...(buttonStyles.sizes[size] || buttonStyles.sizes.medium));
    }

    // Get color and type styles
    const colorStyles = buttonStyles.colors[color] || buttonStyles.colors.blue;
    const typeStyle = colorStyles[type] || colorStyles.solid;

    // Add type and color styles
    this.classList.add(...typeStyle.base);

    // Add hover styles if not disabled
    if (!isDisabled) {
      this.classList.add('cursor-pointer', ...typeStyle.hover);
    } else {
      this.classList.add('opacity-50', 'cursor-not-allowed');
      this.setAttribute('disabled', '');
    }

    // Handle full width
    if (fullWidth) {
      this.classList.add('w-full');
    }

    // Set button type
    if (!this.hasAttribute('type')) {
      this.setAttribute('type', 'button');
    }
  }

  // Allow programmatic style updates
  updateStyle() {
    this.applyStyles();
  }
}

// Register custom element
customElements.define('ui-button', AutoStyledButton);

// Also provide a function to upgrade existing buttons to web components
export function upgradeButtons(container = document) {
  const buttons = container.querySelectorAll('.ui-button:not([is])');
  buttons.forEach(button => {
    // Skip if already a custom element
    if (button instanceof AutoStyledButton) return;

    // Create new ui-button element
    const newButton = document.createElement('ui-button');

    // Copy all attributes
    Array.from(button.attributes).forEach(attr => {
      newButton.setAttribute(attr.name, attr.value);
    });

    // Copy content
    newButton.innerHTML = button.innerHTML;

    // Copy event listeners (we can't actually copy them, so we document this limitation)
    // Developers should add listeners AFTER calling upgradeButtons()

    // Replace in DOM
    button.parentNode?.replaceChild(newButton, button);
  });
}

// Export for backwards compatibility (but now it just upgrades elements)
export function renderButtons(container = document) {
  upgradeButtons(container);
}
