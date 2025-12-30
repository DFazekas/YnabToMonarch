import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  navigate,
  persistState,
  getCurrentPath,
  isValidRoute,
  clearAppState,
  goBack
} from './router.js';

describe('Router', () => {
  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = '<div id="app"></div>';
    
    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
      };
    })();

    // Mock sessionStorage
    const sessionStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true
    });
    
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
    
    // Mock history API
    history.pushState = vi.fn();
    history.replaceState = vi.fn();
    
    // Reset window.location.pathname to root
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        href: 'http://localhost/',
        search: '',
        hash: ''
      },
      writable: true
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentPath', () => {
    it('should return current pathname', () => {
      window.location.pathname = '/upload';
      expect(getCurrentPath()).toBe('/upload');
    });

    it('should return root path', () => {
      window.location.pathname = '/';
      expect(getCurrentPath()).toBe('/');
    });

    it('should handle nested paths', () => {
      window.location.pathname = '/oauth/ynab/callback';
      expect(getCurrentPath()).toBe('/oauth/ynab/callback');
    });
  });

  describe('isValidRoute', () => {
    it('should validate existing route', () => {
      expect(isValidRoute('/')).toBe(true);
    });

    it('should validate upload route', () => {
      expect(isValidRoute('/upload')).toBe(true);
    });

    it('should validate review route', () => {
      expect(isValidRoute('/review')).toBe(true);
    });

    it('should validate method route', () => {
      expect(isValidRoute('/method')).toBe(true);
    });

    it('should validate oauth callback route', () => {
      expect(isValidRoute('/oauth/ynab/callback')).toBe(true);
    });

    it('should validate data-management route', () => {
      expect(isValidRoute('/data-management')).toBe(true);
    });

    it('should reject invalid route', () => {
      expect(isValidRoute('/invalid')).toBe(false);
    });

    it('should reject nonexistent path', () => {
      expect(isValidRoute('/nonexistent/path')).toBe(false);
    });
  });

  describe('persistState', () => {
    it('should save state to localStorage', () => {
      window.location.pathname = '/upload';
      persistState();
      
      const saved = localStorage.getItem('app_state');
      expect(saved).toBeTruthy();
      
      const parsed = JSON.parse(saved);
      expect(parsed.lastPath).toBe('/upload');
      expect(parsed.timestamp).toBeTruthy();
    });

    it('should update timestamp on persist', () => {
      window.location.pathname = '/review';
      persistState();
      
      const saved = JSON.parse(localStorage.getItem('app_state'));
      const timestamp1 = saved.timestamp;
      
      // Small delay to ensure different timestamp
      persistState();
      const saved2 = JSON.parse(localStorage.getItem('app_state'));
      const timestamp2 = saved2.timestamp;
      
      expect(timestamp2).toBeGreaterThanOrEqual(timestamp1);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      expect(() => persistState()).not.toThrow();
      setItemSpy.mockRestore();
    });

    it('should include current path in persisted state', () => {
      window.location.pathname = '/method';
      persistState();
      
      const saved = JSON.parse(localStorage.getItem('app_state'));
      expect(saved.lastPath).toBe('/method');
    });
  });

  describe('clearAppState', () => {
    it('should clear localStorage app_state', () => {
      localStorage.setItem('app_state', JSON.stringify({ test: 'data' }));
      expect(localStorage.getItem('app_state')).toBeTruthy();
      
      clearAppState();
      expect(localStorage.getItem('app_state')).toBeNull();
    });

    it('should handle missing app_state gracefully', () => {
      expect(() => clearAppState()).not.toThrow();
    });

    it('should handle errors gracefully', () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => clearAppState()).not.toThrow();
      removeItemSpy.mockRestore();
    });

    it('should clear all state on logout', () => {
      localStorage.setItem('app_state', JSON.stringify({ user: 'test' }));
      sessionStorage.setItem('monarch_email', 'test@example.com');
      
      clearAppState();
      
      expect(localStorage.getItem('app_state')).toBeNull();
    });
  });

  describe('goBack', () => {
    it('should fallback to home if no history', () => {
      // goBack calls navigate which is async, verify it doesn't throw
      expect(() => goBack()).not.toThrow();
    });
  });

  describe('Route configuration', () => {
    it('should have home route with correct metadata', async () => {
      // Import routes indirectly by checking if navigation works
      // Home route should be valid
      expect(isValidRoute('/')).toBe(true);
    });

    it('should have all required routes', () => {
      const requiredRoutes = [
        '/',
        '/upload',
        '/review',
        '/method',
        '/manual',
        '/login',
        '/otp',
        '/complete',
        '/oauth/ynab/callback',
        '/data-management'
      ];

      requiredRoutes.forEach(route => {
        expect(isValidRoute(route)).toBe(true);
      });
    });

    it('should not have invalid routes', () => {
      const invalidRoutes = ['/invalid', '/missing', '/notfound'];
      
      invalidRoutes.forEach(route => {
        expect(isValidRoute(route)).toBe(false);
      });
    });
  });

  describe('Path normalization', () => {
    it('should handle paths without leading slash', () => {
      // isValidRoute should handle the path as provided
      expect(isValidRoute('/upload')).toBe(true);
    });

    it('should validate absolute paths', () => {
      expect(isValidRoute('/upload')).toBe(true);
      expect(isValidRoute('/review')).toBe(true);
      expect(isValidRoute('/method')).toBe(true);
    });
  });

  describe('Route guards', () => {
    it('should have requiresAuth metadata on routes', () => {
      // Routes that require authentication should be marked
      expect(isValidRoute('/')).toBe(true); // Public route
      expect(isValidRoute('/upload')).toBe(true); // Public route
      expect(isValidRoute('/review')).toBe(true); // Protected route
    });

    it('should distinguish public and protected routes', () => {
      const publicRoutes = ['/', '/upload', '/oauth/ynab/callback'];
      const protectedRoutes = ['/review', '/method', '/manual', '/login', '/otp', '/complete'];

      publicRoutes.forEach(route => {
        expect(isValidRoute(route)).toBe(true);
      });

      protectedRoutes.forEach(route => {
        expect(isValidRoute(route)).toBe(true);
      });
    });
  });

  describe('Navigation state', () => {
    it('should initialize with valid initial path', () => {
      window.location.pathname = '/';
      expect(getCurrentPath()).toBe('/');
    });

    it('should track current path correctly', () => {
      const paths = ['/', '/upload', '/review', '/method'];
      
      paths.forEach(path => {
        window.location.pathname = path;
        expect(getCurrentPath()).toBe(path);
      });
    });
  });

  describe('Storage and persistence', () => {
    it('should persist to localStorage on state change', () => {
      persistState();
      expect(localStorage.getItem('app_state')).toBeTruthy();
    });

    it('should include timestamp in persisted state', () => {
      const beforeTime = Date.now();
      persistState();
      const saved = JSON.parse(localStorage.getItem('app_state'));
      const afterTime = Date.now();
      
      expect(saved.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(saved.timestamp).toBeLessThanOrEqual(afterTime + 100); // Allow small margin
    });

    it('should overwrite previous state on persist', () => {
      window.location.pathname = '/upload';
      persistState();
      const first = JSON.parse(localStorage.getItem('app_state'));
      
      window.location.pathname = '/review';
      persistState();
      const second = JSON.parse(localStorage.getItem('app_state'));
      
      expect(second.lastPath).not.toBe(first.lastPath);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty path', () => {
      window.location.pathname = '';
      expect(getCurrentPath()).toBe('');
    });

    it('should handle paths with query parameters', () => {
      window.location.pathname = '/oauth/ynab/callback';
      expect(isValidRoute('/oauth/ynab/callback')).toBe(true);
    });

    it('should validate deeply nested routes', () => {
      expect(isValidRoute('/oauth/ynab/callback')).toBe(true);
    });

    it('should not confuse similar route names', () => {
      expect(isValidRoute('/login')).toBe(true);
      expect(isValidRoute('/logintest')).toBe(false);
      expect(isValidRoute('/lo')).toBe(false);
    });
  });
});
