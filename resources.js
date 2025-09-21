// Resources page specific JavaScript

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');

document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
    initializeResourceInteractions();
});

function initializeSlider() {
    showSlide(currentSlideIndex);
    
    // Auto-advance slides every 8 seconds
    setInterval(() => {
        changeSlide(1);
    }, 8000);
}

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show current slide and activate indicator
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentSlideIndex = index;
}

function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    
    if (newIndex >= slides.length) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = slides.length - 1;
    }
    
    showSlide(newIndex);
}

function currentSlide(index) {
    showSlide(index - 1); // Convert to 0-based index
}

function initializeResourceInteractions() {
    // Add click handlers for resource cards
    const resourceCards = document.querySelectorAll('.resource-category, .online-card');
    
    resourceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Add click handlers for contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('click', function() {
            const phoneNumber = this.querySelector('.contact-number').textContent;
            if (phoneNumber.includes('911')) {
                window.location.href = 'tel:911';
            } else if (phoneNumber.includes('1-800-799-7233')) {
                window.location.href = 'tel:18007997233';
            } else if (phoneNumber.includes('1-800-656-4673')) {
                window.location.href = 'tel:18006564673';
            } else if (phoneNumber.includes('988')) {
                window.location.href = 'tel:988';
            } else if (phoneNumber.includes('741741')) {
                copyToClipboard('741741');
                showSuccessMessage('Crisis Text Line number copied to clipboard!');
            }
        });
    });
}

// Search functionality for resources
function searchResources() {
    const searchTerm = document.getElementById('resourceSearch').value.toLowerCase();
    const resourceCards = document.querySelectorAll('.resource-category, .online-card');
    
    resourceCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0.5';
        }
    });
}

// Filter resources by category
function filterResources(category) {
    const resourceCards = document.querySelectorAll('.resource-category, .online-card');
    
    resourceCards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0.5';
        }
    });
    
    // Update filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
}

// Expand/collapse resource details
function toggleResourceDetails(cardId) {
    const card = document.getElementById(cardId);
    const details = card.querySelector('.resource-details');
    const toggleBtn = card.querySelector('.toggle-btn');
    
    if (details.style.display === 'none' || !details.style.display) {
        details.style.display = 'block';
        toggleBtn.textContent = 'Show Less';
        card.classList.add('expanded');
    } else {
        details.style.display = 'none';
        toggleBtn.textContent = 'Show More';
        card.classList.remove('expanded');
    }
}

// Add keyboard navigation for slider
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Touch/swipe support for mobile slider
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', function(e) {
    startX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    endX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const threshold = 50; // Minimum swipe distance
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swiped left - next slide
            changeSlide(1);
        } else {
            // Swiped right - previous slide
            changeSlide(-1);
        }
    }
}

// Add animation when resources come into view
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    const animateElements = document.querySelectorAll('.resource-category, .online-card, .contact-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    animateOnScroll();
});

// Add to the CSS for animations
const style = document.createElement('style');
style.textContent = `
    .resource-category, .online-card, .contact-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .resource-category.animate-in, .online-card.animate-in, .contact-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .slider {
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
    }
    
    .slide {
        display: none;
        animation: fadeIn 0.5s ease-in-out;
    }
    
    .slide.active {
        display: block;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    .slider-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .slider-btn {
        background-color: #8b5cf6;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        transition: background-color 0.2s;
    }
    
    .slider-btn:hover {
        background-color: #7c3aed;
    }
    
    .slider-indicators {
        display: flex;
        gap: 0.5rem;
    }
    
    .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #d1d5db;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .indicator.active {
        background-color: #8b5cf6;
    }
    
    .tip-card {
        background-color: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        text-align: center;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .tip-card h3 {
        color: #1f2937;
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .tip-card p {
        color: #6b7280;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        flex-grow: 1;
    }
    
    .tip-actions {
        margin-top: auto;
    }
`;
document.head.appendChild(style);