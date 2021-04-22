// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "snippet-gen" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('snippet-gen.createText', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from snippet-gen!');

		let editor = vscode.window.activeTextEditor; // エディタ取得
		if(editor == undefined) return;
		let doc = editor.document;            // ドキュメント取得
		let cur_selection = editor.selection; // 選択範囲取得
		if(editor.selection.isEmpty){         
					// 選択範囲が空であれば全てを選択範囲にする
					let startPos = new vscode.Position(0, 0);
					let endPos = new vscode.Position(doc.lineCount - 1, 10000);
					cur_selection = new vscode.Selection(startPos, endPos);
		}

		let text = doc.getText(cur_selection); //取得されたテキスト
		text = text.replace(/\t/, `\t`);
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

		//エディタ選択範囲にテキストを反映
		editor.edit(edit => {
			edit.insert(cur_selection.end, result)
		});


		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
