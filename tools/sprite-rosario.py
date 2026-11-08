#!/usr/bin/env python3
"""Xera o sprite e o retrato de Rosario Higueras a partir da folla de Oscar.

Entrada:  assets/personajes/rosario-higueras-hoja.png (PNG con transparencia)
          fila 1: retrato enmarcado + 4 poses sentada na cadeira (mira á dereita)
          fila 2: fronte, perfil dereita, costas, 3 fases de andar á dereita,
                  man no peto, e unha viñeta de referencia (non se usa)
Saídas:   img/rosario-sprite.png  folla de celas CW×CH, 8 columnas:
            0 fronte, 1 perfil dereita, 2 costas, 3 man no peto (3/4 dereita),
            4-6 andar á dereita,
            8 sentada coas mans no colo, 9 sentada xesticulando,
            10 sentada xesticulando coas pernas cruzadas, 11 sentada cos brazos cruzados,
            12 boca aberta (de 8), 13 boca aberta (de 9)
            (as poses sentadas levan a súa propia cadeira; á esquerda = flip)
          img/rosario-face.png   retrato 320×320
Uso:      python3 tools/sprite-rosario.py
"""
import os, importlib.util
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sx', os.path.join(HERE, 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'rosario-higueras-hoja.png')
OUT = os.path.join(ROOT, 'img')
H_PIX = 126            # alto de pé, en píxeles de pixel art
CW, CH, COLS = 160, 280, 8

def cuts_in(im, box, n):
    """Figuras dentro dunha caixa, separadas por columnas sen alfa."""
    x0, y0, x1, y1 = box; a = im.getchannel('A').load()
    m = [[a[x, y] < 128 for x in range(im.size[0])] for y in range(im.size[1])]
    cols = sx.runs([any(not m[y][x] for y in range(y0, y1)) for x in range(x0, x1)], 30)
    cols = [(c0 + x0, c1 + x0) for c0, c1 in cols]
    assert len(cols) == n, f'caixa {box}: agardaba {n} figuras, atopei {len(cols)} {cols}'
    return [sx.cut(im.convert('RGB'), m, c0, c1, y0, y1) for c0, c1 in cols]

def main():
    im = Image.open(SRC).convert('RGBA')
    seated = cuts_in(im, (400, 0, 1536, 470), 4)
    stand = cuts_in(im, (0, 470, 1110, 1024), 7)       # fronte, perfil, costas, 3 andar, man no peto
    tall = max(c.size[1] for c, _ in stand[:3])
    k = H_PIX / tall
    frames = [stand[0], stand[1], stand[2], stand[6]] + stand[3:6]
    small = [sx.shrink(c, round(c.size[1] * k)) for c, _ in frames[:3]] + [sx.shrink(frames[3][0], H_PIX)]
    small += [sx.shrink(c, round(H_PIX * 0.98)) for c, _ in frames[4:]]   # a folla debuxa as fases de andar máis pequenas
    small += [sx.shrink(c, round(c.size[1] * k)) for c, _ in seated]
    small = sx.palettize(small)
    cells = {i: c for i, c in enumerate(small[:7])}
    for j, c in enumerate(small[7:]): cells[8 + j] = c
    for src, dst in ((8, 12), (9, 13)):
        rgba, (ox, oy) = seated[src - 8]; p = cells[src].copy()
        f = p.size[1] / rgba.size[1]; mx, my = MOUTH[src]
        cx, cy = round((mx - ox) * f), round((my - oy) * f)
        ImageDraw.Draw(p).rectangle([cx - 1, cy, cx, cy], fill=(95, 30, 35, 255))
        cells[dst] = p
    out = Image.new('RGBA', (CW * COLS, CH * 2))
    for n, c in cells.items():
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, (n // COLS) * CH + CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'rosario-sprite.png'), optimize=True)
    print('escrito rosario-sprite.png', out.size)
    # retrato: o cadro enmarcado de arriba á esquerda (xa trae fondo azul)
    face = im.crop(PORTRAIT).convert('RGB')
    s = min(face.size); face = face.crop(((face.size[0] - s) // 2, 0, (face.size[0] - s) // 2 + s, s))
    p = face.resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    p.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'rosario-face.png'), optimize=True)
    print('escrito rosario-face.png')

# coordenadas na folla orixinal (1536×1024)
MOUTH = {8: (536, 137), 9: (787, 137)}
PORTRAIT = (22, 16, 362, 444)   # interior do cadro, sen o bordo

if __name__ == '__main__':
    main()
