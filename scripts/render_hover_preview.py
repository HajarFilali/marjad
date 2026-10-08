from PIL import Image, ImageDraw, ImageFilter
import numpy as np

# Let's test the visual effect of rendering the border with intense neon glow vs faint glow
# Canvas size: 800 x 300, dark background matching footer
bg_color = (15, 18, 16, 255)
img = Image.new("RGBA", (1400, 400), bg_color)
draw = ImageDraw.Draw(img)

# We can render MARJAD using PIL and apply gaussian blurs to simulate SVG drop-shadows
from scripts.generate_final_marjad import shifted_clean
import pathops
from fontTools.pens.transformPen import TransformPen

scale = 1400 / 4890.0 * 0.92
b = shifted_clean.bounds
x_off = (1400 - (b[2] - b[0]) * scale) / 2.0
y_off = (400 - (b[3] - b[1]) * scale) / 2.0

render_path = pathops.Path()
shifted_clean.draw(TransformPen(pathops.PathPen(render_path), (scale, 0, 0, scale, x_off - b[0]*scale, y_off - b[1]*scale)))

# Base layer
base_img = Image.new("RGBA", (1400, 400), (0, 0, 0, 0))
base_draw = ImageDraw.Draw(base_img)
for c in render_path.contours:
    sub = pathops.Path()
    c.draw(pathops.PathPen(sub))
    pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
    if len(pts) > 2:
        base_draw.line(pts, fill=(255, 255, 255, 160), width=2, joint="curve")

# Glow layer over M (x around 100 to 350)
glow_wide = Image.new("RGBA", (1400, 400), (0, 0, 0, 0))
glow_wide_draw = ImageDraw.Draw(glow_wide)

for c in render_path.contours:
    sub = pathops.Path()
    c.draw(pathops.PathPen(sub))
    pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
    if len(pts) > 2:
        glow_wide_draw.line(pts, fill=(212, 168, 83, 255), width=10, joint="curve")
glow_wide = glow_wide.filter(ImageFilter.GaussianBlur(12))

glow_mid = Image.new("RGBA", (1400, 400), (0, 0, 0, 0))
glow_mid_draw = ImageDraw.Draw(glow_mid)
for c in render_path.contours:
    sub = pathops.Path()
    c.draw(pathops.PathPen(sub))
    pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
    if len(pts) > 2:
        glow_mid_draw.line(pts, fill=(255, 255, 255, 255), width=6, joint="curve")
glow_mid = glow_mid.filter(ImageFilter.GaussianBlur(5))

glow_core = Image.new("RGBA", (1400, 400), (0, 0, 0, 0))
glow_core_draw = ImageDraw.Draw(glow_core)
for c in render_path.contours:
    sub = pathops.Path()
    c.draw(pathops.PathPen(sub))
    pts = [pt for verb, pt_tuple in sub for pt in pt_tuple]
    if len(pts) > 2:
        glow_core_draw.line(pts, fill=(255, 255, 255, 255), width=3, joint="curve")

# Composite base
final_img = Image.alpha_composite(img, base_img)

# Mask for M (spotlight centered at M: x=220, y=200, r=180)
mask_img = Image.new("L", (1400, 400), 0)
mask_draw = ImageDraw.Draw(mask_img)
for r in range(180, 0, -5):
    alpha = int(255 * (1 - r/180.0)**0.8)
    mask_draw.ellipse([220 - r, 200 - r, 220 + r, 200 + r], fill=alpha)

# Apply glow through mask
glow_combo = Image.alpha_composite(glow_wide, glow_mid)
glow_combo = Image.alpha_composite(glow_combo, glow_core)

final_img.paste(glow_combo, (0, 0), mask_img)
final_img.save("public/render_hover_preview.png")
print("Saved public/render_hover_preview.png successfully!")
