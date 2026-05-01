// ==========================================
// ГЕНЕРАЦИЯ ЧАСТИЦ
// ==========================================

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 20 : 35;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Случайный размер
        const size = Math.random() * 6 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Случайная позиция
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Случайная задержка и продолжительность анимации
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${Math.random() * 20 + 15}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// ==========================================
// ЭФФЕКТ НАВЕДЕНИЯ МЫШИ (GLOW СЛЕДОВАНИЕ)
// ==========================================

function initCardGlowEffect() {
    const cards = document.querySelectorAll('.contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.background = `radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(100, 200, 255, 0.2) 0%,
                    transparent 60%
                )`;
            }
        });
    });
}

// ==========================================
// АНИМАЦИЯ ПЕЧАТАНИЯ В ТЕРМИНАЛЕ
// ==========================================

function initTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    const commands = [
        'ls -la projects/',
        'git status',
        'npm run dev',
        'code --inspect',
        'docker ps -a'
    ];
    
    let commandIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
        const currentCommand = commands[commandIndex];
        
        if (isPaused) {
            setTimeout(type, 2000);
            isPaused = false;
            return;
        }
        
        if (!isDeleting && charIndex < currentCommand.length) {
            // Печатаем символы
            typingElement.textContent = currentCommand.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, 100 + Math.random() * 100);
        } else if (isDeleting && charIndex > 0) {
            // Удаляем символы
            typingElement.textContent = currentCommand.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, 50);
        } else if (!isDeleting && charIndex === currentCommand.length) {
            // Пауза перед удалением
            isPaused = true;
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            // Переход к следующей команде
            isDeleting = false;
            commandIndex = (commandIndex + 1) % commands.length;
            setTimeout(type, 500);
        }
    }
    
    // Запуск анимации печатания
    setTimeout(type, 1000);
}

// ==========================================
// ПАРАЛЛАКС ЭФФЕКТ ПРИ СКРОЛЛЕ
// ==========================================

function initParallaxEffect() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const particles = document.querySelectorAll('.particle');
                
                particles.forEach((particle, index) => {
                    const speed = (index % 3 + 1) * 0.2;
                    particle.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ==========================================
// ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ
// ==========================================

function initSmoothScroll() {
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
}

// ==========================================
// АНИМАЦИЯ ПРИ ПОЯВЛЕНИИ ЭЛЕМЕНТОВ
// ==========================================

function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами, которые должны появляться при скролле
    const elementsToReveal = document.querySelectorAll('.contact-card, .code-block');
    elementsToReveal.forEach(el => observer.observe(el));
}

// ==========================================
// КОПИРОВАНИЕ В БУФЕР ОБМЕНА
// ==========================================

function initCopyToClipboard() {
    const cards = document.querySelectorAll('.contact-card');
    
    cards.forEach(card => {
        // Добавляем индикатор копирования (только на десктопе)
        if (window.innerWidth > 768) {
            card.addEventListener('click', (e) => {
                // Если это ссылка с href, пропускаем копирование
                if (card.getAttribute('href') && 
                    !card.getAttribute('href').startsWith('tel:') && 
                    !card.getAttribute('href').startsWith('mailto:')) {
                    return;
                }
                
                e.preventDefault();
                const value = card.querySelector('.contact-value').textContent;
                
                navigator.clipboard.writeText(value).then(() => {
                    showCopyNotification(card);
                }).catch(err => {
                    console.error('Ошибка копирования: ', err);
                });
            });
        }
    });
}

function showCopyNotification(card) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.textContent = 'Скопировано!';
    notification.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(16, 185, 129, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        z-index: 1000;
        pointer-events: none;
        animation: fadeInOut 2s ease-out forwards;
    `;
    
    card.style.position = 'relative';
    card.appendChild(notification);
    
    // Удаляем уведомление через 2 секунды
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Добавляем CSS анимацию для уведомления
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА
// ==========================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Пересоздаем частицы при изменении размера
        const particlesContainer = document.getElementById('particles');
        particlesContainer.innerHTML = '';
        createParticles();
    }, 250);
});

// ==========================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем все функции
    createParticles();
    initCardGlowEffect();
    initTypingAnimation();
    initParallaxEffect();
    initSmoothScroll();
    initScrollReveal();
    initCopyToClipboard();
    
    // Показываем страницу с плавным появлением
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});


// ==========================================
// ПРОЕКТЫ С BACKEND НА RENDER
// ==========================================

// После деплоя backend на Render вставь сюда URL сервиса, например:
// const API_BASE_URL = 'https://mahach-portfolio-api.onrender.com';
const API_BASE_URL = "https://backendmysite-se57.onrender.com";

let allProjects = [];
let activeProjectFilter = 'all';

const projectTypeLabels = {
    site: 'Сайт',
    telegram_bot: 'Telegram бот',
    script: 'Скрипт'
};

const projectStatusLabels = {
    done: 'Доделан',
    in_progress: 'В разработке',
    not_started: 'Еще не начал'
};

async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/projects`);

        if (!response.ok) {
            throw new Error('Backend вернул ошибку');
        }

        allProjects = await response.json();
        renderProjects();
    } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
        grid.innerHTML = `
            <div class="projects-error">
                Не удалось загрузить проекты. Проверь API_BASE_URL в script.js и работу backend на Render.
            </div>
        `;
    }
}

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const projects = activeProjectFilter === 'all'
        ? allProjects
        : allProjects.filter(project => project.type === activeProjectFilter);

    if (!projects.length) {
        grid.innerHTML = '<div class="projects-empty">Проекты не найдены.</div>';
        return;
    }

    grid.innerHTML = projects.map(project => `
        <button class="project-card" type="button" onclick="openProjectModal(${project.id})">
            <div class="card-glow"></div>
            <div class="project-top">
                <span class="project-type">${projectTypeLabels[project.type] || project.type}</span>
                <span class="project-status status-${project.status}">
                    ${projectStatusLabels[project.status] || project.status}
                </span>
            </div>
            <h3>${project.title}</h3>
            <p>${project.shortDescription || project.description || ''}</p>
        </button>
    `).join('');
}

function openProjectModal(projectId) {
    const project = allProjects.find(item => String(item.id) === String(projectId));
    if (!project) return;

    alert(project.fullDescription || project.description || 'Описание не добавлено');
}

    document.getElementById('modalType').textContent = projectTypeLabels[project.type] || project.type;
    const status = document.getElementById('modalStatus');
    status.textContent = projectStatusLabels[project.status] || project.status;
    status.className = `project-status ${project.status}`;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;

    const stack = document.getElementById('modalStack');
    stack.innerHTML = (project.stack || []).map(item => `<span class="stack-tag">${escapeHtml(item)}</span>`).join('');

    const link = document.getElementById('modalLink');
    if (project.url) {
        link.href = project.url;
        link.classList.remove('hidden');
    } else {
        link.classList.add('hidden');
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function initProjectModal() {
    document.querySelectorAll('[data-close-modal]').forEach(element => {
        element.addEventListener('click', closeProjectModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeProjectModal();
        }
    });
}

function escapeHtml(value = '') {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

// Дополнительная инициализация проектов после загрузки страницы
window.addEventListener('load', () => {
    initProjectFilters();
    initProjectModal();
    loadProjects();
});
