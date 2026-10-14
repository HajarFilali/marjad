import xml.etree.ElementTree as ET

tree = ET.parse('public/logo_text_vtracer.svg')
root = tree.getroot()
w = root.get('width')
h = root.get('height')

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
    'stroke-width': '0.7',
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round'
})

for p in root.findall('.//{http://www.w3.org/2000/svg}path'):
    attrs = {'d': p.get('d')}
    if p.get('transform'):
        attrs['transform'] = p.get('transform')
    ET.SubElement(g, 'path', attrs)

ET.ElementTree(new_svg).write('public/preview_vtracer_stroke.svg')
print('Saved public/preview_vtracer_stroke.svg')
