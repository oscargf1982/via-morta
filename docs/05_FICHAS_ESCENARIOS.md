# «Vía morta» · Fichas de escenarios

> Cada escenario se describe aquí antes de programarlo en `js/acto*.js`. Coordenadas en el lienzo lógico de 960×540.
> Los fondos de A1, A2, A3, A3b, A4, A4b, A4c, B3 y la portada son ilustraciones de Oscar. El mapa sigue siendo un **boceto provisional** generado con `tools/fondos.py`.

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
- **Objetos:** `chavesCasa`, `ositos`, `xornal`, `boli` (tras resolver el crucigrama).
- **Desbloquea:** marca `objetivoContrato` (firmar con Rosario en la Fraternal).

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
- **Vista del balcón (decidido por Oscar):** al usar o mirar las ventanas del balcón salta a pantalla completa `img/vista-salon.jpg`, ilustración de Oscar: la gasolinera, la capillita, el supermercado y, al fondo, el museo del ferrocarril con la Mikado. Martín lo comenta y recuerda la pista de Xoán («Bo balcón. Dende el vése o depósito»). Marca `vistaSalon`.
- **La noche (fin del Acto 1, propuesta provisional):** al volver con el alta del agua (`aguaAlta`), Martín dice que anochece y que el dormitorio está a la izquierda (pista). En el sofá bromea: «mañana tengo la espalda de un señor de ochenta años». Al entrar al dormitorio: fundido a negro, cinemática con `img/noite-salon.jpg` (el salón a oscuras) y el silbato «dos largos y uno corto»; Martín se levanta y va al balcón: `img/noite-vista.jpg` (la vista del balcón de noche, con la Mikado). El silbato vuelve a sonar y Martín se da cuenta de que no pasa por delante de su casa: «llama a mi casa». Hoja «FIN DO ACTO 1». Marca `noiteActo1` y `fimActo1`. Las dos imágenes de noche salen de las de Oscar con `tools/noite.py` (solo oscurecer y azular); se cambian por arte propio si Oscar lo manda, igual que el dormitorio.
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
  2. **El reloj está muy alto (pedido por Oscar; elegida la silla del Concello).** Sin nada para subirse, Martín no llega: está encima de la estantería de las botellas, y los taburetes del bar están atornillados al suelo. Martín piensa en las sillas de espera del Concello («a Eladio nadie lo espera sentado»; pista en pantalla). Marca `reloxoAlto`. En el vestíbulo (B4), en las sillas azules, coge la del final de la fila, que no está atornillada (objeto `cadeira`).
  3. Con la silla (tocando el reloj o usando la silla con él), Martín lo adelanta diez minutos y se la lleva de vuelta. Eladio ve «las dos», cree que no ha fichado y sale corriendo sin pagar (broma). Marca `eladioVolveu`.
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

## Portada
- **Fondo del menú:** `img/portada-rotonda.jpg`, ilustración de Oscar de la rotonda del museo del ferrocarril de Monforte, con un velo oscuro para que se lea el menú.

## Mapa de Monforte (`mapa`)
- **Fondo:** `img/bg-mapa.png`, mapa ilustrado en papel (no a escala, y así lo dice): río Cabe, Ponte Vella, monte de San Vicente, calles en esquema, vías que convergen en la estación y la rotonda del depósito.
- **Zonas:** Barrio da Estación (abierta → A3), Centro · rúa do Cardeal (M2), Río Cabe · Malecón (M3), Castelo de San Vicente (M3), Vilatán fuera del mapa (M6). Las zonas cerradas dan una frase de Martín y un aviso del hito en el que llegan.
- **Pendiente:** Oscar debe validar la posición de las zonas con el mapa real.
