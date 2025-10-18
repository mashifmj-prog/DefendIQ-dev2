// Enhanced AI API for department-specific responses
const api = {
    // Generate AI response based on user message and department context
    generateAIResponse(userMessage) {
        const departmentId = state.getCurrentDepartment();
        const department = departments[departmentId];
        const aiConfig = departmentAI[departmentId];
        
        if (!aiConfig) {
            return "I'm here to help with cybersecurity. How can I assist you today?";
        }
        
        const lowerMessage = userMessage.toLowerCase();
        
        // Check for department-specific expertise areas
        for (const [topic, response] of Object.entries(aiConfig.responses)) {
            if (lowerMessage.includes(topic)) {
                return response;
            }
        }
        
        // Check for general cybersecurity topics with department context
        if (this.isGreeting(lowerMessage)) {
            return this.generateGreetingResponse(departmentId);
        } else if (this.isQuestionAboutTopic(lowerMessage, 'phishing')) {
            return this.generatePhishingResponse(departmentId);
        } else if (this.isQuestionAboutTopic(lowerMessage, 'social engineering')) {
            return this.generateSocialEngineeringResponse(departmentId);
        } else if (this.isQuestionAboutTopic(lowerMessage, 'incident response')) {
            return this.generateIncidentResponse(departmentId);
        } else if (this.isQuestionAboutTopic(lowerMessage, 'compliance')) {
            return this.generateComplianceResponse(departmentId);
        } else if (this.isRequestForHelp(lowerMessage)) {
            return this.generateHelpResponse(departmentId);
        } else {
            return this.generateDefaultResponse(departmentId, lowerMessage);
        }
    },

    // Check if message is a greeting
    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
        return greetings.some(greeting => message.includes(greeting));
    },

    // Check if message is about a specific topic
    isQuestionAboutTopic(message, topic) {
        const questionWords = ['what', 'how', 'why', 'when', 'where', 'explain', 'tell me about'];
        const topicWords = topic.toLowerCase().split(' ');
        
        return questionWords.some(q => message.includes(q)) && 
               topicWords.some(t => message.includes(t));
    },

    // Check if message is a request for help
    isRequestForHelp(message) {
        const helpWords = ['help', 'assist', 'support', 'guidance', 'advice', 'recommend'];
        return helpWords.some(word => message.includes(word));
    },

    // Generate greeting response
    generateGreetingResponse(departmentId) {
        const greeting = ui.getTimeBasedGreeting();
        const aiConfig = departmentAI[departmentId];
        const randomGreeting = aiConfig.greetings[Math.floor(Math.random() * aiConfig.greetings.length)];
        
        return `${greeting}! ${randomGreeting} I specialize in ${departments[departmentId].name.toLowerCase()} security. How can I help you today?`;
    },

    // Generate phishing response with department context
    generatePhishingResponse(departmentId) {
        const department = departments[departmentId];
        
        switch (departmentId) {
            case 'nms':
                return "Phishing attacks targeting NMS teams often impersonate vendors or executives requesting network changes. Always verify such requests through established secure channels and look for inconsistencies in email addresses and language patterns.";
            
            case 'hr':
                return "HR departments face phishing attempts seeking employee data or payroll information. Be cautious of emails requesting sensitive information and always verify through official channels. Remember POPIA compliance when handling personal data.";
            
            case 'it':
                return "IT teams are targeted with phishing emails attempting to gain system access or install malware. Look for suspicious attachments, links to fake login pages, and social engineering tactics. Implement multi-factor authentication wherever possible.";
            
            default:
                return "Phishing is a cyber attack using disguised emails to trick recipients. Always verify suspicious emails and never click on links or attachments from unknown sources.";
        }
    },

    // Generate social engineering response
    generateSocialEngineeringResponse(departmentId) {
        switch (departmentId) {
            case 'nms':
                return "Social engineering against NMS teams often involves impersonating vendors or colleagues to gain network access. Establish verification protocols for all access requests and train team members to recognize manipulation tactics.";
            
            case 'hr':
                return "Social engineers target HR for employee data and organizational information. Implement strict verification processes for information requests and be wary of urgency or authority pressure tactics.";
            
            case 'it':
                return "IT staff face social engineering through tech support scams and privilege escalation attempts. Maintain skepticism of unsolicited requests and enforce principle of least privilege for system access.";
            
            default:
                return "Social engineering manipulates people into revealing confidential information. Always verify identities and be cautious of requests that create urgency or fear.";
        }
    },

    // Generate incident response guidance
    generateIncidentResponse(departmentId) {
        switch (departmentId) {
            case 'nms':
                return "For NMS incidents: 1) Isolate affected systems, 2) Preserve evidence, 3) Notify security team, 4) Coordinate with vendors, 5) Document all actions. Follow established incident response protocols.";
            
            case 'hr':
                return "HR incident response: 1) Secure employee data, 2) Notify legal and compliance, 3) Communicate with affected individuals per POPIA, 4) Preserve documentation, 5) Support affected employees.";
            
            case 'it':
                return "IT incident response: 1) Contain the threat, 2) Eradicate malicious presence, 3) Recover systems, 4) Conduct post-incident analysis, 5) Implement preventive measures.";
            
            default:
                return "Immediate incident response: Contain the threat, preserve evidence, notify appropriate teams, and follow established procedures.";
        }
    },

    // Generate compliance guidance
    generateComplianceResponse(departmentId) {
        switch (departmentId) {
            case 'nms':
                return "NMS compliance focuses on network security standards, vendor management protocols, and infrastructure protection requirements. Maintain audit trails for all network changes and access requests.";
            
            case 'hr':
                return "HR compliance centers on POPIA for data protection, labor laws, and privacy regulations. Ensure proper consent mechanisms, data handling procedures, and breach notification protocols.";
            
            case 'it':
                return "IT compliance involves system security standards, access control policies, and security tool configurations. Maintain documentation for security controls and regular audit compliance.";
            
            default:
                return "Compliance requires adherence to relevant regulations, proper documentation, and regular security assessments.";
        }
    },

    // Generate help response
    generateHelpResponse(departmentId) {
        const department = departments[departmentId];
        const progress = getDepartmentProgress(departmentId);
        
        let response = `I can help you with ${department.name.toLowerCase()} security topics. `;
        
        if (progress.completedModules === 0) {
            response += `I recommend starting with the "${department.modules[0].title}" module to build your foundation. `;
        } else if (progress.completion < 50) {
            const nextModule = department.modules.find(module => {
                const moduleProgress = state.getDepartmentState(departmentId).modules.find(m => m.id === module.id);
                return !moduleProgress || !moduleProgress.completed;
            });
            
            if (nextModule) {
                response += `Based on your progress, I suggest continuing with "${nextModule.title}". `;
            }
        } else {
            response += `You're making great progress! Consider reviewing completed modules or exploring advanced topics. `;
        }
        
        response += "What specific area would you like assistance with?";
        return response;
    },

    // Generate default response
    generateDefaultResponse(departmentId, message) {
        const aiConfig = departmentAI[departmentId];
        const department = departments[departmentId];
        
        // Check if message contains any department expertise keywords
        for (const keyword of aiConfig.expertise) {
            if (message.includes(keyword)) {
                return `Regarding ${keyword} in ${department.name.toLowerCase()}, I recommend checking our training modules and following established security protocols. Would you like specific guidance on this topic?`;
            }
        }
        
        // General response
        return `Thanks for your message about cybersecurity. In the context of ${department.name.toLowerCase()}, I'd be happy to help you with security best practices, threat awareness, or specific concerns. Could you provide more details about what you'd like to know?`;
    },

    // Assess user knowledge from chat input
    assessKnowledge(userMessage, departmentId) {
        const lowerMessage = userMessage.toLowerCase();
        const aiConfig = departmentAI[departmentId];
        let knowledgeLevel = 'beginner';
        let detectedTopics = [];
        
        // Check for advanced terminology
        const advancedTerms = {
            'nms': ['siem', 'ids/ips', 'network segmentation', 'zero trust', 'vendor risk assessment'],
            'hr': ['POPIA', 'GDPR', 'data subject rights', 'breach notification', 'consent management'],
            'it': ['privilege escalation', 'MFA', 'endpoint protection', 'threat hunting', 'incident response']
        };
        
        const terms = advancedTerms[departmentId] || [];
        const advancedTermCount = terms.filter(term => lowerMessage.includes(term.toLowerCase())).length;
        
        if (advancedTermCount >= 2) {
            knowledgeLevel = 'advanced';
        } else if (advancedTermCount >= 1) {
            knowledgeLevel = 'intermediate';
        }
        
        // Detect specific topics mentioned
        aiConfig.expertise.forEach(topic => {
            if (lowerMessage.includes(topic)) {
                detectedTopics.push(topic);
            }
        });
        
        return {
            knowledgeLevel,
            detectedTopics,
            confidence: Math.min(advancedTermCount * 25, 100)
        };
    },

    // Recommend modules based on chat conversation
    recommendModules(departmentId, knowledgeAssessment) {
        const department = departments[departmentId];
        const deptState = state.getDepartmentState(departmentId);
        
        let recommendations = [];
        
        // Recommend based on detected topics
        knowledgeAssessment.detectedTopics.forEach(topic => {
            const relevantModules = department.modules.filter(module => {
                const moduleText = `${module.title} ${module.description}`.toLowerCase();
                return moduleText.includes(topic) && 
                       !deptState.modules.find(m => m.id === module.id && m.completed);
            });
            
            recommendations.push(...relevantModules);
        });
        
        // If no topic-based recommendations, suggest based on knowledge level
        if (recommendations.length === 
