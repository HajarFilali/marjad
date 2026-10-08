from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
import pathops
from PIL import Image, ImageDraw

var_font = TTFont(r'.next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2')
f_cinzel = instantiateVariableFont(var_font, {'wght': 750})
g = f_cinzel.getGlyphSet()[f_cinzel.getBestCmap()[ord('M')]]
p = pathops.Path()
g.draw(pathops.PathPen(p))
clean_p = pathops.simplify(p)

# Let's inspect the left side contours of Cinzel M.
# We will construct a half-M path on the left of X_center, then mirror it across X_center.

# Let's test a few values of X_center (e.g. 460, 470, 480) and Y_bottom (0.0 or 15.0)
img = Image.new("RGBA", (1400, 450), (18, 24, 20, 255))
draw = ImageDraw.Draw(img)

def build_symmetric_m(xc, y_bottom, y_crotch):
    # Left half points:
    # 1. Left outer leg and foot from Cinzel:
    # Top outer apex: (159.95, 714.0)
    # Top inner apex: (169.25, 714.0)
    # Foot outer: (-13.22, 0.0)
    # Foot inner: (199.12, 0.0)
    # Foot inner curve points from Cinzel:
    # (199.12, 9.0), (183.42, 9.0), (167.42, 9.0), (155.92, 22.5), (144.42, 36.0), (144.42, 56.5)
    
    # Left diagonal going down to center:
    # Line from (169.25, 714.0) to (xc, y_bottom)
    
    # Inner stem going up to crotch:
    # Line from (144.42, 56.5) to (xc, y_crotch)
    
    # Build complete closed polygon for left half:
    left_path = pathops.Path()
    left_path.moveTo(xc, y_bottom)
    left_path.lineTo(169.25, 714.0)
    left_path.lineTo(159.95, 714.0)
    # Outer curve to foot:
    left_path.lineTo(75.8, 73.0)
    left_path.quadTo(71.8, 43.0, 50.8, 26.5)
    left_path.quadTo(29.8, 10.0, 2.8, 10.0)
    left_path.lineTo(-13.22, 10.0)
    left_path.lineTo(-13.22, 0.0)
    left_path.lineTo(199.12, 0.0)
    left_path.lineTo(199.12, 9.0)
    left_path.lineTo(183.42, 9.0)
    left_path.quadTo(167.42, 9.0, 155.92, 22.5)
    left_path.quadTo(144.42, 36.0, 144.42, 56.5)
    # Up to crotch:
    left_path.lineTo(xc, y_crotch)
    left_path.close()
    
    # Mirror across X = xc:
    # Transform matrix: (-1, 0, 0, 1, 2*xc, 0)
    right_path = pathops.Path()
    left_path.draw(TransformPen(pathops.PathPen(right_path), (-1, 0, 0, 1, 2*xc, 0)))
    
    # Combine and simplify:
    full_m = pathops.Path()
    f_pen = pathops.PathPen(full_m)
    left_path.draw(f_pen)
    right_path.draw(f_pen)
    return pathops.simplify(full_m)

variants = [
    ("A. V-bottom at y=0.0 (baseline level)", 470, 0.0, 260.0),
    ("B. V-bottom at y=25.0 (floating V like Trajan)", 470, 25.0, 280.0),
    ("C. Wider V-bottom at y=0.0 (xc=485)", 485, 0.0, 250.0),
]

for idx, (title, xc, yb, yc) in enumerate(variants):
    m_sym = build_symmetric_m(xc, yb, yc)
    scale = 0.35
    b = m_sym.bounds
    x_off = 40 + idx * 450
    shifted = pathops.Path()
    m_sym.draw(TransformPen(pathops.PathPen(shifted), (scale, 0, 0, -scale, x_off - b[0]*scale, 380 + b[1]*scale)))
    for c in shifted.contours:
        sub = pathops.Path()
        c.draw(pathops.PathPen(sub))
        pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
        if len(pts) > 2:
            draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")
    draw.text((x_off, 25), title, fill=(220, 220, 220))

img.save("public/compare_symmetric_m.png")
print("Saved public/compare_symmetric_m.png successfully!")
