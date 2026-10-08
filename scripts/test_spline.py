import numpy as np
from PIL import Image, ImageDraw
from skimage import measure
import pathops
from scipy.interpolate import splprep, splev
from fontTools.pens.transformPen import TransformPen

img = Image.open(r'C:\Users\HAJAR\.gemini\antigravity-ide\brain\58dddefe-9296-42a7-8837-e566d95fa3db\.user_uploaded\media_1791234497269.png').convert('L')
arr = np.array(img)
binary = (arr < 128).astype(float)
contours = measure.find_contours(binary, 0.5)
c = contours[0]

scale = 714.0 / 335.0

# In polyline:
poly = measure.approximate_polygon(c, tolerance=0.5)
xs = [(col - 125.5)*scale for r, col in poly]
ys = [(431.5 - r)*scale for r, col in poly]

# Close if not closed
if xs[0] != xs[-1] or ys[0] != ys[-1]:
    xs.append(xs[0])
    ys.append(ys[0])

# Now let's test:
# Option 1: Polyline pathops path
p_poly = pathops.Path()
p_poly.moveTo(xs[0], ys[0])
for x, y in zip(xs[1:], ys[1:]):
    p_poly.lineTo(x, y)
p_poly.close()
clean_poly = pathops.simplify(p_poly)

# Let's inspect vertices of clean_poly
print("Clean poly bounds:", clean_poly.bounds)
print("Contours:", len(list(clean_poly.contours)))
