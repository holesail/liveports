// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const commands = require('vscode');
const DHT = require('holesail-server')
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('holesail-liveports.liveports-share', function () {
		// The code you place here will be executed every time your command is executed
		
		//validate is port is a valid number
		function validateInput(value) {
			if (isNaN(value)) {
				return "Port must be a valid number";
			}
			return null;
		}
		
		//verify is the address is a correct Ip address
		const addressRegex = /^(localhost|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$/;
		
		//ask for port input
		vscode.window.showInputBox({
			prompt: "Enter port number",
			placeHolder: "Port",
			validateInput
		}).then(port => {
			if (!port) {
				return;
			}
		
			//ask for address input
			vscode.window.showInputBox({
				prompt: "Enter address",
				placeHolder: "127.0.0.1",
				validateInput: (value) => {
					if (!value.match(addressRegex)) {
						return "Invalid address format";
					}
					return null;
				}
			}).then(address => {
				if (!address) {
					address = '127.0.0.1';
				}
		
				const server = new DHT();
				server.serve(+port, address, () => {
					console.log(address+":"+port,"is now live on the following key =>");
					console.log('Server public key:', server.getPublicKey());

					vscode.window.showInformationMessage(address+":"+port+ ' Server public key:', server.getPublicKey()).then(selected => {
						if (selected === server.getPublicKey()) {
							vscode.commands.executeCommand('editor.action.clipboardCopyAction');
							vscode.window.showInformationMessage('Key copied to clipboard.');
						}
					});
				});
			});
		});

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
