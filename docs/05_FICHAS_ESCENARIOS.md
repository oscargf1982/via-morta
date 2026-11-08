# «Vía morta» · Fichas de escenarios

> Cada escenario se describe aquí antes de programarlo en `js/acto*.js`. Coordenadas en el lienzo lógico de 960×540.
> Los fondos de A1, A2, A3 y el mapa son **bocetos provisionales** generados con `tools/fondos.py`. Se sustituyen cuando Oscar envíe fotos o Street View.

## A1 · Andén 1 (`anden`)
- **Fondo:** `img/bg-anden.png`. Vista desde el andén hacia las vías: marquesina verde con lambrequín arriba, dos columnas de hierro, vía 1 con el regional, playa de vías, cocheras de ladrillo del depósito a la derecha y la torre del castillo de San Vicente al fondo. A la izquierda, la pared de la estación con la puerta del vestíbulo.
- **Suelo:** el andén (y 412–535). Obstáculos: banco, bases de las columnas y papelera. Capas delanteras: columnas, banco y papelera (Martín pasa por detrás).
- **Salidas:** Vestíbulo (A2).
- **Hotspots:** Vestíbulo (clave), tren regional (solo en la intro), reloj, letrero «MONFORTE DE LEMOS», torre del castillo, cocheras del depósito, vías, banco, papelera, línea amarilla, columnas.
- **NPC:** ninguno.
- **Objetos:** ninguno.
- **Guion:** intro del Acto 1. Martín baja del regional, el tren se va (bocina, no el silbato de vapor, que se reserva para el leitmotiv) y aparece un aviso con los controles.
- **Desbloquea:** nada; es la entrada.

## A2 · Vestíbulo de la estación (`vestibulo`)
- **Fondo:** `img/bg-vestibulo.png`. Pared clara con viga de madera, pilares de piedra, **el mural de 1954 (foto real `mural-estacion.jpg` pixelada dentro del fondo)**, taquillas a la izquierda, puertas a la plaza a la derecha, panel de salidas, máquina de café, extintor y carteles. Suelo de terrazo a cuadros.
- **Suelo:** y 346–535. Obstáculo y capa delantera: el banco central.
- **Salidas:** Andén 1 (A1), Praza da Estación (A3).
- **Hotspots:** mural de 1954 (clave; acción = verlo de cerca a pantalla completa), **firma del mural** (solo con el ollo: «Inchaurbe, 1954»), taquillas, panel de salidas, máquina de café, extintor, carteles, banco.
- **NPC:** **Iván Nogal** (sprite provisional `ivan-sprite.png`). Árbol de diálogo:
  - el mural (hechos reales de `04_HECHOS`: Inchaurbe, 1954, delineante de Renfe en León, sin la Ourense–Zamora, peregrino, autocar en Curtis, TAF, emigrante en Vigo, restaurado por Adif a petición de Apatrigal);
  - la Casa Juana → pista sembrada «Bo balcón. Dende el vese o depósito» y le manda a Concha;
  - tras el mural: qué hace él (dato inventado de las 42 baldosas);
  - despedida con la pista del «vento».
  - También reacciona a los objetos (ositos, periódico, llaves).
- **Desbloquea:** marca `sabeCasa` (cambia frases de Martín en la plaza).

## A3 · Praza da Estación (`praza`)
- **Fondo:** `img/bg-praza.png`. Fachada de la estación con reloj y rótulo, la calle Doutor Casares hacia la derecha con la casa roja y la gasolinera al fondo, árboles, farola, plano de Monforte y el **quiosco verde de Dona Concha**.
- **Suelo:** y 350–535. Obstáculos: el quiosco, la farola y el poste del plano. Capas delanteras: mostrador, pilares, tejado e interior del quiosco (Concha se ve en la ventana; quien pasa por detrás queda tapado).
- **Salidas:** Estación (A2), Mapa de Monforte (pantalla de mapa), Rúa Doutor Casares (A4, todavía no construida).
- **Hotspots:** estación, reloj, fachada, plano (→ mapa), Rúa Doutor Casares, casa roja, gasolinera, revistas, árbol, farola.
- **NPC:** **Dona Concha** dentro del quiosco (lee el periódico mientras no habla). Árbol de diálogo: llaves de la casa, bolsa de ositos, periódico, «qué se cuenta» (el tren fantasma), la Casa Juana (Alfredo, Juana, el serrón), despedida. Si Martín pierde las llaves, Concha tiene otra copia (sin callejones sin salida).
- **Objetos:** `chavesCasa`, `ositos`, `xornal`.
- **Desbloquea:** con las llaves, la calle Doutor Casares lleva al **fin del tramo M1** (aviso y vuelta a la plaza). Marca `objetivoContrato`: firmar con Amparo en la Fraternal.

## Mapa de Monforte (`mapa`)
- **Fondo:** `img/bg-mapa.png`, mapa ilustrado en papel (no a escala, y así lo dice): río Cabe, Ponte Vella, monte de San Vicente, calles en esquema, vías que convergen en la estación y la rotonda del depósito.
- **Zonas:** Barrio da Estación (abierta → A3), Centro · rúa do Cardeal (M2), Río Cabe · Malecón (M3), Castelo de San Vicente (M3), Vilatán fuera del mapa (M6). Las zonas cerradas dan una frase de Martín y un aviso del hito en el que llegan.
- **Pendiente:** Oscar debe validar la posición de las zonas con el mapa real.
