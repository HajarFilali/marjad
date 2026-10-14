import xml.etree.ElementTree as ET
import re

# Let's inspect logo_text_vtracer.svg
tree = ET.parse('public/logo_text_vtracer.svg')
root = tree.getroot()

# Helper to parse SVG path and apply translation
# In logo_text_vtracer.svg, paths use M, C, Z commands with translate(tx, ty)
def parse_and_translate_path(d_str, tx, ty, scale=1.0):
    # Regex to tokenize command and numbers
    tokens = re.findall(r'([a-zA-Z])|([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)', d_str)
    result = []
    current_cmd = None
    coord_idx = 0
    
    for cmd_match, num_match in tokens:
        if cmd_match:
            current_cmd = cmd_match
            result.append(current_cmd)
            coord_idx = 0
        elif num_match:
            val = float(num_match)
            if current_cmd in ['M', 'L', 'C']:
                # Even indices are X, odd indices are Y
                if coord_idx % 2 == 0:
                    new_val = (val + tx) * scale
                else:
                    new_val = (val + ty) * scale
                result.append(f"{new_val:.2f}")
                coord_idx += 1
            elif current_cmd == 'H':
                new_val = (val + tx) * scale
                result.append(f"{new_val:.2f}")
            elif current_cmd == 'V':
                new_val = (val + ty) * scale
                result.append(f"{new_val:.2f}")
            else:
                result.append(f"{val * scale:.2f}")
                coord_idx += 1
    return " ".join(result)

scale = 10.0
unified_paths = []
for p in root.findall('.//{http://www.w3.org/2000/svg}path'):
    d = p.get('d')
    transform = p.get('transform', '')
    tx, ty = 0.0, 0.0
    if 'translate' in transform:
        m = re.search(r'translate\(([-0-9.]+),\s*([-0-9.]+)\)', transform)
        if m:
            tx = float(m.group(1))
            ty = float(m.group(2))
    translated_d = parse_and_translate_path(d, tx, ty, scale)
    unified_paths.append(translated_d)

combined_d = " ".join(unified_paths)
w = int(float(root.get('width')) * scale)
h = int(float(root.get('height')) * scale)

svg_elem = ET.Element('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'viewBox': f'0 0 {w} {h}',
    'width': str(w),
    'height': str(h)
})

ET.SubElement(svg_elem, 'rect', {
    'width': '100%',
    'height': '100%',
    'fill': '#0a0a0a'
})

ET.SubElement(svg_elem, 'path', {
    'd': combined_d,
    'fill': 'none',
    'stroke': '#ffffff',
    'stroke-width': '2.5',
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round'
})

out_svg = 'public/test_vtracer_scaled.svg'
ET.ElementTree(svg_elem).write(out_svg)
print(f'Saved {out_svg} with viewBox="0 0 {w} {h}"')
