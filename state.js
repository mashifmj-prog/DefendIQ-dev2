// State management for DefendIQ app
const state = {
    appState: {
        currentMode: null,
        userProfile: {
            name: 'User',
            knowledgeLevel: 'beginner',
            interests: [],
            learningStyle: 'visual'
        },
        trainingProgress: {
            streak: 5,
            points: 350,
            completion: 42,
            badges: 3,
            modules: {
                phishing: { progress: 60, completed: false },
                passwords: { progress: 30, completed: false },
                malware: { progress: 10, completed: false },
                social: { progress: 0, completed: false }
            }
        },
        chatHistory: []
    },

    // Load state from localStorage
    loadState() {
        const savedState = localStorage.getItem('defendIQState');
        if (savedState) {
            this.appState = JSON.parse(savedState);
        }
    },

    // Save state to localStorage
    saveState() {
        localStorage.setItem('defendIQState', JSON.stringify(this.appState));
    },

    // Update user profile
    updateUserProfile(updates) {
        this.appState.userProfile = { ...this.appState.userProfile, ...updates };
        this.saveState();
    },

    // Update training progress
    updateProgress(moduleId, progress) {
        if (this.appState.trainingProgress.modules[moduleId]) {
            this.appState.trainingProgress.modules[moduleId].progress = progress;
            if (progress >= 100) {
                this.appState.trainingProgress.modules[moduleId].completed = true;
            }
            this.updateOverallCompletion();
            this.saveState();
        }
    },

    // Update overall completion percentage
    updateOverallCompletion() {
        const modules = Object.values(this.appState.trainingProgress.modules);
        const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);
        this.appState.trainingProgress.completion = Math.round(totalProgress / modules.length);
    },

    // Add points to user
    addPoints(points) {
        this.appState.trainingProgress.points += points;
        this.saveState();
    },

    // Increment streak
    incrementStreak() {
        this.appState.trainingProgress.streak++;
        this.saveState();
    },

    // Add badge
    addBadge() {
        this.appState.trainingProgress.badges++;
        this.saveState();
    },

    // Add to chat history
    addChatMessage(sender, text) {
        this.appState.chatHistory.push({
            sender,
            text,
            timestamp: new Date().toISOString()
        });
        this.saveState();
    }
};