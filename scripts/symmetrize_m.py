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

pts = [pt for verb, pt_tuple in clean_p for pt in pt_tuple]

# Let's inspect the left half of Cinzel M:
# Left foot: x from -13.2 to 199.1, baseline y=0.0
# Left outer diagonal goes up to apex at x=164.6, y=714
# Then outer top apex (159.95, 714) and inner top apex (169.25, 714)
# Left inner diagonal goes down to center V.
# Let's see: if the center axis of the M is X_center = 475:
# The left foot will be at x = 93 (relative to center: -382)
# The right foot will be at x = 475 + 382 = 857 (width = 212.3, exactly equal to left foot!)
# The left apex will be at x = 164.6 (relative to center: -310.4)
# The right apex will be at x = 475 + 310.4 = 785.4!
# The central V vertex will meet EXACTLY at x = 475, at y = 0.0 (or level with baseline)!
# The inner crotch will be EXACTLY at x = 475!

print("Testing symmetric M generation...")
