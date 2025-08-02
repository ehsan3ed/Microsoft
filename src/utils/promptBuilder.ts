import { CodeContext, CodeIssue } from './codeAnalyzer';

export class PromptBuilder {
    buildExplainPrompt(code: string, language: string, context: CodeContext): string {
        return `Please explain the following ${language} code in detail:

\`\`\`${language}
${code}
\`\`\`

Context:
- File type: ${context.fileType}
- Imports: ${context.imports.join(', ') || 'None'}
- Functions in file: ${context.functions.length}
- Classes in file: ${context.classes.length}

Please provide:
1. A clear explanation of what this code does
2. How it works step by step
3. Any important concepts or patterns used
4. Potential improvements or considerations

Make your explanation beginner-friendly but comprehensive.`;
    }

    buildRefactorPrompt(code: string, language: string, context: CodeContext, refactorType: string): string {
        return `Please refactor the following ${language} code to ${refactorType.toLowerCase()}:

\`\`\`${language}
${code}
\`\`\`

Context:
- File type: ${context.fileType}
- Imports: ${context.imports.join(', ') || 'None'}
- Functions in file: ${context.functions.join(', ') || 'None'}
- Classes in file: ${context.classes.join(', ') || 'None'}

Refactoring requirements:
- Focus on: ${refactorType}
- Maintain the same functionality
- Follow ${language} best practices
- Make the code more readable and maintainable

Please provide only the refactored code without explanations, as I will apply it directly to the editor.`;
    }

    buildGeneratePrompt(description: string, language: string): string {
        return `Please generate ${language} code for the following requirement:

Description: ${description}

Requirements:
- Use ${language} best practices
- Include proper error handling where appropriate
- Add comments to explain complex logic
- Make the code readable and maintainable
- Follow ${language} naming conventions

Please provide only the code without explanations, as I will insert it directly into the editor.`;
    }

    buildFixPrompt(code: string, language: string, context: CodeContext, issues: CodeIssue[]): string {
        const issuesText = issues.map(issue =>
            `- ${issue.type.toUpperCase()}: ${issue.message}${issue.line ? ` (line ${issue.line})` : ''}`
        ).join('\n');

        return `Please fix the following ${language} code issues:

\`\`\`${language}
${code}
\`\`\`

Context:
- File type: ${context.fileType}
- Imports: ${context.imports.join(', ') || 'None'}

Issues found:
${issuesText || 'No specific issues detected, but please review for general improvements'}

Please provide the corrected code that:
1. Fixes all identified issues
2. Maintains the original functionality
3. Follows ${language} best practices
4. Improves code quality and readability

Please provide only the fixed code without explanations, as I will apply it directly to the editor.`;
    }

    buildOptimizationPrompt(code: string, language: string, context: CodeContext): string {
        return `Please optimize the following ${language} code for better performance:

\`\`\`${language}
${code}
\`\`\`

Context:
- File type: ${context.fileType}
- Imports: ${context.imports.join(', ') || 'None'}

Optimization requirements:
- Improve performance (speed, memory usage)
- Maintain the same functionality
- Follow ${language} best practices
- Consider algorithmic improvements
- Optimize data structures if applicable

Please provide the optimized code with brief comments explaining the key optimizations made.`;
    }

    buildDocumentationPrompt(code: string, language: string, context: CodeContext): string {
        return `Please add comprehensive documentation to the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Context:
- File type: ${context.fileType}
- Imports: ${context.imports.join(', ') || 'None'}

Documentation requirements:
- Add function/class docstrings in ${language} standard format
- Include parameter descriptions and return types
- Add inline comments for complex logic
- Explain the purpose and usage of the code
- Follow ${language} documentation conventions

Please provide the documented code with clear, professional documentation.`;
    }

    buildTestingPrompt(code: string, language: string, context: CodeContext): string {
        return `Please generate comprehensive tests for the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Context:
- File type: ${context.fileType}
- Imports: ${context.imports.join(', ') || 'None'}

Testing requirements:
- Generate unit tests for all functions/classes
- Include edge cases and error conditions
- Use appropriate ${language} testing framework
- Ensure good test coverage
- Follow testing best practices

Please provide the test code with clear test descriptions and assertions.`;
    }

    buildSecurityPrompt(code: string, language: string, context: CodeContext): string {
        return `Please review and improve the security of the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Context:
- File type: ${context.fileType}
- Imports: ${context.imports.join(', ') || 'None'}

Security review requirements:
- Identify potential security vulnerabilities
- Suggest security improvements
- Implement input validation where needed
- Follow ${language} security best practices
- Consider common attack vectors

Please provide the security-improved code with explanations of the security measures implemented.`;
    }

    buildMigrationPrompt(code: string, sourceLanguage: string, targetLanguage: string): string {
        return `Please migrate the following ${sourceLanguage} code to ${targetLanguage}:

\`\`\`${sourceLanguage}
${code}
\`\`\`

Migration requirements:
- Maintain the same functionality
- Follow ${targetLanguage} best practices and conventions
- Use appropriate ${targetLanguage} libraries and frameworks
- Handle language-specific features appropriately
- Ensure the migrated code is idiomatic ${targetLanguage}

Please provide the migrated code with brief explanations of key changes made during the migration.`;
    }

    buildCodeReviewPrompt(code: string, language: string, context: CodeContext): string {
        return `Please perform a comprehensive code review of the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Context:
- File type: ${context.fileType}
- Imports: ${context.imports.join(', ') || 'None'}

Review requirements:
- Analyze code quality and structure
- Identify potential bugs and issues
- Suggest improvements for readability and maintainability
- Check for performance optimizations
- Review security considerations
- Assess adherence to ${language} best practices

Please provide a detailed review with specific recommendations and examples.`;
    }
} 