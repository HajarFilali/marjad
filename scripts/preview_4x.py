import xml.etree.ElementTree as ET

tree = ET.parse('public/logo_4x_vtracer.svg')
root = tree.getroot()
w = root.get('width')
h = root.get('height')
paths = root.findall('.//{http://www.w3.org/2000/svg}path')
print(f'Dimensions: {w}x{h}, paths: {len(paths)}')

new_svg = ET.Element('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'viewBox': f'0 0 {w} {h}',
    'width': w,
    'height': h
})

rect = ET.SubElement(new_svg, 'rect', {
    'width': '100%',
    'height': '100%',
    'fill': '#0a0a0a'
})

g = ET.SubElement(new_svg, 'g', {
    'fill': 'none',
    'stroke': '#ffffff',
    'stroke-width': '2.5',
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round'
})

# Skip path 0 if it is background
start_idx = 1 if len(paths) > 1 and paths[0].get('fill', '').upper() == '#FFFFFF' else 0
for p in paths[start_idx:]:
    if p.get('fill', '').upper() == '#FFFFFF':
        # In binary trace, white paths might be holes or background
        pass
    attrs = {'d': p.get('d')}
    if p.get('transform'):
        attrs['transform'] = p.get('transform')
    ET.SubElement(g, 'path', attrs)

ET.ElementTree(new_svg).write('public/preview_logo_4x.svg')
print('Saved public/preview_logo_4x.svg')
