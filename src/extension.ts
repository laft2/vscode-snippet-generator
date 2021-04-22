// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('snippet-gen.createText', () => {
		// The code you place here will be executed every time your command is executed

		let editor = vscode.window.activeTextEditor;
		if(editor == undefined) return;
		let doc = editor.document;
		let cur_selection = editor.selection;
		if(editor.selection.isEmpty){         
					// if selection is empty, selection is all of text.
					let startPos = new vscode.Position(0, 0);
					let endPos = new vscode.Position(doc.lineCount - 1, 10000);
					cur_selection = new vscode.Selection(startPos, endPos);
		}

		let text = doc.getText(cur_selection); // selected text
		text = text.replace(/\\/g, "\\\\");
		text = text.replace(/\t/g, `\\t`);
		console.log(text);
		let textSplitted = text.split(/\r?\n/);

		const space4 = "    ";
		const space8 = space4.repeat(2);
		const space12 = space4.repeat(3);
		const LF = "\n";

		let title = space4 + `"": {` + LF;
		let prefix = space8 + `"prefix": "",` + LF;
		let description = space8 + `"description": ""` + LF;
		let end = space4 + "}," + LF;

		let header = title + prefix + space8 + `"body": [` + LF;
		let footer = space8 + `],` + LF + description + end;
		let body = textSplitted.map(tx => space12 + `"` + tx + `",` + LF);

		let result = LF + header + body.reduce((sum, elm) => sum + elm, "") + footer;
		console.log(result);

		// insert snippet text
		editor.edit(edit => {
			edit.insert(cur_selection.end, result)
		});


		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
