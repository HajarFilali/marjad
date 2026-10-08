import numpy as np
from PIL import Image, ImageDraw
from skimage import measure
import pathops
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
import json

# 1. Load Cinzel font for A, R, J, D
var_font = TTFont(r'.next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2')
font = instantiateVariableFont(var_font, {'wght': 750})
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()

def get_glyph_path(ch):
    gname = cmap[ord(ch)]
    g = glyph_set[gname]
    p = pathops.Path()
    g.draw(pathops.PathPen(p))
    return pathops.simplify(p)

path_A = get_glyph_path('A')
path_R = get_glyph_path('R')
path_J = get_glyph_path('J')
path_D = get_glyph_path('D')

# 2. Extract and refine the exact M from the user's uploaded image
img = Image.open(r'C:\Users\HAJAR\.gemini\antigravity-ide\brain\58dddefe-9296-42a7-8837-e566d95fa3db\.user_uploaded\media_1791234497269.png').convert('L')
arr = np.array(img)
binary = (arr < 128).astype(float)
contours = measure.find_contours(binary, 0.5)
c = contours[0]

scale = 714.0 / 335.0
poly = measure.approximate_polygon(c, tolerance=0.5)

xs = [(col - 125.5)*scale for r, col in poly]
ys = [(431.5 - r)*scale for r, col in poly]

# Subtle snapping for perfection
snapped_xs = []
snapped_ys = []
for x, y in zip(xs, ys):
    if abs(y) < 3.0:
        y = 0.0
    elif abs(y - 714.0) < 3.0:
        y = 714.0
    if abs(x - 103.4) < 2.5:
        x = 103.4
    elif abs(x - 870.7) < 2.5:
        x = 870.7
    snapped_xs.append(x)
    snapped_ys.append(y)

p_m = pathops.Path()
p_m.moveTo(snapped_xs[0], snapped_ys[0])
for x, y in zip(snapped_xs[1:], snapped_ys[1:]):
    p_m.lineTo(x, y)
p_m.close()
clean_m = pathops.simplify(p_m)

# 3. Position MARJAD letters with equal optical gap (86.3 units)
word_letters = [
    ('M', clean_m),
    ('A', path_A),
    ('R', path_R),
    ('J', path_J),
    ('A', path_A),
    ('D', path_D)
]

target_gap = 86.3
placed = []

for i, (char, p) in enumerate(word_letters):
    b = p.bounds
    if i == 0:
        origin = -b[0]
    else:
        prev = placed[i-1]
        prev_right = prev['origin'] + prev['bounds'][2]
        origin = prev_right + target_gap - b[0]
    placed.append({
        'char': char,
        'path': p,
        'bounds': b,
        'origin': origin
    })

# Draw all letters flipped vertically for SVG coordinates (Y down)
all_paths = pathops.Path()
for item in placed:
    t_pen = pathops.PathPen(all_paths)
    item['path'].draw(TransformPen(t_pen, (1, 0, 0, -1, item['origin'], 780)))

clean_all = pathops.simplify(all_paths)

min_x, min_y, max_x, max_y = clean_all.bounds
pad = 24
shift_x = -min_x + pad
shift_y = -min_y + pad
final_w = int(max_x - min_x + pad * 2)
final_h = int(max_y - min_y + pad * 2)

shifted_final = pathops.Path()
clean_all.draw(TransformPen(pathops.PathPen(shifted_final), (1, 0, 0, 1, shift_x, shift_y)))
shifted_clean = pathops.simplify(shifted_final)

svg_pen = SVGPathPen(None)
shifted_clean.draw(svg_pen)
combined_d = svg_pen.getCommands()

result = {
    "viewBox": f"0 0 {final_w} {final_h}",
    "width": final_w,
    "height": final_h,
    "d": combined_d
}

with open("src/components/layout/marjadPath.json", "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2)

ts_content = f'''export const MARJAD_PATH_DATA = {{
  viewBox: "0 0 {final_w} {final_h}",
  width: {final_w},
  height: {final_h},
  d: "{combined_d}",
}} as const;
'''
with open("src/components/layout/marjadPath.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

# Render high-res preview
img_preview = Image.new("RGBA", (1400, 360), (8, 12, 10, 255))
draw = ImageDraw.Draw(img_preview)

scale_r = 1400 / float(final_w) * 0.95
b = shifted_clean.bounds
x_offset = (1400 - (b[2] - b[0]) * scale_r) / 2.0
y_offset = (360 - (b[3] - b[1]) * scale_r) / 2.0

render_path = pathops.Path()
shifted_clean.draw(TransformPen(pathops.PathPen(render_path), (scale_r, 0, 0, scale_r, x_offset - b[0]*scale_r, y_offset - b[1]*scale_r)))

for c_path in render_path.contours:
    sub = pathops.Path()
    c_path.draw(pathops.PathPen(sub))
    pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
    if len(pts) > 2:
        draw.line(pts, fill=(255, 255, 255, 240), width=2, joint="curve")

img_preview.save("public/marjad_exact_user_m_preview.png")

print(f"Generated MARJAD with exact User-Provided M!")
print(f"viewBox: 0 0 {final_w} {final_h}")
print(f"Letter M bounds: {clean_m.bounds}")
print("Saved public/marjad_exact_user_m_preview.png successfully!")
