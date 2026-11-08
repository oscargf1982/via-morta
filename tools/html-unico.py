#!/usr/bin/env python3
"""Empaqueta el juego en un único HTML: scripts dentro e imágenes en base64 (IMG_INLINE).
Uso: python3 tools/html-unico.py [salida.html]   (por defecto: dist/via-morta.html)"""
import base64, glob, json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'dist', 'via-morta.html')
def uri(rel):
    ext = rel.rsplit('.', 1)[1].lower()
    return 'data:%s;base64,%s' % ('image/png' if ext == 'png' else 'image/jpeg', base64.b64encode(open(os.path.join(ROOT, rel), 'rb').read()).decode())
imgs = {os.path.relpath(p, ROOT).replace(os.sep, '/'): None for p in sorted(glob.glob(os.path.join(ROOT, 'img', '*.*')))}
for k in imgs: imgs[k] = uri(k)
html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
html = re.sub(r'url\((img/[^)]+)\)', lambda m: 'url(%s)' % imgs[m.group(1)], html)   # CSS
inline = '<script>window.IMG_INLINE = ' + json.dumps(imgs) + ';</script>\n'
def script(m):
    code = open(os.path.join(ROOT, m.group(1)), encoding='utf-8').read().replace('</script', '<\\/script')
    return '<script>\n' + code + '\n</script>'
html = re.sub(r'<script src="([^"]+)"></script>', script, html)
html = html.replace('<script>\n', inline + '<script>\n', 1)
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, 'w', encoding='utf-8').write(html)
print(out, round(os.path.getsize(out) / 1e6, 2), 'MB')
