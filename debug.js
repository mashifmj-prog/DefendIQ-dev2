// debug.js - Enhanced error handling and debugging
const debug = {
    enabled: true,
    logLevel: 'verbose', // 'verbose', 'info', 'warn', 'error'

    init() {
        this.setupErrorHandling();
        this.checkDependencies();
        this.log('Debug system initialized', 'info');
    },

    setupErrorHandling() {
        // Window error handler
        window.addEventListener('error', (event) => {
            this.handleError('Global Error', event.error, event);
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('Unhandled Promise Rejection', event.reason, event);
        });

        // Console error wrapper
        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.handleError('Console Error', args.join(' '));
            originalConsoleError.apply(console, args);
        };
    },

    handleError(type, error, event = null) {
        const errorInfo = {
            type,
            message: error?.message || error,
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            department: state?.appState?.currentDepartment || 'none',
            state: this.getSafeStateSnapshot()
        };

        this.log(`❌ ${type}: ${errorInfo.message}`, 'error');
        
        // Store error for debugging
        this.storeError(errorInfo);
        
        // Show user-friendly message
        this.showUserMessage(errorInfo);
    },

    getSafeStateSnapshot() {
        try {
            return {
                currentDepartment: state?.appState?.currentDepartment,
                currentMode: state?.appState?.currentMode,
                modulesLoaded: document.querySelectorAll('.module-card').length,
                departmentSelected: !!state?.appState?.currentDepartment
            };
        } catch (e) {
            return { error: 'Could not get state snapshot' };
        }
    },

    storeError(errorInfo) {
        try {
            const errors = JSON.parse(localStorage.getItem('defendiq_errors') || '[]');
            errors.push(errorInfo);
            // Keep only last 10 errors
            if (errors.length > 10) errors.shift();
            localStorage.setItem('defendiq_errors', JSON.stringify(errors));
        } catch (e) {
            console.warn('Could not store error:', e);
        }
    },

    checkDependencies() {
        const dependencies = {
            state: typeof state !== 'undefined',
            ui: typeof ui !== 'undefined',
            departments: typeof departments !== 'undefined',
            canvas: typeof canvas !== 'undefined',
            quiz: typeof quiz !== 'undefined',
            api: typeof api !== 'undefined'
        };

        const missing = Object.entries(dependencies).filter(([_, exists]) => !exists);
        
        if (missing.length > 0) {
            this.handleError('Missing Dependencies', `Missing: ${missing.map(([name]) => name).join(', ')}`);
        }

        this.log('Dependencies check:', 'info', dependencies);
    },

    showUserMessage(errorInfo) {
        // Create a more helpful error message
        const message = this.getUserFriendlyMessage(errorInfo);
        
        // Use existing UI notification if available
        if (typeof ui !== 'undefined' && ui.showNotification) {
            ui.showNotification(message, 'error');
        } else {
            // Fallback notification
            this.showFallbackNotification(message);
        }
    },

    getUserFriendlyMessage(errorInfo) {
        const message = errorInfo.message?.toString() || 'Unknown error';
        
        // Common error patterns and their user-friendly messages
        if (message.includes('state is not defined')) {
            return 'Application configuration loading. Please refresh the page.';
        }
        if (message.includes('department') && message.includes('undefined')) {
            return 'Please select a department first.';
        }
        if (message.includes('module') && message.includes('undefined')) {
            return 'Module data is still loading. Please try again.';
        }
        if (message.includes('localStorage') || message.includes('quota')) {
            return 'Browser storage issue. Please check your browser settings.';
        }
        
        return 'An unexpected error occurred. Our team has been notified.';
    },

    showFallbackNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: #f44336;
            color: white;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">⚠️ Error</div>
            <div style="font-size: 14px;">${message}</div>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: 1px solid white;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                margin-top: 10px;
                cursor: pointer;
            ">Dismiss</button>
        `;
        document.body.appendChild(notification);
    },

    log(message, level = 'info', data = null) {
        if (!this.enabled) return;
        
        const shouldLog = this.shouldLogLevel(level);
        if (!shouldLog) return;

        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const prefix = `[${timestamp}] ${level.toUpperCase()}:`;
        
        if (data) {
            console[level](prefix, message, data);
        } else {
            console[level](prefix, message);
        }
    },

    shouldLogLevel(level) {
        const levels = { verbose: 0, info: 1, warn: 2, error: 3 };
        const currentLevel = levels[this.logLevel] || 1;
        const messageLevel = levels[level] || 1;
        return messageLevel >= currentLevel;
    },

    // Debug methods for testing
    testErrorHandling() {
        this.log('Testing error handling...', 'info');
        
        // Test different error types
        setTimeout(() => {
            try {
                // This will trigger the error handler
                undefinedFunction();
            } catch (e) {
                this.handleError('Test Error', e);
            }
        }, 1000);
    },

    getStoredErrors() {
        try {
            return JSON.parse(localStorage.getItem('defendiq_errors') || '[]');
        } catch (e) {
            return [];
        }
    },

    clearStoredErrors() {
        localStorage.removeItem('defendiq_errors');
        this.log('Stored errors cleared', 'info');
    }
};
