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
        let matchedAnswer = "Sorry, I don't have an answer to that question.";

        // Try exact matches first
        for (const entry of knowledgeBase) {
            if (entry.question.toLowerCase() === lowerCaseQuestion) {
                return entry.answer;
            }
        }

        // Try partial matches if exact match is not found
        for (const entry of knowledgeBase) {
            if (entry.question.toLowerCase().includes(lowerCaseQuestion)) {
                matchedAnswer = entry.answer;
                break;
            }
        }

        // Fallback to a generic response if no match is found
        return matchedAnswer;
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
