/* ============================================================
   Portfolio – Shared JavaScript (Premium Rebrand)
   Theme toggle, mobile menu, scroll-spy, staggered animations,
   typewriter effect, preloader, and service worker.
   ============================================================ */

(function () {
    'use strict';

    // === Theme Toggle ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    function applyTheme() {
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        document.documentElement.classList.toggle('dark', isDark);
        if (darkIcon && lightIcon) {
            darkIcon.style.display = isDark ? 'block' : 'none';
            lightIcon.style.display = isDark ? 'none' : 'block';
        }
    }

    applyTheme();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = !document.documentElement.classList.contains('dark');
            document.documentElement.classList.toggle('dark', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (darkIcon && lightIcon) {
                darkIcon.style.display = isDark ? 'block' : 'none';
                lightIcon.style.display = isDark ? 'none' : 'block';
            }
        });
    }

    // === Mobile Menu ===
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const isOpen = mobileMenu.classList.contains('open');
            mobileMenuButton.setAttribute('aria-expanded', isOpen);
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.remove('open');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // === Smooth Scrolling & Sticky Header Offset ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // approximate height of sticky header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            if (mobileMenu) mobileMenu.classList.remove('open');
        });
    });

    // === Scroll-Spy Navigation ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;
        const headerHeight = 90;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // === Staggered Animations (Reveal) ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's the counters section, trigger count animation
                if (entry.target.id === 'counters' && !entry.target.classList.contains('counted')) {
                    startCounters();
                    entry.target.classList.add('counted');
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el, index) => {
        // Automatically add transition delays based on DOM order for staggered lists
        if (el.parentElement.classList.contains('grid') && !el.style.transitionDelay) {
            const delay = (index % 4) * 100; // max 4 items in a row delay
            el.style.transitionDelay = `${delay}ms`;
        }
        revealObserver.observe(el);
    });

    // === Typewriter Effect (Hero) ===
    const typeTarget = document.getElementById('typewriter-text');
    if (typeTarget) {
        const phrases = [
            "Solving the 3-Body Problem of Modern Tech.",
            "Building Secure Software Architectures.",
            "Simulating Advanced Composite Materials.",
            "Developing Predictive ML Models.",
            "Executing Red Team Operations."
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 50;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typeTarget.innerText = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 30; // Faster when deleting
            } else {
                typeTarget.innerText = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 60;
            }

            // Word completed
            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at end of text
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500; // Pause before typing new word
            }

            setTimeout(typeLoop, typeSpeed);
        }

        // Delay typing until preloader finishes
        setTimeout(typeLoop, 2000); 
    }

    // === Counter Animation ===
    function startCounters() {
        function animateCount(element, target, duration) {
            const startTime = performance.now();
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                if (elapsed > duration) {
                    element.innerText = target;
                    return;
                }
                const progress = elapsed / duration;
                const eased = progress * (2 - progress); // easeOutQuad
                element.innerText = Math.floor(eased * target);
                requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }

        document.querySelectorAll('.count').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if(target) animateCount(counter, target, 2000);
        });
        document.querySelectorAll('[data-client-target]').forEach(counter => {
            const target = +counter.getAttribute('data-client-target');
            if(target) animateCount(counter, target, 2000);
        });
    }

    // === Footer Year ===
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    // === Branded Preloader ===
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            // Keep the branded loader visible slightly longer for the animation to play
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 1200);
        }
    });

    // === Service Worker & PWA Integration ===
    let deferredPrompt;
    
    // Listen for the install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('PWA is installable. Event trapped.');
        // We can show a custom install UI here later if desired.
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/My-Portfolio/sw.js')
                .then(reg => console.log('SW registered:', reg.scope))
                .catch(err => console.log('SW registration failed:', err));
        });
    }

})();

