// script.js - Main JavaScript file for the website
// Scroll Animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Add animation classes to features on load
    const features = document.querySelectorAll('#features .grid > div');
    features.forEach((feature, index) => {
        feature.classList.add('animate__animated', 'animate__fadeInUp');
        feature.style.animationDelay = `${index * 0.2}s`;
    });

    // Add animation to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.classList.add('animate__animated', 'animate__fadeIn');
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Update connect links from ?serverId=xxxxx if present
    try {
        const params = new URLSearchParams(window.location.search);
        const serverId = params.get('serverId');
        const joinUrl = serverId ? `https://cfx.re/join/${serverId}` : '#';
        const connectLink = document.getElementById('connectLink');
        if (connectLink) connectLink.setAttribute('href', joinUrl);
        document.querySelectorAll('[data-connect-link]')
            .forEach(el => el.setAttribute('href', joinUrl));
    } catch (e) {
        console.warn('Unable to parse serverId from URL:', e);
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('#home');
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    
    if (heroSection) {
        heroSection.style.backgroundPositionY = `${rate}px`;
    }
});

// Mobile menu functionality
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const menuItems = document.querySelector('nav .hidden');
    
    if (nav && menuItems) {
        const hamburger = document.createElement('div');
        hamburger.className = 'md:hidden cursor-pointer p-2';
        hamburger.innerHTML = `
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        `;
        
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu flex flex-col items-center justify-center space-y-8';
        mobileMenu.innerHTML = menuItems.innerHTML;
        
        nav.appendChild(hamburger);
        document.body.appendChild(mobileMenu);
        
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }
};

createMobileMenu(); 