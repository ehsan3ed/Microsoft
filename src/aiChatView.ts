import * as vscode from 'vscode';
import { AIService } from './services/aiService';

export class AIChatView implements vscode.WebviewViewProvider {
    public static readonly viewType = 'niki-1.chat';
    private _view?: vscode.WebviewView;
    private _aiService: AIService;

    constructor() {
        this._aiService = new AIService();
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: []
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'sendMessage':
                        this._handleUserMessage(message.text);
                        break;
                }
            }
        );
    }

    private async _handleUserMessage(message: string) {
        if (!this._view) return;

        // Add user message to chat
        this._view.webview.postMessage({
            command: 'addMessage',
            type: 'user',
            text: message
        });

        try {
            // Get AI response
            const response = await this._aiService.askQuestion(message);

            // Add AI response to chat
            this._view.webview.postMessage({
                command: 'addMessage',
                type: 'ai',
                text: response
            });
        } catch (error) {
            // Add error message
            this._view.webview.postMessage({
                command: 'addMessage',
                type: 'error',
                text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Chat</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
            padding: 10px;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .chat-container {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 10px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            padding: 10px;
        }
        
        .message {
            margin-bottom: 10px;
            padding: 8px;
            border-radius: 4px;
        }
        
        .message.user {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            margin-left: 20px;
        }
        
        .message.ai {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            margin-right: 20px;
        }
        
        .message.error {
            background-color: var(--vscode-errorForeground);
            color: var(--vscode-editor-background);
        }
        
        .input-container {
            display: flex;
            gap: 5px;
        }
        
        #messageInput {
            flex: 1;
            padding: 8px;
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
        }
        
        #sendButton {
            padding: 8px 16px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        #sendButton:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        pre {
            background-color: var(--vscode-textBlockQuote-background);
            padding: 8px;
            border-radius: 4px;
            overflow-x: auto;
            white-space: pre-wrap;
        }
        
        code {
            background-color: var(--vscode-textCodeBlock-background);
            padding: 2px 4px;
            border-radius: 2px;
        }
    </style>
</head>
<body>
    <div class="chat-container" id="chatContainer">
        <div class="message ai">
            <strong>AI Assistant:</strong> Hello! I'm your AI coding assistant. How can I help you today?
        </div>
    </div>
    
    <div class="input-container">
        <input type="text" id="messageInput" placeholder="Type your message here..." />
        <button id="sendButton">Send</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const chatContainer = document.getElementById('chatContainer');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');

        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                vscode.postMessage({
                    command: 'sendMessage',
                    text: message
                });
                messageInput.value = '';
            }
        }

        function addMessage(type, text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${type}\`;
            
            const prefix = type === 'user' ? 'You:' : type === 'ai' ? 'AI Assistant:' : 'Error:';
            messageDiv.innerHTML = \`<strong>\${prefix}</strong> \${text}\`;
            
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // Event listeners
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'addMessage':
                    addMessage(message.type, message.text);
                    break;
            }
        });

        // Focus input on load
        messageInput.focus();
    </script>
</body>
</html>`;
    }
} 