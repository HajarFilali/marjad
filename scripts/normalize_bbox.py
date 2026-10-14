import re
import numpy as np

with open('public/marjad_authentic_logo_perfect.svg', 'r') as f:
    content = f.read()

m = re.search(r'<path d="([^"]+)"', content)
d_str = m.group(1)

tokens = re.findall(r'([a-zA-Z])|([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)', d_str)
coords = []
current_cmd = None
coord_idx = 0

for cmd_match, num_match in tokens:
    if cmd_match:
        current_cmd = cmd_match
        coord_idx = 0
    elif num_match:
        val = float(num_match)
        if current_cmd in ['M', 'L', 'C']:
            if coord_idx % 2 == 0:
                coords.append((val, None))
            else:
                last_x = coords[-1][0]
                coords[-1] = (last_x, val)
            coord_idx += 1

xs = [c[0] for c in coords if c[0] is not None]
ys = [c[1] for c in coords if c[1] is not None]

min_x, max_x = min(xs), max(xs)
min_y, max_y = min(ys), max(ys)
width = max_x - min_x
height = max_y - min_y

print(f"Original bounding box: X=[{min_x:.2f}, {max_x:.2f}], Y=[{min_y:.2f}, {max_y:.2f}]")
print(f"Dimensions: width={width:.2f}, height={height:.2f}, aspect ratio={width/height:.3f}")

# Now let's normalize with padding = 20 on all sides so stroke doesn't get clipped
padding = 20.0
offset_x = min_x - padding
offset_y = min_y - padding
norm_w = int(np.ceil(width + 2 * padding))
norm_h = int(np.ceil(height + 2 * padding))

# Re-tokenize and re-offset
tokens2 = re.findall(r'([a-zA-Z])|([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)', d_str)
norm_tokens = []
current_cmd = None
coord_idx = 0

for cmd_match, num_match in tokens2:
    if cmd_match:
        current_cmd = cmd_match
        norm_tokens.append(current_cmd)
        coord_idx = 0
    elif num_match:
        val = float(num_match)
        if current_cmd in ['M', 'L', 'C']:
            if coord_idx % 2 == 0:
                new_val = val - offset_x
            else:
                new_val = val - offset_y
            norm_tokens.append(f"{new_val:.2f}")
            coord_idx += 1
        else:
            norm_tokens.append(f"{val:.2f}")

normalized_d = " ".join(norm_tokens)
print(f"Normalized viewBox: 0 0 {norm_w} {norm_h}")

with open('public/normalized_marjad.json', 'w') as f:
    import json
    json.dump({
        'viewBox': f"0 0 {norm_w} {norm_h}",
        'width': norm_w,
        'height': norm_h,
        'd': normalized_d
    }, f, indent=2)
print("Saved public/normalized_marjad.json")
