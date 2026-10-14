import json
import xml.etree.ElementTree as ET

with open('public/normalized_marjad.json', 'r') as f:
    data = json.load(f)

d = data['d']
viewBox = data['viewBox']
w = data['width']
h = data['height']

# 1. Test solid white with glow
svg_solid_white = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <rect width="100%" height="100%" fill="#0a0705"/>
  <path
    d="{d}"
    fill="rgba(255, 255, 255, 0.85)"
    fill-rule="evenodd"
    style="filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.5)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9));"
  />
</svg>'''

# 2. Test solid terracotta/logo color with glow
svg_solid_logo = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <rect width="100%" height="100%" fill="#0a0705"/>
  <path
    d="{d}"
    fill="#c4612d"
    fill-rule="evenodd"
    style="filter: drop-shadow(0 0 16px rgba(196, 97, 45, 0.4)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9));"
  />
</svg>'''

with open('public/preview_solid_white.svg', 'w') as f:
    f.write(svg_solid_white)

with open('public/preview_solid_logo.svg', 'w') as f:
    f.write(svg_solid_logo)

print("Generated solid previews")
