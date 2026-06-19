import re

with open('app/(tabs)/index.tsx', 'r') as f:
    content = f.read()

# Remove handleSync function
content = re.sub(r'const handleSync = async \(\) => \{.*?\};', '', content, flags=re.DOTALL)

# Remove the button from return
content = re.sub(r'<TouchableOpacity style=\{styles\.syncBtn\}.*?</TouchableOpacity>', '', content, flags=re.DOTALL)

# Remove syncBtn styles
content = re.sub(r'syncBtn: \{.*?\},\n    syncBtnText: \{.*?\},', '', content, flags=re.DOTALL)

# Remove syncing state
content = re.sub(r'const \[syncing, setSyncing\] = useState\(false\);', '', content)

with open('app/(tabs)/index.tsx', 'w') as f:
    f.write(content)
