import numpy as np
from PIL import Image
from skimage import measure
import pathops
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

img = Image.open(r'C:\Users\HAJAR\.gemini\antigravity-ide\brain\58dddefe-9296-42a7-8837-e566d95fa3db\.user_uploaded\media_1791234497269.png').convert('L')
arr = np.array(img)
binary = (arr < 128).astype(float)
contours = measure.find_contours(binary, 0.5)
c = contours[0] # (N, 2), points are (row, col) = (y, x)

# Convert to (x, y) coordinates
# In image: row 0 is top. In font: y=0 is baseline.
# Let's see: y_min=96.5, y_max=431.5. Height = 335.
# Font cap height = 714.0.
# We map: y_font = (431.5 - row) * (714.0 / 335.0)
# x_font = (col - 125.5) * (714.0 / 335.0)

scale = 714.0 / 335.0
pts_font = []
for pt in c:
    row, col = pt
    xf = (col - 125.5) * scale
    yf = (431.5 - row) * scale
    pts_font.append((xf, yf))

print(f"Total points: {len(pts_font)}")
print(f"X range: {min(p[0] for p in pts_font):.1f} to {max(p[0] for p in pts_font):.1f}")
print(f"Y range: {min(p[1] for p in pts_font):.1f} to {max(p[1] for p in pts_font):.1f}")
