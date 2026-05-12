document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('portfolio-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const gallery = document.querySelector('.portfolio-gallery');
    let isOpen = false;
    let animationFrame;
    let offset = 0;
    const speed = 0.75;

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
        if (isOpen) {
            sidebar.style.right = '0';
            toggleBtn.style.right = '270px';
            startAutoScroll();
        } else {
            sidebar.style.right = '-250px';
            toggleBtn.style.right = '20px';
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

    const startDelay = 200;
    setTimeout(() => {
        if (isOpen) startAutoScroll();
    }, startDelay);

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
            if (errorEl) {
                errorEl.textContent = message;
            }
            if (input) {
                if (input instanceof NodeList || input instanceof HTMLCollection) return;
                input.classList.add('invalid');
            }
        }

        function clearError(fieldName) {
            const errorEl = document.getElementById(errorIds[fieldName]);
            const input = fields[fieldName];
            if (errorEl) {
                errorEl.textContent = '';
            }
            if (input && !(input instanceof NodeList || input instanceof HTMLCollection)) {
                input.classList.remove('invalid');
            }
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

            if (!typeValue) {
                errors.type = 'اختر نوع التواصل أولاً.';
            }

            if (!nameValue) {
                errors.fname = 'الاسم الكامل مطلوب.';
            } else if (nameValue.length < 3) {
                errors.fname = 'الاسم يجب أن يحتوي على 3 أحرف على الأقل.';
            } else if (nameValue.length > 50) {
                errors.fname = 'الاسم لا يمكن أن يتجاوز 50 حرفاً.';
            } else if (!/^[A-Za-zأ-ي\s]+$/.test(nameValue)) {
                errors.fname = 'استخدم حروفاً عربية أو إنجليزية فقط.';
            }

            if (!genderValue) {
                errors.gender = 'اختر الجنس.';
            }

            if (!mobileValue) {
                errors.mobile = 'رقم الجوال مطلوب.';
            } else if (!/^05[0-9]{8}$/.test(mobileValue)) {
                errors.mobile = 'اكتب رقم جوال صحيح من 10 أرقام يبدأ بـ 05.';
            }

            if (!emailValue) {
                errors.email = 'البريد الإلكتروني مطلوب.';
            } else {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailValue)) {
                    errors.email = 'اكتب بريداً إلكترونياً صالحاً.';
                }
            }

            if (!dobValue) {
                errors.dob = 'اختر تاريخ الميلاد.';
            } else {
                const selectedDate = new Date(dobValue);
                const today = new Date();
                if (selectedDate > today) {
                    errors.dob = 'لا يمكن أن يكون تاريخ الميلاد في المستقبل.';
                }
            }

            if (!languageValue) {
                errors.language = 'اختر لغة التواصل المفضلة.';
            }

            if (!messageValue) {
                errors.message = 'اكتب نص الرسالة.';
            } else if (messageValue.length < 10) {
                errors.message = 'الرسالة يجب أن تحتوي على 10 أحرف على الأقل.';
            } else if (messageValue.length > 2500) {
                errors.message = 'الرسالة يجب ألا تتجاوز 2500 حرف.';
            }

            return errors;
        }

      contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop page from refreshing
            const formSuccess = document.getElementById('form-success');
            const errors = validateContactForm();

            Object.keys(errorIds).forEach(key => clearError(key));
            if (formSuccess) formSuccess.textContent = '';

            // Check frontend validation first
            if (Object.keys(errors).length > 0) {
                Object.entries(errors).forEach(([field, message]) => showError(field, message));
                const firstErrorField = Object.keys(errors)[0];
                const firstInput = fields[firstErrorField];
                if (firstInput && !(firstInput instanceof NodeList || firstInput instanceof HTMLCollection)) {
                    firstInput.focus();
                }
                return;
            }

            // Prepare data for the backend in JSON format
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

            // Send AJAX request using JSON Routing
            fetch("/process-contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            .then(response => response.json()) // Parse server response
            .then(result => {
                if (result.status) {
                    // Success: Show server-side message
                    formSuccess.style.color = "green";
                    formSuccess.textContent = result.message; 
                    contactForm.reset();
                } else {
                    // Fail: Show backend validation errors
                    formSuccess.style.color = "red";
                    formSuccess.textContent = "Error: " + result.errors.join(" | "); 
                }
            })
            .catch(error => {
                console.error("Error:", error);
                formSuccess.style.color = "red";
                formSuccess.textContent = "Connection to server failed.";
            });
        });

        ['input', 'change'].forEach(evt => {
            contactForm.querySelectorAll('input, select, textarea').forEach(element => {
                element.addEventListener(evt, () => {
                    if (element.id) {
                        clearError(element.id);
                    }
                });
            });
        });
    }



});