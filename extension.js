// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');
// The main module
const DHT = require('holesail-server')
const holesailClient = require('holesail-client')

var ncp = require("copy-paste");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	//register liveports-share command
	let share = vscode.commands.registerCommand('holesail-liveports.liveports-share', function () {
		
		//validate if port is a valid number
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
							ncp.copy(selected, function () {
								// complete...
								vscode.window.showInformationMessage('Key copied to clipboard.');
							  })
						}
					});
				});
			});
		});

	});

	//implementing connect feature
	let connect = vscode.commands.registerCommand('holesail-liveports.liveports-connect', function () {
		
		//validate if port is a valid number
		function validateInput(value) {
			if (isNaN(value)) {
				return "Port must be a valid number";
			}
			return null;
		}
		

		//ask for connection key input
		vscode.window.showInputBox({
			prompt: "Enter connection key",
			placeHolder: "Connection Key (Required)",
		}).then(key => {
			if (!key) {
				return;
			}
		
			//ask for port input
			vscode.window.showInputBox({
				prompt: "Enter Port (Optional)",
				placeHolder: "8000",
				validateInput
			}).then(port => {
				if (!port) {
					port = '8000';
				}
		
				const client = new holesailClient(key)
				client.connect(+port, "localhost", () => {
					vscode.window.showInformationMessage("Connected to the client","https://localhost:"+port+"/")
				});
			});
		});

	});

	context.subscriptions.push(connect);
	context.subscriptions.push(share);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
