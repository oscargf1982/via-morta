#!/usr/bin/env python3
"""Fondos PROVISIONAIS de «Vía morta» (M1) en pixel art xerado por código.

Debúxanse a 480×270 e amplíanse ×2 sen suavizar (960×540, o lenzo lóxico).
Son bosquexos para probar o motor: cando Oscar envíe fotos ou Street View,
substitúense por fondos pintados a partir desas referencias.
Os textos dos letreiros non van aquí: píntanse no xogo (draw() de cada escena).

Uso:  python3 tools/fondos.py        (escribe img/bg-anden.png, bg-vestibulo.png,
                                       bg-praza.png, bg-mapa.png e ivan-sprite.png)
"""
import math, random, os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'img')
w, h = 480, 270
BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]


def hexc(s):
    s = s.lstrip('#'); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vgrad(im, box, c1, c2, steps=6):
    """degradado vertical con tramado ordenado (aspecto pixel art)"""
    x0, y0, x1, y1 = box; px = im.load(); c1, c2 = hexc(c1), hexc(c2)
    pal = [mix(c1, c2, i / (steps - 1)) for i in range(steps)]
    for y in range(y0, y1):
        t = (y - y0) / max(1, y1 - y0 - 1) * (steps - 1)
        k = int(t); f = t - k
        for x in range(x0, x1):
            c = pal[min(steps - 1, k + (1 if f * 16 > BAYER[y % 4][x % 4] else 0))]
            px[x, y] = c


def noise(im, box, col, n, seed=1, size=1):
    rnd = random.Random(seed); d = ImageDraw.Draw(im); x0, y0, x1, y1 = box
    for _ in range(n):
        x, y = rnd.randrange(x0, x1), rnd.randrange(y0, y1); d.rectangle([x, y, x + size - 1, y], fill=col)


def save(im, name):
    im.resize((w * 2, h * 2), Image.NEAREST).save(os.path.join(OUT, name), optimize=True)
    print('escrito', name)


# ---------------------------------------------------------------- A1 · Andén 1
def anden():
    im = Image.new('RGB', (w, h)); d = ImageDraw.Draw(im)
    vgrad(im, (0, 0, w, 130), '#8fb4d8', '#f0d2a0', 7)                    # ceo de tarde
    # outeiros e a torre do castelo ao lonxe
    d.polygon([(0, 112), (60, 96), (130, 88), (190, 70), (240, 64), (300, 80), (380, 92), (480, 84), (480, 130), (0, 130)], fill=hexc('#7d8f6a'))
    d.polygon([(0, 122), (90, 110), (200, 116), (330, 104), (480, 112), (480, 135), (0, 135)], fill=hexc('#6a7c58'))
    d.rectangle([206, 46, 220, 70], fill=hexc('#b9ab8e')); d.rectangle([204, 44, 222, 47], fill=hexc('#a39478'))
    for x in range(204, 223, 4): d.rectangle([x, 41, x + 1, 43], fill=hexc('#a39478'))
    d.rectangle([180, 62, 250, 72], fill=hexc('#a89a7e'))                   # muralla e mosteiro, en silueta
    d.rectangle([236, 56, 252, 66], fill=hexc('#a89a7e'))
    # cocheras do depósito (dereita): ladrillo con portas en arco
    d.rectangle([290, 92, 470, 140], fill=hexc('#9a5a3c')); d.polygon([(286, 92), (380, 76), (474, 92)], fill=hexc('#5c4a44'))
    for i in range(6):
        x = 300 + i * 28; d.rectangle([x, 108, x + 18, 140], fill=hexc('#2e2420')); d.pieslice([x, 100, x + 18, 116], 180, 360, fill=hexc('#2e2420'))
    noise(im, (290, 92, 470, 140), hexc('#86503a'), 260, 3)
    # vías do fondo e catenaria
    vgrad(im, (0, 135, w, 182), '#7b746a', '#6a6359', 3)
    noise(im, (0, 135, w, 182), hexc('#5a544c'), 900, 5)
    for y in (142, 150, 160, 170):
        d.line([(0, y), (w, y)], fill=hexc('#9a9a9e')); d.line([(0, y + 3), (w, y + 3)], fill=hexc('#9a9a9e'))
    for x in range(10, w, 70): d.rectangle([x, 70, x + 2, 140], fill=hexc('#4a4e52')); d.line([(x - 10, 74), (x + 30, 74)], fill=hexc('#4a4e52'))
    d.line([(0, 78), (w, 78)], fill=hexc('#3a3e42'))
    # vía 1 (onde para o rexional), xunto ao andén
    d.rectangle([0, 182, w, 190], fill=hexc('#5a5249')); noise(im, (0, 182, w, 190), hexc('#3e3832'), 300, 7)
    d.line([(0, 184), (w, 184)], fill=hexc('#b4b4b8')); d.line([(0, 188), (w, 188)], fill=hexc('#b4b4b8'))
    # andén: bordo, liña amarela e lousas
    d.rectangle([0, 190, w, 196], fill=hexc('#d8d2c4'))
    d.rectangle([0, 197, w, 200], fill=hexc('#e9c42a'))
    vgrad(im, (0, 200, w, h), '#a8a296', '#8e887c', 4)
    for y in range(206, h, 12): d.line([(0, y), (w, y)], fill=hexc('#7f796e'))
    for y0 in range(200, h, 12):
        off = 0 if (y0 // 12) % 2 else 14
        for x in range(off, w, 28): d.line([(x, y0), (x, y0 + 11)], fill=hexc('#878175'))
    # parede da estación á esquerda (porta do vestíbulo) en perspectiva
    d.polygon([(0, 0), (52, 26), (52, 222), (0, 262)], fill=hexc('#d9c9a6'))
    d.polygon([(6, 92), (40, 102), (40, 214), (6, 236)], fill=hexc('#5a3d26'))     # porta
    d.polygon([(10, 98), (36, 106), (36, 150), (10, 144)], fill=hexc('#8fb0c0'))  # cristal
    d.polygon([(0, 0), (52, 26), (52, 34), (0, 10)], fill=hexc('#b8a882'))
    # marquesiña (por riba de todo)
    d.rectangle([0, 0, w, 20], fill=hexc('#2f4a3c'))
    for x in range(0, w, 10): d.line([(x, 0), (x + 10, 20)], fill=hexc('#26392f'))
    for x in range(0, w, 8): d.polygon([(x, 20), (x + 8, 20), (x + 4, 27)], fill=hexc('#2f4a3c'))   # lambrequín
    # columnas de ferro fundido (tamén van como capa dianteira no xogo)
    for cx in (150, 360):
        d.rectangle([cx, 20, cx + 9, 233], fill=hexc('#2f4a3c')); d.rectangle([cx + 2, 20, cx + 3, 233], fill=hexc('#4a6a58'))
        d.rectangle([cx - 3, 226, cx + 12, 235], fill=hexc('#253a2f')); d.polygon([(cx - 8, 20), (cx + 17, 20), (cx + 9, 30), (cx, 30)], fill=hexc('#2f4a3c'))
    # banco do andén
    d.rectangle([258, 214, 322, 218], fill=hexc('#7a4e2c')); d.rectangle([258, 204, 322, 208], fill=hexc('#7a4e2c'))
    d.rectangle([262, 218, 265, 230], fill=hexc('#2a2a2a')); d.rectangle([316, 218, 319, 230], fill=hexc('#2a2a2a'))
    # papeleira
    d.rectangle([424, 214, 434, 232], fill=hexc('#3a5a48')); d.rectangle([423, 212, 435, 214], fill=hexc('#2a2a2a'))
    save(im, 'bg-anden.png')


# ---------------------------------------------------------- A2 · Vestíbulo
def vestibulo():
    im = Image.new('RGB', (w, h)); d = ImageDraw.Draw(im)
    vgrad(im, (0, 0, w, 168), '#e2d6bc', '#d2c4a4', 4)                 # parede
    noise(im, (0, 0, w, 168), hexc('#c8b994'), 900, 11)
    d.rectangle([0, 0, w, 14], fill=hexc('#6b4428')); d.rectangle([0, 14, w, 17], fill=hexc('#4c2f1b'))   # viga de madeira
    for x in range(20, w, 60): d.rectangle([x, 0, x + 6, 16], fill=hexc('#55351f'))
    # piares de pedra
    for x0 in (112, 352):
        d.rectangle([x0, 17, x0 + 16, 168], fill=hexc('#b8a988'))
        for y in range(17, 168, 11): d.line([(x0, y), (x0 + 16, y)], fill=hexc('#9c8e70'))
        for y in range(17, 168, 22): d.line([(x0 + 8, y), (x0 + 8, y + 11)], fill=hexc('#9c8e70'))
    # zócolo
    d.rectangle([0, 150, w, 168], fill=hexc('#8a7a60')); d.line([(0, 150), (w, 150)], fill=hexc('#6c5e46'))
    # marco do mural (a foto real ponse enriba)
    d.rectangle([146, 24, 334, 132], fill=hexc('#4c2f1b')); d.rectangle([149, 27, 331, 129], fill=hexc('#2a1a10'))
    try:
        m = Image.open(os.path.join(OUT, 'mural-estacion.jpg')).convert('RGB').resize((180, 101), Image.LANCZOS)
        im.paste(m, (150, 28))
    except FileNotFoundError:
        pass
    # taquillas (esquerda)
    d.rectangle([8, 48, 104, 150], fill=hexc('#7a5a3c')); d.rectangle([10, 50, 102, 58], fill=hexc('#5a3d26'))
    for x in (16, 60):
        d.rectangle([x, 66, x + 36, 112], fill=hexc('#3a4a54')); d.rectangle([x + 2, 68, x + 34, 110], fill=hexc('#7f9aa8'))
        d.line([(x + 6, 70), (x + 14, 100)], fill=hexc('#a9c2cc')); d.rectangle([x - 2, 112, x + 38, 118], fill=hexc('#4c3524'))
    # portas cara á praza (dereita)
    d.rectangle([380, 30, 470, 168], fill=hexc('#5a3d26'))
    for x in (384, 426):
        d.rectangle([x, 44, x + 40, 166], fill=hexc('#6e4c30')); d.rectangle([x + 4, 48, x + 36, 110], fill=hexc('#cfe0e8'))
        d.rectangle([x + 4, 48, x + 36, 60], fill=hexc('#f4f0d8'))
    d.rectangle([380, 30, 470, 42], fill=hexc('#2a2e35'))
    # panel de saídas
    d.rectangle([336, 40, 372, 64], fill=hexc('#14161a')); d.rectangle([337, 41, 371, 63], fill=hexc('#1c2026'))
    # extintor e carteis
    d.rectangle([132, 120, 138, 138], fill=hexc('#c0221c')); d.rectangle([133, 116, 137, 120], fill=hexc('#2a2a2a'))
    d.rectangle([118, 60, 126, 72], fill=hexc('#c0221c'))
    for i, x in enumerate((150, 196, 242, 288)):
        d.rectangle([x, 136, x + 38, 148], fill=hexc(['#e8e4dc', '#dcd8f0', '#e4ecf0', '#f0e4e8'][i]))
    # máquina de café
    d.rectangle([336, 96, 362, 150], fill=hexc('#7a1e22')); d.rectangle([340, 102, 358, 120], fill=hexc('#1a1a1e')); d.rectangle([344, 126, 354, 136], fill=hexc('#2a2a2e'))
    # chan de terrazo axadrezado
    vgrad(im, (0, 168, w, h), '#b9b0a0', '#a69d8c', 3)
    for y0 in range(168, h, 14):
        for x0 in range((y0 // 14 % 2) * 14, w, 28):
            d.rectangle([x0, y0, x0 + 13, y0 + 13], fill=hexc('#9a907e'))
    noise(im, (0, 168, w, h), hexc('#c8c0b0'), 1400, 13)
    # banco central (obstáculo)
    d.rectangle([200, 196, 280, 202], fill=hexc('#7a4e2c')); d.rectangle([200, 186, 280, 190], fill=hexc('#7a4e2c'))
    for x in (204, 274): d.rectangle([x, 202, x + 3, 214], fill=hexc('#2a2a2a'))
    # porta ao andén (esquerda, baixo)
    d.rectangle([0, 130, 6, 230], fill=hexc('#3a2a1a'))
    save(im, 'bg-vestibulo.png')


# ------------------------------------------------------ A3 · Praza da Estación
def praza():
    im = Image.new('RGB', (w, h)); d = ImageDraw.Draw(im)
    vgrad(im, (0, 0, w, 150), '#9cc0e0', '#e8dcc0', 6)
    # edificio da estación (fachada de dous andares)
    d.rectangle([10, 40, 270, 168], fill=hexc('#e4d6b4')); noise(im, (10, 40, 270, 168), hexc('#d6c6a0'), 700, 21)
    d.rectangle([10, 36, 270, 42], fill=hexc('#b8a47e')); d.rectangle([10, 100, 270, 104], fill=hexc('#c2ae86'))
    d.polygon([(110, 36), (140, 20), (170, 36)], fill=hexc('#b8a47e'))                # frontón
    d.ellipse([131, 22, 149, 40], fill=hexc('#f4f0e4')); d.ellipse([133, 24, 147, 38], outline=hexc('#3a3a3a'))
    d.line([(140, 31), (140, 26)], fill=hexc('#222222')); d.line([(140, 31), (144, 31)], fill=hexc('#222222'))
    for x in range(20, 262, 30):
        if 116 <= x <= 146: continue
        d.rectangle([x, 52, x + 14, 88], fill=hexc('#3e5060')); d.pieslice([x, 46, x + 14, 58], 180, 360, fill=hexc('#3e5060'))
        d.rectangle([x, 112, x + 14, 150], fill=hexc('#3e5060')); d.pieslice([x, 106, x + 14, 118], 180, 360, fill=hexc('#3e5060'))
        d.rectangle([x - 1, 88, x + 15, 90], fill=hexc('#c2ae86'))
    d.rectangle([116, 108, 164, 168], fill=hexc('#5a3d26')); d.pieslice([116, 96, 164, 124], 180, 360, fill=hexc('#5a3d26'))   # porta principal
    d.rectangle([120, 114, 160, 168], fill=hexc('#7f9aa8')); d.line([(140, 114), (140, 168)], fill=hexc('#5a3d26'))
    d.rectangle([96, 92, 184, 100], fill=hexc('#2f4a3c'))                              # rótulo (texto no xogo)
    # rúa Doutor Casares cara á dereita, en perspectiva
    d.polygon([(270, 150), (480, 120), (480, 196), (270, 172)], fill=hexc('#8a8478'))
    for i, (x0, top, col) in enumerate([(290, 70, '#d8c8a8'), (330, 80, '#c8b090'), (366, 88, '#e0d4c0'), (398, 94, '#b3262a'), (432, 98, '#d0c4b0')]):
        x1 = x0 + 36 - i * 3
        d.rectangle([x0, top, x1, 150 - i * 6], fill=hexc(col))
        for wy in range(top + 8, 140 - i * 6, 16):
            for wx in range(x0 + 5, x1 - 6, 10): d.rectangle([wx, wy, wx + 4, wy + 7], fill=hexc('#3e4a56'))
        d.rectangle([x0 - 1, top - 3, x1 + 1, top], fill=hexc('#6a4a3a'))
    # gasolineira, ao fondo
    d.rectangle([446, 112, 480, 116], fill=hexc('#e8e8e8')); d.rectangle([450, 116, 452, 140], fill=hexc('#bbbbbb')); d.rectangle([474, 116, 476, 140], fill=hexc('#bbbbbb'))
    d.rectangle([440, 92, 448, 104], fill=hexc('#2a6ab0'))
    # árbores
    for (tx, ty, r) in [(258, 112, 22), (300, 128, 16), (6, 130, 20)]:
        d.rectangle([tx - 2, ty, tx + 2, ty + 50], fill=hexc('#4a3424'))
        d.ellipse([tx - r, ty - r, tx + r, ty + r * 0.8], fill=hexc('#4f7a3c')); d.ellipse([tx - r + 5, ty - r + 3, tx + r - 9, ty + r * 0.3], fill=hexc('#6a9450'))
    # chan da praza
    vgrad(im, (0, 168, w, h), '#c4b8a0', '#a89c84', 4)
    for y in range(176, h, 10): d.line([(0, y), (w, y)], fill=hexc('#9c907a'))
    for y0 in range(168, h, 10):
        for x in range((y0 // 10 % 2) * 10, w, 20): d.line([(x, y0), (x, y0 + 9)], fill=hexc('#b0a48c'))
    d.rectangle([0, 166, w, 169], fill=hexc('#8a8070'))
    # farola
    d.rectangle([206, 96, 208, 196], fill=hexc('#2a2e30')); d.rectangle([202, 90, 212, 98], fill=hexc('#2a2e30')); d.rectangle([204, 92, 210, 96], fill=hexc('#f4e6a0'))
    # plano de Monforte (letreiro)
    d.rectangle([214, 140, 252, 172], fill=hexc('#2f4a3c')); d.rectangle([216, 142, 250, 166], fill=hexc('#e8dcb8'))
    d.line([(220, 160), (234, 148), (246, 156)], fill=hexc('#4a7ab0'), width=2); d.rectangle([224, 146, 228, 150], fill=hexc('#c0221c'))
    d.rectangle([231, 172, 234, 196], fill=hexc('#2a2e30'))
    # quiosco de Dona Concha
    K = (290, 120, 384, 236)
    d.rectangle([K[0] - 6, K[1], K[2] + 6, K[1] + 12], fill=hexc('#2f6a4a')); d.polygon([(K[0] - 8, K[1]), (337, K[1] - 16), (K[2] + 8, K[1])], fill=hexc('#245a3c'))
    d.rectangle([K[0] - 6, K[1] + 12, K[2] + 6, K[1] + 15], fill=hexc('#1c4a30'))
    d.rectangle([K[0], K[1] + 15, K[0] + 6, K[3]], fill=hexc('#2f6a4a')); d.rectangle([K[2] - 6, K[1] + 15, K[2], K[3]], fill=hexc('#2f6a4a'))
    d.rectangle([K[0] + 6, K[1] + 15, K[2] - 6, 186], fill=hexc('#3a2a1e'))           # interior escuro da xanela
    for i in range(5):  # revistas colgadas
        d.rectangle([K[0] + 10 + i * 15, K[1] + 18, K[0] + 21 + i * 15, K[1] + 32], fill=hexc(['#d04030', '#3070c0', '#e0c040', '#40a060', '#c050a0'][i]))
    d.rectangle([K[0], 186, K[2], K[3]], fill=hexc('#2f6a4a'))                          # mostrador
    d.rectangle([K[0] - 4, 184, K[2] + 4, 190], fill=hexc('#245a3c'))
    for i in range(6):  # xornais e lambetadas no mostrador
        d.rectangle([K[0] + 6 + i * 14, 192, K[0] + 17 + i * 14, 206], fill=hexc(['#efe8d8', '#e8e0cc', '#f0c030', '#e84a3a', '#f0f0f0', '#50a0e0'][i]))
    d.rectangle([K[0] + 4, 210, K[2] - 4, 232], fill=hexc('#285c40'))
    save(im, 'bg-praza.png')


# ------------------------------------------------------------ Mapa de Monforte
def mapa():
    im = Image.new('RGB', (w, h)); d = ImageDraw.Draw(im)
    vgrad(im, (0, 0, w, h), '#efe2bf', '#e2cf9f', 5)
    noise(im, (0, 0, w, h), hexc('#d9c494'), 2500, 31)
    noise(im, (0, 0, w, h), hexc('#f6ecd0'), 1200, 32)
    # bordo do papel
    d.rectangle([0, 0, w - 1, h - 1], outline=hexc('#8a6a40')); d.rectangle([4, 4, w - 5, h - 5], outline=hexc('#b89a68'))
    # outeiro de San Vicente
    d.ellipse([196, 50, 290, 112], fill=hexc('#c8b680')); d.ellipse([212, 58, 274, 100], fill=hexc('#baa66c'))
    # río Cabe
    pts = [(60, 0), (78, 40), (110, 76), (150, 110), (166, 150), (150, 190), (160, 230), (196, 270)]
    for i in range(len(pts) - 1): d.line([pts[i], pts[i + 1]], fill=hexc('#5c8fb8'), width=7)
    for i in range(len(pts) - 1): d.line([pts[i], pts[i + 1]], fill=hexc('#7fb0d4'), width=3)
    d.rectangle([148, 140, 182, 146], fill=hexc('#9a8a6a'))                          # ponte vella
    # rúas (esquema)
    for a, b in [((182, 143), (300, 150)), ((240, 112), (250, 150)), ((300, 150), (380, 190)), ((250, 150), (230, 200)), ((300, 150), (310, 96)), ((230, 200), (380, 190))]:
        d.line([a, b], fill=hexc('#f8f0dc'), width=4); d.line([a, b], fill=hexc('#cdb78a'), width=1)
    # ferrocarril: liñas que converxen na estación
    for a, b in [((380, 190), (480, 150)), ((380, 190), (480, 230)), ((380, 190), (300, 270)), ((380, 190), (420, 100)), ((420, 100), (440, 0))]:
        d.line([a, b], fill=hexc('#3a3a3a'), width=3)
        n = int(math.dist(a, b) / 6)
        for k in range(n):
            t = k / n; x, y = a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t
            ang = math.atan2(b[1] - a[1], b[0] - a[0]) + math.pi / 2
            d.line([(x - math.cos(ang) * 3, y - math.sin(ang) * 3), (x + math.cos(ang) * 3, y + math.sin(ang) * 3)], fill=hexc('#3a3a3a'))
    # rotonda do depósito
    d.ellipse([402, 160, 432, 184], outline=hexc('#7a4a30'), width=3)
    # bosques
    rnd = random.Random(7)
    for _ in range(40):
        x, y = rnd.randrange(10, 470), rnd.randrange(10, 260)
        if 120 < x < 420 and 60 < y < 220: continue
        d.ellipse([x, y, x + 7, y + 6], fill=hexc('#8aa060')); d.rectangle([x + 3, y + 6, x + 3, y + 8], fill=hexc('#6a5030'))
    # rosa dos ventos
    cx, cy = 440, 238
    d.polygon([(cx, cy - 18), (cx + 4, cy), (cx, cy + 18), (cx - 4, cy)], fill=hexc('#6a4a2a'))
    d.polygon([(cx - 18, cy), (cx, cy - 4), (cx + 18, cy), (cx, cy + 4)], fill=hexc('#a88a5a'))
    save(im, 'bg-mapa.png')


# ----------------------------------------------- Iván: sprite PROVISIONAL de corpo enteiro
def ivan():
    """2 celas de 75×120 px (parado, falando con xesto) amplíanse ×2 → 150×240; pés na fila 117.
    Proporción de Martín (unhas 6,5 cabezas). Provisional ata ter arte definitiva."""
    cw, ch = 75, 120
    im = Image.new('RGBA', (cw * 2, ch), (0, 0, 0, 0))
    OL = hexc('#1a1410')
    SK, SKs, HA, HAl = hexc('#e2ac88'), hexc('#c08866'), hexc('#3a2a22'), hexc('#5a4434')
    VE, VEs, RF, PO, POl = hexc('#d4ea2c'), hexc('#a8bc1c'), hexc('#cfd3d0'), hexc('#1f2329'), hexc('#2e343c')
    TR, TRs, SH, PU, TI = hexc('#2b303c'), hexc('#20242e'), hexc('#121212'), hexc('#7a2a8a'), hexc('#5a2a7a')
    for f in range(2):
        d = ImageDraw.Draw(im); o = f * cw; cx = o + 37
        def R(x0, y0, x1, y1, c, ol=True):
            if ol: d.rectangle([cx + x0 - 1, y0 - 1, cx + x1 + 1, y1 + 1], fill=OL)
            d.rectangle([cx + x0, y0, cx + x1, y1], fill=c)
        # pernas (pantalón) e zapatos
        R(-9, 70, -1, 113, TR); R(1, 70, 9, 113, TR)
        d.rectangle([cx - 3, 74, cx - 2, 112], fill=TRs); d.rectangle([cx + 7, 74, cx + 8, 112], fill=TRs)
        R(-11, 113, -1, 117, SH); R(1, 113, 11, 117, SH)
        # brazo esquerdo (do espectador), sempre baixado
        R(-17, 33, -12, 62, VE); d.rectangle([cx - 13, 36, cx - 12, 62], fill=VEs)
        R(-17, 63, -12, 69, SK); d.rectangle([cx - 17, 67, cx - 12, 69], fill=SKs)
        # torso: polo escuro e chaleco reflector
        R(-12, 30, 12, 72, PO)
        d.rectangle([cx - 12, 31, cx - 4, 72], fill=VE); d.rectangle([cx + 4, 31, cx + 12, 72], fill=VE)
        d.rectangle([cx - 3, 31, cx + 3, 72], fill=PO); d.polygon([(cx - 3, 31), (cx, 37), (cx + 3, 31)], fill=SK)
        d.rectangle([cx - 1, 37, cx + 1, 50], fill=TI)                               # gravata
        d.rectangle([cx - 12, 54, cx + 12, 56], fill=RF); d.rectangle([cx - 12, 63, cx + 12, 65], fill=RF)
        d.rectangle([cx - 3, 54, cx + 3, 56], fill=POl); d.rectangle([cx - 3, 63, cx + 3, 65], fill=POl)
        d.rectangle([cx + 5, 42, cx + 10, 44], fill=PU)                              # «renfe»
        d.rectangle([cx - 12, 68, cx + 12, 72], fill=VEs)
        d.rectangle([cx - 12, 31, cx - 11, 72], fill=VEs)
        # brazo dereito: baixado (parado) ou levantado explicando (falando)
        if f == 0:
            R(12, 33, 17, 62, VE); R(12, 63, 17, 69, SK); d.rectangle([cx + 12, 67, cx + 17, 69], fill=SKs)
        else:
            R(12, 33, 17, 46, VE); R(15, 24, 21, 40, VE); R(16, 17, 21, 24, SK); d.rectangle([cx + 19, 13, cx + 20, 17], fill=SK)
        # pescozo e cabeza
        R(-3, 25, 3, 31, SKs, ol=False)
        d.ellipse([cx - 9, 6, cx + 9, 28], fill=OL); d.ellipse([cx - 8, 7, cx + 8, 27], fill=SK)
        d.ellipse([cx - 11, 14, cx - 7, 20], fill=SK); d.ellipse([cx + 7, 14, cx + 11, 20], fill=SK)   # orellas
        d.rectangle([cx - 8, 22, cx + 8, 27], fill=SK); d.rectangle([cx - 6, 25, cx + 6, 27], fill=SKs)
        # pelo de cepillo
        d.ellipse([cx - 9, 3, cx + 9, 15], fill=HA); d.rectangle([cx - 9, 9, cx - 7, 16], fill=HA); d.rectangle([cx + 7, 9, cx + 9, 16], fill=HA)
        for k in range(-7, 8, 3): d.line([(cx + k, 2), (cx + k + 1, 5)], fill=HAl)
        # cara
        d.rectangle([cx - 5, 15, cx - 2, 15], fill=HA); d.rectangle([cx + 2, 15, cx + 5, 15], fill=HA)   # cellas
        d.rectangle([cx - 4, 17, cx - 3, 18], fill=OL); d.rectangle([cx + 3, 17, cx + 4, 18], fill=OL)   # ollos
        d.rectangle([cx, 18, cx + 1, 21], fill=SKs)                                                     # nariz
        if f == 0: d.rectangle([cx - 2, 23, cx + 3, 23], fill=hexc('#9a5a4a'))
        else: d.rectangle([cx - 2, 23, cx + 3, 24], fill=hexc('#5a1e1e'))
        d.rectangle([cx - 6, 21, cx - 5, 26], fill=SKs); d.rectangle([cx + 6, 21, cx + 7, 26], fill=SKs)     # barba de dous días
    im = im.resize((cw * 2 * 2, ch * 2), Image.NEAREST)
    im.save(os.path.join(OUT, 'ivan-sprite.png'), optimize=True); print('escrito ivan-sprite.png')


if __name__ == '__main__':
    anden(); vestibulo(); mapa(); ivan()   # praza(): substituída polo fondo de Oscar (bg-praza-estacion.jpg)
