document.addEventListener('DOMContentLoaded', () => {
    const chatbox = document.getElementById('chatbox');
    const input = document.getElementById('input');
    const submit = document.getElementById('submit');

    let knowledgeBase = [];

    // Load knowledge base
    fetch('knowledge_base.json')
        .then(response => response.json())
        .then(data => {
            knowledgeBase = data;
        })
        .catch(error => console.error('Error loading knowledge base:', error));

    function addMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll to bottom
    }

    function findAnswer(question) {
        // Normalize the question
        const normalizedQuestion = question.toLowerCase().trim();
        
        // Look for exact matches or common patterns
        let bestMatch = { score: 0, answer: "Sorry, I don't have an answer to that question." };
        const patternMatch = new RegExp(/who is|tell me about|what is/, 'i');

        knowledgeBase.forEach(entry => {
            // Normalize the knowledge entry question
            const entryQuestion = entry.question.toLowerCase().trim();
            
            // Check if the question contains key phrases
            if (patternMatch.test(normalizedQuestion)) {
                const keywords = extractKeywords(normalizedQuestion);
                const score = calculatePatternScore(keywords, entryQuestion);
                if (score > bestMatch.score) {
                    bestMatch = { score, answer: entry.answer };
                }
            } else if (normalizedQuestion.includes(entryQuestion)) {
                bestMatch = { score: 1, answer: entry.answer };
            }
        });

        return bestMatch.answer;
    }

    function extractKeywords(question) {
        // Extract keywords from the question, ignoring common words
        const keywords = question
            .replace(/who is|tell me about|what is/g, '') // Remove common patterns
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/) // Split by whitespace
            .filter(token => token.length > 0); // Remove empty tokens
        return keywords;
    }

    function calculatePatternScore(keywords, entryQuestion) {
        // Calculate the score based on the number of matching keywords
        const entryTokens = tokenize(entryQuestion);
        let matchCount = 0;

        keywords.forEach(keyword => {
            if (entryTokens.includes(keyword)) {
                matchCount++;
            }
        });

        return matchCount / entryTokens.length; // Score based on keyword matches
    }

    function tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/) // Split by whitespace
            .filter(token => token.length > 0); // Remove empty tokens
    }

    submit.addEventListener('click', () => {
        const userInput = input.value.trim();
        if (userInput) {
            addMessage(userInput, true);
            const answer = findAnswer(userInput);
            addMessage(answer, false);
            input.value = ''; // Clear input field
        }
    });

    // Allow Enter key to submit
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submit.click();
        }
    });
});
