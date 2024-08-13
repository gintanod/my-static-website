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
        const lowerCaseQuestion = question.toLowerCase();
        let bestMatch = { score: 0, answer: "Sorry, I don't have an answer to that question." };

        knowledgeBase.forEach(entry => {
            const lowerCaseQuestionEntry = entry.question.toLowerCase();
            const score = calculateMatchScore(lowerCaseQuestion, lowerCaseQuestionEntry);
            if (score > bestMatch.score) {
                bestMatch = { score, answer: entry.answer };
            }
        });

        return bestMatch.answer;
    }

    function calculateMatchScore(userQuestion, knowledgeQuestion) {
        const userTokens = tokenize(userQuestion);
        const knowledgeTokens = tokenize(knowledgeQuestion);

        let matchCount = 0;
        userTokens.forEach(token => {
            if (knowledgeTokens.includes(token)) {
                matchCount++;
            }
        });

        return matchCount / knowledgeTokens.length; // Score based on token matches
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
