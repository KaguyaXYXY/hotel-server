# :hotel: Hotel MCP Server
:link: Tutorial: https://www.postman.com/kaguyaxyxy-5ed2e41c/notebook/xLYmRxJ616ov/build-your-ai-agent-for-searching-and-booking-accomodations
## :paperclip: Prerequisites
- Node.js (v20+)
- npm
## :earth_asia: Server Set Up
1. Run from your project's root directory:

```sh
npm install
```
2. Create a .env file and paste the following code to it

```
AMADEUS_FOR_DEVELOPERS_S_PUBLIC_WORKSPACE_API_KEY=
API_SECRET=
```
  Paste your amadeus workspace api key and secret

## 👩‍💻 Connect the MCP Server to Claude

You can connect your MCP server to any MCP client. Here we provide instructions for connecting it to Claude Desktop.

Open Claude Desktop → **Settings** → **Developers** → **Edit Config** and add a new MCP server:

```json
{
  "mcpServers": {
    "hotel-server": {
      "command": "node",
      "args": ["C:\\ABSOLUTE_PATH_TO\\mcpServer.js"]
    }
  }
}
```

Restart Claude Desktop to activate this change. Make sure the new MCP is turned on and has a green circle next to it. If so, you're ready to begin a chat session that can use the tools you've connected.


