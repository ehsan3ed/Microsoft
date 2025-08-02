<<<<<<< HEAD
# Niki - AI Coding Assistant

A powerful VS Code extension that provides AI-powered coding assistance using both cloud and local language models.

## Features

- 🤖 **Multi-Model Support**: Works with cloud models (OpenAI, Anthropic, Google, Azure) and local models (Ollama, LM Studio, Text Generation WebUI)
- 💬 **Interactive Chat**: Built-in chat interface for real-time AI assistance
- 🔍 **Code Analysis**: Analyze and explain selected code
- 🔧 **Code Refactoring**: Get AI-powered code refactoring suggestions
- ⚡ **Code Generation**: Generate code based on natural language descriptions
- 🐛 **Bug Fixing**: Identify and fix code issues automatically
- ⚙️ **Easy Setup**: Simple configuration for both cloud and local models

## Quick Start

### Installation

1. Install the extension from VS Code Marketplace
2. Configure your AI models (see Configuration section)
3. Start coding with AI assistance!

### Usage

- **Chat with AI**: Press `Ctrl+Shift+I` to open the AI chat panel
- **Ask AI**: Press `Ctrl+Shift+A` to ask questions about your code
- **Explain Code**: Select code and press `Ctrl+Shift+E` to get explanations
- **Refactor Code**: Select code and press `Ctrl+Shift+R` to get refactoring suggestions

## Configuration

### Cloud Models

1. Get an API key from your preferred provider:
   - OpenAI: https://platform.openai.com/
   - Anthropic: https://console.anthropic.com/
   - Google: https://makersuite.google.com/
   - Azure OpenAI: https://azure.microsoft.com/

2. Open VS Code settings and configure:
   ```json
   {
     "nikiAI.cloudApiKey": "your-api-key",
     "nikiAI.cloudProvider": "openai",
     "nikiAI.useLocal": false
   }
   ```

### Local Models

1. Install a local AI server:
   - **Ollama** (Recommended): https://ollama.ai/
   - **LM Studio**: https://lmstudio.ai/
   - **Text Generation WebUI**: https://github.com/oobabooga/text-generation-webui

2. Install a coding model:
   ```bash
   # For Ollama
   ollama pull deepseek-coder-v2
   ollama pull codellama:13b
   ollama pull wizardcoder:7b
   ```

3. Configure VS Code settings:
   ```json
   {
     "nikiAI.localApiUrl": "http://localhost:11434",
     "nikiAI.localModel": "deepseek-coder-v2",
     "nikiAI.useLocal": true
   }
   ```

## Supported Models

### Cloud Models
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude-3, Claude-2
- **Google**: Gemini Pro, Gemini Flash
- **Azure OpenAI**: GPT-4, GPT-3.5-turbo

### Local Models
- **DeepSeek Coder v2**: Excellent coding performance
- **CodeLlama**: Meta's coding model (7B, 13B, 34B variants)
- **WizardCoder**: Specialized for code generation
- **Phind-CodeLlama**: Enhanced CodeLlama variant

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| Ask Niki AI Assistant | `Ctrl+Shift+A` | Ask questions about your code |
| Explain Selected Code | `Ctrl+Shift+E` | Get explanations for selected code |
| Refactor Selected Code | `Ctrl+Shift+R` | Get refactoring suggestions |
| Generate Code | Command Palette | Generate code from description |
| Fix Code Issues | Command Palette | Identify and fix bugs |
| Setup AI Models | Command Palette | Configure AI models |
| Focus Chat | `Ctrl+Shift+I` | Open AI chat panel |

## Requirements

- VS Code 1.74.0 or higher
- Node.js (for local models)
- Internet connection (for cloud models)

## Development

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Setup
```bash
git clone <repository-url>
cd niki-ai-assistant
npm install
npm run compile
```

### Testing
```bash
npm test
```

### Building
```bash
npm run compile
npx vsce package
```

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Website**: https://pandenik.com
- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: See the wiki for detailed guides

## Changelog

### v0.1.0
- Initial release
- Support for cloud and local AI models
- Interactive chat interface
- Code analysis and refactoring features
- Multi-language support

---

**Made with ❤️ by [Pandenik](https://pandenik.com)** 
=======
# Microsoft
>>>>>>> 16932df270d6cfba6532b6b92e56a582ba26865f
