document.addEventListener('DOMContentLoaded', function() {
    // ---------------------------------------------------------
    // NAVIGATION & HAMBURGER MENU
    // ---------------------------------------------------------
    const checkIconMain = document.getElementById('check-icon-main');
    const checkIconMenu = document.getElementById('check-icon');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('overlay');
    const menuItemsWithSubmenu = document.querySelectorAll('.menu-item-with-submenu');
    
    function syncMenuState(isOpen) {
        if(checkIconMain) checkIconMain.checked = isOpen;
        if(checkIconMenu) checkIconMenu.checked = isOpen;
        
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
    
    if(checkIconMain) {
        checkIconMain.addEventListener('change', function() {
            syncMenuState(this.checked);
        });
    }
    
    if(checkIconMenu) {
        checkIconMenu.addEventListener('change', function() {
            syncMenuState(this.checked);
        });
    }
    
    if(overlay) {
        overlay.addEventListener('click', function() {
            syncMenuState(false);
        });
    }
    
    menuItemsWithSubmenu.forEach(item => {
        if (!item.classList.contains('disabled-submenu')) {
            const anchor = item.querySelector('a');
            item.addEventListener('click', function(e) {
                if (e.target === anchor || e.target === item && !item.querySelector('.submenu').contains(e.target)) {
                    e.preventDefault();
                    this.classList.toggle('active');
                    const submenu = this.querySelector('.submenu');
                    if (submenu) { 
                        submenu.classList.toggle('active');
                    }
                }
            });
        }
    });

    // ---------------------------------------------------------
    // SEARCH LOADER
    // ---------------------------------------------------------
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const loadingScreen = document.getElementById('loading-screen');

    function showInfiniteLoader(event) {
        if (event) {
            event.preventDefault(); 
        }
        if (loadingScreen) {
            loadingScreen.style.display = 'flex'; 
        }
    }

    if (searchButton) {
        searchButton.addEventListener('click', function(event) {
            showInfiniteLoader(event);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                showInfiniteLoader(event); 
            }
        });
    }

    // ---------------------------------------------------------
    // DYNAMIC DATE & TIME
    // ---------------------------------------------------------
    function updateDateTime() {
        const currentDayEl = document.getElementById('currentDay');
        const currentDateTimeEl = document.getElementById('currentDateTime');

        if (!currentDayEl || !currentDateTimeEl) return; 

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

    setInterval(updateDateTime, 1000);
    updateDateTime(); 

    // ---------------------------------------------------------
    // WEATHER WIDGET
    // ---------------------------------------------------------
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
                    console.warn('Error getting location:', error.message);
                    resolve(null); 
                },
                { timeout: 10000 }
            );
        });
    }

    async function getWeatherData(latitude, longitude) {
        if (!latitude || !longitude) return null;
        const apiKey = '5a1accf3740bdafdbdfe7a6d0b187665'; 
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }

    async function getLocationName(latitude, longitude) {
        if (!latitude || !longitude) return null;
        const apiKey = '5a1accf3740bdafdbdfe7a6d0b187665';
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`);
            if (!response.ok) {
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

    function getWeatherIcon(weatherCode) {
        if ((weatherCode >= 200 && weatherCode < 600) || weatherCode === 511) {
            return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" width="20" height="20"><g><path d="M16 18.5L15 21M8 18.5L7 21M12 18.5L11 21M7 15C4.23858 15 2 12.7614 2 10C2 7.23858 4.23858 5 7 5C7.03315 5 7.06622 5.00032 7.09922 5.00097C8.0094 3.2196 9.86227 2 12 2C14.5192 2 16.6429 3.69375 17.2943 6.00462C17.3625 6.00155 17.4311 6 17.5 6C19.9853 6 22 8.01472 22 10.5C22 12.9853 19.9853 15 17.5 15C13.7434 15 11.2352 15 7 15Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`;
        } else if (weatherCode === 800) {
            return `<svg stroke="#ffffff" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="20" height="20"><path d="M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32zM195.2 195.2a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 1 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm543.104 543.104a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248zM64 512a32 32 0 0 1 32-32h64a32 32 0 0 1 0 64H96a32 32 0 0 1-32-32zm768 0a32 32 0 0 1 32-32h64a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32zM195.2 828.8a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248L240.448 828.8a32 32 0 0 1-45.248 0zm543.104-543.104a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248l-45.248 45.248a32 32 0 0 1-45.248 0z" fill="#ffffff"></path></svg>`;
        } else {
            return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-width="1.5" stroke="#ffffff" d="M22 14.3529C22 17.4717 19.4416 20 16.2857 20H11M14.381 9.02721C14.9767 8.81911 15.6178 8.70588 16.2857 8.70588C16.9404 8.70588 17.5693 8.81468 18.1551 9.01498M7.11616 11.6089C6.8475 11.5567 6.56983 11.5294 6.28571 11.5294C3.91878 11.5294 2 13.4256 2 15.7647C2 18.1038 3.91878 20 6.28571 20H7M7.11616 11.6089C6.88706 10.9978 6.7619 10.3369 6.7619 9.64706C6.7619 6.52827 9.32028 4 12.4762 4C15.4159 4 17.8371 6.19371 18.1551 9.01498M7.11616 11.6089C7.68059 11.7184 8.20528 11.9374 8.66667 12.2426M18.1551 9.01498C18.8381 9.24853 19.4623 9.60648 20 10.0614"></path></svg>`;
        }
    }

    function getPlaceholderIcon() {
        return getWeatherIcon(802);
    }

    function updateWeatherWidget(weatherData, locationData) {
        const weatherContainer = document.querySelector('.weather-container');
        if (!weatherContainer) return; 
        
        let weatherDescription = "Weather";
        let temperatureDisplay = "--°C";
        let weatherIconHtml = getPlaceholderIcon();
        let city = "Location";
        let country = "";
        
        if (weatherData) {
            weatherDescription = weatherData.weather[0].main;
            temperatureDisplay = `${Math.round(weatherData.main.temp)}°C`;
            weatherIconHtml = getWeatherIcon(weatherData.weather[0].id);
        }
        
        if (locationData) {
            city = locationData.city || "Unknown City";
            country = locationData.country ? `, ${locationData.country}` : "";
        } else if (!weatherData) {
            city = "Unavailable";
        }
        
        weatherContainer.innerHTML = `
            <div class="weather-info">
                <span class="weather-text">${weatherDescription}</span>
                <div class="icon">${weatherIconHtml}</div>
            </div>
            <div class="temperature">${temperatureDisplay}</div>
            <div class="location">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" xml:space="preserve" fill="#ffffff" stroke="#ffffff" width="12" height="12"><path fill="#ffffff" d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24 C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24 C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z"></path></svg>
                <p><span>${city}</span>${country}</p>
            </div>
        `;
    }

    async function initWeatherWidget() {
        let weatherData = null;
        let locationData = null;
        try {
            const location = await getUserLocation();
            if (location) {
                [weatherData, locationData] = await Promise.all([
                    getWeatherData(location.latitude, location.longitude),
                    getLocationName(location.latitude, location.longitude)
                ]);
            }
        } catch (error) {
            console.error('Error initializing weather widget:', error);
        } finally {
            updateWeatherWidget(weatherData, locationData);
        }
    }

    initWeatherWidget();

    // ---------------------------------------------------------
    // NEWSLETTER
    // ---------------------------------------------------------
    const newsletterEmailInput = document.getElementById('email');
    const newsletterSubscribeButton = document.getElementById('newsletterSubscribeBtn');
    const newsletterErrorMessageElement = document.getElementById('newsletterError');
    const successNotificationElement = document.getElementById('newsletterSuccessNotification');
    let successNotificationTimeout;

    if (newsletterSubscribeButton && newsletterEmailInput && newsletterErrorMessageElement && successNotificationElement) {
        newsletterSubscribeButton.addEventListener('click', function(event) {
            event.preventDefault();

            const emailValue = newsletterEmailInput.value.trim();
            let isValid = true;
            let errorMessageText = "";

            if (emailValue === "") {
                isValid = false;
                errorMessageText = "Email address cannot be empty.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                isValid = false;
                errorMessageText = "Please enter a valid email address.";
            }

            if (!isValid) {
                newsletterErrorMessageElement.textContent = errorMessageText;
                newsletterErrorMessageElement.style.display = 'block';
                newsletterEmailInput.classList.add('error');
                successNotificationElement.classList.remove('active');
                if (successNotificationTimeout) {
                    clearTimeout(successNotificationTimeout);
                }
            } else {
                newsletterErrorMessageElement.style.display = 'none';
                newsletterEmailInput.classList.remove('error');
                console.log("Subscribed with email:", emailValue);
                newsletterEmailInput.value = "";
                successNotificationElement.textContent = "You have successfully subscribed to our weekly newsletter!";
                successNotificationElement.classList.add('active');
                if (successNotificationTimeout) {
                    clearTimeout(successNotificationTimeout);
                }
                successNotificationTimeout = setTimeout(() => {
                    successNotificationElement.classList.remove('active');
                }, 5000);
            }
        });
    }

    // ---------------------------------------------------------
    // CAROUSEL
    // ---------------------------------------------------------
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const items = document.querySelectorAll('.carousel-item');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        const indicators = document.querySelectorAll('.indicator');
        
        let currentIndex = 0;
        const totalItems = items.length;
        
        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        updateCarousel();
        
        let autoScroll = setInterval(next, 3500);
        
        const resetInterval = () => {
            clearInterval(autoScroll);
            autoScroll = setInterval(next, 3500);
        };
        
        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                updateCarousel();
                resetInterval();
            });
        }
        
        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                next();
                resetInterval();
            });
        }
        
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                currentIndex = parseInt(indicator.dataset.index);
                updateCarousel();
                resetInterval();
            });
        });
        
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
                next();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                updateCarousel();
            }
        }
        
        function next() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }
        
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoScroll);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoScroll = setInterval(next, 3000);
        });
        
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
    }

    // ---------------------------------------------------------
    // PILLS / FEATURED CONTENT TABS
    // ---------------------------------------------------------
    const pills = document.querySelectorAll('.pill');
    const contentSections = document.querySelectorAll('.featured-content-section');
    
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.getAttribute('data-category');
            pills.forEach(p => p.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            pill.classList.add('active');
            const targetSection = document.getElementById(category);
            if(targetSection) targetSection.classList.add('active');
        });
    });

    // ---------------------------------------------------------
    // COOKIE POPUP
    // ---------------------------------------------------------
    const cookiePopup = document.getElementById('cookiePopup');
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    if (cookiePopup && !getCookie('cookiesAccepted') && !getCookie('cookiesConfigured')) {
        setTimeout(function() {
            cookiePopup.classList.add('show');
        }, 1500);
    }
    
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', function() {
            document.cookie = "cookiesAccepted=all; max-age=" + 60*60*24*365 + "; path=/";
            cookiePopup.classList.remove('show');
            setTimeout(function() {
                cookiePopup.style.display = 'none';
            }, 500);
        });
    }
    
    const manageCookiesBtn = document.getElementById('manageCookies');
    if (manageCookiesBtn) {
        manageCookiesBtn.addEventListener('click', function() {
            const preferencesSection = document.getElementById('cookiePreferences');
            const actionButtons = document.querySelector('.actions');
            
            if (preferencesSection.style.display === 'block') {
                preferencesSection.style.display = 'none';
                cookiePopup.classList.remove('expanded');
                actionButtons.style.display = 'flex';
            } else {
                preferencesSection.style.display = 'block';
                cookiePopup.classList.add('expanded');
                actionButtons.style.display = 'none';
            }
        });
    }
    
    const savePreferencesBtn = document.getElementById('savePreferences');
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', function() {
            const marketingCookies = document.getElementById('marketingCookies').checked;
            const statisticsCookies = document.getElementById('statisticsCookies').checked;
            
            document.cookie = "necessaryCookies=true; max-age=" + 60*60*24*365 + "; path=/"; 
            document.cookie = "marketingCookies=" + marketingCookies + "; max-age=" + 60*60*24*365 + "; path=/";
            document.cookie = "statisticsCookies=" + statisticsCookies + "; max-age=" + 60*60*24*365 + "; path=/";
            document.cookie = "cookiesConfigured=true; max-age=" + 60*60*24*365 + "; path=/";
            
            cookiePopup.classList.remove('show');
            setTimeout(function() {
                cookiePopup.style.display = 'none';
            }, 500);
        });
    }
    
    // ---------------------------------------------------------
    // AD LAYOUT LOGIC 1: HOMEPAGE (LIST/SIDEBAR)
    // ---------------------------------------------------------
    const newsListContainer = document.querySelector('.mobile-latest-news'); // Adjusted selector based on index.html structure
    const sidebarAdsContainer = document.querySelector('.sidebar');
    
    // Only run if we are on a page with these containers
    if (newsListContainer && sidebarAdsContainer) {
        let originalAdNodes = []; 

        function collectOriginalAds() {
            if (sidebarAdsContainer && originalAdNodes.length === 0) {
                // Assuming ads in sidebar are marked with .ad-unit or similar
                originalAdNodes = Array.from(sidebarAdsContainer.querySelectorAll('.ad-unit'));
            }
        }

        function setupAdLayout() {
            const screenWidth = window.innerWidth;
            
            // Cleanup previously injected mobile ads
            document.querySelectorAll('.injected-mobile-ad-wrapper').forEach(wrapper => wrapper.remove());
            
            if (screenWidth < 768) { 
                // Mobile View Logic
                const allNewsCards = Array.from(newsListContainer.querySelectorAll('.mobile-latest-news-card'));
                let adInsertCount = 0;

                allNewsCards.forEach((newsCard, index) => {
                    if ((index + 1) % 2 === 0) { // Example: Every 2nd card
                        // Mobile ad injection logic here if dynamic injection is required beyond static HTML
                        // The index.html provided already has static ads interleaved.
                        // This block is kept for dynamic consistency if referenced from script.js logic.
                    }
                });
            } 
            // Desktop logic handles CSS display properties via media queries mostly
        }

        collectOriginalAds(); 
        setupAdLayout();

        let adResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(adResizeTimer);
            adResizeTimer = setTimeout(setupAdLayout, 250);
        });
    }
    
    // ---------------------------------------------------------
    // AD LAYOUT LOGIC 1.5: NEWS LISTING PAGE (GRID/SIDEBAR SWAP)
    // ---------------------------------------------------------
    const newsListGridContainer = document.querySelector('.news-article-list');
    const newsListSidebarAds = document.querySelector('.alt-sidebar-ads-list');
    
    if (newsListGridContainer && newsListSidebarAds) {
        let originalAdNodesNews = []; 

        function collectOriginalAdsNews() {
            if (newsListSidebarAds && originalAdNodesNews.length === 0) {
                originalAdNodesNews = Array.from(newsListSidebarAds.querySelectorAll('.alt-ad-unit'));
            }
        }

        function setupNewsListAdLayout() {
            const screenWidth = window.innerWidth;

            // 1. Cleanup: Remove ads previously injected
            document.querySelectorAll('.injected-mobile-ad-wrapper').forEach(wrapper => wrapper.remove());
            document.querySelectorAll('.native-ad-row').forEach(adRow => adRow.remove()); 

            originalAdNodesNews.forEach(ad => {
                ad.style.display = ''; 
                ad.classList.remove('injected-mobile-ad');
            });

            if (screenWidth < 768) { // Mobile view
                newsListSidebarAds.style.display = 'none';
                const allNewsCards = Array.from(newsListGridContainer.querySelectorAll('.alt-news-card'));
                let adInsertCount = 0;

                allNewsCards.forEach((newsCard, index) => {
                    if ((index + 1) % 3 === 0) { // Insert after every 3rd card
                        if (originalAdNodesNews.length > 0) {
                            
                            // Create Ad Container
                            const adContainerForScript = document.createElement('div');
                            adContainerForScript.className = 'alt-ad-unit injected-mobile-ad'; 
                            adContainerForScript.style.display = 'block';

                            // 1. Placeholder Div
                            const adsterraPlaceholderDiv = document.createElement('div');
                            const uniqueAdsterraId = `adsterra-container-news-${adInsertCount}-${Date.now()}`;
                            adsterraPlaceholderDiv.id = uniqueAdsterraId;
                            adContainerForScript.appendChild(adsterraPlaceholderDiv);

                            // 2. Script Tag (Replace SRC with actual)
                            const adsterraScriptTag = document.createElement('script');
                            adsterraScriptTag.async = true;
                            adsterraScriptTag.setAttribute('data-cfasync', 'false');
                            adsterraScriptTag.src = `//pl12345678.profitablegatetocontent.com/YOUR_ACTUAL_ADSTERRA_SCRIPT_HASH_OR_ZONE_ID/invoke.js`;
                            
                            adContainerForScript.appendChild(adsterraScriptTag);

                            const adWrapper = document.createElement('div');
                            adWrapper.className = 'injected-mobile-ad-wrapper';
                            const adDivider = document.createElement('div');
                            adDivider.className = 'divider news-item-divider';
                            
                            adWrapper.appendChild(adContainerForScript);
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

                // Cleanup trailing dividers if necessary
                const lastElement = newsListGridContainer.lastElementChild;
                if (lastElement && lastElement.classList.contains('injected-mobile-ad-wrapper')) {
                    const dividerInWrapper = lastElement.querySelector('.divider.news-item-divider');
                    if (dividerInWrapper && lastElement.lastElementChild === dividerInWrapper) {
                        dividerInWrapper.remove();
                    }
                }

            } else { // Desktop view (>= 768px)
                newsListSidebarAds.style.display = 'flex'; 
                
                // Show first sidebar ad, hide others (per original logic)
                originalAdNodesNews.forEach((ad, index) => {
                    if (index === 0) {
                        ad.style.display = 'block';
                    } else {
                        ad.style.display = 'none';
                    }
                });

                // Inject Desktop Native Ad Rows
                const newsArticles = Array.from(newsListGridContainer.querySelectorAll('.alt-news-card'));
                const articlesPerRow = 6; 

                for (let i = 0; i < newsArticles.length; i += articlesPerRow) {
                    const lastArticleInRow = newsArticles[Math.min(i + articlesPerRow - 1, newsArticles.length - 1)];
                    
                    if (lastArticleInRow) {
                        const nativeAdRow = document.createElement('div');
                        nativeAdRow.className = 'native-ad-row visible-desktop';
                        nativeAdRow.innerHTML = `Promoted Content (Desktop Native Ad Slot)`;
                        
                        if (lastArticleInRow.nextSibling) {
                            newsListGridContainer.insertBefore(nativeAdRow, lastArticleInRow.nextSibling);
                        } else {
                            newsListGridContainer.appendChild(nativeAdRow);
                        }
                    }
                }
            }
        }

        collectOriginalAdsNews(); 
        setupNewsListAdLayout();

        let newsAdResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(newsAdResizeTimer);
            newsAdResizeTimer = setTimeout(setupNewsListAdLayout, 250);
        });
    }
    
    // ---------------------------------------------------------
    // AD LAYOUT LOGIC 2: SINGLE ARTICLE (PARAGRAPHS)
    // ---------------------------------------------------------
    const mainContent = document.querySelector('.news-main-content');
    if (mainContent) {
        // Remove existing ads to prevent duplication if script runs twice
        const existingAdsInMainContent = mainContent.querySelectorAll('.news-ad-unit');
        existingAdsInMainContent.forEach(ad => ad.remove());
        
        const paragraphs = mainContent.querySelectorAll('p');
        const adUnitHTML = `
            <div class="news-ad-unit">Promoted content</div>
        `;
        
        for (let i = 0; i < paragraphs.length; i++) {
            // Insert after every 4th paragraph
            if ((i + 1) % 4 === 0) {
                const currentParagraph = paragraphs[i];
                currentParagraph.insertAdjacentHTML('afterend', adUnitHTML);
            }
        }
    }
});
