class AzureExamApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.showingAnswer = false;
        
        this.initializeElements();
        this.loadQuestions();
        this.bindEvents();
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
            showAnswerBtn: document.getElementById('showAnswerBtn')
        };
    }

    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            this.questions = await response.json();
            this.elements.totalQuestions.textContent = this.questions.length;
            this.displayQuestion();
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
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    bindEvents() {
        this.elements.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.elements.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.elements.showAnswerBtn.addEventListener('click', () => this.showAnswer());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
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
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AzureExamApp();
});
