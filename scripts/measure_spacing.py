from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
import pathops

var_font = TTFont(r'.next\dev\static\media\cc014fcb166cf364-s.p.2cu9iw-l3ih8o.woff2')
font = instantiateVariableFont(var_font, {'wght': 750})
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font['hmtx']

word = 'MARJAD'
chars = []

for char in word:
    gname = cmap[ord(char)]
    glyph = glyph_set[gname]
    adv, lsb = hmtx[gname]
    p = pathops.Path()
    glyph.draw(pathops.PathPen(p))
    clean_p = pathops.simplify(p)
    b = clean_p.bounds
    chars.append({
        'char': char,
        'adv': adv,
        'min_x': b[0],
        'max_x': b[2],
        'width': b[2] - b[0]
    })

for c in chars:
    print(f"{c['char']}: min_x={c['min_x']:.1f}, max_x={c['max_x']:.1f}, adv={c['adv']}")

# Let's simulate the previous layout with letter_spacing = 75
cur_x = 0
letter_spacing = 75
positions = []
for c in chars:
    left = cur_x + c['min_x']
    right = cur_x + c['max_x']
    positions.append((c['char'], left, right))
    cur_x += c['adv'] + letter_spacing

print("\nPrevious Layout Letter Gaps (right of letter N to left of letter N+1):")
for i in range(len(positions) - 1):
    c1, l1, r1 = positions[i]
    c2, l2, r2 = positions[i+1]
    gap = l2 - r1
    print(f"Gap between '{c1}' and '{c2}': {gap:.1f} units")
