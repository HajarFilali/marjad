import sys
sys.path.insert(0, 'scripts')
from compare_5_designs import path_A, path_R, path_J, path_D
import pathops
from fontTools.pens.transformPen import TransformPen
from PIL import Image, ImageDraw

def build_custom_m(crotch_y=240.0, junction_x=182.54, junction_y=392.5, inner_apex_x=169.25, tip_w=12.0):
    xc = 475.0
    p = pathops.Path()
    p.moveTo(xc, crotch_y)
    p.lineTo(inner_apex_x, 714.0)
    p.lineTo(159.95, 714.0)
    p.lineTo(75.94, 73.0)
    p.lineTo(75.78, 73.0)
    p.quadTo(71.78, 43.0, 50.78, 26.5)
    p.quadTo(29.78, 10.0, 2.78, 10.0)
    p.lineTo(-13.22, 10.0)
    p.lineTo(-13.22, 0.0)
    p.lineTo(199.12, 0.0)
    p.lineTo(199.12, 9.0)
    p.lineTo(183.42, 9.0)
    p.quadTo(167.42, 9.0, 155.92, 22.5)
    p.quadTo(144.42, 36.0, 144.42, 52.0)
    p.lineTo(144.42, 56.5)
    p.lineTo(junction_x, junction_y)
    p.lineTo(xc - tip_w/2.0, 0.0)
    p.lineTo(xc, 0.0)
    p.lineTo(xc, crotch_y)
    p.close()
    
    p_right = pathops.Path()
    p.draw(TransformPen(pathops.PathPen(p_right), (-1, 0, 0, 1, 2*xc, 0)))
    union_p = pathops.op(p, p_right, pathops.PathOp.UNION)
    return pathops.simplify(union_p)

# Let's test combinations:
# 1. junction_y = 392.5, crotch_y = 230
# 2. junction_y = 370.0, junction_x = 190.0, crotch_y = 240
# 3. junction_y = 350.0, junction_x = 200.0, crotch_y = 250
# 4. junction_y = 420.0, junction_x = 175.0, crotch_y = 220

tests = [
    ("T1 (Pure Cinzel Left Half Mirrored, crotch=225, tip=10)", build_custom_m(crotch_y=225.0, junction_x=182.54, junction_y=392.5, tip_w=10.0)),
    ("T2 (Balanced Roman, crotch=240, junction=(182.5, 392.5), tip=12)", build_custom_m(crotch_y=240.0, junction_x=182.54, junction_y=392.5, tip_w=12.0)),
    ("T3 (Slightly higher crotch=260, tip=12)", build_custom_m(crotch_y=260.0, junction_x=185.0, junction_y=380.0, tip_w=12.0)),
    ("T4 (Harmonized with A, crotch=250, tip=14)", build_custom_m(crotch_y=250.0, junction_x=188.0, junction_y=375.0, tip_w=14.0)),
]

img = Image.new("RGBA", (1900, 1000), (12, 18, 14, 255))
draw = ImageDraw.Draw(img)

for i, (title, m_p) in enumerate(tests):
    letters = [('M', m_p), ('A', path_A), ('R', path_R), ('J', path_J), ('A', path_A), ('D', path_D)]
    combined = pathops.Path()
    curr_x = 0.0
    for ch, p in letters:
        b = p.bounds
        shift_x = curr_x - b[0]
        shifted = pathops.Path()
        p.draw(TransformPen(pathops.PathPen(shifted), (1, 0, 0, 1, shift_x, 0)))
        combined = pathops.op(combined, shifted, pathops.PathOp.UNION)
        curr_x = shifted.bounds[2] + 86.3
    
    clean = pathops.simplify(combined)
    scale = 0.3
    y_pos = 200 + i * 230
    b = clean.bounds
    shifted_render = pathops.Path()
    clean.draw(TransformPen(pathops.PathPen(shifted_render), (scale, 0, 0, -scale, 40 - b[0]*scale, y_pos)))
    
    for c in shifted_render.contours:
        sub = pathops.Path()
        c.draw(pathops.PathPen(sub))
        pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
        if len(pts) > 2:
            draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")
    
    draw.line([(40, y_pos), (1860, y_pos)], fill=(240, 60, 60, 120), width=1)
    draw.text((40, y_pos - 170), title, fill=(245, 215, 140, 255))

img.save("public/compare_4_fine_tuned.png")
print("Saved public/compare_4_fine_tuned.png successfully!")
