// Department-specific configurations and modules
const departments = {
    nms: {
        id: 'nms',
        name: 'NMS Command Center',
        description: 'Network Infrastructure Protection & Vendor Security',
        color: '#2196f3',
        icon: '🌐',
        modules: [
            {
                id: 'nms-1',
                title: 'Network Infrastructure Security',
                icon: '🔒',
                description: 'Protecting network systems and configurations from social engineering attacks',
                difficulty: 'Advanced',
                estimatedTime: '45 min',
                objectives: [
                    'Identify social engineering tactics targeting NMS teams',
                    'Implement secure network change procedures',
                    'Protect network configuration data',
                    'Establish vendor security protocols'
                ],
                content: {
                    materials: [
                        {
                            title: 'Understanding NMS Vulnerabilities',
                            content: 'Network Management Systems are prime targets for attackers seeking infrastructure access.'
                        },
                        {
                            title: 'Social Engineering Defense',
                            content: 'Learn to recognize sophisticated social engineering attempts targeting network teams.'
                        },
                        {
                            title: 'Vendor Security Management',
                            content: 'Establish secure protocols for vendor access and communication.'
                        }
                    ],
                    quiz: [
                        {
                            question: 'A vendor emails requesting emergency network configuration changes. What should you do first?',
                            options: [
                                'Implement the changes immediately',
                                'Verify the request through established secure channels',
                                'Forward to your manager',
                                'Ignore the request'
                            ],
                            correct: 1,
                            explanation: 'Always verify emergency requests through established secure communication channels before implementation.'
                        },
                        {
                            question: 'What is the primary social engineering risk for NMS teams?',
                            options: [
                                'Phishing for personal information',
                                'Unauthorized network configuration changes',
                                'Password theft for social media',
                                'Credit card fraud'
                            ],
                            correct: 1,
                            explanation: 'Attackers target NMS teams to gain unauthorized access to network configurations.'
                        }
                    ]
                }
            },
            {
                id: 'nms-2',
                title: 'Vendor Security Protocols',
                icon: '🤝',
                description: 'Managing third-party vendor access and communication security',
                difficulty: 'Intermediate',
                estimatedTime: '30 min',
                objectives: [
                    'Establish vendor verification procedures',
                    'Implement secure communication channels',
                    'Manage vendor access permissions',
                    'Monitor vendor security compliance'
                ],
                content: {
                    materials: [
                        {
                            title: 'Vendor Risk Assessment',
                            content: 'Evaluate and categorize vendor access based on risk levels.'
                        },
                        {
                            title: 'Secure Communication Protocols',
                            content: 'Establish encrypted channels for vendor communications.'
                        }
                    ],
                    quiz: [
                        {
                            question: 'A new vendor requests network access. What is the first step?',
                            options: [
                                'Grant temporary access',
                                'Complete security assessment',
                                'Ask for references',
                                'Check their website'
                            ],
                            correct: 1,
                            explanation: 'Always complete a thorough security assessment before granting any vendor access.'
                        }
                    ]
                }
            },
            {
                id: 'nms-3',
                title: 'Incident Response for Network Teams',
                icon: '🚨',
                description: 'Emergency procedures and communication during security incidents',
                difficulty: 'Advanced',
                estimatedTime: '60 min',
                objectives: [
                    'Execute network incident response',
                    'Coordinate with security teams',
                    'Communicate with stakeholders',
                    'Document incident details'
                ],
                content: {
                    materials: [
                        {
                            title: 'Incident Response Framework',
                            content: 'Structured approach to handling network security incidents.'
                        }
                    ],
                    quiz: [
                        {
                            question: 'During a network security incident, your first priority is:',
                            options: [
                                'Contain the incident',
                                'Notify all employees',
                                'Update social media',
                                'Continue normal operations'
                            ],
                            correct: 0,
                            explanation: 'Containing the incident prevents further damage and allows for proper investigation.'
                        }
                    ]
                }
            }
        ]
    },

    hr: {
        id: 'hr',
        name: 'HR Guardian Hub',
        description: 'Data Privacy, Compliance & Employee Protection',
        color: '#9c27b0',
        icon: '👥',
        modules: [
            {
                id: 'hr-1',
                title: 'Employee Data Protection',
                icon: '📊',
                description: 'Safeguarding sensitive employee information and ensuring POPIA compliance',
                difficulty: 'Intermediate',
                estimatedTime: '40 min',
                objectives: [
                    'Understand POPIA requirements',
                    'Implement secure data handling',
                    'Protect employee privacy',
                    'Establish access controls'
                ],
                content: {
                    materials: [
                        {
                            title: 'POPIA Compliance Essentials',
                            content: 'Understanding the Protection of Personal Information Act requirements.'
                        },
                        {
                            title: 'Secure Data Handling',
                            content: 'Procedures for protecting employee data from unauthorized access.'
                        }
                    ],
                    quiz: [
                        {
                            question: 'Under POPIA, employee consent for data processing must be:',
                            options: [
                                'Optional',
                                'Implied',
                                'Specific and informed',
                                'Verbal only'
                            ],
                            correct: 2,
                            explanation: 'POPIA requires specific, informed consent for personal data processing.'
                        },
                        {
                            question: 'What is the maximum penalty for POPIA non-compliance?',
                            options: [
                                'R1 million',
                                'R10 million',
                                'No penalty',
                                'Administrative fines up to R10 million'
                            ],
                            correct: 3,
                            explanation: 'POPIA allows for administrative fines up to R10 million for serious violations.'
                        }
                    ]
                }
            },
            {
                id: 'hr-2',
                title: 'Recruitment Security',
                icon: '💼',
                description: 'Securing the hiring process against social engineering and fraud',
                difficulty: 'Intermediate',
                estimatedTime: '35 min',
                objectives: [
                    'Verify candidate identities',
                    'Secure interview processes',
                    'Protect recruitment data',
                    'Prevent hiring fraud'
                ],
                content: {
                    materials: [
                        {
                            title: 'Candidate Verification',
                            content: 'Procedures for authenticating candidate identities and credentials.'
                        }
                    ],
                    quiz: [
                        {
                            question: 'A candidate provides references from personal email addresses. What should you do?',
                            options: [
                                'Accept them as is',
                                'Verify through official channels',
                                'Ignore references',
                                'Ask for more personal references'
                            ],
                            correct: 1,
                            explanation: 'Always verify professional references through official company channels.'
                        }
                    ]
                }
            }
        ]
    },

    it: {
        id: 'it',
        name: 'IT Cyber Station',
        description: 'System Defense & Incident Response',
        color: '#f44336',
        icon: '💻',
        modules: [
            {
                id: 'it-1',
                title: 'Privilege Access Management',
                icon: '🔑',
                description: 'Managing administrative access and preventing privilege escalation',
                difficulty: 'Advanced',
                estimatedTime: '50 min',
                objectives: [
                    'Implement least privilege principle',
                    'Monitor administrative access',
                    'Prevent privilege escalation',
                    'Manage service accounts'
                ],
                content: {
                    materials: [
                        {
                            title: 'Principle of Least Privilege',
                            content: 'Granting only the minimum access necessary for job functions.'
                        }
                    ],
                    quiz: [
                        {
                            question: 'The principle of least privilege means:',
                            options: [
                                'Grant all access by default',
                                'Grant minimum necessary access',
                                'No access for anyone',
                                'Access based on seniority'
                            ],
                            correct: 1,
                            explanation: 'Users should have only the access necessary to perform their job functions.'
                        }
                    ]
                }
            },
            {
                id: 'it-2',
                title: 'Security Tool Mastery',
                icon: '🛠️',
                description: 'Effective use of security tools and monitoring systems',
                difficulty: 'Advanced',
                estimatedTime: '55 min',
                objectives: [
                    'Master security monitoring tools',
                    'Configure alert systems',
                    'Analyze security logs',
                    'Respond to security alerts'
                ],
                content: {
                    materials: [
                        {
                            title: 'Security Monitoring Fundamentals',
                            content: 'Effective use of security information and event management systems.'
                        }
                    ],
                    quiz: [
                        {
                            question: 'What is the primary purpose of SIEM systems?',
                            options: [
                                'Network speed optimization',
                                'Security event correlation and analysis',
                                'User training',
                                'Data backup'
                            ],
                            correct: 1,
                            explanation: 'SIEM systems correlate and analyze security events across the organization.'
                        }
                    ]
                }
            }
        ]
    },

    executive: {
        id: 'executive',
        name: 'Executive Briefing Room',
        description: 'Security Overview & Department Analytics',
        color: '#ff9800',
        icon: '📊',
        modules: []
    }
};

// Department-specific AI responses and knowledge bases
const departmentAI = {
    nms: {
        greetings: [
            "Welcome to the NMS Command Center! Ready to strengthen our network defenses?",
            "Hello Network Warrior! Let's secure our infrastructure together.",
            "Greetings! Protecting our network backbone starts with awareness."
        ],
        expertise: [
            "network infrastructure",
            "vendor security",
            "social engineering",
            "incident response",
            "network protocols"
        ],
        responses: {
            'social engineering': "Social engineering attacks often target NMS teams for network access. Always verify unusual requests through multiple channels.",
            'vendor security': "Vendor access should follow the principle of least privilege and be regularly audited.",
            'incident response': "Network incidents require immediate containment and coordinated response across teams."
        }
    },
    hr: {
        greetings: [
            "Welcome to HR Guardian Hub! Let's protect our most valuable asset - our people.",
            "Hello Data Protector! Ready to master privacy and compliance?",
            "Greetings! Safeguarding employee data is our top priority."
        ],
        expertise: [
            "data privacy",
            "POPIA compliance",
            "employee protection",
            "recruitment security",
            "internal communications"
        ],
        responses: {
            'POPIA': "The Protection of Personal Information Act requires specific consent and secure data handling practices.",
            'data breach': "HR plays a critical role in data breach response and employee notification.",
            'recruitment': "Secure recruitment processes prevent social engineering and identity fraud."
        }
    },
    it: {
        greetings: [
            "Welcome to IT Cyber Station! Let's fortify our digital defenses.",
            "Hello Security Engineer! Ready to master system protection?",
            "Greetings! Protecting our systems requires constant vigilance and expertise."
        ],
        expertise: [
            "system security",
            "access control",
            "incident response",
            "security tools",
            "threat detection"
        ],
        responses: {
            'privilege escalation': "Implement strict access controls and monitor for unusual privilege elevation attempts.",
            'security tools': "Proper configuration and monitoring of security tools is essential for threat detection.",
            'incident response': "IT teams must lead coordinated incident response with clear communication channels."
        }
    }
};

// Department-specific progress tracking
function getDepartmentProgress(departmentId) {
    const progress = state.getDepartmentState(departmentId);
    const totalModules = departments[departmentId].modules.length;
    const completedModules = progress.modules.filter(m => m.completed).length;
    
    return {
        completion: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
        completedModules,
        totalModules,
        securityScore: calculateSecurityScore(progress),
        lastActivity: progress.lastActivity
    };
}

function calculateSecurityScore(progress) {
    let score = 0;
    const completedModules = progress.modules.filter(m => m.completed);
    
    if (completedModules.length > 0) {
        // Base score from completion
        score += (completedModules.length / progress.modules.length) * 60;
        
        // Add points for quiz performance
        const quizPerformance = completedModules.reduce((acc, module) => {
            return acc + (module.quizScore || 0);
        }, 0) / completedModules.length;
        
        score += (quizPerformance / 100) * 40;
    }
    
    return Math.min(Math.round(score), 100);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { departments, departmentAI, getDepartmentProgress, calculateSecurityScore };
}
