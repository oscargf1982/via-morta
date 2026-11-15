# «Vía morta» · Fichas de escenarios

> Cada escenario se describe aquí antes de programarlo en `js/acto*.js`. Coordenadas en el lienzo lógico de 960×540.
> Los fondos de A1, A2, A3, A3b, A4, A4b, A4c, B3 y la portada son ilustraciones de Oscar. El mapa sigue siendo un **boceto provisional** generado con `tools/fondos.py`.

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
- **Llegada:** desde la puerta de la Casa Juana (A4) con llaves y contrato. La primera vez Martín abre, entra y comenta la casa; después, una pista: «explora a casa, a cociña está á dereita».
- **Suelo:** la tarima. Obstáculos: el sofá, las mesitas y la mesa con las sillas (Martín pasa por delante).
- **Salidas:**
  - Derecha → cocina (A5b).
  - Izquierda → dormitorio. Sin fondo propio todavía: antes del alta del agua, Martín dice que aún no es hora de dormir; con el alta, lanza la noche del fin del Acto 1.
  - Abajo → vuelta a la calle, Doutor Casares (A4). Así nunca hay callejón sin salida.
- **Vista del balcón (decidido por Oscar):** al usar o mirar las ventanas del balcón salta a pantalla completa `img/vista-salon.jpg`, ilustración de Oscar: la gasolinera, la capillita, el supermercado y, al fondo, el museo del ferrocarril con la Mikado. **Decidido por Oscar el 14-11-2026:** la Mikado se ve a lo lejos (el museo no está delante de la casa), pero es la protagonista: la cámara se acerca despacio hasta ella y se queda ahí, también en la noche del fin del Acto 1. Mecánica general: `cine(src, lines, zoom)` en `engine.js`, con `zoom = { x, y, z }`; aquí `ZOOM_MIKADO` en `acto1.js`.
- **La noche (fin del Acto 1, propuesta provisional):** al volver con el alta del agua (`aguaAlta`), Martín dice que anochece y que el dormitorio está a la izquierda (pista). En el sofá bromea: «mañana tengo la espalda de un señor de ochenta años». Al entrar al dormitorio: fundido a negro, cinemática en el dormitorio de Oscar pasado a noche (`img/noite-dormitorio.jpg` y, al levantarse, `noite-dormitorio-lampada.jpg`) y el silbato «dos largos y uno corto»; Martín se levanta y va al balcón: `img/noite-vista.jpg` (la vista del balcón de noche, con la Mikado). El silbato vuelve a sonar y Martín se da cuenta de que no pasa por delante de su casa: «llama a mi casa». Hoja «FIN DO ACTO 1». Marca `noiteActo1` y `fimActo1`. Las dos imágenes de noche salen de las de Oscar con `tools/noite.py` (solo oscurecer y azular); se cambian por arte propio si Oscar lo manda, igual que el dormitorio.
- **Hotspots:** ventanas del balcón (la vista), ventana de la izquierda, sofá, cojines, mesitas, aparador, planta, cuadros, mesa y sillas, lámparas, interruptor, tarima.
- **Tono:** primera impresión de Martín en su casa. Todo parece en orden… salvo detalles que preparan la casa sin agua del M2 (no se resuelve aquí).
- **Personas reales:** ninguna.

## A5b · Casa Juana, cocina (`casaCocina`)
- **Fondo:** `img/bg-casa-cocina.jpg`, ilustración de Oscar. Cocina reformada: muebles crema, encimera de madera, azulejos hidráulicos, placa, horno, microondas, fregadero, lavavajillas, tabla de cortar, nevera e isla con frutero y taburete. Puerta balconera a la izquierda: se ven el supermercado de enfrente y, en lo alto del monte, la Torre del Homenaje de Monforte.
- **Llegada:** desde el salón (A5), salida derecha.
- **Suelo:** la tarima entre la isla y los muebles. Obstáculos: la isla y el taburete quedan fuera del suelo.
- **Salidas:** puerta de la pared derecha → salón (A5).
- **Hotspots:** grifo (clave: **no sale agua**; Martín deduce que hay que dar de alta el agua en el Concello con el contrato, que llegará en M2; marca `sinAgua`), balcón, Torre del Homenaje, supermercado, nevera, frutero, isla, taburete, placa, horno, microondas, tabla de cortar, lavavajillas, azulejos, armarios.
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
- **Llegada (decidido por Oscar):** desde el mapa, zona «Centro», que se abre al tener el contrato firmado. Antes, la zona sigue cerrada con su comentario.
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
> Código en `js/acto2.js`. Sin Brais ni la Volta do Castelo. Los fondos marcados **provisional** se dibujan por código hasta que lleguen las ilustraciones de Oscar; los NPC nuevos (Valerio, Andrés) también son provisionales hasta sus hojas de personaje.

### C2 · Cinemática del primer turno (martes)
- **Cuándo:** justo después de «FIN DO ACTO 1» y al elegir «Acto 2» en Escoller acto.
- **Fondo:** primero la Mikado en la rotonda (`img/portada-rotonda.jpg`) y después el **exterior de las cocheras del Museo do Ferrocarril** (`img/bg-cocheras.jpg`, ilustración de Oscar del 15-11-2026), con acercamiento al **candado nuevo de la puerta derecha del taller**. La misma imagen servirá de fondo de A7 en el Acto 3. En el dibujo se ve la cerradura de llave; Martín dice que debajo tiene cuatro ruedecitas con números (de combinación, código 1401 en el Acto 3). Si Oscar quiere, puede añadir las ruedecitas al dibujo.
- **Texto:** «Martes, 6:40. Primeiro turno no depósito». Martín: la cadena oxidada de siempre y, hoy, un candado nuevo, brillante, «de los caros». «Martes, 15:10. Fin do turno». Al salir se queja de los gemelos (pista de la crema).
- **Después:** Martín aparece en la praza da Estación (A3). Objetivo: «Saudar aos de sempre. Concha sabe onde anda todo o mundo».

### A3b · Quiosco de Concha (cambios en el Acto 2)
- Nueva opción «¿Qué se cuenta hoy?»: Valerio preguntó por Martín (farmacia de la rúa do Cardeal) y Andrés dice que le debe la revancha de natación. Marcas `objValerio`, `objAndres`.
- Tras el segundo silbato: «¿Y la llave del taller?». Dar los **ositos** → **Chave do taller**. Si no hay ositos, Concha los vende en el momento (broma: «Regalarme os meus propios ositos, co meu cambio...»).

### Mapa (cambios en el Acto 2)
- **Centro** pregunta adónde ir: el Concello (B4a) o la rúa do Cardeal (B1). No se afirma que estén pegados.
- **Río Cabe** se abre con `objAndres` y lleva directo al Club Fluvial (C2).
- **Castelo de San Vicente** sigue cerrado («otro día; hoy mis gemelos no suben ni a una silla»).

### B1 · Rúa do Cardeal (`cardeal`) · ilustración de Oscar
- **Fondo:** `img/bg-cardeal.jpg` (15-11-2026): calle peatonal con árboles y una torre al fondo, la farmacia con **toldo de rayas rojas y blancas, letrero «FARMACIA» y cruz verde de neón** (el neón late por código), una terraza con sombrilla a la derecha. Los carteles «Se aluga» de dos puertas de más abajo se pintan por código (tema de Valerio).
- **Salidas:** farmacia → B2; abajo a la derecha → mapa.
- **Hotspots:** farmacia, letrero, cruz verde, escaparate, locales «Se aluga», toldo, balcones, farol, terraza, árboles, torre al fondo, papelera, losas.

### B2 · Farmacia, interior (`farmacia`) · ilustración de Oscar
- **Fondo:** `img/bg-farmacia.jpg` (15-11-2026): estanterías de madera con arcos y el letrero «Ortopedia y deporte», un expositor central, mostrador del fondo con lámparas de bola, butaca y pantalla de turnos. Se anda por el pasillo de la derecha; la puerta a la calle queda abajo a la derecha (fuera de cuadro). Valerio espera delante del mostrador del fondo; Xoán, en el pasillo.
- **NPC:** **Valerio** (compañero de instituto de Martín), con la bata de su padre. **Xoán Carballeira** en el mostrador, recogiendo «o xarope de Eugenia, a nena da miña curmá». Martín ata cabos: Eugenia es la hija de Rosario, así que Xoán es primo de Rosario (marca `pistaCurma`).
- **Crema de agujetas:** Valerio ve andar a Martín y se ríe: «Andas coma un home de oitenta anos». Se la regala, de muestra. Objeto `crema`, marca `valerioFeito`.
- **Hotspots:** letrero «Ortopedia y deporte», estanterías (tres), expositor, mostrador, lámparas, butaca, pantalla de turnos.
- **Personas reales:** ninguna.

### C2 · Club Fluvial: piscina y chiringuito «Malo Será» (`fluvial`) · ilustración de Oscar
- **Fondo:** `img/bg-fluvial.jpg` (15-11-2026): chiringuito «Malo Será» de paja con pizarra (refrescos, cerveza, agua, zumos), mesas con sombrilla en el césped, la piscina al fondo tras la valla con salvavidas y el castillo de San Vicente en lo alto. **La carretilla azul y los sacos de carbón se pintan por código** (a la derecha, junto a la valla) porque no salen en el dibujo y hacen falta en el Acto 4. Cerrada desde septiembre... salvo para Andrés.
- **Llegada:** desde el mapa, zona Río Cabe, por la derecha. **Salida:** borde derecho → mapa.
- **NPC:** **Mega Andrés**, en su tumbona (dibujada con él, por código) sobre el césped. Filósofo: «a vida, mellor deitado».
- **Puzzle:** Andrés quiere la revancha de natación (cuatro largos). Sin `crema`, Martín se niega y apunta a la farmacia. Con ella, minijuego de toques alternos (izquierda/derecha, mecánica general `minixogoToques` en engine.js). Si gana Martín: tarde de tumbona. Si pierde dos veces, Andrés propone empate técnico a cambio de un mojito. Siempre se sale con `andresFeito`.
- **Siembra para el Acto 4:** el abuelo fogonero, los sacos de carbón «para o churrasco» y la carretilla de las tumbonas (hotspots mirables).
- **Hotspots:** piscina, salvavidas, letrero, pizarra, chiringuito, mesas, carretilla, sacos de carbón, farolas, castillo.

### B3 · A Fraternal de noche (`fraternalNoite`)
- **Fondo:** `img/bg-fraternal.jpg` oscurecida por código, con la tele encendida (luz azulada) y el reloj. Se entra desde A4b cuando `valerioFeito` y `andresFeito` («Las ocho menos diez. Champions»).
- **NPC:** **tío Demetrio** (en la barra), **Xoán** y **Rosario** (en su mesa).
- **Escena:** Demetrio cuenta su gol al Ourense «un domingo de sol»; Xoán lo corrige: «Foi en mércores, Demetrio. E chovía». Martín nota la memoria de archivo de Xoán (sospecha suave). Preguntado por el candado nuevo, Xoán cambia de tema.
- **Salida:** a las 23:00 («ni prórroga ni penaltis») Martín vuelve a casa: marca `champions`.

### A5 · Segunda noche (dormitorio → patio)
- Con `champions`, el dormitorio lanza la noche: suena el silbato en el dormitorio a oscuras (`img/noite-dormitorio.jpg`, la ilustración de Oscar pasada a noche con `tools/noite.py`; luego `noite-dormitorio-lampada.jpg` con la lámpara de la mesilla encendida), Martín baja al patio a oscuras (`img/noite-patio.jpg`, de `tools/noite.py`) y ve **luz por debajo de la puerta del taller**, que se apaga. Ya no viene de la estación: viene de detrás de la casa. Marca `silbato2`.
- «Mércores, 8:00». Objetivo: la llave del taller (Concha).

### A6 · O taller vello (`tallerA2`, `vigasA2`), con las fotos de Oscar
- **Entrada:** desde el patio, usando la **Chave do taller** en la puerta verde (marca `tallerAberto`; después se entra sin más).
- **Pistas** (rehechas el 15-11-2026: cada una cuenta la ficción y sirve más adelante; contador «Pistas do taller: n de 4»):
  - **foto vieja** del pilar → se coge (`foto1949`): «Pepe, Manolo, Xosé N.» y «Xosé entra en Renfe. Sorte, rapaz» (`pistaFoto`). Uso: Acto 3, enseñársela a Xoán;
  - con el ollo, **grabado en el pilar** bajo la foto: «X. N. 1949 / 14-I-1958» (`pistaData`). Uso: código 1401 del candado de las cocheras (Acto 3);
  - con el ollo, **huellas** desde la ventana rota del fondo hasta el pilar → al final, un **trapo con grasa de locomotora** (`trapo`, `pistaTrapo`). Uso: Acto 3, la grasa que falta del almacén;
  - en las vigas, el **7.º soporte con la tapa soldada** (`pistaSoporte`). La navaja no puede. Se abre en el Acto 4.
  - Decorado opcional: el cajón con la **escritura n.º 375** y las **marcas de pernos**.
- **Final:** con las cuatro pistas, el cuaderno de Martín resume lo que sabe y deja la pregunta «¿quién era Xosé N.?». **FIN DO ACTO 2.**
- **Personas reales:** Alfredo Fernández Gutiérrez, Juan Lowy Szabo y Manuel Goñi Echeverría solo aparecen por lo que dice la escritura (la venta de 1952). Ni hablan ni se les atribuyen intenciones.

### Sin callejones sin salida
- Los ositos se pueden comprar siempre a Concha. La crema, si se pierde, Valerio da otra muestra. El minijuego no se puede perder del todo (empate técnico). La llave del taller no se gasta.

## Cambios de la revisión con las reglas de Ron Gilbert (15-11-2026)
- **A4 Doutor Casares:** la puerta de la Casa Juana se abre con las llaves, sin contrato. El mapa abre la Casa Roja en cuanto se tienen las llaves; el Concello sigue pidiendo el contrato (Martín lo explica).
- **A4b Concepción Arenal:** la puerta de la Fraternal se abre aunque no se haya hablado con Demetrio; él da el aviso de la brisca al pasar.
- **A3b Quiosco (Acto 1):** Concha menciona la llave de la nave y «el detalle» (flag `sabeChaveTaller`).
- **A5b Cocina:** el cajón da la navaja vieja (flag `navallaCollida`) y, si hace falta, el destornillador.
- **A5c Patio:** la rendija del taller termina con una línea de Martín, sin aviso de programador.
- **B4 Concello:** devolver la silla la deja atornillada en el mismo paso (`cadeiraPosta` + `cadeiraDevolta`). Al sellar, Eladio menciona a «un tal Nogal» (`eladioNogal`).
- **B5 Café:** hotspot nuevo «Desaparafusador» encima de la barra (flag `desapCafe`).
- **A2 Vestíbulo (Acto 2):** Xoán con charla nueva (`a2XoanSauda`, `xoanCandadoV`).
- **C2 Cinemática del primer turno:** el candado es de combinación, de cuatro cifras.
- **C2 Club Fluvial:** tras la primera derrota se puede elegir «Otra» o «Empate técnico».
- **Motor:** cuaderno de Martín (`CADERNO`, botón y tecla C) y opción «Modo axuda».

## Portada
- **Música del menú:** `audio/musica-menu.mp3`, pista creada por Oscar con Suno (14-11-2026). Suena en bucle mientras el menú está a la vista, con el volumen de «Música» de Opcións; se apaga al empezar la cinemática o la partida y vuelve al abrir el menú. Los navegadores no dejan sonar nada antes del primer toque, así que el juego abre con una pantalla «Toca para comezar» (`mStart`): ese toque desbloquea el sonido y pasa al menú ya con la música. Antes (hasta el 14-11-2026) el primer toque solía ser «Nova partida» y la música no llegaba a oírse; además en pantallas táctiles el arranque no contaba como toque válido. Si el elemento `<audio>` falla, la pista se reproduce con WebAudio.
- **Fondo del menú:** `img/portada-rotonda.jpg`, ilustración de Oscar de la rotonda del museo del ferrocarril de Monforte, con un velo oscuro para que se lea el menú.

## Mapa de Monforte (`mapa`)
- **Fondo:** `img/bg-mapa.png`, mapa ilustrado en papel (no a escala, y así lo dice): río Cabe, Ponte Vella, monte de San Vicente, calles en esquema, vías que convergen en la estación y la rotonda del depósito.
- **Zonas:** Barrio da Estación (abierta → A3), Casa Roja (con el contrato firmado → A4 Doutor Casares, delante de la casa; pedido por Oscar), Centro · Concello (con el contrato firmado → B4a), Río Cabe · Malecón (M3), Castelo de San Vicente (M3), Vilatán fuera del mapa (M6). Las zonas cerradas dan una frase de Martín y un aviso del hito en el que llegan.
- **Pendiente:** Oscar debe validar la posición de las zonas con el mapa real.
