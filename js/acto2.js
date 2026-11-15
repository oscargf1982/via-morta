'use strict';
/* ==========================================================
   VÍA MORTA · Acto 2 «O reencontro» (versión intermedia elixida por Oscar, 14-11-2026)
   Martes: primeiro turno (candado novo) → Concha reparte os encargos → Valerio (farmacia do Cardeal)
   e Mega Andrés (Club Fluvial), en calquera orde → Champions na Fraternal → segunda noite (o asubío vén do taller).
   Mércores: a chave do taller (Concha, a cambio dun detalle: os ositos) → o taller e as cinco pistas → FIN DO ACTO 2.
   Sen Brais nin a Volta do Castelo. Fichas: docs/05_FICHAS_ESCENARIOS.md, sección «Acto 2».
   Fondos PROVISIONAIS (tools/fondos-acto2.py): rúa do Cardeal, farmacia e Club Fluvial, ata que cheguen as ilustracións de Oscar.
   Martín fala en castelán; os NPC, en galego; a interface, en galego.
   ========================================================== */
const VA = t => say('Valerio', t);
const AN = t => say('Mega Andrés', t);
Object.assign(PORTRAIT_COLORS, { 'Valerio': '#9fe0b0', 'Mega Andrés': '#ffd27a' });

/* ---------- obxectos novos ---------- */
Object.assign(ico, {
  crema(c) { c.fillStyle = '#e8f0f4'; c.beginPath(); c.moveTo(10, 14); c.lineTo(34, 14); c.lineTo(38, 40); c.lineTo(14, 40); c.closePath(); c.fill(); c.fillStyle = '#1aa860'; c.fillRect(18, 22, 12, 4); c.fillRect(22, 18, 4, 12); c.fillStyle = '#3a6aa8'; c.fillRect(34, 8, 8, 10); },
});
Object.assign(ITEMS, {
  crema: { name: 'Crema de agulletas', icon: ico.crema, look: () => MA('Crema para las agujetas, «de muestra». Huele a pino, a vestuario de instituto y a derrota digna.', 'risueno') },
});

/* ---------- personaxes provisionais (debuxados por código ata que Oscar mande as follas) ---------- */
function figura(c, x, y, h, o, talking, t) {
  const u = h / 10, bob = Math.sin(t * 2) * u * 0.05;
  c.save(); c.translate(x, y - bob);
  c.fillStyle = o.pernas; c.fillRect(-1.1 * u, -3.6 * u, 0.9 * u, 3.6 * u); c.fillRect(0.2 * u, -3.6 * u, 0.9 * u, 3.6 * u);
  c.fillStyle = '#2a2420'; c.fillRect(-1.3 * u, -0.4 * u, 1.2 * u, 0.4 * u); c.fillRect(0.1 * u, -0.4 * u, 1.2 * u, 0.4 * u);
  c.fillStyle = o.corpo; c.beginPath(); c.moveTo(-1.8 * u, -3.4 * u); c.lineTo(1.8 * u, -3.4 * u); c.lineTo(1.5 * u, -7.4 * u); c.lineTo(-1.5 * u, -7.4 * u); c.closePath(); c.fill();
  if (o.detalle) o.detalle(c, u);
  c.fillStyle = '#e8b896'; c.fillRect(-0.4 * u, -8 * u, 0.8 * u, 0.7 * u);
  c.beginPath(); c.ellipse(0, -8.8 * u, 1.05 * u, 1.2 * u, 0, 0, 7); c.fill();
  c.fillStyle = o.pelo; c.beginPath(); c.ellipse(0, -9.5 * u, 1.1 * u, 0.6 * u, 0, Math.PI, 0); c.fill();
  c.fillStyle = '#222'; c.fillRect(-0.5 * u, -9 * u, 0.2 * u, 0.2 * u); c.fillRect(0.3 * u, -9 * u, 0.2 * u, 0.2 * u);
  c.fillStyle = '#7a3a2a'; const m = talking ? (Math.floor(t * 8) % 2 ? 0.35 : 0.1) : 0.08; c.fillRect(-0.3 * u, -8.3 * u, 0.6 * u, m * u);
  c.restore();
}
const VALERIO_LOOK = { pernas: '#3a3e52', corpo: '#f4f4f0', pelo: '#3a2a20',
  detalle(c, u) { c.fillStyle = '#c8ccd0'; c.fillRect(-0.1 * u, -7.4 * u, 0.2 * u, 4 * u); c.fillStyle = '#1aa860'; c.fillRect(0.6 * u, -6.8 * u, 0.6 * u, 0.6 * u); } };
// Andrés, deitado na súa tumboa: camisa de flores, lentes de sol
function andresDeitado(c, x, y, h, talking, t) {
  const u = h / 10; c.save(); c.translate(x, y);
  c.fillStyle = '#c8701e'; c.fillRect(-7 * u, -0.6 * u, 12.5 * u, 0.5 * u); c.fillRect(-6.5 * u, -0.1 * u, 0.4 * u, 1.4 * u); c.fillRect(4.6 * u, -0.1 * u, 0.4 * u, 1.4 * u);
  c.fillStyle = '#f09640'; c.fillRect(-7 * u, -1 * u, 12.5 * u, 0.6 * u); c.beginPath(); c.moveTo(-7 * u, -1 * u); c.lineTo(-8.4 * u, -3.4 * u); c.lineTo(-7.6 * u, -3.6 * u); c.lineTo(-6.2 * u, -1 * u); c.fill();
  c.fillStyle = '#3a6aa8'; c.fillRect(-1 * u, -1.6 * u, 3.6 * u, 1 * u);
  c.fillStyle = '#e8b896'; c.fillRect(2.6 * u, -1.5 * u, 2.4 * u, 0.7 * u);
  c.fillStyle = '#e85a3a'; c.beginPath(); c.ellipse(-2.2 * u, -1.6 * u, 2.4 * u, 1.3 * u, -0.25, 0, 7); c.fill();
  c.fillStyle = '#ffd23a'; for (const [a, b] of [[-3, -1.9], [-1.6, -1.2], [-2.4, -2.4]]) { c.beginPath(); c.arc(a * u, b * u, 0.3 * u, 0, 7); c.fill(); }
  c.fillStyle = '#e8b896'; c.beginPath(); c.arc(-5 * u, -2.8 * u, 1.05 * u, 0, 7); c.fill();
  c.fillStyle = '#5a3a20'; c.beginPath(); c.arc(-5.3 * u, -3.4 * u, 0.9 * u, Math.PI, 0); c.fill();
  c.fillStyle = '#111'; c.fillRect(-5.6 * u, -3.1 * u, 1.3 * u, 0.4 * u);
  c.fillStyle = '#7a3a2a'; c.fillRect(-5.2 * u, -2.4 * u, 0.6 * u, (talking ? (Math.floor(t * 8) % 2 ? 0.35 : 0.1) : 0.08) * u);
  c.restore();
}

/* ---------- C2 · cinemática do primeiro turno (martes) ----------
   Fondo pendente de ilustración de Oscar (exterior das cocheras co candado novo); mentres, a portada da rotonda. */
const ZOOM_COCHERAS = { x: 0.5, y: 0.2, z: 2.2 };
async function primeiroTurno() {
  E.act = 'acto2';
  await cine('img/portada-rotonda.jpg', [
    'Martes, 6:40. Primeiro turno no depósito de Monforte.',
    'Martín: «Café de máquina, un compañero que no habla hasta las ocho... y la Mikado ahí, en su rotonda, mirándome como un perro viejo al que nadie saca a pasear.»',
    'Martín: «Las cocheras del museo llevan años cerradas con una cadena oxidada. Hoy tienen, además, un candado nuevo. Brillante. De los caros.»',
    'Martín: «Nadie le pone un candado de cuarenta euros a una puerta que no se abre. A no ser que alguien la abra.»',
    'Martes, 15:10. Fin do turno.',
  ], ZOOM_COCHERAS);
  setFlag('a2Inicio');
  await goScene('praza');
  await MA('Primer turno superado. Y los gemelos, destrozados: lo de subirme ayer a la silla del Concello me ha dejado las piernas de un señor de ochenta años.', 'frustrado');
  await MA('Hoy toca saludar a los de siempre. Y para saber dónde anda todo el mundo en Monforte no hace falta GPS: hace falta Concha.', 'sonriente');
  toast('Novo obxectivo: falar con Concha, no quiosco da praza');
}

/* ---------- fin do Acto 1 → comeza o Acto 2 sen pasar polo menú ---------- */
const FIN_ACTO1 = '<h4>FIN DO ACTO 1 · «O regreso»</h4><p>Martín xa vive na Casa Juana: chaves, contrato, auga para mañá... e un asubío que, polo visto, ten enderezo.</p><p>Segue o Acto 2, «O reencontro».</p>';

/* ---------- A3b · Concha no Acto 2 ---------- */
async function conchaActo2() {
  if (!flag('a2ConchaSauda')) {
    await CO('Martiño! Que tal a primeira noite na casa roxa? Tes cara de non durmir. Cara de tren pantasma, teño eu oído.');
    await MA('Dormir, dormí. Entre silbato y silbato.', 'esceptico');
    setFlag('a2ConchaSauda');
  } else await CO(flag('silbato2') ? 'Ti outra vez? Xa sabía eu que o quiosco tira.' : 'Volves? Isto é peor ca un vicio.');
  for (;;) {
    const opts = [
      { t: flag('objValerio') ? '¿Algo más que contar?' : '¿Qué se cuenta hoy?', k: 'conto' },
      ...(!flag('a2Candado') ? [{ t: '¿Sabes algo del candado nuevo de las cocheras del museo?', k: 'candado' }] : []),
      ...(flag('silbato2') && !hasItem('chave') && !flag('tallerAberto') ? [{ t: '¿Me dejas la llave del taller de atrás?', k: 'chave' }] : []),
      ...(flag('silbato2') && hasItem('ositos') && !hasItem('chave') && !flag('tallerAberto') ? [{ t: '(Darle los ositos.)', k: 'detalle' }] : []),
      ...(!hasItem('ositos') ? [{ t: 'Una bolsa de ositos, de los de siempre.', k: 'ositos' }] : []),
      ...(!hasItem('xornal') ? [{ t: 'El periódico de hoy, por favor.', k: 'xornal' }] : []),
      { t: 'Hasta luego, Concha.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'conto') {
      if (!flag('objValerio')) {
        await CO('Que se conta? Pois que Valerio, o da farmacia do Cardeal, preguntou por ti. Que se volviches, que pases, que non che cobra.');
        await CO('E Mega Andrés, o do chiringuito do Fluvial, anda dicindo por aí que lle debes unha revancha de natación dende o instituto.');
        await MA('¿Una revancha? Le gané yo. Por una brazada. Él dice que fue salida nula.', 'risueno');
        await CO('Pois arregládeo na auga. Eu dende aquí non vexo a piscina, pero vou saber quen gañou antes ca vós.');
        setFlag('objValerio'); setFlag('objAndres');
        toast('Novo obxectivo: Valerio (mapa, Centro, rúa do Cardeal) e Andrés (mapa, Río Cabe)');
      } else if (flag('silbato2')) {
        await CO('Que se conta? Que onte á noite volveu soar o tren pantasma. E que a ti viuse baixar ao patio en pixama. De raias.');
        await MA('¿Quién me ha visto? ¡Si eran las tantas!', 'avergonzado');
        await CO('En Monforte sempre hai alguén mirando. Eu non. Eu só escoito.');
      } else {
        await CO('Que se conta? Que o martes hai Champions e Demetrio xa anda contando o gol ao Ourense para quentar.');
        await CO(flag('valerioFeito') && flag('andresFeito') ? 'Xa viches a Valerio e a Andrés? Ben. Agora á Fraternal, que Demetrio gárdache o tamborete.' : 'E non te esquezas de Valerio e de Andrés, que despois a culpa é miña.');
      }
    }
    if (k === 'candado') {
      await MA('Concha, en las cocheras del museo hay un candado nuevo. ¿Sabes de quién es?', 'pensativo');
      await CO('Un candado novo? Nas cocheras? Ai, iso non o sabía.');
      await CO('...Xa o sei. Grazas, rapaz. Para mañá sábeo medio Monforte.');
      await MA('Fantástico. He venido a buscar información y he acabado repartiéndola.', 'risueno');
      setFlag('a2Candado');
    }
    if (k === 'chave') {
      await CO('A chave da nave? Xa cho dixen: esa non se lle dá a calquera. A esa chave hai que lle ter un detalle.');
      await MA('Un detalle. Para Concha. Algo dulce... que se venda en un quiosco...', 'pensativo');
      if (!hasItem('ositos')) await CO('E non me mires así, que eu non che vou dicir o que me gusta. Pero vendo moitas cousas.');
    }
    if (k === 'detalle') return conchaChaveTaller();
    if (k === 'ositos') {
      await CO('Os de sempre! Un euro.');
      give('ositos');
      await MA(flag('silbato2') ? 'Un euro. Y ahora, con toda la ceremonia, se los regalo a ella. Un circuito comercial perfecto.' : 'Un euro, como ayer. Esta vez no me los como en el camino. Bueno, solo uno.', 'risueno');
    }
    if (k === 'xornal') { await CO('O xornal de hoxe. Xa o lin, pero vai coma novo.'); give('xornal'); }
    if (k === 'adeus') { await CO('Vai, vai. E pecha ben de noite.'); return; }
  }
}
async function conchaChaveTaller() {
  take('ositos');
  await CO('Ositos! Para min? Ai, rapaz, que detalle...');
  await CO('...Mercados aquí. Co meu cambio. Pero o detalle é o detalle.');
  await MA('Técnicamente te estoy devolviendo tus propios ositos. Con intereses: me he comido uno.', 'risueno');
  await CO('Toma a chave da nave. É de ferro, das de antes. Ti es o primeiro que ma pide en anos.');
  await CO('E pecha ao saír, que ese taller ten moita historia e pouca porta.');
  give('chave'); setFlag('chaveTaller');
  await MA('El primero en años. Entonces, quien encendió anoche la luz del taller... no usa llave.', 'dudoso');
  toast('Novo obxectivo: abrir o taller (patio da Casa Juana)');
}
{ // a función do Acto 1 queda para o luns; dende o martes fala a de arriba
  const conchaA1 = conchaQuiosco;
  conchaQuiosco = () => flag('fimActo1') ? conchaActo2() : conchaA1();
  const N = SCENES.praza2.npcs.find(n => n.id === 'conchaQ'), H = SCENES.praza2.hotspots.find(h => h.name === 'Quiosco');
  const feitoA2 = () => flag('objValerio') && (!flag('silbato2') || hasItem('chave') || flag('tallerAberto'));
  const d1 = N.done; N.done = () => flag('fimActo1') ? feitoA2() : d1();
  const d2 = H.done; H.done = () => flag('fimActo1') ? feitoA2() : d2();
  const ositosA1 = N.give.ositos;
  N.give.ositos = () => flag('fimActo1') && flag('silbato2') && !hasItem('chave') && !flag('tallerAberto') ? conchaChaveTaller()
    : flag('fimActo1') ? CO(flag('silbato2') ? 'Ositos para min? Agora non, rapaz. Gárdaos para cando me pidas algo.' : 'Os ositos? Gárdaos, que aínda non me pediches nada. E eu sei esperar.') : ositosA1();
}

/* ---------- Mapa no Acto 2 ---------- */
{
  ZONAS.find(z => z.id === 'rio').open = () => flag('objAndres');
  const M = SCENES.mapa.hotspots, centro = M.find(h => h.name === 'Centro · Concello'), rio = M.find(h => h.name === 'Río Cabe · Malecón'), castelo = M.find(h => h.name === 'Castelo de San Vicente');
  const centroA1 = centro.act;
  centro.act = async () => {
    if (!flag('fimActo1') || !flag('objValerio')) return centroA1();
    const o = [{ t: 'A la rúa do Cardeal: la farmacia de Valerio.', k: 'cardeal' }, { t: 'Al Concello.', k: 'concello' }, { t: 'Mejor me quedo en el mapa.', k: 'no' }];
    const k = o[await choose(o)].k;
    if (k === 'cardeal') return goScene('cardeal', [60, 470]);
    if (k === 'concello') return goScene('concelloExt', [90, 360]);
  };
  const rioA1 = rio.act;
  rio.act = () => flag('objAndres') ? goScene('fluvial', [60, 500]) : rioA1();
  const casteloA1 = castelo.act;
  castelo.act = () => flag('fimActo1') ? mapaPechado('El castillo de San Vicente, otro día. Hoy mis gemelos no suben ni a una silla. Y ya sé lo que pasa cuando me subo a una silla.', 'próximo hito') : casteloA1();
}

/* ---------- B1 · Rúa do Cardeal (fondo provisional) ---------- */
SCENES.cardeal = {
  name: 'Rúa do Cardeal', bg: 'img/bg-cardeal.jpg', music: 'estacion', floor: 'pedra',
  walk: [[0, 392], [960, 392], [960, 540], [0, 540]],
  holes: [[[200, 412], [370, 412], [370, 476], [200, 476]]],
  scale: [392, 0.62, 540, 0.95], actorH: 300, start: [60, 470], minSpeed: 0.5,
  draw(c, t) {
    const a = 0.55 + 0.45 * Math.abs(Math.sin(t * 2.2));   // neón da cruz verde
    c.save(); c.globalAlpha = a; c.shadowColor = '#2aff8a'; c.shadowBlur = 22; c.fillStyle = '#3aff96'; c.fillRect(604, 180, 20, 56); c.fillRect(586, 198, 56, 20); c.restore();
    c.fillStyle = '#f4f0e0'; c.fillRect(424, 198, 132, 30); c.strokeStyle = '#1a6a3a'; c.lineWidth = 2; c.strokeRect(424, 198, 132, 30);
    signText(c, 'FARMACIA', 490, 221, 20, '#1a6a3a', '"Trebuchet MS", sans-serif');
    for (const x of [95, 855]) { c.fillStyle = '#f4f0e0'; c.fillRect(x - 46, 316, 92, 30); c.strokeStyle = '#c0221c'; c.lineWidth = 2; c.strokeRect(x - 46, 316, 92, 30); signText(c, 'SE ALUGA', x, 337, 14, '#c0221c', '"Trebuchet MS", sans-serif'); }
  },
  hotspots: [
    { name: 'Mapa', key: true, r: [0, 400, 40, 140], at: [30, 480], face: 'L', exit: ['mapa'], hint: 'L',
      look: () => MA('Por ahí vuelvo hacia el resto de Monforte. A pie, que el coche se lo llevó Valencia.', 'pensativo') },
    { name: 'Farmacia', key: true, done: () => flag('valerioFeito'), r: [450, 276, 80, 104], at: [490, 404], face: 'B', exit: ['farmacia', [90, 470]], door: true,
      look: () => MA('La farmacia del padre de Valerio, número 23. El mismo toldo de rayas de cuando veníamos a por caramelos de eucalipto que no nos tocaban.', 'sonriente') },
    { name: 'Cruz verde', r: [580, 176, 66, 64], look: () => MA('La cruz verde de neón, parpadeando. De crío pensaba que era una señal de vía libre. En cierto modo lo es: vía libre a la aspirina.', 'risueno') },
    { name: 'Toldo', r: [392, 228, 196, 36], look: () => MA('Toldo de rayas rojas y blancas. Si lo pintasen de otro color, medio Monforte se perdería buscando la farmacia.', 'sonriente') },
    { name: 'Locais baleiros', r: [30, 290, 130, 90], look: () => MA('«Se aluga». Y el cartel, tan viejo que ya está para que lo alquilen a él.', 'pensativo') },
    { name: 'Outro local', r: [790, 290, 130, 90], look: () => MA('Otro «Se aluga». En esta calle había una tienda de discos, una mercería y un videoclub. Ahora hay carteles. Y eco.', 'pensativo') },
    { name: 'Bar', r: [200, 290, 160, 120], look: () => MA('Un bar con terraza. La calle del Cardeal siempre fue de bares. Algunas cosas en Monforte no cierran: se jubilan detrás de la barra.', 'risueno') },
    { name: 'Farolas', r: [140, 200, 40, 230], look: () => MA('Farolas de las de bola. A esta hora apagadas, ahorrando para la noche.', 'neutro') },
    { name: 'Lousas', r: [400, 440, 400, 100], look: () => MA('Losas de calle peatonal, con alguna suelta que hace «clonc». La conozco: la pisaba adrede volviendo del instituto.', 'sonriente') },
    { name: 'Fachadas', r: [0, 30, 960, 200], look: () => MA('Fachadas de colores con balcones. Alguien me está mirando desde un visillo. Mañana lo sabe Concha. Esta tarde, quizá.', 'esceptico') },
  ],
};

/* ---------- B2 · Farmacia (fondo provisional) ---------- */
async function valerioTalk() {
  if (!flag('valerioSauda')) {
    await VA('Martín Pardo! Non me digas! O do cross! Pasa, pasa, que dende as once non entra ninguén... agás os de sempre.');
    await MA('Valerio. Con bata. Eres clavado a tu padre.', 'sonriente');
    await VA('É a bata do meu pai. E o mostrador do meu pai. E os clientes do meu pai, os que quedan.');
    await VA('E ti que tes nas pernas? Entraches andando coma un home de oitenta anos.');
    await MA('Una silla del Concello, un reloj de bar y veinte años sin correr. Tengo los gemelos de un señor de ochenta años. Uno de los dos, de noventa.', 'avergonzado');
    await VA('Toma, crema de agulletas. De mostra, que se a pago eu, fáiseme falta a min.');
    give('crema'); setFlag('valerioSauda'); setFlag('valerioFeito');
    await MA(flag('faltaCrema') ? 'Crema para las agujetas. Andrés, prepárate: el de Vilatán vuelve al agua.' : 'Crema para las agujetas. Gratis. En Monforte aún quedan cosas que funcionan como antes.', 'orgulloso');
    comprobarChampions();
  } else await VA('Outra vez por aquí? Iso é que che gustou a crema.');
  for (;;) {
    const opts = [
      { t: '¿Qué tal va Monforte?', k: 'monforte' },
      { t: '¿Has oído el silbato de noche?', k: 'asubio' },
      ...(!hasItem('crema') && !flag('cremaPosta') ? [{ t: '¿Me das otra muestra de crema?', k: 'crema' }] : []),
      { t: 'Hasta luego, Valerio.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'monforte') {
      await VA('Mira a rúa: tres locais co cartel de «Se aluga». Un leva tanto tempo que xa non se aluga o local: alúgase o cartel.');
      await VA('Os mozos marchan. Os vellos quedan. E eu vendo pastillas para a tensión aos que quedan e cremas aos que volven. Coma ti.');
      await MA('Pues algunos volvemos. Poco a poco. Con agujetas, pero volvemos.', 'pensativo');
    }
    if (k === 'asubio') {
      await VA('O tren pantasma? Eu durmo enriba da farmacia cuns tapóns de cera que vendo eu mesmo. Non oio nin o meu despertador.');
      await VA('Se queres, fágoche prezo. Dous pares, un euro. Para os veciños da casa roxa, dous e medio.');
      await MA('¿Más caro para mí?', 'esceptico');
      await VA('Ti necesítalos máis.');
    }
    if (k === 'crema') { await VA('Xa a perdiches? Ai, Martín. Toma outra. A última, que me quedo sen mostras e teño que traballar.'); give('crema'); }
    if (k === 'adeus') { await VA('Vai, e pon a crema antes de facer o parvo, non despois.'); return; }
  }
}
async function xoanFarmacia() {
  if (!flag('pistaCurma')) return;
  for (;;) {
    const opts = [
      { t: '¿Así que eres primo de Rosario?', k: 'curma' },
      { t: 'Anoche oí un silbato de vapor.', k: 'asubio' },
      { t: 'Nada, Xoán. Que se mejore Eugenia.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'curma') {
      await XO('Curmán, por parte de pai. En Monforte, se tiras unha pedra, dás nun curmán. Non o fagas, que a pedra tamén é dalgún curmán.');
      await MA('Rosario lleva el alquiler de mi casa, tú me hablaste del balcón el primer día... Qué casualidad.', 'dudoso');
      await XO('Monforte é pequeno. As casualidades aquí veñen en fila, coma os vagóns.');
    }
    if (k === 'asubio') {
      await XO('Un asubío? No barrio da estación? Iso é coma oír unha vaca en Vilatán: estraño sería non oílo.');
      await XO('Será algún graciosiño. Hai xente moi aburrida.');
      await MA('(Para ser alguien que se lo sabe todo, hoy sabe muy poco.)', 'pensativo');
    }
    if (k === 'adeus') { await XO('Graciñas. Morango: o outro cúspeo. Ten nove anos e criterio.'); return; }
  }
}
SCENES.farmacia = {
  name: 'Farmacia', bg: 'img/bg-farmacia.jpg', music: 'casa', floor: 'madeira',
  walk: [[40, 410], [810, 410], [810, 488], [920, 492], [960, 540], [0, 540], [0, 440]],
  front: [{ y: 400, r: [170, 290, 620, 110] }],
  scale: [410, 0.86, 540, 1.02], actorH: 300, start: [90, 470], minSpeed: 0.5,
  async onEnter() {
    if (flag('pistaCurma')) return;
    await XO('...entón o xarope de Eugenia, a nena da miña curmá. O de morango, que o outro cúspeo.');
    await VA('O de morango, á conta de Rosario, coma sempre. Ese xarope ten máis clientela ca min.');
    await XO('Martín! Que, xa che deu a casa roxa algún susto?');
    await MA('Uno o dos. Nada que no arregle un café.', 'esceptico');
    await MA('(Eugenia... la niña de Rosario. O sea, que Xoán es primo de Rosario. En Monforte todo el mundo es primo de alguien. O cuñado.)', 'pensativo');
    setFlag('pistaCurma');
  },
  hotspots: [
    { name: 'Rúa do Cardeal', key: true, r: [0, 150, 40, 320], at: [50, 470], face: 'L', exit: ['cardeal', [490, 410]], door: true,
      look: () => MA('La puerta a la calle. La campanilla sigue sonando igual que hace veinte años: «tlin», y el padre de Valerio levantaba la vista por encima de las gafas.', 'sonriente') },
    { name: 'Estantes', r: [40, 40, 400, 250], look: () => MA('Cajitas en fila, por colores. Si las ordenase un maquinista, irían por horario de salida.', 'risueno') },
    { name: 'Máis estantes', r: [520, 40, 400, 250], look: () => MA('Jarabes, pomadas y cosas que acaban en «-ol». La mitad de Monforte está aquí, en dosis de quinientos miligramos.', 'pensativo') },
    { name: 'Retrato', r: [452, 70, 56, 70], look: () => MA('El padre de Valerio, con su bata y su bigote. Desde el cuadro sigue vigilando que nadie coja caramelos sin pagar. Yo cogí dos. En 1996. Lo siento, don Valerio.', 'avergonzado') },
    { name: 'Mostrador', r: [180, 300, 600, 100], look: () => MA('Un mostrador de madera con más años que yo. Tiene muescas de monedas de pesetas. Aquí se pagaba en duros y se esperaba sentado.', 'pensativo') },
    { name: 'Báscula', r: [826, 250, 88, 236], act: () => MA('Me peso... No. Mejor no. Hay cosas que un hombre con agujetas no necesita saber.', 'avergonzado'),
      look: () => MA('Una báscula antigua, roja, con su esfera. Te pesa y te juzga. Por veinte céntimos, las dos cosas.', 'risueno') },
  ],
  npcs: [
    { id: 'valerio', name: 'Valerio', key: true, x: 560, y: 384, w: 70, h: 300, at: [560, 424], face: 'B', shadow: false,
      draw(c, t, talking, s) { figura(c, this.x, this.y, this.h * s, VALERIO_LOOK, talking, t); },
      done: () => flag('valerioFeito'),
      look: () => MA('Valerio, mi compañero de pupitre en el instituto. Con la bata de su padre parece un médico de serie. De serie de sobremesa.', 'sonriente'),
      talk: () => valerioTalk(),
      give: {
        ositos: async () => { await VA('Ositos? Na farmacia? Martín, levo vinte anos dicindo que o azucre fai mal. Dame un.'); },
        crema: async () => { await VA('Non, non: é para ti. Póñaa ti, que eu non che dou masaxes. Iso é cousa dos fisios.'); },
        xornal: async () => { await VA('Xa o lin. As esquelas primeiro: é deformación profesional.'); },
      } },
    { id: 'xoanF', name: 'Xoán Carballeira', key: false, sheet: 'img/xoan-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 1, talkFrames: [1],
      x: 330, y: 440, w: 70, h: 296, at: [450, 470], face: 'L',
      look: () => MA('Xoán, el de Renfe, comprando jarabe para la hija de su prima. Hasta en la farmacia lleva el chaleco. Puntualidad suiza, chaleco gallego.', 'sonriente'),
      talk: () => xoanFarmacia(),
      give: { ositos: async () => { await XO('Para Eugenia? Non, non, que logo non quere o xarope. Xa sabes: primeiro o amargo, despois o doce.'); } } },
  ],
};

/* ---------- C2 · Club Fluvial: piscina e chiringuito «Malo Será» (fondo provisional) ---------- */
async function andresTalk() {
  if (!flag('andresSauda')) {
    await AN('Mira quen chega! O de Vilatán! O da saída nula!');
    await MA('No fue salida nula. Fue salida rápida. Hay una diferencia: que gané.', 'risueno');
    await AN('Revancha. Catro largos. Hoxe. Levo vinte anos adestrando... mentalmente. Dende a tumboa.');
    setFlag('andresSauda');
  } else if (!flag('andresFeito')) await AN('Que, xa te decidiches? A auga non morde. Bueno, a catorce graos, un pouco.');
  else await AN('O campión! Ou o do empate. Segundo quen o conte. Eu cóntoo mellor.');
  for (;;) {
    const opts = [
      ...(!flag('andresFeito') ? [{ t: 'Vale. Revancha.', k: 'reto' }] : []),
      { t: '¿La piscina no cerraba en septiembre?', k: 'pechada' },
      { t: '¿Qué tal el Malo Será?', k: 'malo' },
      ...(flag('andresFeito') ? [{ t: 'Tu abuelo era fogonero, ¿no?', k: 'avo' }] : []),
      { t: 'Hasta luego, Andrés.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'reto') { if (await retoNatacion()) return; }
    if (k === 'pechada') {
      await AN('Pechada para o público. Eu non son público: son o do chiringuito. E teño chave.');
      await AN('A auga está a catorce graos. Purifica. Ou iso dixo un que saíu azul.');
    }
    if (k === 'malo') {
      await AN('O «Malo Será» vai coma sempre: ben de tumboas, mal de clientes. É filosofía: a vida, mellor deitado.');
      await AN('De pé só ves problemas. Deitado ves o ceo. E se hai problemas, quedan por riba e non tes que velos.');
      await MA('Es la teoría más perezosa que he oído. Y tiene sentido. Me preocupa.', 'risueno');
    }
    if (k === 'avo') {
      await AN('Fogoneiro no depósito, si. Dicía que o carbón bo se coñece polo son ao caer na pa. Por iso gardo sacos do bo, para o churrasco.');
      await AN('E aquela carretilla, a das tumboas, era súa. Leva cen quilos sen queixarse. Coma min, pero sen queixarse.');
    }
    if (k === 'adeus') { await AN(flag('andresFeito') ? 'Vai, vai. A tumboa catro queda reservada para ti.' : 'Ti volve, que a revancha non caduca.'); return; }
  }
}
async function retoNatacion() {
  if (!hasItem('crema') && !flag('cremaPosta')) {
    await MA('¿Nadar? ¿Con estos gemelos? Me hundo como un ancla. Necesito algo para las agujetas antes. Una farmacia o un milagro. La farmacia queda más cerca.', 'avergonzado');
    await AN('Valerio, no Cardeal. Dille que vas da miña parte e cóbrache o dobre.');
    setFlag('faltaCrema');
    toast('Pista: Valerio ten farmacia na rúa do Cardeal (mapa, Centro)');
    return false;
  }
  if (!flag('cremaPosta')) {
    await MA('Un momento: crema en los gemelos... Huele a pino y a vestuario de instituto. Ya está. Soy otro hombre. Un hombre que huele a pino.', 'convencido');
    take('crema'); setFlag('cremaPosta');
  }
  await AN('Catro largos. Ti pola rúa da esquerda, eu pola da dereita. A miña é máis curta. É broma. Ou non.');
  const intento = (E.flags.natacionIntentos || 0) + 1; setFlag('natacionIntentos', intento);
  const gana = await minixogoToques({ title: 'Catro largos no Fluvial', me: 'Martín', rival: 'Mega Andrés', goal: 40, rivalSpeed: intento === 1 ? 5.6 : 4.8,
    hint: 'Toca ◀ e ▶ por quendas (ou as frechas do teclado). Cada brazada conta!' });
  if (gana) {
    await AN('...Saída rápida outra vez?');
    await MA('Brazada limpia. Veinte años después, y sigues sin saber perder.', 'orgulloso');
    await AN('Vale, vale. Gañaches. O premio: unha tarde de tumboa por conta da casa. É o meu maior premio. Non llo dou a calquera.');
  } else if (intento < 2) {
    await AN('Ha! A saída nula pásache factura vinte anos despois. Outra?');
    await MA('Me ha entrado agua en la nariz. Y en el orgullo.', 'frustrado');
    return false;
  } else {
    await AN('Mira, deixámolo en empate técnico. Ti convídasme a un mojito e eu non llo conto a Concha.');
    await MA('Un empate pagado. Muy de Monforte. Trato hecho.', 'risueno');
  }
  await AN('Sabes que o meu avó era fogoneiro no depósito? Dicía que o carbón bo se coñece polo son. Aínda gardo uns sacos, para o churrasco.');
  await MA('Un fogonero en la familia. Andrés, eso tiene más mérito que cuatro largos.', 'sonriente');
  setFlag('andresFeito'); comprobarChampions();
  return true;
}
SCENES.fluvial = {
  name: 'Club Fluvial · Malo Será', bg: 'img/bg-fluvial.jpg', music: 'estacion', floor: 'pedra',
  walk: [[120, 300], [840, 300], [930, 470], [960, 540], [0, 540], [30, 470]],
  holes: [[[184, 318], [776, 318], [836, 444], [124, 444]], [[850, 370], [940, 370], [940, 430], [850, 430]], [[356, 474], [564, 474], [564, 508], [356, 508]]],
  scale: [300, 0.5, 540, 0.95], actorH: 300, start: [60, 500], minSpeed: 0.45,
  draw(c, t) {
    signText(c, 'MALO SERÁ', 105, 234, 20, '#ffd23a', '"Trebuchet MS", sans-serif');
    c.fillStyle = '#f2ead8'; c.font = '11px "Trebuchet MS", sans-serif'; c.fillText('mojito 5', 205, 254); c.fillText('tumboa 2', 205, 268); c.fillText('siesta 0', 205, 282);
    c.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 6; i++) { const x = 200 + ((t * 30 + i * 97) % 560); c.fillRect(x, 330 + (i % 3) * 34, 18, 2); }
  },
  hotspots: [
    { name: 'Mapa', key: true, r: [0, 480, 60, 60], at: [40, 510], face: 'L', exit: ['mapa'], hint: 'L',
      look: () => MA('Por ahí vuelvo al Malecón y al resto de Monforte. Seco, a ser posible.', 'pensativo') },
    { name: 'Piscina', r: [130, 320, 700, 120], act: () => andresTalk(),
      look: () => MA('La piscina del Fluvial. Cerrada desde septiembre, pero con agua. Agua a catorce grados. Agua con opiniones.', 'esceptico') },
    { name: 'Chiringuito', r: [10, 160, 190, 150], look: () => MA('El «Malo Será». Un nombre que es toda una declaración de principios. Y de finales.', 'risueno') },
    { name: 'Lousa', r: [200, 236, 44, 76], look: () => MA('Mojito, cinco euros. Tumbona, dos. Siesta, gratis. Es la carta más sincera de Galicia.', 'sonriente') },
    { name: 'Tumboas', r: [556, 440, 300, 64], look: () => MA('Tumbonas naranjas en fila. La número 4 tiene la marca del cuerpo de Andrés. Es prácticamente un molde.', 'risueno') },
    { name: 'Carretilla', r: [850, 370, 110, 60], look: () => MA('Una carretilla azul, de las de obra, para llevar tumbonas. Con esa rueda se podría mover una vaca. O algo más pesado.', 'pensativo') },
    { name: 'Sacos de carbón', r: [856, 296, 90, 60], look: () => MA('Sacos de carbón vegetal... no: de piedra, del bueno. Para un churrasco es un despilfarro. Para una caldera, sería otra cosa.', 'dudoso') },
    { name: 'Grella', r: [796, 316, 60, 50], look: () => MA('La parrilla del churrasco, con su costra de veranos. Huele a sardina de agosto aunque estemos en otoño.', 'sonriente') },
    { name: 'Río Cabe', r: [0, 190, 960, 30], look: () => MA('El Cabe, bajando tranquilo. Aquí aprendimos a nadar medio Monforte. La otra mitad, a mirar.', 'pensativo') },
    { name: 'Ponte Vella', r: [560, 150, 340, 60], look: () => MA('La Ponte Vella al fondo, con sus arcos. Lleva siglos aguantando a Monforte encima. Yo con cuatro largos ya me quejo.', 'pensativo') },
  ],
  npcs: [
    { id: 'andres', name: 'Mega Andrés', key: true, x: 480, y: 500, w: 220, h: 70, at: [600, 512], face: 'L', shadow: false,
      draw(c, t, talking, s) { andresDeitado(c, this.x, this.y, 150 * s, talking, t); },
      done: () => flag('andresFeito'),
      look: () => MA('Mega Andrés, en su tumbona, con camisa de flores y gafas de sol. En otoño. Es un estilo de vida, no una estación del año.', 'risueno'),
      talk: () => andresTalk(),
      give: {
        crema: async () => { await AN('Crema? Para min? Eu non teño agulletas: para ter agulletas hai que moverse.'); },
        ositos: async () => { await AN('Ositos! Deitado sábenme mellor. Grazas, rapaz. Ben, un só.'); },
      } },
  ],
};

/* ---------- B3 · A Fraternal de noite: a Champions (martes, 20:00) ---------- */
function comprobarChampions() {
  if (!flag('valerioFeito') || !flag('andresFeito') || flag('avisoChampions')) return;
  setFlag('avisoChampions');
  bark('Las ocho menos diez. Martes. Champions en la Fraternal con el tío Demetrio. Hay cosas que no se negocian.', 'Martín', 3600);
  toast('Novo obxectivo: a Champions na Fraternal (rúa Concepción Arenal)');
}
async function championsNoite() {
  await DA('Martín! Senta, que xa empeza. Gardeiche o tamborete bo. O gastado.');
  await MA('El de media vida sentándose en el mismo. Un honor.', 'risueno');
  await DA('Isto lémbrame o meu gol ao Ourense, en Terceira. Un domingo de sol, collo o balón...');
  await XO('Foi en mércores, Demetrio. E chovía. Catorce de marzo, minuto oitenta e un, de cabeza e de rebote.');
  await DA('De rebote?! Cinco euros a que non!');
  await XO('Está na acta do partido. Teño copia.');
  await MA('(¿Copia del acta de un partido de Tercera de hace treinta años? Este hombre no tiene memoria: tiene archivo.)', 'pensativo');
  await RO('Xoán ten copia de todo. Ata das miñas notas do colexio. Por iso non o deixo entrar na casa.');
  setFlag('champSauda');
}
async function xoanChampions() {
  for (;;) {
    const opts = [
      ...(!flag('xoanCandado') ? [{ t: 'Esta mañana había un candado nuevo en las cocheras del museo.', k: 'candado' }] : []),
      { t: '¿Cómo te acuerdas de la fecha de un gol de Tercera?', k: 'memoria' },
      { t: 'Nada, Xoán. A ver el partido.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'candado') {
      await XO('Un candado? Nas cocheras? Cousas de Adif, ou do museo. Eu son de Renfe: de candados sei o xusto para non perder o tren.');
      await XO('Por certo: ese gol de Demetrio foi de rebote. Non llo digas, que me cobra os cinco euros igual.');
      await MA('(Ha cambiado de tema más rápido que un cambio de agujas.)', 'dudoso');
      setFlag('xoanCandado');
    }
    if (k === 'memoria') {
      await XO('As datas son coma os horarios: se as aprendes ben unha vez, xa non marchan.');
      await XO('Ademais, chovía. Os días de choiva acórdanse mellor. Pregúntalle a calquera galego.');
    }
    if (k === 'adeus') { await XO('Iso. E non apostes con Demetrio, que paga en goles.'); return; }
  }
}
async function fimChampions() {
  await MA('Las once. Ni prórroga ni penaltis: a dormir, que mañana madrugo.', 'convencido');
  await DA('Ás once! Coma os nenos. E agora que ía marcar o noso...');
  setFlag('champions');
  await goScene('casaSalon', [200, 490]);
  toast('O dormitorio está á esquerda do salón');
}
SCENES.fraternalNoite = {
  ...SCENES.fraternal, name: 'A Fraternal · Champions',
  front: SCENES.fraternal.front.map(L => ({ ...L, withDraw: true })),
  draw(c, t) {
    c.fillStyle = 'rgba(8,12,36,.46)'; c.fillRect(0, 0, 960, 540);
    const f = 0.6 + 0.4 * Math.sin(t * 9) * Math.sin(t * 2.3);
    const g = c.createRadialGradient(759, 101, 6, 759, 101, 230); g.addColorStop(0, `rgba(150,200,255,${0.5 * f})`); g.addColorStop(1, 'rgba(150,200,255,0)');
    c.fillStyle = g; c.fillRect(500, 0, 460, 360);
    c.fillStyle = `rgba(120,220,140,${0.8})`; c.fillRect(726, 80, 66, 42); c.fillStyle = '#fff'; c.fillRect(756 + 10 * Math.sin(t * 1.7), 98 + 4 * Math.sin(t * 3.1), 3, 3);
  },
  async onEnter() { if (!flag('champSauda')) await championsNoite(); },
  hotspots: [
    { name: 'Saír · ás once, á cama', key: true, r: [520, 82, 76, 128], at: [590, 262], face: 'B', exit: ['__casa'], door: true, act: () => fimChampions(),
      look: () => MA('La puerta. A las once en punto, por ahí salgo. Es la única regla de mi vida que nunca me he saltado.', 'convencido') },
    ...SCENES.fraternal.hotspots.filter(h => !h.exit && h.name !== 'Tele' && h.name !== 'Xornal e baralla'),
    { name: 'Tele', r: [724, 76, 70, 50], look: () => MA('Champions. Corre uno, se cae otro, el árbitro pita algo que nadie entiende. Lo mismo que en la Tercera de Demetrio, pero con mejor césped.', 'risueno') },
  ],
  npcs: [
    { ...SCENES.fraternal.npcs[0], done: () => true, talk: async () => { await RO('Shhh, que xa empezou. E que tal a casa? Xa tes auga?'); await MA('Agua, luz y un silbato de regalo.', 'esceptico'); await RO('Iso non vén no contrato. Non me fago responsable.'); } },
    { id: 'davidN', name: 'Tío Demetrio', key: true, sheet: 'img/david-sprite.png', spec: { cw: 160, ch: 280, cols: 8 },
      get idle() { return E.dlg ? 3 : 5; }, talkFrames: [4, 9, 3, 7], x: 300, y: 430, w: 90, h: 290, at: [380, 440], face: 'L', done: () => true,
      look: () => MA('El tío Demetrio, pegado a la tele. Comenta cada jugada como si la hubiera jugado él. Algunas, según él, sí.', 'risueno'),
      talk: async () => { await DA('Viches iso? Iso marcábao eu cos ollos pechados. E de domingo.'); await MA('Y con sol, claro.', 'risueno'); await DA('Con sol! Por fin alguén con memoria nesta casa.'); } },
    { id: 'xoanN', name: 'Xoán Carballeira', key: true, sheet: 'img/xoan-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [7, 0],
      x: 610, y: 300, w: 70, h: 296, at: [700, 340], face: 'L', done: () => flag('xoanCandado'),
      look: () => MA('Xoán, viendo el partido con los brazos cruzados. No celebra los goles: los apunta. Seguro que tiene una libreta.', 'pensativo'),
      talk: () => xoanChampions() },
  ],
};
{ // a porta da Fraternal e o tío Demetrio na rúa, no Acto 2
  const P = SCENES.arenal.hotspots.find(h => h.name === 'Porta da Fraternal'), actA1 = P.act, doneA1 = P.done;
  P.act = async () => {
    if (!flag('fimActo1')) return actA1();
    if (flag('avisoChampions') && !flag('champions')) { SFX.door(); return goScene('fraternalNoite', [590, 266]); }
    await bark(flag('champions') ? 'La Fraternal. Esta noche no hay partido: hoy toca otra cosa.' : 'La Fraternal. Martes y miércoles, a las ocho, Champions. Antes, a saludar a los de siempre: Valerio y Andrés.');
  };
  P.done = () => flag('fimActo1') ? !flag('avisoChampions') || flag('champions') : doneA1();
  const D = SCENES.arenal.npcs.find(n => n.id === 'david'), dD = D.done;
  D.when = () => !(flag('avisoChampions') && !flag('champions'));
  D.done = () => flag('fimActo1') || dD();
}

/* ---------- A5 · a segunda noite: o asubío vén de detrás da casa ---------- */
async function noite2() {
  await MA('Cama. Silencio. Ni un tren. Esta noche duermo de un tirón...', 'aliviado');
  E.fadeTo = 1; await sleep(900);
  setTimeout(() => SFX.whistle(), 1200);
  await cine('img/noite-salon.jpg', [
    'Esa noite, outra vez...',
    'Martín: «Dos largos y uno corto. Otra vez. Pero esta vez suena... más cerca. Demasiado cerca.»',
    'Martín: «No viene del museo. Viene de atrás. Del patio.»',
  ]);
  const ZOOM_PORTA = { x: 0.86, y: 0.62, z: 1.7 };
  await cine('img/noite-patio-luz.jpg', [
    'Martín: «Bajo al patio en pijama, con la linterna del móvil. Muy de película de miedo, todo. Muy poco de maquinista.»',
    'Martín: «Por debajo de la puerta del taller... hay luz. Ahí dentro hay alguien.»',
  ], ZOOM_PORTA);
  SFX.door();
  await cine('img/noite-patio.jpg', [
    'Martín: «Y se apaga. Silencio. El candado sigue puesto, por fuera.»',
    'Martín: «Si el candado está por fuera... el que estaba dentro no entró por la puerta.»',
  ], ZOOM_PORTA);
  setFlag('silbato2');
  await showDoc('<h4>Mércores, 8:00</h4><p>Martín non durmiu moito. Pero xa sabe unha cousa: o asubío non pasa por diante da súa casa. Sae de detrás.</p>');
  E.fadeTo = 0; await sleep(400);
  await MA('Se acabó mirar por la rendija. Necesito la llave del taller. Y la tiene Concha... que dijo algo de «un detalle».', 'convencido');
  toast('Novo obxectivo: a chave do taller (Concha, no quiosco)');
}
{ // dormitorio do salón e porta do taller no patio
  const D = SCENES.casaSalon.hotspots.find(h => h.name === 'Dormitorio'), actA1 = D.act;
  D.act = () => flag('champions') && !flag('silbato2') ? noite2()
    : flag('fimActo1') && !flag('champions') ? MA(flag('avisoChampions') ? '¿A dormir ya? Es martes y hay Champions. Primero, la Fraternal.' : 'Todavía es de día. Hoy toca ver a los de siempre: Valerio y Andrés. Concha sabe dónde están.', 'convencido')
    : actA1();
  D.done = () => flag('fimActo1') && (!flag('champions') || flag('silbato2'));
  const T = SCENES.casaPatio.hotspots.find(h => h.name === 'Porta do taller');
  T.act = async () => {
    if (flag('tallerAberto')) { SFX.door(); return goScene('tallerA2', [120, 505]); }
    if (hasItem('chave')) return abrirTaller();
    await espiarTaller();
    if (flag('silbato2')) await MA('La llave, Concha. Y un detalle. No se me olvida.', 'pensativo');
  };
  T.use = { chave: () => abrirTaller() };
  T.done = () => flag('tallerAberto');
}
async function abrirTaller() {
  if (flag('tallerAberto')) return goScene('tallerA2', [120, 505]);
  setFlag('tallerAberto');
  await MA('La llave de hierro en el candado de los tres papas... Gira duro, pero gira. Setenta años diciendo que no... y luego que sí.', 'aliviado');
  SFX.door(); await goScene('tallerA2', [120, 505]);
}

/* ---------- A6 · O taller vello, canónico (fotos de Oscar) ----------
   Pistas da trama de ficción, cada unha serve máis adiante (decidido por Oscar o 15-11-2026):
   · foto de 1949 (obxecto): «Xosé entra en Renfe» → no Acto 3 ensínaselle a Xoán;
   · gravado no piar (co ollo): «X. N. 1949 / 14-I-1958» → código 1401 do candado novo das cocheras (Acto 3);
   · pegadas (co ollo) → trapo con graxa de locomotora: quen entra vén do depósito (Acto 3: a graxa que falta do almacén);
   · 7.º soporte soldado: non se abre neste acto (ábrese no Acto 4 coa ferramenta de Remedios).
   A escritura de 1952 (datos reais) e as marcas de pernos quedan como decorado opcional. */
Object.assign(ico, {
  foto(c) { c.fillStyle = '#e8dcc0'; c.fillRect(8, 10, 32, 28); c.fillStyle = '#6a5a44'; c.fillRect(11, 13, 26, 18); c.fillStyle = '#c8b898'; for (const x of [15, 22, 29]) { c.beginPath(); c.arc(x + 2, 19, 2.5, 0, 7); c.fill(); c.fillRect(x, 22, 5, 8); } },
  trapo(c) { c.fillStyle = '#8a7a62'; c.beginPath(); c.moveTo(8, 20); c.lineTo(30, 10); c.lineTo(42, 24); c.lineTo(36, 40); c.lineTo(12, 38); c.closePath(); c.fill(); c.fillStyle = '#1c1a18'; c.beginPath(); c.ellipse(26, 26, 9, 6, 0.4, 0, 7); c.fill(); c.beginPath(); c.ellipse(16, 32, 4, 3, 0, 0, 7); c.fill(); },
});
const DOC_FOTO = `<h4>Foto de 1949</h4><p class="sub">Diante: un home con bigote e tres rapaces con mono diante dunha serra de cinta.</p>
<p>Detrás, a lapis: «O señor Alfredo cos aprendices, 1949. Pepe, Manolo, Xosé N.»</p><p>E, con outra letra máis nova: «Xosé entra en Renfe. Sorte, rapaz.»</p><p class="sub">(Foto e notas de ficción do xogo)</p>`;
Object.assign(ITEMS, {
  foto1949: { name: 'Foto de 1949', icon: ico.foto, look: async () => { await showDoc(DOC_FOTO); await MA('Xosé N., aprendiz de carpintero en esta casa... y luego, ferroviario. Como yo, pero al revés: él llegó al tren desde la madera.', 'pensativo'); } },
  trapo: { name: 'Trapo con graxa', icon: ico.trapo, look: () => MA('Un trapo empapado de grasa negra, espesa. No es de coche ni de bici: es grasa de locomotora, de la de las bielas. La conozco desde hace veinte años. Esto viene del depósito.', 'dudoso') },
});
const PISTAS_TALLER = ['pistaFoto', 'pistaData', 'pistaTrapo', 'pistaSoporte'];
async function pistaTaller(k) {
  if (flag(k)) return; setFlag(k);
  const n = PISTAS_TALLER.filter(flag).length;
  if (n < PISTAS_TALLER.length) toast(`Pistas do taller: ${n} de ${PISTAS_TALLER.length}`);
  else await cadernoMartin();
}
async function cadernoMartin() {
  if (flag('fimActo2')) return;
  await MA('Vale. Paro. Respiro. Lo apunto todo antes de que se me mezcle con la Champions.', 'pensativo');
  await showDoc(`<h4>Cuaderno de Martín · miércoles</h4><p class="sub">Lo que sé</p>
<p>1949: Xosé N. aprendía el oficio en esta carpintería. Luego entró en Renfe.</p>
<p>Alguien grabó en el pilar «X. N. 1949» y, debajo, con otra mano, «14-I-1958». El 14 de enero de 1958 pasó algo. Y tiene que ver con él.</p>
<p>Alguien entra aquí sin llave, por la ventana del fondo, y va siempre al séptimo soporte. Se dejó un trapo con grasa de locomotora: viene del depósito.</p>
<p>El séptimo soporte tiene la tapa soldada. Los otros seis, no. Ahí dentro hay algo.</p>
<p>Y alguien silba, dos largos y uno corto, para que yo lo oiga.</p>
<p><b>Pregunta:</b> ¿quién era Xosé N.? Y ¿quién, en el depósito, tiene tanto interés en él?</p>`);
  await MA('Un aprendiz que se hizo maquinista. Una fecha. Grasa del depósito. Y un silbato que llama a esta casa.', 'pensativo');
  await MA('Mañana, Xoán. Él se sabe todas las fechas de Monforte. A ver si se sabe esta.', 'dudoso');
  setFlag('fimActo2');
  await showDoc('<h4>FIN DO ACTO 2 · «O reencontro»</h4><p>Valerio, Andrés, a Champions con Demetrio... e un taller que alguén visita sen chave, cun nome a medias e unha data gravada no piar.</p><p>O Acto 3, «A curiosidade», chegará nun próximo hito.</p>');
}
SCENES.tallerA2 = {
  ...SCENES.taller, name: 'O taller vello', music: 'casa',
  draw(c, t) {
    // o mesmo atrezo que a demo (caixón, foto e pegadas), pero a foto desaparece cando Martín a colle
    c.fillStyle = '#5a3f26'; c.fillRect(76, 452, 132, 64); c.fillStyle = '#6e4e30'; c.fillRect(76, 444, 132, 14); c.fillStyle = '#3a281a'; for (let i = 0; i < 3; i++) c.fillRect(80, 470 + i * 16, 124, 2);
    if (!hasItem('foto1949') && !flag('pistaFoto')) { c.fillStyle = '#2a2018'; c.fillRect(492, 198, 66, 62); c.fillStyle = '#b9ae94'; c.fillRect(497, 203, 56, 44); c.fillStyle = '#5a5246'; for (let i = 0; i < 4; i++) c.fillRect(503 + i * 12, 220, 7, 24); }
    else { c.fillStyle = '#2a2018'; c.beginPath(); c.arc(525, 202, 2.5, 0, 7); c.fill(); }   // só queda o cravo
    for (let i = 0; i < 8; i++) { c.fillStyle = 'rgba(25,20,16,.55)'; c.beginPath(); c.ellipse(276 + i * 23, 524 - i * 6 - (i % 2) * 8, 5, 9, 0.9, 0, 7); c.fill(); }
    if (!hasItem('trapo') && !flag('pistaTrapo')) { c.fillStyle = '#8a7a62'; c.beginPath(); c.moveTo(560, 500); c.lineTo(588, 492); c.lineTo(600, 506); c.lineTo(570, 514); c.closePath(); c.fill(); c.fillStyle = '#1c1a18'; c.beginPath(); c.ellipse(580, 504, 8, 4, 0.2, 0, 7); c.fill(); }
    if (flag('pistaData')) { c.strokeStyle = 'rgba(240,230,200,.55)'; c.lineWidth = 1.5; c.font = 'italic 11px Georgia, serif'; c.fillStyle = 'rgba(240,230,200,.6)'; c.fillText('X.N. 1949', 500, 330); c.fillText('14-I-1958', 500, 346); }
  },
  async onEnter() {
    if (flag('tallerA2Visto')) return;
    setFlag('tallerA2Visto');
    await MA('Por fin dentro. Huele a serrín de hace setenta años y a humedad. Y a otra cosa... a grasa de máquina. Reciente.', 'pensativo');
    toast('Pista: usa o OLLO para ver o que se che escapa');
  },
  hotspots: [
    { name: 'Viga da transmisión', key: true, done: () => flag('pistaSoporte'), r: [10, 4, 940, 128], at: [600, 490], face: 'B', exit: ['vigasA2'],
      look: () => MA('La viga de la transmisión. Diez metros, siete soportes para siete poleas. Desde aquí abajo no se ve bien el último.', 'pensativo') },
    { name: 'Foto vella', key: true, when: () => !hasItem('foto1949') && !flag('pistaFoto'), r: [484, 192, 82, 76], at: [525, 480], face: 'B',
      act: async () => {
        give('foto1949');
        await MA('Una foto clavada al pilar, comida por la humedad. Un señor con bigote y tres chavales con mono delante de una sierra enorme. Me la llevo: aquí se la va a acabar de comer la humedad.', 'pensativo');
        await ITEMS.foto1949.look();
        await pistaTaller('pistaFoto');
      },
      look: () => MA('Una foto vieja clavada al pilar. Gente con mono delante de una sierra. Habrá que verla de cerca.', 'pensativo') },
    { name: 'Gravado no piar', key: true, olloOnly: 'pistaData', done: () => flag('pistaData'), r: [490, 300, 80, 60], at: [525, 480], face: 'B',
      look: async () => {
        await MA('Debajo de donde estaba la foto, algo grabado a navaja en el ladrillo. Hay que acercarse mucho...', 'pensativo');
        await showDoc('<h4>Gravado a navalla no piar</h4><p style="font-size:22px;text-align:center">X. N. 1949</p><p style="font-size:22px;text-align:center;font-style:italic">14-I-1958</p><p class="sub">A primeira liña, firme e coidada. A segunda, máis tremente, coma feita á présa.</p>');
        await MA('«X. N.», como el aprendiz de la foto. Y debajo, otra mano, más nerviosa: catorce de enero de mil novecientos cincuenta y ocho.', 'sorprendido');
        await MA('Esa fecha... Ese invierno pasó algo en el depósito. No sé qué. Pero alguien quiso dejarlo escrito donde no lo borrase nadie.', 'dudoso');
        await pistaTaller('pistaData');
      } },
    { name: 'Pegadas no po', key: true, olloOnly: 'pistaPegadas', done: () => flag('pistaTrapo'), r: [262, 456, 190, 74],
      look: async () => {
        await MA('Huellas en el polvo. Recientes: el polvo de setenta años no tiene estos bordes.', 'sorprendido');
        await MA('Vienen de la ventana rota del fondo y van hasta el pilar del séptimo soporte. Y vuelven. Alguien ha venido a mirar ahí arriba. Varias veces.', 'dudoso');
        if (flag('chaveTaller')) await MA('Y Concha dice que nadie le ha pedido la llave en años. Claro: este «alguien» entra por la ventana.', 'pensativo');
        setFlag('pistaPegadas');
        if (!flag('pistaTrapo')) await MA('Y donde acaban las huellas, junto al pilar, hay algo tirado. Un trapo.', 'sorprendido');
      } },
    { name: 'Trapo', key: true, when: () => !hasItem('trapo') && !flag('pistaTrapo'), r: [552, 486, 56, 34], at: [600, 500], face: 'L',
      act: async () => {
        give('trapo');
        await MA('Un trapo empapado de grasa negra y espesa...', 'dudoso');
        await ITEMS.trapo.look();
        await MA('Así que el que entra aquí de noche viene del depósito. Y tiene acceso a la grasa buena.', 'pensativo');
        await pistaTaller('pistaTrapo');
      },
      look: () => MA('Un trapo tirado junto al pilar. Sucio de algo negro. No es polvo de setenta años: brilla.', 'dudoso') },
    { name: 'Caixón de madeira', r: [70, 436, 144, 86], at: [230, 500], face: 'L',
      act: async () => {
        if (!hasItem('escritura')) { give('escritura'); await MA('Entre clavos oxidados, una copia amarillenta de una escritura. 1952.', 'sorprendido'); }
        await ITEMS.escritura.look();
        await MA('La venta de la maquinaria que contó Rosario, por escrito. Treinta mil pesetas. Así se vació este taller.', 'pensativo');
      },
      look: () => MA('Un cajón de madera con herrajes. Parece de la época de las máquinas.', 'neutro') },
    { name: 'Marcas no chan', olloOnly: 'pistaPernos', r: [640, 452, 260, 78],
      look: () => MA('Agujeros de pernos en grupos de cuatro. Aquí estuvieron atornilladas las máquinas: sierra, cepilladora, torno... Ahora solo queda la transmisión, allá arriba.', 'pensativo') },
    { name: 'Patio', key: true, r: [0, 150, 48, 320], at: [70, 505], face: 'L', exit: ['casaPatio', [836, 500]], door: true,
      look: () => MA('Por ahí vuelvo al patio. Y cierro, como dijo Concha. Aunque a este taller, por lo visto, se entra por la ventana.', 'esceptico') },
  ],
};
SCENES.vigasA2 = {
  ...SCENES.vigas, name: 'O taller vello · as vigas',
  draw(c) { c.fillStyle = '#3d3d42'; c.fillRect(708, 168, 40, 52); c.fillStyle = '#25252a'; c.beginPath(); c.arc(728, 228, 16, 0, 7); c.fill(); c.fillStyle = '#a08850'; c.fillRect(704, 192, 48, 4); },
  hotspots: [
    { name: 'Sétimo soporte', key: true, done: () => flag('pistaSoporte'), r: [660, 140, 160, 110],
      look: async () => {
        await MA('El séptimo soporte, encima del pilar. Los otros seis se abren con la mano. Este tiene la tapa soldada.', 'dudoso');
        await MA('¿Quién suelda la tapa de una polea? Alguien que no quería que nadie la abriese. O alguien muy aburrido.', 'pensativo');
        await pistaTaller('pistaSoporte');
      },
      act: async () => { await MA('Con las manos no puedo. La soldadura aguanta como el primer día.', 'frustrado'); await pistaTaller('pistaSoporte'); },
      use: {
        navalla: async () => { await MA('Meto la navaja en la soldadura... y se dobla antes la navaja que la soldadura. Esto lo soldó alguien que sabía.', 'frustrado'); await pistaTaller('pistaSoporte'); },
        desaparafusador: async () => { await MA('¿Un destornillador contra una soldadura? Es como parar una Mikado con un paraguas.', 'risueno'); await pistaTaller('pistaSoporte'); },
      } },
    { name: 'Luz do tellado', r: [60, 40, 500, 300], look: () => MA('El tejado está roto y entra la luz a chorros. Bonito para una foto. Peligroso para una siesta.', 'esceptico') },
    { name: 'Baixar a mirada', r: [0, 470, 960, 70], exit: ['tallerA2', [620, 500]] },
  ],
};

/* ---------- preset do Acto 2 en «Escoller acto» ---------- */
{
  const F = {};
  for (const k of ['chavesDadas', 'conchaRecoñece', 'davidSauda', 'objetivoContrato', 'davidAmparo', 'amparoMan', 'faltaBoli', 'sabeCrucigrama', 'sabePalabra', 'boliDado',
    'contratoAsinado', 'sabeCasa', 'xoanCoñece', 'muralExplicado', 'trenSaiu', 'salonVisto', 'sinAgua', 'eladioAusente', 'eladioFicha', 'eladioVolveu', 'cadeiraDevolta',
    'aguaAlta', 'noiteAviso', 'noiteActo1', 'fimActo1', 'vistaSalon']) F[k] = true;
  const i = ACTS.findIndex(a => a.id === 'acto2');
  ACTS[i] = { id: 'acto2', name: 'Acto 2 · O reencontro', desc: 'Martes e mércores: o candado novo, Valerio, Mega Andrés, a Champions na Fraternal e o taller da Casa Juana',
    scene: 'praza', at: [780, 420], inv: ['chavesCasa', 'contrato'], flags: F, intro: () => primeiroTurno() };
}
