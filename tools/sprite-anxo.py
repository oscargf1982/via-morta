#!/usr/bin/env python3
"""Xera o sprite e o retrato de Don Anxo Corredoira (92 anos, o fogonero de 1958) a partir do debuxo de Oscar.

Entrada:  assets/personajes/anxo-hoja.png (1024×1536, unha soa vista: de pé, 3/4 cara á dereita,
          apoiado no bastón coa man dereita e a esquerda no peto; fondo xa transparente)
Saídas:   img/anxo-sprite.png  folla de celas 160×280, 8 columnas:
            0 parado, 1 falando (boca aberta baixo o bigote)
          img/anxo-face.png    retrato 320×320
          Faltan costas, perfil e andar: Oscar non os debuxou e non se inventan.
Uso:      python3 tools/sprite-anxo.py
"""
import os, importlib.util
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sx', os.path.join(HERE, 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'anxo-hoja.png')
OUT = os.path.join(ROOT, 'img')
H_PIX = 128          # algo máis baixo ca Martín: 92 anos e un pouco encorvado
CW, CH, COLS = 160, 280, 8

# coordenadas no debuxo orixinal (1024×1536)
MOUTH = (583, 278)   # xusto baixo o bigote
FACE = (525, 215)    # centro da cabeza, con gorra
FACE_S = 360

def main():
    src = Image.open(SRC).convert('RGBA')
    a = src.getchannel('A').point(lambda v: 255 if v > 128 else 0)   # fóra o halo do fondo
    fig = src.copy(); fig.putalpha(a)
    box = a.getbbox(); fig = fig.crop(box)
    small = sx.palettize([sx.shrink(fig, H_PIX)])[0]
    talk = small.copy(); f = small.size[1] / fig.size[1]
    cx, cy = round((MOUTH[0] - box[0]) * f), round((MOUTH[1] - box[1]) * f)
    ImageDraw.Draw(talk).rectangle([cx - 1, cy, cx, cy], fill=(60, 22, 18, 255))
    out = Image.new('RGBA', (CW * COLS, CH))
    for n, c in enumerate([small, talk]):
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        assert big.size[0] <= CW and big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, (n // COLS) * CH + CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'anxo-sprite.png'), optimize=True)
    print('escrito anxo-sprite.png', out.size, 'figura', small.size)
    fx, fy = FACE; s = FACE_S
    face = src.crop((fx - s // 2, fy - s // 2, fx + s // 2, fy + s // 2))
    sq = Image.new('RGBA', (s, s), (40, 34, 38, 255)); sq.alpha_composite(face)
    p = sq.convert('RGB').resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    p.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'anxo-face.png'), optimize=True)
    print('escrito anxo-face.png')

if __name__ == '__main__':
    main()
