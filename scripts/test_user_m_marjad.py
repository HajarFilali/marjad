import numpy as np
from PIL import Image, ImageDraw
from skimage import measure
import pathops
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
import sys
sys.path.insert(0, 'scripts')
from compare_5_designs import path_A, path_R, path_J, path_D

# 1. Extract contour from the user's uploaded image
img = Image.open(r'C:\Users\HAJAR\.gemini\antigravity-ide\brain\58dddefe-9296-42a7-8837-e566d95fa3db\.user_uploaded\media_1791234497269.png').convert('L')
arr = np.array(img)
binary = (arr < 128).astype(float)
contours = measure.find_contours(binary, 0.5)
c = contours[0]

# Map to font coordinates:
# Baseline at y=0, cap height at y=714
# y_min = 96.5, y_max = 431.5 -> height = 335.0
scale = 714.0 / 335.0

# Test tolerances 0.4, 0.6, 0.8
for tol in [0.4, 0.6, 0.8]:
    poly = measure.approximate_polygon(c, tolerance=tol)
    p = pathops.Path()
    r, col = poly[0]
    p.moveTo((col - 125.5)*scale, (431.5 - r)*scale)
    for r, col in poly[1:]:
        p.lineTo((col - 125.5)*scale, (431.5 - r)*scale)
    p.close()
    clean_m = pathops.simplify(p)
    
    # Render with full word MARJAD
    letters = [('M', clean_m), ('A', path_A), ('R', path_R), ('J', path_J), ('A', path_A), ('D', path_D)]
    combined = pathops.Path()
    curr_x = 0.0
    target_gap = 86.3
    
    for ch, glyph_p in letters:
        b = glyph_p.bounds
        shift_x = curr_x - b[0]
        shifted = pathops.Path()
        glyph_p.draw(TransformPen(pathops.PathPen(shifted), (1, 0, 0, 1, shift_x, 0)))
        combined = pathops.op(combined, shifted, pathops.PathOp.UNION)
        curr_x = shifted.bounds[2] + target_gap
        
    combined_clean = pathops.simplify(combined)
    print(f"Tol {tol}: combined bounds = {combined_clean.bounds}, contours = {len(list(combined_clean.contours))}")

# Let's render tol=0.5 to an image preview
poly_05 = measure.approximate_polygon(c, tolerance=0.5)
p_05 = pathops.Path()
r, col = poly_05[0]
p_05.moveTo((col - 125.5)*scale, (431.5 - r)*scale)
for r, col in poly_05[1:]:
    p_05.lineTo((col - 125.5)*scale, (431.5 - r)*scale)
p_05.close()
clean_m_05 = pathops.simplify(p_05)

letters = [('M', clean_m_05), ('A', path_A), ('R', path_R), ('J', path_J), ('A', path_A), ('D', path_D)]
combined = pathops.Path()
curr_x = 0.0
for ch, glyph_p in letters:
    b = glyph_p.bounds
    shift_x = curr_x - b[0]
    shifted = pathops.Path()
    glyph_p.draw(TransformPen(pathops.PathPen(shifted), (1, 0, 0, 1, shift_x, 0)))
    combined = pathops.op(combined, shifted, pathops.PathOp.UNION)
    curr_x = shifted.bounds[2] + 86.3

clean_final = pathops.simplify(combined)

# Render to PNG
img_preview = Image.new("RGBA", (1800, 500), (10, 15, 12, 255))
draw = ImageDraw.Draw(img_preview)

scale_r = 0.32
b = clean_final.bounds
y_base = 380

shifted_render = pathops.Path()
clean_final.draw(TransformPen(pathops.PathPen(shifted_render), (scale_r, 0, 0, -scale_r, 50 - b[0]*scale_r, y_base)))

for c_path in shifted_render.contours:
    sub = pathops.Path()
    c_path.draw(pathops.PathPen(sub))
    pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
    if len(pts) > 2:
        draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")

# Red baseline
draw.line([(50, y_base), (1750, y_base)], fill=(240, 50, 50, 100), width=1)
draw.text((50, y_base - 280), "MARJAD with exact User-Requested M (Vertical stems, bilateral serifs, baseline V)", fill=(245, 215, 140))

img_preview.save("public/test_user_m_marjad.png")
print("Saved public/test_user_m_marjad.png successfully!")
