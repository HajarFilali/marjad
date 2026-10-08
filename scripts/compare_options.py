from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
import pathops
from PIL import Image, ImageDraw

def render_word(font_path, wght, is_var=False):
    f = TTFont(font_path)
    if is_var:
        f = instantiateVariableFont(f, {'wght': wght})
    gset = f.getGlyphSet()
    cmap = f.getBestCmap()
    
    word = 'MARJAD'
    glyphs = []
    for c in word:
        g = gset[cmap[ord(c)]]
        p = pathops.Path()
        g.draw(pathops.PathPen(p))
        clean_p = pathops.simplify(p)
        glyphs.append((c, clean_p, clean_p.bounds))
    
    target_gap = 86.3
    placed = []
    for i, (c, p, b) in enumerate(glyphs):
        if i == 0:
            origin = 0
        else:
            prev = placed[i-1]
            prev_r = prev[2] + prev[3][2]
            origin = prev_r + target_gap - b[0]
        placed.append((c, p, origin, b))
    
    all_p = pathops.Path()
    for c, p, origin, b in placed:
        t_pen = pathops.PathPen(all_p)
        p.draw(TransformPen(t_pen, (1, 0, 0, -1, origin, 780)))
    
    return all_p

# 1. Playfair Display
p_playfair = render_word(r".next\dev\static\media\2a65768255d6b625-s.p.3u4lli0-axodc.woff2", 700)

# 2. Cinzel with Playfair's M
# Let's create a hybrid: Cinzel for A, R, J, A, D, and Playfair for M
f_cinzel = instantiateVariableFont(TTFont(r".next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2"), {'wght': 750})
f_playfair = TTFont(r".next\dev\static\media\2a65768255d6b625-s.p.3u4lli0-axodc.woff2")

g_cinzel = f_cinzel.getGlyphSet()
c_cinzel = f_cinzel.getBestCmap()
g_playfair = f_playfair.getGlyphSet()
c_playfair = f_playfair.getBestCmap()

# Extract Playfair M and scale its height to match Cinzel cap height (~714)
p_m = pathops.Path()
g_playfair[c_playfair[ord('M')]].draw(pathops.PathPen(p_m))
clean_m = pathops.simplify(p_m)
bm = clean_m.bounds
hm = bm[3] - bm[1]
scale_m = 714.0 / hm
scaled_m = pathops.Path()
clean_m.draw(TransformPen(pathops.PathPen(scaled_m), (scale_m, 0, 0, scale_m, -bm[0]*scale_m, -bm[1]*scale_m)))
scaled_m = pathops.simplify(scaled_m)

# Let's place scaled_m with Cinzel ARJAD
target_gap = 86.3
hybrid_placed = [('M', scaled_m, 0, scaled_m.bounds)]

for char in 'ARJAD':
    g = g_cinzel[c_cinzel[ord(char)]]
    p = pathops.Path()
    g.draw(pathops.PathPen(p))
    clean_p = pathops.simplify(p)
    b = clean_p.bounds
    prev = hybrid_placed[-1]
    prev_r = prev[2] + prev[3][2]
    origin = prev_r + target_gap - b[0]
    hybrid_placed.append((char, clean_p, origin, b))

all_hybrid = pathops.Path()
for c, p, origin, b in hybrid_placed:
    t_pen = pathops.PathPen(all_hybrid)
    p.draw(TransformPen(t_pen, (1, 0, 0, -1, origin, 780)))

# Render comparison image
img = Image.new("RGBA", (1300, 500), (18, 24, 20, 255))
draw = ImageDraw.Draw(img)

# Draw Hybrid (Cinzel with Playfair M)
scale = 0.22
b_hyb = all_hybrid.bounds
shifted_hyb = pathops.Path()
all_hybrid.draw(TransformPen(pathops.PathPen(shifted_hyb), (scale, 0, 0, scale, 40 - b_hyb[0]*scale, 40 - b_hyb[1]*scale)))
for c in shifted_hyb.contours:
    sub = pathops.Path()
    c.draw(pathops.PathPen(sub))
    pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
    if len(pts) > 2:
        draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")
draw.text((40, 20), "Option A: Cinzel with Perfectly Straight Royal M (Playfair M)", fill=(200, 200, 200))

# Draw Playfair Full Word
b_pf = p_playfair.bounds
shifted_pf = pathops.Path()
p_playfair.draw(TransformPen(pathops.PathPen(shifted_pf), (scale, 0, 0, scale, 40 - b_pf[0]*scale, 280 - b_pf[1]*scale)))
for c in shifted_pf.contours:
    sub = pathops.Path()
    c.draw(pathops.PathPen(sub))
    pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
    if len(pts) > 2:
        draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")
draw.text((40, 260), "Option B: Playfair Display Full Word (Classic Luxury)", fill=(200, 200, 200))

img.save("public/test_options.png")
print("Saved public/test_options.png successfully!")
