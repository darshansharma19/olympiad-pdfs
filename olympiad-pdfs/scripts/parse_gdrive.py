import re
import json

with open("gdrive_class6.html", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's find all entries in the JS data structure
# Search for .docx or .pdf or names
matches = re.findall(r'\\x22([0-9a-zA-Z_-]{25,})\\x22.*?\\x22([^\\]+\.(?:docx|pdf|doc))\\x22', content)
print("Pattern 1 matches:", matches)

# Another regex search across escaped string
entries = re.findall(r'\[\\x22([0-9a-zA-Z_-]{25,})\\x22[^\\]*?\\x22([^\\]+?\.(?:docx|pdf|doc))\\x22', content)
print("Pattern 2 entries:", entries)

# Let's search broader for any filename ending in docx/pdf
files_found = re.findall(r'\\x22([^\\"]+\.(?:docx|pdf|doc))\\x22', content)
print("Files found:", set(files_found))

# Look for drive file IDs near those filenames
for f in set(files_found):
    pos = content.find(f)
    snippet = content[max(0, pos-200):min(len(content), pos+200)]
    print(f"\n--- Snippet for {f} ---")
    print(snippet)
