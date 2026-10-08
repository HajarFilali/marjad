from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
import pathops
import json

# 1. Load Cinzel font
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

# 2. Build the Symmetrical Roman M (Angled/Mayla, Left == Right, Level Baseline)
def build_symmetric_cinzel_m(xc=475.0, y_bottom=0.0, crotch_y=240.0, stem_inner_junction_x=182.54, stem_inner_junction_y=392.5, tip_w=12.0):
    p = pathops.Path()
    # Left half contour:
    p.moveTo(xc, crotch_y)
    # Line up to left inner apex:
    p.lineTo(169.25, 714.0)
    # Across apex to outer apex:
    p.lineTo(159.95, 714.0)
    # Down outer flared stem to foot:
    p.lineTo(75.94, 73.0)
    p.lineTo(75.78, 73.0)
    p.quadTo(71.78, 43.0, 50.78, 26.5)
    p.quadTo(29.78, 10.0, 2.78, 10.0)
    p.lineTo(-13.22, 10.0)
    p.lineTo(-13.22, 0.0)
    # Foot on baseline:
    p.lineTo(199.12, 0.0)
    p.lineTo(199.12, 9.0)
    p.lineTo(183.42, 9.0)
    p.quadTo(167.42, 9.0, 155.92, 22.5)
    p.quadTo(144.42, 36.0, 144.42, 52.0)
    p.lineTo(144.42, 56.5)
    # Up to junction between stem and diagonal:
    p.lineTo(stem_inner_junction_x, stem_inner_junction_y)
    # Down diagonal to bottom center V:
    p.lineTo(xc - tip_w / 2.0, y_bottom)
    # Chisel tip level on baseline:
    p.lineTo(xc, y_bottom)
    # Up center axis to inner crotch:
    p.lineTo(xc, crotch_y)
    p.close()
    
    # Mirror across X = xc to create identical right half:
    p_right = pathops.Path()
    p.draw(TransformPen(pathops.PathPen(p_right), (-1, 0, 0, 1, 2 * xc, 0)))
    
    # Combine both halves seamlessly
    union_p = pathops.op(p, p_right, pathops.PathOp.UNION)
    clean_m = pathops.simplify(union_p)
    return clean_m

m_path = build_symmetric_cinzel_m()
path_A = get_glyph_path('A')
path_R = get_glyph_path('R')
path_J = get_glyph_path('J')
path_D = get_glyph_path('D')

# 3. Position all letters with equal optical gap
word_letters = [
    ('M', m_path),
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

# Clean unified silhouette
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

svg_preview = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {final_w} {final_h}" fill="none">
  <rect width="100%" height="100%" fill="#0a0f0d" />
  <path d="{combined_d}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
</svg>'''
with open("public/marjad_symmetric_preview.svg", "w", encoding="utf-8") as f:
    f.write(svg_preview)

print(f"Generated MARJAD with Symmetrical Angled Roman M!")
print(f"viewBox: 0 0 {final_w} {final_h}")
print(f"Bounds: min=({min_x}, {min_y}), max=({max_x}, {max_y})")
print(f"Letter M bounds: {m_path.bounds}")
