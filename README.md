<!-- 🔰 Niki ‑ AI – AI Code Assistant for VS Code 🔰 -->

# 🎯 Niki‑AI – AI Code Assistant for VS Code

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)  
[![Version: v0.1.0](https://img.shields.io/badge/Version-v0.1.0-brightgreen)](#📝-changelog)  
[![Model Support](https://img.shields.io/badge/Model-Cloud%20%7C%20Local-lightgrey)](https://github.com/ehsan3ed/Niki-AI)  
[![Contributions Welcome](https://img.shields.io/badge/Contribute-welcome-blue)](CONTRIBUTING.md)

> ⚡ A fast and powerful VS Code extension powered by both cloud and local AI models—designed to help you write, explain, refactor, and fix code more efficiently.

---

## 📋 Table of Contents

- [🎯 What is Niki‑AI?](#-what-is-niki-ai)  
- [✨ Features](#-features)  
- [⚙️ Quick Start](#-quick-start)  
- [📦 Configuration](#-configuration)  
  - ☁️ Cloud Models  
  - 🖥️ Local Models  
- [🛠️ How to Use](#-how-to-use)  
- [📚 Supported AI Models](#-supported-ai-models)  
- [👥 Contributing](#-contributing)  
- [📜 License](#-license)  
- [📝 Changelog](#-changelog)  
- [📞 Contact](#-contact)  

---

## 🎯 What is Niki‑AI?

**Niki‑AI** is a Visual Studio Code extension that integrates AI-powered coding assistance—both from cloud APIs (like OpenAI or Google) and local models (like Ollama or CodeLlama)—directly into your coding workflow.  
It helps you:

- Generate code from natural language  
- Explain and analyze selected code  
- Refactor and optimize your codebase  
- Automatically detect and fix bugs  
- Engage in an in-editor chat with an AI assistant

---

## ✨ Features

- **Multi-Model Support** – Compatible with major cloud (OpenAI, Anthropic, Google Gemini, Azure AI) and local (Ollama, LM Studio, Text Generation WebUI) models  
- **Interactive Chat** – Use `Ctrl + Shift + I` to chat with AI in VS Code  
- **Code Analysis & Explanation** – Select code and get instant AI insights  
- **AI-Powered Refactoring** – Smart refactoring suggestions (shortcut: `Ctrl + Shift + R`)  
- **Code Generation** – Describe your idea and let AI generate working code  
- **Bug Detection & Fixing** – Let the AI identify code issues and propose fixes  
- **Zero‑Config Friendly Setup** – Extendable default settings with optional `.json` configuration  

---

## ⚙️ Quick Start

1. Install **Niki‑AI** from the VS Code Marketplace  
2. Configure your preferred model (cloud or local)  
3. Start coding with AI assistance using the shortcuts below

---

## 📦 Configuration

### ☁️ Cloud Models

1. Obtain an API key from your provider:
   - OpenAI: `https://platform.openai.com/`  
   - Anthropic: `https://console.anthropic.com/`  
   - Google Gemini: `https://makersuite.google.com/`  
   - Azure: `https://azure.microsoft.com/`

2. Add this into your `settings.json`:
   ```json
   {
     "nikiAI.useLocal": false,
     "nikiAI.cloudProvider": "openai",
     "nikiAI.cloudApiKey": "YOUR_API_KEY"
   }

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


📚 Supported AI Models
☁️ Cloud Models
OpenAI: GPT‑4, GPT‑3.5‑turbo

Anthropic: Claude‑3, Claude‑2

Google Gemini: Pro, Flash

Azure OpenAI: GPT‑4, GPT‑3.5‑turbo

🖥️ Local Models
DeepSeek Coder v2 – High-performance code AI

CodeLlama – Lightweight models (7B/13B/34B)

WizardCoder – Specialized for code generation

Phind‑CodeLlama – Enhanced CodeLlama variant



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
- **Email**: Ehsan3ed@yahoo.com
- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: See the wiki for detailed guides

## Changelog


v0.1.0 – Initial Release
✅ Support for both cloud and local AI models

✅ AI-powered code generation, refactoring, explanation

✅ Interactive chat assistant in VS Code

✅ Bug detection and auto-fix capabilities

✅ Multi-provider API support


---
📞 Contact
🌐 Website: https://pandenik.com
 **Email**: Ehsan3ed@yahoo.com
🐞 Report issues: GitHub Issues

📬 Maintainer: Ehsan Saeeidi (Pandenik)
#امیدوارم با این قبیل پروژه ها عبور از تحریمهای تکنولوژی آسونتر بشه#

Made with ❤️ by Ehsan Saeeidi (Pandenik)
=======
# Microsoft
>>>>>>> 16932df270d6cfba6532b6b92e56a582ba26865f
