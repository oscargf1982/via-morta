#!/usr/bin/env python3
"""Xera o sprite e o retrato de Mega Andrés a partir da folla de Oscar.

Entrada:  assets/personajes/mega-andres-hoja.png (1536×1024, fondo negro sen transparencia)
          fila 1: seis vistas paradas; fila 2: andar e correr á dereita;
          fila 3: sinalar, man na caluga, vitoria, co mojito, man no queixo,
                  brazos cruzados, deitado na hamaca, en cluquillas
Saídas:   img/andres-sprite.png  folla de celas CW×CH (máis ancha ca as outras, pola hamaca), 8 columnas:
            0 deitado na hamaca, 1 deitado falando (boca aberta), 2 fronte,
            3 co mojito, 4 vitoria, 5 brazos cruzados
          img/andres-face.png    retrato 320×320
Uso:      python3 tools/sprite-andres.py
"""
import os, importlib.util
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
def load(n, f):
    spec = importlib.util.spec_from_file_location(n, os.path.join(HERE, f)); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
sx = load('sx', 'sprite-xoan.py'); sr = load('sr', 'sprite-rosario.py'); sv = load('sv', 'sprite-valerio.py')

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'mega-andres-hoja.png')
OUT = os.path.join(ROOT, 'img')
H_PIX = 132
CW, CH, COLS = 200, 280, 8

def main():
    im = sv.con_alfa(Image.open(SRC).convert('RGB'), OCOS)
    fronte = sr.cuts_in(im, (100, 0, 300, 360), 1)[0]
    poses = sr.cuts_in(im, (0, 640, 1536, 1010), 8)
    k = H_PIX / fronte[0].size[1]
    kp = H_PIX / poses[3][0].size[1]          # as poses van a outra escala: igualalas á do mojito
    deitado = poses[6]
    frames = [deitado, fronte, poses[3], poses[2], poses[5]]
    small = sx.palettize([sx.shrink(deitado[0], round(deitado[0].size[1] * kp)), sx.shrink(fronte[0], H_PIX)]
                         + [sx.shrink(c, min(137, round(c.size[1] * kp))) for c, _ in frames[2:]])
    talk = small[0].copy(); rgba, (ox, oy) = deitado
    f = talk.size[1] / rgba.size[1]; cx, cy = round((MOUTH[0] - ox) * f), round((MOUTH[1] - oy) * f)
    ImageDraw.Draw(talk).rectangle([cx - 1, cy, cx, cy], fill=(90, 30, 25, 255))
    cells = {0: small[0], 1: talk, 2: small[1], 3: small[2], 4: small[3], 5: small[4]}
    out = Image.new('RGBA', (CW * COLS, CH))
    for n, c in cells.items():
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'andres-sprite.png'), optimize=True)
    print('escrito andres-sprite.png', out.size)
    fx, fy = FACE; s = 120
    face = im.crop((fx - s // 2, fy - s // 2, fx + s // 2, fy + s // 2))
    sq = Image.new('RGBA', (s, s), (70, 120, 160, 255)); sq.alpha_composite(face)
    p = sq.convert('RGB').resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    p.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'andres-face.png'), optimize=True)
    print('escrito andres-face.png')

# coordenadas na folla orixinal (1536×1024)
MOUTH = (1250, 832)
FACE = (202, 58)
OCOS = [(1205, 950), (1215, 940)]   # o triángulo negro baixo a lona da hamaca

if __name__ == '__main__':
    main()
