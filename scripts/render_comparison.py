from PIL import Image, ImageDraw
import pathops
from fontTools.pens.transformPen import TransformPen
import sys
sys.path.insert(0, 'scripts')
from compare_5_designs import build_symmetric_m_parametric, path_A, path_R, path_J, path_D

# We want to render a very clear, sharp image comparing original Cinzel M vs new Symmetric M (crotch=240, baseline y=0.0)
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

var_font = TTFont(r'.next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2')
f_cinzel = instantiateVariableFont(var_font, {'wght': 750})
g_orig_m = f_cinzel.getGlyphSet()[f_cinzel.getBestCmap()[ord('M')]]
orig_m_path = pathops.Path()
g_orig_m.draw(pathops.PathPen(orig_m_path))
orig_m_clean = pathops.simplify(orig_m_path)

new_m_clean = build_symmetric_m_parametric(475.0, 0.0, 240.0, bottom_tip_half_w=6.0)

img = Image.new("RGBA", (1800, 800), (12, 17, 14, 255))
draw = ImageDraw.Draw(img)

def render_word(m_path, y_pos, title, is_fixed=False):
    letters = [('M', m_path), ('A', path_A), ('R', path_R), ('J', path_J), ('A', path_A), ('D', path_D)]
    combined = pathops.Path()
    curr_x = 0.0
    target_gap = 86.3
    for ch, p in letters:
        b = p.bounds
        shift_x = curr_x - b[0]
        shifted = pathops.Path()
        p.draw(TransformPen(pathops.PathPen(shifted), (1, 0, 0, 1, shift_x, 0)))
        combined = pathops.op(combined, shifted, pathops.PathOp.UNION)
        curr_x = shifted.bounds[2] + target_gap
    
    clean = pathops.simplify(combined)
    scale = 0.32
    b = clean.bounds
    shifted_render = pathops.Path()
    clean.draw(TransformPen(pathops.PathPen(shifted_render), (scale, 0, 0, -scale, 50 - b[0]*scale, y_pos)))
    
    for c in shifted_render.contours:
        sub = pathops.Path()
        c.draw(pathops.PathPen(sub))
        pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
        if len(pts) > 2:
            color = (255, 255, 255, 255) if is_fixed else (180, 180, 180, 220)
            draw.line(pts, fill=color, width=2, joint="curve")
            
    # Baseline
    draw.line([(50, y_pos), (1750, y_pos)], fill=(230, 70, 70, 120), width=1)
    draw.text((50, y_pos - 240), title, fill=(245, 215, 140, 255))

render_word(orig_m_clean, 300, "1. ORIGINAL CINZEL M (Asymmetric: left foot 212 vs right foot 314, slanted V dipping to y=-21)", False)
render_word(new_m_clean, 680, "2. NEW SYMMETRIC M (Angled Roman: left=right=212, flat level V on baseline y=0, perfectly centered)", True)

img.save("public/compare_before_after_marjad.png")
print("Saved public/compare_before_after_marjad.png successfully!")
