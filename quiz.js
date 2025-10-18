// Enhanced quiz system for department-specific training
const quiz = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    userAnswers: [],
    startTime: null,

    // Start a quiz for a specific module
    startQuiz(departmentId, moduleId) {
        const department = departments[departmentId];
        const module = department.modules.find(m => m.id === moduleId);
        
        if (!module || !module.content.quiz) {
            ui.showNotification('No quiz available for this module.', 'error');
            return;
        }

        this.currentQuiz = {
            departmentId,
            moduleId,
            questions: module.content.quiz,
            totalQuestions: module.content.quiz.length
        };

        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();

        this.displayQuestion();
    },

    // Display current question
    displayQuestion() {
        if (!this.currentQuiz || this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            this.completeQuiz();
            return;
        }

        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const moduleBody = document.getElementById('moduleBody');

        if (!moduleBody) return;

        moduleBody.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-progress">
                    <h3>Question ${this.currentQuestionIndex + 1} of ${this.currentQuiz.totalQuestions}</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentQuestionIndex) / this.currentQuiz.totalQuestions) * 100}%"></div>
                    </div>
                </div>
                
                <div class="quiz-question">
                    <h4>${question.question}</h4>
                    <div class="quiz-options">
                        ${question.options.map((option, index) => `
                            <button class="quiz-option" onclick="quiz.selectAnswer(${index})">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="quiz-navigation">
                    <button class="nav-btn" onclick="quiz.previousQuestion()" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                        Previous
                    </button>
                    <button class="nav-btn" onclick="quiz.nextQuestion()" ${this.userAnswers[this.currentQuestionIndex] === undefined ? 'disabled' : ''}>
                        ${this.currentQuestionIndex === this.currentQuiz.totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
                    </button>
                </div>
            </div>
        `;
    },

    // Select an answer
    selectAnswer(answerIndex) {
        // Remove selected class from all options
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selected class to chosen option
        const selectedOption = document.querySelectorAll('.quiz-option')[answerIndex];
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        // Enable next button
        const nextButton = document.querySelector('.quiz-navigation button:last-child');
        if (nextButton) {
            nextButton.disabled = false;
        }

        this.userAnswers[this.currentQuestionIndex] = answerIndex;
    },

    // Move to next question
    nextQuestion() {
        if (this.userAnswers[this.currentQuestionIndex] === undefined) {
            ui.showNotification('Please select an answer before continuing.', 'warning');
            return;
        }

        this.currentQuestionIndex++;
        this.displayQuestion();
    },

    // Move to previous question
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    },

    // Complete the quiz and show results
    completeQuiz() {
        if (!this.currentQuiz) return;

        const timeSpent = Date.now() - this.startTime;
        const score = this.calculateScore();
        const results = this.analyzeResults();

        const moduleBody = document.getElementById('moduleBody');
        if (!moduleBody) return;

        moduleBody.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <div class="result-score">
                    <div class="score-circle">
                        <span class="score-value">${score}%</span>
                    </div>
                    <p>Your Score</p>
                </div>
                
                <div class="result-details">
                    <div class="detail-item">
                        <span>Correct Answers:</span>
                        <span>${results.correctAnswers}/${this.currentQuiz.totalQuestions}</span>
                    </div>
                    <div class="detail-item">
                        <span>Time Spent:</span>
                        <span>${Math.round(timeSpent / 1000)} seconds</span>
                    </div>
                    <div class="detail-item">
                        <span>Performance:</span>
                        <span>${this.getPerformanceRating(score)}</span>
                    </div>
                </div>

                ${score >= 80 ? `
                    <div class="quiz-success">
                        <p>🎉 Excellent work! You've demonstrated strong understanding of this topic.</p>
                        <button class="btn btn-primary" onclick="quiz.claimCertificate()">
                            Claim Certificate
                        </button>
                    </div>
                ` : `
                    <div class="quiz-improvement">
                        <p>📚 Good effort! Review the material and try again to improve your score.</p>
                        <button class="btn btn-secondary" onclick="quiz.restartQuiz()">
                            Try Again
                        </button>
                    </div>
                `}

                <div class="question-review">
                    <h4>Question Review</h4>
                    ${this.currentQuiz.questions.map((question, index) => {
                        const userAnswer = this.userAnswers[index];
                        const isCorrect = userAnswer === question.correct;
                        
                        return `
                            <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                                <div class="review-question">
                                    <strong>Q${index + 1}:</strong> ${question.question}
                                </div>
                                <div class="review-answer">
                                    <span>Your answer: ${question.options[userAnswer]}</span>
                                    ${!isCorrect ? `
                                        <span class="correct-answer">Correct answer: ${question.options[question.correct]}</span>
                                    ` : ''}
                                </div>
                                ${question.explanation ? `
                                    <div class="review-explanation">
                                        <strong>Explanation:</strong> ${question.explanation}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Record quiz results
        state.recordQuizResult(this.currentQuiz.departmentId, this.currentQuiz.moduleId, score, timeSpent);

        // Show confetti for high scores
        if (score >= 80) {
            ui.showConfetti();
            ui.showNotification('Congratulations! Module completed successfully.', 'success');
        }

        // Update module progress
        state.updateModuleProgress(this.currentQuiz.departmentId, this.currentQuiz.moduleId, 100);
    },

    // Calculate quiz score
    calculateScore() {
        if (!this.currentQuiz) return 0;

        let correctCount = 0;
        this.currentQuiz.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correct) {
                correctCount++;
            }
        });

        return Math.round((correctCount / this.currentQuiz.totalQuestions) * 100);
    },

    // Analyze quiz results
    analyzeResults() {
        const score = this.calculateScore();
        const correctAnswers = this.userAnswers.filter((answer, index) => 
            answer === this.currentQuiz.questions[index].correct
        ).length;

        return {
            score,
            correctAnswers,
            totalQuestions: this.currentQuiz.totalQuestions,
            incorrectAnswers: this.currentQuiz.totalQuestions - correctAnswers
        };
    },

    // Get performance rating
    getPerformanceRating(score) {
        if (score >= 90) return 'Excellent';
        if (score >= 80) return 'Very Good';
        if (score >= 70) return 'Good';
        if (score >= 60) return 'Satisfactory';
        return 'Needs Improvement';
    },

    // Restart the quiz
    restartQuiz() {
        this.startQuiz(this.currentQuiz.departmentId, this.currentQuiz.moduleId);
    },

    // Claim certificate for completed module
    claimCertificate() {
        if (!this.currentQuiz) return;

        const certificate = state.generateCertificate(
            this.currentQuiz.departmentId, 
            this.currentQuiz.moduleId
        );

        if (certificate) {
            this.showCertificate(certificate);
        }
    },

    // Display certificate
    showCertificate(certificate) {
        const moduleBody = document.getElementById('moduleBody');
        if (!moduleBody) return;

        const department = departments[certificate.departmentId];
        const module = department.modules.find(m => m.id === certificate.moduleId);

        moduleBody.innerHTML = `
            <div class="certificate">
                <div class="certificate-header">
                    <div class="certificate-logo">🛡️</div>
                    <h1 class="certificate-title">Certificate of Completion</h1>
                </div>
                
                <div class="certificate-content">
                    <p>This certifies that</p>
                    <h2>${certificate.employeeName || 'Employee'}</h2>
                    <p>has successfully completed the</p>
                    <h3>${module.title}</h3>
                    <p>as part of the ${department.name} training program</p>
                    
                    <div class="certificate-details">
                        <p><strong>Score:</strong> ${certificate.score}%</p>
                        <p><strong>Date Issued:</strong> ${new Date(certificate.issueDate).toLocaleDateString()}</p>
                        <p><strong>Certificate ID:</strong> ${certificate.id}</p>
                    </div>
                </div>
                
                <div class="certificate-footer">
                    <div class="certificate-signature">
                        <p>DefendIQ Enterprise</p>
                        <p>Cybersecurity Training Platform</p>
                    </div>
                </div>
                
                <div class="certificate-actions">
                    <button class="btn btn-primary" onclick="quiz.downloadCertificate()">
                        Download Certificate
                    </button>
                    <button class="btn btn-secondary" onclick="quiz.returnToModule()">
                        Return to Module
                    </button>
                </div>
            </div>
        `;
    },

    // Download certificate (placeholder implementation)
    downloadCertificate() {
        ui.showNotification('Certificate download feature would be implemented here.', 'info');
        // In a real implementation, this would generate a PDF or image download
    },

    // Return to module view
    returnToModule() {
        const departmentId = this.currentQuiz.departmentId;
        const moduleId = this.currentQuiz.moduleId;
        const department = departments[departmentId];
        const module = department.modules.find(m => m.id === moduleId);
        
        if (module) {
            ui.openModule(module, departmentId);
        }
    }
};
