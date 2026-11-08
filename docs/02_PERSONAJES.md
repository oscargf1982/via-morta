# «Vía morta» · Personajes

> Sube también al proyecto la **biblia original de Martín** que hizo Oscar (fichas, vistas y la REGLA FUNDAMENTAL sobre los diálogos). Este documento la resume y completa, pero no la sustituye.
> **Regla de voz:** Martín habla en castellano y todos los demás en gallego. Ningún personaje dice frases intercambiables con otro.

## Martín Pardo (protagonista)
- **Quién es:** maquinista de Renfe, de **Vilatán**. Tras años fuera, sobre todo en Valencia, le dan destino en el depósito de Monforte. Alquila la **Casa Juana** (Doutor Casares, 211, la casa roja junto a la gasolinera de la estación).
- **Aficiones:**
  - corredor de fondo; de chaval ganaba todos los cross escolares;
  - del **Dépor** hasta la médula;
  - respeta la **Champions**: martes y miércoles a las 20:00 en la Fraternal con el Tío Demetrio, y a las 23:00, a dormir.
- **Carácter:** retranca, humor LucasArts y observador, no detective. Se ríe de sí mismo antes que de nadie. Tiene «ojo de maquinista»: años mirando señales le hacen fijarse en lo que otros no ven.
- **Su arco:**
  - Llega pensando que Monforte está viejo y medio vacío.
  - Acaba viendo media ciudad en un andén.
  - Al final elige entre Valencia (un ascenso) y quedarse. Las dos opciones son buenas y tienen final propio.
- **Voz** (ejemplos del juego anterior):
  - «Sierra de cinta, sierra circular... Todo, por treinta mil pesetas. ¿Para qué quiere un ingeniero de Caminos una carpintería entera?»
  - «Un permiso del Concello. O sea, Eladio. Ya nos conocemos. Es como un jefe final de videojuego, pero con sello.»
  - «Grasa, silbatos y un candado nuevo. O es un fantasma muy mañoso, o aquí hay alguien trabajando a escondidas.»
- **Recursos gráficos:** `martin-sprite.png` (celdas de 150×203, 8 columnas), `martin-face.png` y `mf-{neutro, sonriente, risueno, sorprendido, dudoso, pensativo, esceptico, preocupado, convencido, orgulloso, enfadado, frustrado, aliviado, entusiasmado, avergonzado}.png`.

## Xoán Carballeira (el personaje clave)
> Antes se llamaba Iván Nogal; Oscar lo renombró el 8-11-2026. Carballeira es el apellido de su padre: el jugador no puede relacionarlo con Nogal por el nombre.
- **Lo que ve el jugador:** el de apoyo de Renfe en la estación. Es simpático y friki de la historia del tren, y se sabe el mural del vestíbulo (1954) de memoria.
- **Lo que es en realidad:**
  - Tiene 46 años y nació en Ginebra.
  - Es nieto, por parte de madre, de **Xosé Nogal** (personaje de ficción), el maquinista al que culparon de la noche del 14 de enero de 1958.
  - Lleva un año preparando en secreto, con los jubilados, la última salida de la locomotora **Mikado**. El «tren fantasma» es él.
- **Su importancia no está en lo que sabe, sino en lo que ha hecho con ello:**
  - veinte años de archivos;
  - encontrar al único testigo vivo;
  - organizar la restauración;
  - conseguir que alquilaran la casa al maquinista nuevo y silbar para él.
- **Lo que le falta:** la prueba, el parte original que escribió su abuelo, y nunca la encontró. La encuentra Martín, sin estar buscándola, en la Casa Juana.
- **Voz:** gallego, humor seco, datos y fechas a todas horas. Cuando algo le importa, habla con frases cortas. Es suizo para la puntualidad y gallego para los rodeos: nunca pide ayuda de frente.
  - «Benvido ao nó ferroviario de Galicia! Ben, ao que queda del.»
  - «Dous longos e un curto. Iso non é ningunha sinal do regulamento. Será algún graciosiño. Por certo, sabías que en 1958 o rexional das 21:30 saía dez minutos tarde todos os días?»
  - En la vía muerta deja de hablar como «el de Renfe»: «Chámome Xoán Carballeira Nogal. Son neto de Xosé Nogal...»
- **Relación con Martín:**
  1. bromas;
  2. utilidad;
  3. sospecha suave;
  4. convergencia (el parte);
  5. complicidad: en la cabina le pide que sea él quien toque el silbato.
- **Aspecto (hoja de Oscar, `assets/personajes/xoan-carballeira-hoja.png`):** pelo castaño oscuro, gafas de pasta negras, polo azul marino de manga corta, chaleco amarillo reflectante de Renfe, pantalón cargo azul marino, botas negras y reloj en la muñeca izquierda.
- **Recursos gráficos:** `xoan-sprite.png` (celdas de 112×280, 8 columnas: 0 frente, 1 espalda, 2 perfil derecha, 3 perfil izquierda, 4 tres cuartos mirando a la izquierda, 5 tres cuartos de espalda, 6 y 7 hablando de 4 y de 0) y retrato `xoan.png`. Se regeneran con `python3 tools/sprite-xoan.py`.

## Dona Concha (quiosco de la plaza de la Estación)
- Chismosa entrañable. Se acuerda de Martín de cuando venía cada lunes a por sobres de cromos del Dépor «e nunca lle saía o Djalminha».
- Tiene las llaves de la Casa Juana que le deja Rosario y conoce la historia del carpintero: «Dende o quiosco oíase o serrón».
- En el Acto 4 consigue **112 firmas** en una hora. En el Acto 5 reconoce el silbato: es como saludaba Xosé al pasar por la casa.
- **Voz:** «Ti es o rapaz de Vilatán! [...] Na túa casa daban ben de comer.»
- **Aspecto (hoja de Oscar, `assets/personajes/dona-concha-hoja.png`):** pelo castaño claro rizado recogido en coleta, pendientes de perla, sudadera morada con capucha, vaqueros y zapatillas blancas; casi siempre con el periódico en la mano.
- **Recursos gráficos:** `concha-sprite.png` (celdas de 160×280, 8 columnas: 0 frente leyendo, 1 espalda, 2 perfil derecha, 3 perfil izquierda, 4 tres cuartos derecha, 5 tres cuartos de espalda, 6 y 7 hablando de 4 y de 0, 8-13 andar a la derecha) y retrato `concha-face.png`. Se regeneran con `python3 tools/sprite-concha.py`. Las 4 expresiones y los 2 gestos de medio cuerpo de la hoja quedan como referencia.

## Rosario Higueras (la Fraternal)
> Antes se llamaba Dona Amparo; Oscar la renombró el 8-11-2026.
- **Aspecto (hoja de Oscar, `assets/personajes/rosario-higueras-hoja.png`):** melena rizada castaña, aros de plata, jersey burdeos de manga larga, vaqueros acampanados y botines marrones.
- **Recursos gráficos:** `rosario-sprite.png` (celdas de 160×280, 8 columnas: 0 frente, 1 perfil derecha, 2 espalda, 3 mano en el bolsillo, 4-6 andar a la derecha, 8 sentada con las manos en el regazo, 9 sentada gesticulando, 10 piernas cruzadas gesticulando, 11 brazos cruzados, 12 y 13 boca abierta de 8 y de 9; las sentadas llevan su silla; a la izquierda, `flip: true`) y retrato `rosario-face.png`. Se regeneran con `python3 tools/sprite-rosario.py`.
- **Quién es:** tiene 40 años, está casada con un profesor de matemáticas y tienen una hija de 9 años, **Eugenia**. Martín la tutea: no es «doña» de nadie.
- Juega a la brisca en la Fraternal: «Copas! E arrastro!». Gestiona las llaves y el alquiler de la Casa Juana para sus dueños y le firma el contrato a Martín.
- Le encanta contar la historia de la casa: el señor Alfredo, Juana, el motor Siemens, la venta de 1952. Es **prima de Xoán** por parte de padre (los Carballeira), sin sangre Nogal; pendiente de que Oscar lo confirme. Antes era su tía, pero con 40 años y él con 46 no encajaba.

## Tío Demetrio (la Fraternal)
- Compañero de Champions de Martín. Cuenta mil veces su gol al Ourense en Tercera, «un domingo de sol».
- Xoán le corrige: «Foi en mércores, Demetrio. E chovía». Le apuesta cinco euros a todo.
- **Aspecto (hoja de Oscar, `assets/personajes/tio-david-hoja.png`):** pelo cano alborotado, bigote blanco, gafas de pasta negras, polo azul claro con un escudo verde en el pecho, vaqueros oscuros con cinturón marrón y zapatos marrones.
- **Recursos gráficos:** `david-sprite.png` (celdas de 160×280, 8 columnas: 0 frente, 1 perfil derecha, 2 espalda, 3 tres cuartos derecha, 4 habla señalando, 5 brazos cruzados, 6 pensativo, 7 sonriendo, 8 neutro, 9 boca abierta de 3; mirando a la izquierda = las mismas celdas con `flip: true`) y retrato `david-face.png`. Se regeneran con `python3 tools/sprite-david.py`. No hay ciclo de andar.

## Don Eladio (ventanilla del Concello)
- Funcionario que «naceu pechando». La ventanilla 1 «agora tamén é a 3».
- En el Acto 1 cierra a las dos y se va al café. En el Acto 4 exige el modelo T-14 y cien firmas para el permiso. Revela sin querer que «un tal Nogal» ya lo pidió el mes pasado.
- Al final se ablanda: su padre era guardagujas. «Dígalle a Anxo que me garde sitio.»
- **Aspecto (hoja de Oscar, `assets/personajes/don-eladio-hoja.png`):** calvo con cuatro pelos grises a los lados, cejas fruncidas, traje marrón, camisa beige con bolígrafos en el bolsillo y corbata granate.
- **Recursos gráficos:** `eladio-sprite.png` (celdas de 160×280, 8 columnas: 0 sentado en el taburete, 1 sentado hablando, 8-15 corriendo de espaldas) y retrato `eladio-face.png`. Se regeneran con `python3 tools/sprite-eladio.py`. En la ventanilla se dibuja solo la mitad de arriba de la celda sentada.

## Valerio (farmacia, Rúa do Cardeal 23)
- Compañero de instituto de Martín. Está detrás del mostrador de su padre, con la bata de su padre y los clientes de su padre.
- Retrata el Monforte que se vacía: locales con «Se aluga» hasta que el cartel se cae de viejo. Le regala a Martín crema para las agujetas.

## Mega Andrés (Club Fluvial, chiringuito «Malo Será»)
- Filósofo de tumbona: «a vida, mellor deitado». Su abuelo era fogonero.
- Guarda sacos de carbón para el churrasco, que en el Acto 4 hacen falta para la Mikado. Reta a Martín a nadar al estilo *Track & Field*.
- **Recursos gráficos:** `andres.png` y `andres-face.png` en el juego anterior; cópialos de allí si hacen falta.

## Brais «o Galgo» (Malecón)
> Antes se llamaba Xoán; cambia de nombre para no coincidir con Xoán Carballeira.
- Rival de Martín en los cross escolares: «Iso foi un empuxón!». Ahora es fisio y entrena a los del club.
- Tiene el récord de la **Volta do Castelo**: Malecón, praza da Compañía, castillo y vuelta.

## Don Anxo Corredoira (cocheras del museo)
- Fue **fogonero** de Xosé Nogal la noche de 1958, con 17 años. Firmó el informe falso para no perder el trabajo y lleva 68 años callado.
- Ahora es uno de los jubilados que restauran la Mikado. En la vía muerta lo cuenta delante de todos.
- **Voz:** «Hai noites que mellor non lembrar.»

## Remedios (cocheras del museo)
- Jubilada del depósito y soldadora; de joven le enseñó a soldar a Pepe. Lleva la lista de piezas de la restauración.
- Sabe la frase de la carta de Xosé que cambia el Acto 4: «Deixeino onde se moven as correas, na casa onde aprendín o oficio».

## Pepe do Taller (taller de la Ford)
- Mecánico y bromista: «Non me digas que é a luz amarela».
- Guarda desde 1987 la **válvula de seguridad** de la Mikado, de 40 kg. No se la vende a «o suízo ese» porque «fala demasiado ben», pero a Martín sí, porque va de parte de Remedios.

## Nai (Vilatán)
- La madre de Martín: caldo los domingos y frases que cierran capítulos.
- «As raíces non son para quedar quieto: son para saber onde volver.»

## Xosé Nogal (ficción, solo en recuerdos y documentos)
- Maquinista del depósito en 1958. Antes de entrar en Renfe fue **aprendiz en la carpintería del señor Alfredo**, en la Casa Juana; es el «Xosé N.» de la foto de 1949.
- Avisó durante semanas de que los frenos del mercancías fallaban. La noche del 14 de enero de 1958 lo desvió a la vía muerta y lo frenó con su Mikado, y así salvó el tren de emigrantes del andén 1.
- Le echaron la culpa. Emigró a Suiza. Silbaba «dos largos y uno corto» al pasar por la Casa Juana para saludar al taller donde aprendió el oficio.
