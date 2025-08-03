# Holesail Liveports

* Join our [Keet channel](https://keet.io/) for support: [Room invite](pear://keet/yfo1wq5x8fg5xaxcc845csc5k65kdzcoxsqc58wozi93ty5kr3u1147zppesp8gomwguthoxhj9x3dx79wxd3thi9ajj347i7ikny6z6otnsizfrub3x6yehzjb7qfa5794nzdf7tacx8gfo4c7czober5ho1ye
)

Instantly share your localhost website with anyone in the world and see what your friends are building.

## Features

Instantly share your localhost website with anyone in the world and see what your friends are building.

- Share localhost servers
- Connect to anyone's localhost through a connection key
- Support for TCP and UDP protocols
- Lookup active connections
- Manage active servers and clients
- View and manage all connections via status bar

## How to Use

1. Share a server or connect to someone using the "Liveports" option in the actions bar at bottom.
2. View list of currently running connections by clicking the "Connections" option.

Alternatively you can press `Ctrl + Shift + P` to execute extension commands and search for `liveports`. Select `Liveports: Show Options` to access the main commands or use `Liveports: Show Connections` to view and manage active connections.

### Liveports: Share

- **Port**: Enter the port number your server is running on (e.g., 3000).
- **Address**: Specify the address (e.g., `localhost`, `127.0.0.1`, or another valid IP).
- **Protocol**: Choose between TCP or UDP.
- **Private Connection**: Select `Yes` for a private connection or `No` for a public connection. You should not share private connection keys but public connection keys are sharable.  
- **Result**: A unique key (e.g., `hs://s000...`) is generated and can be copied to the clipboard.

### Liveports: Connect

- **Connection key**: Enter the Holesail key provided by the share command (e.g., `hs://s000...`).
- **Local Port**: Specify the local port to connect to (default: 8000).
- **Local Address**: Enter the local address (e.g., `127.0.0.1`).
- **Result**: Connects to the shared server, and for TCP connections, a local key (e.g., `http://127.0.0.1:8000/`) is provided, which can be opened in a browser.

### Liveports: Lookup

- **Connection URL**: Enter a Holesail key to check its details.
- **Result**: Displays the host, port, protocol, and security status of the connection.

### Liveports: Show Connections

- Lists all active servers and clients.
- Allows copying keys, copying local HTTP URLs (for TCP clients), or destroying/disconnecting servers and clients.

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
* Join our [Keet channel](https://keet.io/) for support: [Room invite](pear://keet/yfo1wq5x8fg5xaxcc845csc5k65kdzcoxsqc58wozi93ty5kr3u1147zppesp8gomwguthoxhj9x3dx79wxd3thi9ajj347i7ikny6z6otnsizfrub3x6yehzjb7qfa5794nzdf7tacx8gfo4c7czober5ho1ye
)



**Enjoy!**