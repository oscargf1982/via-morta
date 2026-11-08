'use strict';
/* ==========================================================
   VÍA MORTA · Acto 1 «O regreso» (tramo M1)
   A1 Andén 1 → A2 Vestíbulo (Iván e o mural) → A3 Praza da Estación (quiosco de Concha)
   + pantalla de mapa de Monforte.
   Fichas dos escenarios: docs/05_FICHAS_ESCENARIOS.md
   Fondos PROVISIONAIS xerados con tools/fondos.py (pendentes de fotos de Oscar).
   ========================================================== */
const IV = t => say('Iván Nogal', t);

/* ---------- obxectos novos ---------- */
Object.assign(ico, {
  xornal(c) { c.fillStyle = '#efe8d8'; c.fillRect(8, 10, 32, 28); c.fillStyle = '#2a2a2a'; c.fillRect(11, 13, 26, 5); c.fillStyle = '#8a8478'; for (let i = 0; i < 4; i++) { c.fillRect(11, 21 + i * 4, 12, 2); c.fillRect(26, 21 + i * 4, 11, 2); } },
  chaves(c) { c.fillStyle = '#9a6a3a'; c.fillRect(6, 16, 14, 18); c.fillStyle = '#f2ead8'; c.font = 'bold 8px sans-serif'; c.fillText('211', 7, 28); c.strokeStyle = '#c9c9cf'; c.lineWidth = 3; c.beginPath(); c.arc(24, 18, 5, 0, 7); c.stroke(); c.fillStyle = '#c9c9cf'; c.fillRect(27, 20, 15, 3); c.fillRect(37, 23, 3, 5); c.fillRect(30, 26, 12, 3); c.fillRect(39, 29, 3, 4); },
});
Object.assign(ITEMS, {
  xornal: { name: 'Xornal', icon: ico.xornal, look: () => MA('El periódico de hoy. En portada, obras. En deportes, el Dépor. Leo deportes primero, como un caballero.', 'sonriente') },
  chavesCasa: { name: 'Chaves da casa', icon: ico.chaves, look: () => MA('Las llaves de la Casa Juana, con un llavero de madera y un «211» pintado a mano. Parece cosa de carpintero.', 'pensativo') },
});
PORTRAIT_COLORS['Iván Nogal'] = '#d8ec2a';

/* utilidades de debuxo para letreiros (o texto vai no xogo, non no PNG) */
function signText(c, t, x, y, size, col = '#f2ead8', font = 'Georgia, serif') { c.font = `700 ${size}px ${font}`; c.textAlign = 'center'; c.fillStyle = col; c.fillText(t, x, y); c.textAlign = 'left'; }

/* ---------- A1 · Andén 1 ---------- */
const TREN = { x: 0, gone: false };
function drawTren(c) {
  if (flag('trenSaiu') && TREN.gone) return;
  const x0 = TREN.x;
  for (let k = 0; k < 3; k++) {
    const x = x0 + 160 + k * 330;
    if (x > W || x + 320 < 0) continue;
    c.fillStyle = '#e9ecef'; c.fillRect(x, 196, 320, 170); c.fillStyle = '#9aa1a8'; c.fillRect(x + 4, 186, 312, 12);
    c.fillStyle = '#7a1f5c'; c.fillRect(x, 330, 320, 12); c.fillStyle = '#c2185b'; c.fillRect(x, 342, 320, 5);
    c.fillStyle = '#26323c'; for (let i = 0; i < 5; i++) if (i !== 2) c.fillRect(x + 18 + i * 60, 226, 46, 56);
    c.fillStyle = '#b8bec4'; c.fillRect(x + 138, 218, 44, 128); c.fillStyle = '#26323c'; c.fillRect(x + 144, 226, 14, 56); c.fillRect(x + 162, 226, 14, 56);
    c.fillStyle = '#2a2a2e'; c.fillRect(x + 20, 366, 70, 8); c.fillRect(x + 230, 366, 70, 8);
    if (k === 0) { c.fillStyle = '#e9ecef'; c.beginPath(); c.moveTo(x, 196); c.lineTo(x - 30, 236); c.lineTo(x - 30, 366); c.lineTo(x, 366); c.fill(); c.fillStyle = '#26323c'; c.beginPath(); c.moveTo(x - 4, 210); c.lineTo(x - 26, 240); c.lineTo(x - 26, 280); c.lineTo(x - 4, 280); c.fill(); c.fillStyle = '#ffe9a0'; c.fillRect(x - 28, 340, 8, 6); }
  }
}
function horn() { SFX.tone(294, 0.55, 'square', 0.05); SFX.tone(370, 0.55, 'square', 0.05); SFX.tone(294, 0.7, 'square', 0.05, 0.75); SFX.tone(370, 0.7, 'square', 0.05, 0.75); }
async function introAnden() {
  TREN.x = 0; TREN.gone = false; face('F');
  await MA('Monforte de Lemos. Andén 1. Veinte años diciendo «algún día vuelvo»... y ha sido un lunes. Un lunes, encima.', 'pensativo');
  horn(); await sleep(400);
  const t0 = E.t; while (E.t - t0 < 3.6) { const k = (E.t - t0) / 3.6; TREN.x = -k * k * 1500; await sleep(16); }
  TREN.gone = true; setFlag('trenSaiu');
  face('R');
  await MA('Ahí se va el regional. Ha llegado a su hora. Que conste en acta, que no pasa todos los días.', 'risueno');
  toast('Toca para camiñar · mantén premido para mirar · OLLO amosa o importante');
}

SCENES.anden = {
  name: 'Andén 1', bg: 'img/bg-anden.png', music: 'estacion', floor: 'pedra',
  walk: [[110, 412], [955, 412], [955, 535], [30, 535], [110, 450]],
  holes: [[[512, 444], [650, 444], [650, 466], [512, 466]], [[288, 452], [330, 452], [330, 474], [288, 474]], [[708, 452], [750, 452], [750, 474], [708, 474]], [[840, 446], [876, 446], [876, 468], [840, 468]]],
  front: [
    { y: 474, r: [286, 40, 46, 432] }, { y: 474, r: [706, 40, 46, 432] },     // columnas da marquesiña
    { y: 466, r: [510, 400, 144, 64] },                                       // banco
    { y: 468, r: [842, 420, 32, 46] },                                        // papeleira
  ],
  scale: [412, 0.52, 535, 0.72], actorH: 300, start: [250, 470],
  draw(c) {
    drawTren(c);
    // reloxo e letreiro colgados da marquesiña
    c.fillStyle = '#1e2a24'; c.fillRect(858, 40, 4, 22); c.fillRect(420, 40, 4, 22); c.fillRect(616, 40, 4, 22);
    c.fillStyle = '#f4f0e4'; c.beginPath(); c.arc(860, 84, 22, 0, 7); c.fill(); c.strokeStyle = '#1e2a24'; c.lineWidth = 4; c.stroke();
    const m = (E.t / 60) % 1; c.lineWidth = 2; c.beginPath(); c.moveTo(860, 84); c.lineTo(860 + Math.sin(m * 6.28) * 16, 84 - Math.cos(m * 6.28) * 16); c.moveTo(860, 84); c.lineTo(864, 72); c.stroke();
    c.fillStyle = '#1f3a5a'; c.fillRect(396, 60, 244, 34); c.strokeStyle = '#e8e2d0'; c.lineWidth = 2; c.strokeRect(399, 63, 238, 28);
    signText(c, 'MONFORTE DE LEMOS', 518, 85, 20, '#f2ead8', '"Trebuchet MS", sans-serif');
    c.fillStyle = '#e8e2d0'; c.fillRect(40, 214, 30, 22); signText(c, '1', 55, 232, 18, '#1f3a5a', '"Trebuchet MS", sans-serif');
  },
  hotspots: [
    { name: 'Vestíbulo', key: true, poly: [[12, 184], [82, 204], [82, 430], [12, 474]], at: [118, 470], face: 'L', exit: ['vestibulo', [70, 470]], door: true,
      look: () => MA('La puerta del vestíbulo. Por ahí se sale a Monforte. O se entra, según de qué lado tengas la maleta.', 'neutro') },
    { name: 'Tren rexional', r: [100, 186, 860, 188], when: () => !TREN.gone,
      look: () => MA('El regional en el que he venido. Tres horas mirando por la ventana y ensayando qué le digo a mi madre el domingo.', 'pensativo'),
      act: () => bark('Ya me he bajado. Volver a subir sería mucho dramatismo para un lunes.') },
    { name: 'Reloxo do andén', r: [834, 58, 52, 52], look: () => MA('El reloj del andén. En una estación, el reloj no da la hora: da órdenes.', 'risueno') },
    { name: 'Letreiro', r: [394, 58, 248, 38], look: () => MA('«Monforte de Lemos». Lo he leído mil veces desde la cabina, a sesenta por hora. Parado se lee mejor. Y pesa más.', 'pensativo') },
    { name: 'Torre do castelo', r: [356, 96, 160, 54], look: () => MA('La torre del castillo de San Vicente vigilando la estación. Desde allí arriba se ve todo Monforte. Desde aquí abajo se ve, sobre todo, la cuesta.', 'sonriente') },
    { name: 'Cocheras do depósito', r: [576, 150, 370, 132], look: async () => { await MA('Las cocheras del depósito. Dicen que ahí dentro duerme la Mikado, la vieja locomotora de vapor.', 'pensativo'); await MA('Mi destino es la nave de al lado: la de las máquinas que todavía se mueven.', 'sonriente'); } },
    { name: 'Vías', r: [100, 268, 860, 100], look: () => MA('Vías y más vías. Monforte fue el gran nudo ferroviario de Galicia. Hoy sigue siendo nudo, aunque con menos cuerda.', 'pensativo') },
    { name: 'Banco', r: [512, 402, 140, 62], look: () => MA('Un banco de andén. Aquí se han despedido más gallegos que en el puerto de Vigo. Y se han reencontrado bastantes menos.', 'pensativo'),
      act: () => bark('Si me siento ahora, no me levanto hasta el regional de vuelta.') },
    { name: 'Papeleira', r: [842, 420, 32, 46], look: () => MA('Una papelera. Dentro, un billete usado a Ourense y media empanada. La empanada me mira. No.', 'esceptico') },
    { name: 'Liña amarela', r: [100, 386, 860, 16], look: () => MA('La línea amarilla. Años respetándola desde la cabina. No voy a empezar a pisarla ahora que voy a pie.', 'convencido') },
    { name: 'Columna', r: [290, 40, 38, 410], look: () => MA('Columnas de hierro fundido. Han aguantado más inviernos que yo, y están mejor pintadas.', 'risueno') },
    { name: 'Columna', r: [710, 40, 38, 410], look: () => MA('Otra columna. Si la marquesina fuese un tren, estas serían las ruedas. Y nunca descarrilan.', 'neutro') },
  ],
};

/* ---------- A2 · Vestíbulo da estación ---------- */
async function ivanTalk() {
  if (!flag('ivanCoñece')) {
    await IV('Benvido ao nó ferroviario de Galicia! Ben, ao que queda del.');
    await MA('Martín Pardo. Maquinista. Me han dado destino en el depósito.', 'sonriente');
    await IV('Iván. De apoio de Renfe, aquí na estación. Ti es o novo do depósito. Xa me falaran de ti.');
    await MA('¿Ya te habían hablado de mí? En Monforte las noticias llegan antes que los trenes.', 'dudoso');
    setFlag('ivanCoñece');
  } else await IV('Volves? Iso é que o mural engancha. Pásalle a todo o mundo. Ben, a min.');
  for (;;) {
    const opts = [
      { t: '¿Qué cuenta ese mural?', k: 'mural' },
      { t: flag('sabeCasa') ? '¿Por dónde quedaba la Casa Juana?' : 'Busco la Casa Juana. Doctor Casares, 211.', k: 'casa' },
      ...(flag('muralExplicado') ? [{ t: '¿Y tú qué haces aquí, además de saberte murales?', k: 'traballo' }] : []),
      { t: 'Me voy, que tengo que recoger unas llaves.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'mural') {
      if (flag('muralExplicado')) { await IV('Resumo: 1954, Inchaurbe, Monforte no medio. E o emigrante de Vigo, aínda esperando. Queres que cho conte outra vez dende o principio? Non? Mellor.'); continue; }
      await IV('Pintouno en 1954 Cándido Fernández Inchaurbe, delineante de Renfe na zona Noroeste. A sede estaba en León.');
      await IV('Mira: Monforte no medio, coma nó ferroviario. E sen a liña Ourense–Zamora, que daquela aínda non existía.');
      await IV('Hai un peregrino, un autocar en Curtis, un tren TAF... e un emigrante a piques de embarcar en Vigo.');
      await IV('Ese emigrante leva setenta anos esperando. Hai xente que espera máis.');
      await MA('¿Te lo sabes de memoria?', 'sorprendido');
      await IV('Restaurouno Adif a petición de Apatrigal. Eu só vin ver como quedaba. Todos os días.');
      setFlag('muralExplicado');
    }
    if (k === 'casa') {
      await IV('A casa roxa. Saes á praza e colles á dereita, á beira da gasolineira.');
      await IV('Bo balcón. Dende el vese o depósito.');
      await MA('¿Y tú cómo sabes lo que se ve desde mi balcón?', 'esceptico');
      await IV('Monforte é pequeno e eu son curioso. As chaves teñas no quiosco da praza: Dona Concha.');
      setFlag('sabeCasa');
    }
    if (k === 'traballo') {
      await IV('Axudo na estación. Información, incidencias, xente perdida. Ti, por exemplo, tes cara de perdido con dirección.');
      await IV('E conto cousas. Sabías que este vestíbulo ten corenta e dúas baldosas de ancho? Conteinas un domingo. Non me xulgues.');
      await MA('No te juzgo. Yo me sé de memoria los pitidos de todas las agujas de Valencia Nord. Cada uno con su trauma.', 'risueno');
    }
    if (k === 'adeus') {
      await IV('Vai, vai. E se de noite oes algo raro... será o vento. En Monforte hai moito vento.');
      await MA('(¿Por qué me lo ha dicho como si no hubiera viento?)', 'dudoso');
      return;
    }
  }
}
const DOC_MURAL = `<img src="img/mural-estacion.jpg" alt="Mural da estación de Monforte"><p class="sub">Mural do vestíbulo da estación de Monforte. Cándido Fernández Inchaurbe, 1954. Restaurado por Adif a petición de Apatrigal.</p>`;

SCENES.vestibulo = {
  name: 'Vestíbulo da estación', bg: 'img/bg-vestibulo.png', music: 'estacion', floor: 'pedra',
  walk: [[20, 346], [940, 346], [955, 535], [10, 535]],
  holes: [[[396, 404], [566, 404], [566, 434], [396, 434]]],
  front: [{ y: 432, r: [396, 366, 172, 66] }],
  scale: [346, 0.62, 535, 0.85], actorH: 300, start: [480, 470],
  onEnter: async () => { if (flag('vestibuloVisto')) return; setFlag('vestibuloVisto'); await bark('El vestíbulo. Huele a café de máquina y a despedida. Como siempre.'); },
  draw(c) {
    c.fillStyle = '#ffb000'; c.font = '700 10px monospace';
    ['SAÍDAS', 'OURENSE', 'LUGO', 'A CORUÑA', 'LEÓN'].forEach((t, i) => { c.fillStyle = i ? '#ffb000' : '#f2ead8'; c.fillText(t, 678, 92 + i * 7.5); });
    if (Math.floor(E.t * 2) % 2) { c.fillStyle = '#ffb000'; c.fillRect(732, 97, 4, 4); }
    c.fillStyle = '#f2ead8'; c.font = '700 13px "Trebuchet MS", sans-serif'; c.fillText('BILLETES', 64, 113);
    c.fillStyle = '#f2ead8'; c.font = '700 13px "Trebuchet MS", sans-serif'; c.fillText('SAÍDA · PRAZA', 788, 80);
    c.fillStyle = '#2a2a2e'; c.fillRect(122, 248, 0, 0);
  },
  hotspots: [
    { name: 'Mural de 1954', key: true, r: [296, 50, 372, 212], at: [480, 370], face: 'B', done: () => flag('muralExplicado'),
      look: async () => { await MA('El mural del vestíbulo: Galicia entera, con las vías en azul y Monforte en el centro, como un ombligo con estación.', 'pensativo'); await MA('Un tren, un peregrino, gente que se va... Cuando era crío pensaba que el mapa era de verdad y que el tren salía de la pared.', 'sonriente'); },
      act: async () => { await showDoc(DOC_MURAL); await MA('De cerca se ven los años. Y los retoques. Como en todos nosotros.', 'pensativo'); } },
    { name: 'Sinatura do mural', olloOnly: 'sinaturaVista', key: true, r: [346, 226, 70, 26], at: [400, 360], face: 'B',
      look: () => MA('Abajo, en una esquina, una firma: «Inchaurbe, 1954». El ojo de maquinista también sirve para leer letra pequeña. Sobre todo la de los contratos.', 'orgulloso') },
    { name: 'Taquillas', r: [16, 96, 192, 146], at: [140, 380], face: 'L',
      look: () => MA('Las taquillas. Una abierta y otra cerrada. La proporción de siempre.', 'esceptico'),
      act: () => bark('Billete ya tengo. Lo que no tengo es casa.') },
    { name: 'Panel de saídas', r: [672, 80, 74, 48], look: () => MA('El panel de salidas. Ourense, Lugo, A Coruña, León... De aquí sale uno hacia casi todas partes. Volver ya es otra cosa.', 'pensativo') },
    { name: 'Máquina de café', r: [672, 192, 52, 108], at: [690, 370], face: 'B',
      look: () => MA('Una máquina de café que promete «capuchino». Yo prometí volver pronto a Galicia y tardé veinte años. No soy quién para juzgarla.', 'avergonzado'),
      act: () => bark('Le doy un golpe cariñoso. Ni café ni cambio. Un clásico.') },
    { name: 'Extintor', r: [260, 230, 20, 48], look: () => MA('Un extintor, revisado este año. Esta estación tiene más al día los extintores que yo las revisiones del coche.', 'risueno') },
    { name: 'Carteis', r: [298, 270, 360, 30], look: () => MA('Carteles de obras, avisos y una excursión a la Ribeira Sacra con un señor sonriendo a un racimo de uvas. Muy convencido, el señor.', 'risueno') },
    { name: 'Banco', r: [398, 368, 168, 64], look: () => MA('Un banco de madera. Desgastado justo donde se sienta la gente a mirar el mural. O sea, por todas partes.', 'neutro') },
    { name: 'Praza da Estación', key: true, r: [762, 60, 182, 280], at: [850, 400], face: 'B', exit: ['praza', [812, 380]], door: true },
    { name: 'Andén 1', r: [0, 250, 44, 230], at: [36, 470], face: 'L', exit: ['anden', [130, 470]], door: true },
  ],
  npcs: [
    { id: 'ivan', name: 'Iván Nogal', key: true, sheet: 'img/ivan-sprite.png', spec: { cw: 150, ch: 240, cols: 2 }, idle: 0, talkFrames: [1, 0], x: 720, y: 404, w: 70, h: 296, at: [630, 420], face: 'R',
      done: () => flag('sabeCasa'),
      look: () => MA('Chaleco reflectante, pelo de cepillo y cara de saberse los horarios de memoria. Los de 1950, probablemente.', 'sonriente'),
      talk: () => ivanTalk(),
      give: {
        ositos: async () => { await IV('Grazas, pero non. Os ositos son de Concha: se che ve dármolos, retíranos a palabra aos dous.'); },
        xornal: async () => { await IV('Xa o lin. A esta hora xa o leu media estación. A outra media é Concha.'); },
        chavesCasa: async () => { await IV('As chaves da casa roxa. Gárdaas ben. Esa casa... ten moita historia.'); await MA('¿Qué historia?', 'dudoso'); await IV('Pregúntalle a Amparo. Ela cóntao mellor. E máis longo.'); },
      } },
  ],
};

/* ---------- A3 · Praza da Estación (quiosco de Dona Concha) ---------- */
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
      { t: '¿Qué se cuenta por Monforte?', k: 'conto' },
      { t: '¿Qué sabes de la Casa Juana?', k: 'casa' },
      { t: 'Hasta luego, Concha.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'chaves') {
      await CO('Aquí as teño. Deixounas Amparo, que leva o aluguer polos donos.');
      give('chavesCasa'); setFlag('chavesDadas');
      await CO('Pero o contrato asínao ela, eh? Está na Fraternal, xogando á brisca. E non a molestes en metade dunha man, que morde.');
      await MA('Firmar con Amparo, en la Fraternal, sin interrumpir la brisca. Apuntado. Lo de morder, también.', 'convencido');
      setFlag('objetivoContrato');
    }
    if (k === 'chaves2') {
      await CO('Perdícheslas xa? Ai, Martiño... Menos mal que Amparo me deixou outra copia. Coma se te coñecese.');
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
    if (k === 'conto') {
      await CO('Que se conta? Pois que de noite se oe un tren onde non hai tren. O tren pantasma, chámanlle.');
      await CO('A min non me mires. Eu ás once xa estou deitada. Pero o oín. Dúas veces. Ben, unha e media.');
      await MA('Un tren fantasma. En el nudo ferroviario de Galicia. Por lo menos tiene sentido del lugar.', 'esceptico');
    }
    if (k === 'casa') {
      await CO('A casa do señor Alfredo, o carpinteiro. Juana era a súa muller, e deulle o nome á casa.');
      await CO('Atrás tiña unha carpintaría que daba gusto. Dende o quiosco oíase o serrón.');
      await MA('¿Desde aquí? Pues sí que serraba fuerte el señor Alfredo.', 'sorprendido');
      await CO('Ou eu tiña bo oído. As dúas cousas. Pregúntalle a Amparo, que lle encanta contalo.');
    }
    if (k === 'adeus') { await CO('Vai, e come algo, que estás chupado.'); return; }
  }
}

/* Fondo: ilustración da praza enviada por Oscar (img/bg-praza-estacion.jpg).
   Dereita: estación (→ vestíbulo). Abaixo á esquerda: quiosco de Dona Concha.
   Esquerda ao medio: saída á segunda pantalla da praza (pendente de ficha, M2). */
SCENES.praza = {
  name: 'Praza da Estación', bg: 'img/bg-praza-estacion.jpg', music: 'estacion', floor: 'pedra',
  walk: [[190, 392], [260, 372], [470, 352], [600, 340], [700, 336], [790, 364], [960, 412], [960, 538], [0, 538], [0, 480], [186, 480]],
  holes: [[[566, 392], [628, 392], [628, 416], [566, 416]], [[486, 350], [554, 350], [554, 370], [486, 370]]],
  front: [
    { y: 414, r: [574, 66, 52, 348] },                 // farola
    { y: 368, r: [500, 250, 34, 118] },                // tronco da árbore
  ],
  // perspectiva forte: o fondo da praza queda lonxe
  scale: [350, 0.16, 540, 0.97], actorH: 300, start: [800, 420], minSpeed: 0.45,
  hotspots: [
    { name: 'Estación', key: true, r: [786, 266, 56, 100], at: [812, 380], face: 'R', exit: ['vestibulo', [850, 420]], door: true,
      look: () => MA('La puerta de la estación. Azul Renfe de toda la vida. Por ahí he salido yo con veinte años y una mochila.', 'pensativo') },
    { name: 'Estación', r: [900, 420, 60, 118], at: [930, 470], exit: ['vestibulo', [850, 420]], door: true },
    { name: 'Rótulo da estación', r: [712, 188, 248, 72], look: () => MA('«Monforte de Lemos», en letras bien grandes. Por si alguien se baja del tren creyendo que esto es Ourense.', 'risueno') },
    { name: 'Placa', r: [852, 288, 36, 32], look: () => MA('Una placa en la fachada. Desde aquí no la leo, y de cerca el bronce se ha comido la mitad de las letras.', 'esceptico') },
    { name: 'Quiosco', key: true, r: [0, 196, 182, 276], at: [262, 486], face: 'L', act: () => conchaQuiosco(),
      look: () => MA('El quiosco de Concha: chuches, cromos, revistas y la mejor red de información de Monforte. La CIA, pero con regaliz.', 'sonriente') },
    { name: 'Revistas', r: [34, 344, 140, 124], at: [262, 486], face: 'L', look: () => MA('Revistas de corazón, de motor y una de ganchillo. Concha las lee todas antes de venderlas. Control de calidad, lo llama.', 'risueno') },
    { name: 'Outra parte da praza', key: true, r: [150, 276, 112, 84], at: [236, 392], face: 'L', exit: ['__praza2'], done: () => hasItem('chavesCasa'),
      act: async () => {
        if (!hasItem('chavesCasa')) { await bark(flag('sabeCasa') ? 'Por ahí se va hacia Doctor Casares. Pero sin llaves tengo una dirección, no una casa. Concha las tiene.' : 'Por ahí sigue la plaza. Antes de irme, las llaves: Concha las tiene.'); return; }
        await fimTramo();
      } },
    { name: 'Rúa cara ao centro', key: true, r: [556, 294, 64, 34], at: [640, 350], face: 'B', exit: ['mapa'],
      look: () => MA('La calle que sube hacia el centro. Desde aquí se va a toda Monforte. Bueno, a la parte llana.', 'pensativo') },
    { name: 'Fonte', r: [250, 322, 236, 28], look: () => MA('Una fuente con su rotonda de setos. Los coches dan vueltas alrededor, el agua también. Nadie llega a ningún sitio, pero queda bonito.', 'risueno') },
    { name: 'Hotel', r: [262, 146, 186, 174], look: () => MA('Un hotel frente a la estación. Para quien llega en el último tren y no tiene una Concha que le guarde las llaves.', 'neutro') },
    { name: 'Hostal', r: [140, 112, 68, 76], look: () => MA('El hostal de la esquina. Si lo del contrato se tuerce, ya sé dónde dormir esta noche.', 'esceptico') },
    { name: 'Farola', r: [540, 66, 110, 344], look: () => MA('Una farola de dos brazos, de hierro, de las que ya no se hacen. De noche esta plaza debe parecer una foto antigua.', 'pensativo') },
    { name: 'Árbore', r: [452, 136, 136, 196], look: () => MA('Un árbol de plaza de estación. Ha visto llegar más gente que nadie y no se ha quejado nunca. Ni de las palomas.', 'sonriente') },
    { name: 'Coches', r: [604, 314, 96, 36], look: () => MA('Coches aparcados delante de la estación. Ninguno es mío: el mío tiene veinte vagones y no cabe en batería.', 'risueno') },
  ],
  npcs: [
    { id: 'conchaQ', name: 'Dona Concha', key: true, sheet: 'img/concha.png', spec: { cw: 220, ch: 385, cols: 4 }, get idle() { return E.dlg ? 4 : 6; }, talkFrames: [5, 4],
      x: 214, y: 486, w: 100, h: 250, at: [300, 492], face: 'L',
      done: () => hasItem('chavesCasa'),
      look: () => MA('Doña Concha, en la puerta de su quiosco desde que tengo memoria. Lee el periódico antes de venderlo: dice que es para comprobar que no trae erratas.', 'sonriente'),
      talk: () => conchaQuiosco(),
      give: {
        ositos: async () => { await CO('Ositos? Pero se os acabas de mercar aquí! Gárdaos, rapaz, que xa haberá ocasión de ter un detalle.'); },
        xornal: async () => { await CO('Non, non, quédao. Eu xa o lin. Dúas veces.'); },
        chavesCasa: async () => { await CO('Non mas devolvas, home! Que mo vexo: xa te arrepentiches de volver.'); await MA('No, no. Solo quería ver tu cara.', 'risueno'); },
      } },
  ],
};
async function fimTramo() {
  await MA('Las llaves en el bolsillo. Ahora, a Doctor Casares, 211. La casa roja. Allá vamos, Martín.', 'convencido');
  await showDoc('<h4>FIN DO TRAMO M1</h4><p>Martín xa ten as chaves da Casa Juana. A segunda pantalla da praza, o camiño a Doutor Casares e o resto do Acto 1 (a casa sen auga, a firma de Amparo na Fraternal e o Concello) chegarán no hito M2.</p><p class="sub">Mentres, en «Escoller acto» podes xogar a demo técnica da Casa Juana.</p>');
  face('R');
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
    { name: 'Barrio da Estación', key: true, r: [700, 340, 150, 90], exit: ['praza', [640, 360]] },
    { name: 'Centro · rúa do Cardeal', r: [490, 270, 150, 80], act: () => mapaPechado(flag('objetivoContrato') ? 'La Fraternal está en el centro: allí me espera Amparo para firmar. Pero ese camino aún está en obras.' : 'El centro. La rúa do Cardeal, la Fraternal, el Concello... Primero, las llaves de casa.', 'M2') },
    { name: 'Río Cabe · Malecón', r: [230, 300, 150, 80], act: () => mapaPechado('El Malecón, junto al Cabe. Para pasear hace falta tener casa a la que volver. Primero, instalarse.', 'M3') },
    { name: 'Castelo de San Vicente', r: [410, 110, 160, 80], act: () => mapaPechado('Subir al castillo de San Vicente el primer día. Ni en mis tiempos de cross, y eso que los ganaba todos.', 'M3') },
    { name: 'Vilatán', r: [28, 440, 230, 66], act: () => mapaPechado('Vilatán. Mi madre me espera el domingo para el caldo. Si voy hoy, me pregunta por qué no he avisado. Mejor el domingo.', 'M6') },
  ],
};
async function mapaPechado(linea, hito) { await MA(linea, 'pensativo'); toast(`Zona en construción · chega no ${hito}`); }
