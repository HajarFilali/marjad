from PIL import Image

im = Image.open("public/compare_5_designs.png")
# Crop the left portion showing M and A for each design:
# Each design has height ~ 220
# Width 0 to 800 covers M and A
crop = im.crop((30, 0, 750, 1200))
crop.save("public/compare_m_a_closeup.png")
print("Saved public/compare_m_a_closeup.png!")
