// Enhanced UI management for enterprise features
const ui = {
    initialized: false,

    // Initialize UI components
    init() {
        if (this.initialized) {
            debug.log('UI already initialized', 'warn');
            return;
        }

        try {
            debug.log('Initializing UI components...', 'info');
            
            this.setupEventListeners();
            this.showDepartmentSelection();
            this.updateDepartmentBadge();
            
            this.initialized = true;
            debug.log('UI components initialized successfully', 'info');
            debug.updateLoadingProgress(80);
            
        } catch (error) {
            debug.handleError('UI Initialization Failed', error);
        }
    },

    // Show department selection overlay
    showDepartmentSelection() {
        try {
            const overlay = document.getElementById('departmentSelection');
            const appContainer = document.getElementById('appContainer');
            
            if (!overlay || !appContainer) {
                throw new Error('Required DOM elements not found');
            }
            
            overlay.style.display = 'flex';
            appContainer.style.display = 'none';
            
            // Add event listeners to department cards
            document.querySelectorAll('.department-card').forEach(card => {
                card.addEventListener('click', () => {
                    const department = card.dataset.department;
                    this.selectDepartment(department);
                });
            });
            
        } catch (error) {
            debug.handleError('Department Selection Error', error);
        }
    },

    // Select department and initialize app
    selectDepartment(departmentId) {
        try {
            if (!state.appState) {
                throw new Error('Application state not ready');
            }

            state.setCurrentDepartment(departmentId);
            
            const overlay = document.getElementById('departmentSelection');
            const appContainer = document.getElementById('appContainer');
            
            overlay.style.display = 'none';
            appContainer.style.display = 'block';
            
            this.updateDepartmentUI();
            this.showTrainingMode();
            
            debug.log(`Department selected: ${departmentId}`, 'info');
            
        } catch (error) {
            debug.handleError('Department Selection Failed', error);
        }
    },

    // Update UI for current department
    updateDepartmentUI() {
        try {
            const departmentId = state.getCurrentDepartment();
            if (!departmentId) {
                debug.log('No department selected for UI update', 'warn');
                return;
            }

            const department = window.departments?.[departmentId];
            if (!department) {
                throw new Error(`Department ${departmentId} not found`);
            }
            
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
            
        } catch (error) {
            debug.handleError('Department UI Update Failed', error);
        }
    },

    // Update department badge in navigation
    updateDepartmentBadge() {
        try {
            const departmentId = state.getCurrentDepartment();
            const department = window.departments?.[departmentId];
            const badge = document.getElementById('departmentBadge');
            
            if (badge && department) {
                badge.textContent = department.name;
                badge.style.background = department.color;
            }
        } catch (error) {
            debug.log('Department badge update failed', 'warn', error);
        }
    },

    // Load department modules
    loadDepartmentModules() {
        try {
            const departmentId = state.getCurrentDepartment();
            const department = window.departments?.[departmentId];
            const moduleGrid = document.getElementById('moduleGrid');
            
            if (!moduleGrid || !department) {
                debug.log('Module grid or department not found', 'warn');
                return;
            }
            
            moduleGrid.innerHTML = '';
            
            if (!department.modules || department.modules.length === 0) {
                moduleGrid.innerHTML = '<p class="no-modules">No modules available for this department.</p>';
                return;
            }
            
            department.modules.forEach(module => {
                const moduleCard = this.createModuleCard(module, departmentId);
                moduleGrid.appendChild(moduleCard);
            });
            
        } catch (error) {
            debug.handleError('Module Loading Failed', error);
        }
    },

    // Create module card element
    createModuleCard(module, departmentId) {
        const deptState = state.getDepartmentState(departmentId);
        const moduleProgress = deptState.modules.find(m => m.id === module.id) || { progress: 0, completed: false };
        
        const card = document.createElement('div');
        card.className = `module-card ${moduleProgress.completed ? 'completed' : moduleProgress.progress > 0 ? 'in-progress' : ''}`;
        card.innerHTML = `
            <div class="module-header-card">
                <div class="module-icon">${module.icon || '📚'}</div>
                <div>
                    <h3>${module.title}</h3>
                    <div class="module-meta">
                        <span>${module.difficulty || 'Beginner'}</span>
                        <span>${module.estimatedTime || '30 min'}</span>
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
        try {
            const moduleContent = document.getElementById('moduleContent');
            const moduleTitle = document.getElementById('moduleTitle');
            const moduleBody = document.getElementById('moduleBody');
            
            if (!moduleContent || !moduleTitle || !moduleBody) {
                throw new Error('Module content elements not found');
            }
            
            moduleTitle.textContent = module.title;
            moduleBody.innerHTML = this.createModuleContent(module, departmentId);
            
            document.getElementById('moduleGrid').style.display = 'none';
            moduleContent.style.display = 'block';
            
        } catch (error) {
            debug.handleError('Module Open Failed', error);
        }
    },

    // Create module content
    createModuleContent(module, departmentId) {
        let content = `
            <div class="module-overview">
                <div class="module-meta-info">
                    <span><strong>Difficulty:</strong> ${module.difficulty || 'Beginner'}</span>
                    <span><strong>Estimated Time:</strong> ${module.estimatedTime || '30 min'}</span>
                    <span><strong>Objectives:</strong> ${module.objectives?.length || 0}</span>
                </div>
                
                <h3>Learning Objectives</h3>
                <ul class="objectives-list">
                    ${(module.objectives || []).map(obj => `<li>${obj}</li>`).join('')}
                </ul>
            </div>
        `;
        
        // Add learning materials
        if (module.content?.materials && module.content.materials.length > 0) {
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
        if (module.content?.quiz && module.content.quiz.length > 0) {
            content += `
                <div class="quiz-section">
                    <h3>Knowledge Check</h3>
                    <p>Test your understanding with this quick quiz.</p>
                    <button class="btn btn-primary" onclick="quiz.startQuiz('${departmentId}', '${module.id}')">
                        Start Quiz
                    </button>
                </div>
            `;
        } else {
            content += `
                <div class="quiz-section">
                    <h3>Knowledge Check</h3>
                    <p>No quiz available for this module yet.</p>
                </div>
            `;
        }
        
        return content;
    },

    // Close module view
    closeModuleView() {
        try {
            const moduleContent = document.getElementById('moduleContent');
            const moduleGrid = document.getElementById('moduleGrid');
            
            if (moduleContent && moduleGrid) {
                moduleContent.style.display = 'none';
                moduleGrid.style.display = 'grid';
            }
        } catch (error) {
            debug.log('Module close failed', 'warn', error);
        }
    },

    // Update department statistics
    updateDepartmentStats() {
        try {
            const departmentId = state.getCurrentDepartment();
            if (!departmentId) return;

            const progress = getDepartmentProgress(departmentId);
            const deptStats = state.getDepartmentStatistics();
            
            // Update security score
            const securityScore = document.getElementById('securityScore');
            if (securityScore) securityScore.textContent = progress.securityScore;
            
            // Update progress bar
            const progressFill = document.querySelector('#securityScore')?.closest('.stat-card')?.querySelector('.progress-fill');
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
            
        } catch (error) {
            debug.log('Stats update failed', 'warn', error);
        }
    },

    // Show training mode
    showTrainingMode() {
        try {
            document.getElementById('trainingMode').style.display = 'block';
            document.getElementById('supportMode').style.display = 'none';
            
            const trainingTab = document.getElementById('trainingTab');
            const supportTab = document.getElementById('supportTab');
            
            trainingTab.classList.add('active');
            supportTab.classList.remove('active');
            
            this.updateDepartmentStats();
            
        } catch (error) {
            debug.handleError('Training Mode Failed', error);
        }
    },

    // Show support mode
    showSupportMode() {
        try {
            document.getElementById('trainingMode').style.display = 'none';
            document.getElementById('supportMode').style.display = 'block';
            
            const trainingTab = document.getElementById('trainingTab');
            const supportTab = document.getElementById('supportTab');
            
            trainingTab.classList.remove('active');
            supportTab.classList.add('active');
            
            this.updateSupportView();
            
        } catch (error) {
            debug.handleError('Support Mode Failed', error);
        }
    },

    // Update support view with department-specific content
    updateSupportView() {
        try {
            const departmentId = state.getCurrentDepartment();
            const department = window.departments?.[departmentId];
            const aiConfig = window.departmentAI?.[departmentId];
            
            if (!aiConfig) return;
            
            const greeting = this.getTimeBasedGreeting();
            const randomGreeting = aiConfig.greetings[Math.floor(Math.random() * aiConfig.greetings.length)];
            const chatMessages = document.getElementById('chatMessages');
            
            if (chatMessages && chatMessages.children.length <= 1) {
                const firstMessage = chatMessages.querySelector('.ai-message');
                if (firstMessage) {
                    firstMessage.querySelector('p').textContent = `${greeting}! ${randomGreeting} How can I assist you with ${department.name.toLowerCase()} security today?`;
                }
            }
        } catch (error) {
            debug.log('Support view update failed', 'warn', error);
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
        try {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message fade-in`;
            messageDiv.innerHTML = `<p>${text}</p>`;
            chatMessages.appendChild(messageDiv);
            
            state.addChatMessage(sender, text);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
        } catch (error) {
            debug.log('Message add failed', 'warn', error);
        }
    },

    // Show confetti animation
    showConfetti() {
        try {
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
        } catch (error) {
            debug.log('Confetti animation failed', 'warn', error);
        }
    },

    // Setup event listeners
    setupEventListeners() {
        try {
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
            
        } catch (error) {
            debug.handleError('Event Listeners Setup Failed', error);
        }
    },

    // Send chat message
    sendMessage() {
        try {
            const chatInput = document.getElementById('chatInput');
            const message = chatInput.value.trim();
            
            if (!message) return;
            
            this.addMessage(message, 'user');
            chatInput.value = '';
            
            setTimeout(() => {
                const response = api.generateAIResponse(message);
                this.addMessage(response, 'ai');
            }, 1000);
            
        } catch (error) {
            debug.handleError('Message Send Failed', error);
        }
    },

    // Show notification
    showNotification(message, type = 'info') {
        try {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type} fade-in`;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: ${type === 'success' ? '#2e7d32' : type === 'error' ? '#f44336' : '#1565c0'};
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
        } catch (error) {
            console.log('Notification failed:', error);
        }
    }
};

if (typeof debug !== 'undefined') {
    debug.log('UI module loaded', 'info');
}
