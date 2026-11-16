#!/usr/bin/env python3
"""Xera o sprite e o retrato de Genaro, o panadeiro da Panadería Estación, a partir da folla de Oscar.

Entrada:  assets/personajes/genaro-panadero-hoja.png (1536×1024, fondo azul gris)
          fila 1: fronte, 3/4 fronte, perfil, 3/4 costas, costas, 3/4 costas
          fila 2 (en cadros): ciclo de andar (5), parado, falando, sinalando, sorprendido
Saídas:   img/genaro-sprite.png  folla de celas 160×280, 8 columnas:
            0 parado, 1 falando, 2 costas, 3 perfil dereita, 4 sinalando, 5 sorprendido, 6 fronte, 7 3/4 fronte
          img/genaro-face.png    retrato 320×320
Uso:      python3 tools/sprite-genaro.py
"""
import os, importlib.util
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sx', os.path.join(HERE, 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'genaro-panadero-hoja.png')
OUT = os.path.join(ROOT, 'img')
BG = (153, 169, 198)
H_PIX = 130
CW, CH, COLS = 160, 280, 8

# caixas (x0, y0, x1, y1) na folla orixinal, dentro dos cadros e sen os rótulos
BOXES = {
    'fronte': (40, 20, 300, 560), 'tres4': (330, 20, 580, 560), 'perfil': (600, 20, 780, 560),
    'costas': (1040, 20, 1280, 560),
    'parado': (632, 660, 800, 978), 'falando': (826, 660, 1024, 978),
    'sinalando': (1046, 660, 1280, 978), 'sorprendido': (1306, 660, 1518, 978),
}
FACE = (163, 108)   # centro da cara na vista de fronte

def figura(sheet, box):
    crop = sheet.crop(box)
    m = sx.bg_mask(crop, BG)
    rgba, _ = sx.cut(crop, m, 0, crop.size[0], 0, crop.size[1])
    return rgba

def main():
    sheet = Image.open(SRC).convert('RGB')
    f = {k: figura(sheet, b) for k, b in BOXES.items()}
    kv = H_PIX / f['fronte'].size[1]            # escala das vistas grandes
    kp = H_PIX * 0.99 / f['parado'].size[1]       # as poses están debuxadas máis pequenas
    order = [('parado', kp), ('falando', kp), ('costas', kv), ('perfil', kv), ('sinalando', kp), ('sorprendido', kp), ('fronte', kv), ('tres4', kv)]
    small = sx.palettize([sx.shrink(f[k], round(f[k].size[1] * s)) for k, s in order])
    out = Image.new('RGBA', (CW * COLS, CH))
    for n, c in enumerate(small):
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        if big.size[0] > CW: big = big.crop(((big.size[0] - CW) // 2, 0, (big.size[0] + CW) // 2, big.size[1]))
        assert big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, (n // COLS) * CH + CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'genaro-sprite.png'), optimize=True)
    print('escrito genaro-sprite.png', out.size)
    fx, fy = FACE; s = 130
    face = sheet.crop((fx - s // 2, fy - s // 2, fx + s // 2, fy + s // 2))
    p = face.resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    p.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'genaro-face.png'), optimize=True)
    print('escrito genaro-face.png')

if __name__ == '__main__':
    main()
