from PIL import Image
import numpy as np

img = Image.open(r'C:\Users\HAJAR\.gemini\antigravity-ide\brain\58dddefe-9296-42a7-8837-e566d95fa3db\.user_uploaded\media_1791234497269.png').convert('L')
arr = np.array(img)
mask = arr < 128

scale = 714.0 / 335.0

# 1. Height range:
# y_min = 96.5, y_max = 431.5
# Map to: Y_font = (431.5 - row) * scale, X_font = (col - 125.5) * scale

# 2. Measure stem X positions between rows 180 and 350 (straight vertical stem zone)
left_outer_x = []
left_inner_x = []
right_inner_x = []
right_outer_x = []

for r in range(220, 320):
    row_pts = np.where(mask[r, :])[0]
    diffs = np.diff(row_pts)
    split_indices = np.where(diffs > 1)[0] + 1
    segs = np.split(row_pts, split_indices)
    if len(segs) == 4:
        left_outer_x.append(segs[0][0])
        left_inner_x.append(segs[0][-1])
        right_inner_x.append(segs[3][0])
        right_outer_x.append(segs[3][-1])

print(f"Left outer stem col: {np.mean(left_outer_x):.1f} -> X_font = {(np.mean(left_outer_x) - 125.5)*scale:.1f}")
print(f"Left inner stem col: {np.mean(left_inner_x):.1f} -> X_font = {(np.mean(left_inner_x) - 125.5)*scale:.1f}")
print(f"Right inner stem col: {np.mean(right_inner_x):.1f} -> X_font = {(np.mean(right_inner_x) - 125.5)*scale:.1f}")
print(f"Right outer stem col: {np.mean(right_outer_x):.1f} -> X_font = {(np.mean(right_outer_x) - 125.5)*scale:.1f}")

# Serif widths at row 97 (top) and row 431 (bottom)
top_pts = np.where(mask[97, :])[0]
diffs = np.diff(top_pts)
segs_top = np.split(top_pts, np.where(diffs > 1)[0] + 1)
print(f"\nTop-left serif: [{segs_top[0][0]}, {segs_top[0][-1]}] -> X_font = [{(segs_top[0][0]-125.5)*scale:.1f}, {(segs_top[0][-1]-125.5)*scale:.1f}]")
print(f"Top-right serif: [{segs_top[1][0]}, {segs_top[1][-1]}] -> X_font = [{(segs_top[1][0]-125.5)*scale:.1f}, {(segs_top[1][-1]-125.5)*scale:.1f}]")

bottom_pts = np.where(mask[431, :])[0]
diffs = np.diff(bottom_pts)
segs_bot = np.split(bottom_pts, np.where(diffs > 1)[0] + 1)
print(f"\nBottom-left serif: [{segs_bot[0][0]}, {segs_bot[0][-1]}] -> X_font = [{(segs_bot[0][0]-125.5)*scale:.1f}, {(segs_bot[0][-1]-125.5)*scale:.1f}]")
print(f"Bottom V chisel tip: [{segs_bot[1][0]}, {segs_bot[1][-1]}] -> X_font = [{(segs_bot[1][0]-125.5)*scale:.1f}, {(segs_bot[1][-1]-125.5)*scale:.1f}]")
print(f"Bottom-right serif: [{segs_bot[2][0]}, {segs_bot[2][-1]}] -> X_font = [{(segs_bot[2][0]-125.5)*scale:.1f}, {(segs_bot[2][-1]-125.5)*scale:.1f}]")

# Top crotch position
# Find the lowest row of the top central white space (where black starts between the diagonals)
for r in range(250, 360):
    row_pts = np.where(mask[r, :])[0]
    diffs = np.diff(row_pts)
    segs = np.split(row_pts, np.where(diffs > 1)[0] + 1)
    if len(segs) < 4:
        print(f"\nTop crotch row: {r-1} -> Y_font = {(431.5 - (r-1))*scale:.1f}, cols = [{segs[1][0]}, {segs[1][-1]}] -> X_font = [{(segs[1][0]-125.5)*scale:.1f}, {(segs[1][-1]-125.5)*scale:.1f}]")
        break
