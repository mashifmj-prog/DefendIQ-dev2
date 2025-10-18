// Main application script
// DOM Elements
const landingPage = document.getElementById('landingPage');
const trainingMode = document.getElementById('trainingMode');
const supportMode = document.getElementById('supportMode');
const trainingBtn = document.getElementById('trainingBtn');
const supportBtn = document.getElementById('supportBtn');
const homeBtn = document.getElementById('homeBtn');
const homeBtn2 = document.getElementById('homeBtn2');
const refreshBtn = document.getElementById('refreshBtn');
const refreshBtn2 = document.getElementById('refreshBtn2');
const moduleDropdown = document.getElementById('moduleDropdown');
const moduleContent = document.getElementById('moduleContent');
const moduleTitle = document.getElementById('moduleTitle');
const moduleBody = document.getElementById('moduleBody');
const closeModule = document.getElementById('closeModule');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// Initialize the app
function initApp() {
    // Load state from localStorage if available
    state.loadState();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize canvas
    canvas.init();
    
    // Update UI with current state
    ui.updateUI();
}

// Set up event listeners
function setupEventListeners() {
    // Mode selection
    trainingBtn.addEventListener('click', () => enterMode('training'));
    supportBtn.addEventListener('click', () => enterMode('support'));
    
    // Navigation
    homeBtn.addEventListener('click', goHome);
    homeBtn2.addEventListener('click', goHome);
    refreshBtn.addEventListener('click', refreshPage);
    refreshBtn2.addEventListener('click', refreshPage);
    
    // Module selection
    moduleDropdown.addEventListener('change', handleModuleSelection);
    closeModule.addEventListener('click', closeModuleView);
    
    // Chat functionality
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Enter a specific mode
function enterMode(mode) {
    landingPage.style.display = 'none';
    trainingMode.style.display = 'none';
    supportMode.style.display = 'none';
    
    state.appState.currentMode = mode;
    
    if (mode === 'training') {
        trainingMode.style.display = 'block';
        ui.updateTrainingDashboard();
    } else if (mode === 'support') {
        supportMode.style.display = 'block';
        ui.updateSupportView();
    }
    
    state.saveState();
}

// Return to home page
function goHome() {
    landingPage.style.display = 'flex';
    trainingMode.style.display = 'none';
    supportMode.style.display = 'none';
    state.appState.currentMode = null;
    state.saveState();
}

// Refresh the current view
function refreshPage() {
    if (state.appState.currentMode === 'training') {
        ui.updateTrainingDashboard();
    } else if (state.appState.currentMode === 'support') {
        ui.updateSupportView();
    }
}

// Handle module selection
function handleModuleSelection() {
    const selectedModule = moduleDropdown.value;
    
    if (selectedModule) {
        moduleContent.style.display = 'block';
        quiz.loadModuleContent(selectedModule);
    } else {
        moduleContent.style.display = 'none';
    }
}

// Close module view
function closeModuleView() {
    moduleContent.style.display = 'none';
    moduleDropdown.value = '';
}

// Send chat message
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    ui.addMessage(message, 'user');
    chatInput.value = '';
    
    // Process message and generate AI response
    setTimeout(() => {
        const response = api.generateAIResponse(message);
        ui.addMessage(response, 'ai');
        
        // Scroll to bottom of chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);