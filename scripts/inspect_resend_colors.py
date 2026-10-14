import urllib.request, re

req = urllib.request.Request('https://resend.com', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
js_files = re.findall(r'/_next/static/chunks/[^"\'>\s]+\.js', html)
print('Found chunks:', len(js_files))

for js in js_files:
    try:
        url = 'https://resend.com' + js
        content = urllib.request.urlopen(url).read().decode('utf-8')
        if 'radialGradient' in content or 'cursor-glow' in content or 'WORDMARK' in content:
            print('Found target in:', js)
            # Find all stop colors or svg elements
            for line in content.split(';'):
                if 'stopColor' in line or 'stop-color' in line or 'radialGradient' in line:
                    print('GRADIENT LINE:', line[:300])
                if 'WORDMARK' in line:
                    print('WORDMARK LINE:', line[:300])
    except Exception as e:
        pass
