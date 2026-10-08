from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
import pathops
from PIL import Image, ImageDraw

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
    
    # If M, level the bottom points so nothing dips below y=0.0
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

# Desired uniform optical gap matching the gap between A and R (~86.3 units)
target_gap = 86.3

# Calculate position of each letter sequentially based on right edge of previous letter
# x_pos is the translation origin for the glyph
placed_glyphs = []
cur_origin = 0

for i, char in enumerate(word):
    g_info = glyphs[char]
    b = g_info['bounds'] # (min_x, min_y, max_x, max_y)
    
    if i == 0:
        # First letter (M) at origin 0
        origin = 0
    else:
        # Distance from previous letter's right edge
        prev = placed_glyphs[i-1]
        prev_right = prev['origin'] + prev['bounds'][2]
        # Current letter's left edge will be at prev_right + target_gap
        # current_left = origin + b[0] => origin = prev_right + target_gap - b[0]
        origin = prev_right + target_gap - b[0]
    
    placed_glyphs.append({
        'char': char,
        'origin': origin,
        'bounds': b,
        'path': g_info['path']
    })

print("Optical Gaps between letters:")
for i in range(len(placed_glyphs) - 1):
    c1 = placed_glyphs[i]
    c2 = placed_glyphs[i+1]
    r1 = c1['origin'] + c1['bounds'][2]
    l2 = c2['origin'] + c2['bounds'][0]
    gap = l2 - r1
    print(f"  Gap '{c1['char']}' -> '{c2['char']}': {gap:.1f} units (Origin of {c2['char']}: {c2['origin']:.1f})")

# Render combined path
all_paths = pathops.Path()
for g in placed_glyphs:
    t_pen = pathops.PathPen(all_paths)
    g['path'].draw(TransformPen(t_pen, (1, 0, 0, -1, g['origin'], 780)))

min_x, min_y, max_x, max_y = all_paths.bounds
pad = 24
scale = 0.25
w = int((max_x - min_x + pad * 2) * scale)
h = int((max_y - min_y + pad * 2) * scale)

img = Image.new("RGBA", (w, h), (15, 25, 20, 255))
draw = ImageDraw.Draw(img)

shifted = pathops.Path()
all_paths.draw(TransformPen(pathops.PathPen(shifted), (scale, 0, 0, scale, (-min_x + pad) * scale, (-min_y + pad) * scale)))

for c in shifted.contours:
    sub = pathops.Path()
    c.draw(pathops.PathPen(sub))
    pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
    if len(pts) > 2:
        draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")

img.save("public/marjad_optical_preview.png")
print("Saved public/marjad_optical_preview.png successfully! Dimensions:", img.size)
