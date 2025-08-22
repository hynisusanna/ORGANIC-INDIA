document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips with elegant fade animation and custom placement
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el, {
        animation: true,
        delay: { show: 150, hide: 250 },
        placement: 'top',
        customClass: 'elegant-tooltip'
    }));

    // Auto-hide alerts with smooth slide-out animation
    setTimeout(() => {
        document.querySelectorAll('.alert.alert-dismissible').forEach(alert => {
            alert.classList.add('slide-out-right');
            setTimeout(() => new bootstrap.Alert(alert).close(), 500);
        });
    }, 5000);

    // Form validation with glowing feedback borders
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
            addGlowEffect(form);
        }, false);
    });

    // Enhanced price calculation with smooth number animation and currency formatting
    const quantityInput = document.getElementById('quantity');
    const totalPriceInput = document.getElementById('total_price');
    if (quantityInput && totalPriceInput) {
        const pricePerUnit = parseFloat(quantityInput.dataset.price) || 0;
        quantityInput.addEventListener('input', function() {
            const quantity = parseInt(this.value) || 0;
            const total = quantity * pricePerUnit;
            animateValue(totalPriceInput, parseFloat(totalPriceInput.value) || 0, total, 500);
            totalPriceInput.value = formatCurrency(total);
            addPulseEffect(totalPriceInput);
        });
    }

    // Debounced live search with loading spinner and results fade-in
    const searchInput = document.getElementById('search');
    if (searchInput) {
        const searchForm = searchInput.closest('form');
        const loadingSpinner = document.createElement('span');
        loadingSpinner.className = 'spinner-border spinner-border-sm ms-2 d-none';
        searchInput.after(loadingSpinner);

        const debouncedSearch = debounce(() => {
            loadingSpinner.classList.remove('d-none');
            searchForm.submit();
        }, 400);
        searchInput.addEventListener('input', debouncedSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                debouncedSearch();
            }
        });
        // Assume results container exists, add fade-in
        const resultsContainer = document.querySelector('#search-results');
        if (resultsContainer) {
            resultsContainer.classList.add('fade-in-animation');
        }
    }

    // Custom confirm modal with elegant animations and backdrop blur
    document.querySelectorAll('[data-confirm]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showCustomConfirm(this.dataset.confirm || 'Are you sure you want to proceed?', () => {
                window.location.href = button.getAttribute('href') || '#';
            }, { animation: 'zoom-in', backdrop: 'blur' });
        });
    });

    // Form submission with progressive loading bar
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
                submitBtn.classList.add('btn-loading');
                addLoadingBar(form);
            }
        });
    });

    // Auto-focus with smooth highlight animation
    const firstInput = document.querySelector('form input:not([type="hidden"]):first-of-type');
    if (firstInput) {
        setTimeout(() => {
            firstInput.focus();
            firstInput.classList.add('input-focused', 'animate__animated', 'animate__bounceIn');
        }, 200);
    }

    // Number input validation with shake animation on error
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('blur', function() {
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);
            let value = parseFloat(this.value);
            
            if (!isNaN(min) && value < min) {
                this.value = min;
                showAlert(`Value adjusted to minimum: ${min}`, 'warning');
                addShakeEffect(this);
            }
            if (!isNaN(max) && value > max) {
                this.value = max;
                showAlert(`Value adjusted to maximum: ${max}`, 'warning');
                addShakeEffect(this);
            }
        });
    });

    // Enhanced category badges with hover scale and color transitions
    const categoryIcons = {
        'vegetables': { icon: 'fas fa-carrot', color: 'text-success', bg: 'bg-success-subtle' },
        'spices': { icon: 'fas fa-pepper-hot', color: 'text-danger', bg: 'bg-danger-subtle' },
        'grains': { icon: 'fas fa-seedling', color: 'text-warning', bg: 'bg-warning-subtle' },
        'oil': { icon: 'fas fa-tint', color: 'text-info', bg: 'bg-info-subtle' },
        'utensils': { icon: 'fas fa-utensils', color: 'text-secondary', bg: 'bg-secondary-subtle' },
        'packaging': { icon: 'fas fa-box', color: 'text-primary', bg: 'bg-primary-subtle' },
        'dairy': { icon: 'fas fa-glass-whiskey', color: 'text-light', bg: 'bg-light' },
        'meat': { icon: 'fas fa-drumstick-bite', color: 'text-danger', bg: 'bg-danger-subtle' },
        'condiments': { icon: 'fas fa-bottle-droplet', color: 'text-warning', bg: 'bg-warning-subtle' },
        'other': { icon: 'fas fa-ellipsis-h', color: 'text-muted', bg: 'bg-muted' }
    };

    document.querySelectorAll('.badge[data-category]').forEach(badge => {
        const category = badge.dataset.category;
        const { icon, color, bg } = categoryIcons[category] || categoryIcons['other'];
        badge.innerHTML = `<i class="${icon} me-1 ${color}"></i>${badge.textContent}`;
        badge.classList.add(bg, 'hover-scale');
        badge.setAttribute('data-bs-toggle', 'tooltip');
        badge.setAttribute('title', category.charAt(0).toUpperCase() + category.slice(1));
    });

    // Smooth scrolling with easing function
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                smoothScrollTo(targetElement.offsetTop - 80, 800);
            }
        });
    });

    // Real-time input validation with color transitions and icons
    document.querySelectorAll('.form-control, .form-select').forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid', 'animate__animated', 'animate__fadeIn');
                addValidationIcon(this, 'valid');
            } else {
                this.classList.remove('is-valid', 'animate__animated', 'animate__fadeIn');
                this.classList.add('is-invalid');
                addValidationIcon(this, 'invalid');
            }
        });
    });

    // Enhanced table rows with ripple effect on click
    document.querySelectorAll('table tbody tr[data-href]').forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function(e) {
            createRipple(e, row);
            setTimeout(() => {
                window.location.href = this.dataset.href;
            }, 300);
        });
        row.addEventListener('mouseenter', () => row.classList.add('table-hover-row', 'shadow-sm'));
        row.addEventListener('mouseleave', () => row.classList.remove('table-hover-row', 'shadow-sm'));
    });

    // Mobile menu with elegant slide-in and overlay
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            navbarCollapse.classList.toggle('show');
            navbarCollapse.classList.toggle('slide-in-left');
            document.body.classList.toggle('overlay-active');
        });
    }

    // Theme toggle with smooth color transition and particle effect
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.classList.add('theme-transition');
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            setTimeout(() => document.documentElement.classList.remove('theme-transition'), 500);
            showAlert(`Theme elegantly switched to ${newTheme} mode`, 'info');
            addParticleEffect();
        });
    }

    // Page load fade-in for main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in-up');
    }

    // Back to top button with smooth scroll and visibility toggle
    const backToTop = document.createElement('button');
    backToTop.className = 'btn btn-primary back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    backToTop.addEventListener('click', () => smoothScrollTo(0, 600));

    // Product card enhancements (assuming .card elements exist)
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('shadow-lg', 'scale-up');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('shadow-lg', 'scale-up');
        });
    });
});

// Enhanced utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
}

function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show animate__animated animate__bounceIn`;
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertContainer, container.firstChild);
        setTimeout(() => {
            alertContainer.classList.add('animate__bounceOut');
            setTimeout(() => new bootstrap.Alert(alertContainer).close(), 500);
        }, 5000);
    }
}

function showCustomConfirm(message, callback, options = {}) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered ${options.animation || ''}">
            <div class="modal-content ${options.backdrop ? 'backdrop-blur' : ''}">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm Your Action</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">${message}</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary confirm-btn">Confirm</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal, { backdrop: 'static' });
    bsModal.show();
    modal.querySelector('.confirm-btn').addEventListener('click', () => {
        callback();
        bsModal.hide();
    });
}

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

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = timestamp => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.value = formatCurrency(start + progress * (end - start));
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const ease = progress ** 2 * (3 - 2 * progress); // Ease in out cubic
        window.scrollTo(0, startY + distance * ease);
        if (progress < 1) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}

function createRipple(event, element) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.offsetX - radius}px`;
    ripple.style.top = `${event.offsetY - radius}px`;
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function addGlowEffect(element) {
    element.classList.add('glow-effect');
    setTimeout(() => element.classList.remove('glow-effect'), 1000);
}

function addPulseEffect(element) {
    element.classList.add('pulse-effect');
    setTimeout(() => element.classList.remove('pulse-effect'), 500);
}

function addShakeEffect(element) {
    element.classList.add('shake-effect');
    setTimeout(() => element.classList.remove('shake-effect'), 500);
}

function addValidationIcon(input, type) {
    let icon = input.nextElementSibling;
    if (!icon || !icon.classList.contains('validation-icon')) {
        icon = document.createElement('i');
        icon.className = 'validation-icon';
        input.after(icon);
    }
    icon.className = `validation-icon fas fa-${type === 'valid' ? 'check text-success' : 'times text-danger'}`;
}

function addLoadingBar(form) {
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    form.prepend(loadingBar);
    setTimeout(() => loadingBar.style.width = '100%', 100);
    // Assume removal on success/error
}

function addParticleEffect() {
    // Simple confetti-like particles using divs
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${Math.random() * 2 + 1}s`;
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        particleContainer.appendChild(particle);
    }
    setTimeout(() => particleContainer.remove(), 3000);
}

// Export enhanced utilities for global access
window.marketplace = {
    formatCurrency,
    showAlert,
    showCustomConfirm,
    debounce,
    smoothScrollTo,
    createRipple
};