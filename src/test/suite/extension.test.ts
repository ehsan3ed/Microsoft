import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('ai-coding-assistant'));
  });

  test('Should activate', async () => {
    const ext = vscode.extensions.getExtension('ai-coding-assistant');
    await ext?.activate();
    assert.ok(true);
  });

  test('Should register all commands', async () => {
    const commands = await vscode.commands.getCommands();
    const aiCommands = commands.filter(cmd => cmd.startsWith('ai-coding-assistant.'));
    
    assert.ok(aiCommands.includes('ai-coding-assistant.askAI'));
    assert.ok(aiCommands.includes('ai-coding-assistant.explainCode'));
    assert.ok(aiCommands.includes('ai-coding-assistant.refactorCode'));
    assert.ok(aiCommands.includes('ai-coding-assistant.generateCode'));
    assert.ok(aiCommands.includes('ai-coding-assistant.fixCode'));
    assert.ok(aiCommands.includes('ai-coding-assistant.setupModels'));
  });
}); 