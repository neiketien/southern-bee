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
      // Check if the item is not disabled before adding click listener for submenu toggle
      if (!item.classList.contains('disabled-submenu')) {
          const anchor = item.querySelector('a');
          // Allow submenu toggle by clicking the anchor or the item itself (excluding clicks on actual links within submenu)
          item.addEventListener('click', function(e) {
              // Prevent default only if clicking the main anchor of a submenu item
              // and not a link within an already open submenu
              if (e.target === anchor || e.target === item && !item.querySelector('.submenu').contains(e.target)) {
                   e.preventDefault();
                  this.classList.toggle('active');
                  const submenu = this.querySelector('.submenu');
                  if (submenu) { // Ensure submenu exists
                      submenu.classList.toggle('active');
                  }
              }
          });
      }
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
          
      // Dynamic Date/Time
      function updateDateTime() {
        const currentDayEl = document.getElementById('currentDay');
        const currentDateTimeEl = document.getElementById('currentDateTime');
  
        if (!currentDayEl || !currentDateTimeEl) return; // Elements not found
  
        const now = new Date();
        
        currentDayEl.textContent = now.toLocaleDateString(navigator.language || 'en-US', { weekday: 'long' });
        
        const timeString = now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).toUpperCase();
        
        const dateString = now.toLocaleDateString('en-US', { 
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        });
        
        currentDateTimeEl.innerHTML = timeString + '<br>' + dateString;
  }
  
      // Update every second
      setInterval(updateDateTime, 1000);
      updateDateTime(); // Initial call
      
      function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          // Instead of rejecting, resolve with null or a default to allow graceful degradation
          console.warn('Error getting location:', error.message);
          resolve(null); // Resolve with null if location access is denied or fails
        },
        { timeout: 10000 } // Add a timeout for the geolocation request
      );
    });
  }
  
  // Function to get weather data based on coordinates using OpenWeatherMap API
  async function getWeatherData(latitude, longitude) {
    if (!latitude || !longitude) return null; // No coordinates, no request
  
    const apiKey = '5a1accf3740bdafdbdfe7a6d0b187665'; // Your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        // Log specific error from API if available
        const errorData = await response.json().catch(() => ({})); // Try to parse error
        console.error('Weather API error:', response.status, errorData.message || 'Unknown error');
        return null; // Return null on API error
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null; // Return null on network or other errors
    }
  }
  
  // Function to get location name from coordinates using reverse geocoding
  async function getLocationName(latitude, longitude) {
    if (!latitude || !longitude) return null; // No coordinates
  
    // Use a robust API key if this is a production feature
    const apiKey = '5a1accf3740bdafdbdfe7a6d0b187665';
    try {
      const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Reverse geocoding API error:', response.status, errorData.message || 'Unknown error');
        return null;
      }
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          city: data[0].name,
          country: data[0].country
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }
  
  // Function to get the appropriate weather icon based on weather condition
  function getWeatherIcon(weatherCode) {
    // Weather condition codes: https://openweathermap.org/weather-conditions
    
    // For rain (200-531: thunderstorm, drizzle, rain)
    if ((weatherCode >= 200 && weatherCode < 600) || weatherCode === 511) {
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" width="20" height="20">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M16 18.5L15 21M8 18.5L7 21M12 18.5L11 21M7 15C4.23858 15 2 12.7614 2 10C2 7.23858 4.23858 5 7 5C7.03315 5 7.06622 5.00032 7.09922 5.00097C8.0094 3.2196 9.86227 2 12 2C14.5192 2 16.6429 3.69375 17.2943 6.00462C17.3625 6.00155 17.4311 6 17.5 6C19.9853 6 22 8.01472 22 10.5C22 12.9853 19.9853 15 17.5 15C13.7434 15 11.2352 15 7 15Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
      </svg>`;
    } 
    // For clear sky (800)
    else if (weatherCode === 800) {
      return `<svg stroke="#ffffff" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="20" height="20">
        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
        <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32zM195.2 195.2a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 1 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm543.104 543.104a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248zM64 512a32 32 0 0 1 32-32h64a32 32 0 0 1 0 64H96a32 32 0 0 1-32-32zm768 0a32 32 0 0 1 32-32h64a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32zM195.2 828.8a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248L240.448 828.8a32 32 0 0 1-45.248 0zm543.104-543.104a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248l-45.248 45.248a32 32 0 0 1-45.248 0z" fill="#ffffff"></path>
        </g>
      </svg>`;
    } 
    // For cloudy (801-804) or default
    else { // Default to cloudy icon if no specific match or for general cloudiness
      return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
        <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
        <g id="SVGRepo_iconCarrier">
          <path stroke-linecap="round" stroke-width="1.5" stroke="#ffffff" d="M22 14.3529C22 17.4717 19.4416 20 16.2857 20H11M14.381 9.02721C14.9767 8.81911 15.6178 8.70588 16.2857 8.70588C16.9404 8.70588 17.5693 8.81468 18.1551 9.01498M7.11616 11.6089C6.8475 11.5567 6.56983 11.5294 6.28571 11.5294C3.91878 11.5294 2 13.4256 2 15.7647C2 18.1038 3.91878 20 6.28571 20H7M7.11616 11.6089C6.88706 10.9978 6.7619 10.3369 6.7619 9.64706C6.7619 6.52827 9.32028 4 12.4762 4C15.4159 4 17.8371 6.19371 18.1551 9.01498M7.11616 11.6089C7.68059 11.7184 8.20528 11.9374 8.66667 12.2426M18.1551 9.01498C18.8381 9.24853 19.4623 9.60648 20 10.0614"></path>
        </g>
      </svg>`;
    }
  }
  
  // Function to get the placeholder cloud icon for error states or no data
  function getPlaceholderIcon() {
    // This is the same as the cloudy icon, which is a good default
    return getWeatherIcon(802); // Use a generic cloudy code
  }
  
  // Function to update the weather widget with the fetched data
  function updateWeatherWidget(weatherData, locationData) {
    const weatherContainer = document.querySelector('.weather-container');
    if (!weatherContainer) return; // Element not found
    
    let weatherDescription = "Weather"; // Default text
    let temperatureDisplay = "--°C";   // Default text
    let weatherIconHtml = getPlaceholderIcon(); // Default icon
    let city = "Location";               // Default text
    let country = "";                   // Default text
    
    if (weatherData) {
      weatherDescription = weatherData.weather[0].main;
      temperatureDisplay = `${Math.round(weatherData.main.temp)}°C`;
      weatherIconHtml = getWeatherIcon(weatherData.weather[0].id);
    }
    
    if (locationData) {
      city = locationData.city || "Unknown City"; // Provide fallback
      country = locationData.country ? `, ${locationData.country}` : ""; // Add comma only if country exists
    } else if (!weatherData) { // If no weather and no location data
        city = "Unavailable";
    }
    
    weatherContainer.innerHTML = `
      <div class="weather-info">
        <span class="weather-text">${weatherDescription}</span>
        <div class="icon">
          ${weatherIconHtml}
        </div>
      </div>
      <div class="temperature">${temperatureDisplay}</div>
      <div class="location">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" xml:space="preserve" fill="#ffffff" stroke="#ffffff" width="12" height="12">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path fill="#ffffff" d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24 C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24 C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z"></path>
          </g>
        </svg>
        <p><span>${city}</span>${country}</p>
      </div>
    `;
  }
  
  // Main function to initialize weather widget
  async function initWeatherWidget() {
    let weatherData = null;
    let locationData = null;
    
    try {
      const location = await getUserLocation(); // Will resolve with null if error/denied
      
      if (location) { // Only fetch weather if location is available
        // Fetch weather and location name in parallel
        [weatherData, locationData] = await Promise.all([
          getWeatherData(location.latitude, location.longitude),
          getLocationName(location.latitude, location.longitude)
        ]);
      }
    } catch (error) {
      // This catch is mainly for unexpected errors in Promise.all or getUserLocation if it were to reject
      console.error('Error initializing weather widget:', error);
    } finally {
      // Update the weather widget with whatever data we have (or defaults)
      updateWeatherWidget(weatherData, locationData);
    }
  }
  
  // Initialize the weather widget when the DOM is loaded
  document.addEventListener('DOMContentLoaded', initWeatherWidget);
  
  document.addEventListener('DOMContentLoaded', function() {
      // ... other existing JavaScript code ...
  
      // Newsletter Form Functionality
      const newsletterEmailInput = document.getElementById('email');
      const newsletterSubscribeButton = document.getElementById('newsletterSubscribeBtn');
      const newsletterErrorMessageElement = document.getElementById('newsletterError');
      const successNotificationElement = document.getElementById('newsletterSuccessNotification');
      let successNotificationTimeout;
  
      if (newsletterSubscribeButton && newsletterEmailInput && newsletterErrorMessageElement && successNotificationElement) {
          newsletterSubscribeButton.addEventListener('click', function(event) {
              event.preventDefault(); // Prevent default form submission behavior
  
              const emailValue = newsletterEmailInput.value.trim();
              let isValid = true;
              let errorMessageText = "";
  
              // Basic email validation
              if (emailValue === "") {
                  isValid = false;
                  errorMessageText = "Email address cannot be empty.";
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                  // Regex for basic email format check
                  isValid = false;
                  errorMessageText = "Please enter a valid email address.";
              }
  
              if (!isValid) {
                  newsletterErrorMessageElement.textContent = errorMessageText;
                  newsletterErrorMessageElement.style.display = 'block';
                  newsletterEmailInput.classList.add('error');
  
                  // Hide success notification if it was somehow visible
                  successNotificationElement.classList.remove('active');
                  if (successNotificationTimeout) {
                      clearTimeout(successNotificationTimeout);
                  }
              } else {
                  // Clear error state
                  newsletterErrorMessageElement.style.display = 'none';
                  newsletterEmailInput.classList.remove('error');
                  
                  // Simulate successful subscription (in a real app, you'd send this to a server)
                  console.log("Subscribed with email:", emailValue);
                  newsletterEmailInput.value = ""; // Clear the input field
  
                  // Show success notification
                  successNotificationElement.textContent = "You have successfully subscribed to our weekly newsletter!";
                  successNotificationElement.classList.add('active');
  
                  // Clear any existing timeout to prevent multiple timers
                  if (successNotificationTimeout) {
                      clearTimeout(successNotificationTimeout);
                  }
  
                  // Set timeout to hide notification after 5 seconds
                  successNotificationTimeout = setTimeout(() => {
                      successNotificationElement.classList.remove('active');
                  }, 5000);
              }
          });
      }
      });
  // Initialize the carousel
  document.addEventListener('DOMContentLoaded', function() {
        const carousel = document.querySelector('.carousel');
        const items = document.querySelectorAll('.carousel-item');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        const indicators = document.querySelectorAll('.indicator');
        
        let currentIndex = 0;
        const totalItems = items.length;
        
        // Initialize carousel
        updateCarousel();
        
        // Set up auto-scrolling
        let autoScroll = setInterval(next, 5000);
        
        // Reset interval when user interacts with carousel
        const resetInterval = () => {
          clearInterval(autoScroll);
          autoScroll = setInterval(next, 5000);
        };
        
        // Previous button
        prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + totalItems) % totalItems;
          updateCarousel();
          resetInterval();
        });
        
        // Next button
        nextBtn.addEventListener('click', () => {
          next();
          resetInterval();
        });
        
        // Indicators
        indicators.forEach(indicator => {
          indicator.addEventListener('click', () => {
            currentIndex = parseInt(indicator.dataset.index);
            updateCarousel();
            resetInterval();
          });
        });
        
        // Touch events for swiping
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', e => {
          touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        carousel.addEventListener('touchend', e => {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe();
          resetInterval();
        }, {passive: true});
        
        function handleSwipe() {
          const swipeThreshold = 50;
          if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left
            next();
          } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
          }
        }
        
        function next() {
          currentIndex = (currentIndex + 1) % totalItems;
          updateCarousel();
        }
        
        function updateCarousel() {
          // Update carousel position
          carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
          
          // Update indicators
          indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
              indicator.classList.add('active');
            } else {
              indicator.classList.remove('active');
            }
          });
        }
        
        // Pause auto-scroll when hovering
        carousel.addEventListener('mouseenter', () => {
          clearInterval(autoScroll);
        });
        
        carousel.addEventListener('mouseleave', () => {
          autoScroll = setInterval(next, 3000);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', e => {
          if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
            resetInterval();
          } else if (e.key === 'ArrowRight') {
            next();
            resetInterval();
          }
        });
      });
      
      // Add click event listeners to toggle active state and show corresponding content
          const pills = document.querySelectorAll('.pill');
          const contentSections = document.querySelectorAll('.featured-content-section');
          
          pills.forEach(pill => {
              pill.addEventListener('click', () => {
                  // Get the category from data attribute
                  const category = pill.getAttribute('data-category');
                  
                  // Remove active class from all pills and content sections
                  pills.forEach(p => p.classList.remove('active'));
                  contentSections.forEach(section => section.classList.remove('active'));
                  
                  // Add active class to clicked pill
                  pill.classList.add('active');
                  
                  // Show the corresponding content section
                  document.getElementById(category).classList.add('active');
              });
          });

          // --- START: AD LAYOUT LOGIC ---
      const newsListContainer = document.querySelector('.news-article-list');
      const sidebarAdsContainer = document.querySelector('.alt-sidebar-ads-list');
      let originalAdNodes = []; // Store the actual DOM nodes from the sidebar

      function collectOriginalAds() {
          if (sidebarAdsContainer && originalAdNodes.length === 0) {
              originalAdNodes = Array.from(sidebarAdsContainer.querySelectorAll('.alt-ad-unit'));
          }
      }

      function setupAdLayout() {
          if (!newsListContainer || !sidebarAdsContainer) {
             console.warn("News list or sidebar container not found.");
             return;
          }

          const screenWidth = window.innerWidth;

          // 1. Cleanup: Remove ads previously injected
          document.querySelectorAll('.injected-mobile-ad-wrapper').forEach(wrapper => wrapper.remove());
          document.querySelectorAll('.native-ad-row').forEach(adRow => adRow.remove()); // Remove previous native ad rows

           originalAdNodes.forEach(ad => {
              ad.style.display = ''; // Reset display property
              ad.classList.remove('injected-mobile-ad');
           });


          if (screenWidth < 768) { // Mobile view (< 768px)
              sidebarAdsContainer.style.display = 'none';
              const allNewsCards = Array.from(newsListContainer.querySelectorAll('.alt-news-card'));
              let adInsertCount = 0;

              allNewsCards.forEach((newsCard, index) => {
                  if ((index + 1) % 3 === 0) { // After every 3rd news card
                      // We check originalAdNodes.length to see if we are allowed to show ads from the sidebar config
                      // The actual content of originalAdNodes is not cloned for mobile anymore.
                      if (originalAdNodes.length > 0) {
                          
                          // --- START: ADSTERRA SCRIPT INTEGRATION FOR MOBILE ---
                          const adContainerForScript = document.createElement('div');
                          // Add 'alt-ad-unit' for consistent styling (padding, border, min-height)
                          // Add 'injected-mobile-ad' for specific mobile targeting if needed
                          adContainerForScript.className = 'alt-ad-unit injected-mobile-ad'; 
                          adContainerForScript.style.display = 'block'; // Ensure it’s visible

                          // **IMPORTANT**: Replace placeholder values below with your ACTUAL Adsterra details.
                          // This example assumes Adsterra’s "Native Banner" format or similar,
                          // which typically involves a placeholder <div> and an async <script>.

                          // 1. Create the placeholder div that Adsterra's script will often target.
                          const adsterraPlaceholderDiv = document.createElement('div');
                          // Generate a unique ID for each ad instance to avoid conflicts if Adsterra needs it.
                          const uniqueAdsterraId = `adsterra-container-${adInsertCount}-${Date.now()}`;
                          adsterraPlaceholderDiv.id = uniqueAdsterraId;
                          adContainerForScript.appendChild(adsterraPlaceholderDiv);

                          // 2. Create the Adsterra script tag.
                          const adsterraScriptTag = document.createElement('script');
                          adsterraScriptTag.async = true;
                          adsterraScriptTag.setAttribute('data-cfasync', 'false'); // Common attribute for Adsterra

                          // **REPLACE THIS SRC with your actual Adsterra script URL.**
                          // This URL usually contains a unique identifier for your ad zone/unit.
                          // Example format: //plXXXXXXXXXXXXXXXX.YYYYYYYYYYYYYYYY.com/ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ/invoke.js
                          // Ensure this script is designed to work with the placeholder div created above (uniqueAdsterraId).
                          // Adsterra's "Native Banner" scripts are typically placed *after* the div they target.
                          adsterraScriptTag.src = `//pl12345678.profitablegatetocontent.com/YOUR_ACTUAL_ADSTERRA_SCRIPT_HASH_OR_ZONE_ID/invoke.js`;
                          
                          adContainerForScript.appendChild(adsterraScriptTag);
                          // --- END: ADSTERRA SCRIPT INTEGRATION FOR MOBILE ---

                          const adWrapper = document.createElement('div');
                          adWrapper.className = 'injected-mobile-ad-wrapper';
                          const adDivider = document.createElement('div');
                          adDivider.className = 'divider news-item-divider';
                          
                          adWrapper.appendChild(adContainerForScript); // Append the container with Adsterra script
                          adWrapper.appendChild(adDivider);

                          let insertAfterElement = newsCard;
                          const nextSibling = newsCard.nextElementSibling;
                          if (nextSibling && nextSibling.classList.contains('divider') && nextSibling.classList.contains('news-item-divider')) {
                               insertAfterElement = nextSibling;
                          }
                          insertAfterElement.after(adWrapper);
                          adInsertCount++;
                      }
                  }
              });

              const lastElementInNewsList = newsListContainer.lastElementChild;
              if (lastElementInNewsList && lastElementInNewsList.classList.contains('injected-mobile-ad-wrapper')) {
                  const dividerInWrapper = lastElementInNewsList.querySelector('.divider.news-item-divider');
                  if (dividerInWrapper && lastElementInNewsList.lastElementChild === dividerInWrapper) {
                      dividerInWrapper.remove();
                  }
              }

          } else { // Tablet/Desktop view (>= 768px)
              sidebarAdsContainer.style.display = 'flex'; // Make sure sidebar is flex for desktop
              originalAdNodes.forEach((ad, index) => {
                  // Your existing logic for sidebar ad visibility on desktop
                  if (index === 0) { // Example: Show only the first ad from sidebar on desktop
                      ad.style.display = 'block';
                  } else {
                      ad.style.display = 'none';
                  }
              });

              // Inject NATIVE AD ROWS for desktop (This part remains unchanged by this request)
              const newsArticles = Array.from(newsListContainer.querySelectorAll('.alt-news-card'));
              const articlesPerRow = 6; 

              for (let i = 0; i < newsArticles.length; i += articlesPerRow) {
                  const lastArticleInRow = newsArticles[Math.min(i + articlesPerRow - 1, newsArticles.length - 1)];
                  
                  if (lastArticleInRow) {
                      const nativeAdRow = document.createElement('div');
                      nativeAdRow.className = 'native-ad-row visible-desktop';
                      
                      nativeAdRow.innerHTML = `
                          Promoted Content (Desktop Native Ad Slot)
                      `;
                      
                      if (lastArticleInRow.nextSibling) {
                          newsListContainer.insertBefore(nativeAdRow, lastArticleInRow.nextSibling);
                      } else {
                          newsListContainer.appendChild(nativeAdRow);
                      }
                  }
              }
          }
      }

      // Initial setup when the DOM is ready (call collectOriginalAds before setupAdLayout)
      collectOriginalAds(); 
      setupAdLayout();

      // Debounced resize handler
      let adResizeTimer;
      window.addEventListener('resize', () => {
          clearTimeout(adResizeTimer);
          adResizeTimer = setTimeout(setupAdLayout, 250);
      });
      // --- END: AD LAYOUT LOGIC ---