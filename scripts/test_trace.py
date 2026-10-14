import vtracer
from PIL import Image, ImageFilter
import numpy as np
import os

im = Image.open('public/logo.png')
crop = im.crop((74, 9, 300, 65))
scale = 8
crop_large = crop.resize((crop.width * scale, crop.height * scale), Image.Resampling.LANCZOS)
arr_large = np.array(crop_large)
alpha_large = arr_large[:, :, 3]

for thresh in [60, 90, 120]:
    mask = (alpha_large > thresh).astype(np.uint8) * 255
    mask_im = Image.fromarray(mask)
    mask_smooth = mask_im.filter(ImageFilter.GaussianBlur(radius=1.2))
    binary_smooth = ((np.array(mask_smooth) > 128).astype(np.uint8)) * 255
    out_png = f'public/test_mask_{thresh}.png'
    Image.fromarray(binary_smooth).save(out_png)
    out_svg = f'public/test_trace_{thresh}.svg'
    try:
        vtracer.convert_image_to_svg_py(
            out_png,
            out_svg,
            colormode='binary',
            mode='spline',
            filter_speckle=4,
            corner_threshold=60,
            length_threshold=4.0,
            splice_threshold=45,
            path_precision=2
        )
        print(f'Successfully created {out_svg}')
    except Exception as e:
        print(f'Error on thresh {thresh}: {e}')
