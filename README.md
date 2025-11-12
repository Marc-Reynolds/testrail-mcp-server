# TestRail MCP Server

An MCP (Model Context Protocol) server that provides AI assistants with access to TestRail API for test management operations.

## Features

This server provides the following tools to interact with TestRail:

- **get_test_run** - Get information about a specific test run
- **get_test_results** - Fetch test results for a test run
- **get_test_case** - Get details about a specific test case
- **list_projects** - List all available TestRail projects
- **get_users** - Get list of TestRail users

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your TestRail credentials in `.env`:
```
TESTRAIL_URL=https://argosapps.testrail.net
TESTRAIL_USERNAME=your-email@sainsburys.co.uk
TESTRAIL_API_KEY=your-api-key-here
```

4. Build the server:
```bash
npm run build
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "testrail": {
      "command": "node",
      "args": [
        "C:\\Users\\Marc.Reynolds\\testrail-mcp-server\\build\\index.js"
      ]
    }
  }
}
```

### With VS Code

Add to your VS Code MCP configuration (`mcp.json` in `.vscode` folder):

```json
{
  "testrail": {
    "command": "node",
    "args": [
      "C:\\Users\\Marc.Reynolds\\testrail-mcp-server\\build\\index.js"
    ]
  }
}
```

## Development

Run in watch mode during development:
```bash
npm run watch
```

## TestRail API Documentation

This server uses the TestRail API v2. For more information:
- [TestRail API Documentation](https://www.gurock.com/testrail/docs/api)

## License

MIT
