(function() {
  'use strict';
  
  // Theme Manager - Global utility
  window.ThemeManager = {
    // Get current theme from localStorage or default to 'system'
    getCurrentTheme: function() {
      return localStorage.getItem('theme') || 'system';
    },
    
    // Set theme and save to localStorage
    setTheme: function(theme) {
      localStorage.setItem('theme', theme);
      this.applyTheme(theme);
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    },
    
    // Apply theme to the document
    applyTheme: function(theme) {
      const html = document.documentElement;
      
      if (theme === 'system') {
        // Remove explicit theme and check system preference
        html.removeAttribute('data-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          html.setAttribute('data-theme', 'dark');
        }
      } else {
        html.setAttribute('data-theme', theme);
      }
    },
    
    // Initialize theme - call this on every page load
    init: function() {
      const currentTheme = this.getCurrentTheme();
      this.applyTheme(currentTheme);
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this.getCurrentTheme() === 'system') {
          this.applyTheme('system');
        }
      });
    }
  };
  
  // Initialize theme immediately when script loads
  // This prevents flash of unstyled content (FOUC)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.ThemeManager.init();
    });
  } else {
    window.ThemeManager.init();
  }
  
  // Apply theme immediately for faster rendering
  window.ThemeManager.applyTheme(window.ThemeManager.getCurrentTheme());
})();