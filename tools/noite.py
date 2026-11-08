#!/usr/bin/env python3
"""Versión nocturna das fotos de Oscar (salón e vista do balcón) para a noite que pecha o Acto 1.
Só é un tratamento de cor (escurecer e azular), non un debuxo novo. Provisional ata que haxa arte de noite.
Uso: python3 tools/noite.py"""
import os
from PIL import Image, ImageEnhance
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for src, out in [('bg-casa-salon.jpg', 'noite-salon.jpg'), ('vista-salon.jpg', 'noite-vista.jpg')]:
    im = Image.open(os.path.join(ROOT, 'img', src)).convert('RGB')
    im = ImageEnhance.Color(im).enhance(0.45)
    im = im.point(lambda v: int(255 * (v / 255) ** 1.9 * 0.45))
    azul = Image.new('RGB', im.size, (20, 34, 78))
    im = Image.blend(im, azul, 0.36)
    im.save(os.path.join(ROOT, 'img', out), quality=82, optimize=True)
    print('escrito', out, im.size)
