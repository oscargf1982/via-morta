#!/usr/bin/env python3
"""Xera o sprite e o retrato de Valerio (o farmacéutico) a partir da folla de Oscar.

Entrada:  assets/personajes/valerio-hoja.png (1536×1024, fondo negro sen transparencia)
          fila 1: fronte, perfil esquerda, costas, perfil dereita + 5 fases de andar á dereita
          fila 2: andar á esquerda e correr; fila 3: correr de costas + poses
          (sinalar, man no queixo, brazos cruzados, vitoria, axeonllado, derrotado)
Saídas:   img/valerio-sprite.png  folla de celas CW×CH, 8 columnas:
            0 fronte, 1 fronte falando (boca aberta), 2 costas, 3 perfil dereita,
            4 sinalando, 5 man no queixo, 6 brazos cruzados, 7 vitoria
          img/valerio-face.png    retrato 320×320
Uso:      python3 tools/sprite-valerio.py
"""
import os, importlib.util
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sx', os.path.join(HERE, 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)
spec = importlib.util.spec_from_file_location('sr', os.path.join(HERE, 'sprite-rosario.py'))
sr = importlib.util.module_from_spec(spec); spec.loader.exec_module(sr)

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'valerio-hoja.png')
OUT = os.path.join(ROOT, 'img')
H_PIX = 130
CW, CH, COLS = 160, 280, 8

def con_alfa(rgb, ocos=()):
    """O fondo negro é o negro unido aos bordos (recheo); o trazo negro das figuras queda.
    `ocos`: puntos de ocos negros pechados (p. ex. baixo unha hamaca) que tamén son fondo."""
    k = rgb.convert('L').point(lambda v: 255 if v < 7 else 0)
    w, h = k.size
    for p in ocos:
        if k.getpixel(p) == 255: ImageDraw.floodfill(k, p, 128)
    for x in range(0, w, 8):
        for y in (0, h - 1):
            if k.getpixel((x, y)) == 255: ImageDraw.floodfill(k, (x, y), 128)
    for y in range(0, h, 8):
        for x in (0, w - 1):
            if k.getpixel((x, y)) == 255: ImageDraw.floodfill(k, (x, y), 128)
    a = k.point(lambda v: 0 if v == 128 else 255)
    im = rgb.convert('RGBA'); im.putalpha(a); return im

def main():
    im = con_alfa(Image.open(SRC).convert('RGB'))
    vistas = sr.cuts_in(im, (0, 0, 740, 320), 4)          # fronte, perfil esq., costas, perfil dta.
    poses = sr.cuts_in(im, (580, 620, 1262, 960), 4)      # sinalar, queixo, brazos cruzados, vitoria
    k = H_PIX / vistas[0][0].size[1]
    frames = [vistas[0], vistas[2], vistas[3]] + poses
    kp = H_PIX / poses[0][0].size[1]   # as poses están debuxadas a outra escala: igualalas á de sinalar
    small = sx.palettize([sx.shrink(c, round(c.size[1] * k)) for c, _ in frames[:3]] + [sx.shrink(c, min(137, round(c.size[1] * kp))) for c, _ in poses])
    talk = small[0].copy(); rgba, (ox, oy) = vistas[0]
    f = talk.size[1] / rgba.size[1]; cx, cy = round((MOUTH[0] - ox) * f), round((MOUTH[1] - oy) * f)
    ImageDraw.Draw(talk).rectangle([cx - 1, cy, cx, cy], fill=(70, 25, 20, 255))
    cells = {0: small[0], 1: talk, 2: small[1], 3: small[2], 4: small[3], 5: small[4], 6: small[5], 7: small[6]}
    out = Image.new('RGBA', (CW * COLS, CH))
    for n, c in cells.items():
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, (n // COLS) * CH + CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'valerio-sprite.png'), optimize=True)
    print('escrito valerio-sprite.png', out.size)
    fx, fy = FACE; s = 110
    face = im.crop((fx - s // 2, fy - s // 2, fx + s // 2, fy + s // 2))
    sq = Image.new('RGBA', (s, s), (60, 70, 72, 255)); sq.alpha_composite(face)
    p = sq.convert('RGB').resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    p.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'valerio-face.png'), optimize=True)
    print('escrito valerio-face.png')

# coordenadas na folla orixinal (1536×1024)
MOUTH = (118, 76)
FACE = (116, 62)

if __name__ == '__main__':
    main()
