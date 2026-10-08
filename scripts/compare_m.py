from fontTools.ttLib import TTFont
from fontTools.pens.transformPen import TransformPen
import pathops
from PIL import Image, ImageDraw

def get_glyph_path(font_path, char):
    f = TTFont(font_path)
    gset = f.getGlyphSet()
    cmap = f.getBestCmap()
    g = gset[cmap[ord(char)]]
    p = pathops.Path()
    g.draw(pathops.PathPen(p))
    return pathops.simplify(p)

fonts = [
    ("Cinzel", r".next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2"),
    ("Playfair", r".next\dev\static\media\2a65768255d6b625-s.p.3u4lli0-axodc.woff2"),
    ("TimesBold", r"C:\Windows\Fonts\timesbd.ttf"),
    ("GeorgiaBold", r"C:\Windows\Fonts\georgiab.ttf"),
]

img = Image.new("RGBA", (1400, 360), (20, 25, 20, 255))
draw = ImageDraw.Draw(img)

for i, (name, fpath) in enumerate(fonts):
    try:
        clean_p = get_glyph_path(fpath, 'M')
        b = clean_p.bounds
        w = b[2] - b[0]
        h = b[3] - b[1]
        scale = 260.0 / h
        
        target_x = 40 + i * 340
        target_y = 50
        
        shifted = pathops.Path()
        # Flip Y and scale
        clean_p.draw(TransformPen(pathops.PathPen(shifted), (scale, 0, 0, -scale, target_x - b[0] * scale, 300 + b[1] * scale)))
        
        for c in shifted.contours:
            sub = pathops.Path()
            c.draw(pathops.PathPen(sub))
            pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
            if len(pts) > 2:
                draw.line(pts, fill=(255, 255, 255, 255), width=2, joint="curve")
        
        draw.text((target_x, 20), name, fill=(200, 200, 200, 255))
    except Exception as e:
        print("Error on", name, e)

img.save("public/compare_m.png")
print("Saved public/compare_m.png successfully!")
