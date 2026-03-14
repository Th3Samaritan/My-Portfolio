/* ============================================================
   Portfolio – Shared JavaScript
   Theme toggle, mobile menu, scroll animations, service worker.
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
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.remove('open');
            }
        });
    }

    // === Smooth Scrolling ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            // Close mobile menu if open
            if (mobileMenu) mobileMenu.classList.remove('open');
        });
    });

    // === Scroll Fade-in Animation ===
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Counter animation trigger
                if (entry.target.id === 'counters') {
                    startCounters();
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // === Counter Animation ===
    function startCounters() {
        document.querySelectorAll('.count').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            animateCount(counter, target, 2000);
        });
        document.querySelectorAll('[data-client-target]').forEach(counter => {
            const target = +counter.getAttribute('data-client-target');
            animateCount(counter, target, 2000);
        });
    }

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

    // === Footer Year ===
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.innerText = new Date().getFullYear();
    }

    // === Preloader ===
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }
    });

    // === Service Worker Registration ===
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/My-Portfolio/sw.js')
                .then(reg => console.log('SW registered:', reg.scope))
                .catch(err => console.log('SW registration failed:', err));
        });
    }

})();
