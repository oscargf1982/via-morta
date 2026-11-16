#!/usr/bin/env python3
"""Recorta a folla de expresións de Genaro (Oscar, 16-11-2026) en retratos con fondo transparente.

Entrada:  assets/personajes/genaro-expresiones-hoja.png (1536×1024, fondo azul liso; versión boa de Oscar)
          catro filas de 6 retratos de medio corpo
Saídas:   img/genaro/<expresión>.webp (256×256, lixeiro, para os diálogos e a cuarta parede)
          e, se se pasa unha carpeta como argumento, os recortes a tamaño completo nesa carpeta.
Uso:      python3 tools/expresiones-genaro.py [carpeta_completos]
"""
import os, sys
from PIL import Image
import importlib.util
spec = importlib.util.spec_from_file_location('sx', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sprite-xoan.py'))
sx = importlib.util.module_from_spec(spec); spec.loader.exec_module(sx)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'personajes', 'genaro-expresiones-hoja.png')
OUT = os.path.join(ROOT, 'img', 'genaro')
NOMES = [
    'sonriente', 'hablando', 'explicando', 'brazos-cruzados', 'pensativo', 'oh',
    'riendo', 'triste', 'enfadado', 'asustado', 'preocupado', 'aburrido',
    'gritando-enfadado', 'rascandose', 'guino', 'dudoso', 'rezando', 'celebrando',
    'neutro', 'esceptico', 'resignado', 'gritando', 'contento', 'serio',
]
BANDS = [(0, 270), (272, 512), (514, 768), (773, 1024)]
BG = (104, 123, 150)

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

def sen_anacos(box):
    """Borra os anacos soltos (p. ex. a man do retrato veciño): queda só o que toca a figura máis grande."""
    a = box.getchannel('A'); w, h = a.size; px = a.load()
    seen = set(); best = None
    for sx in range(0, w, 3):
        for sy in range(0, h, 3):
            if px[sx, sy] and (sx, sy) not in seen:
                comp, st = [], [(sx, sy)]; seen.add((sx, sy))
                while st:
                    x, y = st.pop(); comp.append((x, y))
                    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                        if 0 <= nx < w and 0 <= ny < h and px[nx, ny] and (nx, ny) not in seen: seen.add((nx, ny)); st.append((nx, ny))
                if not best or len(comp) > len(best): best = comp
    m = Image.new('L', (w, h)); mp = m.load()
    for x, y in best: mp[x, y] = 255
    box.putalpha(m); return box

def main():
    rgb = Image.open(SRC).convert('RGB')
    # fondo azul: recheo dende os bordos de cada fila (tolerante) + a cor exacta nos ocos pechados
    a = Image.new('L', rgb.size, 255)
    for y0, y1 in BANDS:
        band = rgb.crop((0, y0, rgb.size[0], y1)); m = sx.bg_mask(band, BG)
        mk = Image.new('L', band.size, 255); mp = mk.load()
        for yy in range(band.size[1]):
            for xx in range(band.size[0]):
                if m[yy][xx]: mp[xx, yy] = 0
        a.paste(mk, (0, y0))
    im = rgb.convert('RGBA'); im.putalpha(a)
    W, H = im.size; px = a.load()
    cuts = []
    for y0, y1 in BANDS:
        cols = runs([any(px[x, y] for y in range(y0, y1, 2)) for x in range(W)], 40)
        split = []
        for x0, x1 in cols:   # retratos que se tocan (unha man): córtanse polas columnas con menos tinta
            k = max(1, round((x1 - x0) / 250)); cuts_x = [x0]
            for i in range(1, k):
                c = x0 + (x1 - x0) * i // k
                cuts_x.append(min(range(c - 70, c + 70), key=lambda x: sum(1 for y in range(y0, y1) if px[x, y])))
            cuts_x.append(x1)
            split += list(zip(cuts_x, cuts_x[1:]))
        for x0, x1 in split:
            box = sen_anacos(im.crop((x0, y0, x1, y1))); bb = box.getbbox()
            cuts.append(box.crop(bb))
    assert len(cuts) == len(NOMES), f'agardaba {len(NOMES)} retratos, atopei {len(cuts)}'
    os.makedirs(OUT, exist_ok=True)
    full = sys.argv[1] if len(sys.argv) > 1 else None
    if full: os.makedirs(full, exist_ok=True)
    for n, c in zip(NOMES, cuts):
        if full: c.save(os.path.join(full, f'genaro-expresion-{n}.png'), optimize=True)
        s = max(c.size); sq = Image.new('RGBA', (s, s))
        sq.alpha_composite(c, ((s - c.size[0]) // 2, s - c.size[1]))   # pegado abaixo, coma un retrato
        sq.resize((256, 256), Image.LANCZOS).save(os.path.join(OUT, f'{n}.webp'), quality=82, method=6)
    print('escritos', len(cuts), 'retratos en', OUT)

if __name__ == '__main__':
    main()
