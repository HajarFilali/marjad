import pathops
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
from PIL import Image, ImageDraw

# Cinzel left half points:
# Top inner apex: (169.25, 714.0)
# Top outer apex: (159.95, 714.0)
# Outer stem points:
# (75.94, 73.0)
# quadTo (71.78, 43.0), (50.78, 26.5)
# quadTo (29.78, 10.0), (2.78, 10.0)
# (-13.22, 10.0)
# (-13.22, 0.0)  -> foot outer
# (199.12, 0.0)  -> foot inner
# (199.12, 9.0)
# (183.42, 9.0)
# quadTo (167.42, 9.0), (155.92, 22.5)
# quadTo (144.42, 36.0), (144.42, 52.0)
# (144.42, 56.5)
# (182.54, 392.5) -> junction between outer stem and diagonal!

# Let's test different center X coordinates:
# Apex center is around 164.6.
# If xc = 475, then right apex center will be 475 + (475 - 164.6) = 785.4 (matching original Cinzel 790.6!)

def build_mirrored_cinzel_m(xc=475.0, y_bottom=0.0, y_crotch=217.16, junction_x=182.54, junction_y=392.5, tip_half_w=5.0):
    # Left half contour from (xc, y_crotch) counter-clockwise:
    p = pathops.Path()
    
    # Start at top center crotch:
    p.moveTo(xc, y_crotch)
    # Up to left inner apex:
    p.lineTo(169.25, 714.0)
    # Across apex:
    p.lineTo(159.95, 714.0)
    # Down outer stem:
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
    # Up to junction between stem and diagonal:
    p.lineTo(junction_x, junction_y)
    # Down diagonal to bottom center V:
    p.lineTo(xc - tip_half_w, y_bottom)
    # Flat bottom tip:
    p.lineTo(xc, y_bottom)
    # Close along center line up to crotch:
    p.lineTo(xc, y_crotch)
    p.close()
    
    # Mirror across X = xc:
    p_right = pathops.Path()
    p.draw(TransformPen(pathops.PathPen(p_right), (-1, 0, 0, 1, 2*xc, 0)))
    
    # Combine both halves using pathops.op union:
    union_p = pathops.op(p, p_right, pathops.PathOp.UNION)
    clean_p = pathops.simplify(union_p)
    return clean_p

# Test rendering several variations:
img = Image.new("RGBA", (1500, 500), (18, 24, 20, 255))
draw = ImageDraw.Draw(img)

configs = [
    ("1. xc=475, y_bottom=0.0 (baseline)", 475.0, 0.0, 217.0, 182.54, 392.5, 6.0),
    ("2. xc=475, y_bottom=12.0 (elevated V)", 475.0, 12.0, 217.0, 182.54, 392.5, 6.0),
    ("3. xc=480, y_bottom=0.0 (slightly wider)", 480.0, 0.0, 230.0, 185.0, 390.0, 6.0),
]

for idx, (title, xc, yb, yc, jx, jy, thw) in enumerate(configs):
    m_p = build_mirrored_cinzel_m(xc, yb, yc, jx, jy, thw)
    scale = 0.4
    b = m_p.bounds
    x_off = 30 + idx * 490
    shifted = pathops.Path()
    m_p.draw(TransformPen(pathops.PathPen(shifted), (scale, 0, 0, -scale, x_off - b[0]*scale, 420 + b[1]*scale)))
    
    for c in shifted.contours:
        sub = pathops.Path()
        c.draw(pathops.PathPen(sub))
        pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
        if len(pts) > 2:
            draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")
    draw.text((x_off, 25), title, fill=(220, 220, 220))

img.save("public/test_mirrored_m.png")
print("Saved public/test_mirrored_m.png!")
