# Holesail Liveports

* Join our [Keet channel](https://keet.io/) for support: [Room invite](pear://keet/nfo4of1xqm36up7qaf1un7mfih5on41t33ga8znpwhj67y5gs1zq1j349jqy355t3mnek5ei5rzhfaprbf5rx39amyysda1yyf1ap37cq1za65pke8bypzfweb7b61csberxxwmahybu35qxn3zrsnutqynhyyedoddotqg4isfrjrae911pmwcxn7rhr
)

Instantly share your localhost website (or any local server) with anyone in the world and see what your friends are building.

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

License: [GPL v3](https://www.gnu.org/licenses/gpl-3.0.txt)

---

## For more information

* [Check our Github](https://github.com/holesail/liveports)
* Join our [Keet channel](https://keet.io/) for support: [Room invite](pear://keet/nfo4of1xqm36up7qaf1un7mfih5on41t33ga8znpwhj67y5gs1zq1j349jqy355t3mnek5ei5rzhfaprbf5rx39amyysda1yyf1ap37cq1za65pke8bypzfweb7b61csberxxwmahybu35qxn3zrsnutqynhyyedoddotqg4isfrjrae911pmwcxn7rhr
)



**Enjoy!**