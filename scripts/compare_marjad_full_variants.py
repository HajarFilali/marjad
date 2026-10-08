import pathops
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
from PIL import Image, ImageDraw
from scripts.test_mirrored_cinzel_m import build_mirrored_cinzel_m

# Load Cinzel font
var_font = TTFont(r'.next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2')
f_cinzel = instantiateVariableFont(var_font, {'wght': 750})
cmap = f_cinzel.getBestCmap()
glyf = f_cinzel.getGlyphSet()

def get_glyph_path(ch):
    g = glyf[cmap[ord(ch)]]
    p = pathops.Path()
    g.draw(pathops.PathPen(p))
    return pathops.simplify(p)

path_A = get_glyph_path('A')
path_R = get_glyph_path('R')
path_J = get_glyph_path('J')
path_D = get_glyph_path('D')

# Test different variations of M:
# Variant 1: Mirrored Cinzel left half (thin elegant strokes)
m_v1 = build_mirrored_cinzel_m(xc=475.0, y_bottom=0.0, y_crotch=217.16, junction_x=182.54, junction_y=392.5, tip_half_w=6.0)

# Variant 2: Slightly elevated V (y_bottom = 12.0)
m_v2 = build_mirrored_cinzel_m(xc=475.0, y_bottom=12.0, y_crotch=217.16, junction_x=182.54, junction_y=392.5, tip_half_w=6.0)

# Variant 3: What if diagonal is slightly thicker, like Roman classical?
# In Cinzel, left diagonal had thickness: line from (169.25, 714) down to center,
# inner line was from junction (182.54, 392.5) down to center.
# What if junction is at (195.0, 360.0) or (200.0, 350.0)?
m_v3 = build_mirrored_cinzel_m(xc=475.0, y_bottom=0.0, y_crotch=217.16, junction_x=195.0, junction_y=360.0, tip_half_w=8.0)

variants = [
    ("Variant 1: Level baseline (y=0), xc=475", m_v1),
    ("Variant 2: Elevated V (y=12), xc=475", m_v2),
    ("Variant 3: Stronger diagonal junction", m_v3),
]

img = Image.new("RGBA", (2000, 750), (15, 23, 18, 255))
draw = ImageDraw.Draw(img)

target_gap = 86.3

for v_idx, (v_title, m_path) in enumerate(variants):
    letters = [
        ('M', m_path),
        ('A', path_A),
        ('R', path_R),
        ('J', path_J),
        ('A', path_A),
        ('D', path_D),
    ]
    
    combined = pathops.Path()
    curr_x = 0.0
    
    for i, (ch, p) in enumerate(letters):
        b = p.bounds
        shift_x = curr_x - b[0]
        shifted = pathops.Path()
        p.draw(TransformPen(pathops.PathPen(shifted), (1, 0, 0, 1, shift_x, 0)))
        combined = pathops.op(combined, shifted, pathops.PathOp.UNION)
        new_b = shifted.bounds
        curr_x = new_b[2] + target_gap
        
    combined_clean = pathops.simplify(combined)
    
    # Render to image
    y_base = 200 + v_idx * 240
    scale = 0.3
    b_all = combined_clean.bounds
    
    shifted_render = pathops.Path()
    combined_clean.draw(TransformPen(pathops.PathPen(shifted_render), (scale, 0, 0, -scale, 50 - b_all[0]*scale, y_base)))
    
    for c in shifted_render.contours:
        sub = pathops.Path()
        c.draw(pathops.PathPen(sub))
        pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
        if len(pts) > 2:
            draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")
            
    draw.text((50, y_base - 180), v_title, fill=(240, 210, 140))
    # Draw baseline red reference line
    draw.line([(50, y_base), (1950, y_base)], fill=(255, 60, 60, 120), width=1)

img.save("public/compare_marjad_full_variants.png")
print("Saved public/compare_marjad_full_variants.png successfully!")
