document.addEventListener('DOMContentLoaded', () => {
    const chatbox = document.getElementById('chatbox');
    const input = document.getElementById('input');
    const submit = document.getElementById('submit');

    let knowledgeBase = [];

    // Load knowledge base
    fetch('knowledge_base.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            knowledgeBase = data;
        })
        .catch(error => {
            console.error('Error loading knowledge base:', error);
            addMessage("Error loading knowledge base. Check console for details.", false);
        });

    function addMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll to bottom
    }

    function findAnswer(question) {
        const normalizedQuestion = normalizeText(question);

        // Handle common question patterns
        if (/who is/i.test(normalizedQuestion)) {
            const namePart = extractNamePart(normalizedQuestion);
            const bestMatch = findBestMatch(namePart);
            return bestMatch ? bestMatch.answer : "Sorry, I don't have an answer to that question.";
        }

        return "Sorry, I don't have an answer to that question.";
    }

    function normalizeText(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/) // Split by whitespace
            .filter(token => token.length > 0); // Remove empty tokens
    }

    function extractNamePart(question) {
        const match = question.match(/who is\s+(.+)/i);
        return match ? normalizeText(match[1]).join(' ') : '';
    }

    function findBestMatch(namePart) {
        let bestMatch = null;
        knowledgeBase.forEach(entry => {
            const entryName = normalizeText(entry.question).join(' ');
            if (entryName.includes(namePart)) {
                bestMatch = entry;
            }
        });
        return bestMatch;
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
