svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 260" width="100%" height="100%">
  <image href="/marjad-footer-4x.png" width="1200" height="260" preserveAspectRatio="xMidYMid meet" />
</svg>'''

with open('public/marjad-footer.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("Saved public/marjad-footer.svg")
