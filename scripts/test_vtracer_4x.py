import vtracer
from PIL import Image, ImageFilter
import numpy as np
import xml.etree.ElementTree as ET

# Load original logo
im = Image.open('public/logo.png')
crop = im.crop((74, 9, 300, 65))

# Upscale 4x with Lanczos
scale = 4
crop_4x = crop.resize((crop.width * scale, crop.height * scale), Image.Resampling.LANCZOS)

# Look at alpha channel
alpha_4x = np.array(crop_4x)[:, :, 3]

# Create a clean binary image with slight blur to remove raster jaggies
mask = Image.fromarray(((alpha_4x > 120).astype(np.uint8)) * 255)
# Very subtle Gaussian blur on 4x image (radius 0.8) then threshold at 128
mask_smooth = mask.filter(ImageFilter.GaussianBlur(radius=0.8))
binary = ((np.array(mask_smooth) > 128).astype(np.uint8)) * 255
binary_im = Image.fromarray(binary)
binary_im.save('public/logo_4x_binary_smooth.png')

# Run vtracer
vtracer.convert_image_to_svg_py('public/logo_4x_binary_smooth.png', 'public/logo_4x_vtracer.svg')
print('Successfully generated public/logo_4x_vtracer.svg')
