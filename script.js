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

        for (const entry of knowledgeBase) {
            const lowerCaseQuestionEntry = entry.question.toLowerCase();
            // Calculate a simple score based on keyword matching
            const score = calculateMatchScore(lowerCaseQuestion, lowerCaseQuestionEntry);
            if (score > bestMatch.score) {
                bestMatch = { score, answer: entry.answer };
            }
        }

        return bestMatch.answer;
    }

    function calculateMatchScore(userQuestion, knowledgeQuestion) {
        const userWords = userQuestion.split(' ');
        const knowledgeWords = knowledgeQuestion.split(' ');

        let matchCount = 0;
        userWords.forEach(word => {
            if (knowledgeWords.includes(word)) {
                matchCount++;
            }
        });

        return matchCount / knowledgeWords.length; // Simple score based on keyword matches
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
