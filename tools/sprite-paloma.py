#!/usr/bin/env python3
"""Recorta a paloma da folla de Oscar e xera o seu sprite animado.

Entrada:  assets/personajes/paloma-hoja.png (1536×1024, fondo escuro con degradados e rótulos)
Saídas:   assets/personajes/paloma/<pose>.png   cada pose a tamaño orixinal, fondo transparente
          img/paloma-sprite.png                 folla de celas CW×CH, 8 columnas, pixel art como os demais:
            0 quieto · 1-3 andar · 4-6 correr · 7-9 voar · 10-12 atacar · 13 tumbada · 14-16 mareada
          (todas miran á dereita; o motor dálles a volta para a esquerda)
Uso:      python3 tools/sprite-paloma.py

Como se separa do fondo: a paloma ten un contorno negro pechado (luminancia < 24) e o fondo
nunca baixa de ~26, así que se enche dende os bordos da folla por todo o que non é tinta.
O que queda é paloma (máis algunhas manchas escuras do fondo, que se descartan porque
non caen enteiras dentro da caixa de ningunha pose).
"""
import os, importlib.util
from collections import deque
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sx', os.path.join(HERE, 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'paloma-hoja.png')
HD = os.path.join(ROOT, 'assets', 'personajes', 'paloma')
OUT = os.path.join(ROOT, 'img')
INK = 24
K = 0.25            # escala folla → pixel art (a paloma quieta queda en ~53 px, logo ×2)
CW, CH, COLS = 240, 160, 8

# caixas (x0, y0, x1, y1) de cada pose na folla; vale calquera compoñente que caia enteiro dentro
POSES = [
    ('quieto', (30, 75, 240, 310)),
    ('andar-1', (340, 90, 540, 305)), ('andar-2', (525, 90, 700, 305)), ('andar-3', (690, 90, 865, 310)),
    ('correr-1', (915, 90, 1150, 300)), ('correr-2', (1120, 90, 1325, 300)), ('correr-3', (1315, 90, 1536, 300)),
    ('volar-1', (10, 385, 245, 615)), ('volar-2', (245, 425, 495, 600)), ('volar-3', (515, 415, 780, 595)),
    ('atacar-1', (825, 395, 1115, 630)), ('atacar-2', (1095, 420, 1320, 620)), ('atacar-3', (1285, 430, 1500, 660)),
    ('tumbada', (25, 775, 465, 950)),
    ('marea-1', (550, 725, 785, 955)), ('marea-2', (855, 775, 1170, 960)), ('marea-3', (1215, 715, 1485, 960)),
]

def mascara(a):
    """True = paloma (o que non se alcanza dende o bordo sen cruzar tinta)."""
    H, W = a.shape[:2]; pas = a.mean(2) > INK; fl = np.zeros((H, W), bool)
    q = deque([(0, x) for x in range(W)] + [(H - 1, x) for x in range(W)] + [(y, 0) for y in range(H)] + [(y, W - 1) for y in range(H)])
    while q:
        y, x = q.popleft()
        if fl[y, x] or not pas[y, x]: continue
        fl[y, x] = True
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < H and 0 <= nx < W and not fl[ny, nx]: q.append((ny, nx))
    return ~fl

def compoñentes(m):
    H, W = m.shape; lab = np.zeros((H, W), np.int32); out = []; n = 0
    for y0, x0 in zip(*np.nonzero(m)):
        if lab[y0, x0]: continue
        n += 1; lab[y0, x0] = n; q = deque([(y0, x0)]); ys, xs = [], []
        while q:
            y, x = q.popleft(); ys.append(y); xs.append(x)
            for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1), (y - 1, x - 1), (y - 1, x + 1), (y + 1, x - 1), (y + 1, x + 1)):
                if 0 <= ny < H and 0 <= nx < W and m[ny, nx] and not lab[ny, nx]: lab[ny, nx] = n; q.append((ny, nx))
        out.append((n, min(xs), min(ys), max(xs) + 1, max(ys) + 1, len(xs)))
    return lab, out

def main():
    im = Image.open(SRC).convert('RGB'); a = np.array(im).astype(int)
    m = mascara(a); lab, comps = compoñentes(m)
    os.makedirs(HD, exist_ok=True)
    hd = []
    for nome, (x0, y0, x1, y1) in POSES:
        ids = [c[0] for c in comps if c[5] >= 12 and c[1] >= x0 and c[2] >= y0 and c[3] <= x1 and c[4] <= y1]
        sel = np.isin(lab, ids)
        ys, xs = np.nonzero(sel); bx0, by0, bx1, by1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        rgba = np.zeros((by1 - by0, bx1 - bx0, 4), np.uint8)
        rgba[..., :3] = a[by0:by1, bx0:bx1]; rgba[..., 3] = sel[by0:by1, bx0:bx1] * 255
        p = Image.fromarray(rgba, 'RGBA'); p.save(os.path.join(HD, nome + '.png'), optimize=True); hd.append(p)
        print(f'{nome:9s} {p.size[0]:3d}×{p.size[1]:3d}  ({len(ids)} anacos)')
    small = sx.palettize([q.resize((max(1, round(q.size[0] * K)), max(1, round(q.size[1] * K))), Image.LANCZOS) for q in hd])
    rows = -(-len(small) // COLS); out = Image.new('RGBA', (CW * COLS, CH * rows))
    for n, c in enumerate(small):
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH - 3, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, (n // COLS) * CH + CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'paloma-sprite.png'), optimize=True)
    print('escrito img/paloma-sprite.png', out.size)

if __name__ == '__main__':
    main()
