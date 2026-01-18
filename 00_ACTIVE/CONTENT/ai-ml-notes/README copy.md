# ChatGPT Agent

A simple, interactive ChatGPT agent built with Python and OpenAI's API.

## Features

- 🤖 Interactive chat interface
- 💾 Save and load conversation history
- 🔄 Reset conversation context
- ⚙️ Configurable model and parameters
- 🛡️ Error handling and validation

## Installation

1. Install dependencies:
```bash
pip3 install -r requirements.txt
```

2. Set up your OpenAI API key:
```bash
# Option 1: Environment variable
export OPENAI_API_KEY="your-api-key-here"

# Option 2: Create .env file
cp .env.example .env
# Edit .env and add your API key
```

## Usage

### Interactive Mode
```bash
python3 chatgpt_agent.py
```

### Programmatic Usage
```python
from chatgpt_agent import ChatGPTAgent

# Initialize agent
agent = ChatGPTAgent(api_key="your-api-key")

# Set system behavior
agent.add_system_message("You are a helpful coding assistant.")

# Chat
response = agent.chat("How do I create a Python function?")
print(response)

# Save conversation
agent.save_conversation("my_conversation.json")
```

## Commands

- `quit`, `exit`, `bye` - End conversation
- `reset` - Clear conversation history
- `save <filename>` - Save conversation to file
- `load <filename>` - Load conversation from file

## Configuration

You can customize the agent by modifying:
- Model: Change `model` parameter (e.g., "gpt-4", "gpt-3.5-turbo")
- Temperature: Adjust creativity (0.0 to 1.0)
- Max tokens: Control response length

## Requirements

- Python 3.7+
- OpenAI API key
- Internet connection

## License

MIT License