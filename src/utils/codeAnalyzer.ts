import * as vscode from 'vscode';

export interface CodeIssue {
    type: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
    column?: number;
}

export interface CodeContext {
    imports: string[];
    functions: string[];
    classes: string[];
    variables: string[];
    fileType: string;
    projectStructure?: string;
}

export class CodeAnalyzer {
    analyzeCode(code: string, language: string): CodeIssue[] {
        const issues: CodeIssue[] = [];

        // Basic syntax checks
        this.checkBasicSyntax(code, language, issues);

        // Language-specific checks
        switch (language) {
            case 'javascript':
            case 'typescript':
                this.checkJavaScriptTypeScript(code, issues);
                break;
            case 'python':
                this.checkPython(code, issues);
                break;
            case 'java':
                this.checkJava(code, issues);
                break;
            case 'csharp':
                this.checkCSharp(code, issues);
                break;
        }

        return issues;
    }

    getCodeContext(document: vscode.TextDocument, selection: vscode.Selection): CodeContext {
        const fullText = document.getText();
        const language = document.languageId;

        return {
            imports: this.extractImports(fullText, language),
            functions: this.extractFunctions(fullText, language),
            classes: this.extractClasses(fullText, language),
            variables: this.extractVariables(fullText, language),
            fileType: language,
            projectStructure: this.getProjectStructure(document.uri)
        };
    }

    private checkBasicSyntax(code: string, language: string, issues: CodeIssue[]): void {
        // Check for common issues
        const lines = code.split('\n');

        lines.forEach((line, index) => {
            const lineNumber = index + 1;

            // Check for empty lines with spaces
            if (line.trim() === '' && line.length > 0) {
                issues.push({
                    type: 'warning',
                    message: 'Empty line contains whitespace',
                    line: lineNumber
                });
            }

            // Check for very long lines
            if (line.length > 120) {
                issues.push({
                    type: 'warning',
                    message: 'Line is too long (consider breaking it)',
                    line: lineNumber
                });
            }
        });
    }

    private checkJavaScriptTypeScript(code: string, issues: CodeIssue[]): void {
        const lines = code.split('\n');

        lines.forEach((line, index) => {
            const lineNumber = index + 1;

            // Check for console.log statements (common debugging code)
            if (line.includes('console.log(') && !line.includes('//')) {
                issues.push({
                    type: 'info',
                    message: 'Consider removing console.log statements in production code',
                    line: lineNumber
                });
            }

            // Check for var usage (suggest let/const)
            if (line.match(/\bvar\s+\w+/)) {
                issues.push({
                    type: 'warning',
                    message: 'Consider using let or const instead of var',
                    line: lineNumber
                });
            }

            // Check for == instead of ===
            if (line.includes(' == ') && !line.includes('//')) {
                issues.push({
                    type: 'warning',
                    message: 'Consider using === for strict equality comparison',
                    line: lineNumber
                });
            }
        });
    }

    private checkPython(code: string, issues: CodeIssue[]): void {
        const lines = code.split('\n');

        lines.forEach((line, index) => {
            const lineNumber = index + 1;

            // Check for print statements (common debugging code)
            if (line.includes('print(') && !line.includes('#')) {
                issues.push({
                    type: 'info',
                    message: 'Consider using logging instead of print statements',
                    line: lineNumber
                });
            }

            // Check for bare except clauses
            if (line.trim().startsWith('except:')) {
                issues.push({
                    type: 'warning',
                    message: 'Bare except clause catches all exceptions - consider being more specific',
                    line: lineNumber
                });
            }
        });
    }

    private checkJava(code: string, issues: CodeIssue[]): void {
        const lines = code.split('\n');

        lines.forEach((line, index) => {
            const lineNumber = index + 1;

            // Check for System.out.println (common debugging code)
            if (line.includes('System.out.println(') && !line.includes('//')) {
                issues.push({
                    type: 'info',
                    message: 'Consider using a proper logging framework instead of System.out.println',
                    line: lineNumber
                });
            }
        });
    }

    private checkCSharp(code: string, issues: CodeIssue[]): void {
        const lines = code.split('\n');

        lines.forEach((line, index) => {
            const lineNumber = index + 1;

            // Check for Console.WriteLine (common debugging code)
            if (line.includes('Console.WriteLine(') && !line.includes('//')) {
                issues.push({
                    type: 'info',
                    message: 'Consider using a proper logging framework instead of Console.WriteLine',
                    line: lineNumber
                });
            }
        });
    }

    private extractImports(code: string, language: string): string[] {
        const imports: string[] = [];
        const lines = code.split('\n');

        lines.forEach(line => {
            const trimmed = line.trim();

            switch (language) {
                case 'javascript':
                case 'typescript':
                    if (trimmed.startsWith('import ') || trimmed.startsWith('require(')) {
                        imports.push(trimmed);
                    }
                    break;
                case 'python':
                    if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
                        imports.push(trimmed);
                    }
                    break;
                case 'java':
                    if (trimmed.startsWith('import ')) {
                        imports.push(trimmed);
                    }
                    break;
                case 'csharp':
                    if (trimmed.startsWith('using ')) {
                        imports.push(trimmed);
                    }
                    break;
            }
        });

        return imports;
    }

    private extractFunctions(code: string, language: string): string[] {
        const functions: string[] = [];
        const lines = code.split('\n');

        lines.forEach(line => {
            const trimmed = line.trim();

            switch (language) {
                case 'javascript':
                case 'typescript':
                    if (trimmed.match(/^(function\s+\w+|const\s+\w+\s*=\s*\(|let\s+\w+\s*=\s*\(|var\s+\w+\s*=\s*\()/)) {
                        functions.push(trimmed);
                    }
                    break;
                case 'python':
                    if (trimmed.startsWith('def ')) {
                        functions.push(trimmed);
                    }
                    break;
                case 'java':
                case 'csharp':
                    if (trimmed.match(/^\w+\s+\w+\s*\(/)) {
                        functions.push(trimmed);
                    }
                    break;
            }
        });

        return functions;
    }

    private extractClasses(code: string, language: string): string[] {
        const classes: string[] = [];
        const lines = code.split('\n');

        lines.forEach(line => {
            const trimmed = line.trim();

            switch (language) {
                case 'javascript':
                case 'typescript':
                    if (trimmed.startsWith('class ')) {
                        classes.push(trimmed);
                    }
                    break;
                case 'python':
                    if (trimmed.startsWith('class ')) {
                        classes.push(trimmed);
                    }
                    break;
                case 'java':
                case 'csharp':
                    if (trimmed.startsWith('public class ') || trimmed.startsWith('class ')) {
                        classes.push(trimmed);
                    }
                    break;
            }
        });

        return classes;
    }

    private extractVariables(code: string, language: string): string[] {
        const variables: string[] = [];
        const lines = code.split('\n');

        lines.forEach(line => {
            const trimmed = line.trim();

            switch (language) {
                case 'javascript':
                case 'typescript':
                    if (trimmed.match(/^(const|let|var)\s+\w+/)) {
                        variables.push(trimmed);
                    }
                    break;
                case 'python':
                    if (trimmed.match(/^\w+\s*=/)) {
                        variables.push(trimmed);
                    }
                    break;
                case 'java':
                case 'csharp':
                    if (trimmed.match(/^\w+\s+\w+\s*=/)) {
                        variables.push(trimmed);
                    }
                    break;
            }
        });

        return variables;
    }

    private getProjectStructure(uri: vscode.Uri): string {
        // This would ideally scan the project structure
        // For now, return a basic structure
        return 'Project structure analysis not implemented';
    }
} 