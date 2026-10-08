from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
import pathops
from PIL import Image, ImageDraw

var_font = TTFont(r'.next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2')
f_cinzel = instantiateVariableFont(var_font, {'wght': 750})
g_cinzel = f_cinzel.getGlyphSet()
c_cinzel = f_cinzel.getBestCmap()

f_playfair = TTFont(r".next\dev\static\media\2a65768255d6b625-s.p.3u4lli0-axodc.woff2")
g_playfair = f_playfair.getGlyphSet()
c_playfair = f_playfair.getBestCmap()

# Extract Playfair M scaled to 714
p_pf = pathops.Path()
g_playfair[c_playfair[ord('M')]].draw(pathops.PathPen(p_pf))
clean_pf = pathops.simplify(p_pf)
b_pf = clean_pf.bounds
s_pf = 714.0 / (b_pf[3] - b_pf[1])
m_pf = pathops.Path()
clean_pf.draw(TransformPen(pathops.PathPen(m_pf), (s_pf, 0, 0, s_pf, -b_pf[0]*s_pf, -b_pf[1]*s_pf)))
m_pf = pathops.simplify(m_pf)

# Design 2: Trajan / Times Bold M (Roman upright with classical serifs)
f_times = TTFont(r"C:\Windows\Fonts\timesbd.ttf")
p_tb = pathops.Path()
f_times.getGlyphSet()[f_times.getBestCmap()[ord('M')]].draw(pathops.PathPen(p_tb))
clean_tb = pathops.simplify(p_tb)
b_tb = clean_tb.bounds
s_tb = 714.0 / (b_tb[3] - b_tb[1])
m_tb = pathops.Path()
clean_tb.draw(TransformPen(pathops.PathPen(m_tb), (s_tb, 0, 0, s_tb, -b_tb[0]*s_tb, -b_tb[1]*s_tb)))
m_tb = pathops.simplify(m_tb)

# Design 3: Symmetrized Cinzel M with centered V lifted above baseline
p_cin = pathops.Path()
g_cinzel[c_cinzel[ord('M')]].draw(pathops.PathPen(p_cin))
clean_cin = pathops.simplify(p_cin)

# Render comparison
img = Image.new("RGBA", (1400, 450), (18, 24, 20, 255))
draw = ImageDraw.Draw(img)

def render_m(p, title, x_off):
    scale = 0.35
    b = p.bounds
    shifted = pathops.Path()
    p.draw(TransformPen(pathops.PathPen(shifted), (scale, 0, 0, -scale, x_off - b[0]*scale, 380 + b[1]*scale)))
    for c in shifted.contours:
        sub = pathops.Path()
        c.draw(pathops.PathPen(sub))
        pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
        if len(pts) > 2:
            draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")
    draw.text((x_off, 25), title, fill=(220, 220, 220))

render_m(m_pf, "1. Playfair M (Bilateral horizontal serifs, floating centered V)", 40)
render_m(m_tb, "2. Roman Classical M (Times Bold, upright columns)", 520)
render_m(clean_cin, "3. Current Cinzel M (pointed needle tip at floor)", 1000)

img.save("public/compare_three_m.png")
print("Saved public/compare_three_m.png successfully!")
