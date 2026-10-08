import pathops
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.transformPen import TransformPen
from PIL import Image, ImageDraw

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

# In Cinzel letter 'A':
# Let's inspect the stroke thickness of 'A':
# 'A' has a thin left leg and a thick right leg (or vice versa in Roman).
# Let's see 'A' bounds and stroke thickness:
print("'A' bounds:", path_A.bounds)

def build_symmetric_m_parametric(
    xc=475.0,
    y_bottom=0.0,
    crotch_y=240.0,
    apex_outer_x=159.95,
    apex_inner_x=169.25,
    foot_outer_x=-13.22,
    foot_inner_x=199.12,
    stem_inner_junction_x=182.54,
    stem_inner_junction_y=392.5,
    diag_inner_apex_x=None,
    diag_stroke_width=90.0,
    bottom_tip_half_w=6.0,
):
    # If diag_inner_apex_x is None, use apex_inner_x
    if diag_inner_apex_x is None:
        diag_inner_apex_x = apex_inner_x
        
    # We construct the left half:
    # 1. Left outer leg (Cinzel's exact graceful flare and serifs)
    p = pathops.Path()
    
    # Start at top center crotch (xc, crotch_y)
    p.moveTo(xc, crotch_y)
    # Line up to inner apex of left diagonal:
    p.lineTo(diag_inner_apex_x, 714.0)
    # Across apex to outer apex:
    p.lineTo(apex_outer_x, 714.0)
    # Down outer stem:
    p.lineTo(75.94, 73.0)
    p.lineTo(75.78, 73.0)
    p.quadTo(71.78, 43.0, 50.78, 26.5)
    p.quadTo(29.78, 10.0, 2.78, 10.0)
    p.lineTo(foot_outer_x, 10.0)
    p.lineTo(foot_outer_x, 0.0)
    p.lineTo(foot_inner_x, 0.0)
    p.lineTo(foot_inner_x, 9.0)
    p.lineTo(183.42, 9.0)
    p.quadTo(167.42, 9.0, 155.92, 22.5)
    p.quadTo(144.42, 36.0, 144.42, 52.0)
    p.lineTo(144.42, 56.5)
    
    # From inner foot up to stem-diagonal junction:
    p.lineTo(stem_inner_junction_x, stem_inner_junction_y)
    
    # Down diagonal to bottom center V:
    p.lineTo(xc - bottom_tip_half_w, y_bottom)
    # Flat level bottom on baseline:
    p.lineTo(xc, y_bottom)
    # Up center axis to crotch:
    p.lineTo(xc, crotch_y)
    p.close()
    
    # Mirror across X = xc:
    p_right = pathops.Path()
    p.draw(TransformPen(pathops.PathPen(p_right), (-1, 0, 0, 1, 2*xc, 0)))
    
    union_p = pathops.op(p, p_right, pathops.PathOp.UNION)
    clean_p = pathops.simplify(union_p)
    return clean_p

# Let's create multiple variations:
configs = [
    # Label, xc, y_bottom, crotch_y, stem_j_x, stem_j_y, tip_half_w
    ("Design A: Classic Roman (crotch=240, junction=182, tip=6)", 475.0, 0.0, 240.0, 182.54, 392.5, 6.0),
    ("Design B: Higher Crotch (crotch=280, junction=185, tip=6)", 475.0, 0.0, 280.0, 185.0, 380.0, 6.0),
    ("Design C: Deep Crotch (crotch=200, junction=180, tip=6)", 475.0, 0.0, 200.0, 180.0, 400.0, 6.0),
    ("Design D: Slightly elevated V (y=10.0, crotch=250)", 475.0, 10.0, 250.0, 182.54, 392.5, 6.0),
    ("Design E: Symmetrical Wider Center (xc=485, crotch=240)", 485.0, 0.0, 240.0, 185.0, 390.0, 6.0),
]

img = Image.new("RGBA", (2000, 1200), (15, 23, 18, 255))
draw = ImageDraw.Draw(img)

target_gap = 86.3

for idx, (label, xc, yb, cy, sjx, sjy, thw) in enumerate(configs):
    m_p = build_symmetric_m_parametric(
        xc=xc, y_bottom=yb, crotch_y=cy,
        stem_inner_junction_x=sjx, stem_inner_junction_y=sjy,
        bottom_tip_half_w=thw
    )
    
    letters = [('M', m_p), ('A', path_A), ('R', path_R), ('J', path_J), ('A', path_A), ('D', path_D)]
    combined = pathops.Path()
    curr_x = 0.0
    for ch, p in letters:
        b = p.bounds
        shift_x = curr_x - b[0]
        shifted = pathops.Path()
        p.draw(TransformPen(pathops.PathPen(shifted), (1, 0, 0, 1, shift_x, 0)))
        combined = pathops.op(combined, shifted, pathops.PathOp.UNION)
        curr_x = shifted.bounds[2] + target_gap
    
    combined_clean = pathops.simplify(combined)
    
    scale = 0.28
    y_base = 180 + idx * 220
    b_all = combined_clean.bounds
    
    shifted_render = pathops.Path()
    combined_clean.draw(TransformPen(pathops.PathPen(shifted_render), (scale, 0, 0, -scale, 40 - b_all[0]*scale, y_base)))
    
    for c in shifted_render.contours:
        sub = pathops.Path()
        c.draw(pathops.PathPen(sub))
        pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
        if len(pts) > 2:
            draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")
            
    draw.text((40, y_base - 160), label, fill=(240, 210, 140))
    draw.line([(40, y_base), (1960, y_base)], fill=(255, 50, 50, 100), width=1)

img.save("public/compare_5_designs.png")
print("Saved public/compare_5_designs.png successfully!")
