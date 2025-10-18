// Enhanced state management for enterprise features
const state = {
    appState: {
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
    },

    // Initialize department state
    createDepartmentState(departmentId) {
        const deptModules = departments[departmentId].modules;
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
            const savedState = localStorage.getItem('defendIQEnterprise');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.appState = { ...this.appState, ...parsed };
                
                // Ensure all departments have state
                ['nms', 'hr', 'it'].forEach(dept => {
                    if (!this.appState.departmentProgress[dept]) {
                        this.appState.departmentProgress[dept] = this.createDepartmentState(dept);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading state:', error);
            this.initializeDefaultState();
        }
    },

    // Save state to localStorage
    saveState() {
        try {
            this.appState.lastActivity = new Date().toISOString();
            localStorage.setItem('defendIQEnterprise', JSON.stringify(this.appState));
        } catch (error) {
            console.error('Error saving state:', error);
        }
    },

    // Initialize default state
    initializeDefaultState() {
        this.appState = {
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

    // Department management
    setCurrentDepartment(departmentId) {
        this.appState.currentDepartment = departmentId;
        this.appState.userProfile.department = departmentId;
        this.saveState();
    },

    getCurrentDepartment() {
        return this.appState.currentDepartment;
    },

    getDepartmentState(departmentId) {
        return this.appState.departmentProgress[departmentId] || this.createDepartmentState(departmentId);
    },

    // Module progress tracking
    updateModuleProgress(departmentId, moduleId, progress) {
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
        const deptState = this.getDepartmentState(departmentId);
        const module = deptState.modules.find(m => m.id === moduleId);
        
        if (module) {
            module.quizScore = score;
            module.timeSpent += timeSpent;
            module.lastAttempt = new Date().toISOString();
            deptState.totalTimeSpent += timeSpent;
            
            // Auto-complete if score is high enough
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
        const deptState = this.getDepartmentState(departmentId);
        const module = deptState.modules.find(m => m.id === moduleId);
        const department = departments[departmentId];
        const moduleInfo = department.modules.find(m => m.id === moduleId);
        
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
        this.appState.userProfile = { ...this.appState.userProfile, ...profileData };
        this.saveState();
    },

    // Chat history
    addChatMessage(sender, message, departmentId = null) {
        const chatMessage = {
            id: Date.now().toString(),
            sender: sender,
            message: message,
            timestamp: new Date().toISOString(),
            departmentId: departmentId || this.appState.currentDepartment
        };
        
        this.appState.chatHistory.push(chatMessage);
        
        // Keep only last 100 messages
        if (this.appState.chatHistory.length > 100) {
            this.appState.chatHistory = this.appState.chatHistory.slice(-100);
        }
        
        this.saveState();
        return chatMessage;
    },

    // Get department statistics for executive view
    getDepartmentStatistics() {
        const stats = {};
        
        ['nms', 'hr', 'it'].forEach(deptId => {
            const deptState = this.getDepartmentState(deptId);
            const department = departments[deptId];
            
            stats[deptId] = {
                name: department.name,
                totalModules: department.modules.length,
                completedModules: deptState.completedModules,
                overallScore: deptState.overallScore,
                totalTimeSpent: deptState.totalTimeSpent,
                lastActivity: deptState.lastActivity,
                completionRate: department.modules.length > 0 ? 
                    Math.round((deptState.completedModules / department.modules.length) * 100) : 0
            };
        });
        
        return stats;
    },

    // Get overall organizational metrics
    getOrganizationalMetrics() {
        const deptStats = this.getDepartmentStatistics();
        let totalModules = 0;
        let totalCompleted = 0;
        let totalScore = 0;
        let activeDepartments = 0;
        
        Object.values(deptStats).forEach(stat => {
            totalModules += stat.totalModules;
            totalCompleted += stat.completedModules;
            totalScore += stat.overallScore;
            if (stat.completedModules > 0) activeDepartments++;
        });
        
        return {
            totalEmployees: 1, // In single-user mode, this would be 1
            totalModules: totalModules,
            completedModules: totalCompleted,
            overallCompletionRate: totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0,
            averageScore: activeDepartments > 0 ? Math.round(totalScore / activeDepartments) : 0,
            totalTrainingHours: Math.round(Object.values(deptStats).reduce((sum, stat) => sum + stat.totalTimeSpent, 0) / 3600000)
        };
    },

    // Reset progress (for testing)
    resetProgress() {
        this.appState.departmentProgress = {
            nms: this.createDepartmentState('nms'),
            hr: this.createDepartmentState('hr'),
            it: this.createDepartmentState('it')
        };
        this.saveState();
    }
};

// Initialize state when script loads
state.loadState();
