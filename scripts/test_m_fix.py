from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
import pathops

var_font = TTFont(r'.next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2')
font = instantiateVariableFont(var_font, {'wght': 750})
g = font.getGlyphSet()[font.getBestCmap()[ord('M')]]
p = pathops.Path()
g.draw(pathops.PathPen(p))
clean_p = pathops.simplify(p)

# Create a new pathops.Path with leveled bottom for M
fixed_m = pathops.Path()
f_pen = pathops.PathPen(fixed_m)

for verb, pt_tuple in clean_p:
    # If any point has y < 0, clamp to 0.0
    new_pts = tuple((pt[0], max(pt[1], 0.0)) for pt in pt_tuple)
    if verb == pathops.PathVerb.MOVE:
        fixed_m.moveTo(*new_pts[0])
    elif verb == pathops.PathVerb.LINE:
        fixed_m.lineTo(*new_pts[0])
    elif verb == pathops.PathVerb.QUAD:
        fixed_m.quadTo(*new_pts[0], *new_pts[1])
    elif verb == pathops.PathVerb.CUBIC:
        fixed_m.cubicTo(*new_pts[0], *new_pts[1], *new_pts[2])
    elif verb == pathops.PathVerb.CLOSE:
        fixed_m.close()

# Simplify to ensure no self-intersections after leveling
fixed_m = pathops.simplify(fixed_m)

print("Original M bounds:", clean_p.bounds)
print("Fixed M bounds:   ", fixed_m.bounds)
print("Lowest points in fixed M:")
for verb, pt_tuple in fixed_m:
    for pt in pt_tuple:
        if pt[1] <= 1:
            print(f"  x={pt[0]:.1f}, y={pt[1]:.1f}")
