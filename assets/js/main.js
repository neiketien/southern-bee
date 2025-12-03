document.addEventListener('DOMContentLoaded', () => {
    
    // --- Helper Functions ---
    
    // Show Error Function
    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error-message');
        
        input.classList.add('error');
        errorDisplay.textContent = message;
        errorDisplay.classList.add('visible');
    };

    // Clear Error Function
    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error-message');
        
        input.classList.remove('error');
        errorDisplay.classList.remove('visible');
        errorDisplay.textContent = '';
    };

    // --- Validation Logic ---
    
    const isValidDomain = (email) => {
        return email.trim().toLowerCase().endsWith('@southern-bee.com');
    };

    const isValidPassword = (password) => {
        // Must be 8+ chars, have 1 uppercase, have 1 special char
        const hasLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        return hasLength && hasUpperCase && hasSpecialChar;
    };

    // --- LOGIN FORM ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            // 1. STOP default submission immediately
            e.preventDefault();
            
            let isValid = true;
            const emailInput = document.getElementById('email');
            const passInput = document.getElementById('password');

            // 2. Clear previous errors
            clearError(emailInput);
            clearError(passInput);

            // 3. Validate Email
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!isValidDomain(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address (@southern-bee.com)');
                isValid = false;
            }

            // 4. Validate Password
            if (passInput.value.trim() === '') {
                showError(passInput, 'Please enter your password');
                isValid = false;
            }

            // 5. If everything is valid, proceed
            if (isValid) {
                // Simulate successful login by redirecting
                window.location.href = loginForm.getAttribute('action');
            }
        });
    }

    // --- SIGN UP FORM ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            // 1. STOP default submission immediately
            e.preventDefault();
            
            let isValid = true;
            const nameInput = document.getElementById('fullname');
            const emailInput = document.getElementById('email');
            const passInput = document.getElementById('password');
            const confirmPassInput = document.getElementById('confirm-password');

            // 2. Clear previous errors
            clearError(nameInput);
            clearError(emailInput);
            clearError(passInput);
            clearError(confirmPassInput);

            // 3. Validate Name
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Please enter your full name');
                isValid = false;
            }

            // 4. Validate Email
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!isValidDomain(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address (@southern-bee.com)');
                isValid = false;
            }

            // 5. Validate Password
            if (passInput.value.trim() === '') {
                showError(passInput, 'Please enter your password');
                isValid = false;
            } else if (!isValidPassword(passInput.value)) {
                showError(passInput, 'Password must be at least 8 characters and must include a capital letter and a special character');
                isValid = false;
            }

            // 6. Validate Confirm Password
            if (confirmPassInput.value.trim() === '') {
                showError(confirmPassInput, 'Please confirm your password');
                isValid = false;
            } else if (confirmPassInput.value !== passInput.value) {
                showError(confirmPassInput, 'Passwords do not match');
                isValid = false;
            }

            // 7. If everything is valid, proceed
            if (isValid) {
                alert("Account created successfully!");
                window.location.href = signupForm.getAttribute('action');
            }
        });
    }
    
  
  /* =========================================
     1. THEME MANAGEMENT
     ========================================= */
  
  function initializeTheme() {
    // Get saved theme or default to 'system'
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    // Set the radio button state if it exists (on Settings page)
    const themeRadio = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
    if (themeRadio) {
      themeRadio.checked = true;
    }
    
    // Apply the theme
    applyTheme(savedTheme);
  }
  
  function applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'system') {
      html.removeAttribute('data-theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        html.setAttribute('data-theme', 'dark');
      }
    } else {
      html.setAttribute('data-theme', theme);
    }
  }
  
  function handleThemeChange(event) {
    const selectedTheme = event.target.value;
    localStorage.setItem('theme', selectedTheme);
    applyTheme(selectedTheme);
  }
  
  // Initialize theme on load
  initializeTheme();
  
  // Listen for changes on Settings page
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  themeRadios.forEach(radio => {
    radio.addEventListener('change', handleThemeChange);
  });
  
  // Listen for OS preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentTheme = localStorage.getItem('theme') || 'system';
    if (currentTheme === 'system') {
      applyTheme('system');
    }
  });

  // Save Appearance Button Feedback
  const saveAppearanceBtn = document.querySelector('.card:first-of-type .button-primary'); // Assumes first card on settings is appearance
  if (saveAppearanceBtn && document.querySelector('input[name="theme"]')) {
    saveAppearanceBtn.addEventListener('click', () => {
      const originalText = saveAppearanceBtn.textContent;
      saveAppearanceBtn.textContent = 'Saved!';
      saveAppearanceBtn.style.backgroundColor = 'hsl(var(--success))';
      
      setTimeout(() => {
        saveAppearanceBtn.textContent = originalText;
        saveAppearanceBtn.style.backgroundColor = '';
      }, 2000);
    });
  }


  /* =========================================
     2. GLOBAL UI COMPONENTS (Dropdowns)
     ========================================= */
  
  const userAvatar = document.querySelector('.user-avatar');
  const userDropdown = document.querySelector('.user-dropdown');
  const userMenu = document.querySelector('.user-menu');

  if (userAvatar && userDropdown && userMenu) {
    userAvatar.addEventListener('click', (event) => {
      event.stopPropagation();
      userDropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', (event) => {
      if (!userMenu.contains(event.target)) {
        userDropdown.classList.remove('active');
      }
    });

    userDropdown.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }


  /* =========================================
     3. DASHBOARD: DYNAMIC GREETING
     ========================================= */
  
  const greetingElement = document.querySelector('.header-greeting');
  // Only run if on dashboard (checks if span exists inside)
  if (greetingElement && greetingElement.querySelector('span')) {
      const userNameElement = greetingElement.querySelector('span');
      const userName = userNameElement ? userNameElement.textContent : "User"; 

      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();

      let greetingText = "";

      if (day === 0) greetingText = "Happy Sunday";
      else if (day === 6) greetingText = "Happy Saturday";
      else {
          if (hour >= 5 && hour < 12) greetingText = "Good Morning";
          else if (hour >= 12 && hour < 17) greetingText = "Good Afternoon";
          else if (hour >= 17 && hour < 21) greetingText = "Good Evening";
          else if (hour >= 21) greetingText = "Welcome back";
          else greetingText = "Hello";
      }
      
      greetingElement.innerHTML = `${greetingText}, <span>${userName}</span>`;
  }


  /* =========================================
     4. ARTICLES PAGE: TOGGLE DRAFTS/PUBLISHED
     ========================================= */
  
  const showDraftsBtn = document.getElementById('showDraftsBtn');
  const showPublishedBtn = document.getElementById('showPublishedBtn');
  const draftsContent = document.getElementById('draftsContent');
  const publishedContent = document.getElementById('publishedContent');

  if (showDraftsBtn && showPublishedBtn && draftsContent && publishedContent) {
    showDraftsBtn.addEventListener('click', () => {
      draftsContent.style.display = 'block';
      publishedContent.style.display = 'none';
      
      showDraftsBtn.classList.remove('button-outline');
      showDraftsBtn.classList.add('button-primary');
      
      showPublishedBtn.classList.remove('button-primary');
      showPublishedBtn.classList.add('button-outline');
    });

    showPublishedBtn.addEventListener('click', () => {
      draftsContent.style.display = 'none';
      publishedContent.style.display = 'block';
      
      showPublishedBtn.classList.remove('button-outline');
      showPublishedBtn.classList.add('button-primary');
      
      showDraftsBtn.classList.remove('button-primary');
      showDraftsBtn.classList.add('button-outline');
    });
  }


  /* =========================================
     5. CREATE ARTICLE: WORD COUNT & TINYMCE
     ========================================= */
  
  // TinyMCE Init
  if (typeof tinymce !== 'undefined' && document.getElementById('article-content')) {
    tinymce.init({
      selector: 'textarea#article-content',
      plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
      toolbar: 'undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image media | code | help',
      height: 500,
      menubar: 'file edit view insert format tools table help',
      content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:14px; color: #333; background-color: #fff; }', 
      // Note: Ideally pass CSS variables into content_style if TinyMCE supported it natively, or use content_css with a file
      skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
      content_css: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default')
    });
  }

  // Word Count
  const articleTitleInput = document.getElementById('article-title');
  const titleWordCountDisplay = document.getElementById('title-word-count');
  const articleSubheadingInput = document.getElementById('article-subheading');
  const subheadingWordCountDisplay = document.getElementById('subheading-word-count');

  const countWords = (str) => {
    if (!str.trim()) return 0;
    return str.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (articleTitleInput && titleWordCountDisplay) {
    articleTitleInput.addEventListener('input', () => {
      const words = countWords(articleTitleInput.value);
      titleWordCountDisplay.textContent = `${words} / 15 words`;
    });
    // Initial
    titleWordCountDisplay.textContent = `${countWords(articleTitleInput.value)} / 15 words`;
  }

  if (articleSubheadingInput && subheadingWordCountDisplay) {
    articleSubheadingInput.addEventListener('input', () => {
      const words = countWords(articleSubheadingInput.value);
      subheadingWordCountDisplay.textContent = `${words} / 30 words`;
    });
    // Initial
    subheadingWordCountDisplay.textContent = `${countWords(articleSubheadingInput.value)} / 30 words`;
  }

  // Form Submissions (Demo)
  const createArticleForm = document.getElementById('create-article-form');
  if(createArticleForm) {
    createArticleForm.addEventListener('submit', function(event) {
      event.preventDefault(); 
      const articleContent = (typeof tinymce !== 'undefined' && tinymce.get('article-content')) ? tinymce.get('article-content').getContent() : document.getElementById('article-content').value;
      
      console.log('Publishing Article...');
      console.log('Title:', document.getElementById('article-title').value);
      console.log('Content Length:', articleContent.length);
      
      alert('Article published! (Check console)');
    });

    const saveDraftButton = document.getElementById('save-draft-button');
    if(saveDraftButton) {
        saveDraftButton.addEventListener('click', function() {
            alert('Draft saved!');
        });
    }

    const previewButton = document.getElementById('preview-button');
    if(previewButton) {
        previewButton.addEventListener('click', function() {
            const articleTitle = document.getElementById('article-title').value;
            alert(`Previewing: ${articleTitle}`);
        });
    }
  }
});