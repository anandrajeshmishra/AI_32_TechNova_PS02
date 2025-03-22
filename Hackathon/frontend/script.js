// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendMessageBtn = document.getElementById('send-message');
const voiceInputBtn = document.getElementById('voice-input');
const clearChatBtn = document.getElementById('clear-chat');
const exportChatBtn = document.getElementById('export-chat');

// Navigation elements
const knowledgeBaseLink = document.getElementById('knowledge-base-link');
const dashboardLink = document.getElementById('dashboard-link');
const settingsLink = document.getElementById('settings-link');

// View containers
const chatbotContainer = document.getElementById('chatbot-container');
const knowledgeBaseContainer = document.getElementById('knowledge-base-container');
const dashboardContainer = document.getElementById('dashboard-container');
const settingsContainer = document.getElementById('settings-container');

// Modal elements
const kbModal = document.getElementById('kb-modal');
const addKbEntryBtn = document.getElementById('add-kb-entry');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const saveBtn = document.querySelector('.save-btn');

// Sample knowledge base data
const knowledgeBase = [
    {
        id: 1,
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login page and click on 'Forgot Password'. Follow the instructions sent to your email to create a new password.",
        category: "it",
        tags: ["password", "login", "account"]
    },
    {
        id: 2,
        question: "Where can I find my payslip?",
        answer: "You can access your payslip by navigating to HR > My Documents > Payslips in the ERP system. You can also filter by date to find specific payslips.",
        category: "hr",
        tags: ["payslip", "salary", "documents"]
    },
    {
        id: 3,
        question: "How do I create a new sales order?",
        answer: "To create a new sales order, go to Sales > Orders > New Order. Fill out the customer information, add products to the order, set the delivery date, and click 'Save'.",
        category: "sales",
        tags: ["order", "sales", "customer"]
    },
    {
        id: 4,
        question: "How do I submit an expense report?",
        answer: "To submit an expense report, navigate to Finance > Expenses > New Expense. Upload receipts, categorize expenses, add descriptions, and submit for approval.",
        category: "finance",
        tags: ["expense", "report", "reimbursement"]
    }
];

// Initialize the application
function initApp() {
    // Show chatbot view by default
    showView('chatbot');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize suggestion chips
    initSuggestionChips();
    
    // Add welcome message
    addMessage("Hello! I'm your AI Support Assistant. How can I help you today?");
}

// Set up all event listeners
function setupEventListeners() {
    // Chat functionality
    sendMessageBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    voiceInputBtn.addEventListener('click', toggleVoiceInput);
    clearChatBtn.addEventListener('click', clearChat);
    exportChatBtn.addEventListener('click', exportChat);
    
    // Navigation
    knowledgeBaseLink.addEventListener('click', () => showView('knowledge-base'));
    dashboardLink.addEventListener('click', () => showView('dashboard'));
    settingsLink.addEventListener('click', () => showView('settings'));
    
    // Knowledge Base
    addKbEntryBtn.addEventListener('click', showAddKnowledgeEntryModal);
    closeModalBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    saveBtn.addEventListener('click', saveKnowledgeEntry);
    
    // Initialize range input displays
    document.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', function() {
            this.nextElementSibling.textContent = `${this.value}%`;
        });
    });
}

// Initialize knowledge base entries
function initKnowledgeBase() {
    const kbEntries = document.getElementById('kb-entries');
    kbEntries.innerHTML = '';
    
    knowledgeBase.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'kb-entry';
        entryElement.innerHTML = `
            <h4>${entry.question}</h4>
            <p>${entry.answer}</p>
            <div class="tags">
                ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="actions">
                <button class="edit-btn" data-id="${entry.id}">Edit</button>
                <button class="delete-btn" data-id="${entry.id}">Delete</button>
            </div>
        `;
        kbEntries.appendChild(entryElement);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const entryId = parseInt(this.getAttribute('data-id'));
            editKnowledgeEntry(entryId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const entryId = parseInt(this.getAttribute('data-id'));
            deleteKnowledgeEntry(entryId);
        });
    });
}

// Initialize suggestion chips
function initSuggestionChips() {
    const defaultChips = [
        { text: "Create sales order", query: "How do I create a new sales order?" },
        { text: "Reset password", query: "How do I reset my password?" },
        { text: "Find payslip", query: "Where can I find my payslip?" },
        { text: "Finance request", query: "How do I raise a finance request?" }
    ];
    
    updateCustomChips(defaultChips);
}

// Navigation functionality
function showView(viewToShow) {
    // Hide all views
    chatbotContainer.classList.add('hidden');
    knowledgeBaseContainer.classList.add('hidden');
    dashboardContainer.classList.add('hidden');
    settingsContainer.classList.add('hidden');
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected view and mark nav item as active
    switch(viewToShow) {
        case 'chatbot':
            chatbotContainer.classList.remove('hidden');
            document.querySelector('.nav-menu li:nth-child(1)').classList.add('active');
            break;
        case 'knowledge-base':
            knowledgeBaseContainer.classList.remove('hidden');
            document.querySelector('.nav-menu li:nth-child(2)').classList.add('active');
            initKnowledgeBase();
            break;
        case 'dashboard':
            dashboardContainer.classList.remove('hidden');
            document.querySelector('.nav-menu li:nth-child(3)').classList.add('active');
            // Initialize dashboard charts if needed
            initDashboardCharts();
            break;
        case 'settings':
            settingsContainer.classList.remove('hidden');
            document.querySelector('.nav-menu li:nth-child(4)').classList.add('active');
            break;
    }
}

// Chatbot functionality
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${content}</p>
        </div>
        <div class="message-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send user message and get response
function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addMessage(message, true);
    
    // Clear input field
    userInput.value = '';
    
    // Process query (simulate API call with setTimeout)
    processQuery(message);
}

// Function to process user query and generate response
function processQuery(query) {
    // Simulate typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message typing';
    typingIndicator.innerHTML = `
        <div class="message-content">
            <p>AI is typing...</p>
        </div>
    `;
    chatMessages.appendChild(typingIndicator);
    
    // Simulate API call delay
    setTimeout(() => {
        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);
        
        // Check knowledge base for matches
        const match = findInKnowledgeBase(query);
        
        if (match) {
            // Knowledge base match found
            addMessage(match.answer);
            
            // Add related suggestions if available
            if (match.category) {
                updateSuggestionChips(match.category);
            }
        } else if (query.toLowerCase().includes('sales')) {
            // Simulate ERP data fetch for sales query
            addMessage("I'm fetching the latest sales data for you from the ERP system...");
            
            setTimeout(() => {
                addMessage("Based on the ERP data, your team has achieved 87% of the quarterly sales target. The top-performing product this month is 'Enterprise Cloud Solution'.");
            }, 1000);
            
        } else if (query.toLowerCase().includes('help') || query.toLowerCase().includes('support')) {
            // Offer to escalate to human support
            addMessage("I'll be happy to help. Would you like me to connect you with our support team for further assistance?");
            
            // Update suggestion chips for support-related queries
            const supportChips = [
                { text: "Yes, connect me", query: "Yes, connect me to support" },
                { text: "No thanks", query: "No thanks, I'll continue with the bot" },
                { text: "Submit ticket", query: "I want to submit a support ticket" }
            ];
            
            updateCustomChips(supportChips);
            
        } else {
            // Generic response for unrecognized queries
            addMessage("I don't have an immediate answer for that. Let me route your query to our support team who can help you better. In the meantime, is there anything else I can assist you with?");
            
            // Simulate escalation
            setTimeout(() => {
                addMessage("I've created support ticket #T-29845 for your query. A support agent will contact you soon. You can check the status in your notifications.");
            }, 2000);
        }
    }, 1500);
}

// Function to find matches in knowledge base
function findInKnowledgeBase(query) {
    // Simple string matching logic - in a real app, use NLP for better matching
    query = query.toLowerCase();
    
    // First try for exact question match
    const exactMatch = knowledgeBase.find(item => 
        item.question.toLowerCase() === query
    );
    
    if (exactMatch) return exactMatch;
    
    // Then try for keyword matches
    const keywordMatch = knowledgeBase.find(item => {
        // Check if query contains keywords from the question
        const questionWords = item.question.toLowerCase().split(' ');
        return questionWords.some(word => word.length > 3 && query.includes(word));
    });
    
    if (keywordMatch) return keywordMatch;
    
    // Then try tag matches
    const tagMatch = knowledgeBase.find(item => 
        item.tags.some(tag => query.includes(tag))
    );
    
    return tagMatch || null;
}

// Function to update suggestion chips based on category
function updateSuggestionChips(category) {
    const categoryChips = {
        'sales': [
            { text: "Create sales order", query: "How do I create a new sales order?" },
            { text: "Sales target", query: "What's my sales target this month?" },
            { text: "Customer discount", query: "How do I apply customer discounts?" }
        ],
        'hr': [
            { text: "Find payslip", query: "Where can I find my payslip?" },
            { text: "Apply leave", query: "How do I apply for leave?" },
            { text: "Performance review", query: "When is my next performance review?" }
        ],
        'finance': [
            { text: "Expense report", query: "How do I submit an expense report?" },
            { text: "Budget status", query: "What's my department's budget status?" },
            { text: "Invoice approval", query: "How do I approve pending invoices?" }
        ],
        'it': [
            { text: "Reset password", query: "How do I reset my password?" },
            { text: "Request software", query: "How do I request new software?" },
            { text: "Report IT issue", query: "How do I report an IT issue?" }
        ]
    };
    
    const chips = categoryChips[category] || [
        { text: "Create sales order", query: "How do I create a new sales order?" },
        { text: "Reset password", query: "How do I reset my password?" },
        { text: "Find payslip", query: "Where can I find my payslip?" },
        { text: "Expense report", query: "How do I submit an expense report?" }
    ];
    
    updateCustomChips(chips);
}

// Function to update chips with custom suggestions
function updateCustomChips(suggestions) {
    const chipsContainer = document.querySelector('.suggestion-chips');
    chipsContainer.innerHTML = '';
    
    suggestions.forEach(chip => {
        const chipElement = document.createElement('button');
        chipElement.className = 'chip';
        chipElement.textContent = chip.text;
        chipElement.setAttribute('data-query', chip.query);
        
        chipElement.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            userInput.value = query;
            sendMessage();
        });
        
        chipsContainer.appendChild(chipElement);
    });
}

// Voice input functionality
function toggleVoiceInput() {
    // Check if browser supports SpeechRecognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        // Toggle recording state
        if (voiceInputBtn.classList.contains('recording')) {
            // Stop recording
            voiceInputBtn.classList.remove('recording');
            voiceInputBtn.style.backgroundColor = '';
            stopVoiceRecognition();
        } else {
            // Start recording
            voiceInputBtn.classList.add('recording');
            voiceInputBtn.style.backgroundColor = '#dc3545';
            startVoiceRecognition();
        }
    } else {
        alert('Your browser does not support voice recognition. Please try using Chrome or Edge.');
    }
}

// Initialize voice recognition (mock implementation)
function startVoiceRecognition() {
    // In a real implementation, use Web Speech API
    // For demo purposes, we'll simulate voice input
    setTimeout(() => {
        userInput.value = "I need help with my sales report";
        stopVoiceRecognition();
    }, 2000);
}

function stopVoiceRecognition() {
    // Stop recording UI indication
    voiceInputBtn.classList.remove('recording');
    voiceInputBtn.style.backgroundColor = '';
}

// Clear chat history
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        // Keep the first bot welcome message
        const welcomeMessage = chatMessages.firstElementChild;
        chatMessages.innerHTML = '';
        if (welcomeMessage) {
            chatMessages.appendChild(welcomeMessage);
        } else {
            addMessage("Hello! I'm your AI Support Assistant. How can I help you today?");
        }
    }
}

// Export chat as text file
function exportChat() {
    const messages = Array.from(chatMessages.querySelectorAll('.message'));
    let chatText = "AI Sentinel Support Chat Log\n";
    chatText += "==============================\n\n";
    
    messages.forEach(msg => {
        const isBot = msg.classList.contains('bot-message');
        const content = msg.querySelector('.message-content p').textContent;
        const time = msg.querySelector('.message-time').textContent;
        
        chatText += `[${time}] ${isBot ? 'AI Sentinel' : 'You'}: ${content}\n\n`;
    });
    
    // Create download link
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Knowledge Base modal functions
function showAddKnowledgeEntryModal() {
    // Clear previous form data
    document.getElementById('kb-question').value = '';
    document.getElementById('kb-answer').value = '';
    document.getElementById('kb-category').value = 'sales';
    document.getElementById('kb-tags').value = '';
    
    // Remove any existing entry ID from save button
    saveBtn.removeAttribute('data-edit-id');
    
    // Show modal
    kbModal.style.display = 'block';
}

function hideModal() {
    kbModal.style.display = 'none';
}

function editKnowledgeEntry(id) {
    const entry = knowledgeBase.find(item => item.id === id);
    
    if (!entry) return;
    
    // Populate modal with entry data
    document.getElementById('kb-question').value = entry.question;
    document.getElementById('kb-answer').value = entry.answer;
    document.getElementById('kb-category').value = entry.category;
    document.getElementById('kb-tags').value = entry.tags.join(', ');
    
    // Store entry ID on save button for update
    saveBtn.setAttribute('data-edit-id', id);
    
    // Show modal
    kbModal.style.display = 'block';
}

function deleteKnowledgeEntry(id) {
    if (confirm('Are you sure you want to delete this knowledge base entry?')) {
        // In a real app, send delete request to API
        // For demo, filter out the entry
        const index = knowledgeBase.findIndex(item => item.id === id);
        
        if (index !== -1) {
            knowledgeBase.splice(index, 1);
            initKnowledgeBase();
        }
    }
}

function saveKnowledgeEntry() {
    const question = document.getElementById('kb-question').value.trim();
    const answer = document.getElementById('kb-answer').value.trim();
    const category = document.getElementById('kb-category').value;
    const tagsStr = document.getElementById('kb-tags').value.trim();
    const tags = tagsStr ? tagsStr.split(',').map(tag => tag.trim()) : [];
    
    // Validate inputs
    if (!question || !answer) {
        alert('Please fill in both question and answer fields.');
        return;
    }
    
    const editId = saveBtn.getAttribute('data-edit-id');
    
    if (editId) {
        // Edit existing entry
        const id = parseInt(editId);
        const index = knowledgeBase.findIndex(item => item.id === id);
        
        if (index !== -1) {
            knowledgeBase[index] = {
                id,
                question,
                answer,
                category,
                tags
            };
        }
    } else {
        // Add new entry
        const newId = knowledgeBase.length > 0 ? 
            Math.max(...knowledgeBase.map(item => item.id)) + 1 : 1;
        
        knowledgeBase.push({
            id: newId,
            question,
            answer,
            category,
            tags
        });
    }
    
    // Hide modal and refresh KB entries
    hideModal();
    initKnowledgeBase();
}

// Dashboard charts initialization (mock)
function initDashboardCharts() {
    const queriesChart = document.getElementById('queries-chart');
    const categoriesChart = document.getElementById('categories-chart');
    
    // In a real app, use a charting library like Chart.js
    // For this demo, we'll just add placeholders
    
    queriesChart.querySelector('.chart-placeholder').innerHTML = `
        <div style="height: 200px; display: flex; align-items: center; justify-content: center;">
            <p>Daily query volume chart would render here</p>
        </div>
    `;
    
    categoriesChart.querySelector('.chart-placeholder').innerHTML = `
        <div style="height: 200px; display: flex; align-items: center; justify-content: center;">
            <p>Query categories distribution would render here</p>
        </div>
    `;
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// Handle window click events for modal
window.addEventListener('click', (e) => {
    if (e.target === kbModal) {
        hideModal();
    }
});