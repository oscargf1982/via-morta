# «Vía morta» · Documento de diseño

*Aventura gráfica point & click en Monforte de Lemos. Versión 0.1 del documento, noviembre de 2026. Autor: Oscar.*

## 1. Concepto

**En una frase:** un maquinista de Renfe vuelve a su comarca, alquila una vieja casa roja junto a la estación y empieza a oír cada noche el silbato de una locomotora de vapor que lleva décadas parada. Tirando de ese hilo, destapa lo que pasó una noche de enero de 1958 y lo que esconde el taller de su propia casa.

- **Género:** aventura gráfica clásica en tercera persona, por pantallas. Las referencias son *Monkey Island 2*, *Day of the Tentacle* y *Broken Sword: La leyenda de los templarios*.
- **Tono:** humor LucasArts y retranca gallega por fuera; por dentro, una historia seria sobre la emigración, la memoria y quién se queda.
- **Duración objetivo:** entre 2 y 3 horas, repartidas en 5 actos.
- **Plataforma:** navegador, en ordenador y móvil. Se publica como página web y se presenta al concurso local de videojuegos.
- **Idiomas:** Martín habla en castellano, los NPC en gallego y la interfaz va en gallego.

## 2. Pilares de diseño

1. **Monforte reconocible.** Cada escenario es un lugar real, o claramente inspirado en uno, y se llega a él como en la ciudad real.
2. **Mirar tiene premio.** Todo hotspot tiene un comentario propio de Martín. Mirar es la mitad del humor y de las pistas.
3. **Puzzles con lógica de oficio.** Martín resuelve como un maquinista: presiones, señales, horarios, herramientas.
4. **Personajes con vida propia.** Cada NPC tiene su rutina, su manía y su relación con Martín (ver `02_PERSONAJES.md`).
5. **Justo con el jugador.** Ni muertes, ni callejones sin salida, ni pixel hunting: el «ollo de maquinista» resalta lo importante.

## 3. Interfaz y controles

El esquema es el de Broken Sword: un cursor inteligente en lugar de la lista de verbos de SCUMM, porque funciona igual con el dedo.

| Acción | Ratón | Móvil |
|---|---|---|
| Caminar / acción por defecto (ir, coger, usar, hablar) | Clic izquierdo | Toque |
| Mirar / examinar | Clic derecho | Mantener pulsado (0,45 s) |
| Usar objeto del inventario | Clic en el objeto y después clic en el destino | Igual con toques |
| Combinar dos objetos | Clic en un objeto y después en otro | Igual |
| Dar un objeto a un NPC | Objeto seleccionado y clic en el NPC | Igual |
| Soltar el objeto seleccionado | Esc o clic en el suelo | Toque en el suelo |
| Avanzar diálogo | Clic, Espacio o Intro | Toque |
| **Ollo de maquinista** | Q | Botón amarillo «OLLO» |

- **Etiqueta flotante.** Al pasar por encima de algo aparece su nombre. Las salidas se marcan en azul con «→ Lugar». Con un objeto seleccionado se lee «Usar navalla con Soporte» o «Dar ositos a Dona Concha».
- **Inventario.** Es una barra fija bajo la escena. Cada objeto tiene un icono y un nombre, y se examina con clic derecho o pulsación larga.
- **Diálogos.**
  - Un panel inferior con retrato, nombre y texto que se escribe letra a letra.
  - Martín tiene 15 caras de emoción (`mf-*.png`) que cambian según la línea.
  - Las conversaciones son árboles de opciones, como los temas de Broken Sword. Hay opciones que aparecen o desaparecen según lo que ya sabe Martín.
- **Ollo de maquinista** (sistema de pistas):
  - La escena se pone en gris y los hotspots importantes se marcan con recuadros amarillos discontinuos, con su nombre. Los ya resueltos salen en verde.
  - Dura unos segundos y se puede usar siempre.
  - En el Acto 3 es además una mecánica de historia, porque revela rastros invisibles a simple vista: grasa fresca, huellas de carbonilla, la letra de la pizarra.
- **Documentos.** Las escrituras, partes, cartas y notas se abren a pantalla completa en papel envejecido, como la escritura n.º 375 de la demo.
- **Mapa de Monforte.** Es una pantalla de viaje entre zonas, como el mapa de Broken Sword. Las zonas se van desbloqueando con la historia. Dentro de cada zona se camina de escenario en escenario por salidas que siguen las calles reales.
- **Menú.** Tiene Continuar, Nueva partida, Selector de acto (para el jurado del concurso), Opciones (texto rápido, volumen) y **Créditos y fuentes**, que es obligatorio.

## 4. Mecánicas

### 4.1 Escenarios
- Cada escenario es un fondo de 16:9 con:
  - un **polígono de suelo** por donde se puede caminar;
  - una **escala por profundidad** (Martín se hace pequeño al alejarse);
  - **hotspots** (rectángulo o polígono);
  - **NPC**;
  - **salidas**;
  - capas opcionales delante del personaje, para pasar por detrás de columnas y muebles.
- Los escenarios pueden tener **variantes de día y noche**. Por ejemplo, las cocheras en la vigilancia nocturna del Acto 3 o el andén en la salida del sábado. La variante la decide el acto o una marca de la historia, no un reloj en tiempo real.
- **Primeros planos** sin Martín, como «Mirar arriba» en el taller, para los detalles que hay que ver de cerca.

### 4.2 Tiempo e historia
- En vez del reloj del juego de mundo abierto, la historia avanza por **marcas de estado** (*flags*) dentro de cada acto.
- Los ritmos de Martín se mantienen como **escenas fijas**:
  - Champions martes y miércoles a las 20:00 en la Fraternal con el Tío David, que termina a las 23:00, hora de dormir;
  - turno de madrugada;
  - caldo del domingo en Vilatán.
- Dormir en la Casa Juana cierra el día y suele abrir el siguiente tramo: el silbato se oye por la noche.

### 4.3 Objetos
- Siempre se pueden recuperar. Si se gastan, existe otra vía.
- **Combinaciones** con sentido físico, como navaja + lata = abrir la lata, o válvula + carretilla.
- Objetos de **información**, como documentos, fotos y la carta de Remedios, que se pueden enseñar a los NPC y abren ramas de diálogo nuevas.

### 4.4 Minijuegos
Hay tres heredados del juego de mundo abierto, todos opcionales o con alternativa para quien no quiera jugarlos:
- **Natación con Mega Andrés**, estilo *Track & Field*: alternar dos teclas o botones.
- **A Volta do Castelo con Xoán.** Pasa a ser una secuencia de ritmo o de rutas por el mapa de Monforte: Malecón → praza Doutor Goyanes → praza de España → castillo → vuelta.
- **La cabina de la Mikado** (Acto 5). Es un puzzle de procedimiento: regulador, inyector, presión de 9 kg (dato de la pizarra), freno y silbato. El orden importa y el juego explica con humor qué falla.

### 4.5 Guardado
- Guardado automático en `localStorage` en cada cambio de escena y cada vez que se coge algo. Guarda la escena, la posición, el inventario y las marcas.
- **Selector de acto** en el menú, con partidas preparadas al inicio de cada acto.

## 5. Dirección de arte

- **Lienzo lógico de 960×540**, escalado a la pantalla con bandas negras si hace falta.
- **Fondos** en ilustración de estilo pixel art de 16:9, con la estética de las casas de la demo (`bg-salon.jpg`, `bg-cocina.jpg`). Los lugares reales se pintan partiendo de fotos o Street View que envía Oscar.
- Las **fotos reales**, como el taller de la Casa Juana, pueden usarse como fondo con un tratamiento (sepia, viñeta) para marcar «lugares con memoria». Es una decisión de estilo que hay que cerrar: o se pasan a ilustración, o se dejan como foto con tratamiento.
- **Personajes:**
  - Proporción realista, unas 6,5 cabezas, como el sprite actual de Martín (celdas de 150×203).
  - **Hay que unificar estilos.** Los sprites de Concha, David y Andrés son *chibi* del juego anterior y quedan grandes de cabeza al lado de Martín. Para este proyecto hay que rehacerlos con la proporción de Martín, o rehacer a Martín en chibi. Recomendación: proporción de Martín.
- **Hoja de sprites mínima por personaje:**
  - parado frente, espalda, izquierda y derecha;
  - andar lateral (6 a 8 fotogramas; el izquierdo puede ser el derecho volteado);
  - andar de frente y de espaldas (6 fotogramas cada uno);
  - hablar (2 a 4 fotogramas);
  - coger o usar (2 a 3 fotogramas).
  - Fondo transparente, todas las celdas del mismo tamaño y los pies en la misma línea.
- **Retratos:** 320×320 con las emociones de cada personaje. Martín ya tiene 15.
- **Iconos del inventario:** 48×48. En la demo se dibujan con código y se sustituirán por PNG.

### 5.1 Inventario de recursos

| Recurso | Estado |
|---|---|
| Martín: sprite (parado 4 direcciones, andar lateral, correr, saltar, señalar, interactuar) | ✅ existe (`martin-sprite.png`) |
| Martín: andar de frente y de espaldas | ❌ falta (la demo lo simula con un balanceo) |
| Martín: retrato y 15 emociones | ✅ existe |
| Fondos de la Casa Juana: salón, cocina | ✅ existe |
| Taller de la Casa Juana: 2 fotos reales | ✅ existe |
| Mural de la estación (foto real) y escena Iván + Martín ante el mural | ✅ existe |
| Iván: retrato | ✅ existe; ❌ falta su sprite de cuerpo entero |
| Concha, David, Andrés: sprites chibi | ⚠️ existen, pero hay que adaptar el estilo |
| Resto de NPC (Amparo, Eladio, Valerio, Xoán, Anxo, Remedios, Pepe, Nai) | ❌ faltan sprites y retratos dibujados (en el juego anterior eran caras generadas por código) |
| Resto de fondos | ❌ faltan (ver lista de escenarios en `03_HISTORIA_Y_PUZZLES.md`) |

## 6. Sonido

- **Leitmotiv:** el silbato «dos largos y uno corto». Suena al final de cada acto y es la última nota del juego.
- Una música por zona: estación, centro, río, castillo. Las noches, más desnudas.
- Efectos básicos: pasos sobre madera, piedra o grava; puertas; coger un objeto; abrir un documento.
- Sin voces grabadas en la primera versión.

## 7. Técnica

- **Sin dependencias ni compilación:** `index.html` + `js/engine.js` (motor) + `js/data.js` (escenas, objetos y diálogos). Al crecer, `data.js` se divide en un archivo por acto (`js/acto1.js`...).
- **Formato de escena** (resumen; detalle en el README del paquete):
  ```js
  idEscena: {
    name, bg, crop?, walk:[[x,y]...], scale:[yLejos, escalaLejos, yCerca, escalaCerca], actorH, start:[x,y], noActor?,
    onEnter: async () => {...},
    draw(ctx, t), drawFront(ctx, t),          // atrezo encima del fondo
    hotspots: [{ name, r:[x,y,w,h] | poly, at:[x,y], face, when:()=>bool,
                 look: async()=>{}, act: async()=>{}, exit:['escena',[x,y]],
                 use: { idObjeto: async()=>{} } }],
    npcs: [{ name, sheet, spec, idle, talkFrames, x, y, w, h, at, face, when,
             look, talk: async()=>{}, give: { idObjeto: async()=>{} } }]
  }
  ```
- **Guion** como funciones `async` con una API corta: `say`, `choose`, `walkTo`, `face`, `give`, `take`, `setFlag`, `flag`, `hasItem`, `goScene`, `showDoc` y `cine`.
- **Pendiente en el motor:**
  1. pathfinding con A* sobre varios polígonos (ahora se camina en línea recta dentro de un polígono);
  2. capas delanteras con recorte por profundidad;
  3. pantalla de mapa de Monforte;
  4. ollo de maquinista;
  5. audio;
  6. selector de acto;
  7. créditos y fuentes;
  8. animación de hablar para Martín;
  9. textos sobre la cabeza para comentarios breves.
- **Pruebas:** en cada entrega, una prueba automática en un navegador sin interfaz que recorre la cadena de puzzles del tramo cambiado, más capturas a 1280×720 y en móvil horizontal.
- **Publicación:** GitHub (repositorio nuevo) y artefacto web jugable, siempre en la misma URL.

## 8. Hoja de ruta

| Hito | Contenido | Estado |
|---|---|---|
| **M0 · Demo técnica** | 4 escenas de la Casa Juana; todas las mecánicas básicas; final con la cinemática del mural | ✅ hecho (paquete inicial) |
| **M1 · Motor completo** | Pathfinding, capas, mapa de Monforte, ollo, menú con créditos, selector de acto, audio | ✅ hecho (noviembre de 2026), con A1–A3 de prueba |
| **M2 · Acto 1** «O regreso» | Estación, quiosco, Casa Juana, Fraternal, Concello | — |
| **M3 · Acto 2** «O reencontro» | Farmacia, Club Fluvial, Malecón y castillo; investigación del taller | — |
| **M4 · Acto 3** «A curiosidade» | Depósito y museo, pistas, vigilancia nocturna | — |
| **M5 · Acto 4** «A implicación» | Válvula, carbón, permiso, el parte | — |
| **M6 · Acto 5** «O descubrimento» | La Mikado, la vía muerta, el mural, Vilatán (2 finales) | — |
| **M7 · Pulido para el concurso** | Arte unificado, sonido, pruebas con jugadores, créditos | — |
