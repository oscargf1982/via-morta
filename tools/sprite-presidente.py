#!/usr/bin/env python3
"""Xera o sprite, o retrato e as expresións do presidente de Renfe (epílogo) a partir da folla de Oscar.

Entrada:  assets/personajes/presidente-hoja.jpg (1536×1024, fondo negro)
          fila 1: retrato grande, parado, andar ×3, man no peto, sinalando
          fila 2: brazos abertos, brazos cruzados, pensando, puño, explicando, sentado nun bloque, costas
          fila 3: 8 expresións de medio corpo
Saídas:   img/presidente-sprite.png  folla de celas 160×280, 8 columnas:
            0 parado, 1 falando, 2 andar 1, 3 andar 2, 4 andar 3, 5 man no peto, 6 sinalando, 7 brazos abertos,
            8 brazos cruzados, 9 pensando, 10 puño, 11 explicando, 12 sentado, 13 costas
          img/presidente-face.png    retrato 320×320 (o cadro grande)
          img/presidente/<expresión>.webp  256×256 para os diálogos
          Se se pasa unha carpeta como argumento, garda alí os recortes a tamaño completo.
Uso:      python3 tools/sprite-presidente.py [carpeta_completos]
"""
import os, sys, importlib.util
from collections import deque
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sx', os.path.join(HERE, 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)

ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'personajes', 'presidente-hoja.jpg')
OUT = os.path.join(ROOT, 'img')
H_PIX = 134          # un pouco máis alto ca Martín: home feito, de traxe
CW, CH, COLS = 160, 280, 8
NEGRO = 18           # o fondo e o contorno son negros: ata aquí é fondo se toca o bordo

POSES = [  # (nome, caixa) na folla orixinal
    ('parado', (427, 31, 587, 400)), ('andar1', (636, 31, 793, 400)), ('andar2', (802, 31, 968, 400)),
    ('andar3', (977, 31, 1145, 400)), ('peto', (1168, 31, 1320, 400)), ('sinalando', (1356, 31, 1531, 400)),
    ('abertos', (26, 437, 299, 784)), ('cruzado', (303, 437, 451, 784)), ('pensando', (492, 437, 639, 784)),
    ('puno', (672, 437, 884, 784)), ('explicando', (884, 437, 1148, 784)), ('sentado', (1134, 437, 1355, 784)),
    ('costas', (1381, 437, 1518, 784)),
]
EXPRESIONS = ['neutro', 'sonriente', 'serio', 'sorprendido', 'esceptico', 'triste', 'hablando', 'pensativo']
EXP_COLS = [(15, 199), (216, 397), (413, 600), (616, 782), (796, 959), (973, 1136), (1154, 1326), (1342, 1520)]
EXP_Y = (800, 990)
RETRATO = (27, 27, 381, 408)

def recorte(sheet, box):
    """Figura RGBA: fóra o negro que toca o bordo da caixa; queda só o anaco máis grande."""
    im = sheet.crop(box); w, h = im.size; px = im.load()
    bg = [[False] * w for _ in range(h)]
    q = deque([(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)])
    while q:
        x, y = q.popleft()
        if bg[y][x] or max(px[x, y]) > NEGRO: continue
        bg[y][x] = True
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not bg[ny][nx]: q.append((nx, ny))
    seen = [[False] * w for _ in range(h)]; best = []
    for y0 in range(h):
        for x0 in range(w):
            if bg[y0][x0] or seen[y0][x0]: continue
            comp, st = [], [(x0, y0)]; seen[y0][x0] = True
            while st:
                x, y = st.pop(); comp.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not bg[ny][nx] and not seen[ny][nx]: seen[ny][nx] = True; st.append((nx, ny))
            if len(comp) > len(best): best = comp
    out = Image.new('RGBA', (w, h)); op = out.load()
    for x, y in best: op[x, y] = px[x, y] + (255,)
    return out.crop(out.getbbox())

def contorno(im):
    """Devolve o contorno escuro que se perde ao quitar o fondo negro (1 píxel arredor)."""
    w, h = im.size; a = im.getchannel('A').load(); out = Image.new('RGBA', (w + 2, h + 2)); out.paste(im, (1, 1))
    d = out.load()
    for y in range(h + 2):
        for x in range(w + 2):
            if d[x, y][3]: continue
            if any(0 <= x - 1 + dx < w and 0 <= y - 1 + dy < h and a[x - 1 + dx, y - 1 + dy] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                d[x, y] = (14, 12, 22, 255)
    return out

def main():
    full = sys.argv[1] if len(sys.argv) > 1 else None
    sheet = Image.open(SRC).convert('RGB')
    figs = {n: recorte(sheet, b) for n, b in POSES}
    if full:
        os.makedirs(full, exist_ok=True)
        for n, f in figs.items(): f.save(os.path.join(full, f'presidente-{n}.png'))
    k = H_PIX / figs['parado'].size[1]
    order = ['parado', 'parado'] + [n for n, _ in POSES[1:]]
    small = sx.palettize([sx.shrink(figs[n], round(figs[n].size[1] * k)) for n in order])
    # falando: boca aberta baixo o bigote, medida na vista parada
    talk = small[1]; f = talk.size[1] / figs['parado'].size[1]
    mx, my = round(108 * f), round(62 * f)
    ImageDraw.Draw(talk).rectangle([mx - 1, my, mx, my], fill=(70, 26, 26, 255))
    small = [contorno(c) for c in small]
    rows = (len(small) + COLS - 1) // COLS
    out = Image.new('RGBA', (CW * COLS, CH * rows))
    for n, c in enumerate(small):
        big = c.resize((c.size[0] * sx.SCALE, c.size[1] * sx.SCALE), Image.NEAREST)
        if big.size[0] > CW: big = big.crop(((big.size[0] - CW) // 2, 0, (big.size[0] + CW) // 2, big.size[1]))
        assert big.size[1] <= CH, (n, big.size)
        out.paste(big, ((n % COLS) * CW + (CW - big.size[0]) // 2, (n // COLS) * CH + CH - 3 - big.size[1]), big)
    out.save(os.path.join(OUT, 'presidente-sprite.png'), optimize=True)
    print('escrito presidente-sprite.png', out.size, 'figura', small[0].size)
    # retrato: o cadro grande, sen marco
    p = sheet.crop(RETRATO)
    if full: p.save(os.path.join(full, 'presidente-retrato.png'))
    s = min(p.size); p = p.crop((0, 0, s, s))
    p = p.resize((80, 80), Image.LANCZOS).quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    p.resize((320, 320), Image.NEAREST).save(os.path.join(OUT, 'presidente-face.png'), optimize=True)
    print('escrito presidente-face.png')
    # expresións: medio corpo con fondo transparente, cadradas
    os.makedirs(os.path.join(OUT, 'presidente'), exist_ok=True)
    for nome, (x0, x1) in zip(EXPRESIONS, EXP_COLS):
        e = recorte(sheet, (x0, EXP_Y[0], x1, EXP_Y[1]))
        if full: e.save(os.path.join(full, f'expresion-{nome}.png'))
        s = max(e.size); sq = Image.new('RGBA', (s, s)); sq.paste(e, ((s - e.size[0]) // 2, s - e.size[1]))
        sq.resize((256, 256), Image.LANCZOS).save(os.path.join(OUT, 'presidente', f'{nome}.webp'), quality=88)
    print('escritas', len(EXPRESIONS), 'expresións')

if __name__ == '__main__':
    main()
