// Enhanced scroll animations
const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-reveal, .scale-on-scroll, .text-reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, {
    threshold: 0.1
});

animatedElements.forEach(el => {
    observer.observe(el);
});


// Smooth scroll with momentum
function smoothScrollTo(target, duration = 1000) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;

    const targetPosition = targetElement.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
}

// Progress Bar Animation
const progressBar = document.getElementById('progressBar');
const sectionProgress = document.getElementById('sectionProgress');
const progressDots = document.querySelectorAll('.progress-dot');

function updateProgressBar() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    progressBar.style.width = scrollPercent + '%';
}

function updateSectionIndicators() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + window.innerHeight / 2;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            progressDots.forEach(dot => dot.classList.remove('active'));

            const activeDot = document.querySelector(`[data-section="${sectionId}"]`);
            if (activeDot) {
                activeDot.classList.add('active');
            }
        }
    });
}

function handleDotClick() {
    progressDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetSection = dot.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection);

            if (targetElement) {
                smoothScrollTo(targetElement, 800);
            }
        });
    });
}

function handleScrollSnap() {
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateParallax();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });
}

function handleWheelSmooth() {
    let isScrolling = false;

    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;

        isScrolling = true;
        e.preventDefault();

        const delta = e.deltaY;
        const scrollAmount = delta > 0 ? window.innerHeight : -window.innerHeight;
        const targetPosition = window.pageYOffset + scrollAmount;

        smoothScrollTo(targetPosition, 600);

        setTimeout(() => {
            isScrolling = false;
        }, 600);
    }, { passive: false });
}

function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getResponsiveThrottleDelay() {
    const isMobile = window.innerWidth <= 768;
    return isMobile ? 16 : 10;
}

window.addEventListener('scroll', throttle(() => {
    updateProgressBar();
    updateSectionIndicators();
}, getResponsiveThrottleDelay()));

function createLogoParticles() {
    const logoContainer = document.getElementById('logoContainer');
    if (!logoContainer) return;

    logoContainer.innerHTML = '';

    const logoParticles = generateLogoParticlePositions();

    logoParticles.forEach((particleData, index) => {
        const particle = document.createElement('div');
        particle.className = `logo-particle ${particleData.type}`;

        particle.style.setProperty('--target-x', particleData.x + 'px');
        particle.style.setProperty('--target-y', particleData.y + 'px');

        const scatterX = (Math.random() - 0.5) * 600;
        const scatterY = (Math.random() - 0.5) * 400;
        particle.style.setProperty('--scatter-x', scatterX + 'px');
        particle.style.setProperty('--scatter-y', scatterY + 'px');

        particle.style.left = scatterX + 'px';
        particle.style.top = scatterY + 'px';
        particle.classList.add('scattered');

        logoContainer.appendChild(particle);

        setTimeout(() => {
            particle.classList.remove('scattered');
            particle.classList.add('forming');
            particle.style.left = particleData.x + 'px';
            particle.style.top = particleData.y + 'px';
        }, index * 10);
    });
}

function generateLogoParticlePositions() {
    const particles = [];

    const outerVertices = [
        { x: 60, y: 60 },
        { x: 140, y: 40 },
        { x: 260, y: 40 },
        { x: 340, y: 60 },
        { x: 360, y: 100 },
        { x: 340, y: 140 },
        { x: 260, y: 160 },
        { x: 140, y: 160 },
        { x: 60, y: 140 },
        { x: 40, y: 100 }
    ];

    outerVertices.forEach(vertex => {
        particles.push({
            x: vertex.x,
            y: vertex.y,
            type: 'node'
        });
    });

    const outerLines = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0]
    ];

    outerLines.forEach(([start, end]) => {
        const startVertex = outerVertices[start];
        const endVertex = outerVertices[end];
        const lineParticles = generateLineParticles(startVertex, endVertex, 25);
        particles.push(...lineParticles.map(p => ({ ...p, type: 'line' })));
    });

    const internalLines = [
        { start: { x: 60, y: 60 }, end: { x: 200, y: 100 } },
        { start: { x: 200, y: 100 }, end: { x: 340, y: 60 } },
        { start: { x: 60, y: 140 }, end: { x: 200, y: 100 } },
        { start: { x: 200, y: 100 }, end: { x: 340, y: 140 } },


        { start: { x: 40, y: 100 }, end: { x: 200, y: 100 } },
        { start: { x: 200, y: 100 }, end: { x: 360, y: 100 } },
        { start: { x: 200, y: 40 }, end: { x: 200, y: 100 } },
        { start: { x: 200, y: 100 }, end: { x: 200, y: 160 } },


        { start: { x: 140, y: 40 }, end: { x: 200, y: 100 } },
        { start: { x: 200, y: 100 }, end: { x: 260, y: 40 } },
        { start: { x: 140, y: 160 }, end: { x: 200, y: 100 } },
        { start: { x: 200, y: 100 }, end: { x: 260, y: 160 } },


        { start: { x: 60, y: 100 }, end: { x: 200, y: 100 } },
        { start: { x: 200, y: 100 }, end: { x: 340, y: 100 } },
        { start: { x: 200, y: 60 }, end: { x: 200, y: 100 } },
        { start: { x: 200, y: 100 }, end: { x: 200, y: 140 } }
    ];

    internalLines.forEach(line => {
        const lineParticles = generateLineParticles(line.start, line.end, 20);
        particles.push(...lineParticles.map(p => ({ ...p, type: 'line' })));
    });

    const centralShape = generateAccurateCentralShape();
    particles.push(...centralShape.map(p => ({ ...p, type: 'central' })));

    particles.push(
        { x: 200, y: 100, type: 'node' },
        { x: 200, y: 100, type: 'node' }
    );

    return particles;
}


function generateLineParticles(start, end, count) {
    const particles = [];
    for (let i = 0; i <= count; i++) {
        const t = i / count;
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;
        particles.push({ x, y });
    }
    return particles;
}

// Generate accurate central organic shape particles
function generateAccurateCentralShape() {
    const particles = [];
    const centerX = 200;
    const centerY = 100;

    // Create the calligraphic/heartbeat shape based on the actual logo
    for (let i = 0; i < 120; i++) {
        const t = i / 120;
        const x = centerX - 90 + t * 180; // Span from left to right
        let y = centerY;

        // Create the specific calligraphic pattern from the logo
        if (t < 0.15) {
            // Left side - thin, subtle line
            y += Math.sin(t * 30) * 3;
        } else if (t < 0.25) {
            // Start building up
            y += Math.sin(t * 20) * 5 + (t - 0.15) * 15;
        } else if (t < 0.35) {
            // Steep rise to peak
            y += 8 + (t - 0.25) * 35 + Math.sin(t * 15) * 8;
        } else if (t < 0.45) {
            // Central peak - the main calligraphic flourish
            y += 18 + Math.sin(t * 12) * 12 + Math.cos(t * 8) * 6;
        } else if (t < 0.55) {
            // Sharp descent from peak
            y += 18 - (t - 0.45) * 45 + Math.sin(t * 18) * 6;
        } else if (t < 0.7) {
            // Mid-section with smaller waves
            y += Math.sin(t * 20) * 8 + Math.sin(t * 35) * 4;
        } else if (t < 0.85) {
            // Right side - jagged ECG-like pattern
            y += Math.sin(t * 30) * 6 + Math.sin(t * 60) * 3 + Math.sin(t * 90) * 2;
        } else {
            // Final section - fading out
            y += Math.sin(t * 40) * 4 * (1 - (t - 0.85) / 0.15);
        }

        particles.push({ x, y });
    }

    return particles;
}

// Function to calculate particle positions for each letter
function getLetterParticlePositions(letter, particleIndex, totalParticles) {
    const letterWidth = 60; // Approximate letter width
    const letterHeight = 80; // Approximate letter height

    // Define letter shapes with particle positions
    const letterShapes = {
        'C': [
            { x: 10, y: 10 }, { x: 20, y: 5 }, { x: 30, y: 5 }, { x: 40, y: 10 },
            { x: 45, y: 20 }, { x: 45, y: 30 }, { x: 45, y: 40 }, { x: 45, y: 50 },
            { x: 40, y: 60 }, { x: 30, y: 65 }, { x: 20, y: 65 }, { x: 10, y: 60 },
            { x: 5, y: 50 }, { x: 5, y: 40 }, { x: 5, y: 30 }
        ],
        'o': [
            { x: 20, y: 20 }, { x: 30, y: 15 }, { x: 40, y: 20 }, { x: 45, y: 30 },
            { x: 45, y: 40 }, { x: 40, y: 50 }, { x: 30, y: 55 }, { x: 20, y: 50 },
            { x: 15, y: 40 }, { x: 15, y: 30 }, { x: 20, y: 25 }, { x: 30, y: 25 },
            { x: 40, y: 30 }, { x: 40, y: 40 }, { x: 30, y: 45 }
        ],
        'd': [
            { x: 20, y: 5 }, { x: 20, y: 15 }, { x: 20, y: 25 }, { x: 20, y: 35 },
            { x: 20, y: 45 }, { x: 20, y: 55 }, { x: 20, y: 65 }, { x: 30, y: 60 },
            { x: 40, y: 50 }, { x: 45, y: 40 }, { x: 45, y: 30 }, { x: 40, y: 20 },
            { x: 30, y: 15 }, { x: 25, y: 20 }, { x: 25, y: 30 }
        ],
        'e': [
            { x: 10, y: 30 }, { x: 20, y: 25 }, { x: 30, y: 25 }, { x: 40, y: 30 },
            { x: 45, y: 40 }, { x: 40, y: 50 }, { x: 30, y: 55 }, { x: 20, y: 50 },
            { x: 15, y: 40 }, { x: 20, y: 35 }, { x: 30, y: 35 }, { x: 40, y: 40 },
            { x: 10, y: 20 }, { x: 10, y: 40 }, { x: 10, y: 60 }
        ],
        'n': [
            { x: 10, y: 20 }, { x: 10, y: 30 }, { x: 10, y: 40 }, { x: 10, y: 50 },
            { x: 10, y: 60 }, { x: 20, y: 25 }, { x: 30, y: 30 }, { x: 40, y: 35 },
            { x: 45, y: 40 }, { x: 45, y: 50 }, { x: 45, y: 60 }, { x: 40, y: 55 },
            { x: 30, y: 50 }, { x: 20, y: 45 }, { x: 15, y: 40 }
        ],
        's': [
            { x: 30, y: 10 }, { x: 40, y: 15 }, { x: 45, y: 25 }, { x: 40, y: 35 },
            { x: 30, y: 40 }, { x: 20, y: 45 }, { x: 15, y: 50 }, { x: 20, y: 55 },
            { x: 30, y: 60 }, { x: 40, y: 55 }, { x: 45, y: 50 }, { x: 40, y: 45 },
            { x: 30, y: 30 }, { x: 20, y: 25 }, { x: 15, y: 20 }
        ],
        'c': [
            { x: 20, y: 20 }, { x: 30, y: 15 }, { x: 40, y: 20 }, { x: 45, y: 30 },
            { x: 45, y: 40 }, { x: 40, y: 50 }, { x: 30, y: 55 }, { x: 20, y: 50 },
            { x: 15, y: 40 }, { x: 15, y: 30 }, { x: 20, y: 25 }, { x: 30, y: 25 },
            { x: 40, y: 30 }, { x: 40, y: 40 }, { x: 30, y: 45 }
        ],
        'i': [
            { x: 25, y: 10 }, { x: 25, y: 20 }, { x: 25, y: 30 }, { x: 25, y: 40 },
            { x: 25, y: 50 }, { x: 25, y: 60 }, { x: 20, y: 15 }, { x: 30, y: 15 },
            { x: 20, y: 25 }, { x: 30, y: 25 }, { x: 20, y: 35 }, { x: 30, y: 35 },
            { x: 20, y: 45 }, { x: 30, y: 45 }, { x: 25, y: 55 }
        ],
        'u': [
            { x: 15, y: 20 }, { x: 15, y: 30 }, { x: 15, y: 40 }, { x: 15, y: 50 },
            { x: 20, y: 55 }, { x: 30, y: 55 }, { x: 40, y: 50 }, { x: 40, y: 40 },
            { x: 40, y: 30 }, { x: 40, y: 20 }, { x: 35, y: 15 }, { x: 25, y: 15 },
            { x: 20, y: 20 }, { x: 30, y: 20 }, { x: 35, y: 25 }
        ]
    };

    const shape = letterShapes[letter.toLowerCase()] || letterShapes['o'];
    const position = shape[particleIndex % shape.length] || { x: 25, y: 30 };

    return {
        x: position.x,
        y: position.y
    };
}

// Mouse trail effect for particle text
function createMouseTrail() {
    const particleContainer = document.querySelector('.particle-container');
    if (!particleContainer) return;

    particleContainer.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.className = 'particle-trail';
        trail.style.left = e.clientX - particleContainer.getBoundingClientRect().left + 'px';
        trail.style.top = e.clientY - particleContainer.getBoundingClientRect().top + 'px';

        particleContainer.appendChild(trail);

        // Remove trail after animation
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1000);
    });
}

// Hover effect to scatter and reform logo particles
function addLogoHoverEffect() {
    const logoContainer = document.getElementById('logoContainer');
    if (!logoContainer) return;

    logoContainer.addEventListener('mouseenter', () => {
        const particles = logoContainer.querySelectorAll('.logo-particle');
        particles.forEach(particle => {
            particle.classList.remove('forming');
            particle.classList.add('scattered');

            // Random scatter positions
            const scatterX = (Math.random() - 0.5) * 600;
            const scatterY = (Math.random() - 0.5) * 400;
            particle.style.setProperty('--scatter-x', scatterX + 'px');
            particle.style.setProperty('--scatter-y', scatterY + 'px');
            particle.style.left = scatterX + 'px';
            particle.style.top = scatterY + 'px';
        });
    });

    logoContainer.addEventListener('mouseleave', () => {
        const particles = logoContainer.querySelectorAll('.logo-particle');
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.classList.remove('scattered');
                particle.classList.add('forming');
                particle.style.left = particle.style.getPropertyValue('--target-x');
                particle.style.top = particle.style.getPropertyValue('--target-y');
            }, index * 5);
        });
    });
}

// Enhanced particle animation on scroll
function animateParticlesOnScroll() {
    const particleText = document.getElementById('particleText');
    if (!particleText) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const particles = entry.target.querySelectorAll('.particle');
                particles.forEach((particle, index) => {
                    setTimeout(() => {
                        particle.style.animationPlayState = 'running';
                    }, index * 50);
                });
            }
        });
    }, { threshold: 0.5 });

    observer.observe(particleText);
}

// Initialize all scroll effects
handleDotClick();
updateSectionIndicators(); // Set initial active section
handleScrollSnap();
// handleWheelSmooth(); // Uncomment for wheel-based section navigation

// Roaming Particles with Smiley Face Formation
function initRoamingParticles() {
    const particleField = document.getElementById('particleField');
    const heroSection = document.getElementById('hero');

    if (!particleField || !heroSection) {
        console.log('Particle field or hero section not found');
        return;
    }

    console.log('Initializing roaming particles...');

    // Create particles - responsive count based on screen size
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

    let particleCount;
    if (isMobile) {
        particleCount = 60; // Increased for mobile
    } else if (isTablet) {
        particleCount = 90; // Increased for tablets
    } else {
        particleCount = 120; // Significantly increased for desktop
    }

    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'roaming-particle roaming';

        // Random starting position within hero section
        const rect = heroSection.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.position = 'absolute';

        // Random animation delay
        particle.style.animationDelay = Math.random() * 8 + 's';

        particleField.appendChild(particle);
        particles.push(particle);
    }

    console.log(`Created ${particles.length} particles`);

    let smileyContainer = null;
    let isFormingSmiley = false;

    // Mouse move handler
    function handlePointerMove(e) {
        if (isFormingSmiley) return;

        const rect = heroSection.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        if (!clientX || !clientY) return;

        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        // Find particles near mouse cursor - responsive radius
        const isMobile = window.innerWidth <= 768;
        const detectionRadius = isMobile ? 80 : 100; // Smaller radius on mobile

        const nearbyParticles = particles.filter(particle => {
            const particleRect = particle.getBoundingClientRect();
            const particleX = particleRect.left - rect.left;
            const particleY = particleRect.top - rect.top;

            const distance = Math.sqrt(
                Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2)
            );

            return distance < detectionRadius;
        });

        if (nearbyParticles.length >= 10) {
            formSmileyFace(mouseX, mouseY, nearbyParticles.slice(0, 10));
        }
    }

    // Add event listeners for both mouse and touch
    heroSection.addEventListener('mousemove', handlePointerMove);
    heroSection.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Mouse/touch leave handler
    function handlePointerLeave() {
        if (smileyContainer) {
            smileyContainer.remove();
            smileyContainer = null;
            isFormingSmiley = false;
        }
    }

    heroSection.addEventListener('mouseleave', handlePointerLeave);
    heroSection.addEventListener('touchend', handlePointerLeave);

    function formSmileyFace(centerX, centerY, selectedParticles) {
        if (isFormingSmiley) return;

        isFormingSmiley = true;

        // Create smiley container
        smileyContainer = document.createElement('div');
        smileyContainer.className = 'smiley-container';
        smileyContainer.style.left = (centerX - 40) + 'px';
        smileyContainer.style.top = (centerY - 40) + 'px';

        // Smiley face positions
        const smileyPositions = [
            { x: 20, y: 10 }, // Left eye
            { x: 60, y: 10 }, // Right eye
            { x: 15, y: 30 }, // Nose
            { x: 20, y: 45 }, // Mouth start
            { x: 30, y: 50 }, // Mouth middle
            { x: 60, y: 45 }, // Mouth end
            { x: 35, y: 25 }, // Left cheek
            { x: 45, y: 25 }, // Right cheek
            { x: 40, y: 15 }, // Forehead
            { x: 40, y: 15 }  // Forehead duplicate
        ];

        // Move selected particles to smiley positions
        selectedParticles.forEach((particle, index) => {
            if (index < smileyPositions.length) {
                particle.classList.remove('roaming');
                particle.classList.add('forming-smiley');

                const targetX = centerX - 40 + smileyPositions[index].x;
                const targetY = centerY - 40 + smileyPositions[index].y;

                particle.style.left = targetX + 'px';
                particle.style.top = targetY + 'px';
                particle.style.transform = 'scale(1.2)';

                smileyContainer.appendChild(particle);
            }
        });

        particleField.appendChild(smileyContainer);

        // Auto-dismiss after 2 seconds
        setTimeout(() => {
            if (smileyContainer) {
                // Return particles to roaming
                selectedParticles.forEach(particle => {
                    particle.classList.remove('forming-smiley');
                    particle.classList.add('roaming');
                    particle.style.transform = '';

                    // Random new position
                    const newX = Math.random() * window.innerWidth;
                    const newY = Math.random() * window.innerHeight;
                    particle.style.left = newX + 'px';
                    particle.style.top = newY + 'px';

                    particleField.appendChild(particle);
                });

                smileyContainer.remove();
                smileyContainer = null;
                isFormingSmiley = false;
            }
        }, 2000);
    }
}

// Mobile Navigation Menu
function initMobileMenu() {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navbarLinks = document.querySelectorAll('.navbar-link');

    if (!navbarToggle || !navbarMenu) return;

    // Toggle mobile menu
    navbarToggle.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navbarMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbarMenu.classList.contains('active')) {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scrolling for navbar links
function initNavbarSmoothScroll() {
    const navbarLinks = document.querySelectorAll('.navbar-link');

    navbarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Check if navbar is visible to determine offset
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar.classList.contains('visible') ? 80 : 0;
                const offsetTop = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero');
    let lastScrollTop = 0;
    let isNavbarVisible = false;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;

        // Show navbar when scrolling down to 5%
        if (scrollPercent >= 5 && !isNavbarVisible) {
            navbar.classList.add('visible');
            document.body.classList.add('navbar-visible');
            isNavbarVisible = true;
        }

        // Keep navbar visible once it appears
        if (isNavbarVisible) {
            navbar.classList.add('visible');
            document.body.classList.add('navbar-visible');
        }

        // Add/remove scrolled class only after the hero section ends
        if (scrollTop >= heroBottom - 1) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });
}

// Initialize effects
createMouseTrail();
initMobileMenu();
initNavbarSmoothScroll();
initNavbarScrollEffect();

// Vertical to horizontal scroll for Products section
// Products sequence: vertical scroll drives horizontal translation
(function initProductsSequence() {
    const seq = document.getElementById('productsSeq');
    const track = document.getElementById('productsTrack');
    const canvas = document.getElementById('productsBg');
    if (!seq || !track || !canvas) return;

    initHorizontalScroll(seq, track, canvas);
})();

// Vertical to horizontal scroll for Projects section
// Projects sequence: vertical scroll drives horizontal translation
(function initProjectsSequence() {
    const seq = document.getElementById('projectsSeq');
    const track = document.getElementById('projectsTrack');
    const canvas = document.getElementById('projectsCanvasBg');
    if (!seq || !track || !canvas) return;

    initHorizontalScroll(seq, track, canvas);
})();

// Shared function for horizontal scrolling implementation
function initHorizontalScroll(seq, track, canvas) {
    if (!seq || !track || !canvas) return;

    // Detect if device is touch-enabled
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Compute total horizontal width and the vertical scroll area required
    function computeSequenceHeights() {

        const cards = track.children.length;
        const cardWidth = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width : 320;
        const style = getComputedStyle(track);
        // Prefer columnGap which is in px; fallback to gap
        const gapStr = style.columnGap && style.columnGap !== 'normal' ? style.columnGap : (style.gap || '16px');
        const gap = parseFloat(gapStr) || 16; // px
        const totalWidth = cards * cardWidth + (cards - 1) * gap;
        const viewport = window.innerWidth;
        // Increase extra width to ensure all cards are visible
        const viewportFactor = isTouchDevice ? 0.7 : 0.8;
        const extra = Math.max(0, Math.ceil(totalWidth - viewport * viewportFactor));
        // Height: horizontal distance + an extra viewport to ensure last card fully appears before release
        const heightFactor = isTouchDevice ? 0.6 : 0.5;
        seq.style.height = `calc(100vh + ${extra + window.innerHeight * heightFactor}px)`;
        return { extra };
    }
    let extraWidth = computeSequenceHeights().extra;

    // Sticky pin container
    const pin = seq.querySelector('.products-pin');

    // Map vertical scroll progress within the section to horizontal translateX
    function update() {
        const rect = seq.getBoundingClientRect();
        const start = rect.top;
        const end = rect.height - window.innerHeight; // when pin releases; rect.bottom - vh can be inaccurate after transforms
        const progress = Math.min(1, Math.max(0, (0 - start) / (end - 0)));
        const translateX = -extraWidth * progress;
        track.style.transform = `translate3d(${translateX}px,0,0)`;
        renderBg(progress);
    }

    // Touch scroll handling
    if (isTouchDevice) {
        // Add smooth scrolling for touch devices
        track.style.scrollBehavior = 'smooth';
        track.style.webkitOverflowScrolling = 'touch';

        // Add touch-specific snap points for better experience
        track.style.scrollSnapType = 'x mandatory';
        Array.from(track.children).forEach(card => {
            card.style.scrollSnapAlign = 'center';
        });
    }

    window.addEventListener('resize', () => {
        extraWidth = computeSequenceHeights().extra;
        update();
        if (typeof THREE !== 'undefined') {
            setupThree();
        }
    }, { passive: true });

    window.addEventListener('scroll', update, { passive: true });

    // Initial call to setup
    if (typeof THREE !== 'undefined') {
        setupThree();
    } else {
        // Load THREE.js if needed
        ensureThree(() => setupThree());
    }

    // Keyboard accessibility
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
        const step = 120;
        if (e.key === 'ArrowRight') { window.scrollBy({ top: step, behavior: 'smooth' }); }
        if (e.key === 'ArrowLeft') { window.scrollBy({ top: -step, behavior: 'smooth' }); }
    });

    // Minimal Three.js background
    let renderer, scene, camera, geometry, material, mesh, raf;
    function setupThree() {
        if (!pin || !canvas) return;

        const width = pin.clientWidth; const height = pin.clientHeight;
        if (!renderer) {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        }
        renderer.setSize(width, height, false);
        if (!scene) {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            camera.position.z = 6;
            geometry = new THREE.IcosahedronGeometry(2.2, 1);
            material = new THREE.MeshStandardMaterial({ color: 0x4ecdc4, metalness: 0.1, roughness: 0.8, wireframe: true, opacity: 0.25, transparent: true });
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            const light = new THREE.PointLight(0x45b7d1, 1.2); light.position.set(4, 4, 6); scene.add(light);
            const light2 = new THREE.PointLight(0xffffff, 0.3); light2.position.set(-4, -2, -4); scene.add(light2);
        } else {
            camera.aspect = width / height; camera.updateProjectionMatrix();
        }
    }

    function renderBg(progress) {
        if (!renderer || !mesh || !scene || !camera) return;
        mesh.rotation.x = progress * Math.PI * 1.2;
        mesh.rotation.y = progress * Math.PI * 1.6;
        renderer.render(scene, camera);
    }

    // Lazy load three.js via CDN if not present
    function ensureThree(callback) {
        if (window.THREE) { callback(); return; }
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
        s.onload = callback;
        document.head.appendChild(s);
    }

    ensureThree(() => { setupThree(); update(); });
}

// Initialize particles after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initRoamingParticles();
        }, 100);
    });
} else {
    // DOM is already ready
    setTimeout(() => {
        initRoamingParticles();
    }, 100);
}

// Handle window resize for responsive particles
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reinitialize particles with new screen size
        const particleField = document.getElementById('particleField');
        if (particleField) {
            particleField.innerHTML = '';
            initRoamingParticles();
        }
    }, 250);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sections = document.querySelectorAll('.scroll-snap-section');
        const currentSection = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).closest('.scroll-snap-section');

        if (currentSection) {
            const currentIndex = Array.from(sections).indexOf(currentSection);
            let targetIndex;

            if (e.key === 'ArrowDown') {
                targetIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else {
                targetIndex = Math.max(currentIndex - 1, 0);
            }

            smoothScrollTo(sections[targetIndex], 800);
        }
    }
});

// Hover spread interaction for Projects cards (DigiValet-like)
function initProjectsHoverSpread() {
    const seq = document.getElementById('projectsSeq');
    const track = document.getElementById('projectsTrack');
    if (!seq || !track) return;

    const cards = Array.from(track.querySelectorAll('.product-card'));
    if (cards.length === 0) return;

    const cs = getComputedStyle(seq);
    const step = parseFloat(cs.getPropertyValue('--spread-step')) || 24; // px per neighbor
    const hoverScale = parseFloat(cs.getPropertyValue('--hover-scale')) || 1.03;

    function applyOffsets(activeIdx) {
        cards.forEach((card, idx) => {
            const diff = idx - activeIdx;
            card.style.setProperty('--offset', String(diff * step));
            card.style.setProperty('--scale', idx === activeIdx ? String(hoverScale) : '1');
            if (idx === activeIdx) card.classList.add('is-hovered');
            else card.classList.remove('is-hovered');
        });
    }

    function reset() {
        cards.forEach((card) => {
            card.style.setProperty('--offset', '0');
            card.style.setProperty('--scale', '1');
            card.classList.remove('is-hovered');
        });
    }

    // Mouse and keyboard focus support
    cards.forEach((card, idx) => {
        card.addEventListener('mouseenter', () => applyOffsets(idx));
        card.addEventListener('focusin', () => applyOffsets(idx));
    });

    track.addEventListener('mouseleave', reset);
    track.addEventListener('focusout', () => {
        // If focus left the entire track, reset
        if (!track.contains(document.activeElement)) reset();
    });

    // Touch support: tap to activate, tap outside to reset
    cards.forEach((card, idx) => {
        card.addEventListener('touchstart', () => applyOffsets(idx), { passive: true });
    });
    document.addEventListener('touchstart', (e) => {
        if (!track.contains(e.target)) reset();
    }, { passive: true });
}

// Initialize the hover spread once DOM is ready (script is at end of body)
initProjectsHoverSpread();