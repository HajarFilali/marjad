import xml.etree.ElementTree as ET
import re

tree = ET.parse('public/logo_text_vtracer.svg')
root = tree.getroot()

paths = root.findall('.//{http://www.w3.org/2000/svg}path')

# 0: M at translate(0, 4)
# 1: R at translate(91, 4)
# 2: D at translate(189, 4)
# 3: First A at translate(68, 3)
# 4: Second A at translate(166, 3) -> Replace with First A at translate(166, 3)!
# 5: J at translate(134, 4)
# 6: Dot at translate(106, 14)

def parse_and_translate_path(d_str, tx, ty, scale=1.0):
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

# Letters to include:
# 1. M: paths[0] at (0, 4)
# 2. First A: paths[3] at (68, 3)
# 3. R: paths[1] at (91, 4)
# 4. Dot: paths[6] at (106, 14)
# 5. J: paths[5] at (134, 4)
# 6. Second A: paths[3] (clean A!) at (166, 3)
# 7. D: paths[2] at (189, 4)

letters = [
    (paths[0].get('d'), 0.0, 4.0),     # M
    (paths[3].get('d'), 68.0, 3.0),    # First A
    (paths[1].get('d'), 91.0, 4.0),    # R
    (paths[6].get('d'), 106.0, 14.0),  # Dot
    (paths[5].get('d'), 134.0, 4.0),   # J
    (paths[3].get('d'), 166.0, 3.0),   # Second A (using clean A!)
    (paths[2].get('d'), 189.0, 4.0),   # D
]

translated_d_list = []
for d_str, tx, ty in letters:
    translated_d_list.append(parse_and_translate_path(d_str, tx, ty, scale))

combined_d = " ".join(translated_d_list)

w = 2260
h = 560

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
    'stroke': 'rgba(255, 255, 255, 0.85)',
    'stroke-width': '2.5',
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round'
})

out_svg = 'public/marjad_authentic_logo_perfect.svg'
ET.ElementTree(svg_elem).write(out_svg)
print(f'Saved {out_svg}')
