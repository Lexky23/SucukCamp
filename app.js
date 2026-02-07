// ============================================
// Smooth Scroll & Navigation
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#' || href === '') {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Update active link immediately
                if (link.classList.contains('navbar-link')) {
                    navbarLinks.forEach(navLink => navLink.classList.remove('active'));
                    link.classList.add('active');
                }
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // Countdown Timer
    // ============================================
    
    const targetDate = new Date('2026-02-07T12:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            // Countdown finished
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            
            if (daysEl) {
                daysEl.textContent = '00';
                daysEl.classList.remove('updating', 'updated');
            }
            if (hoursEl) {
                hoursEl.textContent = '00';
                hoursEl.classList.remove('updating', 'updated');
            }
            if (minutesEl) {
                minutesEl.textContent = '00';
                minutesEl.classList.remove('updating', 'updated');
            }
            if (secondsEl) {
                secondsEl.textContent = '00';
                secondsEl.classList.remove('updating', 'updated');
            }
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM elements with smooth animation
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        function updateValue(element, newValue) {
            if (!element) return;
            
            const currentValue = element.textContent.trim();
            const formattedValue = String(newValue).padStart(2, '0');
            
            // Only animate if value changed
            if (currentValue !== formattedValue) {
                // Start animation
                element.classList.remove('updated');
                element.classList.add('updating');
                
                // Update value after fade out
                setTimeout(() => {
                    element.textContent = formattedValue;
                    element.classList.remove('updating');
                    element.classList.add('updated');
                    
                    // Remove updated class after animation completes
                    setTimeout(() => {
                        element.classList.remove('updated');
                    }, 300);
                }, 150);
            }
        }
        
        updateValue(daysEl, days);
        updateValue(hoursEl, hours);
        updateValue(minutesEl, minutes);
        updateValue(secondsEl, seconds);
    }
    
    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000); // Update every second
    
    // ============================================
    // Navbar Scroll Effect & Active Link Highlighting
    // ============================================
    
    const navbar = document.getElementById('navbar');
    const navbarLinks = document.querySelectorAll('.navbar-link');
    const sections = document.querySelectorAll('section[id]');
    let lastScroll = 0;
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navbarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Handle hero section (top of page)
        if (window.scrollY < 100) {
            navbarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#hero') {
                    link.classList.add('active');
                }
            });
        }
    }
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active link
        updateActiveLink();
        
        lastScroll = currentScroll;
    });
    
    // Initial active link check
    updateActiveLink();
    
    // ============================================
    // Accessibility: Keyboard Navigation
    // ============================================
    
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('a, button, .btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (this.tagName === 'A') {
                    this.click();
                }
            }
        });
    });
    
    // ============================================
    // Reveal Animations (IntersectionObserver)
    // ============================================
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.classList.contains('channel-card') 
                        ? Array.from(document.querySelectorAll('.channel-card')).indexOf(element) * 60 
                        : 0;
                    
                    setTimeout(() => {
                        element.classList.add('revealed');
                    }, delay);
                    
                    revealObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Immediately show all elements if reduced motion
        const revealElements = document.querySelectorAll('[data-reveal]');
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }
    
    // ============================================
    // SVG Draw Animation (Sucuk Ring)
    // ============================================
    
    if (!prefersReducedMotion) {
        const sucukRing = document.querySelector('.hero-sucuk-ring');
        if (sucukRing) {
            const drawPaths = sucukRing.querySelectorAll('.draw-path');
            
            const drawObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        drawPaths.forEach((path, index) => {
                            setTimeout(() => {
                                path.classList.add('drawn');
                            }, index * 200);
                        });
                        drawObserver.disconnect();
                    }
                });
            }, {
                threshold: 0.2
            });
            
            drawObserver.observe(sucukRing);
        }
    } else {
        // Immediately draw if reduced motion
        const drawPaths = document.querySelectorAll('.draw-path');
        drawPaths.forEach(path => {
            path.classList.add('drawn');
        });
    }
    
    // ============================================
    // Spice Float Parallax (Knoblauch & Chili)
    // ============================================
    
    if (!prefersReducedMotion) {
        const garlic = document.querySelector('.concept-garlic');
        const chili = document.querySelector('.channels-chili');
        const decorativeElements = [garlic, chili].filter(el => el !== null);
        
        if (decorativeElements.length > 0) {
            let lastScrollY = window.scrollY;
            let ticking = false;
            
            function updateParallax() {
                const scrollY = window.scrollY;
                const scrollDelta = scrollY - lastScrollY;
                
                decorativeElements.forEach((element, index) => {
                    if (!element) return;
                    
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (isVisible) {
                        const speed = (index + 1) * 0.08;
                        const offset = scrollDelta * speed;
                        
                        const currentTransform = element.style.transform || '';
                        const match = currentTransform.match(/translateY\(([^)]+)\)/);
                        const currentY = match ? parseFloat(match[1]) || 0 : 0;
                        const newY = Math.max(-16, Math.min(16, currentY + offset));
                        
                        element.style.transform = `translateY(${newY}px)`;
                    }
                });
                
                lastScrollY = scrollY;
                ticking = false;
            }
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            }, { passive: true });
        }
    }
    
    // ============================================
    // Parallax Glow Effect (sparse)
    // ============================================
    
    if (!prefersReducedMotion) {
        const glows = document.querySelectorAll('.channels-glow');
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function updateGlows() {
            const scrollY = window.scrollY;
            const scrollDelta = scrollY - lastScrollY;
            
            glows.forEach((glow, index) => {
                const speed = (index + 1) * 0.1;
                const offset = scrollDelta * speed;
                
                const currentTransform = glow.style.transform || 'translate(0, 0)';
                const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                const currentX = match ? parseFloat(match[1]) || 0 : 0;
                const currentY = match ? parseFloat(match[2]) || 0 : 0;
                
                glow.style.transform = `translate(${currentX}px, ${currentY + offset}px)`;
                glow.style.opacity = Math.max(0.1, 0.15 - Math.abs(scrollDelta) * 0.001);
            });
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateGlows);
                ticking = true;
            }
        }, { passive: true });
    }
    
    // ============================================
    // Open Hosts Twitch Channels
    // ============================================
    
    const openHostsBtn = document.getElementById('open-hosts-twitch');
    
    if (openHostsBtn) {
        openHostsBtn.addEventListener('click', function() {
            const hostCards = document.querySelectorAll('.channel-card[data-role="host"]');
            const twitchUrls = Array.from(hostCards).map(card => card.getAttribute('data-twitch'));
            
            if (twitchUrls.length > 0) {
                // Open each URL in a new tab
                twitchUrls.forEach((url, index) => {
                    setTimeout(() => {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }, index * 100); // Small delay to avoid popup blockers
                });
            }
        });
    }
    
    // ============================================
    // Open Participants Twitch Channels
    // ============================================
    
    const openParticipantsBtn = document.getElementById('open-participants-twitch');
    
    if (openParticipantsBtn) {
        openParticipantsBtn.addEventListener('click', function() {
            const participantCards = document.querySelectorAll('.channel-card[data-role="participant"]');
            const twitchUrls = Array.from(participantCards).map(card => card.getAttribute('data-twitch'));
            
            if (twitchUrls.length > 0) {
                // Open each URL in a new tab
                twitchUrls.forEach((url, index) => {
                    setTimeout(() => {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }, index * 100); // Small delay to avoid popup blockers
                });
            }
        });
    }
    
    // ============================================
    // Twitch Avatar Loading
    // ============================================
    
    const AVATAR_CACHE_KEY = 'sucukcamp_avatars';
    const AVATAR_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    const MAX_CONCURRENT_FETCHES = 3;
    
    // Get cached avatar URLs
    function getCachedAvatars() {
        try {
            const cached = localStorage.getItem(AVATAR_CACHE_KEY);
            if (!cached) return {};
            
            const data = JSON.parse(cached);
            const now = Date.now();
            const valid = {};
            
            // Filter out expired entries
            Object.keys(data).forEach(username => {
                if (data[username].timestamp && (now - data[username].timestamp) < AVATAR_CACHE_DURATION) {
                    valid[username] = data[username].url;
                }
            });
            
            return valid;
        } catch (e) {
            return {};
        }
    }
    
    // Save avatar URL to cache
    function cacheAvatar(username, url) {
        try {
            const cached = getCachedAvatars();
            const data = JSON.parse(localStorage.getItem(AVATAR_CACHE_KEY) || '{}');
            data[username] = {
                url: url,
                timestamp: Date.now()
            };
            localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(data));
        } catch (e) {
            // Ignore localStorage errors
        }
    }
    
    // Fetch avatar URL from DecAPI
    async function fetchAvatarUrl(username) {
        try {
            const response = await fetch(`https://decapi.me/twitch/avatar/${username}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const avatarUrl = (await response.text()).trim();
            if (avatarUrl && avatarUrl.startsWith('http')) {
                cacheAvatar(username, avatarUrl);
                return avatarUrl;
            }
            throw new Error('Invalid URL');
        } catch (e) {
            console.warn(`Failed to fetch avatar for ${username}:`, e);
            return null;
        }
    }
    
    // Load avatar for a single card
    function loadAvatar(card) {
        const username = card.getAttribute('data-username');
        if (!username) return;
        
        const avatar = card.querySelector('.channel-avatar');
        const img = card.querySelector('.channel-avatar-img');
        const fallback = card.querySelector('.channel-avatar-fallback');
        
        if (!avatar || !img || !fallback) return;
        
        // Check cache first
        const cached = getCachedAvatars();
        if (cached[username]) {
            img.src = cached[username];
            avatar.classList.add('loading');
            return;
        }
        
        // Fetch from API
        fetchAvatarUrl(username).then(avatarUrl => {
            if (avatarUrl) {
                img.src = avatarUrl;
                avatar.classList.add('loading');
            } else {
                // Keep fallback visible
                avatar.classList.remove('loading');
            }
        });
    }
    
    // Image load handlers
    function setupImageHandlers() {
        const images = document.querySelectorAll('.channel-avatar-img');
        images.forEach(img => {
            const avatar = img.closest('.channel-avatar');
            
            img.addEventListener('load', function() {
                if (avatar) {
                    avatar.classList.add('is-loaded');
                    avatar.classList.remove('loading');
                    img.classList.add('is-loaded');
                }
            });
            
            img.addEventListener('error', function() {
                if (avatar) {
                    avatar.classList.remove('loading', 'is-loaded');
                    img.style.display = 'none';
                }
            });
        });
    }
    
    // Queue for managing concurrent fetches
    class FetchQueue {
        constructor(maxConcurrent = 3) {
            this.maxConcurrent = maxConcurrent;
            this.running = 0;
            this.queue = [];
        }
        
        async add(fn) {
            return new Promise((resolve, reject) => {
                this.queue.push({ fn, resolve, reject });
                this.process();
            });
        }
        
        async process() {
            if (this.running >= this.maxConcurrent || this.queue.length === 0) {
                return;
            }
            
            this.running++;
            const { fn, resolve, reject } = this.queue.shift();
            
            try {
                const result = await fn();
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                this.running--;
                this.process();
            }
        }
    }
    
    const fetchQueue = new FetchQueue(MAX_CONCURRENT_FETCHES);
    
    // Load all avatars when channels section is visible
    function initAvatarLoading() {
        const channelsSection = document.getElementById('channels');
        if (!channelsSection) return;
        
        const cards = document.querySelectorAll('.channel-card[data-username]');
        if (cards.length === 0) return;
        
        // Setup image handlers first
        setupImageHandlers();
        
        // Use IntersectionObserver to load avatars when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    
                    // Load avatars with queue
                    cards.forEach(card => {
                        const username = card.getAttribute('data-username');
                        if (!username) return;
                        
                        const cached = getCachedAvatars();
                        if (cached[username]) {
                            // Use cached URL immediately
                            const img = card.querySelector('.channel-avatar-img');
                            const avatar = card.querySelector('.channel-avatar');
                            if (img && avatar) {
                                img.src = cached[username];
                                avatar.classList.add('loading');
                            }
                        } else {
                            // Fetch with queue
                            fetchQueue.add(() => fetchAvatarUrl(username)).then(avatarUrl => {
                                if (avatarUrl) {
                                    const img = card.querySelector('.channel-avatar-img');
                                    const avatar = card.querySelector('.channel-avatar');
                                    if (img && avatar) {
                                        img.src = avatarUrl;
                                        avatar.classList.add('loading');
                                    }
                                }
                            }).catch(() => {
                                // Error handled, fallback will show
                            });
                        }
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });
        
        observer.observe(channelsSection);
    }
    
    // Initialize avatar loading
    initAvatarLoading();
    
});
