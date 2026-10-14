import numpy as np
from PIL import Image
import scipy.ndimage as ndi
from skimage import measure
import xml.etree.ElementTree as ET

# 1. Load original logo
im = Image.open('public/logo.png')
# Crop text: cols 74 to 299, rows 9 to 65
crop = im.crop((74, 9, 300, 65))
arr = np.array(crop, dtype=np.float32)

# Alpha channel (0 to 255)
alpha = arr[:, :, 3]

# 2. Zoom by 8x using bicubic spline interpolation (order=3)
zoom_factor = 8.0
alpha_smooth = ndi.zoom(alpha, zoom_factor, order=3)

# 3. Find iso-contours at level 128.0 (50% coverage)
# skimage.measure.find_contours returns list of (N, 2) arrays: (row, col)
contours = measure.find_contours(alpha_smooth, level=128.0)

print(f'Found {len(contours)} contours')
for i, c in enumerate(contours):
    print(f'Contour {i}: shape={c.shape}, min_y={c[:,0].min():.1f}, max_y={c[:,0].max():.1f}, min_x={c[:,1].min():.1f}, max_x={c[:,1].max():.1f}')
