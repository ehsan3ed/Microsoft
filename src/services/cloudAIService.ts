import * as vscode from 'vscode';
import axios from 'axios';

interface CloudProvider {
    name: string;
    apiUrl: string;
    model: string;
    headers: (apiKey: string) => Record<string, string>;
    body: (prompt: string, config: any) => any;
}

export class CloudAIService {
    private providers: Record<string, CloudProvider> = {
        openai: {
            name: 'OpenAI',
            apiUrl: 'https://api.openai.com/v1/chat/completions',
            model: 'gpt-3.5-turbo',
            headers: (apiKey: string) => ({
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }),
            body: (prompt: string, config: any) => ({
                model: config.model || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful coding assistant. Provide clear, concise, and accurate responses.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: config.maxTokens || 2000,
                temperature: config.temperature || 0.7
            })
        },
        anthropic: {
            name: 'Anthropic',
            apiUrl: 'https://api.anthropic.com/v1/messages',
            model: 'claude-3-sonnet-20240229',
            headers: (apiKey: string) => ({
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            }),
            body: (prompt: string, config: any) => ({
                model: config.model || 'claude-3-sonnet-20240229',
                max_tokens: config.maxTokens || 2000,
                temperature: config.temperature || 0.7,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        },
        google: {
            name: 'Google',
            apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            model: 'gemini-pro',
            headers: (apiKey: string) => ({
                'Content-Type': 'application/json'
            }),
            body: (prompt: string, config: any) => ({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: config.maxTokens || 2000,
                    temperature: config.temperature || 0.7
                }
            })
        },
        azure: {
            name: 'Azure OpenAI',
            apiUrl: 'https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/chat/completions?api-version=2023-05-15',
            model: 'gpt-35-turbo',
            headers: (apiKey: string) => ({
                'api-key': apiKey,
                'Content-Type': 'application/json'
            }),
            body: (prompt: string, config: any) => ({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful coding assistant. Provide clear, concise, and accurate responses.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: config.maxTokens || 2000,
                temperature: config.temperature || 0.7
            })
        }
    };

    async askQuestion(question: string): Promise<string> {
        const config = vscode.workspace.getConfiguration('aiCodingAssistant');
        const provider = config.get<string>('cloudProvider', 'openai');
        const apiKey = config.get<string>('cloudApiKey', '');
        const maxTokens = config.get<number>('maxTokens', 2000);
        const temperature = config.get<number>('temperature', 0.7);

        if (!apiKey) {
            throw new Error(`API key not configured for ${provider}. Please set it in the extension settings.`);
        }

        const providerConfig = this.providers[provider];
        if (!providerConfig) {
            throw new Error(`Unsupported provider: ${provider}`);
        }

        try {
            const response = await axios.post(
                providerConfig.apiUrl,
                providerConfig.body(question, { maxTokens, temperature }),
                {
                    headers: providerConfig.headers(apiKey),
                    timeout: 30000
                }
            );

            return this.extractResponse(response.data, provider);
        } catch (error: any) {
            if (error.response) {
                throw new Error(`API Error (${error.response.status}): ${error.response.data?.error?.message || error.response.statusText}`);
            } else if (error.request) {
                throw new Error('Network error: Unable to reach the API server');
            } else {
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }

    private extractResponse(data: any, provider: string): string {
        switch (provider) {
            case 'openai':
            case 'azure':
                return data.choices?.[0]?.message?.content || 'No response generated';
            case 'anthropic':
                return data.content?.[0]?.text || 'No response generated';
            case 'google':
                return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
            default:
                return 'Unknown response format';
        }
    }

    async validateConfiguration(): Promise<boolean> {
        const config = vscode.workspace.getConfiguration('aiCodingAssistant');
        const provider = config.get<string>('cloudProvider', 'openai');
        const apiKey = config.get<string>('cloudApiKey', '');

        if (!apiKey) {
            throw new Error(`API key not configured for ${provider}`);
        }

        if (!this.providers[provider]) {
            throw new Error(`Unsupported provider: ${provider}`);
        }

        // Test the configuration with a simple question
        try {
            await this.askQuestion('Hello, this is a test message.');
            return true;
        } catch (error) {
            throw new Error(`Configuration validation failed: ${error}`);
        }
    }

    getSupportedProviders(): string[] {
        return Object.keys(this.providers);
    }
} 