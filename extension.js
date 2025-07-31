const vscode = require('vscode');
const Holesail = require('holesail');
const ncp = require("copy-paste");
const crypto = require('crypto');

let activeServers = new Map();
let activeClients = new Map();

function activate(context) {
  const addressRegex = /^(localhost|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$/;

  function validatePort(value) {
    if (isNaN(value)) {
      return "Port must be a valid number";
    }
    return null;
  }

  function validateAddress(value) {
    if (!value.match(addressRegex)) {
      return "Invalid address format";
    }
    return null;
  }

  let share = vscode.commands.registerCommand('holesail-liveports.liveports-share', async function () {
    const port = await vscode.window.showInputBox({
      prompt: "Enter port number",
      placeHolder: "Port",
      validateInput: validatePort
    });
    if (!port) {
      return;
    }

    let address = await vscode.window.showInputBox({
      prompt: "Enter address",
      placeHolder: "127.0.0.1",
      value: "127.0.0.1",
      validateInput: validateAddress
    });
    if (!address) {
      address = '127.0.0.1';
    }

    const protocolOptions = ['TCP', 'UDP'];
    const proto = await vscode.window.showQuickPick(protocolOptions, {
      placeHolder: 'Select protocol'
    });
    if (!proto) {
      return;
    }
    const udp = proto === 'UDP';

    const secureOptions = ['Yes', 'No'];
    const secureChoice = await vscode.window.showQuickPick(secureOptions, {
      placeHolder: 'Use secure connection? (default: Yes)'
    });
    if (!secureChoice) {
      return;
    }
    const secure = secureChoice === 'Yes';

    let key;
    if (secure) {
      key = crypto.randomBytes(32).toString('hex');
    }

    try {
      let holesail = new Holesail({
        server: true,
        port: +port,
        host: address,
        udp: udp,
        secure: secure,
        key: key
      });
      await holesail.ready();

      const info = holesail.info;
      const url = info.url;

      console.log(`${address}:${port} is now live on the following URL => ${url}`);

      vscode.window.showInformationMessage(`${address}:${port} is now live on the following URL: ${url}`, 'Copy URL').then(selected => {
        if (selected === 'Copy URL') {
          ncp.copy(url, function () {
            vscode.window.showInformationMessage('URL copied to clipboard.');
          });
        }
      });

      activeServers.set(url, { holesail, port, address, protocol: proto, secure });
    } catch (e) {
      vscode.window.showErrorMessage(`Failed to start server: ${e.message}`);
    }
  });

  let connect = vscode.commands.registerCommand('holesail-liveports.liveports-connect', async function () {
    const url = await vscode.window.showInputBox({
      prompt: "Enter connection URL",
      placeHolder: "hs://s000..."
    });
    if (!url) {
      return;
    }

    const data = Holesail.urlParser(url);
    let secure = data.secure !== undefined ? data.secure : true;
    const keyStr = data.key;

    let result;
    try {
      result = await Holesail.lookup(url);
    } catch (e) {
      vscode.window.showErrorMessage(`Lookup failed: ${e.message}`);
      return;
    }

    if (!result) {
      vscode.window.showErrorMessage('No active server found for this URL.');
      return;
    }

    const defaultPort = (result.port || 8000).toString();
    let localPort = await vscode.window.showInputBox({
      prompt: "Enter local port (optional)",
      placeHolder: defaultPort,
      value: defaultPort,
      validateInput: validatePort
    });
    if (!localPort) {
      localPort = defaultPort;
    }

    let localAddress = await vscode.window.showInputBox({
      prompt: "Enter local address",
      placeHolder: "127.0.0.1",
      value: "127.0.0.1",
      validateInput: validateAddress
    });
    if (!localAddress) {
      localAddress = '127.0.0.1';
    }

    const udp = result.udp;
    let protocol = result.protocol ? result.protocol.toUpperCase() : (udp ? 'UDP' : 'TCP');

    try {
      let holesail = new Holesail({
        client: true,
        key: keyStr,
        secure: secure,
        port: +localPort,
        host: localAddress,
        udp: udp
      });
      await holesail.ready();

      const localUrl = `${result.protocol === 'tcp' ? 'http' : 'udp'}://${localAddress}:${localPort}/`;

      vscode.window.showInformationMessage(`Connected to the client`, localUrl).then((selection) => {
        if (selection === localUrl && result.protocol === 'tcp') {
          vscode.env.openExternal(vscode.Uri.parse(localUrl));
        }
      });

      activeClients.set(+localPort, { holesail, url, address: localAddress, protocol, secure });
    } catch (e) {
      vscode.window.showErrorMessage(`Failed to connect: ${e.message}`);
    }
  });

  let lookup = vscode.commands.registerCommand('holesail-liveports.liveports-lookup', async function () {
    const url = await vscode.window.showInputBox({
      prompt: "Enter Holesail URL",
      placeHolder: "hs://..."
    });
    if (!url) {
      return;
    }

    const data = Holesail.urlParser(url);
    let secure = data.secure !== undefined ? data.secure : false;

    try {
      const result = await Holesail.lookup(url);
      if (!result) {
        vscode.window.showInformationMessage('No information found for this URL.');
      } else {
        vscode.window.showInformationMessage(`Host: ${result.host}\nPort: ${result.port}\nProtocol: ${result.protocol}\nSecure: ${secure ? 'Yes' : 'No'}`);
      }
    } catch (e) {
      vscode.window.showErrorMessage(`Error: ${e.message}`);
    }
  });

  let destroyServer = vscode.commands.registerCommand('holesail-liveports.destroyServer', async function (url) {
    const entry = activeServers.get(url);
    if (entry) {
      const confirmOptions = ['Yes', 'No'];
      const confirm = await vscode.window.showQuickPick(confirmOptions, {
        placeHolder: `Are you sure you want to remove the server for ${url}?`
      });
      if (confirm !== 'Yes') {
        vscode.window.showInformationMessage('Server removal cancelled.');
        return;
      }
      try {
        await entry.holesail.close();
        activeServers.delete(url);
        vscode.window.showInformationMessage(`Removed shared port for ${url}`);
      } catch (e) {
        vscode.window.showErrorMessage(`Failed to remove shared port: ${e.message}`);
      }
    }
  });

  let disconnectClient = vscode.commands.registerCommand('holesail-liveports.disconnectClient', async function (port) {
    const entry = activeClients.get(port);
    if (entry) {
      const confirmOptions = ['Yes', 'No'];
      const confirm = await vscode.window.showQuickPick(confirmOptions, {
        placeHolder: `Are you sure you want to disconnect the client on port ${port}?`
      });
      if (confirm !== 'Yes') {
        vscode.window.showInformationMessage('Client disconnection cancelled.');
        return;
      }
      try {
        await entry.holesail.close();
        activeClients.delete(port);
        vscode.window.showInformationMessage(`Disconnected client on port ${port}`);
      } catch (e) {
        vscode.window.showErrorMessage(`Failed to disconnect client: ${e.message}`);
      }
    }
  });

  let showConnections = vscode.commands.registerCommand('holesail-liveports.showConnections', async function () {
    const items = [];

    if (activeServers.size > 0) {
      for (const [url, { port, address, protocol, secure }] of activeServers) {
        items.push({
          label: `Server: ${url}`,
          detail: `Address: ${address}, Port: ${port}, Protocol: ${protocol}, Secure: ${secure ? 'Yes' : 'No'}`,
          url: url,
          type: 'server'
        });
      }
    }

    if (activeClients.size > 0) {
      for (const [port, { url, address, protocol, secure }] of activeClients) {
        const localUrl = protocol === 'TCP' ? `http://${address}:${port}/` : null;
        items.push({
          label: `Client: Port ${port}, URL: ${url}`,
          detail: `Address: ${address}, Protocol: ${protocol}, Secure: ${secure ? 'Yes' : 'No'}${localUrl ? `, Local URL: ${localUrl}` : ''}`,
          url: url,
          localUrl: localUrl, // Store local URL for TCP clients
          port: port,
          type: 'client'
        });
      }
    }

    if (items.length === 0) {
      vscode.window.showInformationMessage('No active connections.');
      return;
    }

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a connection',
      matchOnDetail: true
    });

    if (selected) {
      const menuOptions = [
        { label: 'Copy URL', action: 'copy' },
        ...(selected.type === 'client' && selected.localUrl ? [{ label: 'Copy Local HTTP URL', action: 'copyLocal' }] : []),
        { label: selected.type === 'server' ? 'Destroy Server' : 'Disconnect Client', action: 'destroy' }
      ];

      const menuSelection = await vscode.window.showQuickPick(menuOptions, {
        placeHolder: `Select an action for ${selected.type === 'server' ? selected.url : 'port ' + selected.port}`
      });

      if (menuSelection) {
        if (menuSelection.action === 'copy') {
          const urlToCopy = selected.url;
          ncp.copy(urlToCopy, function () {
            vscode.window.showInformationMessage('URL copied to clipboard.');
          });
        } else if (menuSelection.action === 'copyLocal') {
          const urlToCopy = selected.localUrl;
          ncp.copy(urlToCopy, function () {
            vscode.window.showInformationMessage('Local HTTP URL copied to clipboard.');
          });
        } else if (menuSelection.action === 'destroy') {
          if (selected.type === 'server') {
            vscode.commands.executeCommand('holesail-liveports.destroyServer', selected.url);
          } else if (selected.type === 'client') {
            vscode.commands.executeCommand('holesail-liveports.disconnectClient', selected.port);
          }
        }
      }
    }
  });

  let showOptions = vscode.commands.registerCommand('holesail-liveports.showOptions', function () {
    const options = [
      { label: 'Share', command: 'holesail-liveports.liveports-share' },
      { label: 'Connect', command: 'holesail-liveports.liveports-connect' },
      { label: 'Lookup', command: 'holesail-liveports.liveports-lookup' }
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

  let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "⛵ Liveports";
  statusBarItem.tooltip = "Liveports Options";
  statusBarItem.command = "holesail-liveports.showOptions";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  let statusBarItem2 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem2.text = "⛵ Connections";
  statusBarItem2.tooltip = "View Connections";
  statusBarItem2.command = "holesail-liveports.showConnections";
  statusBarItem2.show();
  context.subscriptions.push(statusBarItem2);

  context.subscriptions.push(showOptions);
  context.subscriptions.push(connect);
  context.subscriptions.push(share);
  context.subscriptions.push(lookup);
  context.subscriptions.push(destroyServer);
  context.subscriptions.push(disconnectClient);
  context.subscriptions.push(showConnections);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};