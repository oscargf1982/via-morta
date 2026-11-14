#!/usr/bin/env python3
"""Versión nocturna das fotos de Oscar (salón e vista do balcón) para a noite que pecha o Acto 1 e o patio da segunda noite (Acto 2).
Só é un tratamento de cor (escurecer e azular), non un debuxo novo. Provisional ata que haxa arte de noite.
Uso: python3 tools/noite.py"""
import os
from PIL import Image, ImageEnhance
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for src, out in [('bg-casa-salon.jpg', 'noite-salon.jpg'), ('vista-salon.jpg', 'noite-vista.jpg'), ('bg-casa-patio.jpg', 'noite-patio.jpg')]:
    im = Image.open(os.path.join(ROOT, 'img', src)).convert('RGB')
    im = ImageEnhance.Color(im).enhance(0.45)
    im = im.point(lambda v: int(255 * (v / 255) ** 1.9 * 0.45))
    azul = Image.new('RGB', im.size, (20, 34, 78))
    im = Image.blend(im, azul, 0.36)
    im.save(os.path.join(ROOT, 'img', out), quality=82, optimize=True)
    print('escrito', out, im.size)

# Acto 2: o patio de noite coa luz por debaixo da porta verde do taller (e sen ela, cando se apaga)
from PIL import ImageDraw, ImageFilter
base = Image.open(os.path.join(ROOT, 'img', 'noite-patio.jpg')).convert('RGB')
sx = base.size[0] / 960
glow = Image.new('RGB', base.size, (0, 0, 0)); g = ImageDraw.Draw(glow)
g.rectangle([int(858 * sx), int(470 * sx), int(934 * sx), int(484 * sx)], fill=(255, 196, 90))   # raia baixo a porta
g.rectangle([int(893 * sx), int(60 * sx), int(899 * sx), int(470 * sx)], fill=(255, 170, 70))    # rendixa entre follas
g.polygon([(int(860 * sx), int(482 * sx)), (int(934 * sx), int(482 * sx)), (int(900 * sx), int(420 * sx)), (int(700 * sx), int(440 * sx))], fill=(150, 104, 40))  # luz no chan
glow = glow.filter(ImageFilter.GaussianBlur(14 * sx))
from PIL import ImageChops
ImageChops.add(base, glow).save(os.path.join(ROOT, 'img', 'noite-patio-luz.jpg'), quality=82, optimize=True)
print('escrito noite-patio-luz.jpg')
