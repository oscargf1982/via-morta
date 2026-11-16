#!/usr/bin/env python3
"""Xera o sprite e o retrato de Remedios a partir do debuxo de Oscar.

Entrada:  assets/personajes/remedios-hoja.png (1024×1536, unha soa vista de corpo enteiro,
          tres cuartos mirando á dereita, man na cadeira; o fondo xa vén transparente)
Saídas:   img/remedios-sprite.png  folla de celas 160×280, 8 columnas:
            0 parada (tal como a debuxou Oscar), 1 falando (a mesma, coa boca aberta)
          img/remedios-face.png    retrato 320×320
Faltan:   costas, perfil e andar. Non se inventan: hai que pedirllos a Oscar se Remedios ten que camiñar.
Uso:      python3 tools/sprite-remedios.py
"""
import os, importlib.util
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sx', os.path.join(HERE, 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'remedios-hoja.png')
OUT = os.path.join(ROOT, 'img')
H_PIX = 128                 # un chisco máis baixa ca Martín e Andrés (132)
CW, CH, COLS = 160, 280, 8

# coordenadas no debuxo orixinal (1024×1536)
MOUTH = (560, 267)
FACE = (530, 205)           # centro do retrato (cara, lentes e gafas de soldar)

def main():
    im = Image.open(SRC).convert('RGBA')
    a = im.getchannel('A').point(lambda v: 255 if v > 128 else 0)   # bordo limpo, sen halo
    im.putalpha(a)
    box = a.getbbox(); fig = im.crop(box)
    small = sx.palettize([sx.shrink(fig, H_PIX)])[0]
    talk = small.copy()
    f = H_PIX / fig.size[1]
    cx, cy = round((MOUTH[0] - box[0]) * f), round((MOUTH[1] - box[1]) * f)
    ImageDraw.Draw(talk).rectangle([cx - 1, cy, cx, cy + 1], fill=(90, 30, 25, 255))
    out = Image.new('RGBA', (CW * COLS, CH))
    for n, c in enumerate([small, talk]):
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'remedios-sprite.png'), optimize=True)
    print('escrito remedios-sprite.png', out.size)
    fx, fy = FACE; s = 320
    face = im.crop((fx - s // 2, fy - s // 2, fx + s // 2, fy + s // 2))
    sq = Image.new('RGBA', (s, s), (58, 74, 112, 255)); sq.alpha_composite(face)
    p = sq.convert('RGB').resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    p.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'remedios-face.png'), optimize=True)
    print('escrito remedios-face.png')

if __name__ == '__main__':
    main()
