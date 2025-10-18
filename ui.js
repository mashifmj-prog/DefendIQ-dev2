// UI rendering and updates
const ui = {
    // Update training dashboard
    updateTrainingDashboard() {
        document.getElementById('streakValue').textContent = state.appState.trainingProgress.streak;
        document.getElementById('pointsValue').textContent = state.appState.trainingProgress.points;
        document.getElementById('completionValue').textContent = state.appState.trainingProgress.completion + '%';
        document.getElementById('badgesValue').textContent = state.appState.trainingProgress.badges;
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = state.appState.trainingProgress.completion + '%';
        }
    },

    // Update support view
    updateSupportView() {
        // Display greeting based on time of day
        const hour = new Date().getHours();
        let greeting = 'Hello';
        
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 18) greeting = 'Good afternoon';
        else greeting = 'Good evening';
        
        // Add personalized greeting if we have user data
        if (state.appState.userProfile.name !== 'User') {
            greeting += `, ${state.appState.userProfile.name}`;
        }
        
        // Display motivational tip
        const tips = [
            "Cybersecurity is a journey, not a destination. Keep learning!",
            "Regular training reduces security risks by up to 70%.",
            "Strong passwords are your first line of defense.",
            "Stay vigilant against social engineering attacks.",
            "Update your software regularly to patch security vulnerabilities.",
            "Backup your important data regularly to prevent data loss."
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        
        // Update chat with greeting and tip if no previous messages
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages && chatMessages.children.length <= 1) {
            this.addMessage(`${greeting}! ${randomTip} How can I assist you with cybersecurity today?`, 'ai');
        }
    },

    // Add message to chat
    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message fade-in`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        
        // Add to chat history
        state.addChatMessage(sender, text);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    // Show confetti animation
    showConfetti() {
        const colors = ['#2e7d32', '#1565c0', '#ff6f00', '#7b1fa2', '#d32f2f'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 2000);
        }
    },

    // Update UI based on current state
    updateUI() {
        // Update stats if in training mode
        if (state.appState.currentMode === 'training') {
            this.updateTrainingDashboard();
        }
    },

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fade-in`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#2e7d32' : type === 'error' ? '#d32f2f' : '#1565c0'};
            color: white;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};