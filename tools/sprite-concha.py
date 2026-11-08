#!/usr/bin/env python3
"""Xera o sprite e o retrato de Dona Concha a partir da folla de Oscar.

Entrada:  assets/personajes/dona-concha-hoja.png
          (fila 1: 6 vistas paradas co xornal; fila 2: ciclo de andar á dereita, 6 fases;
           fila 3: 4 expresións e 2 xestos de medio corpo)
Saídas:   img/concha-sprite.png  folla de celas CW×CH, 8 columnas:
            0 fronte lendo o xornal, 1 costas, 2 perfil dereita, 3 perfil esquerda,
            4 tres cuartos dereita (co xornal), 5 tres cuartos de costas,
            6 falando (de 4), 7 falando (de 0)
            8-13 andar á dereita (6 fases; á esquerda, en espello)
          img/concha-face.png    retrato 320×320 (expresión 1, sorriso)
Uso:      python3 tools/sprite-concha.py
Os xestos de medio corpo quedan só como referencia (non teñen pernas para un sprite).
"""
import os, importlib.util
from collections import deque
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sx', os.path.join(HERE, 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'dona-concha-hoja.png')
OUT = os.path.join(ROOT, 'img')
BG = (228, 219, 208)
H_PIX = 122            # Concha é máis baixa ca Xoán (132) e ca Martín
CW, CH, COLS = 160, 280, 8
ROWS = [(56, 515), (560, 925), (985, 1260)]   # bandas verticais (sen os rótulos)

def passable(c):
    """Fondo ou sombra do chan (gris cálido): o recheo pode pasar por aí."""
    r, g, b = c
    if sx.dist(c, BG) < 30: return True
    return 110 < r and b <= g <= r and 12 <= r - b <= 52 and r - g <= 24

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
                if not m[y][x] and sx.dist(px[x, y], BG) < 8: m[y][x] = True
    return m

def row_cuts(im, m, y0, y1, n):
    cols = sx.runs([any(not m[y][x] for y in range(y0, y1)) for x in range(im.size[0])], 40)
    assert len(cols) == n, f'fila {y0}: agardaba {n} figuras, atopei {len(cols)} {cols}'
    return [sx.cut(im, m, a, b, y0, y1) for a, b in cols]

def main():
    im = Image.open(SRC).convert('RGB'); m = mask(im)
    still = row_cuts(im, m, *ROWS[0], 6)
    walk = row_cuts(im, m, *ROWS[1], 6)
    heads = row_cuts(im, m, *ROWS[2], 6)
    tallest = max(c.size[1] for c, _ in still)
    small = [sx.shrink(c, round(H_PIX * c.size[1] / tallest)) for c, _ in still]
    small += [sx.shrink(c, round(H_PIX * 0.98)) for c, _ in walk]
    small = sx.palettize(small)
    st, wk = small[:6], small[6:]
    for i in (4, 0):
        rgba, (ox, oy) = still[i]; p = st[i].copy()
        k = p.size[1] / rgba.size[1]; mx, my = MOUTH[i]
        cx, cy = round((mx - ox) * k), round((my - oy) * k)
        ImageDraw.Draw(p).rectangle([cx - 1, cy, cx, cy], fill=(110, 40, 40, 255))
        st.append(p)
    out = Image.new('RGBA', (CW * COLS, CH * 2))
    for n, c in enumerate(st + wk):
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, (n // COLS) * CH + CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'concha-sprite.png'), optimize=True)
    print('escrito concha-sprite.png', out.size)
    # retrato: expresión 1 (sorriso) sobre fondo de cor
    face, _ = heads[0]
    s = max(face.size); sq = Image.new("RGB", (s, s), (38, 62, 92))
    sq.paste(face, ((s - face.size[0]) // 2, s - face.size[1]), face)
    p = sq.resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    p.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'concha-face.png'), optimize=True)
    print('escrito concha-face.png')

# boca na folla orixinal (1224×1285): vista 4 (3/4 dereita) e vista 0 (fronte)
MOUTH = {4: (925, 136), 0: (126, 136)}

if __name__ == '__main__':
    main()
