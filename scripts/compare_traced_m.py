import numpy as np
from PIL import Image, ImageDraw
from skimage import measure
import pathops
from fontTools.pens.transformPen import TransformPen

img = Image.open(r'C:\Users\HAJAR\.gemini\antigravity-ide\brain\58dddefe-9296-42a7-8837-e566d95fa3db\.user_uploaded\media_1791234497269.png').convert('L')
arr = np.array(img)
binary = (arr < 128).astype(float)
contours = measure.find_contours(binary, 0.5)
c = contours[0]

scale = 714.0 / 335.0

# Compare tolerances: 0.3, 0.5, 0.8
comp_img = Image.new("RGBA", (1500, 500), (12, 17, 14, 255))
draw = ImageDraw.Draw(comp_img)

for idx, tol in enumerate([0.3, 0.5, 0.8]):
    poly = measure.approximate_polygon(c, tolerance=tol)
    p = pathops.Path()
    r, col = poly[0]
    p.moveTo((col - 125.5)*scale, (431.5 - r)*scale)
    for r, col in poly[1:]:
        p.lineTo((col - 125.5)*scale, (431.5 - r)*scale)
    p.close()
    clean = pathops.simplify(p)
    
    # Render
    x_off = 40 + idx * 490
    y_base = 440
    render_scale = 0.5
    
    shifted = pathops.Path()
    clean.draw(TransformPen(pathops.PathPen(shifted), (render_scale, 0, 0, -render_scale, x_off, y_base)))
    
    for contour in shifted.contours:
        sub = pathops.Path()
        contour.draw(pathops.PathPen(sub))
        pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
        if len(pts) > 2:
            draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")
            
    draw.text((x_off, 30), f"Tolerance {tol} ({len(poly)} pts)", fill=(240, 210, 140))
    draw.line([(x_off, y_base), (x_off + 450, y_base)], fill=(240, 50, 50, 100), width=1)

comp_img.save("public/compare_traced_m.png")
print("Saved public/compare_traced_m.png successfully!")
