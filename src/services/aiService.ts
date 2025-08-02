import * as vscode from 'vscode';
import { CloudAIService } from './cloudAIService';
import { LocalAIService } from './localAIService';

export class AIService {
    private cloudService: CloudAIService;
    private localService: LocalAIService;

    constructor() {
        this.cloudService = new CloudAIService();
        this.localService = new LocalAIService();
    }

    async askQuestion(question: string): Promise<string> {
        const config = vscode.workspace.getConfiguration('aiCodingAssistant');
        const useLocal = config.get<boolean>('useLocal', false);

        if (useLocal) {
            return await this.localService.askQuestion(question);
        } else {
            return await this.cloudService.askQuestion(question);
        }
    }

    async validateConfiguration(): Promise<boolean> {
        const config = vscode.workspace.getConfiguration('aiCodingAssistant');
        const useLocal = config.get<boolean>('useLocal', false);

        if (useLocal) {
            return await this.localService.validateConfiguration();
        } else {
            return await this.cloudService.validateConfiguration();
        }
    }

    getCurrentProvider(): string {
        const config = vscode.workspace.getConfiguration('aiCodingAssistant');
        const useLocal = config.get<boolean>('useLocal', false);

        if (useLocal) {
            const localModel = config.get<string>('localModel', 'codellama');
            return `Local (${localModel})`;
        } else {
            const provider = config.get<string>('cloudProvider', 'openai');
            return `Cloud (${provider})`;
        }
    }
} 