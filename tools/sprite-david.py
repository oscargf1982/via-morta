#!/usr/bin/env python3
"""Xera o sprite e o retrato do Tío David a partir da folla de Oscar.

Entrada:  assets/personajes/tio-david-hoja.png
          (fila 1: fronte, perfil dereita, costas, tres cuartos dereita;
           fila 2: xestos de corpo enteiro mirando á dereita: fala sinalando,
           brazos cruzados, pensativo, sorrindo, neutro)
Saídas:   img/david-sprite.png  folla de celas CW×CH, 8 columnas:
            0 fronte, 1 perfil dereita, 2 costas, 3 tres cuartos dereita,
            4 fala sinalando, 5 brazos cruzados, 6 pensativo, 7 sorrindo, 8 neutro,
            9 boca aberta (de 3). Para falar: [9, 3] parado, ou [7, 8] (sorriso aberto / neutro)
            (cara á esquerda: as mesmas celas en espello, flip: true)
          img/david-face.png    retrato 320×320 (cara da pose sorrindo)
Uso:      python3 tools/sprite-david.py
"""
import os, importlib.util
from collections import deque
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sx', os.path.join(HERE, 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'tio-david-hoja.png')
OUT = os.path.join(ROOT, 'img')
BG = (219, 209, 195)
H_PIX = 128            # algo máis baixo ca Xoán (132)
CW, CH, COLS = 160, 280, 8
ROWS = [(0, 612), (618, 1227)]

def passable(c):
    """Fondo ou sombra do chan (gris cálido). Tolerancia curta: o pelo cano é case da cor do fondo."""
    r, g, b = c
    if sx.dist(c, BG) < 16: return True
    return r < 205 and 110 < r and b <= g <= r and 16 <= r - b <= 52 and r - g <= 24

def mask(im):
    w, h = im.size; px = im.load()
    m = [[True] * w for _ in range(h)]
    for y0, y1 in ROWS:
        for y in range(y0, y1):
            for x in range(w): m[y][x] = False
        seen = set(); q = deque((x, y) for x in range(w) for y in (y0, y1 - 1))
        q.extend((x, y) for y in range(y0, y1) for x in (0, w - 1))
        while q:
            x, y = q.popleft()
            if (x, y) in seen: continue
            seen.add((x, y))
            if not passable(px[x, y]): continue
            m[y][x] = True
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < w and y0 <= ny < y1 and (nx, ny) not in seen: q.append((nx, ny))
        for y in range(y0, y1):
            for x in range(w):
                if not m[y][x] and sx.dist(px[x, y], BG) < 6: m[y][x] = True
    return m

def row_cuts(im, m, y0, y1, n):
    cols = sx.runs([any(not m[y][x] for y in range(y0, y1)) for x in range(im.size[0])], 40)
    assert len(cols) == n, f'fila {y0}: agardaba {n} figuras, atopei {len(cols)} {cols}'
    return [sx.cut(im, m, a, b, y0, y1) for a, b in cols]

def main():
    im = Image.open(SRC).convert('RGB'); m = mask(im)
    cuts = row_cuts(im, m, *ROWS[0], 4) + row_cuts(im, m, *ROWS[1], 5)
    # as dúas filas están a escalas distintas: igualamos todas ao mesmo alto
    small = sx.palettize([sx.shrink(c, H_PIX) for c, _ in cuts])
    for i in (3,):
        rgba, (ox, oy) = cuts[i]; p = small[i].copy()
        k = p.size[1] / rgba.size[1]; mx, my = MOUTH[i]
        cx, cy = round((mx - ox) * k), round((my - oy) * k)
        ImageDraw.Draw(p).rectangle([cx - 1, cy, cx, cy], fill=(90, 35, 30, 255))
        small.append(p)
    out = Image.new('RGBA', (CW * COLS, CH * 2))
    for n, c in enumerate(small):
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, (n // COLS) * CH + CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'david-sprite.png'), optimize=True)
    print('escrito david-sprite.png', out.size)
    # retrato: cabeza da pose sorrindo (7)
    rgba, (ox, oy) = cuts[7]
    fx, fy = FACE; s = 150
    face = rgba.crop((fx - ox - s // 2, fy - oy - s // 2, fx - ox + s // 2, fy - oy + s // 2))
    sq = Image.new('RGB', (s, s), (44, 70, 52)); sq.paste(face, (0, 0), face)
    p = sq.resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    p.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'david-face.png'), optimize=True)
    print('escrito david-face.png')

# coordenadas na folla orixinal (1281×1227)
MOUTH = {3: (1147, 129)}
FACE = (940, 722)

if __name__ == '__main__':
    main()
