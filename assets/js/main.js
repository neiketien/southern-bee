document.addEventListener('DOMContentLoaded', function() {
  const checkIconMain = document.getElementById('check-icon-main');
  const checkIconMenu = document.getElementById('check-icon');
  const navMenu = document.getElementById('navMenu');
  const overlay = document.getElementById('overlay');
  const menuItemsWithSubmenu = document.querySelectorAll('.menu-item-with-submenu');
  
  // Sync the two checkboxes
  function syncMenuState(isOpen) {
    checkIconMain.checked = isOpen;
    checkIconMenu.checked = isOpen;
    
    if (isOpen) {
      navMenu.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      navMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
  
  // Toggle menu when main hamburger is clicked
  checkIconMain.addEventListener('change', function() {
    syncMenuState(this.checked);
  });
  
  // Toggle menu when menu hamburger is clicked
  checkIconMenu.addEventListener('change', function() {
    syncMenuState(this.checked);
  });
  
  // Close menu when clicking overlay
  overlay.addEventListener('click', function() {
    syncMenuState(false);
  });
  
  // Toggle submenus
  menuItemsWithSubmenu.forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target === this.querySelector('a')) {
        e.preventDefault();
        this.classList.toggle('active');
        const submenu = this.querySelector('.submenu');
        submenu.classList.toggle('active');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // START OF SEARCH LOADER SCRIPT
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  const loadingScreen = document.getElementById('loading-screen');

  function showInfiniteLoader(event) {
    if (event) {
      event.preventDefault(); // Prevent default form submission or button action
    }
    if (loadingScreen) {
      loadingScreen.style.display = 'flex'; // Show the loader
      // The loader will stay indefinitely as per requirements.
      // User has to use browser back button to navigate away.
    }
  }

  if (searchButton) {
    searchButton.addEventListener('click', function(event) {
      // Check if search input has some value, optional
      // if (searchInput && searchInput.value.trim() !== "") {
      //   showInfiniteLoader(event);
      // } else {
      //    showInfiniteLoader(event); // Show loader even if input is empty
      // }
      showInfiniteLoader(event); // Show loader regardless of input for this requirement
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        // Check if search input has some value, optional
        // if (searchInput.value.trim() !== "") {
        //   showInfiniteLoader(event);
        // } else {
        //    showInfiniteLoader(event); // Show loader even if input is empty
        // }
        showInfiniteLoader(event); // Show loader regardless of input for this requirement
      }
    });
  }
});
    
    // START: Added script for ad injection
    document.addEventListener('DOMContentLoaded', function() {
        const mainContent = document.querySelector('.news-main-content');
        if (!mainContent) {
            console.error('Main content area (.news-main-content) not found for ad injection.');
            return;
        }

        // 1. Remove existing ad units specifically from within .news-main-content
        //    This ensures ads in the sidebar or other areas with the same class are not affected.
        const existingAdsInMainContent = mainContent.querySelectorAll('.news-ad-unit');
        existingAdsInMainContent.forEach(ad => ad.remove());
        
        // 2. Get all paragraph elements within .news-main-content (this list is now "clean")
        const paragraphs = mainContent.querySelectorAll('p');
        
        const adUnitHTML = `
            <div class="news-ad-unit">Promoted content 
            </div>
        `;
        
        // 3. Iterate through the paragraphs and insert the ad unit HTML after every fourth one.
        // querySelectorAll returns a static NodeList in modern browsers, so forward iteration is fine.
        for (let i = 0; i < paragraphs.length; i++) {
            // We count paragraphs 1-based, so (i + 1)
            // Insert after the 4th, 8th, 12th, etc. paragraph
            if ((i + 1) % 4 === 0) {
                const currentParagraph = paragraphs[i];
                // insertAdjacentHTML is efficient for inserting HTML strings
                currentParagraph.insertAdjacentHTML('afterend', adUnitHTML);
            }
        }
    });
    
    // Cookie popup functionality
document.addEventListener('DOMContentLoaded', function() {
  const cookiePopup = document.getElementById('cookiePopup');
  
  // Check if user has already accepted cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  // Only show popup if cookies were NOT already configured
  if (!getCookie('cookiesAccepted') && !getCookie('cookiesConfigured')) {
    // Show cookie popup after a delay
    setTimeout(function() {
      cookiePopup.classList.add('show');
    }, 1500); // 1.5 seconds delay
  }
  
  // Handle cookie acceptance
  document.getElementById('acceptCookies').addEventListener('click', function() {
    // Set a cookie to remember user's choice - all cookies accepted
    document.cookie = "cookiesAccepted=all; max-age=" + 60*60*24*365 + "; path=/"; // 1 year expiry
    
    // Hide the popup
    cookiePopup.classList.remove('show');
    // Use setTimeout to allow animation to complete before removing completely
    setTimeout(function() {
      cookiePopup.style.display = 'none';
    }, 500);
  });
  
  // Handle cookie preferences
  document.getElementById('manageCookies').addEventListener('click', function() {
    // Toggle preferences section
    const preferencesSection = document.getElementById('cookiePreferences');
    const actionButtons = document.querySelector('.actions');
    
    if (preferencesSection.style.display === 'block') {
      preferencesSection.style.display = 'none';
      cookiePopup.classList.remove('expanded');
      actionButtons.style.display = 'flex'; // Show buttons again
    } else {
      preferencesSection.style.display = 'block';
      cookiePopup.classList.add('expanded');
      actionButtons.style.display = 'none'; // Hide the buttons
    }
  });
  
  // Save preferences
  document.getElementById('savePreferences').addEventListener('click', function() {
    const marketingCookies = document.getElementById('marketingCookies').checked;
    const statisticsCookies = document.getElementById('statisticsCookies').checked;
    
    // Set cookies based on user preferences
    document.cookie = "necessaryCookies=true; max-age=" + 60*60*24*365 + "; path=/"; // Always needed
    document.cookie = "marketingCookies=" + marketingCookies + "; max-age=" + 60*60*24*365 + "; path=/";
    document.cookie = "statisticsCookies=" + statisticsCookies + "; max-age=" + 60*60*24*365 + "; path=/";
    document.cookie = "cookiesConfigured=true; max-age=" + 60*60*24*365 + "; path=/";
    
    // Hide the popup with animation
    cookiePopup.classList.remove('show');
    // Use setTimeout to allow animation to complete before removing completely
    setTimeout(function() {
      cookiePopup.style.display = 'none';
    }, 500);
  });
});