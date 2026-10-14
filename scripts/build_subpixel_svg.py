import numpy as np
from PIL import Image
import scipy.ndimage as ndi
from skimage import measure
import xml.etree.ElementTree as ET

im = Image.open('public/logo.png')
crop = im.crop((74, 9, 300, 65))
arr = np.array(crop, dtype=np.float32)
alpha = arr[:, :, 3]

zoom_factor = 8.0
alpha_smooth = ndi.zoom(alpha, zoom_factor, order=3)
contours = measure.find_contours(alpha_smooth, level=128.0)

# Normalize bounding box so it starts at 0, 0
all_points = np.vstack(contours)
min_y = all_points[:, 0].min()
min_x = all_points[:, 1].min()

for tol in [0.4, 0.7, 1.0, 1.5]:
    svg_paths = []
    total_pts = 0
    for c in contours:
        # Approximate
        approx = measure.approximate_polygon(c, tolerance=tol)
        total_pts += len(approx)
        # Convert (row, col) to (x, y) relative to min_x, min_y
        pts = [(p[1] - min_x, p[0] - min_y) for p in approx]
        d_parts = [f"M {pts[0][0]:.2f} {pts[0][1]:.2f}"]
        for p in pts[1:]:
            d_parts.append(f"L {p[0]:.2f} {p[1]:.2f}")
        d_parts.append("Z")
        svg_paths.append(" ".join(d_parts))
    
    combined_d = " ".join(svg_paths)
    max_x = all_points[:, 1].max() - min_x
    max_y = all_points[:, 0].max() - min_y
    w = int(np.ceil(max_x)) + 20
    h = int(np.ceil(max_y)) + 20
    
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
    out_svg = f'public/test_subpixel_tol_{tol}.svg'
    ET.ElementTree(svg_elem).write(out_svg)
    print(f'tol={tol}: {total_pts} points across 11 contours, saved {out_svg}')
