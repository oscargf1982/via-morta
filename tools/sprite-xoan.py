#!/usr/bin/env python3
"""Xera o sprite e o retrato de Xoán Carballeira a partir das follas de Oscar.

Entradas: assets/personajes/xoan-carballeira-hoja.png   (6 vistas paradas)
          assets/personajes/xoan-carballeira-andar.png  (6 direccións × 5 fotogramas de andar)
Saídas:   img/xoan-sprite.png  folla de celas de CW×CH, 8 columnas:
            fila 0: 0 fronte, 1 costas, 2 perfil dereita, 3 perfil esquerda,
                    4 tres cuartos mirando á esquerda, 5 tres cuartos de costas,
                    6 falando (de 4), 7 falando (de 0)
            filas 1-6 (5 fotogramas cada unha, celas 8·fila .. 8·fila+4):
                    1 andar de fronte, 2 de costas, 3 á dereita, 4 á esquerda,
                    5 tres cuartos dereita (cara á cámara), 6 tres cuartos de costas (cara á dereita)
          img/xoan.png  retrato 320×320 para a caixa de diálogo
Uso:      python3 tools/sprite-xoan.py
Estilo:   cada fotograma redúcese a ~H_PIX píxeles de alto cunha paleta común
          e amplíase sen suavizar, para que case co pixel art de Martín.
"""
import os
from collections import deque
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, 'assets', 'personajes')
OUT = os.path.join(ROOT, 'img')
H_PIX = 132          # alto do boneco parado en "píxeles" de pixel art
SCALE = 2            # ampliación final (vecino máis próximo)
CW, CH, COLS = 160, 280, 8
COLORS = 48

def dist(a, b): return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

def bg_mask(im, bg, top=0):
    """True = fondo. Recheo dende os bordos (tolerante) + cor de fondo exacta en ocos pechados.
    As filas por riba de `top` (rótulos) cóntanse sempre como fondo."""
    w, h = im.size; px = im.load()
    m = [[y < top for x in range(w)] for y in range(h)]
    q = deque((x, y) for x in range(w) for y in (top, h - 1))
    q.extend((x, y) for y in range(top, h) for x in (0, w - 1))
    seen = [[False] * w for _ in range(h)]
    while q:
        x, y = q.popleft()
        if seen[y][x]: continue
        seen[y][x] = True
        if dist(px[x, y], bg) > 30: continue
        m[y][x] = True
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and top <= ny < h and not seen[ny][nx]: q.append((nx, ny))
    for y in range(top, h):
        for x in range(w):
            if not m[y][x] and dist(px[x, y], bg) < 14: m[y][x] = True
    return m

def runs(flags, minlen):
    out, i = [], 0
    while i < len(flags):
        if flags[i]:
            j = i
            while j < len(flags) and flags[j]: j += 1
            if j - i >= minlen: out.append((i, j))
            i = j
        else: i += 1
    return out

def cut(im, m, x0, x1, y0, y1):
    """Recorta a figura (RGBA) dentro da caixa, axustada ao contido."""
    ys = [y for y in range(y0, y1) if any(not m[y][x] for x in range(x0, x1))]
    xs = [x for x in range(x0, x1) if any(not m[y][x] for y in range(y0, y1))]
    a, b, c, d = xs[0], xs[-1] + 1, ys[0], ys[-1] + 1
    rgba = Image.new('RGBA', (b - a, d - c)); sp, dp = im.load(), rgba.load()
    for y in range(c, d):
        for x in range(a, b):
            if not m[y][x]: dp[x - a, y - c] = sp[x, y] + (255,)
    return rgba, (a, c)

def shrink(rgba, hpix):
    w, h = rgba.size
    return rgba.resize((max(1, round(w * hpix / h)), hpix), Image.LANCZOS)

def palettize(frames):
    """Paleta común para todos os fotogramas (sen escintileo entre eles)."""
    W = sum(f.size[0] + 1 for f in frames); H = max(f.size[1] for f in frames)
    atlas = Image.new('RGB', (W, H), (0, 0, 0)); x = 0
    for f in frames: atlas.paste(f.convert('RGB'), (x, 0)); x += f.size[0] + 1
    pal = atlas.quantize(COLORS, method=Image.MEDIANCUT, dither=Image.NONE)
    out = []
    for f in frames:
        q = f.convert('RGB').quantize(palette=pal, dither=Image.NONE).convert('RGB')
        q.putalpha(f.getchannel('A').point(lambda v: 255 if v > 110 else 0))
        out.append(q)
    return out

def still_views():
    sheet = Image.open(os.path.join(DIR, 'xoan-carballeira-hoja.png')).convert('RGB')
    m = bg_mask(sheet, (214, 205, 195))
    w, h = sheet.size
    cols = runs([any(not m[y][x] for y in range(h)) for x in range(w)], 40)
    assert len(cols) == 6, f'folla parada: agardaba 6 vistas, atopei {len(cols)}'
    cuts = [cut(sheet, m, a, b, 0, h) for a, b in cols]
    tallest = max(c.size[1] for c, _ in cuts)
    return sheet, m, cuts, [shrink(c, round(H_PIX * c.size[1] / tallest)) for c, _ in cuts]

def walk_frames():
    sheet = Image.open(os.path.join(DIR, 'xoan-carballeira-andar.png')).convert('RGB')
    m = bg_mask(sheet, (225, 217, 205), top=56)
    w, h = sheet.size
    cols = runs([any(not m[y][x] for y in range(h)) for x in range(w)], 40)
    assert len(cols) == 6, f'folla de andar: agardaba 6 columnas, atopei {len(cols)}'
    out = []
    for a, b in cols:
        rows = runs([any(not m[y][x] for x in range(a, b)) for y in range(h)], 60)
        assert len(rows) == 5, f'columna {a}-{b}: agardaba 5 fotogramas, atopei {len(rows)}'
        # a folla non ten escala constante entre filas: igualamos todos ao mesmo alto
        out.append([shrink(cut(sheet, m, a, b, y0, y1)[0], round(H_PIX * 0.98)) for y0, y1 in rows])
    return out

def main():
    sheet, m, cuts, still = still_views()
    walk = walk_frames()
    # a folla de andar debuxa a Xoán máis ancho de ombreiros: estreitámola para que case coa parada
    k = WALK_SQUEEZE
    walk = [[f.resize((max(1, round(f.size[0] * k)), f.size[1]), Image.LANCZOS) for f in d] for d in walk]
    print(f'estreitamento da folla de andar: {k:.2f}')
    flat = still + [f for d in walk for f in d]
    flat = palettize(flat)
    still, walk = flat[:6], [flat[6 + i * 5: 11 + i * 5] for i in range(6)]
    # celas de falar: boca aberta sobre a vista 4 e a 0
    for i in (4, 0):
        rgba, (ox, oy) = cuts[i]; p = still[i].copy()
        k = p.size[1] / rgba.size[1]; mx, my = MOUTH[i]
        cx, cy = round((mx - ox) * k), round((my - oy) * k)
        ImageDraw.Draw(p).rectangle([cx - 1, cy, cx, cy], fill=(70, 30, 25, 255))
        still.append(p)
    out = Image.new('RGBA', (CW * COLS, CH * 7))
    def put(n, c):
        big = c.resize((c.size[0] * SCALE, c.size[1] * SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, (n // COLS) * CH + CH - 3 - big.size[1]), big)
    for n, c in enumerate(still): put(n, c)
    for r, frames in enumerate(walk):
        for f, c in enumerate(frames): put((r + 1) * COLS + f, c)
    out.save(os.path.join(OUT, 'xoan-sprite.png'), optimize=True)
    print('escrito xoan-sprite.png', out.size)
    # retrato: cara da vista de fronte
    fx, fy = FACE; box = (fx - 70, fy - 72, fx + 70, fy + 68)
    face = sheet.crop(box); mask = Image.new('L', face.size, 0); mm = mask.load()
    for y in range(face.size[1]):
        for x in range(face.size[0]): mm[x, y] = 0 if m[box[1] + y][box[0] + x] else 255
    bgc = Image.new('RGB', face.size, (40, 72, 64)); bgc.paste(face, (0, 0), mask)
    small = bgc.resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    small.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'xoan.png'), optimize=True)
    print('escrito xoan.png')

# coordenadas na folla parada orixinal (1536×1024): boca das vistas 4 e 0, centro da cara de fronte
MOUTH = {4: (1129, 127), 0: (157, 127)}
FACE = (156, 98)
# estreitamento horizontal da folla de andar (axustado a ollo comparando cabeza e ombreiros)
WALK_SQUEEZE = 0.86

if __name__ == '__main__':
    main()
