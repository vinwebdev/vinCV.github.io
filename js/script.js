/**
 * Air & Sea Logistics - Core JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize EmailJS
    // Replace with your actual Public Key from EmailJS Dashboard
    (function() {
        emailjs.init({
          publicKey: "YOUR_PUBLIC_KEY",
        });
    })();

    // 2. Header Scroll Effect
    const header = document.getElementById('siteHeader');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    // 3. Mobile Menu Logic
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // 4. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Background Image Slider
    const initSliders = () => {
        const sliders = document.querySelectorAll('.service-card.has-slider');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        sliders.forEach(card => {
            const slides = (card.dataset.slides || '').split(',').map(s => s.trim()).filter(Boolean);
            if (slides.length < 2) return;

            const interval = parseInt(card.dataset.interval) || 4000;
            const speed = parseInt(card.dataset.speed) || 1200;
            card.style.setProperty('--slide-speed', `${speed}ms`);

            // Create slide layers
            const layers = slides.map((src, index) => {
                const layer = document.createElement('div');
                layer.className = `slide-bg ${index === 0 ? 'is-active' : ''}`;
                layer.style.backgroundImage = `url('${src}')`;
                card.prepend(layer);
                return layer;
            });

            if (reduceMotion) return;

            let current = 0;
            setInterval(() => {
                layers[current].classList.remove('is-active');
                current = (current + 1) % layers.length;
                layers[current].classList.add('is-active');
            }, interval);
        });
    };
    initSliders();

    // 6. Form Submission (EmailJS)
    const quoteForm = document.getElementById('quoteForm');
    const formNote = document.getElementById('formNote');
    const submitBtn = document.getElementById('submitBtn');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Basic Validation
            if (!quoteForm.checkValidity()) {
                quoteForm.reportValidity();
                return;
            }

            // UI State: Loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formNote.textContent = 'Sending your request...';
            formNote.style.color = 'var(--blue)';

            // Prepare template parameters for EmailJS
            // Note: These keys must match your EmailJS Template variables
            const templateParams = {
                from_name: document.getElementById('fullName').value,
                from_email: document.getElementById('email').value,
                company: document.getElementById('company').value || 'N/A',
                phone: document.getElementById('phone').value || 'N/A',
                shipment_type: document.getElementById('shipmentType').value,
                message: document.getElementById('message').value,
                to_email: 'gonzales.marvin.2023@gmail.com'
            };

            // Send via EmailJS
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID'
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then(() => {
                    // Success
                    formNote.textContent = 'Success! Your request has been sent. We will contact you shortly.';
                    formNote.style.color = '#2e7d32';
                    quoteForm.reset();
                })
                .catch((error) => {
                    // Error
                    console.error('EmailJS Error:', error);
                    formNote.textContent = 'Oops! Something went wrong. Please try again or call us directly.';
                    formNote.style.color = '#d32f2f';
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Request a Quote';
                });
        });
    }

    // 7. WhatsApp & Call Now safety handlers
    // Handled by native <a> tags with tel: and wa.me, 
    // but we can add tracking or validation here if needed.
});
