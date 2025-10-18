// Main application script - Enterprise Edition (Enhanced Error Handling)
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing DefendIQ Enterprise...');
    
    // Initialize debug system first
    if (typeof debug === 'undefined') {
        console.error('❌ Debug system not loaded');
        showEmergencyError('Application configuration failed to load. Please refresh the page.');
        return;
    }

    // Check if all required components are loaded
    const requiredComponents = ['state', 'ui', 'departments'];
    const missingComponents = requiredComponents.filter(comp => typeof window[comp] === 'undefined');
    
    if (missingComponents.length > 0) {
        console.error('❌ Missing required components:', missingComponents);
        showEmergencyError(`Required components missing: ${missingComponents.join(', ')}. Please refresh the page.`);
        return;
    }
    
    try {
        debug.log('Starting application initialization...', 'info');
        
        // Initialize state management
        if (typeof state !== 'undefined') {
            state.loadState();
            debug.log('✅ State management initialized', 'info');
        } else {
            throw new Error('State management not loaded');
        }
        
        // Initialize UI components
        if (typeof ui !== 'undefined') {
            ui.init();
            debug.log('✅ UI components initialized', 'info');
        } else {
            throw new Error('UI components not loaded');
        }
        
        // Initialize canvas background
        if (typeof canvas !== 'undefined') {
            canvas.init();
            debug.log('✅ Canvas background initialized', 'info');
        }
        
        // Check if user needs to select a department
        const currentDepartment = state.getCurrentDepartment();
        if (!currentDepartment) {
            debug.log('No department selected - showing department selection', 'info');
        } else {
            debug.log(`Current department: ${currentDepartment}`, 'info');
            ui.updateDepartmentUI();
        }
        
        debug.log('🎯 DefendIQ Enterprise ready!', 'info');
        debug.updateLoadingProgress(100);
        
        // Hide loading indicator after a short delay
        setTimeout(() => {
            debug.hideLoadingIndicator();
        }, 500);
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        handleInitializationError(error);
    }
});

// Emergency error display
function showEmergencyError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #1e1e1e;
        color: #ff4444;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 20px;
    `;
    errorDiv.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 20px;">🛡️</div>
        <h1 style="color: #ff4444; margin-bottom: 20px;">DefendIQ Enterprise</h1>
        <h2 style="color: #ff8888; margin-bottom: 30px;">Application Error</h2>
        <p style="margin-bottom: 20px; max-width: 500px;">${message}</p>
        <button onclick="window.location.reload()" style="
            background: #ff4444;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
        ">Refresh Application</button>
    `;
    document.body.appendChild(errorDiv);
    
    // Hide loading indicator
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Handle initialization errors
function handleInitializationError(error) {
    const errorInfo = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    };
    
    // Store error for debugging
    try {
        localStorage.setItem('last_init_error', JSON.stringify(errorInfo));
    } catch (e) {
        // Ignore storage errors
    }
    
    showEmergencyError(`
        Application failed to initialize properly.<br><br>
        <strong>Error:</strong> ${error.message}<br><br>
        Please refresh the page to try again.<br>
        If the problem persists, contact support.
    `);
}

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
                if (typeof ui !== 'undefined') {
                    ui.showNotification('Progress saved successfully!', 'success');
                }
            }
        }
        
        // Escape key to go back
        if (event.key === 'Escape') {
            const moduleContent = document.getElementById('moduleContent');
            if (moduleContent && moduleContent.style.display !== 'none') {
                if (typeof ui !== 'undefined') {
                    ui.closeModuleView();
                }
            }
        }
    });
}

// Initialize global event listeners when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGlobalEventListeners);
} else {
    setupGlobalEventListeners();
}

// Enhanced error recovery
window.addEventListener('error', function(event) {
    const error = event.error;
    
    if (typeof debug !== 'undefined') {
        debug.handleError('Global Error', error, event);
    } else {
        console.error('Global error (debug not available):', error);
    }
    
    // Don't show duplicate notifications for loading errors
    const errorMessage = error?.message || '';
    const isLoadingError = errorMessage.includes('Loading') || 
                          errorMessage.includes('loading') ||
                          errorMessage.includes('not defined');
    
    if (!isLoadingError && typeof ui !== 'undefined') {
        try {
            ui.showNotification('An unexpected error occurred. Please try again.', 'error');
        } catch (e) {
            console.log('UI not available for notification');
        }
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (typeof debug !== 'undefined') {
        debug.handleError('Unhandled Promise Rejection', event.reason, event);
    }
});

console.log('📦 Application scripts loaded successfully');
