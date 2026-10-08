import pathops
from fontTools.pens.transformPen import TransformPen
from PIL import Image, ImageDraw
import json

with open("src/components/layout/marjadPath.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Let's render the exact final SVG path into a PNG image preview
img = Image.new("RGBA", (1400, 360), (8, 12, 10, 255))
draw = ImageDraw.Draw(img)

# We can render the path directly from our clean_all in generate_final_marjad
from scripts.generate_final_marjad import shifted_clean

scale = 1400 / 4891.0 * 0.95
b = shifted_clean.bounds
x_offset = (1400 - (b[2] - b[0]) * scale) / 2.0
y_offset = (360 - (b[3] - b[1]) * scale) / 2.0

render_path = pathops.Path()
shifted_clean.draw(TransformPen(pathops.PathPen(render_path), (scale, 0, 0, scale, x_offset - b[0]*scale, y_offset - b[1]*scale)))

for c in render_path.contours:
    sub = pathops.Path()
    c.draw(pathops.PathPen(sub))
    pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
    if len(pts) > 2:
        draw.line(pts, fill=(255, 255, 255, 220), width=2, joint="curve")

img.save("public/marjad_footer_preview.png")
print("Saved public/marjad_footer_preview.png successfully!")
