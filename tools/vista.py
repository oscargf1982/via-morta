#!/usr/bin/env python3
"""Vista desde o balcón do salón da Casa Juana: a Mikado na rotonda do museo do ferrocarril.
Decidido por Oscar (14-11-2026): a imaxe principal do xogo (img/portada-rotonda.jpg) é o que se ve
desde a fiestra; a vista anterior, coa gasolineira, distraía da Mikado.
Recorta a portada a 16:9 e debuxa por riba o marco da fiestra e a varanda de forxa do balcón.
Uso: python3 tools/vista.py   (despois, python3 tools/noite.py para a versión de noite)"""
import os
from PIL import Image, ImageDraw, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H, S = 1672, 941, 2                      # tamaño final e sobremostraxe
src = Image.open(os.path.join(ROOT, 'img', 'portada-rotonda.jpg')).convert('RGB')
im = src.crop((0, 96, 1536, 960)).resize((W * S, H * S), Image.LANCZOS)

OUT, FERRO, LUZ, MAD, MAD2, MADL = (10, 12, 18), (38, 41, 50), (104, 112, 130), (74, 50, 34), (52, 34, 24), (122, 88, 58)
ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
def box(x, y, w, h, fill, lw=4):
    d.rectangle([x * S, y * S, (x + w) * S, (y + h) * S], fill=fill, outline=OUT, width=lw * S)
def ln(x1, y1, x2, y2, col, lw):
    d.line([x1 * S, y1 * S, x2 * S, y2 * S], fill=col, width=lw * S)

# sombra suave do interior (o salón está máis escuro ca a rúa)
sh = Image.new('L', im.size, 0); sd = ImageDraw.Draw(sh)
sd.rectangle([0, 0, 120 * S, H * S], fill=150); sd.rectangle([(W - 120) * S, 0, W * S, H * S], fill=150); sd.rectangle([0, 0, W * S, 70 * S], fill=130)
sh = sh.filter(ImageFilter.GaussianBlur(40 * S))
im = Image.composite(Image.new('RGB', im.size, (8, 8, 14)), im, sh.point(lambda v: int(v * 0.75)))

# marco de madeira da fiestra: xambas e lintel
for x in (0, W - 58):
    box(x - 4, -4, 62, H + 8, MAD)
    ln(x + 12, 0, x + 12, H, MADL, 3); ln(x + 44, 0, x + 44, H, MAD2, 5)
box(-4, -4, W + 8, 40, MAD); ln(0, 26, W, 26, MAD2, 5); ln(0, 8, W, 8, MADL, 3)

# varanda de forxa do balcón: pasamáns, barrotes e volutas
TOP, BASE = 792, 918
for i, x in enumerate(range(86, W - 60, 46)):
    box(x - 5, TOP, 10, BASE - TOP, FERRO, 3); ln(x - 2, TOP + 6, x - 2, BASE - 6, LUZ, 2)
    if i % 2 == 0:
        cx, cy, r = x + 23, TOP + 44, 15
        d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], outline=OUT, width=9 * S)
        d.ellipse([(cx - r + 2) * S, (cy - r + 2) * S, (cx + r - 2) * S, (cy + r - 2) * S], outline=FERRO, width=5 * S)
box(40, TOP + 70, W - 80, 10, FERRO, 3)
box(40, BASE - 4, W - 80, 30, FERRO, 4); ln(60, BASE + 3, W - 60, BASE + 3, LUZ, 2)
box(30, TOP - 22, W - 60, 26, FERRO, 4); ln(50, TOP - 15, W - 50, TOP - 15, LUZ, 3)

im.paste(ov, (0, 0), ov)
im = im.resize((W, H), Image.LANCZOS)
im.save(os.path.join(ROOT, 'img', 'vista-salon.jpg'), quality=86, optimize=True)
print('escrito vista-salon.jpg', im.size)
