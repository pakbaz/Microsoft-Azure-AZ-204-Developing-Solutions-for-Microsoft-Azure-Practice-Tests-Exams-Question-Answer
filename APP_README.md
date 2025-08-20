# Azure AZ-204 Practice Test Web Application

A simple, interactive web application for practicing Azure AZ-204 exam questions.

## Features

- **220+ Practice Questions**: All questions from the official practice test repository
- **Interactive Interface**: Clean, modern design with easy navigation
- **Image Support**: Displays question diagrams and images
- **Answer Explanations**: Shows correct answers with basic explanations
- **Progress Tracking**: Visual progress indicator
- **Keyboard Navigation**: Use arrow keys to navigate, space/enter to show answers
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

### Quick Start

1. **Parse Questions** (if needed):
   ```bash
   python parse_questions.py
   ```

2. **Start the Server**:
   ```bash
   python server.py
   ```

3. **Open Browser**: The application will automatically open at `http://localhost:8000`

### Navigation

- **Previous/Next**: Use the buttons or left/right arrow keys
- **Show Answer**: Click the button or press space/enter
- **Question Options**: Click any option to select it
- **Progress**: Visual progress bar shows your position in the question set

## File Structure

```
├── index.html          # Main web application
├── styles.css          # Application styling
├── script.js           # Application logic
├── questions.json      # Parsed questions data
├── parse_questions.py  # Script to parse README.md into JSON
├── server.py           # Simple HTTP server
├── images/             # Question diagrams and images
└── README.md          # Original question source
```

## Question Format

Each question includes:
- **Question Text**: The main question content
- **Multiple Choice Options**: Various answer choices
- **Correct Answer**: Marked with [x] in the source
- **Images**: Associated diagrams when available
- **Explanations**: Basic explanations for learning

## Features in Detail

### Answer System
- Questions hide the correct answer initially
- Click "Show Answer" to reveal correct/incorrect options
- Correct answers are highlighted in green
- Incorrect options are marked in red
- Basic explanations help understand the concepts

### Navigation
- Sequential navigation through all questions
- Progress tracking with visual indicator
- Keyboard shortcuts for efficient studying
- No time limits - study at your own pace

### Question Content
- Covers all major Azure services and concepts
- Includes practical scenarios and implementation questions
- Features real Azure configuration examples
- Mirrors actual exam question styles

## Technical Notes

- Uses vanilla JavaScript (no frameworks required)
- Static files - can be served from any web server
- Questions parsed from the original README.md format
- Images loaded directly from the repository
- Responsive CSS for all device sizes

## Customization

You can customize the application by:
- Modifying `styles.css` for different themes
- Updating question explanations in `questions.json`
- Adding more detailed explanations
- Implementing scoring or tracking features

## Data Source

Questions sourced from: [Ditectrev Azure AZ-204 Repository](https://github.com/Ditectrev/Microsoft-Azure-AZ-204-Developing-Solutions-for-Microsoft-Azure-Practice-Tests-Exams-Question-Answer)

## License

This web application is for educational purposes. Please refer to the original repository for licensing information regarding the question content.

---

**Note**: This is a practice tool. Always refer to official Microsoft documentation and training materials for the most current information.
