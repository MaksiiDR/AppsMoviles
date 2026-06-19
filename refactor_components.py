import os
import glob
import re

for filepath in glob.glob('components/*.tsx') + glob.glob('app/*.tsx') + glob.glob('app/(tabs)/*.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # In components
    content = content.replace('id: number', 'id: string')
    content = content.replace('item.id.toString()', 'item.id')
    
    # In forms
    content = content.replace('Number(id)', 'id as string')
    
    with open(filepath, 'w') as f:
        f.write(content)
