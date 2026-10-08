from PIL import Image
import numpy as np

img = Image.open(r'C:\Users\HAJAR\.gemini\antigravity-ide\brain\58dddefe-9296-42a7-8837-e566d95fa3db\.user_uploaded\media_1791234497269.png').convert('L')
arr = np.array(img)

# Binary mask: 1 = black, 0 = white
mask = arr < 128
pts = np.argwhere(mask)
y_min, x_min = pts.min(axis=0)
y_max, x_max = pts.max(axis=0)
print(f"BBox: X=[{x_min}, {x_max}] (w={x_max-x_min+1}), Y=[{y_min}, {y_max}] (h={y_max-y_min+1})")

# Let's inspect rows:
# Top serifs: at y_min (row 97)
top_row = np.where(mask[y_min, :])[0]
print(f"Top row (y={y_min}) black pixels ranges:")
# Find contiguous segments
diffs = np.diff(top_row)
split_indices = np.where(diffs > 1)[0] + 1
segments = np.split(top_row, split_indices)
for seg in segments:
    print(f"  Segment: x=[{seg[0]}, {seg[-1]}] (width={len(seg)})")

# Bottom serifs: at y_max (row 431)
bottom_row = np.where(mask[y_max, :])[0]
print(f"\nBottom row (y={y_max}) black pixels ranges:")
diffs = np.diff(bottom_row)
split_indices = np.where(diffs > 1)[0] + 1
segments = np.split(bottom_row, split_indices)
for seg in segments:
    print(f"  Segment: x=[{seg[0]}, {seg[-1]}] (width={len(seg)})")

# Middle row (y = (y_min+y_max)//2 = 264)
mid_y = (y_min + y_max) // 2
mid_row = np.where(mask[mid_y, :])[0]
print(f"\nMid row (y={mid_y}) black pixels ranges:")
diffs = np.diff(mid_row)
split_indices = np.where(diffs > 1)[0] + 1
segments = np.split(mid_row, split_indices)
for seg in segments:
    print(f"  Segment: x=[{seg[0]}, {seg[-1]}] (width={len(seg)})")
