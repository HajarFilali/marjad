from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
import pathops
from PIL import Image, ImageDraw

var_font = TTFont(r'.next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2')
font = instantiateVariableFont(var_font, {'wght': 750})
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font['hmtx']

word = 'MARJAD'
total_x = 0
letter_spacing = 75

all_paths = pathops.Path()

for char in word:
    gname = cmap[ord(char)]
    glyph = glyph_set[gname]
    adv, lsb = hmtx[gname]
    p = pathops.Path()
    glyph.draw(pathops.PathPen(p))
    clean_p = pathops.simplify(p)
    t_pen = pathops.PathPen(all_paths)
    clean_p.draw(TransformPen(t_pen, (1, 0, 0, -1, total_x, 780)))
    total_x += adv + letter_spacing

min_x, min_y, max_x, max_y = all_paths.bounds
pad = 24
scale = 0.25 # render at 1/4 resolution (approx 1200 x 240)
final_w = int((max_x - min_x + pad * 2) * scale)
final_h = int((max_y - min_y + pad * 2) * scale)

img = Image.new("RGBA", (final_w, final_h), (15, 25, 20, 255))
draw = ImageDraw.Draw(img)

# Shift and scale all contours
shifted = pathops.Path()
s_pen = pathops.PathPen(shifted)
all_paths.draw(TransformPen(s_pen, (scale, 0, 0, scale, (-min_x + pad) * scale, (-min_y + pad) * scale)))

# Stroke each contour with thickness 2-3px
for c in shifted.contours:
    sub = pathops.Path()
    c.draw(pathops.PathPen(sub))
    pts = []
    # approximate verbs into points
    for verb, pt_tuple in sub:
        for pt in pt_tuple:
            pts.append((pt[0], pt[1]))
    if len(pts) > 2:
        draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")

img.save("public/marjad_verified.png")
print("Saved public/marjad_verified.png successfully! Size:", img.size)
