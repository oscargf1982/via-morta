#!/usr/bin/env python3
"""Xera o sprite e o retrato de Don Eladio a partir da folla de Oscar.

Entrada:  assets/personajes/don-eladio-hoja.png (PNG con transparencia)
          esquerda: sentado no taburete do bar, de fronte;
          dereita: 8 fotogramas correndo de costas (2 filas de 4)
Saídas:   img/eladio-sprite.png  folla de celas CW×CH, 8 columnas:
            0 sentado (co seu taburete), 1 sentado falando (boca aberta),
            8-15 correndo de costas
          img/eladio-face.png    retrato 320×320
Uso:      python3 tools/sprite-eladio.py
"""
import os, importlib.util
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sx', os.path.join(HERE, 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)
spec = importlib.util.spec_from_file_location('sr', os.path.join(HERE, 'sprite-rosario.py'))
sr = importlib.util.module_from_spec(spec); spec.loader.exec_module(sr)

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'don-eladio-hoja.png')
OUT = os.path.join(ROOT, 'img')
H_PIX = 130                  # alto de pé de referencia
H_SEAT = round(H_PIX * 0.8)  # sentado no taburete (cabeza ata o chan)
H_RUN = round(H_PIX * 0.95)  # correndo, algo encollido
CW, CH, COLS = 160, 280, 8

def main():
    im = Image.open(SRC).convert('RGBA')
    seat = sr.cuts_in(im, (0, 0, 570, 1024), 1)
    run = sr.cuts_in(im, (570, 40, 1536, 510), 4) + sr.cuts_in(im, (570, 520, 1536, 1000), 4)
    sx.COLORS = 64   # que non se perda a gravata vermella entre tanto marrón
    small = sx.palettize([sx.shrink(seat[0][0], H_SEAT)] + [sx.shrink(c, H_RUN) for c, _ in run])
    rgba, (ox, oy) = seat[0]; talk = small[0].copy()
    k = talk.size[1] / rgba.size[1]; cx, cy = round((MOUTH[0] - ox) * k), round((MOUTH[1] - oy) * k)
    ImageDraw.Draw(talk).rectangle([cx - 1, cy, cx, cy], fill=(70, 25, 20, 255))
    cells = {0: small[0], 1: talk}
    for i, c in enumerate(small[1:]): cells[8 + i] = c
    out = Image.new('RGBA', (CW * COLS, CH * 2))
    for n, c in cells.items():
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, (n // COLS) * CH + CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'eladio-sprite.png'), optimize=True)
    print('escrito eladio-sprite.png', out.size)
    fx, fy = FACE; s = 220
    face = im.crop((fx - s // 2, fy - s // 2, fx + s // 2, fy + s // 2))
    sq = Image.new('RGBA', (s, s), (60, 52, 70, 255)); sq.alpha_composite(face)
    p = sq.convert('RGB').resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    p.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'eladio-face.png'), optimize=True)
    print('escrito eladio-face.png')

# coordenadas na folla orixinal (1536×1024)
MOUTH = (290, 226)
FACE = (282, 170)

if __name__ == '__main__':
    main()
