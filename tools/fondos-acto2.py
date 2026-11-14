#!/usr/bin/env python3
"""Fondos PROVISIONAIS do Acto 2 (rúa do Cardeal, farmacia e Club Fluvial).

Son bosquexos planos para poder xogar o acto mentres Oscar debuxa as ilustracións
definitivas. Levan o selo «bosquexo provisional». Os letreiros con texto (FARMACIA,
MALO SERÁ, SE ALUGA) píntanse no xogo, non aquí.

Uso:  python3 tools/fondos-acto2.py   (escribe img/bg-cardeal.jpg, bg-farmacia.jpg e bg-fluvial.jpg)
"""
import os, random
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'img')
W, H = 960, 540
random.seed(7)


def font(size):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def vgrad(d, box, c1, c2):
    x0, y0, x1, y1 = box
    for y in range(y0, y1):
        t = (y - y0) / max(1, y1 - y0 - 1)
        d.line([(x0, y), (x1, y)], fill=tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)))


def selo(im):
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([8, 28, 158, 50], 6, fill=(20, 20, 24))
    d.text((16, 32), 'BOSQUEXO PROVISIONAL', font=font(12), fill=(255, 210, 58))


def cardeal():
    im = Image.new('RGB', (W, H)); d = ImageDraw.Draw(im)
    vgrad(d, (0, 0, W, 150), (150, 182, 210), (205, 220, 228))
    # fachadas en perspectiva suave: catro casas de cores
    cores = [(196, 112, 92), (226, 206, 150), (150, 176, 160), (214, 170, 120), (180, 160, 190)]
    xs = [0, 180, 380, 600, 780, 960]
    for i in range(5):
        x0, x1 = xs[i], xs[i + 1]; top = 30 + (i % 2) * 24
        d.rectangle([x0, top, x1, 380], fill=cores[i]); d.rectangle([x0, top, x1, top + 10], fill=(120, 70, 50))
        for r in range(2):
            for k in range(3):
                wx = x0 + 22 + k * (x1 - x0 - 44) // 3; wy = top + 40 + r * 90
                d.rectangle([wx, wy, wx + 36, wy + 56], fill=(60, 70, 84)); d.rectangle([wx - 4, wy + 56, wx + 40, wy + 62], fill=(60, 60, 60))
    # farmacia (casa 3): toldo de raias vermellas e brancas e porta de cristal
    d.rectangle([396, 250, 584, 380], fill=(240, 236, 226))
    for k in range(10):
        d.polygon([(392 + k * 19, 230), (411 + k * 19, 230), (415 + k * 19, 262), (396 + k * 19, 262)], fill=(200, 40, 40) if k % 2 == 0 else (250, 250, 250))
    d.rectangle([450, 276, 530, 380], fill=(110, 140, 150)); d.rectangle([454, 280, 526, 376], fill=(160, 196, 204))
    # cruz verde (o neón pinta o brillo no xogo)
    d.rectangle([604, 180, 624, 236], fill=(30, 170, 80)); d.rectangle([586, 198, 642, 218], fill=(30, 170, 80))
    # locais baleiros con escaparate tapado
    for x0 in (30, 790):
        d.rectangle([x0, 290, x0 + 130, 380], fill=(90, 84, 74)); d.rectangle([x0 + 8, 298, x0 + 122, 372], fill=(222, 214, 190))
    # bar con terraza
    d.rectangle([200, 290, 360, 380], fill=(70, 50, 40)); d.rectangle([210, 298, 350, 372], fill=(190, 140, 70))
    for x in (215, 300):
        d.ellipse([x, 420, x + 50, 436], fill=(120, 120, 128)); d.line([(x + 25, 436), (x + 25, 470)], fill=(90, 90, 96), width=4)
    # chan de lousas
    vgrad(d, (0, 380, W, H), (170, 160, 150), (120, 110, 100))
    for y in range(392, H, 26):
        d.line([(0, y), (W, y)], fill=(140, 130, 120))
    for x in range(-400, W + 400, 70):
        d.line([(480 + (x - 480) * 0.35, 380), (x, H)], fill=(140, 130, 120))
    # farolas
    for x in (150, 720):
        d.rectangle([x, 220, x + 8, 430], fill=(40, 40, 44)); d.ellipse([x - 10, 206, x + 18, 230], fill=(250, 230, 170))
    selo(im); im.save(os.path.join(OUT, 'bg-cardeal.jpg'), quality=86)


def farmacia():
    im = Image.new('RGB', (W, H)); d = ImageDraw.Draw(im)
    vgrad(d, (0, 0, W, 360), (232, 226, 210), (214, 204, 184))
    # estanterías de madeira con caixiñas
    for sx in (40, 520):
        d.rectangle([sx, 40, sx + 400, 300], fill=(120, 80, 48))
        for r in range(4):
            y = 54 + r * 62; d.rectangle([sx + 10, y + 46, sx + 390, y + 52], fill=(90, 58, 34))
            x = sx + 16
            while x < sx + 380:
                w = random.choice((18, 22, 26)); c = random.choice([(240, 240, 236), (200, 220, 240), (240, 210, 200), (210, 236, 210), (250, 236, 170)])
                d.rectangle([x, y + 14 + random.randint(0, 8), x + w, y + 46], fill=c); x += w + 4
    # retrato do pai de Valerio
    d.rectangle([452, 70, 508, 140], fill=(150, 110, 60)); d.rectangle([458, 76, 502, 134], fill=(200, 190, 170)); d.ellipse([468, 84, 492, 108], fill=(150, 120, 100)); d.rectangle([466, 108, 494, 134], fill=(240, 240, 240))
    # chan de baldosa
    vgrad(d, (0, 360, W, H), (190, 180, 160), (150, 140, 120))
    for y in range(370, H, 28):
        d.line([(0, y), (W, y)], fill=(170, 160, 140))
    # mostrador
    d.rectangle([180, 300, 780, 400], fill=(140, 92, 52)); d.rectangle([170, 290, 790, 306], fill=(170, 116, 66))
    for k in range(5):
        d.rectangle([200 + k * 116, 322, 290 + k * 116, 384], outline=(110, 70, 40), width=3)
    # báscula antiga
    d.rectangle([840, 300, 900, 470], fill=(200, 60, 50)); d.ellipse([826, 250, 914, 338], fill=(230, 230, 224)); d.ellipse([836, 260, 904, 328], outline=(60, 60, 60), width=3)
    d.rectangle([830, 470, 910, 486], fill=(80, 80, 84))
    # porta (abaixo á esquerda)
    d.rectangle([0, 150, 30, 470], fill=(90, 110, 120))
    selo(im); im.save(os.path.join(OUT, 'bg-farmacia.jpg'), quality=86)


def fluvial():
    im = Image.new('RGB', (W, H)); d = ImageDraw.Draw(im)
    vgrad(d, (0, 0, W, 190), (168, 190, 206), (214, 222, 226))
    # ribeira do Cabe con árbores e a Ponte Vella ao fondo
    d.rectangle([0, 150, W, 200], fill=(96, 130, 96))
    for x in range(0, W, 46):
        d.ellipse([x - 10, 100 + (x * 7) % 30, x + 50, 180], fill=(70 + (x % 3) * 10, 110, 70))
    d.rectangle([560, 160, 900, 176], fill=(150, 140, 120))
    for k in range(4):
        d.pieslice([570 + k * 82, 160, 640 + k * 82, 214], 180, 360, fill=(110, 140, 150))
    d.rectangle([0, 196, W, 214], fill=(110, 140, 150))
    # céspede e beirarrúa
    vgrad(d, (0, 214, W, H), (120, 160, 100), (90, 130, 80))
    d.polygon([(120, 300), (840, 300), (930, 470), (30, 470)], fill=(222, 214, 196))
    # piscina
    d.polygon([(190, 320), (770, 320), (830, 440), (130, 440)], fill=(60, 150, 190))
    for k in range(1, 4):
        y = 320 + k * 30; d.line([(190 - k * 15, y), (770 + k * 15, y)], fill=(130, 200, 225), width=2)
    for k in range(1, 6):
        d.line([(190 + k * 96, 320), (130 + k * 117, 440)], fill=(240, 240, 240), width=2)
    # chiringuito «Malo Será»
    d.rectangle([20, 200, 190, 310], fill=(170, 120, 70)); d.polygon([(8, 204), (100, 160), (202, 204)], fill=(220, 190, 110))
    d.rectangle([30, 250, 180, 270], fill=(120, 80, 44)); d.rectangle([40, 216, 170, 240], fill=(50, 50, 50))
    # pizarra
    d.rectangle([200, 236, 240, 296], fill=(40, 44, 40)); d.line([(204, 296), (196, 312)], fill=(90, 60, 30), width=3); d.line([(236, 296), (244, 312)], fill=(90, 60, 30), width=3)
    # tumbonas
    for x in (560, 660, 760):
        d.polygon([(x, 470), (x + 80, 470), (x + 92, 500), (x + 12, 500)], fill=(240, 150, 60)); d.polygon([(x + 60, 470), (x + 80, 470), (x + 96, 444), (x + 78, 444)], fill=(240, 150, 60))
    # carretilla e sacos de carbón á dereita
    d.rectangle([856, 378, 930, 410], fill=(70, 110, 160)); d.ellipse([862, 404, 886, 428], fill=(30, 30, 30)); d.line([(930, 392), (958, 370)], fill=(90, 90, 90), width=5)
    for k in range(3):
        d.rounded_rectangle([860 + k * 26, 300 + (k % 2) * 6, 892 + k * 26, 350], 8, fill=(80, 70, 56))
    # grella
    d.rectangle([800, 320, 850, 330], fill=(40, 40, 40)); d.line([(806, 330), (806, 364)], fill=(40, 40, 40), width=3); d.line([(844, 330), (844, 364)], fill=(40, 40, 40), width=3)
    selo(im); im.save(os.path.join(OUT, 'bg-fluvial.jpg'), quality=86)


if __name__ == '__main__':
    cardeal(); farmacia(); fluvial(); print('feito')
