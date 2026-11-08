#!/usr/bin/env python3
"""Prepara as ilustracións do libro infantil (libro/) a partir de img/ e assets/personajes/.
Recortes das follas de personaxe, versións de noite e redución a 1400 px.
Uso: python3 tools/libro-imaxes.py <carpeta de saída>/img"""
import os, sys
from PIL import Image, ImageEnhance
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
def img(n): return Image.open(os.path.join(ROOT, 'img', n)).convert('RGB')
def hoja(n): return Image.open(os.path.join(ROOT, 'assets', 'personajes', n)).convert('RGB')
def save(im, n, q=82): im.thumbnail((1400, 1400)); im.save(os.path.join(OUT, n), quality=q)
def noite(im, gamma=1.9, k=0.45, mix=0.36, tint=(20, 34, 78)):
    im = ImageEnhance.Color(im).enhance(0.45); im = im.point(lambda v: int(255 * (v / 255) ** gamma * k))
    return Image.blend(im, Image.new('RGB', im.size, tint), mix)
for n in ['portada-rotonda.jpg', 'bg-anden-estacion.jpg', 'bg-vestibulo-estacion.jpg', 'mural-primer-plano.jpg', 'bg-praza-estacion.jpg',
          'bg-praza-estacion-2.jpg', 'bg-concepcion-arenal.jpg', 'bg-fraternal.jpg', 'taller-1952.jpg', 'bg-doutor-casares.jpg', 'bg-rua-morin.jpg',
          'vista-salon.jpg', 'bg-casa-patio.jpg', 'bg-concello-exterior.jpg', 'bg-concello-vestibulo.jpg', 'noite-salon.jpg', 'noite-vista.jpg',
          'bg-taller.jpg', 'bg-taller-vigas.jpg', 'cine-mural.jpg']:
    save(img(n), n)
c = hoja('dona-concha-hoja.png'); save(c.crop((15, 50, 205, 510)), 'concha-frente.jpg', 88)
x = c.crop((825, 985, 1025, 1260)); W = int(x.height * 1.6); bg = Image.new('RGB', (W, x.height), c.getpixel((5, 5))); bg.paste(x, ((W - x.width) // 2, 0)); save(bg, 'concha-xesto.jpg', 88)
save(hoja('tio-david-hoja.png').crop((30, 625, 368, 1200)), 'demetrio-conta.jpg', 88)
save(hoja('rosario-higueras-hoja.png').crop((16, 12, 364, 444)), 'rosario-retrato.jpg', 88)
e = hoja('don-eladio-hoja.png'); save(e.crop((30, 50, 535, 915)), 'eladio-sentado.jpg', 88); save(e.crop((570, 550, 1536, 965)), 'eladio-corre.jpg', 88)
save(hoja('xoan-carballeira-hoja.png').crop((30, 15, 315, 965)), 'xoan-frente.jpg', 88)
t = img('bg-taller.jpg'); w, h = t.size; save(t.crop((0, int(h * .18), w, int(h * .18) + int(w * .62))), 'taller-fenda.jpg')
save(noite(img('bg-casa-patio.jpg')), 'noite-patio.jpg'); save(noite(img('portada-rotonda.jpg')), 'noite-rotonda.jpg')
p = img('portada-rotonda.jpg'); w, h = p.size; mk = p.crop((int(w * .12), int(h * .3), int(w * .88), int(h * .72)))
save(mk.copy(), 'mikado-preto.jpg', 84); save(noite(mk, 1.7, 0.55, 0.3, (30, 30, 70)), 'mikado-noite.jpg', 84)
print('listo', OUT)
