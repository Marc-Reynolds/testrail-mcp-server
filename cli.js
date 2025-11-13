#!/usr/bin/env node
/**
 * CLI wrapper for TestRail MCP Server
 * Allows direct command-line access to TestRail data
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'build', 'index.js');

// Map CLI commands to MCP tool calls
const commands = {
  'get-run': (id) => ({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'get_test_run',
      arguments: { run_id: parseInt(id) }
    }
  }),
  'get-tests': (id) => ({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'get_tests_for_run',
      arguments: { run_id: parseInt(id) }
    }
  }),
  'get-results': (id) => ({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'get_test_results',
      arguments: { run_id: parseInt(id) }
    }
  }),
  'get-case': (id) => ({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'get_test_case',
      arguments: { case_id: parseInt(id) }
    }
  }),
  'list-projects': () => ({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'list_projects',
      arguments: {}
    }
  }),
  'get-users': () => ({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'get_users',
      arguments: {}
    }
  })
};

const command = process.argv[2];
const id = process.argv[3];

if (!command || !commands[command]) {
  console.log('TestRail CLI - Usage:');
  console.log('  node cli.js get-run <run_id>        - Get test run details');
  console.log('  node cli.js get-tests <run_id>      - Get tests for a run');
  console.log('  node cli.js get-results <run_id>    - Get test results for a run');
  console.log('  node cli.js get-case <case_id>      - Get test case details');
  console.log('  node cli.js list-projects           - List all projects');
  console.log('  node cli.js get-users               - Get all users');
  process.exit(1);
}

if ((command !== 'list-projects' && command !== 'get-users') && !id) {
  console.error(`Error: ${command} requires an ID argument`);
  process.exit(1);
}

// Start MCP server
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let responseData = '';

server.stdout.on('data', (data) => {
  responseData += data.toString();
  
  // Try to parse complete JSON responses
  const lines = responseData.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (line) {
      try {
        const response = JSON.parse(line);
        if (response.id === 1 && response.result) {
          // Extract and display the actual content
          const content = response.result.content[0];
          if (content && content.text) {
            console.log(content.text);
          }
          server.kill();
          process.exit(0);
        } else if (response.error) {
          console.error('Error:', response.error.message);
          server.kill();
          process.exit(1);
        }
      } catch (e) {
        // Not complete JSON yet, continue
      }
    }
  }
  responseData = lines[lines.length - 1];
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Send initialization request first
server.stdin.write(JSON.stringify({
  jsonrpc: '2.0',
  id: 0,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'testrail-cli',
      version: '1.0.0'
    }
  }
}) + '\n');

// Wait a bit for initialization, then send the actual request
setTimeout(() => {
  const request = commands[command](id);
  server.stdin.write(JSON.stringify(request) + '\n');
}, 100);

// Timeout after 30 seconds
setTimeout(() => {
  console.error('Request timed out');
  server.kill();
  process.exit(1);
}, 30000);
