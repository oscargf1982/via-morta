#!/usr/bin/env python3
"""Monta o libro infantil (libro/capitulo-NN.md) nunha páxina HTML con páxinas A5.
Uso: python3 tools/libro-imaxes.py build/img && python3 tools/libro.py libro/capitulo-*.md build/index.html"""
import re, sys, html, os
src = sys.argv[1:-1]; out = sys.argv[-1]
def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'\*(.+?)\*', r'<em>\1</em>', t)
    return t
def blocks(lines):
    res=[]; ul=False
    for l in lines:
        l=l.rstrip()
        if not l:
            if ul: res.append('</ul>'); ul=False
            continue
        if l.startswith('- '):
            if not ul: res.append('<ul>'); ul=True
            res.append('<li>'+inline(l[2:])+'</li>'); continue
        if ul: res.append('</ul>'); ul=False
        if l=='---': continue
        if l.startswith('**') and l.endswith('**') and l.count('**')==2:
            res.append('<h3>'+inline(l[2:-2])+'</h3>'); continue
        res.append('<p>'+inline(l)+'</p>')
    if ul: res.append('</ul>')
    return '\n'.join(res)
def actblocks(t):
    out=[]
    for sec in re.split(r'\n(?=\*\*\d)',t.strip()):
        lines=[l for l in sec.splitlines() if l.strip()]
        head=lines[0]; items=[l[2:] for l in lines[1:] if l.startswith('- ')]
        m=re.match(r'\*\*(.+?)\*\*\s*(.*)',head)
        h,rest=m.group(1),m.group(2)
        kind='q'
        if 'Une' in rest: kind='une'
        elif 'Escribe.' in h or 'significa' in h: kind='write'
        elif 'Ordena' in h: kind='ord'
        elif 'Verdadeiro' in h: kind='vf'
        elif 'ebuxa' in h or 'Inventa' in h or 'detective' in h or 'lista' in h: kind='draw'
        elif 'adiviña' in h: kind='think'
        elif 'Pensa' in h: kind='think'
        b=f'<div class="act act-{kind}"><h3>{inline(h)}</h3>'
        if rest: b+=f'<p>{inline(rest)}</p>'
        if kind=='une':
            a=[x.strip() for x in items[0].split('·')]; d=[x.strip() for x in items[1].split('·')]
            b+='<div class="une">'+''.join(f'<span class="w">{inline(x)} ●</span><span class="d">● {inline(y)}</span>' for x,y in zip(a,d))+'</div>'
        elif kind=='q':
            b+=''.join(f'<p class="qq">{inline(x)}</p><div class="line"></div>' for x in items)
        elif kind=='ord':
            b+='<div class="ord">'+''.join(f'<span><i></i>{inline(x.strip())}</span>' for x in items[0].split('·'))+'</div>'
        elif kind=='vf':
            b+=''.join(f'<p class="vf"><span>{inline(x)}</span><span class="vfb">V&nbsp;&nbsp;F</span></p>' for x in items)
        elif kind=='write':
            b+='<div class="line"></div>'*5
        elif kind=='think':
            b+='<div class="line"></div><div class="line"></div>'
        elif kind=='draw':
            b+='<div class="drawbox"></div>'
        out.append(b+'</div>')
    return ''.join(out)
pages_html=[]; pn=0
for f in src:
    txt=open(f,encoding='utf-8').read()
    title=re.search(r'^# (.+)$',txt,re.M).group(1)
    num,name=[s.strip() for s in title.split('·',1)]
    acts=''
    if '<!-- actividades -->' in txt:
        txt,acts=txt.split('<!-- actividades -->',1)
    parts=re.split(r'^<!-- (páx\. \d+[^>]*) -->$',txt,flags=re.M)
    for i in range(1,len(parts),2):
        tag=parts[i]; body=parts[i+1].splitlines()
        body=[b for b in body if not b.startswith('# ')]
        img=re.search(r'(img/[\w\-]+\.(?:jpg|png))',tag)
        pn+=1
        if 'título' in tag:
            pages_html.append(f'<section class="page cover"><figure><img src="{img.group(1)}" alt=""></figure><div class="ctitle"><span class="cnum">{html.escape(num)}</span><h2>{html.escape(name)}</h2></div><span class="pn">{pn}</span></section>')
        elif 'documento' in tag:
            pages_html.append(f'<section class="page docp"><div class="paper">{blocks(body)}</div><span class="pn">{pn}</span></section>')
        elif 'debuxa' in tag:
            cap=tag.split('|',1)[1].strip()
            pages_html.append(f'<section class="page draw"><p class="dlab">Debuxa ti esta escena</p><div class="dbox"></div><p class="cap">{inline(cap)}</p><span class="pn">{pn}</span></section>')
        elif 'toda páxina' in tag:
            cap=tag.split('|',1)[1].strip() if '|' in tag else ''
            pages_html.append(f'<section class="page full"><img src="{img.group(1)}" alt="{html.escape(cap)}">'+(f'<p class="cap">{inline(cap)}</p>' if cap else '')+f'<span class="pn">{pn}</span></section>')
        elif img:
            pages_html.append(f'<section class="page mixed"><figure><img src="{img.group(1)}" alt=""></figure><div class="text">{blocks(body)}</div><span class="pn">{pn}</span></section>')
        else:
            pages_html.append(f'<section class="page"><div class="text">{blocks(body)}</div><span class="pn">{pn}</span></section>')
    if acts:
        pages_html.append(f'<section class="page acts"><div class="text"><div class="acthead"><span class="cnum">{html.escape(num)}</span><h2>Actividades</h2><p class="nome">Nome: <span></span></p></div>{actblocks(acts)}</div><span class="pn"></span></section>')
tpl=open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'libro','maqueta.html'),encoding='utf-8').read()
open(out,'w',encoding='utf-8').write(tpl.replace('%%PAGES%%','\n'.join(pages_html)))
