from PIL import Image

im = Image.open("public/test_user_m_marjad.png")
# Crop just letter M
crop = im.crop((40, 50, 420, 480))
crop.save("public/test_user_m_closeup.png")
print("Saved public/test_user_m_closeup.png!")
