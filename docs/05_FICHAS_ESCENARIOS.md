# «Vía morta» · Fichas de escenarios

> Cada escenario se describe aquí antes de programarlo en `js/acto*.js`. Coordenadas en el lienzo lógico de 960×540.
> Los fondos de A1, A2, A3 y A3b son ilustraciones de Oscar. El mapa sigue siendo un **boceto provisional** generado con `tools/fondos.py`.

## A1 · Andén 1 (`anden`)
- **Fondo:** `img/bg-anden-estacion.jpg`, ilustración de Oscar. Marquesina con columnas de pie azul, la fachada con puertas azules en arco, el letrero «Monforte de Lemos», bancos, papelera y el regional parado en la vía 1.
- **Suelo:** el andén, desde la fachada hasta la línea amarilla. Perspectiva fuerte (Martín se hace pequeño al fondo). Obstáculos y capas delanteras: las tres primeras columnas y la papelera.
- **Salidas:** Vestíbulo (A2), por la puerta azul junto al banco.
- **Hotspots:** vestíbulo (clave), otras puertas azules (al mirarlas, Martín recuerda que antes había cafetería y quiosco de revistas en la estación y que ahora todo está cerrado), tren regional, letrero, dos bancos, papelera, columnas, marquesina, farol, vías, línea amarilla y andén de enfrente.
- **Guion:** intro del Acto 1. Martín baja del regional, suena la bocina (el silbato de vapor queda reservado al leitmotiv) y sale el aviso de controles. El tren está pintado en el fondo y se queda parado.

## A2 · Vestíbulo de la estación (`vestibulo`)
- **Fondo:** `img/bg-vestibulo-estacion.jpg`, ilustración de Oscar (3:2, recortada a 16:9). Taquilla «Venta de billetes», máquina de billetes, extintor, mural al fondo, pilar de piedra, bancos metálicos, papelera, radiadores, ventana y puerta azul a la plaza.
- **Suelo:** el terrazo. Obstáculo y capa delantera: el pilar (Martín pasa por detrás).
- **Salidas:** puerta azul de la derecha → Praza da Estación (A3). Andén 1 por la izquierda, junto al radiador, con la puerta «hacia la cámara».
- **Hotspots:** mural de 1954 (clave; al tocarlo se abre el primer plano de Oscar, `img/mural-primer-plano.jpg`), firma del mural (solo con el ollo), taquilla, máquina de billetes, extintor, tres avisos, bancos, papelera, dos radiadores, pilar, ventana, bandas táctiles amarillas y techo.
- **NPC:** **Iván Nogal**, entre la máquina de billetes y el pilar, junto al mural (sprite provisional). El árbol de diálogo no cambia: el mural con hechos reales, la Casa Juana con la pista del balcón, las 42 baldosas y la despedida con el «vento».
- **Desbloquea:** la marca `sabeCasa`.

## A3 · Praza da Estación (`praza`)
- **Fondo:** `img/bg-praza-estacion.jpg`, ilustración de Oscar, recortada (`crop [300,120,1300,731]`) para dejar fuera el quiosco, que en la realidad está en la segunda pantalla. Hotel, hostal Riosol, la rotonda con su fuente, el árbol, la farola de dos brazos y la fachada de la estación con el rótulo de Adif.
- **Suelo:** el empedrado. Obstáculos: la rotonda de la fuente, el alcorque del árbol y la base de la farola. Capas delanteras: farola y tronco del árbol.
- **Salidas:** Estación (A2) por la puerta azul; segunda pantalla de la plaza (A3b) por la calle de la izquierda; la calle del centro lleva al mapa de Monforte.
- **Hotspots:** estación (dos puertas), placa, rótulo, otra parte de la plaza (clave), calle hacia el centro (→ mapa), fuente de la rotonda, hotel, hostal, coches, farola y árbol.

## A3b · Praza da Estación, segunda pantalla (`praza2`)
- **Fondo:** `img/bg-praza-estacion-2.jpg`, ilustración de Oscar, recortada a 16:9 sin la barra de interfaz. Quiosco negro de Dona Concha, fuente rectangular con chorros, jardinera con la señal de prohibido aparcar, casa amarilla, edificio verde de la esquina y las calles del fondo.
- **Suelo:** acera del quiosco, calzada y acera de baldosas. Obstáculos: la fuente y la jardinera. Capas delanteras: la jardinera y la señal (Martín pasa por detrás).
- **Salidas:**
  - Izquierda: primera pantalla de la plaza (A3).
  - Arriba a la izquierda: rúa Calvo Sotelo. En el Acto 1 no se entra: no hay nada relevante y Martín lo dice.
  - Arriba al centro: rúa Coruña, la del colegio ferroviario. Cerrada hasta un hito próximo.
  - Arriba a la derecha: rúa Concepción Arenal, donde está la Fraternal. Sin las llaves, Martín recuerda que antes hay que pasar por Concha; con el objetivo del contrato, lleva al **fin del tramo M1**.
  - Derecha: rúa das Vacas. Martín no quiere mancharse los zapatos.
- **Hotspots:** quiosco (clave), revistas, fuente (Martín comenta que tiene las proporciones justas para una fuente), jardinera, señal, árbol, farol, edificio de la esquina, casa amarilla y edificios de la izquierda.
- **NPC:** **Dona Concha**, de pie al lado del quiosco, leyendo el periódico mientras no habla. Árbol de diálogo: llaves de la casa, bolsa de ositos, periódico, «qué se cuenta» (el tren fantasma), la Casa Juana (Alfredo, Juana, el serrón), despedida. Si Martín pierde las llaves, Concha tiene otra copia (sin callejones sin salida).
- **Objetos:** `chavesCasa`, `ositos`, `xornal`.
- **Desbloquea:** marca `objetivoContrato` (firmar con Amparo en la Fraternal), que abre el fin del tramo por Concepción Arenal.

## Mapa de Monforte (`mapa`)
- **Fondo:** `img/bg-mapa.png`, mapa ilustrado en papel (no a escala, y así lo dice): río Cabe, Ponte Vella, monte de San Vicente, calles en esquema, vías que convergen en la estación y la rotonda del depósito.
- **Zonas:** Barrio da Estación (abierta → A3), Centro · rúa do Cardeal (M2), Río Cabe · Malecón (M3), Castelo de San Vicente (M3), Vilatán fuera del mapa (M6). Las zonas cerradas dan una frase de Martín y un aviso del hito en el que llegan.
- **Pendiente:** Oscar debe validar la posición de las zonas con el mapa real.
