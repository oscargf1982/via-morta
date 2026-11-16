#!/usr/bin/env python3
"""Fondos PROVISIONAIS do Acto 3 ata que cheguen os debuxos de Oscar.
- img/bg-cocheras-interior.jpg: interior das cocheras do museo, de día: almacén coa maquinaria da carpintería da Casa Juana
  (serra de cinta, serra circular, cepilladora tapada, torno, prensas), a lousa, o motor tapado cunha lona, unha peza de bronce
  da Mikado no banco, os sacos de carbón, a carretilla e as pegadas cara ao postigo do fondo. Sen Mikado (16-11-2026).
- img/noite-rotonda.jpg: a portada de Oscar (a rotonda coa Mikado) de noite, co lume da cabina e o farol acesos.
- img/noite-coche-viaxeiros.jpg: interior do coche de viaxeiros (ilustración de Oscar, img/bg-coche-viaxeiros.jpg) pasado a noite; pola fiestra da esquerda, a porta do taller acesa.
- img/noite-cocheras.jpg: o exterior das cocheras (ilustración de Oscar) de noite, coa porta do taller entreaberta e luz dentro.
O texto da lousa e o «A.F.G.» do motor píntanse no xogo (js/acto3.js), non aquí.
Uso: python3 tools/fondos-acto3.py"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, 'img', *a)
W, H = 1600, 900
K = W / 960  # coordenadas lóxicas do xogo (960×540) → píxeles


def k(*v):
    return tuple(int(round(x * K)) for x in v)


def interior():
    """Interior das cocheras de día: almacén coa maquinaria da carpintería da Casa Juana (decisión de Oscar do 16-11-2026).
    Sen Mikado: a Mikado está fóra, na rotonda do museo."""
    im = Image.new('RGB', (W, H), (40, 30, 26))
    d = ImageDraw.Draw(im)
    ink = (22, 16, 14)
    wood, woodD = (128, 92, 58), (92, 64, 40)
    iron, ironD = (84, 96, 92), (58, 66, 64)
    # parede do fondo (ladrillo)
    d.rectangle(k(250, 60, 710, 360), fill=(118, 58, 40))
    for y in range(64, 360, 9):
        off = 0 if (y // 9) % 2 else 9
        for x in range(250 - off, 710, 18):
            d.rectangle(k(x + 1, y + 1, x + 17, y + 8), fill=(132, 66, 46) if (x * 7 + y) % 3 else (122, 60, 42))
    # portalón do fondo, pechado, de madeira; un postigo entreaberto cara á rotonda
    d.rectangle(k(340, 120, 620, 360), fill=(78, 56, 38), outline=ink, width=4)
    for x in range(352, 620, 22):
        d.line(k(x, 124, x, 356), fill=(64, 46, 30), width=2)
    d.line(k(480, 120, 480, 360), fill=ink, width=3)
    d.rectangle(k(560, 284, 604, 360), fill=(232, 222, 190), outline=ink, width=3)   # luz polo postigo
    d.polygon(k(560, 284, 584, 290, 584, 362, 560, 360), fill=(70, 50, 34), outline=ink)
    # paredes laterais en perspectiva
    d.polygon(k(0, 0, 250, 60, 250, 360, 0, 540), fill=(96, 48, 34))
    d.polygon(k(960, 0, 710, 60, 710, 360, 960, 540), fill=(90, 44, 32))
    for i in range(1, 14):
        t = i / 14
        d.line(k(0, 540 * t, 250, 60 + 300 * t), fill=(70, 34, 24), width=2)
        d.line(k(960, 540 * t, 710, 60 + 300 * t), fill=(66, 32, 22), width=2)
    for (xa, xb) in ((40, 110), (140, 200)):
        d.polygon(k(xa, 120 - xa * 0.25, xb, 120 - xb * 0.25 + 10, xb, 250 - xb * 0.1, xa, 270 - xa * 0.1), fill=(150, 170, 180), outline=ink)
    for (xa, xb) in ((850, 920), (760, 820)):
        d.polygon(k(xb, 120 - (960 - xb) * 0.25, xa, 120 - (960 - xa) * 0.25 + 10, xa, 250 - (960 - xa) * 0.1, xb, 270 - (960 - xb) * 0.1), fill=(150, 170, 180), outline=ink)
    # cuberta
    d.polygon(k(0, 0, 960, 0, 710, 60, 250, 60), fill=(52, 38, 30))
    for x in (250, 400, 560, 710):
        d.line(k(480, 6, x, 60), fill=(92, 66, 44), width=int(5 * K))
    d.line(k(250, 60, 710, 60), fill=(92, 66, 44), width=int(8 * K))
    d.line(k(0, 30, 960, 30), fill=(82, 58, 40), width=int(10 * K))
    # chan de formigón
    d.polygon(k(0, 540, 250, 360, 710, 360, 960, 540), fill=(104, 100, 94))
    for i in range(6):
        y = 360 + 180 * (i / 6) ** 1.6
        d.line(k(0, y, 960, y), fill=(96, 92, 86), width=1)
    # serraxe vella no chan
    for i in range(40):
        x, y = 260 + (i * 53) % 420, 372 + (i * 29) % 90
        d.ellipse(k(x, y, x + 6, y + 2), fill=(150, 128, 90))
    # lousa
    d.polygon(k(60, 196, 196, 186, 196, 286, 60, 304), fill=(36, 50, 44), outline=(120, 86, 50))
    d.line(k(60, 304, 196, 286), fill=(120, 86, 50), width=int(5 * K))
    # banco da esquerda co motor tapado
    d.polygon(k(30, 440, 230, 410, 230, 420, 30, 452), fill=(110, 78, 50), outline=ink)
    for x in (44, 210):
        d.rectangle(k(x, 420 + (x == 44) * 28, x + 10, 500), fill=(80, 56, 36))
    d.polygon(k(60, 432, 70, 360, 120, 340, 180, 346, 210, 380, 214, 416), fill=(96, 110, 84), outline=ink)
    d.line(k(100, 350, 120, 420), fill=(76, 90, 66), width=3)
    d.line(k(160, 350, 170, 414), fill=(76, 90, 66), width=3)
    # serra de cinta: dous volantes nun bastidor alto
    d.rectangle(k(282, 176, 300, 430), fill=ironD, outline=ink, width=3)
    d.ellipse(k(262, 170, 330, 238), fill=iron, outline=ink, width=3)
    d.ellipse(k(262, 300, 330, 368), fill=iron, outline=ink, width=3)
    for cy in (204, 334):
        d.ellipse(k(290, cy - 6, 302, cy + 6), fill=ink)
    d.line(k(326, 204, 326, 334), fill=(200, 200, 196), width=3)                 # a cinta
    d.rectangle(k(300, 278, 352, 288), fill=wood, outline=ink, width=2)          # mesa
    d.rectangle(k(276, 420, 312, 436), fill=ironD, outline=ink, width=2)
    # serra circular: mesa e disco
    d.polygon(k(332, 404, 432, 396, 440, 410, 336, 420), fill=wood, outline=ink)
    for x in (342, 424):
        d.rectangle(k(x, 410, x + 8, 452), fill=woodD, outline=ink)
    d.pieslice(k(364, 372, 408, 416), 180, 360, fill=(190, 190, 186), outline=ink, width=2)
    # cepilladora baixo unha lona gris
    d.polygon(k(436, 392, 446, 336, 474, 320, 520, 326, 540, 350, 546, 392), fill=(120, 122, 118), outline=ink)
    d.line(k(470, 324, 476, 390), fill=(100, 100, 98), width=3)
    # banco do medio cunha peza de bronce e unha lata de graxa
    d.polygon(k(452, 424, 572, 416, 576, 426, 454, 434), fill=wood, outline=ink)
    for x in (460, 562):
        d.rectangle(k(x, 428, x + 8, 470), fill=woodD, outline=ink)
    d.rounded_rectangle(k(486, 398, 534, 420), 6, fill=(196, 150, 70), outline=ink, width=2)
    d.ellipse(k(476, 402, 494, 418), fill=(214, 172, 90), outline=ink, width=2)
    d.rectangle(k(544, 404, 562, 420), fill=(40, 40, 44), outline=ink, width=2)
    # torno para madeira
    d.rectangle(k(600, 378, 716, 388), fill=ironD, outline=ink, width=2)
    d.rectangle(k(600, 356, 630, 380), fill=iron, outline=ink, width=2)
    d.rectangle(k(690, 362, 712, 380), fill=iron, outline=ink, width=2)
    for x in (606, 700):
        d.rectangle(k(x, 388, x + 10, 440), fill=ironD, outline=ink)
    # bidóns
    for x in (640, 666):
        d.rectangle(k(x, 316, x + 22, 356), fill=(40, 74, 110), outline=ink, width=2)
    # prensas de carpinteiro contra a parede dereita
    for x in (730, 760):
        d.rectangle(k(x, 300, x + 8, 396), fill=ironD, outline=ink)
        d.rectangle(k(x - 8, 300, x + 16, 308), fill=iron, outline=ink)
        d.line(k(x + 4, 300, x + 4, 284), fill=ink, width=3)
    # sacos de carbón e pa
    for (x, y) in ((760, 470), (820, 476), (880, 482), (790, 440), (850, 446)):
        d.ellipse(k(x - 34, y - 30, x + 34, y + 26), fill=(150, 128, 92), outline=ink, width=3)
        d.line(k(x - 20, y - 22, x + 20, y - 22), fill=(110, 92, 64), width=2)
    d.polygon(k(700, 520, 760, 500, 800, 520, 740, 536), fill=(20, 20, 22))
    d.line(k(930, 360, 900, 470), fill=(110, 80, 50), width=int(5 * K))
    d.polygon(k(890, 460, 914, 466, 906, 500, 880, 494), fill=(80, 80, 84), outline=ink)
    # carretilla de obra con carbón
    d.polygon(k(646, 446, 712, 446, 700, 470, 660, 470), fill=(60, 110, 70), outline=ink)
    d.polygon(k(650, 446, 708, 446, 690, 436, 664, 436), fill=(24, 22, 22))
    d.ellipse(k(696, 462, 716, 482), fill=(30, 30, 30), outline=ink, width=2)
    d.line(k(650, 452, 620, 470), fill=woodD, width=int(3 * K))
    # pegadas de carbonilla: dos sacos ao postigo
    for i in range(10):
        t = i / 9
        x, y = 720 + (582 - 720) * t + (6 if i % 2 else -6), 500 + (366 - 500) * t
        s = 1 - 0.5 * t
        d.ellipse(k(x - 5 * s, y - 2 * s, x + 5 * s, y + 2 * s), fill=(48, 46, 44))
    # raios de luz polas fiestras
    beam = Image.new('RGB', im.size, 0)
    b = ImageDraw.Draw(beam)
    b.polygon(k(60, 130, 200, 110, 420, 540, 200, 540), fill=(60, 56, 40))
    b.polygon(k(900, 130, 780, 110, 600, 540, 820, 540), fill=(50, 46, 34))
    im = ImageChops.add(im, beam.filter(ImageFilter.GaussianBlur(30)))
    return im


def noite_rotonda():
    """A rotonda do museo de noite (portada de Oscar, recortada a 16:9 e pasada a noite), coa Mikado acesa."""
    im = Image.open(P('portada-rotonda.jpg')).convert('RGB')
    w, h = im.size
    ch = int(w * 9 / 16)
    y0 = min(160, h - ch)
    im = im.crop((0, y0, w, y0 + ch)).resize((W, H), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(0.5)
    im = im.point(lambda v: int(255 * (v / 255) ** 1.8 * 0.5))
    im = Image.blend(im, Image.new('RGB', im.size, (20, 34, 78)), 0.34)
    glow = Image.new('RGB', im.size, 0)
    g = ImageDraw.Draw(glow)
    g.ellipse(k(490, 205, 550, 255), fill=(170, 80, 24))         # lume na cabina
    g.ellipse(k(790, 176, 836, 214), fill=(255, 214, 140))        # farol
    g.polygon(k(812, 196, 960, 150, 960, 300), fill=(90, 80, 50))  # feixe do farol
    g.ellipse(k(120, 420, 260, 500), fill=(140, 100, 40))         # farol de man no chan
    g.ellipse(k(300, 400, 700, 540), fill=(70, 46, 20))           # reflexo no chan
    glow = glow.filter(ImageFilter.GaussianBlur(22 * K))
    return ImageChops.add(im, glow)


def exterior_noite():
    im = Image.open(P('bg-cocheras.jpg')).convert('RGB')
    im = ImageEnhance.Color(im).enhance(0.45)
    im = im.point(lambda v: int(255 * (v / 255) ** 1.9 * 0.45))
    im = Image.blend(im, Image.new('RGB', im.size, (20, 34, 78)), 0.36)
    # porta do taller (dereita): a persiana subida un palmo e luz dentro; o candado, aberto, pendurado
    glow = Image.new('RGB', im.size, 0)
    g = ImageDraw.Draw(glow)
    g.rectangle([1284, 650, 1452, 684], fill=(255, 190, 90))
    g.polygon([(1284, 684), (1452, 684), (1540, 800), (1200, 800)], fill=(150, 100, 40))
    for x0, x1 in ((1136, 1170), (1536, 1574)):                                  # fiestras acesas
        g.rectangle([x0, 478, x1, 572], fill=(200, 150, 70))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    im = ImageChops.add(im, glow)
    return im


def coche_noite():
    """Interior do coche de viaxeiros (ilustración de Oscar, img/bg-coche-viaxeiros.jpg) pasado a noite.
    As lámpadas, apagadas (Martín está escondido). Pola fiestra grande da esquerda vese a porta do taller das
    cocheras coa luz por debaixo; polas outras, ceo de noite."""
    src = Image.open(P('bg-coche-viaxeiros.jpg')).convert('RGB')
    sw, sh = src.size
    px = src.load()
    # máscara do exterior: o que non é madeira (vermello-marrón) nin cortina (azul escuro)
    mask = Image.new('L', src.size, 0)
    pm = mask.load()
    zonas = [(0, 40, 150, 490), (405, 110, 478, 380), (515, 140, 570, 340), (1100, 140, 1160, 340), (1210, 120, 1275, 380), (1515, 40, 1672, 480)]
    for (x0, y0, x1, y1) in zonas:
        for y in range(y0, min(y1, sh)):
            for x in range(x0, min(x1, sw)):
                r, g, b = px[x, y]
                madeira = r - b > 45
                cortina = b - r > 35 and g < 150
                if not madeira and not cortina:
                    pm[x, y] = 255
    mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    # ceo de noite para todas as fiestras
    ceo = Image.new('RGB', src.size, (14, 22, 46))
    g = ImageDraw.Draw(ceo)
    for y in range(sh):
        t = y / sh
        g.line([(0, y), (sw, y)], fill=(int(12 + 14 * t), int(20 + 16 * t), int(44 + 20 * t)))
    # a fiestra grande da esquerda: a fachada das cocheras de noite, coa porta acesa
    vista = Image.open(P('noite-cocheras.jpg')).convert('RGB').crop((1090, 330, 1560, 830)).resize((160, 450), Image.LANCZOS)
    ceo.paste(vista, (-6, 40))
    noite = ImageEnhance.Brightness(src).enhance(0.38)
    noite = ImageEnhance.Color(noite).enhance(0.7)
    noite = Image.blend(noite, Image.new('RGB', src.size, (16, 22, 52)), 0.28)
    noite.paste(ceo, (0, 0), mask)
    # luz que entra pola fiestra da esquerda (a da porta do taller) e luar pola dereita
    luz = Image.new('RGB', src.size, 0)
    l = ImageDraw.Draw(luz)
    l.polygon([(0, 300), (150, 330), (520, 941), (0, 941)], fill=(70, 46, 18))
    l.polygon([(1672, 200), (1520, 240), (1180, 941), (1672, 941)], fill=(14, 20, 40))
    noite = ImageChops.add(noite, luz.filter(ImageFilter.GaussianBlur(60)))
    return noite.resize((W, H), Image.LANCZOS)


if __name__ == '__main__':
    coche_noite().save(P('noite-coche-viaxeiros.jpg'), quality=84, optimize=True)
    interior().save(P('bg-cocheras-interior.jpg'), quality=84, optimize=True)
    noite_rotonda().save(P('noite-rotonda.jpg'), quality=84, optimize=True)
    exterior_noite().save(P('noite-cocheras.jpg'), quality=82, optimize=True)
    print('escritos bg-cocheras-interior.jpg, noite-rotonda.jpg, noite-cocheras.jpg')
