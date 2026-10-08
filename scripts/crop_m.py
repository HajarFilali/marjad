from PIL import Image

im = Image.open("public/compare_4_fine_tuned.png")
# Crop just the M area (width 0 to 450, full height)
crop = im.crop((35, 0, 420, 1000))
crop.save("public/compare_4_m_only.png")
print("Saved public/compare_4_m_only.png")
