import pathops
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
from PIL import Image, ImageDraw

var_font = TTFont(r'.next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2')
f_cinzel = instantiateVariableFont(var_font, {'wght': 750})
g = f_cinzel.getGlyphSet()[f_cinzel.getBestCmap()[ord('M')]]
p = pathops.Path()
g.draw(pathops.PathPen(p))
contours = list(p.contours)

# Contour indices in Cinzel M:
# 0: right diagonal (thick)
# 1: left serif outer
# 2: left serif inner
# 3: left stem (thin)
# 4: left diagonal (thin)
# 5: right stem (thick)
# 6: right serif outer (thick)
# 7: right serif inner (thick)

# Let's inspect:
# Left half components:
# Outer left stem: Contour 1, 2, 3
# Left diagonal: Contour 4

# What if we mirror the left half (Contours 1, 2, 3, and a diagonal) across a center axis?
# Let's see: Left apex is around x=164.6.
# If we choose apex spacing W_apex, then X_center = 164.6 + W_apex/2.
# In original Cinzel: Left apex = 164.6, Right apex = 790.64 -> Distance = 626.04.
# Center = 164.6 + 313.02 = 477.62.

# Let's test mirroring left stem (1, 2, 3) to the right across X = 477.62:
left_leg = pathops.Path()
f_pen = pathops.PathPen(left_leg)
contours[1].draw(f_pen)
contours[2].draw(f_pen)
contours[3].draw(f_pen)

# Mirrored right leg:
xc = 477.62
right_leg = pathops.Path()
left_leg.draw(TransformPen(pathops.PathPen(right_leg), (-1, 0, 0, 1, 2*xc, 0)))

# Now what about the diagonals?
# In Cinzel, Contour 4 is the left diagonal:
# Top: (169.25, 714)
# Bottom: (440.6, -21.05)
# If we adjust the diagonal so it meets exactly at (xc, 0.0) or (xc, 15.0):
# Let's check how Contour 4 was shaped:
# (169.25, 714.0) -> (502.39, 191.16) -> (440.60, -21.05) -> (142.49, 456.69) -> close

print("Left leg bounds:", left_leg.bounds)
print("Right leg bounds:", right_leg.bounds)
