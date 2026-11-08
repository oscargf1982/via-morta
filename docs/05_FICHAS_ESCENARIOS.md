# «Vía morta» · Fichas de escenarios

> Cada escenario se describe aquí antes de programarlo en `js/acto*.js`. Coordenadas en el lienzo lógico de 960×540.
> Los fondos de A1, A2, A3, A3b, A4b, B3 y la portada son ilustraciones de Oscar. El mapa sigue siendo un **boceto provisional** generado con `tools/fondos.py`.

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
- **NPC:** **Xoán Carballeira** (antes Iván Nogal), entre la máquina de billetes y el pilar, junto al mural, en vista de tres cuartos mirando hacia Martín. El árbol de diálogo no cambia: el mural con hechos reales, la Casa Juana con la pista del balcón, las 42 baldosas y la despedida con el «vento».
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
  - Arriba a la derecha: rúa Concepción Arenal, donde está la Fraternal. Lleva a A4b.
  - Derecha: rúa das Vacas. Martín no quiere mancharse los zapatos.
- **Hotspots:** quiosco (clave), revistas, fuente (Martín comenta que tiene las proporciones justas para una fuente), jardinera, señal, árbol, farol, edificio de la esquina, casa amarilla y edificios de la izquierda.
- **NPC:** **Dona Concha**, de pie al lado del quiosco, leyendo el periódico mientras no habla. Árbol de diálogo: llaves de la casa, bolsa de ositos, periódico, «qué se cuenta» (el tren fantasma), la Casa Juana (Alfredo, Juana, el serrón), despedida. Si Martín pierde las llaves, Concha tiene otra copia (sin callejones sin salida).
- **Objetos:** `chavesCasa`, `ositos`, `xornal`.
- **Desbloquea:** marca `objetivoContrato` (firmar con Rosario en la Fraternal).

## A4b · Rúa Concepción Arenal (`arenal`)
- **Fondo:** `img/bg-concepcion-arenal.jpg`, ilustración de Oscar recortada a 16:9. La Fraternal con su toldo verde, el soportal del «CINE» con la terraza, la pizarra, el coche rojo y la calle que se aleja hacia la izquierda.
- **Suelo:** la acera, el soportal y la calzada. Obstáculos: el coche, las mesas de la terraza y la pizarra. Capas delanteras: las tres.
- **Salidas:**
  - Abajo a la izquierda: vuelta a la segunda pantalla de la plaza (A3b).
  - Calle recta hacia el fondo: rúa Morín, la de la gasolinera. Cerrada hasta un hito próximo; Martín dice que hoy no necesita gasolina porque ha venido en tren.
  - Puerta de la Fraternal (B3). Sin el objetivo del contrato, Martín dice que primero necesita las llaves. Con el objetivo pero sin haber preguntado a David, Martín prefiere preguntarle antes de entrar. Después de preguntar, se entra.
- **Hotspots:** puerta de la Fraternal (clave), ventanas del bar, toldo, rótulo del cine, pizarra, terraza, coche rojo, balcones y edificios.
- **NPC:** **tío David**, en la puerta de la Fraternal con los brazos cruzados (sprite de la hoja de Oscar). Árbol de diálogo:
  - saludo («O de Vilatán!»);
  - «¿Has visto a Rosario?» (solo con el objetivo del contrato): está dentro, en la mesa del fondo, y no hay que interrumpir la mano. Marca `davidRosario`;
  - el fútbol: el gol al Ourense en Tercera, «un domingo de sol», la corrección de Xoán («un miércoles, y llovía») y la apuesta de cinco euros;
  - la Champions: martes y miércoles a las 20:00, y Martín a dormir a las 23:00;
  - despedida.

## B3 · A Fraternal, interior (`fraternal`)
- **Fondo:** `img/bg-fraternal.jpg`, ilustración de Oscar. Barra con lista de precios, cafetera y botellas; mesas de brisca con tapete verde, columnas, cuadros, tele con el fútbol y tragaperras.
- **Suelo:** el terrazo. Obstáculos: la barra, la columna y los grupos de mesas. Capas delanteras: la mesa de delante (con La Voz y la baraja), la columna y las mesas laterales.
- **Salidas:** puertas de cristal del fondo → rúa Concepción Arenal (A4b).
- **Hotspots:** Rosario Higueras (clave, en la mesa del fondo a la derecha), lista de precios, cafetera, botellas, barra, taburetes, tele, tragaperras, periódico y baraja, aviso de la columna, cuadros, pizarra y planta.
- **NPC:** **Rosario Higueras**, jugando a la brisca. Su sprite está pendiente de la hoja de Oscar; de momento habla desde la mesa. Abre con «Copas! E arrastro!» y no suelta las cartas a mitad de mano.
- **Fin del tramo M1:** después de la primera conversación con Rosario. La firma del contrato (puzzle por decidir con Oscar) y la historia de la casa llegan en M2.

## Portada
- **Fondo del menú:** `img/portada-rotonda.jpg`, ilustración de Oscar de la rotonda del museo del ferrocarril de Monforte, con un velo oscuro para que se lea el menú.

## Mapa de Monforte (`mapa`)
- **Fondo:** `img/bg-mapa.png`, mapa ilustrado en papel (no a escala, y así lo dice): río Cabe, Ponte Vella, monte de San Vicente, calles en esquema, vías que convergen en la estación y la rotonda del depósito.
- **Zonas:** Barrio da Estación (abierta → A3), Centro · rúa do Cardeal (M2), Río Cabe · Malecón (M3), Castelo de San Vicente (M3), Vilatán fuera del mapa (M6). Las zonas cerradas dan una frase de Martín y un aviso del hito en el que llegan.
- **Pendiente:** Oscar debe validar la posición de las zonas con el mapa real.
