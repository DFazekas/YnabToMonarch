import { navigate } from './router.js';
// Import new component system - auto-initializes on load
import './core/ComponentRegistry.js';
import './components/AutoStyledButton.js';
import './components/ReusableModal.js';
import './components/ReusableTable.js';

// Legacy button support (backwards compatibility)
import './components/button.js';

// Initial app load handled by router's DOMContentLoaded listener
// No need to manually navigate here as router handles initial route detection
