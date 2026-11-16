"""Recorta a folla de sacos de Oscar (assets/obxectos/sacos-hoja-oscar.png) en PNG con fondo transparente (img/sacos/).
Quita o branco e a sombra gris que tocan o bordo de cada recadro (enchido por inundación: o contorno negro protexe o interior)."""
from PIL import Image
from collections import deque
import sys
SRC = 'assets/obxectos/sacos-hoja-oscar.png'
BOX = {  # x0, y0, x1, y1 na folla de 1672x941
    'serrin-aberto': (20, 20, 570, 505), 'millo-de-pe': (625, 30, 1020, 475), 'baleiros': (1070, 155, 1660, 505),
    'serrin-pila': (20, 525, 490, 860), 'millo-pila': (530, 535, 985, 860), 'graos': (1010, 670, 1285, 840),
    'ico-serrin': (1290, 636, 1462, 822), 'ico-millo': (1473, 636, 1648, 822)}
def fondo(p):
    r, g, b = p[:3]; return min(r, g, b) > 165 and max(r, g, b) - min(r, g, b) < 34
im = Image.open(SRC).convert('RGBA')
for k, bx in BOX.items():
    c = im.crop(bx); w, h = c.size; px = c.load(); seen = bytearray(w * h); q = deque()
    for x in range(w):
        q.append((x, 0)); q.append((x, h - 1))
    for y in range(h):
        q.append((0, y)); q.append((w - 1, y))
    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or seen[y * w + x]: continue
        seen[y * w + x] = 1
        if not fondo(px[x, y]): continue
        px[x, y] = (0, 0, 0, 0)
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    c = c.crop(c.getbbox())
    if k.startswith('ico'): c = c.resize((96, int(96 * c.size[1] / c.size[0])), Image.LANCZOS)
    else:
        s = 360 / max(c.size); c = c.resize((round(c.size[0] * s), round(c.size[1] * s)), Image.LANCZOS)
    c.save(f'img/sacos/{k}.png', optimize=True); print(k, c.size)
# icona do saco baleiro: o montón de sacos dobrados
b = Image.open('img/sacos/baleiros.png'); b.thumbnail((96, 96), Image.LANCZOS); b.save('img/sacos/ico-baleiro.png', optimize=True)
