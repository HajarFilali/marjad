import numpy as np
from PIL import Image, ImageDraw
from skimage import measure
import pathops

img = Image.open(r'C:\Users\HAJAR\.gemini\antigravity-ide\brain\58dddefe-9296-42a7-8837-e566d95fa3db\.user_uploaded\media_1791234497269.png').convert('L')
arr = np.array(img)
binary = (arr < 128).astype(float)
contours = measure.find_contours(binary, 0.5)
c = contours[0]

scale = 714.0 / 335.0
poly = measure.approximate_polygon(c, tolerance=0.5)

xs = [(col - 125.5)*scale for r, col in poly]
ys = [(431.5 - r)*scale for r, col in poly]

# Snapping logic:
snapped_xs = []
snapped_ys = []

for x, y in zip(xs, ys):
    # Snap baseline
    if abs(y) < 3.0:
        y = 0.0
    # Snap cap height
    elif abs(y - 714.0) < 3.0:
        y = 714.0
    
    # Snap vertical stems
    if abs(x - 103.4) < 2.5:
        x = 103.4
    elif abs(x - 870.7) < 2.5:
        x = 870.7
        
    snapped_xs.append(x)
    snapped_ys.append(y)

p = pathops.Path()
p.moveTo(snapped_xs[0], snapped_ys[0])
for x, y in zip(snapped_xs[1:], snapped_ys[1:]):
    p.lineTo(x, y)
p.close()

clean_snapped = pathops.simplify(p)
print("Snapped bounds:", clean_snapped.bounds)
print("Contours:", len(list(clean_snapped.contours)))
