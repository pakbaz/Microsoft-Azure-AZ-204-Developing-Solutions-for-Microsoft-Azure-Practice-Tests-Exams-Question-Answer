import re
import json
import os

def parse_questions_from_readme():
    """Parse questions from README.md and create a JSON file for the web app"""
    
    # Read the README.md file
    with open('README.md', 'r', encoding='utf-8') as file:
        content = file.read()
    
    questions = []
    
    # Split content by question headers
    question_pattern = r'### (.+?)(?=### |\Z)'
    question_matches = re.findall(question_pattern, content, re.DOTALL)
    
    for i, match in enumerate(question_matches):
        question_text = match.strip()
        
        # Skip if this is not actually a question
        if not any(keyword in question_text.lower() for keyword in ['you are', 'you develop', 'you have', 'you need', 'a company', 'contoso', 'fourth coffee', 'determine']):
            continue
            
        question = parse_single_question(question_text, i + 1)
        if question:
            questions.append(question)
    
    print(f"Parsed {len(questions)} questions")
    
    # Save to JSON file
    with open('questions.json', 'w', encoding='utf-8') as file:
        json.dump(questions, file, indent=2, ensure_ascii=False)
    
    return questions

def parse_single_question(question_text, question_number):
    """Parse a single question section"""
    
    lines = question_text.split('\n')
    
    # Extract question title/text (first meaningful line)
    question_title = lines[0].strip() if lines else ""
    
    # Find image reference
    image_pattern = r'!\[Question.*?\]\((.*?)\)'
    image_match = re.search(image_pattern, question_text)
    image_url = image_match.group(1) if image_match else ""
    
    # Extract options
    option_pattern = r'- \[([ x])\] (.+?)(?=\n- \[|$|\*\*\[⬆)'
    option_matches = re.findall(option_pattern, question_text, re.DOTALL)
    
    options = []
    correct_answer = ""
    
    for is_correct, option_text in option_matches:
        option_clean = option_text.strip().replace('\n', ' ')
        is_correct_bool = is_correct == 'x'
        
        options.append({
            'text': option_clean,
            'isCorrect': is_correct_bool
        })
        
        if is_correct_bool:
            correct_answer = option_clean
    
    # Generate explanation based on question content
    explanation = generate_explanation(question_title, correct_answer)
    
    if not question_title or len(options) == 0:
        return None
    
    return {
        'id': question_number,
        'text': question_title,
        'image': image_url,
        'options': options,
        'correctAnswer': correct_answer,
        'explanation': explanation
    }

def generate_explanation(question_text, correct_answer):
    """Generate explanation based on question content"""
    
    # Identify the topic from question text
    topics = {
        'Azure Functions': ['function', 'azure function', 'function app', 'trigger'],
        'Azure App Service': ['app service', 'web app', 'deployment slot'],
        'Azure Storage': ['blob storage', 'storage account', 'azure storage'],
        'Azure Cosmos DB': ['cosmos db', 'nosql', 'cosmos'],
        'Azure Service Bus': ['service bus', 'queue', 'message'],
        'Azure Container': ['container', 'docker', 'kubernetes'],
        'Azure Key Vault': ['key vault', 'secret', 'certificate'],
        'Azure Monitor': ['monitor', 'logging', 'analytics'],
        'Azure API Management': ['api management', 'api gateway'],
        'Azure Event': ['event hub', 'event grid', 'event']
    }
    
    question_lower = question_text.lower()
    identified_topic = "Azure fundamentals"
    
    for topic, keywords in topics.items():
        if any(keyword in question_lower for keyword in keywords):
            identified_topic = topic
            break
    
    return f"This question covers {identified_topic} concepts. The correct answer is based on Azure best practices and service capabilities."

if __name__ == "__main__":
    if not os.path.exists('README.md'):
        print("README.md file not found in current directory")
    else:
        questions = parse_questions_from_readme()
        print(f"Successfully parsed {len(questions)} questions and saved to questions.json")
