// Quiz and module management
const quiz = {
    // Load module content
    loadModuleContent(moduleId) {
        const module = state.appState.trainingProgress.modules[moduleId];
        const moduleTitles = {
            phishing: 'Phishing Awareness',
            passwords: 'Password Security',
            malware: 'Malware Protection',
            social: 'Social Engineering'
        };
        
        document.getElementById('moduleTitle').textContent = moduleTitles[moduleId];
        
        // Create module content based on module ID
        let content = '';
        
        if (moduleId === 'phishing') {
            content = this.createPhishingModule(module);
        } else if (moduleId === 'passwords') {
            content = this.createPasswordsModule(module);
        } else if (moduleId === 'malware') {
            content = this.createMalwareModule(module);
        } else if (moduleId === 'social') {
            content = this.createSocialEngineeringModule(module);
        }
        
        document.getElementById('moduleBody').innerHTML = content;
        
        // Add event listeners for quiz buttons
        this.setupQuizListeners(moduleId);
    },

    // Create phishing module content
    createPhishingModule(module) {
        return `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${module.progress}%;"></div>
            </div>
            <p>Progress: ${module.progress}%</p>
            
            <h3>Learning Materials</h3>
            <div class="learning-materials">
                <div class="material-item">
                    <h4>Recognizing Phishing Emails</h4>
                    <ul>
                        <li>Check the sender's email address carefully</li>
                        <li>Look for spelling and grammar mistakes</li>
                        <li>Be wary of urgent or threatening language</li>
                        <li>Hover over links to see the actual URL</li>