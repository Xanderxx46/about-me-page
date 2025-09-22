// Main JavaScript file for the About Me site

document.addEventListener('DOMContentLoaded', function() {
    // Auto-refresh session for authenticated users
    let sessionRefreshInterval;
    
    // Check if user is authenticated (has a user object in the global scope)
    if (typeof user !== 'undefined' && user) {
        // Refresh session every 10 minutes
        sessionRefreshInterval = setInterval(() => {
            fetch('/auth/session-refresh', {
                method: 'POST',
                credentials: 'same-origin'
            }).catch(error => {
                console.log('Session refresh failed:', error);
            });
        }, 10 * 60 * 1000); // 10 minutes
        
        // Also refresh on user activity
        let activityTimeout;
        const resetActivityTimer = () => {
            clearTimeout(activityTimeout);
            activityTimeout = setTimeout(() => {
                fetch('/auth/session-refresh', {
                    method: 'POST',
                    credentials: 'same-origin'
                }).catch(error => {
                    console.log('Session refresh failed:', error);
                });
            }, 5 * 60 * 1000); // 5 minutes of inactivity
        };
        
        // Listen for user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetActivityTimer, true);
        });
        
        // Initial activity timer
        resetActivityTimer();
    }
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
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
    
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    });
    
    // Form validation enhancements
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--error-color)';
                    isValid = false;
                } else {
                    field.style.borderColor = 'var(--border-color)';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });
    
    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Skill card animations
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, { threshold: 0.1 });
    
    skillCards.forEach(card => skillObserver.observe(card));
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    if (searchInput && searchResults && clearSearchBtn) {
        let searchTimeout;
        
        // Debounced search function with loading
        const performSearch = debounce(async (query) => {
            if (query.length < 2) {
                searchResults.style.display = 'none';
                clearSearchBtn.style.display = 'none';
                return;
            }
            
            performSearchWithLoading(query);
            clearSearchBtn.style.display = 'block';
        }, 300);
        
        // Search input event listener
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            performSearch(query);
        });
        
        // Clear search button
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchResults.style.display = 'none';
            clearSearchBtn.style.display = 'none';
            searchInput.focus();
        });
        
        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
        
        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchResults.style.display = 'none';
                searchInput.blur();
            }
        });
    }
    
    // Projects filtering functionality
    if (window.projectsData) {
        initializeProjectFilters();
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .lazy.loaded {
            opacity: 1;
        }
        
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-secondary);
            border-top: 1px solid var(--border-color);
            padding: 1rem;
            box-shadow: var(--shadow-lg);
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .notification-info {
            background: var(--bg-card);
            border: 1px solid var(--primary-color);
            color: var(--text-primary);
        }
        
        .notification-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid var(--error-color);
            color: var(--error-color);
        }
        
        .notification-success {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid var(--success-color);
            color: var(--success-color);
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0;
            margin-left: 1rem;
        }
        
        .notification.show {
            transform: translateX(0);
        }
    `;
    document.head.appendChild(notificationStyle);
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Search results display function
function displaySearchResults(data, query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    const { projects, skills } = data;
    const allResults = [...projects, ...skills];
    
    if (allResults.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No results found for "' + query + '"</div>';
        return;
    }
    
    const resultsHtml = allResults.map(item => {
        const isProject = item.type === 'project';
        const title = isProject ? item.title : item.name;
        const description = isProject ? item.description : item.description;
        const additionalInfo = isProject ? 
            (item.technologies ? `Technologies: ${item.technologies}` : '') :
            `Category: ${item.category} | Level: ${item.level}`;
        
        return `
            <div class="search-result-item">
                <div class="search-result-type">${isProject ? 'Project' : 'Skill'}</div>
                <div class="search-result-title">${highlightText(title, query)}</div>
                <div class="search-result-description">${highlightText(description || '', query)}</div>
                ${additionalInfo ? `<div class="search-result-description small-text">${additionalInfo}</div>` : ''}
            </div>
        `;
    }).join('');
    
    searchResults.innerHTML = resultsHtml;
}

// Highlight search terms in text
function highlightText(text, query) {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Initialize project filters
function initializeProjectFilters() {
    const projectsData = window.projectsData;
    const statusFilter = document.getElementById('statusFilter');
    const techFilter = document.getElementById('techFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const projectsContainer = document.getElementById('projectsContainer');
    const resultsCount = document.getElementById('resultsCount');
    const paginationContainer = document.getElementById('paginationContainer');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    
    if (!statusFilter || !techFilter || !sortFilter || !clearFiltersBtn || !projectsContainer) {
        return;
    }
    
    // Pagination state
    let currentPage = 1;
    let itemsPerPage = 9;
    
    // Populate technology filter with unique technologies
    const allTechnologies = new Set();
    projectsData.forEach(project => {
        if (project.technologies) {
            project.technologies.split(',').forEach(tech => {
                allTechnologies.add(tech.trim());
            });
        }
    });
    
    // Sort technologies alphabetically
    const sortedTechnologies = Array.from(allTechnologies).sort();
    sortedTechnologies.forEach(tech => {
        const option = document.createElement('option');
        option.value = tech;
        option.textContent = tech;
        techFilter.appendChild(option);
    });
    
    // Filter and sort projects
    function filterAndSortProjects() {
        let filteredProjects = [...projectsData];
        
        // Filter by status
        const statusValue = statusFilter.value;
        if (statusValue === 'featured') {
            filteredProjects = filteredProjects.filter(p => p.featured);
        } else if (statusValue === 'non-featured') {
            filteredProjects = filteredProjects.filter(p => !p.featured);
        }
        
        // Filter by technology
        const techValue = techFilter.value;
        if (techValue !== 'all') {
            filteredProjects = filteredProjects.filter(p => 
                p.technologies && p.technologies.toLowerCase().includes(techValue.toLowerCase())
            );
        }
        
        // Sort projects
        const sortValue = sortFilter.value;
        switch (sortValue) {
            case 'name':
                filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'newest':
                filteredProjects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'oldest':
                filteredProjects.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'order':
            default:
                filteredProjects.sort((a, b) => {
                    if (a.featured !== b.featured) {
                        return b.featured - a.featured; // Featured first
                    }
                    return (a.order_index || 0) - (b.order_index || 0);
                });
                break;
        }
        
        displayFilteredProjects(filteredProjects);
    }
    
    // Display filtered projects with pagination
    function displayFilteredProjects(projects) {
        const totalProjects = projects.length;
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = `${totalProjects} project${totalProjects !== 1 ? 's' : ''}`;
        }
        
        if (totalProjects === 0) {
            projectsContainer.innerHTML = `
                <div class="no-projects">
                    <div class="no-projects-content">
                        <i class="fas fa-search"></i>
                        <h3>No projects found</h3>
                        <p>Try adjusting your filters to see more results.</p>
                    </div>
                </div>
            `;
            if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }
            return;
        }
        
        // Calculate pagination
        const totalPages = Math.ceil(totalProjects / itemsPerPage);
        currentPage = Math.min(currentPage, totalPages);
        currentPage = Math.max(currentPage, 1);
        
        // Get projects for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageProjects = projects.slice(startIndex, endIndex);
        
        // Generate HTML for page projects
        const projectsHtml = pageProjects.map(project => {
            const projectLink = project.project_url || project.github_url;
            const isClickable = projectLink ? 'clickable' : '';
            const featuredClass = project.featured ? 'featured' : '';
            
            return `
                <div class="project-card ${featuredClass} ${isClickable}" 
                     ${projectLink ? `onclick="window.open('${projectLink}', '_blank')"` : ''}>
                    ${project.image_url ? `
                        <div class="project-image">
                            <img src="${project.image_url}" alt="${project.title}">
                            ${project.featured ? '<div class="featured-badge">Featured</div>' : ''}
                        </div>
                    ` : ''}
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description || ''}</p>
                        ${project.technologies ? `
                            <div class="project-technologies">
                                ${project.technologies.split(',').map(tech => 
                                    `<span class="tech-tag">${tech.trim()}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                        <div class="project-links">
                            ${project.project_url ? `
                                <a href="${project.project_url}" class="project-link" target="_blank" onclick="event.stopPropagation()">
                                    <i class="fas fa-external-link-alt"></i> Live Demo
                                </a>
                            ` : ''}
                            ${project.github_url ? `
                                <a href="${project.github_url}" class="project-link" target="_blank" onclick="event.stopPropagation()">
                                    <i class="fab fa-github"></i> GitHub
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        projectsContainer.innerHTML = projectsHtml;
        
        // Update grid class based on number of projects on current page
        const projectCount = pageProjects.length;
        projectsContainer.className = 'projects-grid ' + 
            (projectCount === 3 ? 'three-projects' : 
             projectCount <= 2 ? 'few-projects' : 'many-projects');
        
        // Update pagination
        updatePagination(totalPages, currentPage);
    }
    
    // Update pagination controls
    function updatePagination(totalPages, currentPageNum) {
        if (!paginationContainer || !prevPageBtn || !nextPageBtn || !pageNumbers) {
            return;
        }
        
        // Show/hide pagination
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'block';
        
        // Update prev/next buttons
        prevPageBtn.disabled = currentPageNum <= 1;
        nextPageBtn.disabled = currentPageNum >= totalPages;
        
        // Generate page numbers
        let pageNumbersHtml = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPageNum - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pageNumbersHtml += `<span class="page-number" data-page="1">1</span>`;
            if (startPage > 2) {
                pageNumbersHtml += `<span class="page-ellipsis">...</span>`;
            }
        }
        
        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPageNum ? 'active' : '';
            pageNumbersHtml += `<span class="page-number ${activeClass}" data-page="${i}">${i}</span>`;
        }
        
        // Add last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbersHtml += `<span class="page-ellipsis">...</span>`;
            }
            pageNumbersHtml += `<span class="page-number" data-page="${totalPages}">${totalPages}</span>`;
        }
        
        pageNumbers.innerHTML = pageNumbersHtml;
        
        // Add click handlers to page numbers
        pageNumbers.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page !== currentPageNum) {
                    currentPage = page;
                    filterAndSortProjects();
                }
            });
        });
    }
    
    // Event listeners
    statusFilter.addEventListener('change', () => {
        currentPage = 1;
        filterAndSortProjects();
    });
    techFilter.addEventListener('change', () => {
        currentPage = 1;
        filterAndSortProjects();
    });
    sortFilter.addEventListener('change', () => {
        currentPage = 1;
        filterAndSortProjects();
    });
    
    clearFiltersBtn.addEventListener('click', () => {
        statusFilter.value = 'all';
        techFilter.value = 'all';
        sortFilter.value = 'order';
        currentPage = 1;
        filterAndSortProjects();
    });
    
    // Pagination event listeners
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                filterAndSortProjects();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            // Get current filtered projects to check if we can go to next page
            let filteredProjects = [...projectsData];
            
            // Apply current filters
            const statusValue = statusFilter.value;
            if (statusValue === 'featured') {
                filteredProjects = filteredProjects.filter(p => p.featured);
            } else if (statusValue === 'non-featured') {
                filteredProjects = filteredProjects.filter(p => !p.featured);
            }
            
            const techValue = techFilter.value;
            if (techValue !== 'all') {
                filteredProjects = filteredProjects.filter(p => 
                    p.technologies && p.technologies.toLowerCase().includes(techValue.toLowerCase())
                );
            }
            
            const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                filterAndSortProjects();
            }
        });
    }
    
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            currentPage = 1;
            filterAndSortProjects();
        });
    }
    
    // Initial filter
    filterAndSortProjects();
}

// Loading utilities
function showLoadingOverlay(message = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

function showSkeletonLoading(container, count = 3) {
    const skeletonHtml = Array.from({ length: count }, () => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-line long"></div>
            <div class="skeleton skeleton-line medium"></div>
            <div class="skeleton skeleton-line short"></div>
            <div class="skeleton skeleton-button"></div>
        </div>
    `).join('');
    
    container.innerHTML = skeletonHtml;
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('btn-loading');
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = '';
    } else {
        button.classList.remove('btn-loading');
        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

// Enhanced search with loading
function performSearchWithLoading(query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
    }
    
    // Show loading state
    searchResults.style.display = 'block';
    searchResults.innerHTML = `
        <div class="skeleton-card">
            <div class="skeleton skeleton-line long"></div>
            <div class="skeleton skeleton-line medium"></div>
            <div class="skeleton skeleton-line short"></div>
        </div>
    `;
    
    // Perform search
    fetch(`/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data, query);
        })
        .catch(error => {
            console.error('Search error:', error);
            searchResults.innerHTML = '<div class="no-results">Search failed. Please try again.</div>';
        });
}

// Export for use in other scripts
window.AboutMeSite = {
    showNotification,
    debounce,
    throttle,
    displaySearchResults,
    highlightText,
    showLoadingOverlay,
    hideLoadingOverlay,
    showSkeletonLoading,
    setButtonLoading,
    performSearchWithLoading
};
