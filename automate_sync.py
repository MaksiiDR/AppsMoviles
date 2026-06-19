import re

with open('hooks/useDatabase.ts', 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace("import { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';\nimport { AppState } from 'react-native';\nimport { runFullSync, syncPush } from '../services/ServicioSincronizacion';")

# 2. Add AppState effect inside useDatabase
app_state_effect = """
    useEffect(() => {
        if (!db) return;
        
        // Sincronizar al iniciar
        runFullSync(db).catch(console.error);

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                runFullSync(db).catch(console.error);
            }
        });

        return () => {
            subscription.remove();
        };
    }, [db]);
"""
# Insert after `const [error, setError] = useState<Error | null>(null);`
content = content.replace("const [error, setError] = useState<Error | null>(null);", f"const [error, setError] = useState<Error | null>(null);\n{app_state_effect}")

# 3. Add syncPush(db) inside mutating functions before returning
# We can find `return true;` and `return id;` and `return result.lastInsertRowId;` inside the Try blocks of the mutating functions.
# However, `return true;` is also used in non-mutating? No, `useDatabase.ts` only returns true on success of mutations.
# Wait, returning `id` in `crearCita`: `return id;`
# We'll just replace `return true;` with `syncPush(db).catch(console.error);\n            return true;`
# But we only want to do this if `db` is available, which it is.
# Let's do a simple regex replace for `return true;` inside try blocks of mutating functions:
content = re.sub(r'return true;', r'syncPush(db).catch(console.error);\n            return true;', content)

# For `crearCita` which returns `id;`:
content = re.sub(r'return id;', r'syncPush(db).catch(console.error);\n            return id;', content)

with open('hooks/useDatabase.ts', 'w') as f:
    f.write(content)
