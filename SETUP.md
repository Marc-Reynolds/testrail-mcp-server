# TestRail MCP Server Setup Guide

## Overview

You've successfully scaffolded a TestRail MCP (Model Context Protocol) server! This server enables AI assistants like GitHub Copilot, Claude, or other MCP clients to interact with your TestRail instance.

## What Was Created

The following project structure has been set up:

```
testrail-mcp-server/
├── .github/
│   └── copilot-instructions.md    # Instructions for AI assistants
├── .vscode/
│   └── mcp.json                   # VS Code MCP configuration
├── src/
│   ├── index.ts                   # Main server entry point
│   └── testrail-client.ts         # TestRail API client
├── build/                         # Compiled JavaScript (generated)
├── package.json                   # Node.js dependencies
├── tsconfig.json                  # TypeScript configuration
├── .env.example                   # Example environment variables
├── .gitignore                     # Git ignore rules
└── README.md                      # Documentation
```

## Next Steps

### 1. Configure TestRail Credentials

Create a `.env` file in the project root:

```bash
cd c:\Users\Marc.Reynolds\testrail-mcp-server
cp .env.example .env
```

Edit `.env` and add your actual TestRail credentials:

```env
TESTRAIL_URL=https://argosapps.testrail.net
TESTRAIL_USERNAME=SVC-TSEAUTOMATION01@sainsburys.co.uk
TESTRAIL_API_KEY=<your-actual-api-key>
```

### 2. Test the Server

You can test the server locally using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node c:\Users\Marc.Reynolds\testrail-mcp-server\build\index.js
```

This will open a web interface where you can:
- See all available tools
- Test tool execution
- View request/response data

### 3. Use with VS Code

The server is already configured for VS Code. To use it:

1. Open VS Code
2. Press `Ctrl+Shift+P` and search for "MCP"
3. Your TestRail server should be listed
4. You can now use `#testrail` in Copilot Chat to access TestRail data

Example queries:
- "Get test run 18889"
- "Show me the test results for run 18971"
- "List all projects"

### 4. Use with Claude Desktop (Optional)

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "testrail": {
      "command": "node",
      "args": [
        "c:\\Users\\Marc.Reynolds\\testrail-mcp-server\\build\\index.js"
      ]
    }
  }
}
```

Restart Claude Desktop to activate the server.

## Available Tools

The server provides these tools:

1. **get_test_run** - Get information about a specific test run
   - Input: `run_id` (number)
   - Returns: Run details including name, description, dates, etc.

2. **get_test_results** - Fetch test results for a test run
   - Input: `run_id` (number)
   - Returns: All test results with status, comments, etc.

3. **get_test_case** - Get details about a specific test case
   - Input: `case_id` (number)
   - Returns: Case details including title, steps, expected results

4. **list_projects** - List all available TestRail projects
   - Input: none
   - Returns: Array of all projects with IDs and names

5. **get_users** - Get list of TestRail users
   - Input: none
   - Returns: Array of users with names and emails

6. **get_tests_for_run** - Get all tests in a specific test run
   - Input: `run_id` (number)
   - Returns: All test cases in the run with their status

## Integration with TSE-Report-Tool

This MCP server complements your TSE-Report-Tool by:

1. **Real-time Data Access**: Query TestRail data without running the full report
2. **Interactive Analysis**: Ask AI assistants to analyze test trends
3. **Quick Lookups**: Get specific test run or case details instantly
4. **Development Support**: Access TestRail data while coding

Example use cases:
- "Show me all tests that failed in run 18889"
- "What's the automation coverage for project 10?"
- "List all tests that have been rerun more than 3 times"

## Development

If you want to modify the server:

1. Edit files in `src/`
2. Rebuild: `npm run build`
3. Or use watch mode: `npm run watch`

To add new tools, edit `src/index.ts` and add new `server.registerTool()` calls.

## Troubleshooting

### Server won't start
- Verify `.env` file exists and has correct credentials
- Check that `build/` directory exists (run `npm run build`)
- Ensure TestRail URL is accessible

### Tools not showing in VS Code
- Restart VS Code
- Check VS Code Output panel for MCP errors
- Verify `mcp.json` path is correct

### Authentication errors
- Verify TestRail API key is valid
- Check that username/email is correct
- Test API access with: `curl -u "user:apikey" https://argosapps.testrail.net/index.php?/api/v2/get_projects`

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [TestRail API Documentation](https://www.gurock.com/testrail/docs/api)
- [TypeScript MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Next Enhancements

Consider adding these tools:
- `get_milestones` - List project milestones
- `get_test_history` - Get execution history for a test
- `analyze_failures` - Get failure pattern analysis
- `get_coverage_metrics` - Calculate automation coverage
