import json

with open('public/normalized_marjad.json', 'r') as f:
    data = json.load(f)

viewBox = data['viewBox']
width = data['width']
height = data['height']
d = data['d']

ts_content = f'''export const MARJAD_PATH_DATA = {{
  viewBox: "{viewBox}",
  width: {width},
  height: {height},
  d: "{d}",
}} as const;
'''

with open('src/components/layout/marjadPath.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

with open('src/components/layout/marjadPath.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Successfully updated src/components/layout/marjadPath.ts and marjadPath.json")
