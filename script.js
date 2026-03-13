// ==================== INITIALIZATION ==================== 
document.addEventListener('DOMContentLoaded', function() {
    initializeLoader();
    initializeParticles();
    initializeTypingAnimation();
    initializeScrollReveal();
    initializeNavigation();
    initializeFormHandling();
    initializeEasterEgg();
    initializeScrollEffects();
    
    // Fetch GitHub stats after a small delay to ensure DOM is ready
    setTimeout(() => {
        fetchGitHubStats();
    }, 500);
});

// ==================== LOADER/TERMINAL BOOT ==================== 
function initializeLoader() {
    const texts = [
        'initializing system...',
        'loading elite developer interface...',
        'access granted...'
    ];

    const loaderElement = document.getElementById('loaderContainer');
    const textElements = [
        document.getElementById('loaderText'),
        document.getElementById('loaderText2'),
        document.getElementById('loaderText3')
    ];

    let currentIndex = 0;

    function typeText(element, text, callback) {
        let charIndex = 0;
        element.textContent = '';

        function type() {
            if (charIndex < text.length) {
                element.textContent += text[charIndex];
                charIndex++;
                setTimeout(type, 30);
            } else {
                callback();
            }
        }
        type();
    }

    function startSequence() {
        if (currentIndex < texts.length) {
            typeText(textElements[currentIndex], texts[currentIndex], () => {
                currentIndex++;
                setTimeout(startSequence, 500);
            });
        }
    }

    startSequence();
}

// ==================== TYPING ANIMATION ==================== 
function initializeTypingAnimation() {
    const titles = [
        'Software Engineer',
        'Full Stack Developer',
        'AI Explorer',
        'System Architect'
    ];

    const typingText = document.getElementById('typingText');
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeTitle() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typingText.textContent = currentTitle.substring(0, charIndex);

        let speed = isDeleting ? 40 : 60;

        if (!isDeleting && charIndex === currentTitle.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            speed = 300;
        }

        setTimeout(typeTitle, speed);
    }

    typeTitle();
}

// ==================== FETCH REAL GITHUB STATS & PROJECTS ==================== 
async function fetchGitHubStats() {
    const githubUsername = 'WebDevEJAJ';
    
    console.log('Starting GitHub fetch for:', githubUsername);
    
    try {
        // Fetch user data
        console.log('Fetching user data...');
        const userResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
        const userData = await userResponse.json();
        console.log('User data fetched:', userData);
        
        // Fetch repositories to calculate total stars and get projects
        console.log('Fetching repositories...');
        const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`);
        const reposData = await reposResponse.json();
        console.log('Repositories fetched:', reposData.length, 'repos');
        
        // Update projects section with real repos
        if (Array.isArray(reposData)) {
            console.log('Updating projects section...');
            updateProjectsSection(reposData);
            
            // Calculate total stars
            let totalStars = 0;
            totalStars = reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
            
            // Update GitHub stats
            const githubCards = document.querySelectorAll('.github-card');
            console.log('Found', githubCards.length, 'github cards');
            
            if (githubCards.length >= 4) {
                // Contributions
                const contributionsElement = githubCards[0].querySelector('.github-stat');
                if (contributionsElement) {
                    contributionsElement.textContent = (userData.public_repos * 10).toLocaleString();
                }
                
                // Repositories
                const reposElement = githubCards[1].querySelector('.github-stat');
                if (reposElement) {
                    reposElement.textContent = userData.public_repos.toLocaleString();
                }
                
                // Stars
                const starsElement = githubCards[2].querySelector('.github-stat');
                if (starsElement) {
                    starsElement.textContent = totalStars.toLocaleString();
                }
                
                // Followers
                const followersElement = githubCards[3].querySelector('.github-stat');
                if (followersElement) {
                    followersElement.textContent = userData.followers.toLocaleString();
                }
            }
            
            console.log('GitHub data updated successfully');
        } else {
            console.error('Repos data is not an array:', reposData);
        }
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
    }
}

// ==================== UPDATE PROJECTS SECTION WITH REAL REPOS ====================
function updateProjectsSection(repos) {
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) {
        console.error('Projects grid not found!');
        return;
    }
    
    // Filter out forked repos only - show all non-forked repos regardless of description
    const realProjects = repos.filter(repo => {
        return !repo.fork;
    }).slice(0, 6); // Limit to 6 projects
    
    console.log('Real projects found:', realProjects.length);
    console.log('Projects data:', realProjects);
    
    // Clear existing project cards
    projectsGrid.innerHTML = '';
    
    // If no projects found, show a message
    if (realProjects.length === 0) {
        projectsGrid.innerHTML = '<p style="color: #00ff88; text-align: center; padding: 2rem;">No projects found</p>';
        return;
    }
    
    // Define color gradients for projects
    const gradients = [
        'linear-gradient(135deg, #00ff88 0%, #0088ff 100%)',
        'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
        'linear-gradient(135deg, #ffff00 0%, #ff6600 100%)',
        'linear-gradient(135deg, #00cc88 0%, #0066ff 100%)',
        'linear-gradient(135deg, #ff0088 0%, #ffaa00 100%)',
        'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)'
    ];
    
    // Create project cards for real repos
    realProjects.forEach((repo, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card card-reveal';
        projectCard.style.opacity = '1';  // Make visible immediately
        
        // Get primary language
        const language = repo.language || 'JavaScript';
        
        // Get topics as tags
        const topics = repo.topics || [];
        
        const projectHTML = `
            <div class="project-header">
                <div class="project-image">
                    <div class="gradient" style="background: ${gradients[index % gradients.length]};"></div>
                </div>
                <span class="project-tag">${language.toUpperCase()}</span>
            </div>
            <div class="project-body">
                <h3>${repo.name.replace(/-/g, ' ').toUpperCase()}</h3>
                <p>${repo.description || 'A project by WebDevEJAJ'}</p>
                <div class="tech-stack">
                    ${topics.slice(0, 3).map(topic => `<span class="tech">${topic}</span>`).join('')}
                    ${topics.length === 0 ? `<span class="tech">${language}</span>` : ''}
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" class="project-link" target="_blank">GitHub →</a>
                    ${repo.homepage ? `<a href="${repo.homepage}" class="project-link demo" target="_blank">Live →</a>` : ''}
                </div>
            </div>
        `;
        
        projectCard.innerHTML = projectHTML;
        projectsGrid.appendChild(projectCard);
        
        console.log(`Added project ${index + 1}: ${repo.name}`);
    });
    
    console.log('Projects updated with', realProjects.length, 'real repositories');
}
 
function initializeParticles() {
    const container = document.getElementById('particles');
    const particleCount = window.innerWidth > 768 ? 50 : 20;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }

    // Create new particles occasionally
    setInterval(() => {
        if (Math.random() > 0.7) {
            createParticle(container);
        }
    }, 1000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;

    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(0, 255, 136, 0.8), rgba(0, 255, 136, 0));
        left: ${x}%;
        top: ${y}%;
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 ${size * 2}px rgba(0, 255, 136, 0.6);
        animation: particleFloat ${duration}s infinite ease-in-out;
    `;

    container.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

// Add particle float animation to style
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== SCROLL REVEAL ANIMATION ==================== 
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.card-reveal');

    function revealOnScroll() {
        revealElements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementHeight = element.clientHeight;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - elementHeight / 2) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.animation = `revealCard 0.6s ease-out forwards`;
                }, index * 50);
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on initial load
}

// ==================== NAVIGATION ==================== 
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navLink = document.querySelectorAll('.nav-link');

    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLink.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.remove('active');

            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== FORM HANDLING ==================== 
function initializeFormHandling() {
    const form = document.getElementById('contactForm');
    
    // Only initialize if form exists
    if (!form) {
        console.log('Contact form not found - skipping form initialization');
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const message = form.querySelector('textarea').value;

        // Basic validation
        if (name && email && message) {
            // Show success message (you can replace this with actual email sending)
            showFormNotification('Message received! Thanks for reaching out.', 'success');

            // Reset form
            form.reset();

            // Simulate email sending (in production, use a backend service)
            console.log('Form submitted:', { name, email, message });
        } else {
            showFormNotification('Please fill in all fields.', 'error');
        }
    });
}

function showFormNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 4px;
        font-weight: 600;
        letter-spacing: 1px;
        z-index: 10000;
        animation: slideInNotification 0.4s ease-out;
        ${type === 'success' 
            ? 'background: rgba(0, 255, 136, 0.9); color: #050505; border: 1px solid #00ff88;' 
            : 'background: rgba(255, 100, 100, 0.9); color: #fff; border: 1px solid #ff6464;'}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.4s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInNotification {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutNotification {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// ==================== EASTER EGG - HACK TERMINAL ==================== 
function initializeEasterEgg() {
    const hackTerminal = document.getElementById('hackTerminal');
    const hackContent = document.getElementById('hackContent');
    const hackClose = document.getElementById('hackClose');

    let keySequence = '';
    const secretKey = 'hack';

    // Commands to display in the terminal
    const commands = [
        '$ analyzing portfolio architecture...',
        '$ loading elite developer credentials...',
        '$ executing advanced algorithms...',
        '$ optimizing neural pathways...',
        '$ access level: ELITE DEVELOPER',
        '$ system status: FULLY OPERATIONAL',
        '>> You found the secret terminal!'
    ];

    // Listen for keyboard input
    document.addEventListener('keydown', (e) => {
        keySequence += e.key.toLowerCase();

        // Keep only last 4 characters
        if (keySequence.length > 4) {
            keySequence = keySequence.slice(-4);
        }

        // Check if secret key is typed
        if (keySequence.includes(secretKey)) {
            openHackTerminal();
        }
    });

    function openHackTerminal() {
        keySequence = ''; // Reset key sequence
        hackTerminal.classList.add('active');
        hackContent.innerHTML = '';

        // Type out commands sequentially
        let commandIndex = 0;

        function displayCommand() {
            if (commandIndex < commands.length) {
                const p = document.createElement('p');
                p.textContent = '';

                const command = commands[commandIndex];
                let charIndex = 0;

                function typeCommand() {
                    if (charIndex < command.length) {
                        p.textContent += command[charIndex];
                        charIndex++;
                        setTimeout(typeCommand, 20);
                    } else {
                        commandIndex++;
                        setTimeout(displayCommand, 300);
                    }
                }

                hackContent.appendChild(p);
                typeCommand();
            }
        }

        displayCommand();
    }

    // Close button
    hackClose.addEventListener('click', () => {
        hackTerminal.classList.remove('active');
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hackTerminal.classList.contains('active')) {
            hackTerminal.classList.remove('active');
        }
    });
}

// ==================== SCROLL EFFECTS ==================== 
function initializeScrollEffects() {
    // Smooth parallax effect for background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.gradient-orb');

        parallaxElements.forEach((element, index) => {
            const rate = scrolled * (0.1 + index * 0.05);
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ==================== BUTTON ANIMATIONS ==================== 
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// ==================== PROJECT CARD TILT EFFECT ==================== 
function initializeProjectTilt() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((centerX - x) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Initialize on load
window.addEventListener('load', initializeProjectTilt);

// ==================== SMOOTH SCROLL FOR NAVIGATION ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ==================== SKILL BARS ANIMATION ==================== 
function initializeSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    let animated = false;

    function animateSkillBars() {
        if (animated) return;

        skillCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                const progressBar = card.querySelector('.skill-progress');
                if (progressBar) {
                    progressBar.style.animation = 'fillProgress 1.5s ease-out forwards';
                }
            }
        });

        animated = true;
    }

    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars();
}

document.addEventListener('DOMContentLoaded', initializeSkillBars);

// ==================== RESPONSIVE HAMBURGER ==================== 
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// ==================== GLITCH TEXT EFFECT ==================== 
function initializeGlitchEffect() {
    const glitchElement = document.querySelector('.glitch');

    if (glitchElement) {
        setInterval(() => {
            glitchElement.style.animation = 'none';
            setTimeout(() => {
                glitchElement.style.animation = 'glitchAnimation 3s infinite';
            }, 10);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', initializeGlitchEffect);

// ==================== UTILITY FUNCTIONS ==================== 

// Debounce function for scroll events
function debounce(func, wait) {
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// ==================== ADDITIONAL ENHANCEMENTS ==================== 

// Add fade-in effect to images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.animation = 'fadeInImage 0.6s ease-out';
    });
});

const imageStyle = document.createElement('style');
imageStyle.textContent = `
    @keyframes fadeInImage {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(imageStyle);

// ==================== DYNAMIC BACKGROUND ==================== 
function createDynamicBackground() {
    // This could be enhanced with WebGL for more advanced effects
    // For now, the CSS handles the background animations
}

// ==================== CONSOLE MESSAGE ==================== 
console.log('%c🔒 ELITE DEVELOPER SYSTEM ONLINE', 'color: #00ff88; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);');
console.log('%cYou found the developer console! Try typing "hack" to unlock a secret...', 'color: #00ccff; font-size: 12px;');

// Performance monitoring (optional)
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`%cPage Load Time: ${pageLoadTime}ms`, 'color: #ffff00;');
    });
}
