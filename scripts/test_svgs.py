import sys
sys.path.insert(0, 'scripts')
from compare_5_designs import build_symmetric_m_parametric, path_A, path_R, path_J, path_D
import pathops
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen

# Let's compare crotch_y = 217 vs 240 vs 260
# and y_bottom = 0.0 vs y_bottom = 10.0

m_217 = build_symmetric_m_parametric(475.0, 0.0, 217.16, bottom_tip_half_w=6.0)
m_240 = build_symmetric_m_parametric(475.0, 0.0, 240.0, bottom_tip_half_w=6.0)
m_260 = build_symmetric_m_parametric(475.0, 0.0, 260.0, bottom_tip_half_w=6.0)

def generate_svg(m_path, filename):
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
    # Flip vertically for SVG coordinate system (Y down)
    b = clean.bounds
    # We want SVG height around 850
    # Transform: y -> 725 - y
    flipped = pathops.Path()
    clean.draw(TransformPen(pathops.PathPen(flipped), (1, 0, 0, -1, -b[0] + 50, 750)))
    
    svg_pen = SVGPathPen(None)
    flipped.draw(svg_pen)
    d = svg_pen.getCommands()
    
    fb = flipped.bounds
    vw = int(fb[2] + 50)
    vh = int(fb[3] + 50)
    
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vw} {vh}" width="100%" height="100%" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
  <path d="{d}" />
</svg>'''
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"Generated {filename}, viewBox 0 0 {vw} {vh}")

generate_svg(m_217, "public/test_marjad_m217.svg")
generate_svg(m_240, "public/test_marjad_m240.svg")
generate_svg(m_260, "public/test_marjad_m260.svg")
