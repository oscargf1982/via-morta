#!/usr/bin/env python3
"""Fondos PROVISIONAIS do Acto 3 ata que cheguen os debuxos de Oscar.
- (O interior das cocheras xa é o debuxo de Oscar: img/bg-cocheras-interior-esq.jpg e -der.jpg, dúas metades da súa panorámica.)
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
    noite_rotonda().save(P('noite-rotonda.jpg'), quality=84, optimize=True)
    exterior_noite().save(P('noite-cocheras.jpg'), quality=82, optimize=True)
    print('escritos noite-coche-viaxeiros.jpg, noite-rotonda.jpg, noite-cocheras.jpg')
