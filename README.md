# Holesail Liveports

[Join our Discord Support Server](https://discord.gg/TQVacE7Vnj)

## Features

Instantly share your localhost website with anyone in the world and see what your friends are building.

- Expose your localhost on the internet
- Connect to anyone's localhost through a connection URL
- Support for TCP and UDP protocols
- Optional secure connections with cryptographic keys
- Lookup active connections
- Manage active servers and clients
- View and manage all connections via status bar

## How to Use

Press `Ctrl + Shift + P` to execute extension commands and search for `liveports`. Select `Liveports: Show Options` to access the main commands or use `Liveports: Show Connections` to view and manage active connections.

### Liveports: Share

- **Port**: Enter the port number your server is running on (e.g., 3000).
- **Address**: Specify the address (e.g., `localhost`, `127.0.0.1`, or another valid IP).
- **Protocol**: Choose between TCP or UDP.
- **Secure Connection**: Select `Yes` for a secure connection with a generated key or `No` for an unsecured connection.
- **Result**: A unique URL (e.g., `hs://s000...`) is generated and can be copied to the clipboard.

### Liveports: Connect

- **Connection URL**: Enter the Holesail URL provided by the share command (e.g., `hs://s000...`).
- **Local Port**: Specify the local port to connect to (default: 8000).
- **Local Address**: Enter the local address (e.g., `127.0.0.1`).
- **Result**: Connects to the shared server, and for TCP connections, a local URL (e.g., `http://127.0.0.1:8000/`) is provided, which can be opened in a browser.

### Liveports: Lookup

- **Connection URL**: Enter a Holesail URL to check its details.
- **Result**: Displays the host, port, protocol, and security status of the connection.

### Liveports: Show Connections

- Lists all active servers and clients.
- Allows copying URLs, copying local HTTP URLs (for TCP clients), or destroying/disconnecting servers and clients.

## Release Notes

### 2.0.0

- **Unified Holesail Module**: Replaced separate `holesail-server` and `holesail-client` modules with a single `holesail` module for both server and client functionality.
- **Protocol Support**: Added support for both TCP and UDP protocols, selectable via a quick pick menu.
- **Connection Lookup**: Added a new `liveports-lookup` command to query details of a Holesail URL.
- **Enhanced Connection Management**: Replaced single `server` and `client` variables with `activeServers` and `activeClients` Maps to support multiple concurrent connections.
- **Improved UI**: Consolidated status bar items into `Liveports` and `Connections` for streamlined access to commands and connection management.
- **Confirmation Prompts**: Added confirmation prompts for destroying servers and disconnecting clients.
- **Connection Details**: Enhanced `showConnections` to display detailed information about active servers and clients, with options to copy URLs or manage connections.
- **Error Handling**: Improved error messages for failed server startups, client connections, and lookups.

### 1.0.3

- Added support for TCP and UDP protocols
- Introduced secure connection option with cryptographic keys
- Added connection lookup functionality
- Enhanced connection management with status bar integration
- Improved user interface with quick pick menus for protocol and security options
- Added ability to view and manage all active connections

### 1.0.2

Updated holesail server and client.

### 1.0.0

Initial release of Holesail Liveports.

---

License: [GPL v3](https://www.gnu.org/licenses/gpl-3.0.txt)

---

## For more information

* [Check our Github](https://github.com/holesail/liveports)
* [Join our Discord Support Server](https://discord.gg/TQVacE7Vnj)

**Enjoy!**