#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { config } from 'dotenv';
import { TestRailClient } from './testrail-client.js';

// Load environment variables
config();

// Validate required environment variables
const requiredEnvVars = ['TESTRAIL_URL', 'TESTRAIL_USERNAME', 'TESTRAIL_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize TestRail client
const testRailClient = new TestRailClient(
  process.env.TESTRAIL_URL!,
  process.env.TESTRAIL_USERNAME!,
  process.env.TESTRAIL_API_KEY!
);

// Create MCP server
const server = new McpServer({
  name: 'testrail-mcp-server',
  version: '1.0.0',
});

// Tool: Get Test Run
server.registerTool(
  'get_test_run',
  {
    title: 'Get Test Run',
    description: 'Retrieve information about a specific TestRail test run',
    inputSchema: {
      run_id: z.number().describe('The ID of the test run'),
    },
  },
  async ({ run_id }) => {
    try {
      const run = await testRailClient.getRun(run_id);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(run, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching test run: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get Test Results
server.registerTool(
  'get_test_results',
  {
    title: 'Get Test Results',
    description: 'Fetch test results for a specific test run',
    inputSchema: {
      run_id: z.number().describe('The ID of the test run'),
    },
  },
  async ({ run_id }) => {
    try {
      const results = await testRailClient.getResultsForRun(run_id);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching test results: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get Test Case
server.registerTool(
  'get_test_case',
  {
    title: 'Get Test Case',
    description: 'Retrieve details about a specific test case',
    inputSchema: {
      case_id: z.number().describe('The ID of the test case'),
    },
  },
  async ({ case_id }) => {
    try {
      const testCase = await testRailClient.getCase(case_id);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(testCase, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching test case: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: List Projects
server.registerTool(
  'list_projects',
  {
    title: 'List Projects',
    description: 'List all available TestRail projects',
    inputSchema: {},
  },
  async () => {
    try {
      const projects = await testRailClient.getProjects();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching projects: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get Users
server.registerTool(
  'get_users',
  {
    title: 'Get Users',
    description: 'Get list of TestRail users',
    inputSchema: {},
  },
  async () => {
    try {
      const users = await testRailClient.getUsers();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(users, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching users: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get Tests for Run
server.registerTool(
  'get_tests_for_run',
  {
    title: 'Get Tests for Run',
    description: 'Get all tests in a specific test run',
    inputSchema: {
      run_id: z.number().describe('The ID of the test run'),
    },
  },
  async ({ run_id }) => {
    try {
      const tests = await testRailClient.getTests(run_id);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(tests, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching tests: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr (not stdout, as stdout is used for MCP communication)
  console.error('TestRail MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
