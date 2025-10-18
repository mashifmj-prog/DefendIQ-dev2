// Enhanced UI management for enterprise features
const ui = {
    // Initialize UI components
    init() {
        this.setupEventListeners();
        this.showDepartmentSelection();
        this.updateDepartmentBadge();
    },

    // Show department selection overlay
    showDepartmentSelection() {
        const overlay = document.getElementById('departmentSelection');
        const appContainer = document.getElementById('appContainer');
        
        overlay.style.display = 'flex';
        appContainer.style.display = 'none';
        
        // Add event listeners to department cards
        document.querySelectorAll('.department-card').forEach(card => {
            card.addEventListener('click', () => {
                const department = card.dataset.department;
                this.selectDepartment(department);
            });
        });
    },

    // Select department and initialize app
    selectDepartment(departmentId) {
        state.setCurrentDepartment(departmentId);
        
        const overlay = document.getElementById('departmentSelection');
        const appContainer = document.getElementById('appContainer');
        
        overlay.style.display = 'none';
        appContainer.style.display = 'block';
        
        this.updateDepartmentUI();
        this.showTrainingMode();
    },

    // Update UI for current department
    updateDepartmentUI() {
        const departmentId = state.getCurrentDepartment();
        const department = departments[departmentId];
        
        if (!department) return;
        
        // Update department badge
        this.updateDepartmentBadge();
        
        // Update department header
        const deptTitle = document.getElementById('deptTitle');
        const deptDescription = document.getElementById('deptDescription');
        
        if (deptTitle) deptTitle.textContent = department.name;
        if (deptDescription) deptDescription.textContent = department.description;
        
        // Update support title
        const supportTitle = document.getElementById('supportTitle');
        const supportSubtitle = document.getElementById('supportSubtitle');
        
        if (supportTitle) supportTitle.textContent = `${department.name} Support`;
        if (supportSubtitle) supportSubtitle.textContent = 'Your AI Security Assistant';
        
        // Load department-specific content
        this.loadDepartmentModules();
        this.updateDepartmentStats();
    },

    // Update department badge in navigation
    updateDepartmentBadge() {
        const departmentId = state.getCurrentDepartment();
        const department = departments[departmentId];
        const badge = document.getElementById('departmentBadge');
        
        if (badge && department) {
            badge.textContent = department.name;
            badge.style.background = department.color;
        }
    },

    // Load department modules
    loadDepartmentModules() {
        const departmentId = state.getCurrentDepartment();
        const department = departments[departmentId];
        const moduleGrid = document.getElementById('moduleGrid');
        
        if (!moduleGrid || !department) return;
        
        moduleGrid.innerHTML = '';
        
        department.modules.forEach(module => {
            const moduleCard = this.createModuleCard(module, departmentId);
            moduleGrid.appendChild(moduleCard);
        });
    },

    // Create module card element
    createModuleCard(module, departmentId) {
        const deptState = state.getDepartmentState(departmentId);
        const moduleProgress = deptState.modules.find(m => m.id === module.id) || { progress: 0, completed: false };
        
        const card = document.createElement('div');
        card.className = `module-card ${moduleProgress.completed ? 'completed' : moduleProgress.progress > 0 ? 'in-progress' : ''}`;
        card.innerHTML = `
            <div class="module-header-card">
                <div class="module-icon">${module.icon}</div>
                <div>
                    <h3>${module.title}</h3>
                    <div class="module-meta">
                        <span>${module.difficulty}</span>
                        <span>${module.estimatedTime}</span>
                    </div>
                </div>
            </div>
            <p class="module-description">${module.description}</p>
            <div class="module-progress">
                <div class="progress-text">
                    <span>Progress</span>
                    <span>${moduleProgress.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${moduleProgress.progress}%"></div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.openModule(module, departmentId);
        });
        
        return card;
    },

    // Open module for learning
    openModule(module, departmentId) {
        const moduleContent = document.getElementById('moduleContent');
        const moduleTitle = document.getElementById('moduleTitle');
        const moduleBody = document.getElementById('moduleBody');
        
        if (!moduleContent || !moduleTitle || !moduleBody) return;
        
        moduleTitle.textContent = module.title;
        moduleBody.innerHTML = this.createModuleContent(module, departmentId);
        
        document.getElementById('moduleGrid').style.display = 'none';
        moduleContent.style.display = 'block';
    },

    // Create module content
    createModuleContent(module, departmentId) {
        let content = `
            <div class="module-overview">
                <div class="module-meta-info">
                    <span><strong>Difficulty:</strong> ${module.difficulty}</span>
                    <span><strong>Estimated Time:</strong> ${module.estimatedTime}</span>
                    <span><strong>Objectives:</strong> ${module.objectives.length}</span>
                </div>
                
                <h3>Learning Objectives</h3>
                <ul class="objectives-list">
                    ${module.objectives.map(obj => `<li>${obj}</li>`).join('')}
                </ul>
            </div>
        `;
        
        // Add learning materials
        if (module.content.materials && module.content.materials.length > 0) {
            content += `
                <div class="learning-materials">
                    <h3>Learning Materials</h3>
                    ${module.content.materials.map(material => `
                        <div class="material-item">
                            <h4>${material.title}</h4>
                            <p>${material.content}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Add quiz section
        if (module.content.quiz && module.content.quiz.length > 0) {
            content += `
                <div class="quiz-section">
                    <h3>Knowledge Check</h3>
                    <p>Test your understanding with this quick quiz.</p>
                    <button class="btn btn-primary" onclick="quiz.startQuiz('${departmentId}', '${module.id}')">
                        Start Quiz
                    </button>
                </div>
            `;
        }
        
        return content;
    },

    // Close module view
    closeModuleView() {
        const moduleContent = document.getElementById('moduleContent');
        const moduleGrid = document.getElementById('moduleGrid');
        
        if (moduleContent && moduleGrid) {
            moduleContent.style.display = 'none';
            moduleGrid.style.display = 'grid';
        }
    },

    // Update department statistics
    updateDepartmentStats() {
        const departmentId = state.getCurrentDepartment();
        const progress = getDepartmentProgress(departmentId);
        const deptStats = state.getDepartmentStatistics();
        
        // Update security score
        const securityScore = document.getElementById('securityScore');
        if (securityScore) securityScore.textContent = progress.securityScore;
        
        // Update progress bar
        const progressFill = document.querySelector('#securityScore').closest('.stat-card').querySelector('.progress-fill');
        if (progressFill) progressFill.style.width = `${progress.securityScore}%`;
        
        // Update modules completed
        const modulesCompleted = document.getElementById('modulesCompleted');
        if (modulesCompleted) modulesCompleted.textContent = `${progress.completedModules}/${progress.totalModules}`;
        
        // Update threats detected (simulated metric)
        const threatsDetected = document.getElementById('threatsDetected');
        if (threatsDetected) {
            const detectionRate = Math.min(70 + (progress.securityScore * 0.3), 98);
            threatsDetected.textContent = `${Math.round(detectionRate)}%`;
        }
        
        // Update department rank
        const departmentRank = document.getElementById('departmentRank');
        if (departmentRank) {
            const departments = Object.entries(deptStats)
                .filter(([deptId, stat]) => deptId !== 'executive')
                .sort((a, b) => b[1].overallScore - a[1].overallScore);
            
            const currentDeptIndex = departments.findIndex(([deptId]) => deptId === departmentId);
            if (currentDeptIndex !== -1) {
                departmentRank.textContent = `#${currentDeptIndex + 1}`;
            }
        }
    },

    // Show training mode
    showTrainingMode() {
        document.getElementById('trainingMode').style.display = 'block';
        document.getElementById('supportMode').style.display = 'none';
        
        const trainingTab = document.getElementById('trainingTab');
        const supportTab = document.getElementById('supportTab');
        
        trainingTab.classList.add('active');
        supportTab.classList.remove('active');
        
        this.updateDepartmentStats();
    },

    // Show support mode
    showSupportMode() {
        document.getElementById('trainingMode').style.display = 'none';
        document.getElementById('supportMode').style.display = 'block';
        
        const trainingTab = document.getElementById('trainingTab');
        const supportTab = document.getElementById('supportTab');
        
        trainingTab.classList.remove('active');
        supportTab.classList.add('active');
        
        this.updateSupportView();
    },

    // Update support view with department-specific content
    updateSupportView() {
        const departmentId = state.getCurrentDepartment();
        const department = departments[departmentId];
        const aiConfig = departmentAI[departmentId];
        
        if (!aiConfig) return;
        
        const greeting = this.getTimeBasedGreeting();
        const randomGreeting = aiConfig.greetings[Math.floor(Math.random() * aiConfig.greetings.length)];
        const chatMessages = document.getElementById('chatMessages');
        
        // Clear existing messages except the first one
        if (chatMessages && chatMessages.children.length <= 1) {
            const firstMessage = chatMessages.querySelector('.ai-message');
            if (firstMessage) {
                firstMessage.querySelector('p').textContent = `${greeting}! ${randomGreeting} How can I assist you with ${department.name.toLowerCase()} security today?`;
            }
        }
    },

    // Get time-based greeting
    getTimeBasedGreeting() {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) return 'Good morning';
        else if (hour >= 12 && hour < 14) return 'Good day';
        else if (hour >= 14 && hour < 18) return 'Good afternoon';
        else if (hour >= 18 && hour < 22) return 'Good evening';
        else return 'Good night';
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
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 2000);
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Mode tabs
        const trainingTab = document.getElementById('trainingTab');
        const supportTab = document.getElementById('supportTab');
        
        if (trainingTab) {
            trainingTab.addEventListener('click', () => this.showTrainingMode());
        }
        
        if (supportTab) {
            supportTab.addEventListener('click', () => this.showSupportMode());
        }
        
        // Navigation buttons
        const departmentSwitch = document.getElementById('departmentSwitch');
        const homeBtn = document.getElementById('homeBtn');
        const closeModule = document.getElementById('closeModule');
        
        if (departmentSwitch) {
            departmentSwitch.addEventListener('click', () => this.showDepartmentSelection());
        }
        
        if (homeBtn) {
            homeBtn.addEventListener('click', () => this.showTrainingMode());
        }
        
        if (closeModule) {
            closeModule.addEventListener('click', () => this.closeModuleView());
        }
        
        // Chat functionality
        const sendBtn = document.getElementById('sendBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (sendBtn && chatInput) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    },

    // Send chat message
    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        chatInput.value = '';
        
        // Process message and generate AI response
        setTimeout(() => {
            const response = api.generateAIResponse(message);
            this.addMessage(response, 'ai');
        }, 1000);
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
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
};
