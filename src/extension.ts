import * as vscode from 'vscode';
import { AIService } from './services/aiService';
import { CloudAIService } from './services/cloudAIService';
import { LocalAIService } from './services/localAIService';
import { CodeAnalyzer } from './utils/codeAnalyzer';
import { PromptBuilder } from './utils/promptBuilder';
import { AIChatView } from './aiChatView';

export function activate(context: vscode.ExtensionContext) {
    console.log('AI Coding Assistant is now active!');

    const aiService = new AIService();
    const codeAnalyzer = new CodeAnalyzer();
    const promptBuilder = new PromptBuilder();

    // Register commands
    const askAICommand = vscode.commands.registerCommand('niki-1.askAI', async () => {
        await handleAskAI(aiService, promptBuilder);
    });

    const explainCodeCommand = vscode.commands.registerCommand('niki-1.explainCode', async () => {
        await handleExplainCode(aiService, codeAnalyzer, promptBuilder);
    });

    const refactorCodeCommand = vscode.commands.registerCommand('niki-1.refactorCode', async () => {
        await handleRefactorCode(aiService, codeAnalyzer, promptBuilder);
    });

    const generateCodeCommand = vscode.commands.registerCommand('niki-1.generateCode', async () => {
        await handleGenerateCode(aiService, promptBuilder);
    });

    const fixCodeCommand = vscode.commands.registerCommand('niki-1.fixCode', async () => {
        await handleFixCode(aiService, codeAnalyzer, promptBuilder);
    });

    const setupModelsCommand = vscode.commands.registerCommand('niki-1.setupModels', async () => {
        await handleSetupModels();
    });

    // Register AI Chat Panel
    const aiChatProvider = new AIChatView();
    const aiChatRegistration = vscode.window.registerWebviewViewProvider(
        AIChatView.viewType,
        aiChatProvider
    );

    // Register focus command for AI Chat
    const focusAIChatCommand = vscode.commands.registerCommand('niki-1.focusChat', () => {
        vscode.commands.executeCommand('workbench.view.extension.niki-1');
    });

    context.subscriptions.push(
        askAICommand,
        explainCodeCommand,
        refactorCodeCommand,
        generateCodeCommand,
        fixCodeCommand,
        setupModelsCommand,
        aiChatRegistration,
        focusAIChatCommand
    );
}

async function handleAskAI(aiService: AIService, promptBuilder: PromptBuilder) {
    const question = await vscode.window.showInputBox({
        prompt: 'Ask your AI assistant:',
        placeHolder: 'e.g., How do I implement a binary search algorithm?'
    });

    if (!question) {
        return;
    }

    await showProgress('Getting AI response...', async () => {
        try {
            const response = await aiService.askQuestion(question);
            await showResponse(response, 'AI Response');
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });
}

async function handleExplainCode(aiService: AIService, codeAnalyzer: CodeAnalyzer, promptBuilder: PromptBuilder) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection);

    if (!code.trim()) {
        vscode.window.showErrorMessage('Please select some code to explain');
        return;
    }

    const language = editor.document.languageId;
    const context = codeAnalyzer.getCodeContext(editor.document, selection);

    await showProgress('Analyzing code...', async () => {
        try {
            const prompt = promptBuilder.buildExplainPrompt(code, language, context);
            const response = await aiService.askQuestion(prompt);
            await showResponse(response, 'Code Explanation');
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });
}

async function handleRefactorCode(aiService: AIService, codeAnalyzer: CodeAnalyzer, promptBuilder: PromptBuilder) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection);

    if (!code.trim()) {
        vscode.window.showErrorMessage('Please select some code to refactor');
        return;
    }

    const language = editor.document.languageId;
    const context = codeAnalyzer.getCodeContext(editor.document, selection);

    const refactorType = await vscode.window.showQuickPick([
        'Improve readability',
        'Optimize performance',
        'Fix code smells',
        'Apply design patterns',
        'Custom refactoring'
    ], {
        placeHolder: 'Select refactoring type'
    });

    if (!refactorType) {
        return;
    }

    await showProgress('Refactoring code...', async () => {
        try {
            const prompt = promptBuilder.buildRefactorPrompt(code, language, context, refactorType);
            const response = await aiService.askQuestion(prompt);

            const applyRefactor = await vscode.window.showInformationMessage(
                'Refactored code generated. Would you like to apply it?',
                'Apply', 'Cancel'
            );

            if (applyRefactor === 'Apply') {
                await editor.edit(editBuilder => {
                    editBuilder.replace(selection, response);
                });
            } else {
                await showResponse(response, 'Refactored Code');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });
}

async function handleGenerateCode(aiService: AIService, promptBuilder: PromptBuilder) {
    const description = await vscode.window.showInputBox({
        prompt: 'Describe the code you want to generate:',
        placeHolder: 'e.g., A function to sort an array using quicksort algorithm'
    });

    if (!description) {
        return;
    }

    const language = await vscode.window.showQuickPick([
        'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'php', 'ruby'
    ], {
        placeHolder: 'Select programming language'
    });

    if (!language) {
        return;
    }

    await showProgress('Generating code...', async () => {
        try {
            const prompt = promptBuilder.buildGeneratePrompt(description, language);
            const response = await aiService.askQuestion(prompt);

            const insertCode = await vscode.window.showInformationMessage(
                'Code generated. Would you like to insert it?',
                'Insert', 'Cancel'
            );

            if (insertCode === 'Insert') {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    await editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.active, response);
                    });
                }
            } else {
                await showResponse(response, 'Generated Code');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });
}

async function handleFixCode(aiService: AIService, codeAnalyzer: CodeAnalyzer, promptBuilder: PromptBuilder) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection);

    if (!code.trim()) {
        vscode.window.showErrorMessage('Please select some code to fix');
        return;
    }

    const language = editor.document.languageId;
    const context = codeAnalyzer.getCodeContext(editor.document, selection);
    const issues = codeAnalyzer.analyzeCode(code, language);

    await showProgress('Analyzing and fixing code...', async () => {
        try {
            const prompt = promptBuilder.buildFixPrompt(code, language, context, issues);
            const response = await aiService.askQuestion(prompt);

            const applyFix = await vscode.window.showInformationMessage(
                'Code fixes generated. Would you like to apply them?',
                'Apply', 'Cancel'
            );

            if (applyFix === 'Apply') {
                await editor.edit(editBuilder => {
                    editBuilder.replace(selection, response);
                });
            } else {
                await showResponse(response, 'Fixed Code');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });
}

async function handleSetupModels() {
    const useLocal = await vscode.window.showQuickPick(['Cloud Models', 'Local Models'], {
        placeHolder: 'Select model type'
    });

    if (useLocal === 'Local Models') {
        await vscode.workspace.getConfiguration('aiCodingAssistant').update('useLocal', true);

        const localUrl = await vscode.window.showInputBox({
            prompt: 'Enter local API URL:',
            value: 'http://localhost:11434',
            placeHolder: 'http://localhost:11434'
        });

        if (localUrl) {
            await vscode.workspace.getConfiguration('aiCodingAssistant').update('localApiUrl', localUrl);
        }

        const localModel = await vscode.window.showInputBox({
            prompt: 'Enter local model name:',
            value: 'codellama',
            placeHolder: 'codellama'
        });

        if (localModel) {
            await vscode.workspace.getConfiguration('aiCodingAssistant').update('localModel', localModel);
        }

        vscode.window.showInformationMessage('Local models configured successfully!');
    } else if (useLocal === 'Cloud Models') {
        await vscode.workspace.getConfiguration('aiCodingAssistant').update('useLocal', false);

        const provider = await vscode.window.showQuickPick(['openai', 'anthropic', 'google', 'azure'], {
            placeHolder: 'Select cloud provider'
        });

        if (provider) {
            await vscode.workspace.getConfiguration('aiCodingAssistant').update('cloudProvider', provider);
        }

        const apiKey = await vscode.window.showInputBox({
            prompt: `Enter ${provider} API key:`,
            password: true
        });

        if (apiKey) {
            await vscode.workspace.getConfiguration('aiCodingAssistant').update('cloudApiKey', apiKey);
        }

        vscode.window.showInformationMessage('Cloud models configured successfully!');
    }
}

async function showProgress(message: string, task: () => Promise<void>) {
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: message,
        cancellable: false
    }, async (progress) => {
        await task();
    });
}

async function showResponse(response: string, title: string) {
    const document = await vscode.workspace.openTextDocument({
        content: response,
        language: 'markdown'
    });

    await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
}

export function deactivate() { } 