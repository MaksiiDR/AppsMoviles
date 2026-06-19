import re

with open('hooks/useDatabase.ts', 'r') as f:
    content = f.read()

# Change DB name
content = content.replace("openDatabaseAsync('citasMedicasDB')", "openDatabaseAsync('citasMedicasDB_v2')")

# Change interfaces id from number to string
content = re.sub(r'id:\s*number;', r'id: string;', content)
# Change ficha_id from number to string
content = re.sub(r'ficha_id:\s*number;', r'ficha_id: string;', content)

# Change table creations
content = content.replace('id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,', 'id TEXT PRIMARY KEY NOT NULL,\n            sync_status TEXT DEFAULT "pending_insert",\n            updated_at TEXT,')
content = content.replace('ficha_id INTEGER', 'ficha_id TEXT')

# Change function signatures
content = content.replace('id: number', 'id: string')
content = content.replace('fichaId: number', 'fichaId: string')

# Write back
with open('hooks/useDatabase.ts', 'w') as f:
    f.write(content)
