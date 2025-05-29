document.addEventListener('DOMContentLoaded', function() {
    const chatbotBtn = document.getElementById('chatbot-btn');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('chatbot-user-input');
    const sendButton = document.getElementById('chatbot-send');

    // Toggle chatbot visibility
    chatbotBtn.addEventListener('click', function() {
        chatbotContainer.classList.toggle('hidden');
    });

    chatbotClose.addEventListener('click', function() {
        chatbotContainer.classList.add('hidden');
    });

    // Handle sending messages
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Display user message
        appendMessage('You', message);
        userInput.value = '';

        // Simulate bot response (Replace with actual AI logic later)
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            appendMessage('Bot', botResponse);
        }, 1000);
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function getBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
    
        // Greeting responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hi there! How can I assist you with food donations today? 😊';
        }
    
        // Donation-related queries
        if (lowerMessage.includes('donate')) {
            return 'You can donate food by clicking the "Donate Food" button on the homepage! We truly appreciate your generosity. 🥰';
        }
        if (lowerMessage.includes('money')) {
            return 'If you would like to donate money, please visit our "Donate Money" page for secure payment options. 💖';
        }
        if (lowerMessage.includes('how to donate') || lowerMessage.includes('donation process')) {
            return 'To donate, simply click the "Donate Food" button and follow the instructions. Make sure your location services are enabled for accurate tracking. 🚚';
        }
        if (lowerMessage.includes('donation guidelines')) {
            return 'Please ensure all food items are fresh, well-packaged, and labeled. Avoid donating expired or perishable items unless clearly stated. ✅';
        }
        if (lowerMessage.includes('where to donate')) {
            return 'You can donate at our listed locations or schedule a pickup through our website. Visit the "Find Food" section for more details! 📍';
        }
    
        // Tracking-related queries
        if (lowerMessage.includes('track donation') || lowerMessage.includes('tracking')) {
            return 'You can track your donation by enabling your location when prompted and visiting the "Tracking" page. 📍';
        }
    
        // Account/Login issues
        if (lowerMessage.includes('login issue') || lowerMessage.includes('account issue')) {
            return 'If you are having trouble logging in, please try resetting your password or contact support@fooddonation.org for assistance. 🔑';
        }
    
        // Event Participation
        if (lowerMessage.includes('event') || lowerMessage.includes('participate')) {
            return 'We regularly host food donation drives! Check our "Events" page for upcoming activities you can join. 🎉';
        }
    
        // Safety & Quality Concerns
        if (lowerMessage.includes('is the food safe') || lowerMessage.includes('quality')) {
            return 'We ensure all donated food items are carefully checked for safety and freshness before being distributed. 🛡️';
        }
    
        // Feedback
        if (lowerMessage.includes('feedback') || lowerMessage.includes('suggestion')) {
            return 'We love hearing from you! Please share your feedback through the "Contact Us" page or by emailing support@fooddonation.org. 💬';
        }
    
        // Finding food assistance
        if (lowerMessage.includes('find food') || lowerMessage.includes('where to get food')) {
            return 'You can find available food donations by clicking on the "Find Food" section on our website. Let me know if you need specific locations! 🥗';
        }
    
        // Volunteer opportunities
        if (lowerMessage.includes('volunteer')) {
            return 'That’s amazing! You can check our "Volunteer" section to join our mission and help those in need. 🌍';
        }
    
        // About the organization
        if (lowerMessage.includes('about') || lowerMessage.includes('who are you')) {
            return 'We are a non-profit organization dedicated to reducing food waste and helping those in need. Want to learn more? Visit our "About Us" page!';
        }
    
        // Contact details
        if (lowerMessage.includes('contact') || lowerMessage.includes('help')) {
            return 'You can reach us via email at support@fooddonation.org or visit our "Contact Us" page for more details. 📩';
        }
    
        // Thank you response
        if (lowerMessage.includes('thank you') || lowerMessage.includes('thanks')) {
            return 'You’re very welcome! 😊 Let me know if there’s anything else I can help with!';
        }
    
        // Goodbye response
        if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            return 'Goodbye! Have a great day and thank you for supporting food donations! 👋';
        }
    
        // Default response
        return "I'm here to help! Ask me anything about food donations, volunteering, or how you can support our cause. ❤️";
    }
});    