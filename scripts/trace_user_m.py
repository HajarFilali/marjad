import numpy as np
from PIL import Image
from skimage import measure
import pathops

img = Image.open(r'C:\Users\HAJAR\.gemini\antigravity-ide\brain\58dddefe-9296-42a7-8837-e566d95fa3db\.user_uploaded\media_1791234497269.png').convert('L')
arr = np.array(img)

# Find contours at threshold 128
# In arr, background is white (255) and M is black (0)
# Binary image: M is 1, background is 0
binary = (arr < 128).astype(float)

contours = measure.find_contours(binary, 0.5)
print(f"Found {len(contours)} contours")
for i, c in enumerate(contours):
    print(f"Contour {i}: shape = {c.shape}, min = {c.min(axis=0)}, max = {c.max(axis=0)}")
