# «Vía morta» · Fichas de escenarios

> Cada escenario se describe aquí antes de programarlo en `js/acto*.js`. Coordenadas en el lienzo lógico de 960×540.
> Los fondos de A1, A2, A3, A3b, A4, A4b, A4c, B3 y la portada son ilustraciones de Oscar. El mapa de viaje rápido es la ilustración de Oscar «Escolle o teu destino» (`img/bg-mapa.jpg`); ver la ficha «Mapa de Monforte (viaje rápido)» al final.

## C0 · Cinemática de inicio «Dous longos e un curto» (`js/cinematica.js`)
- **Cuándo:** al pulsar «Nova partida», antes del andén del Acto 1. Se puede volver a ver en Opcións → «Ver a cinemática de inicio». Dura unos 60 s. Un toque (o Esc/Enter/espacio) enseña «Saltar ▸»; el segundo salta.
- **Guion:** `docs/06_CINEMATICA_INICIO_GUION.md` (propuesta A, elegida por Oscar el 14-11-2026, estética cartoon). Martín no aparece. Todo es **ficción del juego** (la noche del 14 de enero de 1958); al principio sale el rótulo «Unha ficción inspirada en lugares reais de Monforte».
- **Cómo está hecha:** todo se dibuja por código en un lienzo propio de 960×540 (no es vídeo). Cada plano es una función del tiempo; `CINE.frame(t)` dibuja el fotograma del segundo `t` para hacer capturas de prueba. Sonido sintetizado.
- **Planos:**
  1. Negro, lluvia y la fecha a máquina: «Monforte de Lemos · 14 de xaneiro de 1958 · 21:38».
  2. **Andén 1 en 1958**, paneo lento. Fondo: `img/cine-anden-1958.jpg`, ilustración de Oscar (andén de noche, letrero, viajeros de espaldas con maletas, tren verde de viajeros con pilotos rojos, San Vicente iluminado al fondo). Por código se le añade movimiento: lámparas que tiemblan, pilotos que laten, humo de la chimenea, vapor bajo el vagón, lluvia solo fuera de la marquesina, reflejos del suelo mojado, niebla y el reloj corregido a las 21:38 con segundero.
  3. La luz que crece al fondo de la vía, zoom lento y temblor.
  4. Inserto: ruedas del mercancías «M.T. 20-C» (`img/cine-rodas.jpg`, ilustración de Oscar). Por código: radios girando, zapatas que laten al rojo, chispas, suelo en rayas de velocidad y temblor de cámara.
  5. Inserto: un brazo acciona la palanca del cambio de agujas, de noche y con lluvia (`img/cine-agulla.jpg`, ilustración de Oscar; vuelve a ser la aguja del guion, el plano del freno en la cabina se descartó porque no encajaba con la historia). Por código: lluvia, reflejos en los carriles, la caseta que tiembla, sacudida, rayos y salpicaduras en el golpe, y la luz del mercancías que crece por la izquierda.
  6. La Mikado de frente bajando sin control (`img/cine-mikado.jpg`, ilustración de Oscar). Por código: empieza en sombra, el faro parpadea y se enciende, rayos y halo que crecen hasta llenar la pantalla, humo, vapor a los lados, chorro del silbato (**dos largos y uno corto**), lluvia, temblor y acercamiento.
  7. Corte a negro, golpe sordo, lluvia.
  8. Máquina de escribir: «PARTE DE INCIDENCIA», «Causa do incidente: erro do maquinista.» y sello «ARQUIVADO» (el sello es un añadido al guion). Al caer el sello la cámara se acerca y se queda parada en él (pedido por Oscar).
  9. «68 anos despois».
  10. La Mikado en la rotonda del museo, de noche (`img/portada-rotonda.jpg` pasada a noche): la cámara la recorre de cerca, de las ruedas a la cabina, con niebla.
  11. **La Casa Roja**, vacía y a oscuras (`img/bg-doutor-casares.jpg` pasada a noche), con acercamiento al portalón del taller: se enciende una luz dentro (raya por debajo del portalón, entre las dos hojas y en el montante), pasa la sombra de alguien y se apaga. Sustituye a la gota de grasa, que Oscar pidió quitar el 14-11-2026.
  12. Vista nocturna del balcón (`img/noite-vista.jpg`, la misma que en el juego): la cámara deja atrás la gasolinera y se acerca despacio hasta la Mikado, a lo lejos delante del museo. El silbato otra vez, lejano y con eco; mientras suena, un resplandor tibio en la cabina, que luego se apaga.
  13. Título «VÍA MORTA» saliendo del vapor, con una vía que acaba en un tope, y el cierre: «68 anos de silencio. / Dous longos e un curto. / Alguén segue a chamar.» (mezcla elegida por Oscar el 14-11-2026).
  - Duración: unos 77 s. Cada plano dura un 15 % más que en la primera versión (pedido por Oscar el 14-11-2026); el factor es `K` en `js/cinematica.js`.
  - Enlace: rótulo «Luns, 7:52» mientras aparece el andén de día (**hora por confirmar con Oscar**).
- **Motor:** `engine.js` solo sabe que un acto puede tener `cine` (se reproduce en «Nova partida» antes de entrar en la escena). El contenido vive en `js/cinematica.js`.

## C1 · Cinemática del final del Acto 1 «O asubío ten enderezo» (`js/cinematica1fin.js`)
- **Cuándo:** la noche del lunes, al entrar al dormitorio con el alta del agua hecha (`noiteActo1()` en `js/acto1.js`). Unos 66 s, 9 planos. Un toque (o Esc/Enter/espacio) enseña «Saltar ▸»; el segundo salta. Al saltarla no se pierde nada: las marcas se ponen igual.
- **Guion:** `docs/08_CINEMATICA_FIN_ACTO1_GUION.md` (propuesta D, mezcla de A y B pedida por Oscar el 16-11-2026: más misterio y Martín en el balcón).
- **Cómo está hecha:** `CINEF1`, sobre el reproductor de `js/cinematica.js` (`CINE.play({ film })`), igual que la del Acto 2. `CINEF1.frame(t)` dibuja el fotograma del segundo `t` para las capturas. Los subtítulos son ahora una herramienta común (`CINE.kit.subtitles`), que también usa `js/cinematica2.js`.
- **Planos:** 1) «Luns, 23:47» a máquina; 2) la Mikado en la rotonda de noche, el silbato y nadie; 3) el silbato cruza la praza da Estación (quiosco con la persiana bajada), Concepción Arenal (Fraternal a oscuras) y Doutor Casares, con las farolas temblando; 4) el dormitorio: tiembla el cristal, Martín abre los ojos y enciende la lámpara; 5) el salón a oscuras, la silueta cruza y abre el balcón; 6) Martín de espaldas en el balcón, zoom lento a la Mikado, segundo silbato y las farolas apagándose una a una; 7) la Casa Roja desde la calle con una sola ventana encendida: «No pasa por delante de mi casa. / Llama a mi casa.»; 8) un hilo de vapor en la chimenea de la Mikado; 9) rótulo «FIN DO ACTO 1 · O REGRESO», «O asubío ten enderezo: a Casa Juana.», «Mañá, primeira quenda no depósito.»
- **Fondos:** ilustraciones de Oscar pasadas a noche por código (cada calle se prepara dos veces, con farolas y sin ellas, para poder hacerlas temblar). **Provisionales:** Martín en la cama (bulto bajo la colcha dibujado por código) y Martín de espaldas en el balcón (silueta del sprite).
- **Continuidad:** no se ve quién silba ni el interior de las cocheras; el candado nuevo es del martes (C2). El vapor de la Mikado es un indicio, no una respuesta.

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
- **Salidas:** Estación (A2) por la puerta azul; segunda pantalla de la plaza (A3b) por la calle de la izquierda; la calle del fondo sube al exterior de las cocheras del Museo del Ferrocarril (A7); el borde de abajo lleva al mapa de Monforte.
- **Hotspots:** estación (dos puertas), placa, rótulo, otra parte de la plaza (clave), Museo do Ferrocarril (calle del fondo → A7), mapa de Monforte (borde de abajo), fuente de la rotonda, hotel, hostal, coches, farola y árbol.

## A3b · Praza da Estación, segunda pantalla (`praza2`)
- **Fondo:** `img/bg-praza-estacion-2.jpg`, ilustración de Oscar, recortada a 16:9 sin la barra de interfaz. Quiosco negro de Dona Concha, fuente rectangular con chorros, jardinera con la señal de prohibido aparcar, casa amarilla, edificio verde de la esquina y las calles del fondo.
- **Suelo:** acera del quiosco, calzada y acera de baldosas. Obstáculos: la fuente y la jardinera. Capas delanteras: la jardinera y la señal (Martín pasa por detrás).
- **Salidas:**
  - Izquierda: primera pantalla de la plaza (A3).
  - Arriba a la izquierda: rúa Calvo Sotelo. En el Acto 1 no se entra: no hay nada relevante y Martín lo dice.
  - Arriba al centro: rúa da Coruña (A4d), la del colegio. Segundo camino a Doutor Casares (abierta por Oscar).
  - Arriba a la derecha: rúa Concepción Arenal, donde está la Fraternal. Lleva a A4b.
  - Derecha: rúa das Vacas. Martín no quiere mancharse los zapatos.
- **Hotspots:** quiosco (clave), revistas, fuente (Martín comenta que tiene las proporciones justas para una fuente), jardinera, señal, árbol, farol, edificio de la esquina, casa amarilla y edificios de la izquierda.
- **NPC:** **Dona Concha**, de pie al lado del quiosco, leyendo el periódico mientras no habla. Árbol de diálogo: llaves de la casa, bolsa de ositos, periódico, «qué se cuenta» (el tren fantasma), la Casa Juana (Alfredo, Juana, el serrón), despedida. Si Martín pierde las llaves, Concha tiene otra copia (sin callejones sin salida).
- **Objetos:** `chavesCasa`, `ositos`, `xornal`, `boli` (tras resolver el crucigrama).
- **Desbloquea:** marca `objetivoContrato` (firmar con Rosario en la Fraternal).

## A4d · Rúa da Coruña (`coruna`)
- **Fondo:** `img/bg-rua-coruna.jpg`, ilustración de Oscar. Calle empedrada en curva: a la izquierda, el colegio «Escuela de E. Prácticas» (fachada azul y piedra, porche de madera sobre columnas, verja de forja); después, un muro amarillo con verja y la capilla de piedra con espadaña; al fondo, la gasolinera. A la derecha, edificios con balcones y farolas.
- **Para qué sirve:** segundo camino entre la plaza de la estación (A3b) y Doutor Casares, 211 (A4), además del de Concepción Arenal y Morín (pedido por Oscar). Abierta desde el principio, como la otra ruta.
- **Suelo:** la acera y la calzada empedrada, desde abajo hasta la curva del fondo.
- **Salidas:**
  - Abajo a la izquierda → plaza de la estación (A3b), junto a la entrada de la rúa da Coruña.
  - Al fondo, por la curva, hacia la gasolinera → Doutor Casares (A4). En Doutor Casares, la salida de vuelta está a la derecha, abajo.
- **Hotspots:** colegio (clave, comentario de Oscar: detrás tiene un pabellón polideportivo enorme, y en los recreos se jugaba al futbolín en el patio), verja del colegio, capilla, muro amarillo, gasolinera del fondo, árbol, farolas, edificios de la derecha.
- **Tono:** paseo de recuerdos; Martín vuelve a su barrio.
- **Personas reales:** ninguna.

## A4c · Rúa Morín (`morin`)
- **Fondo:** `img/bg-rua-morin.jpg`, ilustración de Oscar. La calle sube hacia el fondo. A la izquierda, casas bajas de teja con puertas de madera; a la derecha, la casa pistacho con galerías y balcones, y coches aparcados.
- **Suelo:** las dos aceras y la calzada. Obstáculos y capas delanteras: los coches y la farola.
- **Salidas:** arriba → Doutor Casares, 211 (A4). Abajo → vuelta a Concepción Arenal (A4b).
- **Zona de paso:** al pasar junto a la puerta de la casa pistacho, Martín dice que a través de la puerta ha visto una sombra negra moverse dentro. La primera vez marca `sombraVista`; las siguientes, una broma corta. Usa la mecánica general `zones` del motor. De momento no hay nada más.
- **Hotspots:** puerta de la casa pistacho (clave; mirar y tocar cambian tras ver la sombra), fachada pistacho, coches, farola, puertas de madera y casas bajas.

## A4 · Rúa Doutor Casares, 211 (`casares`)
- **Fondo:** `img/bg-doutor-casares.jpg`, ilustración de Oscar. La casa roja con balcón de hierro y tres puertas en arco, el muro rojo del patio a la derecha (detrás, la nave de la carpintería), una nave de chapa, un banco con jardinera, la farola y la calle que sigue hacia el supermercado.
- **Suelo:** la acera y la calzada. Obstáculos y capas delanteras: el banco y la farola.
- **Salidas:**
  - Abajo a la izquierda: rúa Morín (A4c), confirmado por Oscar.
  - Abajo a la derecha: rúa da Coruña (A4d), segundo camino a la plaza de la estación.
  - Calle hacia el fondo («Rúa cara ao centro», flecha arriba): con el contrato firmado lleva al mapa. Tras descubrir que no hay agua, Martín dice que va al Concello y el mapa se abre para ir a la zona Centro.
  - Puerta de la Casa Juana (la de la derecha). Sin llaves: Concha las tiene. Con llaves pero sin contrato: primero firmar con Rosario. Con las dos cosas: **fin del tramo** (el interior, la casa sin agua y el Concello llegan en M2).
- **Hotspots:** puerta de casa (clave), portalón con vado, puerta estrecha, balcón, fachada, muro rojo (clave: detrás está la nave), nave de chapa, banco, farola, supermercado (broma del agua), tapa de alcantarilla y edificios.

## A4b · Rúa Concepción Arenal (`arenal`)
- **Fondo:** `img/bg-concepcion-arenal.jpg`, ilustración de Oscar recortada a 16:9. La Fraternal con su toldo verde, el soportal del «CINE» con la terraza, la pizarra, el coche rojo y la calle que se aleja hacia la izquierda.
- **Suelo:** la acera, el soportal y la calzada. Obstáculos: el coche, las mesas de la terraza y la pizarra. Capas delanteras: las tres.
- **Salidas:**
  - Abajo a la izquierda: vuelta a la segunda pantalla de la plaza (A3b).
  - Calle recta hacia el fondo: rúa Morín, la de la gasolinera. Cerrada hasta un hito próximo; Martín dice que hoy no necesita gasolina porque ha venido en tren.
  - Puerta de la Fraternal (B3). Sin el objetivo del contrato, Martín dice que primero necesita las llaves. Con el objetivo pero sin haber preguntado a Demetrio, Martín prefiere preguntarle antes de entrar. Después de preguntar, se entra.
- **Hotspots:** puerta de la Fraternal (clave), ventanas del bar, toldo, rótulo del cine, pizarra, terraza, coche rojo, balcones y edificios.
- **NPC:** **tío Demetrio**, en la puerta de la Fraternal con los brazos cruzados (sprite de la hoja de Oscar). Árbol de diálogo:
  - saludo («O de Vilatán!»);
  - «¿Has visto a Rosario?» (solo con el objetivo del contrato): está dentro, en la primera mesa, y no hay que interrumpir la mano. Marca `davidRosario`;
  - «¿Me ayudas con el crucigrama?» (con el periódico y la pista leída; también dándole el periódico): PICHICHI, él fue el pichichi de la liga pirata de Monforte. Marca `sabePalabra`;
  - el fútbol: el gol al Ourense en Tercera, «un domingo de sol», la corrección de Xoán («un miércoles, y llovía») y la apuesta de cinco euros;
  - la Champions: martes y miércoles a las 20:00, y Martín a dormir a las 23:00;
  - despedida.

## A5 · Casa Juana, salón comedor (`casaSalon`)
- **Fondo:** `img/bg-casa-salon.jpg`, ilustración de Oscar. Salón comedor amueblado, de alquiler: sofá rinconera gris con cojines, mesitas, aparador de madera tallada con una planta, dos cuadros de paisaje, mesa de comedor con seis sillas y lámparas colgantes. A la izquierda una ventana; a la derecha, puertas balconeras que dan a la gasolinera, la iglesia de la estación y el colegio ferroviario.
- **Llegada:** desde la puerta de la Casa Juana (A4) con las llaves, con o sin contrato. La primera vez Martín abre, entra y comenta la casa, y en seguida dice lo que quiere: **una ducha** (pedido por Oscar, 16-11-2026: horas de tren desde Valencia, «huelo a jabalí»), a ver si hay agua caliente. Salta solo al entrar, sin pulsar nada. Pista: «Novo obxectivo: proba a billa da cociña (á dereita)» y el cuaderno: «Ducharme. A ver si hay agua caliente: el grifo de la cocina».
- **Sin ducha no hay nada más (pedido por Oscar, 16-11-2026).** Antes de probar el grifo, Martín no sale a la calle, no mira el balcón ni se acuesta: «primero la ducha». Después, mientras no haya agua, solo hace lo que lleva al agua (firmar el contrato y el Concello, y lo que piden por el camino: periódico, bolígrafo, reloj del café, silla, destornillador del cajón). Se niega a lo que no lleva al agua: el balcón, el patio y su muro, la rendija del taller y dormir. Mirar sigue funcionando siempre. Nunca hay callejón: la cocina queda siempre a mano y, con el grifo probado, la calle también. Con el alta del agua hay agua al momento (Oscar, 16-11-2026): al volver a casa Martín lo dice y va al grifo de la cocina a ducharse (`duchado`); con la ducha vuelve todo: balcón, patio y cama.
- **Suelo:** la tarima. Obstáculos: el sofá, las mesitas y la mesa con las sillas (Martín pasa por delante).
- **Salidas:**
  - Derecha → cocina (A5b).
  - Izquierda → dormitorio. Sin fondo propio todavía: antes del alta del agua, Martín dice que aún no es hora de dormir; con el alta, lanza la noche del fin del Acto 1.
  - Abajo → vuelta a la calle, Doutor Casares (A4). Así nunca hay callejón sin salida.
- **Vista del balcón (decidido por Oscar):** al usar o mirar las ventanas del balcón salta a pantalla completa `img/vista-salon.jpg`, ilustración de Oscar: la gasolinera, la capillita, el supermercado y, al fondo, el museo del ferrocarril con la Mikado. **Decidido por Oscar el 14-11-2026:** la Mikado se ve a lo lejos (el museo no está delante de la casa), pero es la protagonista: la cámara se acerca despacio hasta ella y se queda ahí, también en la noche del fin del Acto 1. Mecánica general: `cine(src, lines, zoom)` en `engine.js`, con `zoom = { x, y, z }`; aquí `ZOOM_MIKADO` en `acto1.js`.
- **La noche (fin del Acto 1):** ya duchado (`duchado`), Martín dice que anochece y que el dormitorio está a la izquierda (pista). En el sofá bromea: «mañana tengo la espalda de un señor de ochenta años». Al entrar al dormitorio: fundido a negro y la cinemática C1 «O asubío ten enderezo» (ver su ficha). Marca `noiteActo1` al empezar y `fimActo1` al acabar o saltarla. Después, **la mañana del martes es jugable** (cambio 2 de la 3.ª revisión Gilbert): Martín despierta en el salón («Martes, seis de la mañana… Y hoy, Xoán»), puede andar por la casa y, al salir por la puerta de abajo, empieza la cinemática C2 del Acto 2. Así no van dos cinemáticas seguidas.
- **Hotspots:** ventanas del balcón (la vista), ventana de la izquierda, sofá, cojines, mesitas, aparador, planta, cuadros, mesa y sillas, lámparas, interruptor, tarima.
- **Tono:** primera impresión de Martín en su casa. Todo parece en orden… salvo detalles que preparan la casa sin agua del M2 (no se resuelve aquí).
- **Personas reales:** ninguna.

## A5b · Casa Juana, cocina (`casaCocina`)
- **Fondo:** `img/bg-casa-cocina.jpg`, ilustración de Oscar. Cocina reformada: muebles crema, encimera de madera, azulejos hidráulicos, placa, horno, microondas, fregadero, lavavajillas, tabla de cortar, nevera e isla con frutero y taburete. Puerta balconera a la izquierda: se ven el supermercado de enfrente y, en lo alto del monte, la Torre del Homenaje de Monforte.
- **Llegada:** desde el salón (A5), salida derecha.
- **Suelo:** la tarima entre la isla y los muebles. Obstáculos: la isla y el taburete quedan fuera del suelo.
- **Salidas:** puerta de la pared derecha → salón (A5). Abajo, la puerta de atrás → patio (A5c): sin agua, Martín no sale al patio («el patio, después de la ducha»).
- **Hotspots:** grifo (clave: **no sale agua**. Martín viene a por agua caliente para la ducha; abre, nada, y bromea: «Ni que esto fuera la calle Corredoira» (calle real de Monforte con cortes de agua, broma de Oscar). Con el alta del agua (`aguaAlta`) el grifo ya da agua: Martín se ducha (fundido, marca `duchado`) y eso cierra la misión del agua. Dice que no piensa hacer nada más hasta ducharse y deduce que el agua se da de alta en el Concello, con el contrato firmado; marca `sinAgua`), balcón, Torre del Homenaje, supermercado, nevera, frutero, isla, taburete, placa, horno, microondas, tabla de cortar, lavavajillas, azulejos, armarios.
- **Personas reales:** ninguna. La Torre del Homenaje solo se nombra y se ve.

## A5c · Casa Juana, patio trasero (`casaPatio`)
- **Fondo:** `img/bg-casa-patio.jpg`, ilustración de Oscar. Patio de baldosa roja con césped, un sofá y dos butacas de exterior, una mesita de cristal, un arbolito, dos plantas en maceta, rejillas de desagüe, la bajante y un muro blanco con árboles detrás. A la izquierda, la puerta acristalada de la casa; a la derecha, la puerta verde del viejo taller.
- **Llegada:** desde la cocina (A5b), por la salida de abajo («la puerta de atrás»). Decisión provisional: es la estancia más lógica para una puerta trasera; si Oscar prefiere el dormitorio o el salón, se cambia.
- **Suelo:** baldosa y césped. Obstáculos: el sofá con la mesita, las butacas y las macetas, con capas delanteras para que Martín pase por detrás.
- **Salidas:**
  - Izquierda → puerta acristalada → cocina (A5b).
  - Derecha → puerta verde → viejo taller. **Decidido por Oscar:** en el Acto 1 sigue con candado; Martín mira por una rendija y sale a pantalla completa la foto real del taller vacío (`img/bg-taller.jpg`), y al verlo le llegan evocaciones de cómo era: la ilustración del taller lleno (`img/taller-1952.jpg`). Marca `tallerEspiado`; las siguientes veces, solo una frase. Se entra en el Acto 2 con la llave de Concha.
- **Muro blanco (clave):** Martín se asoma para cotillear y **vuelve a ver la sombra negra misteriosa**. Si ya la vio en la rúa Morín, la relaciona con la casa pistacho. Marca `sombraPatio`.
- **Hotspots:** muro blanco, puerta del taller, puerta de la casa, ventanas, sofá y butacas, mesita, arbolito, árboles de detrás, macetas, rejillas, bajante, césped.
- **Personas reales:** ninguna.

## B4a · Concello, exterior (`concelloExt`)
- **Fondo:** `img/bg-concello-exterior.jpg`, ilustración de Oscar recortada a 16:9. Edificio del Concello con banderas (Galicia, España, Unión Europea) en el balcón, escalinata y puerta principal, jardinera con arbustos y, en primer plano, un estanque con una roca en el centro.
- **Llegada (decidido por Oscar):** desde el mapa, destino «Praza do Concello», que se abre al tener el contrato firmado. Antes, la zona sigue cerrada con su comentario.
- **Suelo:** la franja de la plaza entre el edificio y el estanque. El estanque y la jardinera son obstáculos.
- **Salidas:**
  - Puerta principal (escalinata) → vestíbulo con las ventanillas de Eladio (B4). Si Martín aún no sabe que no hay agua, comenta que no tiene nada que hacer dentro.
  - Izquierda → mapa de Monforte.
  - Derecha → café de enfrente (B5), donde está Eladio.
- **Hotspots:** puerta principal, escalinata, banderas, balcón, edificio, ventanas en arco, jardinera, estanque, roca, árboles.
- **Personas reales:** ninguna. El Concello solo se ve por fuera; nada de información oficial.

## B4 · Concello, vestíbulo y ventanillas (`concelloVest`)
- **Fondo:** `img/bg-concello-vestibulo.jpg`, ilustración de Oscar. Vestíbulo con suelo de mármol, escalera con barandilla, escudo, farol, puerta en arco abierta al exterior, panel de servicios (Rexistro, Atención Cidadá, Servizos Sociais, Urbanismo, Salón de Plenos), mostrador «Atención ao público» con tres ventanillas, expositor de folletos, sillas azules y plantas.
- **Llegada:** por la puerta principal del exterior (B4a), con `sinAgua`. La puerta del fondo vuelve al exterior.
- **Suelo:** el mármol entre la escalera, las sillas y el mostrador. Macetas y expositor como obstáculos; la planta de primer plano tapa a Martín.
- **Ventanillas (Don Eladio, ficción):**
  - 1: cartel «Volvo nun momento». Eladio no está: se ha ido al café (B5). Marca `eladioAusente`.
  - 2: «Pechada».
  - 3: «Esta ventanilla agora é a 1» (la 1 «agora tamén é a 3»).
  - El puzzle para que Eladio vuelva está pendiente de que Oscar lo elija; de momento, aviso de próximo paso.
- **Hotspots:** ventanillas, panel de servicios, escudo, escalera, farol, expositor de folletos, sillas, plantas.
- **Personas reales:** ninguna. Nada de información oficial: los carteles son del juego.

## B5 · Café de Eladio (`cafeEladio`)
- **Fondo:** `img/bg-cafe-eladio.jpg`, ilustración de Oscar. Bar cerca del Concello: barra de azulejo blanco y negro con taburetes, pizarra de precios, botellero, cafetera, grifo de cerveza, reloj de pared, cartel «Boa Festa», cuadros, corcho con avisos, planta y puerta de cristal al fondo.
- **Llegada:** desde el exterior del Concello (B4a), salida derecha «Café de enfrente». La puerta del fondo vuelve al Concello.
- **Suelo:** el pasillo de baldosa entre la barra y la pared derecha. La barra y los taburetes son obstáculos.
- **NPC:** **Don Eladio** (ficción), sentado en el taburete del fondo con el periódico abierto por las esquelas. **Provisional:** dibujado por código hasta que llegue la hoja de personaje de Oscar.
- **Puzzle «el reloj de fichar» (elegido por Oscar):**
  1. Hablando con Eladio, Martín pregunta a qué hora vuelve: «Ás dúas en punto ficho a saída. Nin un minuto antes, nin un despois», y antes de fichar pasa por la ventanilla. Marca `eladioFicha` (pista).
  2. **El reloj está muy alto (pedido por Oscar; elegida la silla del Concello).** Sin nada para subirse, Martín no llega: está encima de la estantería de las botellas, y los taburetes del bar están atornillados al suelo. Martín piensa en las sillas de espera del Concello («a Eladio nadie lo espera sentado»; pista en pantalla). Marca `reloxoAlto`. En el vestíbulo (B4), las sillas azules también están atornilladas al suelo (pedido por Oscar): hace falta un destornillador, y «en todas las cocinas hay uno» (pista: cajones de la cocina de la Casa Juana; marca `cadeiraAparafusada`). En los cajones de la cocina (A5b) está el destornillador (objeto `desaparafusador`, se conserva). Tener el objeto no basta (pedido por Oscar): hay que **usar el destornillador con las sillas** para soltar la del final de la fila (objeto `cadeira`). Al devolverla, primero se deja en su sitio (marca `cadeiraPosta`) y después se **usa el destornillador con las sillas** para atornillarla (marca `cadeiraDevolta`); si está suelta, Eladio tampoco firma.
  3. Hay que **usar la silla con el reloj** (tocar el reloj con la silla en el inventario solo da la pista). Animación: la silla azul aparece en el suelo, Martín se sube (mecánica general `actorLift` de engine.js), adelanta el reloj diez minutos, baja y se la lleva de vuelta. Eladio ve «las dos», cree que no ha fichado y sale corriendo sin pagar (broma). Marca `eladioVolveu`.
  4. En el vestíbulo (B4), Eladio ya está en la ventanilla 1. Si Martín lleva la silla, Eladio no firma: «non asino nada con mobiliario fóra do seu sitio» (broma: diez minutos sin fichar no le importan, una silla sí). Martín la deja con las otras (marca `cadeiraDevolta`). Entonces: «Xa que estou aquí... pero rápido, que estou fóra de horario». Sella el alta con el contrato: agua «mañá pola mañá». Marca `aguaAlta`. Broma final: «o reloxo do café adianta dez minutos. Debería denunciarse. Pero hoxe xa fichei».
  5. Nuevo objetivo: volver a la Casa Juana y descansar (la noche del fin del Acto 1).
- **Hotspots:** pizarra de precios, botellas, cafetera, grifo de cerveza, reloj (pista de la hora para el puzzle), cartel «Boa Festa», cuadros, corcho, taburetes, barra, tacita de café, servilletero, planta, puerta.
- **Personas reales:** ninguna.

## B3 · A Fraternal, interior (`fraternal`)
- **Fondo:** `img/bg-fraternal.jpg`, ilustración de Oscar. Barra con lista de precios, cafetera y botellas; mesas de brisca con tapete verde, columnas, cuadros, tele con el fútbol y tragaperras.
- **Suelo:** el terrazo. Obstáculos: la barra, la columna y los grupos de mesas. Capas delanteras: la mesa de delante (con La Voz y la baraja), la columna y las mesas laterales.
- **Salidas:** puertas de cristal del fondo → rúa Concepción Arenal (A4b).
- **Hotspots:** Rosario Higueras (clave, sentada a la derecha de la primera mesa, la de las cartas), lista de precios, cafetera, botellas, barra, taburetes, tele, tragaperras, periódico y baraja, aviso de la columna, cuadros, pizarra y planta.
- **NPC:** **Rosario Higueras**, jugando a la brisca. Sentada en la silla del lado derecho de la mesa de las cartas (sprite con su propia silla, mirando a la mesa); al interrumpirla se cruza de brazos. Abre con «Copas! E arrastro!» y no suelta las cartas a mitad de mano.
- **Puzzle de la firma (elegido por Oscar):** Rosario gana la mano y pide bolígrafo; no tiene (pista: Concha tiene el de los crucigramas). Concha no lo presta hasta acabar el crucigrama: le falta el 7 horizontal, de fútbol. Martín consigue un periódico (comprándoselo a Concha o cogiéndolo de la mesa «Xornal e baralla» de la Fraternal), lee la pista «Oito letras: o máximo goleador dunha liga» y se la enseña al tío Demetrio (A4b), que responde PICHICHI: el máximo goleador, como él en la liga pirata de Monforte (22 goles, antes eran 18; Xoán dice que 12). Martín le dice PICHICHI a Concha (o le da el periódico) y ella le presta el bolígrafo. Con él, Rosario firma (objeto `contrato`), cuenta la historia de la casa (Alfredo, Juana, el motor Siemens, la venta de 1952; mientras habla de la carpintería sale a pantalla completa `img/taller-1952.jpg`, la ilustración de Oscar del taller lleno de máquinas antes de la venta; elegido por Oscar. El taller de hoy, vacío, queda pendiente de fondo) y deja la pregunta del ingeniero de Caminos. Después, objetivo: ir a la Casa Juana (A4).

## Acto 2 · «O reencontro» (versión intermedia, elegida por Oscar el 14-11-2026)
> Código en `js/acto2.js`. Sin Brais ni la Volta do Castelo. Los fondos marcados **provisional** se dibujan por código hasta que lleguen las ilustraciones de Oscar; Valerio y Andrés ya usan los sprites de las hojas de Oscar.

### C2 · Cinemática del primer turno (martes) · «Primeira quenda»
- **Cuándo:** justo después de «FIN DO ACTO 1» y al elegir «Acto 2» en Escoller acto. Se salta solo con el botón «Saltar cinemática» (Oscar, 16-11-2026; antes, con dos toques: «Saltar ▸»).
- **Qué es (16-11-2026):** cinemática animada por planos, del mismo tipo que la de inicio, en `js/cinematica2.js` (`CINE2`), sobre el reproductor de `js/cinematica.js`. Unos 69 segundos, 8 planos, con subtítulos. Guion y lista de dibujos en `07_CINEMATICA_ACTO2_GUION.md`. Sustituye a la versión sencilla de dos imágenes.
- **Fondos:** la rotonda (`img/portada-rotonda.jpg`, pasada a amanecer por código) y la fachada de las cocheras (`img/bg-cocheras.jpg`), con Martín y Xoán como sprites. **Provisionales:** el plano del suelo (carril engrasado y huellas), dibujado por código, y el primer plano del candado, que es una ampliación de la fachada.
- **Qué cuenta:** martes, 6:40; la Mikado al amanecer; la jornada pasa delante de las cocheras; carril recién engrasado y pisadas ante la puerta derecha; candado nuevo; Xoán lo despacha con «Cousas do museo»; fin de la jornada a las 15:10 y objetivo del acto (ver a los de siempre y averiguar quién silba de noche). **No dice de qué tipo es el candado**: eso se ve al mirarlo en A7.
- **Después:** Martín aparece en la praza da Estación (A3) y se queja de los gemelos (pista de la crema). Objetivo: hablar con Concha.

### A3b · Quiosco de Concha (cambios en el Acto 2)
- Nueva opción «¿Qué se cuenta hoy?»: Valerio preguntó por Martín (Farmacia de la Estación, calle Calvo Sotelo, detrás del quiosco) y Andrés dice que le debe la revancha de natación. Marcas `objValerio`, `objAndres`.
- Tras el segundo silbato: «¿Y la llave del taller?». Concha no quiere dulces: «a min págaseme en novidades» (marca `chaveNovidade`). Opción «Te traigo una noticia que no sabe nadie» → Martín elige: el silbato («contéicho eu»), la revancha con Andrés («contoumo antes de secarse»), el candado si aún no se lo dijo («iso vese dende a rúa: é unha paisaxe») o **el carbón del Fluvial** → **Chave do taller**. Si le da los ositos: «a esa chave non se lle paga en doce».

### Mapa (cambios en el Acto 2)
- **Rúa do Cardeal** (destino del mapa de viaje rápido): cerrada en el Acto 2; la farmacia está en Calvo Sotelo, a pie desde la plaza.
- **Club Fluvial** se abre con `objAndres` y lleva directo a C2.
- **Castelo de San Vicente** sigue cerrado («otro día; hoy mis gemelos no suben ni a una silla»).

### B0 · Rúa Calvo Sotelo, primer tramo: Panadería Estación (`panaderia`) · ilustración de Oscar (16-11-2026)
- **Cambio de Oscar (16-11-2026):** entre la plaza de la estación y la Farmacia de la Estación está la **Panadería Estación**. Para ir a la farmacia hay que pasar antes por ella. Panadería de ficción: no hay datos reales.
- **Llegada:** desde la plaza de la estación, 2.ª pantalla (A3b), por la salida del noroeste junto al quiosco de Concha («Rúa Calvo Sotelo»). En el Acto 1 sigue cerrada; desde el Acto 2, abierta siempre.
- **Fondo:** `img/bg-panaderia.jpg`, ilustración de Oscar: la calle en perspectiva hacia el fondo, a la izquierda un **bar** con toldo rojo y terraza y coches aparcados; en el centro **vallas amarillas de obra** junto al bordillo y plátanos podados; a la derecha el edificio de balcones de piedra calada, una puerta marrón con el cartel **«SE VENDE»**, un portal blanco y la **Panadería Estación** (toldo crema con espiga, escaparate con bandejas y puerta blanca de cristales).
- **Suelo:** la acera de la derecha, de la esquina de abajo hasta el fondo de la calle. Martín es pequeño al fondo (perspectiva larga).
- **Salidas (Oscar, 16-11-2026):** por el norte, el fondo de la calle → plaza de la estación (A3b), zona del quiosco de Concha (se llega a la panadería por ese fondo); por el sur, el borde de abajo → B1, calle de la farmacia. Ida y vuelta, sin callejones.
- **NPC:** **Genaro, o panadeiro** (ficción; hoja de personaje de Oscar: gorro y mandil con harina), en la puerta de la panadería. Habla en gallego, con retranca de quien se levanta a las cuatro: las obras («abriron a rúa para cambiar as tubaxes e atoparon outras tubaxes máis vellas debaixo»), el «Se vende» de al lado, el asubío que se oye a las cuatro desde el horno (sin explicar nada de la trama). Es muy aficionado a los videojuegos y platina todas las aventuras gráficas (Oscar, 16-11-2026): opción «¿Y tú qué haces cuando no estás amasando?» y broma de «obxecto conseguido» al vender los pasteles. **Cuarta pared** (idea de Oscar, 16-11-2026): la primera vez que habla de videojuegos, la calle se oscurece y Genaro aparece en primer plano, de frente, hablando al jugador («Ti. Si, ti. O do outro lado da pantalla»: platinar, mantener el dedo sobre las cosas, volver a la calle al acabar el juego); luego Martín pregunta con quién habla («Cos gatos»). Una segunda y última vez, si el jugador vuelve sin los pasteles que pide Valerio, le guiña la pista solo a él. Marcas `genaroCuarta`, `genaroCuarta2`. No bloquea nada. **Expresiones (16-11-2026):** con la hoja de expresiones de Oscar, cada frase de Genaro lleva su retrato (mecánica general `PORTRAIT_MOODS` en engine.js/data.js: el tercer argumento de `say` elige la imagen) y en la cuarta pared aparece en grande, con el guiño señalando al jugador en «Ti. Si, ti», riendo, explicando y escéptico; «Psst» con las manos en la boca. 24 imágenes webp de unos 15 KB cada una (380 KB en total), precargadas al entrar en la calle. Para hablar al jugador («Ti. Si, ti» y el consejo) se usa el dibujo grande de Oscar de Genaro apelando al frente (`assets/personajes/genaro-apelando-hd.png` → `img/genaro/apelando.webp`, 640×640, unos 50 KB).
- **Pasteles de crema (puzzle de Valerio, cambio de Oscar del 16-11-2026):** Genaro siembra la pista antes del problema: Valerio le lleva tres pasteles de crema cada tarde «para os clientes», y los clientes nunca los vieron. Cuando Valerio pide su «peaxe» (marca `valerioDoce`: «pasteis de crema da Panadería Estación: crema por crema»), Genaro vende **tres pasteles de crema** (objeto `pasteis`, tres euros, sin objeto de dinero, igual que los ositos de Concha). Antes de que Valerio los pida, Martín no los compra («si me compro pasteles sin motivo, me los como por el camino»). Si se pierden o se entregan, se pueden volver a comprar.
- **Hotspots:** puerta y escaparate de la panadería, toldo con el rótulo (sin tilde en «panadería» y con tilde en «estación»), puerta del «Se vende», portal blanco, balcones, caja del contador, vallas de obra, árboles podados, bar y terraza, coches, tapa de alcantarilla y rejilla, fondo de la calle.
- **Personas reales:** ninguna.

### B0b · Panadería Estación: el cambiazo
- **El cambiazo del serrín por el maíz (idea de Oscar, 16-11-2026):** al pie de la panadería hay dos **sacos de harina de maíz** para la broa (pintados por código). Si Martín los toca con Genaro delante: «Iso non se toca». Desde el Acto 4, cuando Martín ya ha visto el nido de palomas del taller (marca `pombaVista` o `tapaGolpe`, del hilo de las palomas), en la conversación con Genaro sale la opción de despistarlo: «¿eso que huele no es la broa quemándose?». Genaro entra corriendo (`genaroDentro`) y no vuelve hasta que Martín hace algo con los sacos o se va de la calle (tiempo de Hollywood). Sin serrín, Martín no se lleva nada: Genaro vería el hueco, así que necesita un saco que ocupe su sitio (pista al almacén de maderas). Con el serrín, cambia un saco por otro: objeto `millo` («Saco de millo», definido también en `js/pombas.js`), marca `milloTrocado`. Genaro vuelve («falsa alarma») y le guiña el ojo al jugador: «Eu non vin nada. Ti tampouco». Se puede repetir si Martín pierde el saco. Antes del Acto 4 la opción de despistar no sale: Martín no sabría para qué quiere el maíz.

### B1 · Rúa Calvo Sotelo: Farmacia de la Estación (`calvoSotelo`) · ilustración de Oscar
- **Cambio de Oscar (15-11-2026):** la farmacia de Valerio está en la calle **Calvo Sotelo** y se llama **«Farmacia de la Estación»**. Así queda todo cerca del barrio de la estación, la zona central del juego.
- **Llegada:** desde la plaza de la estación pasando por la Panadería Estación (B0): desde el 16-11-2026 la salida del noroeste de la plaza lleva primero a la panadería y por el borde de abajo (sur) de esa calle se llega aquí. En el Acto 1 sigue cerrada; en el Acto 2 se abre siempre.
- **Fondo (nuevo, 16-11-2026):** `img/bg-calvo-sotelo.jpg`, ilustración de Oscar en una sola pantalla: la calle en perspectiva hacia la izquierda con coches aparcados y árboles, la torre del castillo de San Vicente al fondo, el almacén **«Maderas Somel»** con su portalón verde abierto y tablones en el patio, la **Farmacia de la Estación** (rótulo «FARMACIA DE LA ESTACIÓN», cruz verde de neón que late por código, puerta verde y tres escaparates con botes, galerías blancas encima), una **máquina expendedora azul** junto a la farmacia y la casa naranja con balcón de forja y portal gris. Sustituye al dibujo anterior (`img/bg-cardeal.jpg`, que queda en el repositorio sin uso por si sirve para la rúa do Cardeal).
- **Por dónde se anda:** la acera y la calzada de delante. El tronco del árbol de la derecha y los dos macetones tapan a Martín cuando pasa por detrás.
- **Salidas:** puerta de la farmacia → B2 (al salir, Martín aparece delante de la puerta); borde de abajo a la derecha (la acera hacia el espectador) → Panadería Estación (B0) y de ahí a la plaza. La calle hacia el fondo no lleva a ningún sitio: Martín dice que lo que busca está en esta acera.
- **Máquina expendedora (idea de Oscar, 16-11-2026):** vende preservativos. Tocarla: Martín no lleva monedas sueltas y ve la tapa floja; si tiene la navaja lo dice, si no, recuerda los cajones de la cocina de casa (la navaja sale de ahí y no se gasta nunca). **Usar la navaja en la máquina** la fuerza y da el objeto `preservativo` (marca `preservativoColleito`). Si lo pierde o lo gasta, se puede volver a sacar: cero atascos. **Su uso lo define Oscar:** inflarlo y pincharlo con la navaja para asustar a las palomas del nido del taller (Acto 4), cadena que monta el hilo «Montar el puzzle de las palomas» en `js/pombas.js`, que también define el objeto.
- **Maderas Somel:** letrero y portalón solo para mirar. Junto al portalón hay **sacos de serrín** (pintados por código): Martín se lleva uno, «tal vez me resulte útil» (objeto `serrin`; se puede volver a coger). Si Somel tiene más papel en la historia, **pendiente de Oscar** (¿relación con la carpintería de Alfredo?).
- **Hotspots:** puerta de la farmacia, cruz verde, letrero, escaparates (dos), máquina expendedora, Maderas Somel, portalón verde, portal de la casa naranja, galerías, balcón, coches aparcados, árboles, torre del castillo, la calle.
- **Rúa do Cardeal en el mapa:** cerrada en el Acto 2 («lo que busco está en el barrio de la estación»). Pendiente de que Oscar decida qué hacer con ese destino.

### B2 · Farmacia de la Estación, interior (`farmacia`) · ilustración de Oscar
- **Fondo:** `img/bg-farmacia.jpg` (15-11-2026): estanterías de madera con arcos y el letrero «Ortopedia y deporte», un expositor central, mostrador del fondo con lámparas de bola, butaca y pantalla de turnos. Se anda por el pasillo de la derecha; la puerta a la calle queda abajo a la derecha (fuera de cuadro). Valerio espera delante del mostrador del fondo; Xoán, en el pasillo.
- **NPC:** **Valerio** (compañero de instituto de Martín), con la bata de su padre. **Xoán Carballeira** en el mostrador, recogiendo «o xarope de Eugenia, a nena da miña curmá». Martín ata cabos: Eugenia es la hija de Rosario, así que Xoán es primo de Rosario (marca `pistaCurma`).
- **Crema de agujetas (puzzle del dulce, pedido por Oscar el 15-11-2026; pago cambiado a pasteles el 16-11-2026):** Valerio ve andar a Martín y se ríe: «Entraches andando coma un home de oitenta anos». Tiene la crema, pero a un amigo no le vende ni le da nada sin su «peaxe»: algo dulce, porque es goloso desde el instituto. Ahora pide en concreto **pasteles de crema de la Panadería Estación** («crema por crema: troco xusto»). Marca `valerioDoce`. Martín se acuerda de lo que le contó Genaro. Al darle los pasteles (opción de diálogo o usando el objeto con él), Valerio se los come «un para min, outro para min…» y da la crema. Objeto `crema`, marca `valerioFeito`. Los ositos de Concha ya no resuelven nada: se siguen vendiendo y cada personaje tiene su broma si se los das (Valerio: «iso era no instituto»). Así ningún objeto resuelve dos puzzles.
- **Hotspots:** letrero «Ortopedia y deporte», estanterías (tres), expositor, mostrador, lámparas, butaca, pantalla de turnos.
- **Personas reales:** ninguna.

### C2 · Club Fluvial: piscina y chiringuito «Malo Será» (`fluvial`) · ilustración de Oscar
- **Fondo:** `img/bg-fluvial.jpg` (15-11-2026): chiringuito «Malo Será» de paja con pizarra (refrescos, cerveza, agua, zumos), mesas con sombrilla en el césped, la piscina al fondo tras la valla con salvavidas y el castillo de San Vicente en lo alto. **La carretilla azul y los sacos de carbón se pintan por código** (a la derecha, junto a la valla) porque no salen en el dibujo y hacen falta en el Acto 4. Cerrada desde septiembre... salvo para Andrés.
- **Llegada:** desde el mapa, destino «Club Fluvial», por la derecha. **Salida:** borde derecho → mapa.
- **NPC:** **Mega Andrés**, en su tumbona (dibujada con él, por código) sobre el césped. Filósofo: «a vida, mellor deitado».
- **Puzzle:** Andrés quiere la revancha de natación (cuatro largos). Sin `crema`, Martín se niega y apunta a la farmacia. Con ella, minijuego de toques alternos (izquierda/derecha, mecánica general `minixogoToques` en engine.js). Si gana Martín: tarde de tumbona. Si pierde dos veces, Andrés propone empate técnico a cambio de un mojito. Siempre se sale con `andresFeito`.
- **Andrés, nieto de Don Anxo (16-11-2026):** mirarlo dice su apellido (Corredoira). Opción del abuelo: vivo, 85 años, lo cuida, «todas as historias menos as dun inverno» (flag `andresInverno`). Opción del carbón: «quen ten unha caldeira de vapor?» → se pone a colocar tumbonas (`andresTumboas`). En el Acto 3 (`anxoNetoSabe`): «calar tamén é coidar» (`a3AndresAvo`); dar las pastillas a Andrés no vale («Valerio deuchas a ti»).
- **Siembra para el Acto 4:** el abuelo fogonero, los sacos de carbón «para o churrasco» y la carretilla de las tumbonas (hotspots mirables).
- **Hotspots:** piscina, salvavidas, letrero, pizarra, chiringuito, mesas, carretilla, sacos de carbón, farolas, castillo.

### B3 · A Fraternal de noche (`fraternalNoite`)
- **Fondo:** `img/bg-fraternal.jpg` oscurecida por código, con la tele apagada hasta que se arreglan las pilas del mando (luego, luz azulada) y el reloj. Se entra desde A4b cuando `valerioFeito` y `andresFeito` («Las ocho menos diez. Champions»).
- **NPC:** **tío Demetrio** (en la barra), **Xoán** y **Rosario** (en su mesa).
- **Escena:** Demetrio cuenta su gol al Ourense «un domingo de sol»; Xoán lo corrige: «Foi en mércores, Demetrio. E chovía». Martín nota la memoria de archivo de Xoán (sospecha suave). Preguntado por el candado nuevo, Xoán cambia de tema.
- **Puzzle de las pilas (pedido por Oscar el 15-11-2026; sin viaje a casa desde la 3.ª revisión Gilbert):** al llegar, la tele está apagada: al mando le faltan pilas y en el bar no quedan («as últimas puxéronse no reloxo da parede»). Martín explica que, frotándolas con las manos, siempre les queda energía para un par de clics. Marca `faltanPilas`. El **reloj de la pared** (pintado por código a la izquierda, entre la planta y los cuadros, parado a las nueve y cuarto; también se mira en el Acto 1) da el objeto `pilas` (marca `reloxoSenPilas`; broma de Rosario: «era a hora máis tranquila do mundo»). La salida «Saír · a por pilas» pregunta antes si quedarse a buscar; el cajón de la cocina de la Casa Juana sigue dando pilas como segundo camino. De vuelta, usar las pilas con la tele o dárselas a Demetrio enciende el partido (marca `teleAcesa`).
- **Salida:** con la tele encendida, a las 23:00 («ni prórroga ni penaltis») Martín vuelve a casa: marca `champions`.

### A5 · Segunda noche (dormitorio → patio)
- Con `champions`, el dormitorio lanza la noche: suena el silbato en el dormitorio a oscuras (`img/noite-dormitorio.jpg`, la ilustración de Oscar pasada a noche con `tools/noite.py`; luego `noite-dormitorio-lampada.jpg` con la lámpara de la mesilla encendida), Martín baja al patio a oscuras (`img/noite-patio.jpg`, de `tools/noite.py`) y ve **luz por debajo de la puerta del taller**, que se apaga. Ya no viene de la estación: viene de detrás de la casa. Marca `silbato2`.
- «Mércores, 8:00». Objetivo: la llave del taller (Concha).

### A6 · O taller vello (`tallerA2`, `vigasA2`), con la ilustración de Oscar
- **Fondo (15-11-2026):** `img/bg-taller-interior.jpg`, ilustración de Oscar del interior: caja de madera a la izquierda, huellas de botas que van hacia el fondo, pilar de ladrillo en el centro con un trapo a sus pies, marcas circulares en el suelo a la derecha, cinco ventanas (la última con hiedra) y las vigas de la transmisión arriba. El pilar es capa delantera: Martín pasa por detrás. La misma imagen sale ahora cuando Martín mira por la rendija en el Acto 1. La vista de las vigas (`vigasA2`) tiene ficha propia (A6b, abajo), con la ilustración de Oscar del 16-11-2026.
- **Encaje de las pistas con el dibujo:** la foto de 1949 se dibuja clavada en el pilar (desaparece al cogerla) y el grabado, debajo; las huellas son las del dibujo; el trapo es el del dibujo, y Martín se lleva solo una esquina con la grasa (así el trapo sigue en la imagen sin contradicción); el cajón con la escritura es la caja de la izquierda; las marcas de pernos son los círculos del suelo de la derecha; las vigas de arriba llevan a la vista del 7.º soporte. Salida al patio abajo a la izquierda.
- **Entrada:** desde el patio, usando la **Chave do taller** en la puerta verde (marca `tallerAberto`; después se entra sin más).
- **Pistas** (rehechas el 15-11-2026: cada una cuenta la ficción y sirve más adelante; contador «Pistas do taller: n de 4»):
  - **foto vieja** del pilar → se coge (`foto1949`): «Pepe, Manolo, Xosé N.» y «Xosé entra en Renfe. Sorte, rapaz» (`pistaFoto`). Uso: Acto 3, enseñársela a Xoán;
  - con el ollo, **grabado en el pilar** bajo la foto: «X. N. 1949 / 14-I-1958» (`pistaData`). Uso: código 1401 del candado de las cocheras (Acto 3);
  - con el ollo, **huellas** desde el fondo, bajo las ventanas, hasta el pilar → al final, un **trapo con grasa de locomotora** (`trapo`, `pistaTrapo`). Uso: Acto 3, la grasa que falta del almacén;
  - en las vigas, el **7.º soporte**: tapa de hierro con **cuatro tornillos, cada uno con un punto de soldadura en la cabeza** (`pistaSoporte`). Ni la mano, ni la navaja, ni el destornillador. Se abre en el Acto 4 (ver A6b).
  - Decorado opcional: el cajón con la **escritura n.º 375** y las **marcas de pernos**.
- **Final:** con las cuatro pistas, el cuaderno de Martín resume lo que sabe y deja la pregunta «¿quién era Xosé N.?». **FIN DO ACTO 2.**
- **Personas reales:** Alfredo Fernández Gutiérrez, Juan Lowy Szabo y Manuel Goñi Echeverría solo aparecen por lo que dice la escritura (la venta de 1952). Ni hablan ni se les atribuyen intenciones.

### A6b · O taller vello, mirando arriba (`vigasA2`), con la ilustración de Oscar
- **Fondo (16-11-2026):** `img/bg-taller-arriba.jpg`, ilustración de Oscar «parte superior del taller»: vigas y entablado de madera, un **hueco en el tejado** con cielo a la izquierda, el **eje de la transmisión** que cruza de izquierda a derecha y entra por un collar en una **caja de hierro** (el 7.º soporte) con una **tapa de cuatro tornillos**, sentada encima del **pilar de ladrillo** (ladrillo de dos agujeros), una **columna de hormigón** que sigue hasta el tejado y un **nido** arriba a la derecha, sobre la viga. Recorte del original 1688×932 a 16:9 (se quitan 16 px por cada lado) y 1600×900. Sustituye a la foto (`img/bg-taller-vigas.jpg`, que solo queda para la escena vieja de `data.js`, ya fuera de juego).
- **Cómo llega Martín:** en `tallerA2`, la viga de arriba (hotspot «Viga da transmisión», toda la franja superior) lo lleva andando hasta el pie del pilar y cambia a esta vista: es lo que ve Martín al levantar la cabeza. La primera vez lo dice («Me pongo al pie del pilar y miro arriba»). Vista sin Martín (`noActor`). **Salida:** franja de abajo «Baixar a mirada» → `tallerA2`, junto al pilar. Siempre se puede volver, en cualquier acto.
- **Encaje con la historia (cambio del 16-11-2026, revisar con Oscar):** el dibujo enseña una tapa atornillada, no soldada por los bordes. Se cuenta así: Xosé atornilló la tapa y **puso un punto de soldadura en la cabeza de cada tornillo**, para que nadie la abriera con un destornillador. «Soldada» sigue siendo verdad, y queda mejor con Remedios, que es soldadora: en el Acto 4 ella reconoce el trabajo y le presta a Martín su **piqueta de soldador** para saltar los puntos; luego basta el destornillador.
- **Para subir:** los ladrillos de dos agujeros del dibujo hacen de peldaños. Martín sube apoyando la punta del pie y llega a la tapa (así se explica también cómo llega quien deja las huellas).
- **Hotspots** (castellano de Martín):
  - **Parafusos** (clave): las cuatro esquinas de la tapa. Mirar: un punto de soldadura brillante en cada cabeza, «esto no es óxido, es a propósito». Destornillador: no entra en la ranura, está llena de soldadura. Navaja: se mella.
  - **Tapa do sétimo soporte** (clave, centro de la tapa): da la pista `pistaSoporte`. Mirar: «Los otros seis soportes se abren con una palometa; este, con cuatro tornillos soldados». Usar (mano): sube por los agujeros del ladrillo y tira, no se mueve.
  - **Caixa do soporte:** el cojinete donde gira el eje; en una carpintería, el soporte guarda la grasa; hoy suena hueco al golpearlo («ahí dentro hay algo que no es grasa»).
  - **Eixo da transmisión:** el motor hacía girar el eje y de él bajaban **las correas** a cada máquina. Siembra la frase de Xosé del Acto 4 («onde se moven as correas»): Martín lo dice sin darle importancia.
  - **Piar de ladrillo:** ladrillo de dos agujeros que sirven de peldaños.
  - **Columna de formigón:** la que sube hasta el tejado; arreglo posterior al ladrillo.
  - **Burato do tellado:** cielo y tejas rotas; por ahí entra la luz (y el agua).
  - **Niño** (no clave): nido de paja sobre la viga, ahora vacío. **Hueco preparado para el pájaro NPC de Oscar:** zona `[756, 78, 142, 86]` del lienzo 960×540; cuando llegue la hoja del pájaro se añade como `npcs` de `vigasA2` con `x≈826, y≈150` y el nido sigue de decorado.
  - **Vigas** (todo lo demás): madera de castaño, setenta años aguantando.
- **Acto 4 (preparado, aún sin dar):** objeto `piqueta` (Piqueta de soldador, ya definido). Piqueta en tornillos o tapa → salta los puntos (`puntosPicados`). Después, destornillador (o la mano, si Martín no lo lleva: «con la piqueta de palanca») → se abre la tapa (`soporteAberto`, `lataCollida`) y Martín coge la **lata de tabaco** (`lata`; con la navaja sale el parte). Con la tapa abierta, la caja se dibuja abierta por código. Si se usa la piqueta antes del Acto 4 no puede pasar porque aún no existe en el inventario.
- **Sin callejones:** todo lo de esta vista es mirar o probar; nada se gasta ni se pierde.

### Sin callejones sin salida
- Los pasteles se pueden comprar siempre a Genaro (y los ositos a Concha). La crema, si se pierde, Valerio da otra muestra. El minijuego no se puede perder del todo (empate técnico). La llave del taller no se gasta.

## Cambios de la revisión con las reglas de Ron Gilbert (15-11-2026)
- **A4 Doutor Casares:** la puerta de la Casa Juana se abre con las llaves, sin contrato. En el mapa, la Gasolineira ofrece ir directo a casa en cuanto se tienen las llaves; el Concello sigue pidiendo el contrato (Martín lo explica).
- **A4b Concepción Arenal:** la puerta de la Fraternal se abre aunque no se haya hablado con Demetrio; él da el aviso de la brisca al pasar.
- **A3b Quiosco (Acto 1):** Concha menciona la llave de la nave y «el detalle» (flag `sabeChaveTaller`).
- **A5b Cocina:** el cajón da la navaja vieja (flag `navallaCollida`) y, si hace falta, el destornillador.
- **A5c Patio:** la rendija del taller termina con una línea de Martín, sin aviso de programador.
- **B4 Concello:** devolver la silla la deja atornillada en el mismo paso (`cadeiraPosta` + `cadeiraDevolta`). Al sellar, Eladio menciona a «un tal Nogal» (`eladioNogal`).
- **B5 Café:** hotspot nuevo «Desaparafusador» encima de la barra (flag `desapCafe`).
- **A2 Vestíbulo (Acto 2):** Xoán con charla nueva (`a2XoanSauda`, `xoanCandadoV`).
- **C2 Cinemática del primer turno:** el candado es de combinación, de cuatro cifras (desde el 16-11-2026 lo dice Martín al mirar el candado en A7, no la cinemática).
- **C2 Club Fluvial:** tras la primera derrota se puede elegir «Otra» o «Empate técnico».
- **Motor:** cuaderno de Martín (`CADERNO`, botón y tecla C) y opción «Modo axuda».

## Portada
- **Música del menú:** `audio/musica-menu.mp3`, pista creada por Oscar con Suno (14-11-2026). Suena en bucle mientras el menú está a la vista, con el volumen de «Música» de Opcións; se apaga al empezar la cinemática o la partida y vuelve al abrir el menú. Los navegadores no dejan sonar nada antes del primer toque, así que el juego abre con una pantalla «Toca para comezar» (`mStart`): ese toque desbloquea el sonido y pasa al menú ya con la música. Antes (hasta el 14-11-2026) el primer toque solía ser «Nova partida» y la música no llegaba a oírse; además en pantallas táctiles el arranque no contaba como toque válido. Si el elemento `<audio>` falla, la pista se reproduce con WebAudio.
- **Fondo del menú:** `img/portada-rotonda.jpg`, ilustración de Oscar de la rotonda del museo del ferrocarril de Monforte, con un velo oscuro para que se lea el menú.

## Mapa de Monforte (`mapa`)
- **Fondo:** `img/bg-mapa.png`, mapa ilustrado en papel (no a escala, y así lo dice): río Cabe, Ponte Vella, monte de San Vicente, calles en esquema, vías que convergen en la estación y la rotonda del depósito.
- **Zonas:** Barrio da Estación (abierta → A3), Casa Roja (con el contrato firmado → A4 Doutor Casares, delante de la casa; pedido por Oscar), Centro · Concello (con el contrato firmado → B4a), Río Cabe · Malecón (M3), Castelo de San Vicente (M3), Vilatán fuera del mapa (M6). Las zonas cerradas dan una frase de Martín y un aviso del hito en el que llegan.
- **Pendiente:** Oscar debe validar la posición de las zonas con el mapa real.


## Mapa de Monforte (viaje rápido)

- **Fondo:** ilustración de Oscar «Monforte de Lemos · Escolle o teu destino» (`img/bg-mapa.jpg`, 1920×1080). Sustituye al boceto provisional. Lleva la atribución de OpenStreetMap y Catastro, que también está en los créditos.
- **Cómo se llega:** desde la plaza de la estación (borde de abajo), desde Doutor Casares («Rúa cara ao centro»), desde el exterior del Concello (izquierda), desde la rúa do Cardeal y desde el Club Fluvial.
- **Destinos (icono + cartel, zona pulsable de tamaño dedo):**

| Destino | Escenario | Se abre |
|---|---|---|
| Estación | A3 plaza de la estación | siempre |
| Gasolineira | rúa Morín (con las llaves, Martín ofrece ir directo a Doutor Casares, 211) | siempre |
| Praza do Concello | exterior del Concello | contrato firmado |
| Rúa do Cardeal | (sin escena) | Cerrada en el Acto 2: la farmacia pasó a Calvo Sotelo. Pendiente de Oscar |
| Club Fluvial | Club Fluvial | Acto 2, cuando Concha habla de Mega Andrés |

- **Destinos cerrados:** cartel apagado y «(aínda non)»; al tocarlos Martín da un motivo con su voz (nunca un callejón: siempre quedan Estación y Gasolineira). Los abiertos llevan un aro dorado que late.
- **Solo para mirar:** castillo de San Vicente, río Cabe, Ponte Vella.
- **Museo del Ferrocarril:** no está en el mapa (decisión de Oscar, 15 nov). Se llega a pie desde la plaza de la estación por la calle del fondo, a A7 (ficha siguiente).
- **Fuera del mapa nuevo:** Vilatán (casa de la madre), que en el boceto era una zona cerrada de broma; vuelve cuando haga falta.

## A7 · Exterior de las cocheras del Museo do Ferrocarril (jugable)

- **Fondo:** ilustración de Oscar `img/bg-cocheras.jpg` (la misma de la cinemática del primer turno), recortada a 16:9 (`crop: [100, 0, 1571, 884]`).
- **Llegada:** a pie desde A3 plaza de la estación, por la calle del fondo (flecha arriba). No es destino del mapa. **Salida:** borde de abajo → plaza de la estación.
- **Candado:** en el Acto 1 (lunes) todavía no está: se tapa por código con un trozo liso de la propia persiana. Desde el Acto 2 (martes, tras la cinemática) se ve y se puede mirar y tocar. Es lo que cierra el paso: sin el código Martín prueba combinaciones y se rinde con una broma; con la fecha del pilar vista (o tras el Acto 2) piensa en «catorce, uno» pero quiere hablar antes con Xoán. El código 1401 abre el candado en el Acto 3 (interior A8: almacén con la maquinaria de la carpintería de la Casa Juana; la Mikado está fuera, en la rotonda).
- **Hotspots:** candado, puerta del taller, entrada del museo (cerrada a esas horas), persianas, coche de viajeros, cartel del maquinista, los dos letreros, escudo y reloj.
- **Salida derecha (16-11-2026):** «Rotonda do museo» → A7b, la rotonda con la Mikado, en todos los actos.
- **Sin callejones:** la vuelta a la plaza está siempre abierta.

## Acto 3 · «A curiosidade» (jueves) · 16-11-2026
Código en `js/acto3.js`. Sigue a «FIN DO ACTO 2» y está en «Escoller acto». **Objetivo:** descubrir quién es el fantasma.
**Cambio del 16-11-2026 (Oscar):** la Mikado **no está dentro de las cocheras**: es una pieza de exposición al aire libre, en la rotonda del museo (la que se ve desde el balcón y en las cinemáticas). Dentro de las cocheras está guardada la **maquinaria de la carpintería de la Casa Juana** (la de la escritura de 1952 y la foto de 1949) y allí los jubilados arreglan las piezas. La noche pasa en la rotonda.
Reglas de Gilbert aplicadas: Martín dice el primer paso (preguntar a Xoán por Xosé N.) y cada personaje apunta al siguiente; dos caminos abiertos a la vez (cocheras y farmacia) que se juntan en la noche; el problema antes que la solución (Anxo busca sus pastillas en los bolsillos antes de que Martín se las dé; el inyector no coge agua antes de que Martín lo arregle); sin muertes ni callejones (fallar el candado o el inyector solo da una broma y una pista); la noche llega cuando el jugador lo tiene todo, no por reloj (tiempo de Hollywood).

### Apertura
Hoja «ACTO 3 · A curiosidade. Xoves.» → vestíbulo de la estación tras el turno de mañana. Martín: hoy pregunta a Xoán quién era Xosé N. Objetivo en el cuaderno.

### A2 · Xoán en el vestíbulo (cambios en el Acto 3)
- **«¿Quién era Xosé N.?»**: «Hai Xosés para encher un tren». Si Eladio le habló de «un tal Nogal» (Acto 1), Martín ata la N: «Nogal é un apelido moi común... ou non». Mira al emigrante del mural y suelta: «Pregúntalle a quen garda papeis vellos. Eu só gardo horarios» → **Valerio** (`a3XoseN`).
- **«Dos largos y uno corto»**: silencio y cambio de tema al regional de las 21:30 de 1958, que salía tarde todos los días «agás un» (`a3Asubio`).
- **El trapo** (diálogo o darle el objeto): grasa de bielas «da que xa non se fai»; del almacén del depósito falta desde el verano y el jefe cree que se la llevan «os do museo» → **las cocheras** (`a3Graxa`).
- **La foto de 1949**: «Gárdaa ben. Moi ben.» y se va al mural.

### A3b · Concha (cambios en el Acto 3)
«Que se conta?»: Valerio anda preocupado porque Don Anxo, «o vello fogoneiro», no bajó el lunes a por las pastillas; y de noche hay luz en las cocheras del museo y la Mikado de la rotonda echa humo, «pero iso non cho dixen eu». Apunta a los dos caminos.

### B2 · Farmacia: el libro de 1958 y la puerta a Don Anxo (ideas de Oscar del 15-11-2026, ficción)
- Xoán ya no está en la farmacia.
- **«¿Me enseñas el libro de enero de 1958?»** (si no se sembró en el Acto 2, Valerio explica antes lo de los libros). Martín da la fecha del pilar y Valerio va a la rebotica. Hoja del libro (ficción, marcada así): «14-I, noite · Curas por queimaduras nas mans. X. Nogal. Non quixo ir ao médico.» Martín: quemarse las manos un maquinista es agarrar algo al rojo, un freno o una palanca. Es un **indicio**, no la prueba.
- «Os libros do meu pai non saen da rebotica. Nin para ti.» Martín copia la anotación: objeto **`nota1958`** (`libro1958`).
- **Don Anxo:** Valerio cuenta que un hombre que estaba en el depósito ese invierno le viene a buscar las pastillas los lunes y este lunes no vino; las vecinas dicen que sale todas las noches y vuelve oliendo a carbón, «aos oitenta e cinco anos». Es Don Anxo Corredoira, fogonero; «do 58 non fala. Nunca». Martín: «¿Corredoira? ¿Como Andrés?». Valerio: es su abuelo (flag `anxoNetoSabe`). Le da a Martín **las pastillas de Anxo** (objeto `pastillas`) por si lo ve.

### A7 · Exterior de las cocheras (cambios en el Acto 3)
- **Candado de combinación** con la mecánica general `candadoCombinacion` de `engine.js` (cuatro ruedas, botones grandes para el dedo, flechas o números en el teclado). Código **1401** (14-I, la fecha del pilar). Broma al abrir: «¿Quién pone de contraseña una fecha? Mi madre. Y por lo visto, los jubilados del depósito». Fallar no cuesta nada; tras dos fallos, Martín recuerda «catorce del uno: día y mes, cuatro cifras justas». Con 1958 y 0000 hay frase propia.
- El dibujo de Oscar muestra un candado de llave: el texto ya dice «cerradura de llave y, debajo, cuatro ruedecitas con números». **Pendiente de Oscar:** retocar el dibujo con las ruedas o dejarlo así.
- **Coche de viajeros:** cuando Martín tiene las cinco pistas de dentro y las pastillas, es su escondite para esperar a las once (lanza la noche). **Se esconde dentro** (Oscar, 16-11-2026): lo abre con la **llave de cuadradillo** que lleva todo maquinista. Antes de tiempo, Martín ya lo dice al tocarlo («sin nada que vigilar, entrar sería allanamiento con vistas»), así que el jugador sabe dónde esconderse cuando llegue la hora.

### A8 · Interior de las cocheras, de día (`cocherasDentro` + `cocherasDentroD`) · ilustración de Oscar
- **Qué es:** el almacén donde está guardada **la maquinaria de la carpintería de la Casa Juana** (decisión de Oscar del 16-11-2026): sierra de cinta, sierra circular, una cepilladora tapada con una sábana, regruesadora, torno, transmisión con poleas en el techo y el motor Siemens «A.F.G.». **No hay Mikado.** Cómo llegó allí no lo sabe nadie (ficción; la escritura de 1952 dice a quién se vendió, no dónde acabó). Al fondo, la puerta de carga entreabierta da a las vías y a la rotonda.
- **Fondo:** ilustración panorámica de Oscar (16-11-2026), muy ancha (unos 3:1). Se parte en **dos pantallas 16:9** que se solapan en el centro, sin deformarla: `img/bg-cocheras-interior-esq.jpg` (las máquinas y el motor) y `img/bg-cocheras-interior-der.jpg` (la pizarra, el banco del inyector, la carretilla y el carbón). Se pasa de una a otra por los bordes (flechas izquierda/derecha). La toma de noche que mandó Oscar está cortada por abajo y **no hace falta ahora** (la noche pasa en la rotonda); queda guardada en la carpeta del proyecto (`via-morta/cocheras-interior-noite-oscar.jpg`) por si se usa en el Acto 4 o 5.
- **Pantalla izquierda (entrada desde la plaza):** salida abajo → exterior; borde derecho → pantalla derecha. Hotspots: **motor «A.F.G.»** (pista), sierra de cinta (con la **foto de 1949**: «o es ella, o tiene una gemela», `serraFoto`), sierra circular, máquina tapada (cepilladora), regruesadora, torno, escalera, puerta de carga, lámpara, transmisión y ventanas.
- **Pantalla derecha:** salida abajo → exterior; borde izquierdo → pantalla izquierda. Hotspots: **pizarra** (pista), **piezas de bronce/inyector** (pista), **huellas** (pista, con el ollo), **sacos de carbón** (pista), carretilla, motor (otra vez la pista, se ve en el borde), puerta pequeña cerrada, puerta de carga, **plano de una Mikado** con anotaciones a lápiz, llaves fijas, taladro de columna, esmeriladoras, armario, poleas en el suelo, lámpara y transmisión.
- **La pizarra:** el dibujo trae «Presión: 9 kg. / Probar inxector. / Mércores: tubos». La línea clave, **«Xoves 23:00: proba de lume»**, va en un papel pegado en la esquina de la pizarra, pintado por código (si Oscar prefiere, puede dibujarlo él).
- **Cinco pistas** (contador «Pistas das cocheras: n de 5»):
  1. **Pizarra** (`pistaLousa`): Martín: aquí no hay nada con caldera; la única en cien metros es la de la **Mikado de la rotonda**. «Jueves a las once... es hoy.»
  2. **Motor «A.F.G.»** (`pistaMotor`): Siemens de 10 CV medio tapado con una lona sin polvo, con las iniciales **con la misma letra que el pilar del taller**. Alguien busca algo dentro (siembra el Acto 4).
  3. **Inyector de bronce** (`pistaPeza`): con el sello de Renfe y grasa de bielas fresca, «para montarlo esta noche». Con el trapo del taller: «la misma grasa».
  4. **Huellas** (con el ollo, `pistaPegadasC`): botas con carbonilla y zapatillas de andar por casa, de los sacos a la puerta de carga que da a la rotonda.
  5. **Sacos de carbón** (`pistaCarbon`); si Andrés lo contó, «aquí acaba el carbón de Andrés».
- Con las cinco, cuaderno: alguien está poniendo en marcha la Mikado de la rotonda; las piezas se arreglan aquí y se montan fuera; esta noche a las once, prueba de fuego. Si falta el libro de Valerio, Martín recuerda que tiene tiempo hasta las once.

### A7b · Rotonda do museo, de día (`rotonda`) · opcional
- **Es la rotonda buena** (Oscar, 16-11-2026): la de la portada, con la **plataforma giratoria** y las cocheras en abanico. La glorieta de tráfico de la vista del balcón se reformará más adelante.
- **Fondo:** la portada de Oscar `img/portada-rotonda.jpg` (la rotonda con la plataforma giratoria y la Mikado encima), recortada a 16:9. Se llega por la derecha del exterior de las cocheras; se vuelve por abajo.
- **Hotspots:** Mikado (en el Acto 3, Martín toca la caldera: **tibia**, `a3MikadoTibia`), ténder (carbón de piedra recién echado en el Acto 3), plataforma giratoria y las cocheras en abanico. Subir a la cabina de día: no, «mañana sale en el periódico».

### A7c · Interior del coche de viajeros, de noche (`cocheNoite`)
- **Fondo:** ilustración de Oscar del coche comedor (`img/bg-coche-viaxeiros.jpg`, 16-11-2026): mesa larga con mantel, sillas de terciopelo azul, lamparitas, apliques de latón, cortinas azules, un retrato de una pareja, una foto de una locomotora y una rueda de latón en la pared del fondo. Pasada a noche por código (`tools/fondos-acto3.py` → `img/noite-coche-viaxeiros.jpg`): lámparas apagadas (Martín está escondido), cielo de noche en las ventanillas y, por la ventanilla grande de la izquierda, la fachada de las cocheras con la luz bajo la persiana (que late por código).
- **Suelo:** la esquina de abajo a la izquierda, junto a la ventanilla por la que espía Martín.
- **Hotspots:** puerta del coche (salida abajo a la izquierda → exterior de noche), ventanilla (por donde espía), ventanillas del otro lado, retrato de la pareja, foto de la locomotora, rueda de latón, las dos lamparitas («encenderla sería poner un cartel: Martín, aquí»), apliques, mesa, sillas, cortinas y cortina del fondo.
- **Cadena:** por un agujerito de la cortina, Martín ve subir la persiana: salen sombras con **la carretilla de carbón, un farol de mano y unas zapatillas de cuadros**, y rodean el museo hacia la rotonda. Luego, un resoplido que hace temblar el cristal. Objetivo: salir del coche y seguirlos.

### A7 · Cocheras de noche (`cocherasNoite`) · fondo provisional
`img/noite-cocheras.jpg` (tratamiento de noche del dibujo de Oscar). Tras la vigilancia desde dentro del coche de viajeros, que se ve desde aquí: salen sombras con **la carretilla de carbón, un farol de mano y unas zapatillas de cuadros**, y rodean el museo hacia la rotonda. Luego, un resoplido: una caldera cogiendo presión. Objetivo: seguirlos. La salida de la derecha lleva a la rotonda de noche. La puerta del taller ya no lleva a ningún sitio («lo que importa está en la rotonda»).

### A7b · Rotonda de noche (`rotondaNoite`) · fondo y personajes PROVISIONALES
- **Fondo:** `img/noite-rotonda.jpg` (la portada de Oscar pasada a noche con `tools/fondos-acto3.py`), con el fuego de la cabina, el humo de la chimenea y un farol de mano animados por código, y la carretilla con carbón.
- **NPC (dibujados por código hasta tener las hojas de Oscar):** **Remedios** (mono azul, pelo gris recogido, gafas de soldar en la frente), **Don Anxo** (gorra, chaqueta de punto, zapatillas de andar por casa) y dos jubilados de espaldas junto al ténder.
- **Cadena:** Remedios: «Quen anda aí?». Martín se presenta; Remedios: «Apaga a lanterna... se pasa a patrulla, aquí somos catro vellos limpando unha máquina». Anxo se busca las pastillas en los bolsillos (problema). Martín se las da «de parte de Valerio» (solución); si le enseña la nota de 1958, «Hai noites que mellor non lembrar». Si sabe que es el abuelo de Andrés: «Non lle digas que me viches aquí»; Remedios: «O neto non sabe nada». Con Anxo a favor, Remedios habla: Adif se lleva la Mikado en un mes y quieren una última salida. Opciones de Martín: **la rotonda** («¿una caldera encendida en plena rotonda y nadie dice nada?» → «ás once só quedan os gatos e Concha»; de día, «catro vellos con bayetas: mantemento»), pizarra, **la carpintería** de las cocheras («cando entrei no 75 xa estaba alí, todo baixo lonas... nós usámola para amañar as pezas»), carbón y silbato. **Puzzle del inyector** (el que Martín vio en el banco, montado esta noche): vapor a tope (broma), golpe con la llave inglesa (broma) o **primero el agua y luego el vapor poco a poco** (canta). Remedios: les falta un maquinista con licencia. **FIN DO ACTO 3.**
- **El carbón de Andrés:** se lo lleva **Xoán** (elegido por Oscar el 16-11-2026). Remedios no lo delata: «un amigo que paga» (se descubre en el Acto 5).

### Dibujos pendientes para Oscar (Acto 3)
1. ~~Interior de las cocheras con la maquinaria~~: hecho con el dibujo de Oscar del 16-11-2026.
2. **La rotonda de noche con la Mikado encendida, a pie de suelo** (opcional: ahora se usa la portada pasada a noche, vista desde arriba). Fuego en la cabina, humo, un farol de mano en el suelo y sitio abajo para cuatro personajes y Martín.
3. ~~Interior del coche de viajeros~~: hecho con el dibujo de Oscar del 16-11-2026.
4. **Vista del balcón del salón** (Oscar, 16-11-2026): hay que reformarla más adelante para que enseñe la rotonda buena (la de la portada, con plataforma giratoria), no una glorieta de tráfico. De momento no se toca.
5. Hojas de **Remedios** y **Don Anxo**.

### Personas reales
Solo se nombra a Alfredo Fernández Gutiérrez por las iniciales del motor (el motor Siemens y la lista de máquinas de su carpintería son datos reales; que estén guardados en las cocheras del museo es ficción, ver `04`). Nada sobre los compradores de 1952: Martín y Remedios dicen que nadie sabe cómo llegó allí.
