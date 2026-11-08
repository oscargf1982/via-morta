#!/usr/bin/env python3
"""Xera o sprite e o retrato de Xoán Carballeira a partir da folla de personaxe de Oscar.

Entrada:  assets/personajes/xoan-carballeira-hoja.png (6 vistas sobre fondo liso)
Saídas:   img/xoan-sprite.png (folla de celas: 6 vistas + 2 de falar)
          img/xoan.png         (retrato 320x320 para a caixa de diálogo)
Uso:      python3 tools/sprite-xoan.py
Estilo:   reduce cada vista a ~H_PIX píxeles de alto, limita a paleta e amplía
          sen suavizar, para que case co pixel art de Martín.
"""
import os
from collections import deque
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'personajes', 'xoan-carballeira-hoja.png')
OUT = os.path.join(ROOT, 'img')
BG = (214, 205, 195)
H_PIX = 132          # alto do boneco en "píxeles" de pixel art
SCALE = 2            # ampliación final (vecino máis próximo)
CW, CH = 112, 280    # cela da folla final (en píxeles reais)
COLORS = 40

def dist(a, b): return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

def alpha_mask(im):
    """Fondo fóra: recheo dende os bordos (tolerante) + cor de fondo exacta en ocos pechados."""
    w, h = im.size; px = im.load()
    bgm = [[False] * w for _ in range(h)]
    q = deque((x, y) for x in range(w) for y in (0, h - 1))
    q.extend((x, y) for y in range(h) for x in (0, w - 1))
    while q:
        x, y = q.popleft()
        if bgm[y][x] or dist(px[x, y], BG) > 30: continue
        bgm[y][x] = True
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not bgm[ny][nx]: q.append((nx, ny))
    for y in range(h):
        for x in range(w):
            if not bgm[y][x] and dist(px[x, y], BG) < 14: bgm[y][x] = True
    return bgm

def views(im, bgm):
    """Separa as vistas por columnas baleiras."""
    w, h = im.size
    cols = [any(not bgm[y][x] for y in range(h)) for x in range(w)]
    out, x = [], 0
    while x < w:
        if cols[x]:
            x0 = x
            while x < w and cols[x]: x += 1
            if x - x0 > 40: out.append((x0, x))
        else: x += 1
    return out

def cut(im, bgm, x0, x1):
    h = im.size[1]
    ys = [y for y in range(h) if any(not bgm[y][x] for x in range(x0, x1))]
    y0, y1 = ys[0], ys[-1] + 1
    rgba = Image.new('RGBA', (x1 - x0, y1 - y0))
    sp, dp = im.load(), rgba.load()
    for y in range(y0, y1):
        for x in range(x0, x1):
            if not bgm[y][x]: dp[x - x0, y - y0] = sp[x, y] + (255,)
    return rgba, (x0, y0)

def pixelate(rgba, hpix):
    w, h = rgba.size; nw = max(1, round(w * hpix / h))
    small = rgba.resize((nw, hpix), Image.LANCZOS)
    a = small.getchannel('A').point(lambda v: 255 if v > 110 else 0)
    rgb = small.convert('RGB').quantize(COLORS, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    rgb.putalpha(a)
    return rgb

def main():
    sheet = Image.open(SRC).convert('RGB')
    bgm = alpha_mask(sheet)
    vs = views(sheet, bgm)
    assert len(vs) == 6, f'agardaba 6 vistas, atopei {len(vs)}: {vs}'
    # orde da folla de Oscar: fronte, costas, perfil cara á dereita, perfil cara á esquerda, 3/4 fronte (mira á esquerda), 3/4 costas
    cuts = [cut(sheet, bgm, a, b) for a, b in vs]
    tallest = max(c[0].size[1] for c in cuts)
    cells = []
    for rgba, _ in cuts:
        hp = round(H_PIX * rgba.size[1] / tallest)
        cells.append(pixelate(rgba, hp))
    # celas de falar: 3/4 fronte (4) e fronte (0) coa boca aberta
    talk = []
    for i, (rgba, (ox, oy)) in zip((4, 0), [cuts[4], cuts[0]]):
        p = cells[i].copy()
        mx, my = MOUTH[i]
        k = p.size[1] / rgba.size[1]
        cx, cy = round((mx - ox) * k), round((my - oy) * k)
        d = ImageDraw.Draw(p)
        d.rectangle([cx - 1, cy, cx, cy], fill=(70, 30, 25, 255))
        talk.append(p)
    cells += talk
    out = Image.new('RGBA', (CW * len(cells), CH))
    for n, c in enumerate(cells):
        big = c.resize((c.size[0] * SCALE, c.size[1] * SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH, (n, big.size)
        out.paste(big, (n * CW + (CW - big.size[0]) // 2, CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'xoan-sprite.png'), optimize=True)
    print('escrito xoan-sprite.png', out.size, 'celas', len(cells))
    # retrato: cara da vista de fronte
    fx, fy = FACE
    face = sheet.crop((fx - 70, fy - 72, fx + 70, fy + 68))
    m = Image.new('L', face.size, 0); fm = face.load(); mm = m.load()
    for y in range(face.size[1]):
        for x in range(face.size[0]):
            mm[x, y] = 0 if bgm[fy - 72 + y][fx - 70 + x] else 255
    bgc = Image.new('RGB', face.size, (40, 72, 64))
    bgc.paste(face, (0, 0), m)
    small = bgc.resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    small.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'xoan.png'), optimize=True)
    print('escrito xoan.png')

# coordenadas na folla orixinal (1536x1024): boca das vistas 4 e 0, centro da cara de fronte
MOUTH = {4: (1129, 127), 0: (157, 127)}
FACE = (156, 98)

if __name__ == '__main__':
    main()
