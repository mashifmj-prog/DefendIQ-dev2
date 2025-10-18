// AI API integration and response generation
const api = {
    // Generate AI response based on user message
    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Knowledge assessment based on keywords
        const knowledgeKeywords = {
            phishing: ['phish', 'email', 'scam', 'fake', 'link', 'spoof'],
            passwords: ['password', 'login', 'credential', 'authentication', '2fa', 'mfa'],
            malware: ['malware', 'virus', 'ransomware', 'trojan', 'infection', 'antivirus'],
            social: ['social engineering', 'manipulation', 'trust', 'impersonate', 'pretexting']
        };
        
        // Check for knowledge areas mentioned
        const mentionedAreas = [];
        for (const [area, keywords] of Object.entries(knowledgeKeywords)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                mentionedAreas.push(area);
            }
        }
        
        // Update user profile based on mentioned areas
        if (mentionedAreas.length > 0) {
            state.appState.userProfile.interests = [
                ...new Set([...state.appState.userProfile.interests, ...mentionedAreas])
            ];
            
            // If user demonstrates advanced knowledge, update level
            if (state.appState.userProfile.knowledgeLevel === 'beginner' && 
                (lowerMessage.includes('advanced') || lowerMessage.includes('expert') || 
                 lowerMessage.includes('encryption') || lowerMessage.includes('firewall') ||
                 lowerMessage.includes('vpn') || lowerMessage.includes('zero-day'))) {
                state.appState.userProfile.knowledgeLevel = 'intermediate';
                state.updateUserProfile({ knowledgeLevel: 'intermediate' });
            }
        }
        
        // Generate personalized response
        let response = '';
        
        // Greeting responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = `Hello! I'm your DefendIQ assistant. I see you're interested in ${mentionedAreas.length > 0 ? mentionedAreas.join(' and ') : 'cybersecurity'}. How can I help you today?`;
        }
        // Question about specific topics
        else if (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('explain')) {
            if (lowerMessage.includes('phishing')) {
                response = "Phishing is a cyber attack that uses disguised emails to trick recipients into revealing sensitive information. Attackers often impersonate legitimate organizations and create a sense of urgency. Would you like to learn more about how to identify phishing attempts?";
            } else if (lowerMessage.includes('password')) {
                response = "Strong passwords should be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and symbols. Using a password manager can help create and store secure passwords. Two-factor authentication adds an extra layer of security. Would you like me to recommend the 'Password Security' module?";
            } else if (lowerMessage.includes('malware')) {
                response = "Malware is malicious software designed to harm or exploit devices. Common types include viruses, worms, trojans, and ransomware. Keeping software updated, using antivirus protection, and avoiding suspicious downloads are key prevention methods.";
            } else if (lowerMessage.includes('social engineering')) {
                response = "Social engineering manipulates people into revealing confidential information. Attackers exploit human psychology rather than technical vulnerabilities. Common techniques include pretexting, baiting, and tailgating.";
            } else {
                response = "That's a great question about cybersecurity. Based on your interest, I'd recommend checking out our ";
                
                if (mentionedAreas.length > 0) {
                    response += `${mentionedAreas[0]} module`;
                } else {
                    response += "Phishing Awareness module to start with the basics";
                }
                
                response += ". Would you like me to tell you more about it?";
            }
        }
        // Request for help or recommendations
        else if (lowerMessage.includes('help') || lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
            response = this.generateModuleRecommendation();
        }
        // Feeling or emotional support
        else if (lowerMessage.includes('overwhelmed') || lowerMessage.includes('stress') || lowerMessage.includes('anxious')) {
            response = "I understand that cybersecurity can feel overwhelming with all the threats out there. Remember that every small step you take makes you more secure. Start with the basics and build your knowledge gradually. You're doing great by taking the initiative to learn!";
        }
        // Default response
        else {
            response = "Thanks for sharing that. ";
            
            if (mentionedAreas.length > 0) {
                response += `Based on your interest in ${mentionedAreas.join(' and ')}, `;
            }
            
            response += "I'd recommend focusing on our ";
            
            if (state.appState.userProfile.knowledgeLevel === 'beginner') {
                response += "Phishing Awareness module to build a strong foundation. ";
            } else {
                response += "Social Engineering module to understand more advanced attack vectors. ";
            }
            
            response += "Would you like to explore that module now?";
        }
        
        return response;
    },

    // Generate module recommendation based on user profile
    generateModuleRecommendation() {
        const { knowledgeLevel, interests } = state.appState.userProfile;
        const { modules } = state.appState.trainingProgress;
        
        // Find modules not completed
        const availableModules = Object.entries(modules)
            .filter(([_, module]) => !module.completed)
            .map(([id, _]) => id);
        
        // If user has specific interests, prioritize those
        if (interests.length > 0) {
            const interestModules = availableModules.filter(module => 
                interests.includes(module)
            );
            
            if (interestModules.length > 0) {
                const moduleTitles = {
                    phishing: 'Phishing Awareness',
                    passwords: 'Password Security',
                    malware: 'Malware Protection',
                    social: 'Social Engineering'
                };
                
                return `Based on your interests, I recommend the "${moduleTitles[interestModules[0]]}" module. It covers essential concepts that align with what you've been asking about. Would you like to start that module now?`;
            }
        }
        
        // Otherwise, recommend based on knowledge level
        let recommendedModule = '';
        
        if (knowledgeLevel === 'beginner') {
            recommendedModule = 'phishing';
        } else if (knowledgeLevel === 'intermediate') {
            recommendedModule = 'passwords';
        } else {
            recommendedModule = 'social';
        }
        
        // If recommended module is completed, find next available
        if (modules[recommendedModule]?.completed) {
            const nextModule = availableModules[0];
            if (nextModule) recommendedModule = nextModule;
        }
        
        const moduleTitles = {
            phishing: 'Phishing Awareness',
            passwords: 'Password Security',
            malware: 'Malware Protection',
            social: 'Social Engineering'
        };
        
        return `Based on your current knowledge level, I recommend the "${moduleTitles[recommendedModule]}" module. It's designed to build on what you already know and introduce new concepts. Would you like to explore it?`;
    }
};