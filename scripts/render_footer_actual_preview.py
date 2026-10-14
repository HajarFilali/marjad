import json
import xml.etree.ElementTree as ET

with open('src/components/layout/marjadPath.json', 'r') as f:
    data = json.load(f)

viewBox = data['viewBox']
d = data['d']

# Create an SVG simulating the footer lower watermark section
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 350" width="1400" height="350">
  <!-- Dark Moroccan geometric background simulating the footer -->
  <rect width="100%" height="100%" fill="#0a0705"/>
  
  <g opacity="0.12" stroke="#d4af37" stroke-width="1" fill="none">
    <!-- Subtle Moroccan geometric grid lines -->
    <pattern id="zellige" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M40 0 L80 40 L40 80 L0 40 Z"/>
      <path d="M0 0 L80 80 M80 0 L0 80"/>
      <circle cx="40" cy="40" r="20"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#zellige)"/>
  </g>

  <!-- Ambient Watermark: MARJAD from authentic logo -->
  <g transform="translate(100, 70) scale(0.522)">
    <!-- Base Layer -->
    <path
      d="{d}"
      fill="none"
      stroke="rgba(255, 255, 255, 0.82)"
      stroke-width="5"
      stroke-linejoin="round"
      stroke-linecap="round"
      style="filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.9));"
    />
  </g>
</svg>'''

with open('public/footer_watermark_final_preview.svg', 'w', encoding='utf-8') as f:
    f.write(svg)

print("Saved public/footer_watermark_final_preview.svg")
