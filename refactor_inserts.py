import re

with open('hooks/useDatabase.ts', 'r') as f:
    content = f.read()

# Add import for randomUUID
if "import * as Crypto" not in content:
    content = content.replace("import { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';\nimport * as Crypto from 'expo-crypto';")

# Replace INSERTs to include id and Crypto.randomUUID()
# Function: re.sub
# This is complex to do via simple replace. Let's do it via python string manipulation for each specific INSERT.

def repl_insert(match):
    table = match.group(1)
    cols = match.group(2)
    vals = match.group(3)
    # add id to cols and vals
    new_cols = f"id, {cols}"
    new_vals = f"?,{vals}"
    return f"INSERT INTO {table} ({new_cols}) VALUES ({new_vals})"

content = re.sub(r'INSERT INTO (\w+) \((.*?)\) VALUES \((.*?)\)', repl_insert, content)

# Now we need to update the execute lines that follow INSERTs to pass the UUID.
# Because the previous regex only modified the SQL string, we need to modify the arguments passed to runAsync.
# E.g. database.runAsync('INSERT INTO cita...', arg1, arg2) -> database.runAsync('INSERT...', Crypto.randomUUID(), arg1, arg2)

def repl_runasync(match):
    prefix = match.group(1)
    query = match.group(2)
    args = match.group(3)
    if 'INSERT INTO' in query:
        # Check if it already has Crypto.randomUUID() to avoid double insertion
        if 'Crypto.randomUUID()' not in args:
            return f"{prefix}{query}', Crypto.randomUUID(), {args}"
    return match.group(0)

# We use regex to find runAsync calls with INSERT
content = re.sub(r'(runAsync\(\s*\')([^\']+)(\',\s*)(.*?)(?=\);)', repl_runasync, content, flags=re.DOTALL)

with open('hooks/useDatabase.ts', 'w') as f:
    f.write(content)
