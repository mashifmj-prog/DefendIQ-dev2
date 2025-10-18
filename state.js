// Enhanced state management for enterprise features
const state = {
    appState: null,

    // Initialize default state structure
    getDefaultState() {
        return {
            currentDepartment: null,
            currentMode: 'training',
            userProfile: {
                name: '',
                employeeId: '',
                department: '',
                role: '',
                knowledgeLevel: 'beginner',
                learningStyle: 'visual',
                riskProfile: 'medium'
            },
            departmentProgress: {
                nms: this.createDepartmentState('nms'),
                hr: this.createDepartmentState('hr'),
                it: this.createDepartmentState('it')
            },
            chatHistory: [],
            preferences: {
                theme: 'dark',
                notifications: true,
                language: 'en'
            },
            lastActivity: new Date().toISOString()
        };
    },

    // Initialize department state
    createDepartmentState(departmentId) {
        // Safe check for departments object
        const deptModules = (window.departments && window.departments[departmentId] && window.departments[departmentId].modules) || [];
        
        return {
            departmentId: departmentId,
            modules: deptModules.map(module => ({
                id: module.id,
                completed: false,
                progress: 0,
                quizScore: 0,
                lastAttempt: null,
                timeSpent: 0
            })),
            overallScore: 0,
            completedModules: 0,
            totalTimeSpent: 0,
            lastActivity: null,
            certificates: []
        };
    },

    // Load state from localStorage
    loadState() {
        try {
            debug.log('Loading application state...', 'info');
            const savedState = localStorage.getItem('defendIQEnterprise');
            
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.appState = { ...this.getDefaultState(), ...parsed };
                debug.log('State loaded successfully', 'info');
            } else {
                this.appState = this.getDefaultState();
                debug.log('No saved state found, using defaults', 'info');
            }
            
            // Ensure all departments have state
            ['nms', 'hr', 'it'].forEach(dept => {
                if (!this.appState.departmentProgress[dept]) {
                    this.appState.departmentProgress[dept] = this.createDepartmentState(dept);
                }
            });

            debug.updateLoadingProgress(60);
            
        } catch (error) {
            debug.log('Error loading state, using defaults', 'error', error);
            this.appState = this.getDefaultState();
            this.saveState();
        }
    },

    // Save state to localStorage
    saveState() {
        if (!this.appState) {
            debug.log('Cannot save: appState not initialized', 'warn');
            return;
        }

        try {
            this.appState.lastActivity = new Date().toISOString();
            localStorage.setItem('defendIQEnterprise', JSON.stringify(this.appState));
        } catch (error) {
            debug.log('Error saving state', 'error', error);
        }
    },

    // Department management
    setCurrentDepartment(departmentId) {
        if (!this.appState) {
            debug.log('appState not initialized', 'warn');
            return;
        }
        
        this.appState.currentDepartment = departmentId;
        this.appState.userProfile.department = departmentId;
        this.saveState();
    },

    getCurrentDepartment() {
        return this.appState?.currentDepartment || null;
    },

    getDepartmentState(departmentId) {
        if (!this.appState?.departmentProgress) {
            return this.createDepartmentState(departmentId);
        }
        return this.appState.departmentProgress[departmentId] || this.createDepartmentState(departmentId);
    },

    // Module progress tracking
    updateModuleProgress(departmentId, moduleId, progress) {
        if (!this.appState) return;

        const deptState = this.getDepartmentState(departmentId);
        const module = deptState.modules.find(m => m.id === moduleId);
        
        if (module) {
            module.progress = progress;
            if (progress >= 100 && !module.completed) {
                module.completed = true;
                deptState.completedModules++;
                this.generateCertificate(departmentId, moduleId);
            }
            deptState.lastActivity = new Date().toISOString();
            this.updateOverallScore(departmentId);
            this.saveState();
        }
    },

    // Quiz results
    recordQuizResult(departmentId, moduleId, score, timeSpent) {
        if (!this.appState) return;

        const deptState = this.getDepartmentState(departmentId);
        const module = deptState.modules.find(m => m.id === moduleId);
        
        if (module) {
            module.quizScore = score;
            module.timeSpent += timeSpent;
            module.lastAttempt = new Date().toISOString();
            deptState.totalTimeSpent += timeSpent;
            
            if (score >= 80 && !module.completed) {
                module.completed = true;
                module.progress = 100;
                deptState.completedModules++;
                this.generateCertificate(departmentId, moduleId);
            }
            
            this.updateOverallScore(departmentId);
            this.saveState();
        }
    },

    // Overall department score
    updateOverallScore(departmentId) {
        if (!this.appState) return;

        const deptState = this.getDepartmentState(departmentId);
        const completedModules = deptState.modules.filter(m => m.completed);
        
        if (completedModules.length > 0) {
            const averageScore = completedModules.reduce((sum, module) => sum + (module.quizScore || 0), 0) / completedModules.length;
            deptState.overallScore = Math.round(averageScore);
        } else {
            deptState.overallScore = 0;
        }
    },

    // Certificate generation
    generateCertificate(departmentId, moduleId) {
        if (!this.appState) return null;

        const deptState = this.getDepartmentState(departmentId);
        const module = deptState.modules.find(m => m.id === moduleId);
        const department = window.departments?.[departmentId];
        const moduleInfo = department?.modules?.find(m => m.id === moduleId);
        
        if (module && moduleInfo) {
            const certificate = {
                id: this.generateCertificateId(),
                departmentId: departmentId,
                moduleId: moduleId,
                moduleTitle: moduleInfo.title,
                issueDate: new Date().toISOString(),
                score: module.quizScore || 100,
                employeeName: this.appState.userProfile.name,
                employeeId: this.appState.userProfile.employeeId
            };
            
            deptState.certificates.push(certificate);
            this.saveState();
            
            return certificate;
        }
        return null;
    },

    generateCertificateId() {
        return 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    },

    // User profile management
    updateUserProfile(profileData) {
        if (!this.appState) return;
        
        this.appState.userProfile = { ...this.appState.userProfile, ...profileData };
        this.saveState();
    },

    // Chat history
    addChatMessage(sender, message, departmentId = null) {
        if (!this.appState) return null;

        const chatMessage = {
            id: Date.now().toString(),
            sender: sender,
            message: message,
            timestamp: new Date().toISOString(),
            departmentId: departmentId || this.appState.currentDepartment
        };
        
        this.appState.chatHistory.push(chatMessage);
        
        if (this.appState.chatHistory.length > 100) {
            this.appState.chatHistory = this.appState.chatHistory.slice(-100);
        }
        
        this.saveState();
        return chatMessage;
    },

    // Get department statistics for executive view
    getDepartmentStatistics() {
        if (!this.appState) return {};
        
        const stats = {};
        
        ['nms', 'hr', 'it'].forEach(deptId => {
            const deptState = this.getDepartmentState(deptId);
            const department = window.departments?.[deptId];
            
            stats[deptId] = {
                name: department?.name || deptId,
                totalModules: department?.modules?.length || 0,
                completedModules: deptState.completedModules,
                overallScore: deptState.overallScore,
                totalTimeSpent: deptState.totalTimeSpent,
                lastActivity: deptState.lastActivity,
                completionRate: department?.modules?.length > 0 ? 
                    Math.round((deptState.completedModules / department.modules.length) * 100) : 0
            };
        });
        
        return stats;
    },

    // Reset progress (for testing)
    resetProgress() {
        if (!this.appState) return;
        
        this.appState.departmentProgress = {
            nms: this.createDepartmentState('nms'),
            hr: this.createDepartmentState('hr'),
            it: this.createDepartmentState('it')
        };
        this.saveState();
    }
};

// Initialize state when script loads
if (typeof debug !== 'undefined') {
    debug.log('State module loaded', 'info');
}
