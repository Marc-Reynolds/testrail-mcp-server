#!/bin/bash
cd "c:\Users\Marc.Reynolds\testrail-mcp-server"
for id in 20079 20108 20144 20181 20298 20390 20468 20518 20560 20605; do
    echo "Checking run $id..."
    output=$(node cli.js get-run $id 2>&1)
    name=$(echo "$output" | grep -o '"name": "[^"]*"' | cut -d'"' -f4)
    echo "  Run $id: $name"
done
