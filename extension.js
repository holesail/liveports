const vscode = require('vscode');
const DHT = require('holesail-server');
const holesailClient = require('holesail-client');
const ncp = require("copy-paste");

let server;
let client;

function activate(context) {

    let share = vscode.commands.registerCommand('holesail-liveports.liveports-share', function () {

        function validateInput(value) {
            if (isNaN(value)) {
                return "Port must be a valid number";
            }
            return null;
        }

        const addressRegex = /^(localhost|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$/;

        vscode.window.showInputBox({
            prompt: "Enter port number",
            placeHolder: "Port",
            validateInput
        }).then(port => {
            if (!port) {
                return;
            }

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

                server = new DHT();
                server.serve(+port, address, () => {
                    console.log(address + ":" + port, "is now live on the following key =>");
                    console.log('Server public key:', server.getPublicKey());

                    vscode.window.showInformationMessage(address + ":" + port + ' Server public key:', server.getPublicKey()).then(selected => {
                        if (selected === server.getPublicKey()) {
                            ncp.copy(selected, function () {
                                vscode.window.showInformationMessage('Key copied to clipboard.');
                            })
                        }
                    });
                });
            });
        });

    });

    let connect = vscode.commands.registerCommand('holesail-liveports.liveports-connect', function () {

        function validateInput(value) {
            if (isNaN(value)) {
                return "Port must be a valid number";
            }
            return null;
        }

        vscode.window.showInputBox({
            prompt: "Enter connection key",
            placeHolder: "Connection Key (Required)",
        }).then(key => {
            if (!key) {
                return;
            }

            vscode.window.showInputBox({
                prompt: "Enter Port (Optional)",
                placeHolder: "8000",
                validateInput
            }).then(port => {
                if (!port) {
                    port = '8000';
                }

                client = new holesailClient(key)
                client.connect(+port, "localhost", () => {
                    const url = "http://localhost:" + port + "/";
                    vscode.window.showInformationMessage("Connected to the client", url).then((selection) => {
                        if (selection === url) {
                            vscode.env.openExternal(vscode.Uri.parse(url));
                        }
                    });
                });

            });
        });

    });

    let showOptions1 = vscode.commands.registerCommand('holesail-liveports.showOptions1', function () {
        const options = [
            { label: 'Share', command: 'holesail-liveports.liveports-share' },
            { label: 'Destroy Server', command: 'holesail-liveports.destroyServer' },
        ];

        vscode.window.showQuickPick(options, {
            placeHolder: 'Select an option',
            matchOnDetail: true
        }).then(option => {
            if (option) {
                vscode.commands.executeCommand(option.command);
            }
        });
    });

    let showOptions2 = vscode.commands.registerCommand('holesail-liveports.showOptions2', function () {
        const options = [
            { label: 'Connect', command: 'holesail-liveports.liveports-connect' },
            { label: 'Disconnect client', command: 'holesail-liveports.disconnectClient' },
        ];

        vscode.window.showQuickPick(options, {
            placeHolder: 'Select an option',
            matchOnDetail: true
        }).then(option => {
            if (option) {
                vscode.commands.executeCommand(option.command);
            }
        });
    });

    let destroyServer = vscode.commands.registerCommand('holesail-liveports.destroyServer', function () {
        if (server) {
            server.destroy();
            vscode.window.showInformationMessage('Server destroyed.');
        } else {
            vscode.window.showInformationMessage('No server to destroy.');
        }
    });

    let disconnectClient = vscode.commands.registerCommand('holesail-liveports.disconnectClient', function () {
        if (client) {
            client.destroy();
            vscode.window.showInformationMessage('Client Disconnected.');
        } else {
            vscode.window.showInformationMessage('Client not connected.');
        }
    });

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "⛵ Share Ports";
    statusBarItem.tooltip = "Share Ports";
    statusBarItem.command = "holesail-liveports.showOptions1";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    let statusBarItem2 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem2.text = "⛵ connect Ports";
    statusBarItem2.tooltip = "connect Ports";
    statusBarItem2.command = "holesail-liveports.showOptions2";
    statusBarItem2.show();
    context.subscriptions.push(statusBarItem2);

    context.subscriptions.push(showOptions1);
    context.subscriptions.push(showOptions2);
    context.subscriptions.push(destroyServer);
    context.subscriptions.push(disconnectClient);
    context.subscriptions.push(connect);
    context.subscriptions.push(share);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
