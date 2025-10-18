// Main application script - Enterprise Edition
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    console.log('🚀 Initializing DefendIQ Enterprise...');
    
    // Initialize state management
    if (typeof state !== 'undefined') {
        state.loadState();
        console.log('✅ State management initialized');
    }
    
    // Initialize UI components
    if (typeof ui !== 'undefined') {
        ui.init();
        console.log('✅ UI components initialized');
    }
    
    // Initialize canvas background
    if (typeof canvas !== 'undefined') {
        canvas.init();
        console.log('✅ Canvas background initialized');
    }
    
    // Set up global event listeners
    setupGlobalEventListeners();
    
    // Check if user needs to select a department
    const currentDepartment = state.getCurrentDepartment();
    if (!currentDepartment) {
        console.log('ℹ️ No department selected - showing department selection');
    } else {
        console.log(`ℹ️ Current department: ${currentDepartment}`);
        ui.updateDepartmentUI();
    }
    
    console.log('🎯 DefendIQ Enterprise ready!');
});

// Global event listeners
function setupGlobalEventListeners() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // Page became visible - refresh data if needed
            if (typeof ui !== 'undefined' && state.getCurrentDepartment()) {
                ui.updateDepartmentStats();
            }
        }
    });
    
    // Handle beforeunload for data saving
    window.addEventListener('beforeunload', function() {
        if (typeof state !== 'undefined') {
            state.saveState();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + S to save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            if (typeof state !== 'undefined') {
                state.saveState();
                ui.showNotification('Progress saved successfully!', 'success');
            }
        }
        
        // Escape key to go back
        if (event.key === 'Escape') {
            const moduleContent = document.getElementById('moduleContent');
            if (moduleContent && moduleContent.style.display !== 'none') {
                ui.closeModuleView();
            }
        }
    });
    
    // Service Worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    }
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    if (typeof ui !== 'undefined') {
        ui.showNotification('An unexpected error occurred. Please refresh the page.', 'error');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setupGlobalEventListeners };
}
