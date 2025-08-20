class AzureExamApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.showingAnswer = false;
        
        this.initializeElements();
        this.loadQuestions();
        this.bindEvents();
        this.setupURLHandling();
    }

    initializeElements() {
        this.elements = {
            loading: document.getElementById('loading'),
            questionNumber: document.getElementById('questionNumber'),
            questionText: document.getElementById('questionText'),
            questionImage: document.getElementById('questionImage'),
            optionsContainer: document.getElementById('optionsContainer'),
            answerSection: document.getElementById('answerSection'),
            correctAnswer: document.getElementById('correctAnswer'),
            explanation: document.getElementById('explanation'),
            currentQuestion: document.getElementById('currentQuestion'),
            totalQuestions: document.getElementById('totalQuestions'),
            progressFill: document.getElementById('progressFill'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            showAnswerBtn: document.getElementById('showAnswerBtn'),
            jumpToQuestion: document.getElementById('jumpToQuestion'),
            jumpBtn: document.getElementById('jumpBtn')
        };
    }

    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            this.questions = await response.json();
            this.elements.totalQuestions.textContent = this.questions.length;
            
            // Update jump input max value
            this.elements.jumpToQuestion.setAttribute('max', this.questions.length);
            
            // Load question from URL or default to first question
            this.loadQuestionFromURL();
            
            this.elements.loading.style.display = 'none';
        } catch (error) {
            console.error('Error loading questions:', error);
            this.elements.loading.innerHTML = '<p>Error loading questions. Please check if questions.json exists.</p>';
        }
    }

    displayQuestion() {
        if (this.questions.length === 0) return;
        
        const question = this.questions[this.currentQuestionIndex];
        this.showingAnswer = false;
        
        // Update question info
        this.elements.questionNumber.textContent = `Question ${this.currentQuestionIndex + 1}`;
        this.elements.questionText.textContent = question.text;
        this.elements.currentQuestion.textContent = this.currentQuestionIndex + 1;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
        
        // Display image if exists
        if (question.image && question.image.trim()) {
            this.elements.questionImage.innerHTML = `
                <img src="${question.image}" alt="Question ${this.currentQuestionIndex + 1} diagram" 
                     onerror="this.style.display='none'">
            `;
        } else {
            this.elements.questionImage.innerHTML = '';
        }
        
        // Display options
        this.displayOptions(question.options);
        
        // Hide answer section
        this.elements.answerSection.style.display = 'none';
        this.elements.showAnswerBtn.textContent = 'Show Answer';
        this.elements.showAnswerBtn.classList.remove('btn-secondary');
        this.elements.showAnswerBtn.classList.add('btn-primary');
        
        // Update navigation buttons
        this.elements.prevBtn.disabled = this.currentQuestionIndex === 0;
        this.elements.nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
        
        // Remove answer revealed class
        this.elements.optionsContainer.classList.remove('answer-revealed');
    }

    displayOptions(options) {
        this.elements.optionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <div class="option-text">${this.formatOptionText(option.text)}</div>
            `;
            
            optionElement.addEventListener('click', () => this.selectOption(optionElement, index));
            this.elements.optionsContainer.appendChild(optionElement);
        });
    }

    formatOptionText(text) {
        // Format code blocks and technical terms
        return text
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    }

    selectOption(element, index) {
        if (this.showingAnswer) return;
        
        // Remove previous selections
        this.elements.optionsContainer.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection to clicked option
        element.classList.add('selected');
    }

    showAnswer() {
        if (this.showingAnswer) {
            this.hideAnswer();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        this.showingAnswer = true;
        
        // Mark correct and incorrect options
        const options = this.elements.optionsContainer.querySelectorAll('.option');
        options.forEach((optionElement, index) => {
            const option = question.options[index];
            if (option.isCorrect) {
                optionElement.classList.add('correct');
            } else {
                optionElement.classList.add('incorrect');
            }
        });
        
        // Add answer revealed class for styling
        this.elements.optionsContainer.classList.add('answer-revealed');
        
        // Show answer section
        this.elements.correctAnswer.textContent = `Correct Answer: ${question.correctAnswer}`;
        this.elements.explanation.textContent = question.explanation;
        this.elements.answerSection.style.display = 'block';
        
        // Update button
        this.elements.showAnswerBtn.textContent = 'Hide Answer';
        this.elements.showAnswerBtn.classList.remove('btn-primary');
        this.elements.showAnswerBtn.classList.add('btn-secondary');
    }

    hideAnswer() {
        this.showingAnswer = false;
        
        // Remove answer styling
        const options = this.elements.optionsContainer.querySelectorAll('.option');
        options.forEach(optionElement => {
            optionElement.classList.remove('correct', 'incorrect');
        });
        
        this.elements.optionsContainer.classList.remove('answer-revealed');
        
        // Hide answer section
        this.elements.answerSection.style.display = 'none';
        
        // Update button
        this.elements.showAnswerBtn.textContent = 'Show Answer';
        this.elements.showAnswerBtn.classList.remove('btn-secondary');
        this.elements.showAnswerBtn.classList.add('btn-primary');
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
            this.updateURL();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
            this.updateURL();
        }
    }

    setupURLHandling() {
        // Listen for browser back/forward navigation
        window.addEventListener('popstate', (e) => {
            this.loadQuestionFromURL();
        });
        
        // Load initial question from URL if present
        this.loadQuestionFromURL();
    }

    loadQuestionFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const questionParam = urlParams.get('question');
        
        if (questionParam) {
            const questionNumber = parseInt(questionParam);
            if (questionNumber >= 1 && questionNumber <= this.questions.length) {
                this.currentQuestionIndex = questionNumber - 1; // Convert to 0-based index
                this.displayQuestion();
                return;
            }
        }
        
        // If no valid question parameter, start with question 1
        if (this.questions.length > 0) {
            this.currentQuestionIndex = 0;
            this.displayQuestion();
            this.updateURL();
        }
    }

    updateURL() {
        const questionNumber = this.currentQuestionIndex + 1; // Convert to 1-based
        const newURL = `${window.location.pathname}?question=${questionNumber}`;
        
        // Update URL without triggering page reload
        window.history.pushState({ questionNumber }, `Question ${questionNumber}`, newURL);
        
        // Update page title
        document.title = `Question ${questionNumber} - Azure AZ-204 Practice Test`;
    }

    goToQuestion(questionNumber) {
        if (questionNumber >= 1 && questionNumber <= this.questions.length) {
            this.currentQuestionIndex = questionNumber - 1; // Convert to 0-based index
            this.displayQuestion();
            this.updateURL();
        }
    }

    bindEvents() {
        this.elements.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.elements.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.elements.showAnswerBtn.addEventListener('click', () => this.showAnswer());
        this.elements.jumpBtn.addEventListener('click', () => this.handleJumpToQuestion());
        
        // Handle Enter key in jump input
        this.elements.jumpToQuestion.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleJumpToQuestion();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Skip keyboard navigation if user is typing in the jump input
            if (e.target === this.elements.jumpToQuestion) {
                return;
            }
            
            if (e.key === 'ArrowLeft') {
                this.previousQuestion();
            } else if (e.key === 'ArrowRight') {
                this.nextQuestion();
            } else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.showAnswer();
            }
        });
    }

    handleJumpToQuestion() {
        const questionNumber = parseInt(this.elements.jumpToQuestion.value);
        if (questionNumber >= 1 && questionNumber <= this.questions.length) {
            this.goToQuestion(questionNumber);
            this.elements.jumpToQuestion.value = ''; // Clear the input
        } else {
            // Show error feedback
            this.elements.jumpToQuestion.style.borderColor = '#e74c3c';
            setTimeout(() => {
                this.elements.jumpToQuestion.style.borderColor = '#ddd';
            }, 1000);
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AzureExamApp();
});
