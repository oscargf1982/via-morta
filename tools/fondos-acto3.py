#!/usr/bin/env python3
"""Fondos PROVISIONAIS do Acto 3 ata que cheguen os debuxos de Oscar.
- img/bg-cocheras-interior.jpg: interior das cocheras do museo, de día, coa Mikado de fronte (recortada de img/cine-mikado.jpg,
  ilustración de Oscar), a lousa, o motor tapado cunha lona e os sacos de carbón.
- img/noite-cocheras-interior.jpg: o mesmo de noite, co farol da Mikado aceso e lume na fornalla.
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


def mikado():
    """Recorta a Mikado de fronte da ilustración da cinemática: fóra o ceo e a choiva azul."""
    src = Image.open(P('cine-mikado.jpg')).convert('RGB')
    x0, y0, x1, y1 = 400, 40, 1272, 941
    im = src.crop((x0, y0, x1, y1))
    a = Image.new('L', im.size, 0)
    px, pa = im.load(), a.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            r, g, b = px[x, y]
            sky = (b - r > 22 and r + g + b < 260) or (b - r > 34)
            pa[x, y] = 0 if sky else 255
    a = a.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(2))
    # marxes laterais suaves (a fume e os carrís esvaecen)
    m = Image.new('L', im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([60, 0, im.size[0] - 60, im.size[1]], 80, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(40))
    a = ImageChops.multiply(a, m)
    im.putalpha(a)
    return im


def interior(noite):
    im = Image.new('RGB', (W, H), (40, 30, 26))
    d = ImageDraw.Draw(im)
    ink = (22, 16, 14)
    # parede do fondo (ladrillo) e portalón por onde entraba a máquina
    d.rectangle(k(250, 60, 710, 360), fill=(118, 58, 40))
    for y in range(64, 360, 9):
        off = 0 if (y // 9) % 2 else 9
        for x in range(250 - off, 710, 18):
            d.rectangle(k(x + 1, y + 1, x + 17, y + 8), fill=(132, 66, 46) if (x * 7 + y) % 3 else (122, 60, 42))
    d.rectangle(k(340, 120, 620, 360), fill=(34, 30, 34), outline=ink, width=4)
    # paredes laterais en perspectiva
    d.polygon(k(0, 0, 250, 60, 250, 360, 0, 540), fill=(96, 48, 34))
    d.polygon(k(960, 0, 710, 60, 710, 360, 960, 540), fill=(90, 44, 32))
    for i in range(1, 14):
        t = i / 14
        d.line(k(0, 540 * t, 250, 60 + 300 * t), fill=(70, 34, 24), width=2)
        d.line(k(960, 540 * t, 710, 60 + 300 * t), fill=(66, 32, 22), width=2)
    # fiestras altas laterais
    for (xa, xb) in ((40, 110), (140, 200)):
        ya, yb = 60 + (xa / 250) * -60 + 40, 60 + (xb / 250) * -60 + 40
        d.polygon(k(xa, 120 - xa * 0.25, xb, 120 - xb * 0.25 + 10, xb, 250 - xb * 0.1, xa, 270 - xa * 0.1),
                  fill=(150, 170, 180) if not noite else (24, 32, 52), outline=ink)
    for (xa, xb) in ((850, 920), (760, 820)):
        d.polygon(k(xb, 120 - (960 - xb) * 0.25, xa, 120 - (960 - xa) * 0.25 + 10, xa, 250 - (960 - xa) * 0.1, xb, 270 - (960 - xb) * 0.1),
                  fill=(150, 170, 180) if not noite else (24, 32, 52), outline=ink)
    # cuberta: tirantes de madeira
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
    # carrís cara á máquina
    for xa, xb in ((300, 448), (660, 512)):
        d.line(k(xa, 540, xb, 360), fill=(60, 58, 58), width=int(10 * K))
        d.line(k(xa, 540, xb, 360), fill=(150, 146, 140), width=int(4 * K))
    for i in range(9):
        t = (i / 9) ** 1.5
        y = 540 - 180 * t
        xa, xb = 300 + (448 - 300) * t, 660 + (512 - 660) * t
        d.rectangle(k(xa - 18 * (1 - t), y - 6 * (1 - t) - 2, xb + 18 * (1 - t), y), fill=(74, 56, 40))
    # esquerda: lousa na parede
    d.polygon(k(60, 196, 196, 186, 196, 286, 60, 304), fill=(36, 50, 44), outline=(120, 86, 50))
    d.line(k(60, 304, 196, 286), fill=(120, 86, 50), width=int(5 * K))
    # esquerda: banco de traballo co motor tapado cunha lona
    d.polygon(k(30, 440, 230, 410, 230, 420, 30, 452), fill=(110, 78, 50), outline=ink)
    for x in (44, 210):
        d.rectangle(k(x, 420 + (x == 44) * 28, x + 10, 500), fill=(80, 56, 36))
    d.polygon(k(60, 432, 70, 360, 120, 340, 180, 346, 210, 380, 214, 416), fill=(96, 110, 84), outline=ink)
    d.line(k(100, 350, 120, 420), fill=(76, 90, 66), width=3)
    d.line(k(160, 350, 170, 414), fill=(76, 90, 66), width=3)
    # dereita: sacos de carbón e unha pa
    for (x, y) in ((760, 470), (820, 476), (880, 482), (790, 440), (850, 446)):
        d.ellipse(k(x - 34, y - 30, x + 34, y + 26), fill=(150, 128, 92), outline=ink, width=3)
        d.line(k(x - 20, y - 22, x + 20, y - 22), fill=(110, 92, 64), width=2)
    d.polygon(k(700, 520, 760, 500, 800, 520, 740, 536), fill=(20, 20, 22))      # carbón espallado
    d.line(k(930, 360, 900, 470), fill=(110, 80, 50), width=int(5 * K))         # pa
    d.polygon(k(890, 460, 914, 466, 906, 500, 880, 494), fill=(80, 80, 84), outline=ink)
    # bidóns ao fondo dereita
    for x in (650, 676):
        d.rectangle(k(x, 316, x + 22, 356), fill=(40, 74, 110), outline=ink, width=2)
    # a Mikado
    mk = mikado()
    hh = int(330 * K)
    ww = int(mk.size[0] * hh / mk.size[1])
    mk = mk.resize((ww, hh), Image.LANCZOS)
    if not noite:
        # de día: farol apagado e sen fume claro
        rgb = mk.convert('RGB')
        rgb = ImageEnhance.Brightness(rgb).enhance(0.8)
        a = mk.getchannel('A')
        dd = ImageDraw.Draw(rgb)
        cx, cy = int(ww * 0.5), int(hh * 0.18)
        r = int(hh * 0.058)
        halo = Image.new('L', rgb.size, 0)
        ImageDraw.Draw(halo).ellipse([cx - 3 * r, cy - 3 * r, cx + 3 * r, cy + 3 * r], fill=150)
        rgb = Image.composite(Image.new('RGB', rgb.size, (30, 30, 36)), rgb, halo.filter(ImageFilter.GaussianBlur(r)))
        dd = ImageDraw.Draw(rgb)
        dd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(58, 56, 50), outline=(20, 18, 16), width=4)
        dd.ellipse([cx - r // 2, cy - r // 2, cx, cy], fill=(90, 88, 80))
        mk = rgb
        mk.putalpha(a)
    im.paste(mk, (int(480 * K - ww / 2), int(560 * K - hh)), mk)
    if noite:
        im = ImageEnhance.Brightness(im).enhance(0.55)
        im = Image.blend(im, Image.new('RGB', im.size, (18, 24, 54)), 0.25)
        glow = Image.new('RGB', im.size, 0)
        g = ImageDraw.Draw(glow)
        g.ellipse(k(430, 210, 530, 300), fill=(255, 200, 110))                   # farol
        g.polygon(k(450, 290, 510, 290, 700, 540, 260, 540), fill=(120, 90, 40))  # luz no chan
        g.ellipse(k(420, 460, 540, 520), fill=(255, 110, 30))                    # fornalla
        g.ellipse(k(36, 300, 120, 360), fill=(160, 120, 60))                     # lámpada do banco
        glow = glow.filter(ImageFilter.GaussianBlur(26 * K))
        im = ImageChops.add(im, glow)
    else:
        # raios de luz polas fiestras
        beam = Image.new('RGB', im.size, 0)
        b = ImageDraw.Draw(beam)
        b.polygon(k(60, 130, 200, 110, 420, 540, 200, 540), fill=(60, 56, 40))
        b.polygon(k(900, 130, 780, 110, 600, 540, 820, 540), fill=(50, 46, 34))
        im = ImageChops.add(im, beam.filter(ImageFilter.GaussianBlur(30)))
    return im


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


if __name__ == '__main__':
    interior(False).save(P('bg-cocheras-interior.jpg'), quality=84, optimize=True)
    interior(True).save(P('noite-cocheras-interior.jpg'), quality=84, optimize=True)
    exterior_noite().save(P('noite-cocheras.jpg'), quality=82, optimize=True)
    print('escritos bg-cocheras-interior.jpg, noite-cocheras-interior.jpg, noite-cocheras.jpg')
