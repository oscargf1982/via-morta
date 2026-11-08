# «Vía morta» · O libro

Libro infantil en galego para 3.º de primaria (8-9 anos), baseado na historia do xogo.

- 15 capítulos, de 8 a 10 páxinas A5 cada un (ilustracións incluídas), máis unha ficha de actividades de 2 páxinas.
- Texto: `capitulo-NN.md`. Marcadores de páxina: `<!-- páx. N -->`, `<!-- páx. N: ilustración a toda páxina: img/x.jpg | pé -->`, `<!-- páx. N: ilustración arriba (img/x.jpg) ... -->`, `<!-- páx. N: debuxa | escena -->`, `<!-- páx. N: documento -->`, e `<!-- actividades -->` para a ficha.
- Maqueta: `maqueta.html`. O texto que non cabe pasa só á páxina seguinte.

Montar:

```
python3 tools/libro-imaxes.py build/img
python3 tools/libro.py libro/capitulo-*.md build/index.html
```

Como no xogo, as persoas reais só levan os feitos de `04_HECHOS_REALES_Y_FICCION.md`; a nota final do libro explica que é ficción e que datos son reais.
