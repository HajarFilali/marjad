import urllib.request, re

data = urllib.request.urlopen("https://resend.com/_next/static/immutable/chunks/1sb_mwcpcpurv.js").read().decode("utf-8")
pos = data.find("WORDMARK_PATH")
chunk = data[max(0, pos-8000):pos]
for item in chunk.split(";"):
    if "0 0 " in item:
        print("VIEWBOX LINE:", item)
