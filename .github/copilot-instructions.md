# TestRail MCP Server - Copilot Instructions

## Project Overview

This is a Model Context Protocol (MCP) server that provides access to TestRail API for test management operations. It can be used via CLI or integrated with AI assistants like Claude Desktop or GitHub Copilot.

## Using the TestRail MCP Server

### Command Line Interface (Primary Method)

Use the CLI wrapper to interact with TestRail:

```bash
# Get tests for a run
node cli.js get-tests <run_id>

# Get test run details
node cli.js get-run <run_id>

# Get test results for a run
node cli.js get-results <run_id>

# Get a specific test case
node cli.js get-case <case_id>

# List all projects
node cli.js list-projects

# Get all users
node cli.js get-users
```

### When Helping Users

1. **For TestRail data requests**: Use the CLI commands to fetch data
2. **For analysis**: Parse the JSON output and provide insights
3. **For integration**: Help connect this server with other tools (like TSE-Report-Tool)

### Available Tools

- `get_test_run` - Get information about a specific test run
- `get_test_results` - Fetch test results for a test run
- `get_test_case` - Get details about a specific test case
- `list_projects` - List all available TestRail projects
- `get_users` - Get list of TestRail users
- `get_tests_for_run` - Get all tests in a specific test run

### Development

- Source files are in `src/` (TypeScript)
- Build output is in `build/` (JavaScript)
- Run `npm run build` to compile
- Run `npm run watch` for development mode

### Configuration

- Credentials are stored in `.env` file
- TestRail URL, username, and API key are required
- Never expose credentials in code or logs
