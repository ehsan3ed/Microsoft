import * as vscode from 'vscode';
import axios from 'axios';

interface LocalProvider {
    name: string;
    apiUrl: string;
    headers: Record<string, string>;
    body: (prompt: string, config: any) => any;
    extractResponse: (data: any) => string;
}

export class LocalAIService {
    private providers: Record<string, LocalProvider> = {
        ollama: {
            name: 'Ollama',
            apiUrl: '/api/generate',
            headers: {
                'Content-Type': 'application/json'
            },
            body: (prompt: string, config: any) => ({
                model: config.model || 'codellama',
                prompt: prompt,
                stream: false,
                options: {
                    temperature: config.temperature || 0.7,
                    num_predict: config.maxTokens || 2000
                }
            }),
            extractResponse: (data: any) => data.response || 'No response generated'
        },
        lmstudio: {
            name: 'LM Studio',
            apiUrl: '/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json'
            },
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
                temperature: config.temperature || 0.7,
                max_tokens: config.maxTokens || 2000,
                stream: false
            }),
            extractResponse: (data: any) => data.choices?.[0]?.message?.content || 'No response generated'
        },
        textgenerationwebui: {
            name: 'Text Generation WebUI',
            apiUrl: '/api/v1/generate',
            headers: {
                'Content-Type': 'application/json'
            },
            body: (prompt: string, config: any) => ({
                prompt: prompt,
                max_new_tokens: config.maxTokens || 2000,
                temperature: config.temperature || 0.7,
                top_p: 0.9,
                typical_p: 1,
                do_sample: true,
                seed: -1,
                add_bos_token: true,
                ban_eos_token: false,
                skip_special_tokens: true,
                stopping_strings: []
            }),
            extractResponse: (data: any) => data.results?.[0]?.text || 'No response generated'
        },
        oobabooga: {
            name: 'Oobabooga',
            apiUrl: '/api/v1/generate',
            headers: {
                'Content-Type': 'application/json'
            },
            body: (prompt: string, config: any) => ({
                prompt: prompt,
                max_new_tokens: config.maxTokens || 2000,
                temperature: config.temperature || 0.7,
                top_p: 0.9,
                typical_p: 1,
                do_sample: true,
                seed: -1,
                add_bos_token: true,
                ban_eos_token: false,
                skip_special_tokens: true,
                stopping_strings: []
            }),
            extractResponse: (data: any) => data.results?.[0]?.text || 'No response generated'
        }
    };

    async askQuestion(question: string): Promise<string> {
        const config = vscode.workspace.getConfiguration('aiCodingAssistant');
        const localApiUrl = config.get<string>('localApiUrl', 'http://localhost:11434');
        const localModel = config.get<string>('localModel', 'codellama');
        const maxTokens = config.get<number>('maxTokens', 2000);
        const temperature = config.get<number>('temperature', 0.7);

        // Detect provider based on URL
        const provider = this.detectProvider(localApiUrl);
        const providerConfig = this.providers[provider];

        if (!providerConfig) {
            throw new Error(`Unsupported local provider. Supported providers: ${Object.keys(this.providers).join(', ')}`);
        }

        try {
            const fullUrl = `${localApiUrl}${providerConfig.apiUrl}`;
            const response = await axios.post(
                fullUrl,
                providerConfig.body(question, {
                    model: localModel,
                    maxTokens,
                    temperature
                }),
                {
                    headers: providerConfig.headers,
                    timeout: 60000 // Longer timeout for local models
                }
            );

            return providerConfig.extractResponse(response.data);
        } catch (error: any) {
            if (error.response) {
                throw new Error(`Local API Error (${error.response.status}): ${error.response.data?.error || error.response.statusText}`);
            } else if (error.request) {
                throw new Error(`Network error: Unable to reach local API at ${localApiUrl}. Make sure your local model server is running.`);
            } else {
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }

    private detectProvider(apiUrl: string): string {
        const url = apiUrl.toLowerCase();

        if (url.includes('localhost:11434') || url.includes('ollama')) {
            return 'ollama';
        } else if (url.includes('localhost:1234') || url.includes('lmstudio')) {
            return 'lmstudio';
        } else if (url.includes('localhost:7860') || url.includes('textgenerationwebui')) {
            return 'textgenerationwebui';
        } else if (url.includes('localhost:5000') || url.includes('oobabooga')) {
            return 'oobabooga';
        }

        // Default to Ollama if we can't detect
        return 'ollama';
    }

    async validateConfiguration(): Promise<boolean> {
        const config = vscode.workspace.getConfiguration('aiCodingAssistant');
        const localApiUrl = config.get<string>('localApiUrl', 'http://localhost:11434');

        try {
            // Test connection to local API
            const response = await axios.get(localApiUrl, { timeout: 5000 });

            // Test with a simple question
            await this.askQuestion('Hello, this is a test message.');
            return true;
        } catch (error: any) {
            throw new Error(`Local API validation failed: ${error.message}. Make sure your local model server is running at ${localApiUrl}`);
        }
    }

    async getAvailableModels(): Promise<string[]> {
        const config = vscode.workspace.getConfiguration('aiCodingAssistant');
        const localApiUrl = config.get<string>('localApiUrl', 'http://localhost:11434');
        const provider = this.detectProvider(localApiUrl);

        try {
            if (provider === 'ollama') {
                const response = await axios.get(`${localApiUrl}/api/tags`);
                return response.data.models?.map((model: any) => model.name) || [];
            } else if (provider === 'lmstudio') {
                const response = await axios.get(`${localApiUrl}/v1/models`);
                return response.data.data?.map((model: any) => model.id) || [];
            } else {
                // For other providers, return common model names
                return ['codellama', 'llama2', 'mistral', 'phi', 'gemma'];
            }
        } catch (error) {
            console.warn('Could not fetch available models:', error);
            return ['codellama', 'llama2', 'mistral', 'phi', 'gemma'];
        }
    }

    getSupportedProviders(): string[] {
        return Object.keys(this.providers);
    }

    getProviderInfo(provider: string): { name: string; defaultUrl: string; description: string } {
        const info: Record<string, { name: string; defaultUrl: string; description: string }> = {
            ollama: {
                name: 'Ollama',
                defaultUrl: 'http://localhost:11434',
                description: 'Local LLM server with easy model management'
            },
            lmstudio: {
                name: 'LM Studio',
                defaultUrl: 'http://localhost:1234',
                description: 'Desktop app for running local LLMs'
            },
            textgenerationwebui: {
                name: 'Text Generation WebUI',
                defaultUrl: 'http://localhost:7860',
                description: 'Web-based interface for running LLMs'
            },
            oobabooga: {
                name: 'Oobabooga',
                defaultUrl: 'http://localhost:5000',
                description: 'Advanced web UI for running LLMs'
            }
        };

        return info[provider] || {
            name: 'Unknown',
            defaultUrl: 'http://localhost:11434',
            description: 'Unknown local provider'
        };
    }
} 