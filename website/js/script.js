document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('portfolio-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const gallery = document.querySelector('.portfolio-gallery');
    let isOpen = false;
    let animationFrame;
    let offset = 0;
    const speed = 0.75;

    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.menu ul');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isMenuOpen = navMenu.classList.contains('show');
            
            if (isMenuOpen) {
                navMenu.classList.remove('show');
                mobileMenuToggle.classList.remove('active');
            } else {
                navMenu.classList.add('show');
                mobileMenuToggle.classList.add('active');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('show');
                mobileMenuToggle.classList.remove('active');
            }
        });

        // Close mobile menu when a link is clicked
        navMenu.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                navMenu.classList.remove('show');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // Build infinite track
    const originalItems = Array.from(gallery.querySelectorAll('.portfolio-item'));
    const inner = document.createElement('div');
    inner.className = 'portfolio-inner';

    const itemGap = 20;
    const itemHeight = originalItems[0].offsetHeight + itemGap;
    const centerOffset = (gallery.clientHeight - originalItems[0].offsetHeight) / 2;

    originalItems.forEach(item => inner.appendChild(item));
    originalItems.forEach(item => inner.appendChild(item.cloneNode(true)));
    gallery.appendChild(inner);

    inner.style.top = `${centerOffset}px`;

    const allItems = Array.from(inner.querySelectorAll('.portfolio-item'));

    toggleBtn.addEventListener('click', function() {
        isOpen = !isOpen;

        // Check if we're on mobile/tablet (≤992px)
        const isMobile = window.innerWidth <= 992;

        if (isOpen) {
            if (isMobile) {
                sidebar.classList.add('open');
                toggleBtn.style.bottom = '420px'; // Position above the opened sidebar
                toggleBtn.style.right = '20px';
            } else {
                sidebar.style.right = '0';
                toggleBtn.style.right = '270px';
            }
            startAutoScroll();
        } else {
            if (isMobile) {
                sidebar.classList.remove('open');
                toggleBtn.style.bottom = '20px';
                toggleBtn.style.right = '20px';
            } else {
                sidebar.style.right = '-250px';
                toggleBtn.style.right = '20px';
            }
            stopAutoScroll();
        }
    });

    function animate() {
        offset += speed;
        const trackHeight = itemHeight * originalItems.length;
        offset %= trackHeight;

        inner.style.transform = `translateY(${-offset}px)`;

        const galleryCenter = gallery.clientHeight / 2 + gallery.getBoundingClientRect().top;
        allItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;
            const distance = Math.min(Math.abs(galleryCenter - itemCenter), gallery.clientHeight / 2);
            const normalized = 1 - distance / (gallery.clientHeight / 2);
            const scale = 0.95 + normalized * 0.1;
            const translateY = 15 * (1 - normalized);
            const blur = 1.2 * (1 - normalized);
            item.style.transform = `translateY(${translateY}px) scale(${scale})`;
            item.style.filter = `blur(${blur}px)`;
            item.querySelector('.caption').style.transform = `translateY(${10 * (1 - normalized)}px)`;
        });

        animationFrame = requestAnimationFrame(animate);
    }

    function startAutoScroll() {
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(animate);
        }
    }

    function stopAutoScroll() {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    // Handle window resize to update sidebar positioning
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 992;

        if (isOpen) {
            if (isMobile) {
                sidebar.style.right = 'auto';
                sidebar.classList.add('open');
                toggleBtn.style.right = 'auto';
                toggleBtn.style.bottom = '420px';
            } else {
                sidebar.classList.remove('open');
                sidebar.style.right = '0';
                toggleBtn.style.bottom = 'auto';
                toggleBtn.style.right = '270px';
            }
        } else {
            if (isMobile) {
                sidebar.classList.remove('open');
                toggleBtn.style.bottom = '20px';
                toggleBtn.style.right = '20px';
            } else {
                sidebar.style.right = '-250px';
                toggleBtn.style.right = '20px';
                toggleBtn.style.bottom = 'auto';
            }
        }
    });

    // Initialize sidebar positioning based on screen size
    function initializeSidebarPosition() {
        const isMobile = window.innerWidth <= 992;

        if (isMobile) {
            sidebar.style.right = 'auto';
            sidebar.classList.remove('open');
            toggleBtn.style.right = '20px';
            toggleBtn.style.bottom = '20px';
        } else {
            sidebar.style.right = '-250px';
            sidebar.classList.remove('open');
            toggleBtn.style.right = '20px';
            toggleBtn.style.bottom = 'auto';
        }
    }

    // Initialize on page load
    initializeSidebarPosition();

    // --- FORM 1: CONTACT FORM LOGIC ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const fields = {
            type: document.querySelector('input[name="type"]'),
            fname: document.getElementById('fname'),
            gender: document.querySelector('input[name="gender"]'),
            mobile: document.getElementById('mobile'),
            email: document.getElementById('email'),
            dob: document.getElementById('dob'),
            language: document.getElementById('language'),
            message: document.getElementById('message')
        };

        const errorIds = {
            type: 'type-error',
            fname: 'fname-error',
            gender: 'gender-error',
            mobile: 'mobile-error',
            email: 'email-error',
            dob: 'dob-error',
            language: 'language-error',
            message: 'message-error'
        };

        function showError(fieldName, message) {
            const errorEl = document.getElementById(errorIds[fieldName]);
            const input = fields[fieldName];
            if (errorEl) errorEl.textContent = message;
            if (input && !(input instanceof NodeList)) input.classList.add('invalid');
        }

        function clearError(fieldName) {
            const errorEl = document.getElementById(errorIds[fieldName]);
            const input = fields[fieldName];
            if (errorEl) errorEl.textContent = '';
            if (input && !(input instanceof NodeList)) input.classList.remove('invalid');
        }

        function validateContactForm() {
            const errors = {};
            const typeValue = document.querySelector('input[name="type"]:checked');
            const genderValue = document.querySelector('input[name="gender"]:checked');
            const nameValue = fields.fname.value.trim();
            const mobileValue = fields.mobile.value.trim();
            const emailValue = fields.email.value.trim();
            const dobValue = fields.dob.value;
            const languageValue = fields.language.value;
            const messageValue = fields.message.value.trim();

            if (!typeValue) errors.type = 'اختر نوع التواصل أولاً.';
            if (!nameValue || nameValue.length < 3) errors.fname = 'الاسم يجب أن يحتوي على 3 أحرف على الأقل.';
            if (!genderValue) errors.gender = 'اختر الجنس.';
            if (!mobileValue || !/^05[0-9]{8}$/.test(mobileValue)) errors.mobile = 'رقم جوال غير صحيح.';
            if (!emailValue || !emailValue.includes('@')) errors.email = 'اكتب بريداً إلكترونياً صالحاً.';
            if (!dobValue) errors.dob = 'اختر تاريخ الميلاد.';
            if (!languageValue) errors.language = 'اختر لغة التواصل.';
            if (!messageValue || messageValue.length < 10) errors.message = 'الرسالة يجب أن تحتوي على 10 أحرف.';

            return errors;
        }

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formSuccess = document.getElementById('form-success');
            const errors = validateContactForm();
            Object.keys(errorIds).forEach(key => clearError(key));

            if (Object.keys(errors).length > 0) {
                Object.entries(errors).forEach(([field, message]) => showError(field, message));
                return;
            }

            const formData = {
                type: document.querySelector('input[name="type"]:checked')?.value,
                fname: fields.fname.value,
                gender: document.querySelector('input[name="gender"]:checked')?.value,
                mobile: fields.mobile.value,
                email: fields.email.value,
                dob: fields.dob.value,
                language: fields.language.value,
                message: fields.message.value
            };

            fetch("/process-contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(result => {
                formSuccess.style.color = result.status ? "green" : "red";
                formSuccess.textContent = result.message || ("Error: " + result.errors.join(" | "));
                if (result.status) contactForm.reset();
            })
            .catch(() => { formSuccess.style.color = "red"; formSuccess.textContent = "فشل الاتصال بالخادم."; });
        });
    }

    // --- FORM 2: PARTICIPATION FORM & RETRIEVAL LOGIC ---
    const contributionForm = document.getElementById('contributionForm');
    
    function loadContributions() {
        const displayArea = document.querySelector('.featured-cards');
        if (!displayArea) return;

        fetch("/get-contributions")
            .then(res => res.json())
            .then(data => {
                displayArea.innerHTML = data.map(item => `
                    <div class="featured-card">
                        <span class="tag">${item.type}</span>
                        <p class="author-name">${item.name}</p>
                        <p class="description">${item.message}</p>
                    </div>
                `).join('');
            });
    }

    if (contributionForm) {
        contributionForm.addEventListener('submit', function(event) {
            event.preventDefault(); // This stops the "raw JSON" screen from appearing
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            // Using the unique ID we discussed to ensure data is captured
            const message = document.getElementById('contrib-message').value.trim();

            if (name.length < 3 || !email.includes('@') || message.length < 10) {
                alert("يرجى التأكد من ملء الحقول بشكل صحيح.");
                return;
            }

            const formData = {
                name: name,
                email: email,
                type: document.getElementById('type').value,
                message: message
            };

            // FIXED: Properly chained fetch to handle the response
            fetch("/process-participation", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(result => {
                // This will now show as a nice popup instead of a new page
                if (result.status) {
                    alert(result.message);
                    contributionForm.reset();
                    loadContributions(); // Updates the UI with your new entry!
                } else {
                    alert("خطأ: " + result.errors.join(" | "));
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                alert("فشل الاتصال بالخادم.");
            });
        });
        loadContributions(); 
    }
});