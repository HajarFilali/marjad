from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
import pathops
import json

var_font = TTFont(r'.next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2')
font = instantiateVariableFont(var_font, {'wght': 750})
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font['hmtx']

word = 'MARJAD'
glyphs = {}

for char in word:
    gname = cmap[ord(char)]
    g = glyph_set[gname]
    adv, lsb = hmtx[gname]
    p = pathops.Path()
    g.draw(pathops.PathPen(p))
    clean_p = pathops.simplify(p)
    
    # Level the bottom of M so the central vertex does not dip below baseline y=0.0
    if char == 'M':
        fixed_p = pathops.Path()
        for verb, pt_tuple in clean_p:
            new_pts = tuple((pt[0], max(pt[1], 0.0)) for pt in pt_tuple)
            if verb == pathops.PathVerb.MOVE:
                fixed_p.moveTo(*new_pts[0])
            elif verb == pathops.PathVerb.LINE:
                fixed_p.lineTo(*new_pts[0])
            elif verb == pathops.PathVerb.QUAD:
                fixed_p.quadTo(*new_pts[0], *new_pts[1])
            elif verb == pathops.PathVerb.CUBIC:
                fixed_p.cubicTo(*new_pts[0], *new_pts[1], *new_pts[2])
            elif verb == pathops.PathVerb.CLOSE:
                fixed_p.close()
        clean_p = pathops.simplify(fixed_p)
    
    glyphs[char] = {
        'path': clean_p,
        'adv': adv,
        'bounds': clean_p.bounds
    }

# Equal optical gap between all letters, exactly matching A -> R (~86.3 units)
target_gap = 86.3

placed_glyphs = []
for i, char in enumerate(word):
    g_info = glyphs[char]
    b = g_info['bounds']
    
    if i == 0:
        origin = 0
    else:
        prev = placed_glyphs[i-1]
        prev_right = prev['origin'] + prev['bounds'][2]
        origin = prev_right + target_gap - b[0]
    
    placed_glyphs.append({
        'char': char,
        'origin': origin,
        'bounds': b,
        'path': g_info['path']
    })

# Draw all letters into combined path
all_paths = pathops.Path()
for g in placed_glyphs:
    t_pen = pathops.PathPen(all_paths)
    g['path'].draw(TransformPen(t_pen, (1, 0, 0, -1, g['origin'], 780)))

min_x, min_y, max_x, max_y = all_paths.bounds
pad = 24
shift_x = -min_x + pad
shift_y = -min_y + pad
final_w = int(max_x - min_x + pad * 2)
final_h = int(max_y - min_y + pad * 2)

# Shift all paths by (shift_x, shift_y)
shifted_all = pathops.Path()
all_pen = pathops.PathPen(shifted_all)
all_paths.draw(TransformPen(all_pen, (1, 0, 0, 1, shift_x, shift_y)))

svg_pen_all = SVGPathPen(glyph_set)
shifted_all.draw(svg_pen_all)
combined_d = svg_pen_all.getCommands()

result = {
    "viewBox": f"0 0 {final_w} {final_h}",
    "width": final_w,
    "height": final_h,
    "d": combined_d
}

with open("src/components/layout/marjadPath.json", "w") as f:
    json.dump(result, f, indent=2)

ts_content = f'''export const MARJAD_PATH_DATA = {{
  viewBox: "0 0 {final_w} {final_h}",
  width: {final_w},
  height: {final_h},
  d: "{combined_d}",
}} as const;
'''
with open("src/components/layout/marjadPath.ts", "w") as f:
    f.write(ts_content)

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {final_w} {final_h}" fill="none">
  <path d="{combined_d}" fill="none" stroke="white" stroke-width="14" stroke-linejoin="round" stroke-linecap="round" />
</svg>'''

with open("public/marjad_outline.svg", "w") as f:
    f.write(svg_content)

print(f"MARJAD updated with leveled M and equal optical spacing!")
print(f"ViewBox: 0 0 {final_w} {final_h}")
print(f"Successfully updated src/components/layout/marjadPath.ts")
