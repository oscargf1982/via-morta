# Vía morta · aventura gráfica

Aventura point & click de Martín Pardo en Monforte de Lemos. Este paquete trae el motor, una demo jugable de 4 escenas y los documentos del proyecto.

## Cómo empezar el Proyecto en Claude
1. Crea un Proyecto nuevo llamado **«Vía morta · aventura gráfica»**.
2. En **Instrucciones**, pega el contenido de `docs/00_INSTRUCCIONES_DEL_PROYECTO.md`.
3. En **Conocimiento del proyecto**, sube:
   - `docs/01_DOCUMENTO_DE_DISENO.md`
   - `docs/02_PERSONAJES.md`
   - `docs/03_HISTORIA_Y_PUZZLES.md`
   - `docs/04_HECHOS_REALES_Y_FICCION.md`
   - la biblia original de Martín (la ficha que hiciste tú);
   - opcional: una o dos imágenes de referencia de estilo, como `img/bg-salon.jpg` o `img/cine-mural.jpg`.
4. Abre la primera conversación del proyecto, adjunta este zip y escribe algo así:

> Te adjunto el paquete inicial de «Vía morta». Crea el repositorio `oscargf1982/via-morta` en GitHub, sube el contenido del zip y publica la demo como artefacto jugable. Después empezamos el hito M1 (motor completo) según el documento de diseño.

## Probar la demo en tu ordenador
Abre `index.html` con un servidor local; si lo abres con doble clic, algunos navegadores bloquean las imágenes. Por ejemplo: `python3 -m http.server` en esta carpeta, y después http://localhost:8000.

**Tramo M1 (Acto 1, «Nova partida»):**
1. En el andén, entra en el vestíbulo.
2. Habla con Xoán (opcional): el mural y la Casa Juana.
3. Sal a la plaza y habla con Concha: pídele las llaves (y, si quieres, ositos y el periódico).
4. Ve a la Rúa Doutor Casares (derecha) con las llaves: fin del tramo.
- Con el botón **OLLO** (o Q) se marcan las cosas importantes. En el vestíbulo, el ollo descubre la firma del mural.
- El plano de la plaza abre el **mapa de Monforte**.

**Solución de la demo técnica (M0, en «Escoller acto»):**
1. Habla con Concha y pregúntale por la nave.
2. Dale los ositos y te da la llave del taller.
3. En la cocina, coge la navaja del cajón.
4. Usa la llave en la puerta del patio.
5. En el taller, mira el cajón (escritura de 1952), la foto y las huellas, y pulsa en la viga para «mirar arriba».
6. Usa la navaja en el séptimo soporte y conseguirás la lata.
7. Combina la navaja con la lata y conseguirás el parte de 1958.
8. Dale el parte a Concha.

## Estructura
```
index.html          interfaz (lienzo, inventario, diálogo, documentos, cinemática, menú, aviso de girar)
js/engine.js        motor: escenas, caminos A*, capas, ollo, bocadillos, inventario, diálogos, sonido, menú, guardado
js/cinematica.js   cinemática de inicio «Dous longos e un curto» (dibujada por código; CINE.frame(t) para capturas)
js/data.js          común: retratos, objetos, demo de la Casa Juana, selector de actos (ACTS) y créditos
js/acto1.js         Acto 1: andén, vestíbulo, plaza y mapa de Monforte
tools/fondos.py     genera el mapa provisional (python3 tools/fondos.py)
tools/sprite-xoan.py genera el sprite y el retrato de Xoán desde assets/personajes/
tools/html-unico.py empaqueta todo en un único HTML con las imágenes dentro
img/                fondos (bg-*), sprites y retratos de Martín, Concha, Xoán, mural
assets/personajes/  hojas de personaje originales (referencia)
docs/               documentos del proyecto
```

## Añadir un escenario (resumen)
```js
SCENES.quiosco = {
  name: 'Praza da Estación', bg: 'img/bg-praza-estacion.jpg',
  walk: [[100,420],[900,420],[950,538],[40,538]],   // polígono por donde se camina (lienzo de 960×540)
  scale: [420, 0.7, 540, 1], actorH: 300,           // tamaño de Martín según la profundidad
  hotspots: [
    { name: 'Estación', r: [0,100,60,400], at: [80,480], exit: ['vestibulo', [880,480]] },
    { name: 'Xornal', r: [500,300,60,40], at: [520,450], face: 'B',
      look: () => MA('El periódico de hoy. El Lemos perdió. Normal.', 'esceptico'),
      act: async () => { give('xornal'); await MA('Me lo llevo. Para el crucigrama.'); } },
  ],
  npcs: [ /* ver Dona Concha en data.js */ ],
};
```
Novedades del motor (M1):
- `walk` puede ser un polígono o una lista de polígonos; `holes: [poly, ...]` son obstáculos. El camino se calcula solo.
- `front: [{ y, r | poly }]`: capas delanteras. Tapan a quien tenga una `y` menor (está detrás).
- Hotspots y NPC: `key: true` los marca con el ollo; `done: () => bool` los pone en verde; `olloOnly: 'marca'` solo existen con el ollo hasta que se descubren.
- `bark(texto, quien)`: comentario breve sobre la cabeza, sin panel. `music: 'estacion' | 'casa' | 'mapa'` y `floor: 'pedra' | 'madeira' | 'grava'` por escena. `SFX.whistle()` toca el silbato.
- Si un hotspot tiene `act` y `exit`, manda `act` (salidas con condición).

Las líneas de Martín se escriben con `MA(texto, emoción)`. Las emociones posibles son: neutro, sonriente, risueno, sorprendido, dudoso, pensativo, esceptico, preocupado, convencido, orgulloso, enfadado, frustrado, aliviado, entusiasmado y avergonzado.

## Créditos de la demo
- Fotos del taller de la Casa Juana: Oscar.
- Mural de la estación (1954): Cándido Fernández Inchaurbe; restaurado por Adif a petición de Apatrigal.
- Historia de la Casa Juana: datos reunidos por Oscar. La trama del parte de 1958 es ficción.
