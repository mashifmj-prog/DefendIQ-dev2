// debug.js - Enhanced error handling and debugging
const debug = {
    enabled: true,
    logLevel: 'verbose',

    init() {
        this.setupErrorHandling();
        this.checkDependencies();
        this.log('Debug system initialized', 'info');
        this.updateLoadingProgress(20);
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
    },

    handleError(type, error, event = null) {
        const errorInfo = {
            type,
            message: error?.message || error,
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            department: window.state?.appState?.currentDepartment || 'none'
        };

        this.log(`❌ ${type}: ${errorInfo.message}`, 'error');
        
        // Store error for debugging
        this.storeError(errorInfo);
        
        // Show user-friendly message
        this.showUserMessage(errorInfo);
    },

    storeError(errorInfo) {
        try {
            const errors = JSON.parse(localStorage.getItem('defendiq_errors') || '[]');
            errors.push(errorInfo);
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

        this.log('Dependencies check:', 'info', dependencies);
        this.updateLoadingProgress(40);
    },

    showUserMessage(errorInfo) {
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
        
        if (message.includes('state is not defined')) {
            return 'Application configuration loading. Please wait...';
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
        
        return 'Application loading. Please wait a moment...';
    },

    showFallbackNotification(message) {
        // Only show if not already showing loading indicator
        if (document.getElementById('loadingIndicator').style.display !== 'none') {
            return;
        }

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
            <div style="font-weight: bold; margin-bottom: 5px;">⚠️ Loading</div>
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
        
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const prefix = `[${timestamp}] ${level.toUpperCase()}:`;
        
        if (data) {
            console[level](prefix, message, data);
        } else {
            console[level](prefix, message);
        }
    },

    updateLoadingProgress(percent) {
        const progressBar = document.getElementById('loadingProgress');
        if (progressBar) {
            progressBar.style.width = percent + '%';
        }
    },

    hideLoadingIndicator() {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
};

// Initialize debug immediately
debug.init();
