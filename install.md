# Installation Guide for AI Coding Assistant

## Quick Start

### Option 1: Install from VSIX (Recommended)

1. **Download the extension**:
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd ai-coding-assistant
   
   # Install dependencies
   npm install
   
   # Build the extension
   npm run compile
   
   # Package the extension
   npx vsce package
   ```

2. **Install in VS Code**:
   - Open VS Code
   - Press `Ctrl+Shift+X` to open Extensions
   - Click the "..." menu (three dots)
   - Select "Install from VSIX..."
   - Choose the generated `ai-coding-assistant-0.1.0.vsix` file

### Option 2: Development Installation

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd ai-coding-assistant
   npm install
   npm run compile
   ```

2. **Run in development mode**:
   - Open the project in VS Code
   - Press `F5` to launch Extension Development Host
   - The extension will be loaded in the new window

## Configuration

### Step 1: Choose Your AI Provider

#### Cloud Models (Recommended for beginners)

**OpenAI (GPT-3.5/4)**:
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. In VS Code, go to Settings (`Ctrl+,`)
3. Search for "ai coding assistant"
4. Set:
   - `aiCodingAssistant.useLocal`: `false`
   - `aiCodingAssistant.cloudProvider`: `openai`
   - `aiCodingAssistant.cloudApiKey`: `your-api-key-here`

**Anthropic (Claude)**:
1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Set:
   - `aiCodingAssistant.useLocal`: `false`
   - `aiCodingAssistant.cloudProvider`: `anthropic`
   - `aiCodingAssistant.cloudApiKey`: `your-api-key-here`

**Google (Gemini)**:
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set:
   - `aiCodingAssistant.useLocal`: `false`
   - `aiCodingAssistant.cloudProvider`: `google`
   - `aiCodingAssistant.cloudApiKey`: `your-api-key-here`

#### Local Models (Advanced users)

**Ollama (Recommended for local)**:
1. Install Ollama:
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows
   # Download from https://ollama.ai/download
   ```

2. Pull a coding model:
   ```bash
   ollama pull codellama
   # or
   ollama pull llama2
   # or
   ollama pull mistral
   ```

3. Start Ollama:
   ```bash
   ollama serve
   ```

4. Configure VS Code:
   - Set `aiCodingAssistant.useLocal`: `true`
   - Set `aiCodingAssistant.localApiUrl`: `http://localhost:11434`
   - Set `aiCodingAssistant.localModel`: `codellama`

**LM Studio**:
1. Download from [LM Studio](https://lmstudio.ai/)
2. Load a model and start local server
3. Set:
   - `aiCodingAssistant.useLocal`: `true`
   - `aiCodingAssistant.localApiUrl`: `http://localhost:1234`

### Step 2: Test Configuration

1. Open VS Code
2. Press `Ctrl+Shift+P` to open command palette
3. Type "Setup AI Models" and select it
4. Follow the setup wizard
5. Test with a simple question using `Ctrl+Shift+A`

## Usage Examples

### Basic Usage

1. **Ask a question**:
   - Press `Ctrl+Shift+A`
   - Type: "How do I implement a binary search in Python?"
   - Get instant AI response

2. **Explain code**:
   - Select code in editor
   - Press `Ctrl+Shift+E`
   - Get detailed explanation

3. **Refactor code**:
   - Select code in editor
   - Press `Ctrl+Shift+R`
   - Choose refactoring type
   - Apply improvements

### Advanced Usage

**Code Generation**:
```
Command: Generate Code
Description: "A React hook for managing form state with validation"
Language: TypeScript
```

**Code Review**:
```
Command: Fix Code Issues
Selected Code: Any code with potential issues
Result: AI suggests improvements and fixes
```

## Troubleshooting

### Common Issues

**"API key not configured"**:
- Check your API key in VS Code settings
- Verify the key is valid and has credits
- Ensure the provider is correctly set

**"Unable to reach local API"**:
- Verify your local server is running
- Check the API URL in settings
- Ensure the model is loaded

**"Extension not responding"**:
- Check VS Code developer console (`Help > Toggle Developer Tools`)
- Restart VS Code
- Verify all dependencies are installed

### Performance Tips

1. **For faster responses**:
   - Use cloud models (they're generally faster)
   - Use smaller local models
   - Ensure good internet connection

2. **For privacy**:
   - Use local models
   - Don't send sensitive code to cloud APIs

3. **For cost optimization**:
   - Use local models for development
   - Use cloud models for complex tasks
   - Monitor API usage

## Model Recommendations

### Cloud Models
- **OpenAI GPT-4**: Best overall performance, good for complex tasks
- **OpenAI GPT-3.5**: Good balance of speed and quality
- **Anthropic Claude**: Excellent for code explanation and reasoning
- **Google Gemini**: Good for general coding tasks

### Local Models
- **CodeLlama**: Excellent for code generation and understanding
- **Llama2**: Good general-purpose model
- **Mistral**: Fast and efficient
- **Phi-2**: Small but capable model

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Code Privacy**: Be careful with sensitive code when using cloud models
3. **Local Models**: Use local models for proprietary or sensitive code
4. **Network**: Ensure secure connections when using cloud APIs

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the README.md file
3. Check VS Code developer console for errors
4. Create an issue on the GitHub repository

## Updates

To update the extension:

1. Download the latest version
2. Uninstall the current version
3. Install the new version
4. Your settings will be preserved

---

**Happy Coding!** 🚀

The AI Coding Assistant is designed to make your development workflow more efficient and enjoyable. Start with simple questions and gradually explore more advanced features as you become comfortable with the tool. 