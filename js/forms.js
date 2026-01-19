(function () {

    const SITE_KEY = 'SITE_KEY'; // 🔴

    /* ===============================
       ERROR HANDLING (CLASS ONLY)
    =============================== */

    function setError(input) {
        input.classList.add('error');
    }

    function clearError(input) {
        input.classList.remove('error');
    }

    /* ===============================
       VALIDATION
    =============================== */

    function validateInput(input) {
        clearError(input);

        const value = input.value.trim();

        if (input.required && !value) {
            setError(input);
            return false;
        }

        if (input.type === 'email') {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(value)) {
                setError(input);
                return false;
            }
        }

        if (input.type === 'tel') {
            const re = /^\+?[0-9\s()-]{7,20}$/;
            if (!re.test(value)) {
                setError(input);
                return false;
            }
        }

        if (input.minLength > 0 && value.length < input.minLength) {
            setError(input);
            return false;
        }

        return true;
    }

    function validateForm(form) {
        let valid = true;

        [...form.elements].forEach(el => {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (!validateInput(el)) valid = false;
            }
        });

        return valid;
    }

    /* ===============================
       PHONE INPUT FILTER
    =============================== */

    function initPhoneInputs() {
        document.querySelectorAll('input[type="tel"]').forEach(input => {

            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9+\s()-]/g, '');
            });

        });
    }

    /* ===============================
       FORM INIT
    =============================== */

    function initForm(formId, url, action) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateForm(form)) return;

            grecaptcha.ready(() => {
                grecaptcha.execute(SITE_KEY, { action }).then(token => {

                    let tokenInput = form.querySelector('[name="recaptcha_token"]');
                    if (!tokenInput) {
                        tokenInput = document.createElement('input');
                        tokenInput.type = 'hidden';
                        tokenInput.name = 'recaptcha_token';
                        form.appendChild(tokenInput);
                    }
                    tokenInput.value = token;

                    fetch(url, {
                        method: 'POST',
                        body: new FormData(form)
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                form.reset();
                            }
                        });
                });
            });
        });
    }

    /* ===============================
       START
    =============================== */

    document.addEventListener('DOMContentLoaded', () => {
        initPhoneInputs();
        initForm('contactForm', 'php/send-contact.php', 'contact');
        initForm('subscribeForm', 'php/send-subscribe.php', 'subscribe');
    });

})();
