'use strict';
/* ==========================================================
   VÍA MORTA · Acto 1 «O regreso» (tramo M1)
   A1 Andén 1 → A2 Vestíbulo (Xoán e o mural) → A3 Praza da Estación → A3b segunda pantalla (quiosco de Concha)
   → A4b Concepción Arenal (tío David) → B3 a Fraternal (Rosario) → A4 Doutor Casares, 211
   + pantalla de mapa de Monforte.
   Fichas dos escenarios: docs/05_FICHAS_ESCENARIOS.md
   Fondos PROVISIONAIS xerados con tools/fondos.py (pendentes de fotos de Oscar).
   ========================================================== */
const XO = t => say('Xoán Carballeira', t);

/* ---------- obxectos novos ---------- */
Object.assign(ico, {
  xornal(c) { c.fillStyle = '#efe8d8'; c.fillRect(8, 10, 32, 28); c.fillStyle = '#2a2a2a'; c.fillRect(11, 13, 26, 5); c.fillStyle = '#8a8478'; for (let i = 0; i < 4; i++) { c.fillRect(11, 21 + i * 4, 12, 2); c.fillRect(26, 21 + i * 4, 11, 2); } },
  boli(c) { c.save(); c.translate(24, 24); c.rotate(-0.7); c.fillStyle = '#1f4fa8'; c.fillRect(-18, -3, 30, 6); c.fillStyle = '#e8e8ec'; c.fillRect(12, -3, 6, 6); c.fillStyle = '#2a2a2a'; c.beginPath(); c.moveTo(18, -3); c.lineTo(23, 0); c.lineTo(18, 3); c.fill(); c.fillStyle = '#c9c9cf'; c.fillRect(-14, -5, 12, 2); c.restore(); },
  contrato(c) { c.fillStyle = '#f4efe2'; c.fillRect(11, 6, 26, 36); c.fillStyle = '#8a8478'; for (let i = 0; i < 5; i++) c.fillRect(15, 12 + i * 5, 18 - (i % 2) * 5, 2); c.strokeStyle = '#1f4fa8'; c.lineWidth = 2; c.beginPath(); c.moveTo(15, 38); c.bezierCurveTo(19, 32, 23, 42, 27, 35); c.lineTo(33, 37); c.stroke(); },
  chaves(c) { c.fillStyle = '#9a6a3a'; c.fillRect(6, 16, 14, 18); c.fillStyle = '#f2ead8'; c.font = 'bold 8px sans-serif'; c.fillText('211', 7, 28); c.strokeStyle = '#c9c9cf'; c.lineWidth = 3; c.beginPath(); c.arc(24, 18, 5, 0, 7); c.stroke(); c.fillStyle = '#c9c9cf'; c.fillRect(27, 20, 15, 3); c.fillRect(37, 23, 3, 5); c.fillRect(30, 26, 12, 3); c.fillRect(39, 29, 3, 4); },
});
Object.assign(ITEMS, {
  xornal: { name: 'Xornal', icon: ico.xornal, look: () => lerXornal() },
  boli: { name: 'Bolígrafo de Concha', icon: ico.boli, look: () => MA('El bolígrafo de los crucigramas de Concha. Azul, mordisqueado y con la tapa atada con una goma. Una reliquia.', 'sonriente') },
  contrato: { name: 'Contrato de aluguer', icon: ico.contrato, look: () => MA('El contrato de alquiler de la Casa Juana, firmado por Rosario y por mí. Oficialmente, vuelvo a ser de Monforte. Con papeles.', 'orgulloso') },
  chavesCasa: { name: 'Chaves da casa', icon: ico.chaves, look: () => MA('Las llaves de la Casa Juana, con un llavero de madera y un «211» pintado a mano. Parece cosa de carpintero.', 'pensativo') },
});
PORTRAIT_COLORS['Xoán Carballeira'] = '#d8ec2a';

/* utilidades de debuxo para letreiros (o texto vai no xogo, non no PNG) */
function signText(c, t, x, y, size, col = '#f2ead8', font = 'Georgia, serif') { c.font = `700 ${size}px ${font}`; c.textAlign = 'center'; c.fillStyle = col; c.fillText(t, x, y); c.textAlign = 'left'; }

/* ---------- A1 · Andén 1 ----------
   Fondo: ilustración do andén enviada por Oscar (img/bg-anden-estacion.jpg).
   O rexional está pintado no fondo: na intro queda parado na vía 1. */
function horn() { SFX.tone(294, 0.55, 'square', 0.05); SFX.tone(370, 0.55, 'square', 0.05); SFX.tone(294, 0.7, 'square', 0.05, 0.75); SFX.tone(370, 0.7, 'square', 0.05, 0.75); }
async function introAnden() {
  face('L');
  await MA('Monforte de Lemos. Andén 1. Veinte años diciendo «algún día vuelvo»... y ha sido un lunes. Un lunes, encima.', 'pensativo');
  horn(); await sleep(600);
  await MA('El regional se queda ahí, resoplando. Ha llegado a su hora. Que conste en acta, que no pasa todos los días.', 'risueno');
  setFlag('trenSaiu');
  toast('Toca para camiñar · mantén premido para mirar · OLLO amosa o importante');
}

async function portasAzuis() {
  await MA('La última vez que pasé por aquí, detrás de estas puertas había cafetería y un quiosco de revistas, aquí mismo, en la estación. Olía a café y a periódico recién llegado.', 'pensativo');
  await MA('Ahora, todo cerrado. Queda la máquina de billetes del vestíbulo, que tampoco da conversación.', 'preocupado');
}

SCENES.anden = {
  name: 'Andén 1', bg: 'img/bg-anden-estacion.jpg', music: 'estacion', floor: 'pedra',
  walk: [[0, 400], [210, 388], [300, 362], [560, 331], [634, 321], [652, 321], [800, 538], [0, 538]],
  holes: [[[448, 418], [502, 418], [502, 442], [448, 442]], [[538, 366], [572, 366], [572, 382], [538, 382]], [[490, 380], [528, 380], [528, 398], [490, 398]]],
  front: [
    { y: 440, r: [448, 104, 54, 336] },     // columna 1
    { y: 380, r: [538, 188, 34, 192] },     // columna 2
    { y: 354, r: [578, 224, 22, 130] },     // columna 3
    { y: 396, r: [490, 336, 38, 60] },      // papeleira
  ],
  // perspectiva da imaxe: a altura medra en liña recta co y (horizonte arredor de y 305)
  scale: [350, 0.22, 540, 1.13], actorH: 300, start: [600, 450], minSpeed: 0.4,
  hotspots: [
    { name: 'Vestíbulo', key: true, r: [190, 216, 48, 145], at: [214, 386], face: 'B', exit: ['vestibulo', [280, 520]], door: true,
      look: () => MA('La puerta del vestíbulo. Por ahí se sale a Monforte. O se entra, según de qué lado tengas la maleta.', 'neutro') },
    { name: 'Portas azuis', r: [0, 170, 46, 214], look: () => portasAzuis() },
    { name: 'Portas azuis', r: [296, 230, 30, 118], look: () => portasAzuis() },
    { name: 'Tren rexional', r: [650, 190, 230, 216], at: [700, 440], face: 'R',
      look: () => MA('El regional en el que he venido. Tres horas mirando por la ventana y ensayando qué le digo a mi madre el domingo.', 'pensativo'),
      act: () => bark('Ya me he bajado. Volver a subir sería mucho dramatismo para un lunes.') },
    { name: 'Letreiro', r: [214, 0, 150, 136], look: () => MA('«Monforte de Lemos». Lo he leído mil veces desde la cabina, a sesenta por hora. Parado se lee mejor. Y pesa más.', 'pensativo') },
    { name: 'Banco', r: [80, 320, 122, 64], look: () => MA('Un banco de andén. Aquí se han despedido más gallegos que en el puerto de Vigo. Y se han reencontrado bastantes menos.', 'pensativo'),
      act: () => bark('Si me siento ahora, no me levanto hasta el regional de vuelta.') },
    { name: 'Banco', r: [336, 315, 60, 34], look: () => MA('Otro banco, más al fondo. Para los que prefieren despedirse sin público.', 'neutro') },
    { name: 'Papeleira', r: [492, 338, 34, 58], look: () => MA('Una papelera. Dentro, un billete usado a Ourense y media empanada. La empanada me mira. No.', 'esceptico') },
    { name: 'Columna', r: [452, 104, 46, 312], look: () => MA('Columnas de hierro fundido con el pie azul. Han aguantado más inviernos que yo, y están mejor pintadas.', 'risueno') },
    { name: 'Columnas', r: [540, 190, 70, 170], look: () => MA('Una fila de columnas que se pierde al fondo. Si la marquesina fuese un tren, estas serían las ruedas. Y nunca descarrilan.', 'neutro') },
    { name: 'Marquesiña', r: [380, 0, 500, 110], look: () => MA('La marquesina del andén. Tablas, hierro y años. Debajo de ella ha esperado medio Monforte.', 'pensativo') },
    { name: 'Farol', r: [256, 186, 24, 32], look: () => MA('Un farol en la pared. De noche alumbra el andén para que nadie se pierda. A mí me ha costado veinte años, pero he llegado.', 'sonriente') },
    { name: 'Vías', r: [740, 400, 220, 140], look: () => MA('Vías y más vías. Monforte fue el gran nudo ferroviario de Galicia. Hoy sigue siendo nudo, aunque con menos cuerda.', 'pensativo') },
    { name: 'Liña amarela', poly: [[652, 320], [668, 320], [818, 540], [792, 540]], look: () => MA('La línea amarilla. Años respetándola desde la cabina. No voy a empezar a pisarla ahora que voy a pie.', 'convencido'), act: () => bark('Detrás de la línea amarilla. Que uno tiene una reputación.') },
    { name: 'Andén de enfronte', r: [880, 240, 80, 120], look: () => MA('El andén de enfrente, con sus farolas y el monte detrás. Desde aquí parece otro pueblo. Es el mismo, pero al otro lado de las vías.', 'pensativo') },
  ],
};

/* ---------- A2 · Vestíbulo da estación ---------- */
async function xoanTalk() {
  if (!flag('xoanCoñece')) {
    await XO('Benvido ao nó ferroviario de Galicia! Ben, ao que queda del.');
    await MA('Martín Pardo. Maquinista. Me han dado destino en el depósito.', 'sonriente');
    await XO('Xoán. De apoio de Renfe, aquí na estación. Ti es o novo do depósito. Xa me falaran de ti.');
    await MA('¿Ya te habían hablado de mí? En Monforte las noticias llegan antes que los trenes.', 'dudoso');
    setFlag('xoanCoñece');
  } else await XO('Volves? Iso é que o mural engancha. Pásalle a todo o mundo. Ben, a min.');
  for (;;) {
    const opts = [
      { t: '¿Qué cuenta ese mural?', k: 'mural' },
      { t: flag('sabeCasa') ? '¿Por dónde quedaba la Casa Juana?' : 'Busco la Casa Juana. Doctor Casares, 211.', k: 'casa' },
      ...(flag('muralExplicado') ? [{ t: '¿Y tú qué haces aquí, además de saberte murales?', k: 'traballo' }] : []),
      { t: 'Me voy, que tengo que recoger unas llaves.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'mural') {
      if (flag('muralExplicado')) { await XO('Resumo: 1954, Inchaurbe, Monforte no medio. E o emigrante de Vigo, aínda esperando. Queres que cho conte outra vez dende o principio? Non? Mellor.'); continue; }
      await XO('Pintouno en 1954 Cándido Fernández Inchaurbe, delineante de Renfe na zona Noroeste. A sede estaba en León.');
      await XO('Mira: Monforte no medio, coma nó ferroviario. E sen a liña Ourense–Zamora, que daquela aínda non existía.');
      await XO('Hai un peregrino, un autocar en Curtis, un tren TAF... e un emigrante a piques de embarcar en Vigo.');
      await XO('Ese emigrante leva setenta anos esperando. Hai xente que espera máis.');
      await MA('¿Te lo sabes de memoria?', 'sorprendido');
      await XO('Restaurouno Adif a petición de Apatrigal. Eu só vin ver como quedaba. Todos os días.');
      setFlag('muralExplicado');
    }
    if (k === 'casa') {
      await XO('A casa roxa. Saes á praza e colles á dereita, á beira da gasolineira.');
      await XO('Bo balcón. Dende el vese o depósito.');
      await MA('¿Y tú cómo sabes lo que se ve desde mi balcón?', 'esceptico');
      await XO('Monforte é pequeno e eu son curioso. As chaves teñas no quiosco da praza: Dona Concha.');
      setFlag('sabeCasa');
    }
    if (k === 'traballo') {
      await XO('Axudo na estación. Información, incidencias, xente perdida. Ti, por exemplo, tes cara de perdido con dirección.');
      await XO('E conto cousas. Sabías que este vestíbulo ten corenta e dúas baldosas de ancho? Conteinas un domingo. Non me xulgues.');
      await MA('No te juzgo. Yo me sé de memoria los pitidos de todas las agujas de Valencia Nord. Cada uno con su trauma.', 'risueno');
    }
    if (k === 'adeus') {
      await XO('Vai, vai. E se de noite oes algo raro... será o vento. En Monforte hai moito vento.');
      await MA('(¿Por qué me lo ha dicho como si no hubiera viento?)', 'dudoso');
      return;
    }
  }
}
const DOC_MURAL = `<img src="img/mural-primer-plano.jpg" alt="Martín e Xoán diante do mural da estación"><p class="sub">Mural do vestíbulo da estación de Monforte (Cándido Fernández Inchaurbe, 1954; restaurado por Adif a petición de Apatrigal). Ilustración do xogo baseada no mural real.</p>`;

/* Fondo: ilustración do vestíbulo enviada por Oscar (img/bg-vestibulo-estacion.jpg, 3:2 recortada a 16:9).
   Dereita: porta azul á praza. Esquerda, á beira do radiador: porta ao andén 1, cara á cámara. */
SCENES.vestibulo = {
  name: 'Vestíbulo da estación', bg: 'img/bg-vestibulo-estacion.jpg', crop: [0, 110, 1536, 864], music: 'estacion', floor: 'pedra',
  walk: [[232, 384], [420, 358], [625, 330], [740, 334], [960, 370], [960, 538], [246, 538], [238, 470]],
  holes: [[[646, 384], [726, 384], [726, 412], [646, 412]]],
  front: [{ y: 410, r: [646, 0, 80, 412] }],          // piar de pedra: Martín pasa por detrás
  scale: [330, 0.56, 538, 1.2], actorH: 300, start: [300, 500],
  hotspots: [
    { name: 'Andén 1', key: true, r: [0, 478, 244, 62], at: [256, 528], face: 'F', exit: ['anden', [214, 392]], door: true,
      look: () => MA('La puerta del andén, a mi espalda. Por ahí he entrado yo hace un momento, con veinte años de retraso.', 'risueno') },
    { name: 'Praza da Estación', key: true, r: [900, 126, 60, 228], at: [930, 380], face: 'R', exit: ['praza', [790, 400]], door: true,
      look: () => MA('La puerta azul que da a la plaza. Azul Renfe, para que nadie se olvide de quién es la casa.', 'sonriente') },
    { name: 'Mural de 1954', key: true, r: [494, 113, 128, 110], at: [560, 350], face: 'B', done: () => flag('muralExplicado'),
      look: async () => { await MA('El mural del vestíbulo: Galicia entera, con las vías en azul y Monforte en el centro, como un ombligo con estación.', 'pensativo'); await MA('Un tren, un peregrino, gente que se va... Cuando era crío pensaba que el mapa era de verdad y que el tren salía de la pared.', 'sonriente'); },
      act: async () => { await showDoc(DOC_MURAL); await MA('De cerca se ven los años. Y los retoques. Como en todos nosotros.', 'pensativo'); } },
    { name: 'Sinatura do mural', olloOnly: 'sinaturaVista', key: true, r: [494, 200, 40, 24], at: [540, 350], face: 'B',
      look: () => MA('Abajo, en una esquina, una firma: «Inchaurbe, 1954». El ojo de maquinista también sirve para leer letra pequeña. Sobre todo la de los contratos.', 'orgulloso') },
    { name: 'Venta de billetes', r: [110, 141, 322, 165], at: [300, 392], face: 'B',
      look: () => MA('La taquilla. Detrás del cristal, dos ordenadores y una silla vacía. Hasta la silla está de descanso.', 'esceptico'),
      act: () => bark('Billete ya tengo. Lo que me falta es casa.') },
    { name: 'Máquina de billetes', r: [440, 226, 34, 125], at: [456, 368], face: 'B',
      look: () => MA('Una máquina de billetes de Renfe. Pantalla táctil que no reconoce mi dedo. Ni mi DNI. Ni mi existencia.', 'frustrado'),
      act: () => bark('Me pide «seleccione destino». Ojalá fuera tan fácil.') },
    { name: 'Extintor', r: [478, 236, 20, 42], look: () => MA('Un extintor, revisado este año. Esta estación tiene más al día los extintores que yo las revisiones del coche.', 'risueno') },
    { name: 'Avisos', r: [494, 249, 28, 28], look: () => MA('Avisos de horarios, obras y objetos perdidos. Si alguien encuentra mis veinte años fuera, que llame.', 'pensativo') },
    { name: 'Avisos', r: [598, 249, 24, 24], look: () => MA('Otro aviso. Letra pequeña, sello grande. Burocracia ferroviaria en estado puro.', 'esceptico') },
    { name: 'Avisos', r: [795, 226, 46, 32], look: () => MA('Un plano de evacuación. «Vostede está aquí». Por lo menos alguien lo tiene claro.', 'risueno') },
    { name: 'Bancos', r: [48, 400, 180, 76], look: () => MA('Bancos de metal, fríos hasta en agosto. Desde aquí se espera mirando el mural, aunque no quieras.', 'neutro'),
      act: () => bark('Si me siento, me quedo. Y tengo unas llaves que recoger.') },
    { name: 'Papeleira', r: [92, 314, 74, 82], look: () => MA('Una papelera de acero. Dentro, un billete a Ourense y el envoltorio de un bocadillo. La arqueología de una tarde cualquiera.', 'esceptico') },
    { name: 'Radiador', r: [0, 406, 80, 70], look: () => MA('Un radiador de hierro fundido. Calienta poco, pero con convicción.', 'risueno') },
    { name: 'Radiador', r: [782, 281, 74, 60], look: () => MA('Otro radiador, este junto a la puerta. Calienta a los que se van, que son los que más frío pasan.', 'pensativo') },
    { name: 'Piar', r: [650, 6, 72, 372], look: () => MA('Un pilar de piedra sujetando las vigas desde antes de que yo naciera. Sin quejarse. Ya me gustaría a mí.', 'sonriente') },
    { name: 'Fiestra', r: [714, 156, 46, 126], look: () => MA('Por la ventana se ve la plaza y los coches aparcados. Monforte, a través de un cristal limpio.', 'neutro') },
    { name: 'Bandas amarelas', r: [418, 386, 88, 30], look: () => MA('Bandas táctiles en el suelo, para quien no ve: te llevan a la taquilla sin perderte. Ojalá hubiera unas así para volver a casa.', 'pensativo'), act: () => walkTo(462, 400) },
    { name: 'Bandas amarelas', r: [598, 451, 104, 60], look: () => MA('Más bandas táctiles. Un camino que no se pierde nunca. Envidia sana.', 'pensativo'), act: () => walkTo(650, 480) },
    { name: 'Teito', r: [90, 0, 550, 60], look: () => MA('Vigas de madera y fluorescentes. Lo antiguo sujetando lo moderno. Como en mi familia.', 'risueno') },
  ],
  npcs: [
    { id: 'xoan', name: 'Xoán Carballeira', key: true, sheet: 'img/xoan-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 4, x: 590, y: 352, w: 70, h: 296,
      // pasea polo vestíbulo (e párase diante do mural) ata que Martín vai falar con el
      patrol: { speed: 60, pause: [1.5, 4], fps: 7,
        pts: [[590, 352, 'B'], [470, 374, 'FL'], [540, 452, 'F'], [800, 432, 'FR'], [790, 352, 'B']],
        walk: { F: [8, 9, 10, 11, 12], B: [16, 17, 18, 19, 20], R: [24, 25, 26, 27, 28], L: [32, 33, 34, 35, 36], FR: [40, 41, 42, 43, 44], BR: [48, 49, 50, 51, 52] },
        idle: { F: 0, B: 1, R: 2, L: 3, FL: 4, BR: 5 }, talk: { FL: [6, 4], F: [7, 0] } },
      at() { return [this.x - 75 * npcScale(this), this.y + 12]; }, face() { return E.actor.x < this.x ? 'R' : 'L'; },
      done: () => flag('sabeCasa'),
      look: () => MA('Chaleco de Renfe, gafas de leer letra pequeña y reloj de los que no se atrasan. Tiene cara de saberse los horarios de memoria. Los de 1950, probablemente.', 'sonriente'),
      talk: () => xoanTalk(),
      give: {
        ositos: async () => { await XO('Grazas, pero non. Os ositos son de Concha: se che ve dármolos, retíranos a palabra aos dous.'); },
        xornal: async () => { await XO('Xa o lin. A esta hora xa o leu media estación. A outra media é Concha.'); },
        chavesCasa: async () => { await XO('As chaves da casa roxa. Gárdaas ben. Esa casa... ten moita historia.'); await MA('¿Qué historia?', 'dudoso'); await XO('Pregúntalle a Rosario, a da Fraternal. Ela cóntao mellor. E máis longo.'); },
      } },
  ],
};

/* ---------- Dona Concha (quiosco, en A3b) ---------- */
async function conchaQuiosco() {
  if (!flag('conchaRecoñece')) {
    await CO('Ai! Ti es o rapaz de Vilatán! O dos cromos do Dépor!');
    await MA('Martín, Concha. El mismo. Con veinte años más y todavía sin el cromo de Djalminha.', 'avergonzado');
    await CO('Nunca che saíu o Djalminha! Viñas cada luns e marchabas co fociño así. Na túa casa daban ben de comer, iso si.');
    setFlag('conchaRecoñece');
  } else await CO('Volves? Xa sabía eu que o quiosco tira. Coma un imán, pero con lambetadas.');
  for (;;) {
    const opts = [
      ...(!hasItem('chavesCasa') && !flag('chavesDadas') ? [{ t: 'Vengo a por las llaves de la Casa Juana.', k: 'chaves' }] : []),
      ...(flag('chavesDadas') && !hasItem('chavesCasa') ? [{ t: 'Concha... creo que he perdido las llaves.', k: 'chaves2' }] : []),
      ...(!hasItem('ositos') ? [{ t: 'Una bolsa de ositos, de los de siempre.', k: 'ositos' }] : []),
      ...(!hasItem('xornal') ? [{ t: 'El periódico de hoy, por favor.', k: 'xornal' }] : []),
      ...(flag('faltaBoli') && !hasItem('boli') && !flag('boliDado') && !flag('contratoAsinado') ? [{ t: '¿Me prestas un bolígrafo?', k: 'boli' }] : []),
      ...(flag('sabePalabra') && !flag('boliDado') ? [{ t: 'El siete horizontal del crucigrama: PICHICHI.', k: 'palabra' }] : []),
      { t: '¿Qué se cuenta por Monforte?', k: 'conto' },
      { t: '¿Qué sabes de la Casa Juana?', k: 'casa' },
      { t: 'Hasta luego, Concha.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'chaves') {
      await CO('Aquí as teño. Deixounas Rosario Higueras, que leva o aluguer polos donos.');
      give('chavesCasa'); setFlag('chavesDadas');
      await CO('Pero o contrato asínao ela, eh? Está na Fraternal, xogando á brisca. E non a molestes en metade dunha man, que morde.');
      await MA('Firmar con Rosario, en la Fraternal, sin interrumpir la brisca. Apuntado. Lo de morder, también.', 'convencido');
      setFlag('objetivoContrato');
    }
    if (k === 'chaves2') {
      await CO('Perdícheslas xa? Ai, Martiño... Menos mal que Rosario me deixou outra copia. Coma se te coñecese.');
      give('chavesCasa');
    }
    if (k === 'ositos') {
      await CO('Os de sempre! Un euro.');
      give('ositos');
      await MA('Un euro. Antes eran veinte duros y la bolsa parecía más grande. O tenía yo la mano más pequeña.', 'risueno');
    }
    if (k === 'xornal') {
      await CO('O xornal de hoxe. Xa o lin eu, pero vai coma novo. Só lle sei as noticias.');
      give('xornal');
    }
    if (k === 'boli') {
      await CO('O meu bolígrafo? É o dos crucigramas. Ata que non remate o de hoxe, non sae do quiosco.');
      await CO('E lévame atascada toda a mañá no sete horizontal, que é de fútbol. Eu de fútbol só sei que o Dépor fai sufrir.');
      await CO(hasItem('xornal') ? 'Mira ti no xornal, a ver se che ilumina. E se non, pregúntalle a alguén que saiba de balón.' : 'Colle un xornal e mira ti: véndoche un, ou na Fraternal sempre hai algún enriba das mesas. E pregúntalle a alguén que saiba de balón.');
      setFlag('sabeCrucigrama');
    }
    if (k === 'palabra') await crucigramaResolto();
    if (k === 'conto') {
      await CO('Que se conta? Pois que de noite se oe un tren onde non hai tren. O tren pantasma, chámanlle.');
      await CO('A min non me mires. Eu ás once xa estou deitada. Pero o oín. Dúas veces. Ben, unha e media.');
      await MA('Un tren fantasma. En el nudo ferroviario de Galicia. Por lo menos tiene sentido del lugar.', 'esceptico');
    }
    if (k === 'casa') {
      await CO('A casa do señor Alfredo, o carpinteiro. Juana era a súa muller, e deulle o nome á casa.');
      await CO('Atrás tiña unha carpintaría que daba gusto. Dende o quiosco oíase o serrón.');
      await MA('¿Desde aquí? Pues sí que serraba fuerte el señor Alfredo.', 'sorprendido');
      await CO('Ou eu tiña bo oído. As dúas cousas. Pregúntalle a Rosario, que lle encanta contalo.');
    }
    if (k === 'adeus') { await CO('Vai, e come algo, que estás chupado.'); return; }
  }
}

/* Fondo: ilustración da praza enviada por Oscar (img/bg-praza-estacion.jpg), recortada para deixar
   fóra o quiosco (o quiosco real está na segunda pantalla).
   Dereita: estación (→ vestíbulo). Esquerda ao medio: segunda pantalla da praza (praza2). */
SCENES.praza = {
  name: 'Praza da Estación', bg: 'img/bg-praza-estacion.jpg', crop: [300, 120, 1300, 731], music: 'estacion', floor: 'pedra',
  walk: [[0, 320], [96, 314], [380, 300], [480, 298], [600, 330], [780, 362], [960, 404], [960, 538], [0, 538], [0, 400], [70, 392], [30, 352], [0, 352]],
  holes: [
    [[90, 322], [150, 310], [330, 308], [384, 326], [340, 344], [110, 344]],   // fonte da rotonda
    [[386, 346], [454, 346], [454, 358], [386, 358]],                         // alcorque da árbore
    [[484, 398], [544, 398], [544, 418], [484, 418]],                         // base da farola
  ],
  front: [
    { y: 417, r: [484, 0, 62, 417] },                  // farola
    { y: 356, r: [396, 240, 40, 116] },                // tronco da árbore
  ],
  // perspectiva forte: o fondo da praza queda lonxe
  scale: [342, 0.2, 540, 1.04], actorH: 300, start: [780, 420], minSpeed: 0.45,
  hotspots: [
    { name: 'Estación', key: true, r: [758, 246, 46, 116], at: [780, 378], face: 'R', exit: ['vestibulo', [910, 400]], door: true,
      look: () => MA('La puerta de la estación. Azul Renfe de toda la vida. Por ahí he salido yo con veinte años y una mochila.', 'pensativo') },
    { name: 'Estación', r: [900, 226, 60, 134], at: [924, 412], face: 'R', exit: ['vestibulo', [910, 400]], door: true },
    { name: 'Placa', r: [832, 266, 38, 36], look: () => MA('Una placa en la fachada. Desde aquí no la leo, y de cerca el bronce se ha comido la mitad de las letras.', 'esceptico') },
    { name: 'Rótulo da estación', r: [655, 168, 300, 72], look: () => MA('«Monforte de Lemos», en letras bien grandes. Por si alguien se baja del tren creyendo que esto es Ourense.', 'risueno') },
    { name: 'Outra parte da praza', key: true, r: [0, 286, 40, 64], at: [14, 336], face: 'L', exit: ['praza2', [40, 346]],
      look: () => MA('Por ahí sigue la plaza. Si no han movido el quiosco en veinte años, Concha está a la vuelta.', 'pensativo') },
    { name: 'Rúa cara ao centro', key: true, r: [454, 272, 90, 34], at: [500, 314], face: 'B', exit: ['mapa'],
      look: () => MA('La calle que sube hacia el centro. Desde aquí se va a toda Monforte. Bueno, a la parte llana.', 'pensativo') },
    { name: 'Fonte', r: [86, 236, 300, 108], look: () => MA('Una fuente con su rotonda de setos. Los coches dan vueltas alrededor, el agua también. Nadie llega a ningún sitio, pero queda bonito.', 'risueno') },
    { name: 'Hotel', r: [100, 90, 226, 200], look: () => MA('Un hotel frente a la estación. Para quien llega en el último tren y no tiene una Concha que le guarde las llaves.', 'neutro') },
    { name: 'Hostal', r: [0, 60, 32, 92], look: () => MA('El hostal de la esquina. Si lo del contrato se tuerce, ya sé dónde dormir esta noche.', 'esceptico') },
    { name: 'Coches', r: [520, 298, 120, 42], look: () => MA('Coches aparcados delante de la estación. Ninguno es mío: el mío tiene veinte vagones y no cabe en batería.', 'risueno') },
    { name: 'Farola', r: [440, 0, 140, 398], look: () => MA('Una farola de dos brazos, de hierro, de las que ya no se hacen. De noche esta plaza debe parecer una foto antigua.', 'pensativo') },
    { name: 'Árbore', r: [330, 80, 166, 250], look: () => MA('Un árbol de plaza de estación. Ha visto llegar más gente que nadie y no se ha quejado nunca. Ni de las palomas.', 'sonriente') },
  ],
};

/* ---------- A3b · Praza da Estación, segunda pantalla (quiosco de Dona Concha) ----------
   Fondo: ilustración de Oscar (img/bg-praza-estacion-2.jpg, recortada a 16:9 sen a barra de interface).
   Esquerda: primeira pantalla da praza. Arriba: rúa Calvo Sotelo (esquerda, pechada no Acto 1),
   rúa Coruña (centro, colexio ferroviario) e rúa Concepción Arenal (dereita, a Fraternal).
   Dereita: rúa das Vacas (Martín non quere manchar os zapatos). */
/* ---------- puzzle da firma: o bolígrafo de Concha (escollido por Oscar) ----------
   Rosario non ten con que asinar → Concha só empresta o bolígrafo dos crucigramas se lle resolves
   a palabra que lle falta → está no xornal (7 horizontal, dez letras: quen conduce un tren). */
async function lerXornal() {
  if (flag('sabePalabra')) return MA('Siete horizontal: PICHICHI. Ocho letras. Lo escribiría, pero no tengo bolígrafo. Ese es justo el problema.', 'risueno');
  if (!flag('sabeCrucigrama')) return MA('El periódico de hoy. En portada, obras. En deportes, el Dépor. Leo deportes primero, como un caballero.', 'sonriente');
  await MA('Pasatiempos. Siete horizontal: «Oito letras: o máximo goleador dunha liga».', 'pensativo');
  await MA('De fútbol sé lo justo para no hacer el ridículo en la Champions. Esto es cosa del tío David.', 'dudoso');
}
async function xornalFraternal() {
  if (hasItem('xornal')) return MA('Ya tengo periódico. Dos serían acaparar, y en un bar eso está mal visto.', 'neutro');
  await MA('El periódico de la casa. Me lo llevo prestado: lo devuelvo leído, que es como se devuelven los periódicos.', 'risueno');
  give('xornal');
}
async function davidPichichi() {
  await DA('A ver... sete horizontal: «Oito letras: o máximo goleador dunha liga». Pero isto é para nenos! PICHICHI!');
  await MA('¿Pichichi?', 'dudoso');
  await DA('Pichichi, home! O que máis goles mete na liga. E aquí o tes, diante de ti: o pichichi da liga pirata de Monforte. Vinte e dous goles nunha tempada.');
  await MA('¿Veintidós? El otro día eran dieciocho.', 'esceptico');
  await DA('Daquela non contaba os de cabeza. Que tamén valen, eh!');
  await MA('Y Xoán dirá que fueron doce y que llovía.', 'risueno');
  await DA('Xoán contábaos cos dedos dunha man, e tiña frío. Cinco euros a que foron vinte e dous.');
  await MA('Pichichi. Ocho letras. A Concha le va a encantar. Y a ti, contarlo.', 'sonriente');
  setFlag('sabePalabra'); toast('Xa tes a palabra que lle falta a Concha');
}
async function crucigramaResolto() {
  await MA('Siete horizontal, Concha: PICHICHI. Ocho letras. Me lo ha chivado el mismísimo pichichi de la liga pirata de Monforte.', 'orgulloso');
  await CO('Pichichi! P, i, c, h... cabe! E eu poñendo «goleador», que tamén ten oito e non me cadraba con nada.');
  await CO('E o pichichi ese é David, non? Xa mo contou. Trinta veces. Cada vez con máis goles.');
  await CO('Toma o bolígrafo. Pero devólvemo, eh? É o da sorte: con el acertei catorce na quiniela. Ben, trece.');
  give('boli'); setFlag('boliDado');
  await MA('Un crucigrama a cambio de un bolígrafo. En Monforte, así se firman los contratos.', 'sonriente');
}
async function ruaPechada(linea, mood) { await MA(linea, mood || 'pensativo'); toast('Rúa en construción · chega nun próximo hito'); }
SCENES.praza2 = {
  name: 'Praza da Estación', bg: 'img/bg-praza-estacion-2.jpg', music: 'estacion', floor: 'pedra',
  walk: [[0, 340], [300, 340], [400, 336], [468, 322], [548, 322], [560, 312], [588, 316], [600, 330], [796, 330], [808, 312], [842, 318], [960, 340],
         [960, 538], [150, 538], [604, 466], [604, 428], [462, 366], [0, 352]],
  holes: [
    [[505, 364], [720, 368], [720, 426], [580, 432], [505, 420]],            // xardineira e sinal
  ],
  front: [
    { y: 366, poly: [[505, 330], [540, 288], [640, 280], [720, 350], [720, 430], [505, 424]] },   // xardineira
    { y: 422, r: [558, 248, 40, 176] },                                                          // sinal
  ],
  scale: [336, 0.24, 540, 0.82], actorH: 300, start: [60, 346], minSpeed: 0.45,
  hotspots: [
    { name: 'Primeira parte da praza', key: true, r: [0, 236, 36, 104], at: [12, 345], face: 'L', exit: ['praza', [36, 338]],
      look: () => MA('Por ahí vuelvo a la estación. Vengo de ella, pero así de cerca uno siempre se plantea volver a subirse al tren.', 'pensativo') },
    { name: 'Revistas', r: [116, 256, 120, 80], at: [320, 348], face: 'L', look: () => MA('Revistas de corazón, de motor y una de ganchillo. Concha las lee todas antes de venderlas. Control de calidad, lo llama.', 'risueno') },
    { name: 'Quiosco', key: true, r: [40, 206, 262, 132], at: [320, 348], face: 'L', act: () => conchaQuiosco(), done: () => hasItem('chavesCasa'),
      look: () => MA('El quiosco de Concha: chuches, cromos, revistas y la mejor red de información de Monforte. La CIA, pero con regaliz.', 'sonriente') },
    { name: 'Rúa Calvo Sotelo', r: [400, 296, 66, 38], at: [450, 338], face: 'B', exit: ['__rua'],
      act: () => bark('La calle Calvo Sotelo. Hoy no se me ha perdido nada por ahí, y bastante tengo con encontrar lo que sí se me ha perdido.') },
    { name: 'Rúa Coruña', r: [546, 284, 48, 40], at: [572, 324], face: 'B', exit: ['__rua'],
      act: () => ruaPechada('La calle Coruña, la del colegio ferroviario. Aquí hasta los colegios llevan apellido de tren.', 'sonriente') },
    { name: 'Rúa Concepción Arenal', key: true, r: [794, 270, 52, 52], at: [818, 324], face: 'B', exit: ['arenal', [90, 515]],
      look: () => MA('La calle Concepción Arenal. Por ahí está la Fraternal: el bar de la brisca, la Champions y, si todo va bien, mi contrato.', 'pensativo') },
    { name: 'Rúa das Vacas', r: [900, 326, 60, 90], at: [940, 384], face: 'R', exit: ['__rua'],
      act: () => bark('¿La calle de las Vacas? Con estos zapatos, no. Con ese nombre, prefiero no averiguar si es por historia o por costumbre.') },
    { name: 'Sinal', r: [558, 250, 40, 64], look: () => MA('Prohibido aparcar, en los dos sentidos. Por si alguien pensaba aparcar en diagonal, que también lo he visto.', 'esceptico') },
    { name: 'Xardineira', r: [505, 280, 215, 152], look: () => MA('Una jardinera con arbustos y una señal clavada en medio. Aquí hasta las plantas tienen prohibido aparcar.', 'risueno') },
    { name: 'Fonte', r: [0, 340, 604, 190], look: () => MA('Una fuente. Larga, baja, con sus chorros en fila y su agua dentro. Tiene exactamente las proporciones que tiene que tener una fuente. No se le puede pedir más.', 'convencido') },
    { name: 'Árbore', r: [316, 232, 84, 100], look: () => MA('Un árbol podado en bola, como un chupachups gigante. Muy apropiado al lado de un quiosco.', 'sonriente') },
    { name: 'Farol', r: [0, 206, 32, 136], look: () => MA('Un farol de hierro junto al quiosco. Lo justo para que Concha vea quién se acerca antes de que diga nada.', 'risueno') },
    { name: 'Edificio da esquina', r: [580, 100, 220, 230], look: () => MA('La casa de la esquina, verde clarito, con sus balcones de hierro. Una esquina con más curvas que la carretera de Ourense.', 'pensativo') },
    { name: 'Casa amarela', r: [418, 160, 132, 160], look: () => MA('La casa amarilla de los tejados rojos. Parece recién pintada para la foto, y yo sin cámara.', 'sonriente') },
    { name: 'Edificios', r: [0, 0, 412, 204], look: () => MA('Pisos con galerías y ventanas grandes. Desde ahí arriba alguien ya habrá visto que ha vuelto el de Vilatán. Mañana lo sabe medio Monforte.', 'esceptico') },
  ],
  npcs: [
    { id: 'conchaQ', name: 'Dona Concha', key: true, sheet: 'img/concha-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, get idle() { return E.dlg ? 4 : 0; }, talkFrames: [6, 4],
      x: 300, y: 342, w: 150, h: 412, at: [334, 350], face: 'L',
      done: () => hasItem('chavesCasa'),
      look: () => MA('Doña Concha, a la puerta de su quiosco desde que tengo memoria. Lee el periódico antes de venderlo: dice que es para comprobar que no trae erratas.', 'sonriente'),
      talk: () => conchaQuiosco(),
      give: {
        ositos: async () => { await CO('Ositos? Pero se os acabas de mercar aquí! Gárdaos, rapaz, que xa haberá ocasión de ter un detalle.'); },
        xornal: async () => { if (flag('sabePalabra') && !flag('boliDado')) return crucigramaResolto(); await CO(flag('sabeCrucigrama') ? 'O xornal xa o teño, rapaz. O que me falta é a palabra. Pregúntalle a alguén que saiba de balón.' : 'Non, non, quédao. Eu xa o lin. Dúas veces.'); },
        boli: async () => { await CO('Xa mo devolves? Non, non: lévao á Fraternal, que Rosario non ten con que asinar. Despois xa mo traerás.'); },
        chavesCasa: async () => { await CO('Non mas devolvas, home! Que mo vexo: xa te arrepentiches de volver.'); await MA('No, no. Solo quería ver tu cara.', 'risueno'); },
      } },
  ],
};
/* ---------- A4b · Rúa Concepción Arenal (exterior da Fraternal) ----------
   Fondo: ilustración de Oscar (img/bg-concepcion-arenal.jpg, recortada a 16:9).
   A rúa afástase cara á esquerda: seguindo recto chégase á rúa Morín (a gasolineira).
   Fóra da Fraternal está o tío David contando batallitas; se lle preguntas por Rosario, dálle paso á porta. */
const DA = t => say('Tío David', t);
async function davidTalk() {
  if (!flag('davidSauda')) {
    await DA('...e entón collo o balón no medio do campo, e... Martín?! O de Vilatán! Volviches, rapaz!');
    await MA('He vuelto, David. Y veo que el gol sigue entrando.', 'sonriente');
    await DA('Cada día un pouco mellor. Coma o viño.');
    setFlag('davidSauda');
  } else await DA('Outra vez por aquí? Iso é que che falta unha batallita.');
  for (;;) {
    const opts = [
      ...(flag('objetivoContrato') && !flag('davidAmparo') ? [{ t: '¿Has visto a Rosario Higueras?', k: 'amparo' }] : []),
      ...(flag('davidAmparo') ? [{ t: '¿Rosario sigue dentro?', k: 'amparo2' }] : []),
      ...(flag('sabeCrucigrama') && hasItem('xornal') && !flag('sabePalabra') ? [{ t: 'David, tú que sabes de fútbol: ¿me ayudas con el crucigrama?', k: 'pichichi' }] : []),
      { t: '¿Qué tal el fútbol?', k: 'gol' },
      { t: '¿Y la Champions?', k: 'champions' },
      { t: 'Hasta luego, David.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'amparo') {
      await DA('A Rosario? Dentro, na primeira mesa, coa brisca. Non levanta a vista das cartas nin para pedir.');
      await DA('Entra, entra. Pero non lle fales ata que remate a man, que despois a culpa da derrota é túa.');
      await MA('Entrar, esperar a que acabe la mano, y no tener la culpa de nada. Como en el trabajo.', 'risueno');
      setFlag('davidAmparo');
    }
    if (k === 'amparo2') await DA('Alí segue. Cando Rosario xoga, o mundo espera. E o mundo son eu, que estou aquí fóra.');
    if (k === 'gol') {
      await DA('Contei algunha vez o meu gol ao Ourense, en Terceira?');
      await MA('Alguna vez. Alguna que otra.', 'esceptico');
      await DA('Un domingo de sol. Collo o balón, un, dous, tres rivais, o porteiro no chan... e dentro! A grada tolea.');
      await MA('Xoán dice que fue un miércoles. Y que llovía.', 'risueno');
      await DA('Xoán! Cinco euros a que era domingo. Cinco euros a que había sol. E outros cinco a que Xoán nin estaba.');
      await MA('No apuesto contra un gol de Tercera. Esos goles crecen con los años, como los peces de los pescadores.', 'sonriente');
    }
    if (k === 'pichichi') await davidPichichi();
    if (k === 'champions') {
      await DA('Martes e mércores, ás oito, aquí dentro. Vés, non? Gárdoche sitio.');
      await MA('Allí estaré. Y a las once, a dormir: ni prórroga ni penaltis.', 'convencido');
      await DA('Ás once! Coma os nenos. Ben, mellor: así non ves como perdemos.');
    }
    if (k === 'adeus') { await DA('Vai, vai. E se ves a Xoán, dille que era domingo.'); return; }
  }
}
SCENES.arenal = {
  name: 'Rúa Concepción Arenal', bg: 'img/bg-concepcion-arenal.jpg', music: 'estacion', floor: 'pedra',
  walk: [[40, 336], [96, 332], [290, 388], [600, 452], [612, 420], [790, 402], [960, 412], [960, 540], [0, 540], [0, 350]],
  holes: [
    [[146, 386], [262, 386], [262, 408], [146, 408]],          // coche vermello
    [[800, 404], [960, 404], [960, 482], [822, 482]],          // mesas da terraza
    [[726, 470], [792, 470], [792, 494], [726, 494]],          // lousa
  ],
  front: [
    { y: 492, r: [726, 384, 66, 110] },                        // lousa
    { y: 482, r: [800, 360, 160, 124] },                       // mesas e cadeiras
    { y: 408, r: [138, 336, 128, 74] },                        // coche
  ],
  scale: [336, 0.05, 540, 0.78], actorH: 300, start: [90, 515], minSpeed: 0.3,
  hotspots: [
    { name: 'Praza da Estación', key: true, r: [0, 470, 110, 70], at: [50, 524], face: 'F', exit: ['praza2', [818, 330]],
      look: () => MA('De vuelta a la plaza de la estación. Concha, el quiosco y la fuente de proporciones perfectas.', 'pensativo') },
    { name: 'Rúa Morín', r: [36, 282, 66, 56], at: [70, 340], face: 'L', exit: ['morin', [430, 500]], hint: 'U',
      look: () => MA('Siguiendo recto se llega a la calle Morín, la de la gasolinera, y de ahí a Doctor Casares. Hoy no necesito gasolina: he venido en tren.', 'risueno') },
    { name: 'Porta da Fraternal', key: true, r: [646, 282, 56, 140], at: [672, 438], face: 'B', exit: ['__fraternal'], done: () => flag('davidAmparo'),
      act: async () => {
        if (!flag('objetivoContrato')) { await bark('La Fraternal. Ahora no tengo nada que hacer dentro. Primero, las llaves de casa: las tiene Concha, en el quiosco.'); return; }
        if (!flag('davidAmparo')) { await bark('¿Estará Rosario dentro? No quiero entrar a ciegas en mitad de una brisca. El tío David está en la puerta: él lo sabrá.'); return; }
        SFX.door(); await goScene('fraternal', [590, 266]);
      },
      look: () => MA('La puerta de la Fraternal. Por aquí han entrado más goles de Champions que en muchos estadios.', 'sonriente') },
    { name: 'Lousa', r: [726, 384, 66, 110], look: () => MA('Una pizarra con el menú escrito a tiza. Leo «caldo» y luego la letra se rinde. Como yo a estas horas.', 'risueno') },
    { name: 'Fiestras da Fraternal', r: [296, 236, 254, 160], look: () => MA('Detrás del cristal, mesas, sillas y alguien con las cartas pegadas al pecho. Aquí la brisca se juega con la seriedad de una final.', 'pensativo') },
    { name: 'Toldo', r: [292, 186, 264, 60], look: () => MA('«La Fraternal», en el toldo verde. Hay bares que tienen nombre y bares que tienen apellido. Este tiene las dos cosas.', 'sonriente') },
    { name: 'Rótulo do cine', r: [688, 86, 146, 72], look: () => MA('«CINE», en rojo y en mayúsculas. No dice qué ponen. En Monforte, eso ya es suspense.', 'risueno') },
    { name: 'Terraza', r: [800, 350, 160, 134], look: () => MA('Mesas de terraza bajo el soportal. Aquí se puede tomar algo al aire libre sin que te llueva encima. En Galicia, eso es un lujo.', 'convencido') },
    { name: 'Coche vermello', r: [138, 336, 128, 74], look: () => MA('Un coche rojo aparcado delante. Tiene pinta de ser de alguien que solo ha bajado un momento. Hace tres horas.', 'esceptico') },
    { name: 'Varandas', r: [270, 0, 560, 190], look: () => MA('Balcones con balaustres blancos sobre fachada azul. Desde ahí arriba se debe oír cada gol que se canta abajo.', 'pensativo') },
    { name: 'Edificios', r: [70, 40, 200, 290], look: () => MA('Casas de colores calle abajo, una detrás de otra. Monforte, en fila y bien peinada.', 'sonriente') },
  ],
  npcs: [
    { id: 'david', name: 'Tío David', key: true, sheet: 'img/david-sprite.png', spec: { cw: 160, ch: 280, cols: 8 },
      get idle() { return E.dlg ? 3 : 5; }, talkFrames: [4, 9, 3, 7],
      x: 556, y: 468, w: 90, h: 290, at: [480, 470], face: 'R',
      done: () => flag('davidAmparo') || !flag('objetivoContrato') && flag('davidSauda'),
      look: () => MA('El tío David, en la puerta de la Fraternal. Si pasas cerca, te cuenta su gol al Ourense. Si pasas lejos, también, pero más alto.', 'risueno'),
      talk: () => davidTalk(),
      give: {
        ositos: async () => { await DA('Ositos? Eu son de cacahuetes, rapaz. Os ositos son para os nenos e para Concha.'); },
        xornal: async () => { if (flag('sabeCrucigrama') && !flag('sabePalabra')) return davidPichichi(); await DA('A páxina de deportes xa a sei de memoria. E aínda non saio eu.'); },
        chavesCasa: async () => { await DA('As chaves da casa de Alfredo? Gárdaas ben, que Rosario cóntaas.'); },
      } },
  ],
};
/* ---------- B3 · A Fraternal (interior) ----------
   Fondo: ilustración de Oscar (img/bg-fraternal.jpg). Barra á esquerda, mesas de brisca, columna, tele co fútbol,
   tragaperras á dereita. Saída á rúa Concepción Arenal polas portas de cristal do fondo.
   Rosario Higueras xoga á brisca na primeira mesa, á dereita (sentada, co sprite da folla de Oscar). */
const RO = t => say('Rosario Higueras', t);
async function rosarioBrisca() {
  if (flag('contratoAsinado')) {
    await RO('Xa es veciño oficial, Martín. Agora só che falta poñerlle auga á casa. Pero iso xa é cousa do Concello.');
    return;
  }
  if (!flag('amparoMan')) {
    await RO('Copas! E arrastro!');
    await MA('¿Rosario? Perdona. Soy Martín, el del alquiler de la Casa Juana. Concha me ha dado las llaves y...', 'avergonzado');
    await RO('Shhh! Non ves que estou na metade da man? Ata que non remate, nin o Papa. E ti non es o Papa.');
    await MA('Concha me lo avisó. David me lo avisó. Y aun así. Soy el único de Monforte que interrumpe una brisca.', 'avergonzado');
    setFlag('amparoMan');
    await sleep(700);
    await RO('...E sete de ouros. Man gañada! Agora si, rapaz: o contrato. Asinamos e listo.');
  }
  if (hasItem('boli')) return asinarContrato();
  if (!flag('faltaBoli')) {
    await RO('Tes bolígrafo?');
    await MA('¿Yo? Vengo de un tren, no de una notaría.', 'esceptico');
    await RO('Eu tampouco. O meu levouno o meu home, que corrixe exames de matemáticas. E o de reserva, Eugenia, para debuxar. Ten nove anos e xa me rouba o material.');
    await RO('Concha, a do quiosco, ten sempre un, para os crucigramas. Pero non o empresta nin á súa nai.');
    setFlag('faltaBoli');
    return;
  }
  await RO('Sen bolígrafo non hai firma. Concha ten un, o dos crucigramas. Ponlle boa cara.');
}
async function asinarContrato() {
  await RO('O bolígrafo de Concha! Como o conseguiches? Ese non o solta nin para asinar o testamento.');
  await MA('Un crucigrama. Ocho letras: pichichi. Me lo resolvió el tío David y me lo va a recordar el resto de mi vida.', 'orgulloso');
  await RO('Asina aquí... e aquí. Listo. Benvido á Casa Juana, veciño.');
  take('boli'); give('contrato'); setFlag('contratoAsinado');
  await RO('O bolígrafo xa llo devolvo eu a Concha, que paso polo quiosco. Senón, mañá sae no xornal: «Desaparece o bolígrafo dos crucigramas».');
  await RO('Sabes de quen era a casa? Do señor Alfredo Fernández, carpinteiro e industrial. Púxolle o nome pola súa segunda muller, Juana.');
  await RO('Atrás tiña unha carpintaría mecanizada: un motor Siemens de dez cabalos, transmisións con poleas... Daquela era coma unha fábrica.');
  await RO('E o dous de xuño do cincuenta e dous vendeuno todo, toda a maquinaria, por trinta mil pesetas. A un enxeñeiro de Camiños e a un contratista.');
  await MA('¿Un ingeniero de Caminos? ¿Para qué quiere un ingeniero de Caminos una carpintería entera?', 'dudoso');
  await RO('Iso pregúntome eu. O meu home, que é de matemáticas, di que a conta non lle sae. Pero el di iso de todo.');
  await MA('Contrato, llaves y una pregunta. Ahora sí: a casa. Doctor Casares, 211, por la calle Morín.', 'convencido');
  toast('Novo obxectivo: ir á Casa Juana (rúa Doutor Casares)');
}
SCENES.fraternal = {
  name: 'A Fraternal', bg: 'img/bg-fraternal.jpg', music: 'casa', floor: 'pedra',
  walk: [[222, 250], [430, 236], [520, 212], [610, 212], [860, 222], [880, 260], [830, 330], [820, 540], [160, 540], [172, 470], [222, 350]],
  holes: [
    [[428, 352], [700, 350], [700, 476], [560, 492], [460, 492], [428, 470]],   // mesa da fronte e cadeiras
    [[440, 280], [522, 280], [522, 306], [440, 306]],                           // columna
    [[214, 256], [378, 256], [378, 308], [214, 308]],                           // mesas da esquerda
    [[654, 262], [812, 262], [812, 330], [654, 330]],                           // mesas da dereita
    [[524, 214], [650, 214], [650, 250], [524, 250]],                           // mesas do medio
    [[700, 396], [770, 396], [770, 440], [700, 440]],                           // Rosario e a súa cadeira
  ],
  front: [
    { y: 488, r: [428, 296, 276, 200] },                 // mesa da fronte, cadeiras e xornal
    { y: 306, r: [438, 0, 86, 306] },                    // columna
    { y: 330, r: [650, 190, 166, 142] },                 // mesas da dereita
    { y: 308, r: [212, 200, 170, 110] },                 // mesas da esquerda
  ],
  scale: [212, 0.18, 540, 0.85], actorH: 300, start: [590, 266], minSpeed: 0.4,
  hotspots: [
    { name: 'Rúa Concepción Arenal', key: true, r: [520, 82, 76, 128], at: [590, 262], face: 'B', exit: ['arenal', [672, 446]], door: true,
      look: () => MA('La puerta a la calle. Fuera, el tío David seguirá metiendo el gol al Ourense. Ya va por el décimo.', 'risueno') },
    { name: 'Lista de prezos', r: [20, 44, 82, 66], look: () => MA('Café, 1,20. Cerveza, 1,80. Precios de bar de los de antes. Aquí la inflación entra, pero se sienta y pide un café.', 'sonriente') },
    { name: 'Cafeteira', r: [0, 158, 66, 54], look: () => MA('Una cafetera de las de verdad, con su vapor y su ruido. Como una locomotora, pero de las que te despiertan.', 'risueno') },
    { name: 'Botellas', r: [0, 108, 40, 50], look: () => MA('Botellas en fila. Las de abajo, para diario. Las de arriba, para cuando gana el equipo. Están llenas.', 'esceptico') },
    { name: 'Barra', r: [0, 212, 176, 328], look: () => MA('La barra de la Fraternal. Si esta madera hablase, sabría más de fútbol que la radio.', 'pensativo') },
    { name: 'Taburetes', r: [80, 262, 140, 210], look: () => MA('Taburetes de barra. Uno está más gastado que los demás: alguien lleva media vida sentándose en el mismo.', 'sonriente') },
    { name: 'Tele', r: [724, 76, 70, 50], look: () => MA('Fútbol en la tele, sin volumen. Aquí no hace falta: los comentarios los pone la clientela, y gratis.', 'risueno') },
    { name: 'Tragaperras', r: [818, 200, 142, 340], look: () => MA('Una tragaperras. Mucha luz, mucho ruido y ninguna prisa por devolver nada.', 'esceptico') },
    { name: 'Xornal e baralla', r: [506, 300, 130, 58], at: [600, 500], face: 'B',
      act: () => xornalFraternal(),
      look: () => MA('Un periódico y una baraja en la misma mesa. El kit completo de la tarde gallega. Solo falta quien se queje del tiempo.', 'sonriente') },
    { name: 'Aviso', r: [494, 140, 24, 40], look: () => MA('Un aviso en la columna, en letra pequeña. Desde aquí solo leo «prohibido». Para un bar, me basta.', 'esceptico') },
    { name: 'Cadros', r: [94, 80, 330, 60], look: () => MA('Cuadros de montes y castillos. Uno se parece a Monforte, si lo miras con cariño y sin gafas.', 'pensativo') },
    { name: 'Lousa', r: [108, 158, 34, 46], look: () => MA('Otra pizarra con letra de tiza. Aquí todo se escribe a mano, como debe ser.', 'sonriente') },
    { name: 'Planta', r: [232, 120, 46, 90], look: () => MA('Una planta que ha sobrevivido a cientos de goles cantados a gritos. Es la socia más dura del bar.', 'risueno') },
  ],
  // Rosario, sentada á dereita da primeira mesa (a das cartas); a cadeira vén no sprite
  npcs: [
    { id: 'rosario', name: 'Rosario Higueras', key: true, sheet: 'img/rosario-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, flip: true,
      get idle() { return flag('amparoMan') ? 11 : 8; }, talkFrames: [13, 9], x: 735, y: 430, w: 110, h: 330, at: [790, 470], face: 'L',
      done: () => flag('contratoAsinado'),
      look: () => MA('Rosario Higueras, en la primera mesa, la de las cartas. Rizos, aros de plata y cara de llevar triunfos. Juega a la brisca como otros pilotan aviones: sin pestañear.', 'pensativo'),
      talk: () => rosarioBrisca(),
      give: {
        boli: async () => { if (!flag('amparoMan')) return rosarioBrisca(); await asinarContrato(); },
        chavesCasa: async () => { await RO('As chaves quédaas ti, home. Eu só quero a firma. E que non me interrompas a brisca.'); },
        xornal: async () => { await RO('Xa o lin. E o crucigrama déixollo a Concha, que se non, non me fala.'); },
        ositos: async () => { await RO('Ositos? Para Eugenia, que lle encantan. Ben... para Eugenia e para min.'); },
      } },
  ],
};
/* ---------- A4c · Rúa Morín ----------
   Fondo: ilustración de Oscar (img/bg-rua-morin.jpg). A rúa sobe cara ao fondo; á esquerda casas baixas de tella,
   á dereita a casa pistacho con galerías. Arriba → Doutor Casares (a casa vermella); abaixo → volta cara á Fraternal.
   Ao pasar preto da porta da casa pistacho, Martín ve unha sombra negra moverse dentro (de momento, nada máis). */
SCENES.morin = {
  name: 'Rúa Morín', bg: 'img/bg-rua-morin.jpg', music: 'casa', floor: 'pedra',
  walk: [[0, 452], [150, 420], [330, 376], [396, 344], [440, 344], [560, 386], [700, 420], [790, 450], [960, 500], [960, 540], [0, 540]],
  holes: [
    [[492, 402], [580, 402], [580, 426], [492, 426]],          // coche azul
    [[462, 362], [520, 362], [520, 386], [462, 386]],          // coches do fondo
    [[322, 384], [338, 384], [338, 392], [322, 392]],          // farola
  ],
  front: [
    { y: 425, r: [488, 360, 94, 68] },                         // coche azul
    { y: 386, r: [438, 330, 84, 58] },                         // coches do fondo
    { y: 391, r: [320, 118, 20, 274] },                        // farola
  ],
  scale: [340, 0.08, 540, 0.7], actorH: 300, start: [430, 500], minSpeed: 0.3,
  zones: [
    { r: [600, 400, 260, 90], enter: () => {
      if (!flag('sombraVista')) { setFlag('sombraVista'); bark('¿Eh? A través de esa puerta... una sombra negra. Se ha movido dentro. Juraría que se ha movido.', 'Martín', 4500); }
      else bark('Otra vez esa puerta. No miro. No miro... He mirado.', 'Martín', 3000);
    } },
  ],
  hotspots: [
    { name: 'Rúa Doutor Casares', key: true, r: [392, 300, 56, 44], at: [418, 350], face: 'B', exit: ['casares', [120, 500]],
      look: () => MA('Calle arriba se llega a Doctor Casares. A la casa roja. A mi casa, si Rosario firma.', 'pensativo') },
    { name: 'Cara á Fraternal', key: true, r: [300, 514, 260, 26], at: [430, 530], face: 'F', exit: ['arenal', [70, 342]],
      look: () => MA('Por ahí abajo vuelvo hacia la Fraternal.', 'pensativo') },
    { name: 'Porta da casa pistacho', key: true, r: [700, 268, 50, 166], at: [700, 440], face: 'R',
      act: () => bark(flag('sombraVista') ? 'Llamar no voy a llamar. No después de lo de la sombra.' : 'No tengo nada que hacer en esta casa. Que yo sepa.'),
      look: () => MA(flag('sombraVista') ? 'Cristal labrado y, detrás, oscuridad. Hace un momento algo negro se movió ahí dentro. Ahora, nada. Y eso es peor.' : 'Una puerta con cristal labrado. Detrás no se ve gran cosa.', flag('sombraVista') ? 'preocupado' : 'pensativo') },
    { name: 'Casa pistacho', r: [520, 0, 440, 400], look: () => MA('Una casa color pistacho, con galerías y balcones de hierro. Elegante. Y con una puerta que no me quita ojo.', 'dudoso') },
    { name: 'Coches', r: [438, 330, 144, 98], look: () => MA('Coches aparcados en fila. El azul está tan limpio que deja en evidencia a toda la calle.', 'risueno') },
    { name: 'Farola', r: [320, 118, 90, 274], look: () => MA('Otra farola de brazo largo. En esta zona todas se asoman a ver quién pasa.', 'sonriente') },
    { name: 'Portas de madeira', r: [124, 276, 96, 124], look: () => MA('Puertas de madera de las de antes, con la pintura cansada. Detrás de esas, por lo menos, no se mueve nada.', 'esceptico') },
    { name: 'Casas baixas', r: [0, 150, 330, 300], look: () => MA('Casas bajas, con teja y paredes desconchadas. El Monforte de toda la vida, puerta con puerta con el de ahora.', 'pensativo') },
  ],
};
/* ---------- A4 · Rúa Doutor Casares, 211 (exterior da Casa Juana) ----------
   Fondo: ilustración de Oscar (img/bg-doutor-casares.jpg). A casa vermella co balcón de ferro e tres portas
   en arco; á dereita, o muro vermello do patio (detrás, a nave da carpintaría); á esquerda, unha nave de chapa.
   Ao fondo, a rúa segue cara ao Gadis. Chégase dende a rúa Morín (confirmado por Oscar). */
SCENES.casares = {
  name: 'Rúa Doutor Casares', bg: 'img/bg-doutor-casares.jpg', music: 'casa', floor: 'pedra',
  walk: [[0, 350], [180, 336], [300, 330], [340, 342], [480, 368], [600, 386], [730, 410], [960, 452], [960, 540], [0, 540]],
  holes: [
    [[402, 352], [444, 352], [444, 362], [402, 362]],          // banco
    [[380, 362], [396, 362], [396, 370], [380, 370]],          // farola
  ],
  front: [
    { y: 362, r: [400, 322, 46, 42] },                         // banco e xardineira
    { y: 369, r: [340, 92, 58, 278] },                         // farola
  ],
  scale: [330, 0.15, 540, 0.88], actorH: 300, start: [120, 500], minSpeed: 0.35,
  hotspots: [
    { name: 'Rúa Morín', key: true, r: [0, 440, 120, 100], at: [60, 515], face: 'F', exit: ['morin', [418, 352]],
      look: () => MA('Por ahí vuelvo hacia la calle Morín y la Fraternal.', 'pensativo') },
    { name: 'Rúa cara ao centro', r: [180, 300, 120, 40], at: [240, 342], face: 'B', exit: ['__rua'],
      act: () => ruaPechada('La calle sigue hacia el centro. Hoy ya he visto bastante Monforte para un lunes.', 'pensativo') },
    { name: 'Porta da Casa Juana', key: true, r: [654, 236, 70, 176], at: [690, 424], face: 'B', exit: ['__casa'], done: () => flag('contratoAsinado'),
      act: async () => {
        if (!hasItem('chavesCasa')) { await bark('Cerrada, claro. Las llaves las tiene Concha, en el quiosco de la plaza.'); return; }
        if (!flag('contratoAsinado')) { await bark('Tengo las llaves, pero sin contrato firmado sería entrar como un ladrón con permiso. Primero, Rosario, en la Fraternal.'); return; }
        await fimTramo();
      },
      look: () => MA('La puerta de casa. Madera vieja, cristal labrado y una cerradura que pide aceite. Mi puerta, si todo va bien.', 'pensativo') },
    { name: 'Portalón', r: [548, 242, 76, 150], at: [586, 424], face: 'B', act: () => bark(hasItem('chavesCasa') ? 'La llave no entra: este portalón es del taller y lleva años atrancado. La de la casa es la puerta de la derecha, la del arco, junto al muro.' : 'Atrancado. Y sin llaves, ni lo intento.'), look: () => MA('Un portalón de madera de dos hojas, con cartel de vado. Por aquí salían los tablones. Ahora no sale ni el gato.', 'pensativo') },
    { name: 'Porta estreita', r: [494, 252, 34, 120], at: [512, 424], face: 'B', act: () => bark(hasItem('chavesCasa') ? 'Pruebo la llave... nada. Esta no es. La de la casa es la de la derecha del todo.' : 'Cerrada. Sin llaves, todas las puertas son iguales.'), look: () => MA('Otra puerta, más estrecha. Esta casa tiene más puertas que yo excusas. Y yo tengo muchas.', 'risueno') },
    { name: 'Balcón', r: [478, 132, 248, 92], look: () => MA('El balcón de hierro forjado. Dicen que desde ahí arriba se ve el depósito. Para un maquinista, eso son vistas al mar.', 'sonriente') },
    { name: 'Casa Juana', r: [470, 20, 380, 400], act: () => bark('Para entrar, la puerta de la derecha: la del arco, junto al muro rojo.'), look: () => MA('La casa roja. Doctor Casares, 211. Fachada de las de antes, con molduras y balcón de hierro. La pintura es nueva; las grietas, de siempre.', 'pensativo') },
    { name: 'Muro vermello', key: true, r: [770, 160, 190, 290], look: () => MA('Un muro rojo y alto, con la pintura cuarteada. Detrás debe de estar el patio... y la nave de la carpintería del señor Alfredo.', 'dudoso') },
    { name: 'Nave de chapa', r: [340, 130, 132, 210], look: () => MA('Una nave moderna de chapa al lado de la casa. Al lado de la casa roja parece un táper junto a una tarta.', 'risueno') },
    { name: 'Banco', r: [400, 320, 46, 42], look: () => MA('Un banco con jardinera. Ideal para sentarse a esperar a que te abran la puerta de tu propia casa.', 'esceptico') },
    { name: 'Farola', r: [340, 92, 58, 276], look: () => MA('Una farola de brazo largo, asomada a la calle como una vecina al balcón.', 'sonriente') },
    { name: 'Supermercado', r: [0, 236, 160, 110], look: () => MA('Un supermercado al fondo de la calle. Bien: si la casa no tiene agua, al menos sé dónde comprar botellas.', 'risueno') },
    { name: 'Tapa de sumidoiro', r: [300, 436, 60, 22], look: () => MA('Una tapa de alcantarilla. Mira: agua en Monforte hay. Por debajo, pero hay.', 'risueno') },
    { name: 'Edificios', r: [0, 0, 190, 236], look: () => MA('Pisos con galerías y miradores. En cada ventana, alguien que ya sabe que ha llegado el nuevo de la casa roja.', 'esceptico') },
  ],
};
async function fimTramo() {
  await MA('Doctor Casares, 211. Llaves en una mano, contrato en la otra. Para ser lunes, no está mal.', 'convencido');
  await showDoc('<h4>FIN DO TRAMO</h4><p>Martín chega á Casa Juana con chaves e contrato. Dentro agárdao unha casa sen auga; o Concello, Eladio e o resto do Acto 1 chegarán no hito M2.</p><p class="sub">Mentres, en «Escoller acto» podes xogar a demo técnica da Casa Juana.</p>');
}

/* ---------- Mapa de Monforte (pantalla de viaxe entre zonas) ---------- */
const ZONAS = [
  { id: 'estacion', name: 'Barrio da Estación', x: 760, y: 380, open: () => true },
  { id: 'centro', name: 'Centro · rúa do Cardeal', x: 560, y: 300, open: () => false },
  { id: 'rio', name: 'Río Cabe · Malecón', x: 300, y: 330, open: () => false },
  { id: 'castelo', name: 'Castelo de San Vicente', x: 486, y: 160, open: () => false },
];
SCENES.mapa = {
  name: 'Mapa de Monforte', bg: 'img/bg-mapa.png', noActor: true, music: 'mapa', hideName: true,
  draw(c, t) {
    c.fillStyle = '#5a3d1e'; c.font = '700 26px Georgia, serif'; c.fillText('MONFORTE DE LEMOS', 34, 52);
    c.font = 'italic 14px Georgia, serif'; c.fillText('mapa ilustrado · non está a escala', 36, 72);
    for (const z of ZONAS) {
      const on = z.open(), pulse = on ? 3 * Math.sin(t * 4) : 0;
      c.fillStyle = on ? '#c0221c' : '#8a7a5a'; c.beginPath(); c.arc(z.x, z.y, 12 + pulse, 0, 7); c.fill();
      c.strokeStyle = '#f6ecd0'; c.lineWidth = 3; c.stroke();
      c.font = '700 17px Georgia, serif'; c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = '#f6ecd0';
      const ty = z.y < 200 ? z.y - 22 : z.y + 34; c.strokeText(z.name, z.x, ty); c.fillStyle = on ? '#3a2410' : '#7a6a4a'; c.fillText(z.name, z.x, ty);
      if (!on) { c.font = 'italic 13px Georgia, serif'; c.strokeText('(aínda non)', z.x, ty + 17); c.fillText('(aínda non)', z.x, ty + 17); }
      c.textAlign = 'left';
    }
    c.fillStyle = '#efe2bfcc'; c.fillRect(28, 440, 230, 66); c.strokeStyle = '#8a6a40'; c.lineWidth = 2; c.strokeRect(28, 440, 230, 66);
    c.fillStyle = '#5a3d1e'; c.font = 'italic 14px Georgia, serif'; c.fillText('Fóra do mapa:', 42, 464); c.font = '700 18px Georgia, serif'; c.fillText('Vilatán (casa da nai)', 42, 490);
  },
  hotspots: [
    { name: 'Barrio da Estación', key: true, r: [700, 340, 150, 90], exit: ['praza', [600, 420]] },
    { name: 'Centro · rúa do Cardeal', r: [490, 270, 150, 80], act: () => mapaPechado(flag('objetivoContrato') ? 'La Fraternal está en el centro: allí me espera Rosario para firmar. Pero ese camino aún está en obras.' : 'El centro. La rúa do Cardeal, la Fraternal, el Concello... Primero, las llaves de casa.', 'M2') },
    { name: 'Río Cabe · Malecón', r: [230, 300, 150, 80], act: () => mapaPechado('El Malecón, junto al Cabe. Para pasear hace falta tener casa a la que volver. Primero, instalarse.', 'M3') },
    { name: 'Castelo de San Vicente', r: [410, 110, 160, 80], act: () => mapaPechado('Subir al castillo de San Vicente el primer día. Ni en mis tiempos de cross, y eso que los ganaba todos.', 'M3') },
    { name: 'Vilatán', r: [28, 440, 230, 66], act: () => mapaPechado('Vilatán. Mi madre me espera el domingo para el caldo. Si voy hoy, me pregunta por qué no he avisado. Mejor el domingo.', 'M6') },
  ],
};
async function mapaPechado(linea, hito) { await MA(linea, 'pensativo'); toast(`Zona en construción · chega no ${hito}`); }
