'use strict';
/* ==========================================================
   VÍA MORTA · Acto 2 «O reencontro» (versión intermedia elixida por Oscar, 14-11-2026)
   Martes: primeiro turno (candado novo) → Concha reparte os encargos → Valerio (farmacia do Cardeal)
   e Mega Andrés (Club Fluvial), en calquera orde → Champions na Fraternal → segunda noite (o asubío vén do taller).
   Mércores: a chave do taller (Concha, a cambio dun detalle: os ositos) → o taller e as cinco pistas → FIN DO ACTO 2.
   Sen Brais nin a Volta do Castelo. Fichas: docs/05_FICHAS_ESCENARIOS.md, sección «Acto 2».
   Fondos: rúa do Cardeal, farmacia e Club Fluvial son ilustracións de Oscar (a carretilla e os sacos de carbón do Fluvial píntanse por código).
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

/* Valerio e Mega Andrés: sprites das follas de Oscar (tools/sprite-valerio.py e tools/sprite-andres.py). */
Object.assign(PORTRAITS, { 'Valerio': 'img/valerio-face.png', 'Mega Andrés': 'img/andres-face.png' });

/* ---------- C2 · cinemática do primeiro turno (martes) ----------
   A Mikado na rotonda e, despois, o exterior das cocheras do Museo do Ferrocarril (ilustración de Oscar,
   img/bg-cocheras.jpg): a cámara achégase ao candado novo da porta dereita do taller. */
const ZOOM_MIKADO_ROTONDA = { x: 0.5, y: 0.55, z: 1.5 };
const ZOOM_CANDADO = { x: 0.766, y: 0.673, z: 2.6 };
async function primeiroTurno() {
  E.act = 'acto2';
  await cine('img/portada-rotonda.jpg', [
    'Martes, 6:40. Primeiro turno no depósito de Monforte.',
    'Martín: «Café de máquina, un compañero que no habla hasta las ocho... y la Mikado ahí, en su rotonda, mirándome como un perro viejo al que nadie saca a pasear.»',
  ], ZOOM_MIKADO_ROTONDA);
  await cine('img/bg-cocheras.jpg', [
    'Martín: «Al salir paso por delante del museo. La puerta de la derecha, la del taller, lleva años sin abrirse.»',
    'Martín: «Hoy tiene un candado nuevo. Brillante. De los caros.»',
    'Martín: «Ni una mota de polvo encima. Y no es de llave nada más: debajo de la cerradura tiene cuatro ruedecitas con números. De combinación.»',
    'Martín: «Quien lo puso no quería llaves que se pierdan. Ni que se copien.»',
    'Martín: «Nadie le pone un candado de cuarenta euros a una puerta que no se abre. A no ser que alguien la abra.»',
    'Martes, 15:10. Fin do turno.',
  ], ZOOM_CANDADO);
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
        toast('Novo obxectivo: Valerio (mapa, Rúa do Cardeal) e Andrés (mapa, Club Fluvial)');
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

/* ---------- Mapa no Acto 2 ----------
   Valerio abre a Rúa do Cardeal e Andrés, o Club Fluvial. Antes de que alguén os mencione, Martín dá un motivo para non ir. */
{
  ZONAS.find(z => z.id === 'fluvial').open = () => flag('objAndres');
  ZONAS.find(z => z.id === 'cardeal').open = () => flag('objValerio');
  const M = SCENES.mapa.hotspots, cardeal = M.find(h => h.name === 'Rúa do Cardeal'), fluvial = M.find(h => h.name === 'Club Fluvial'), castelo = M.find(h => h.name === 'Castelo de San Vicente');
  const cardealA1 = cardeal.act, fluvialA1 = fluvial.act, casteloA1 = castelo.look;
  cardeal.act = () => flag('objValerio') ? goScene('cardeal', [740, 520])
    : flag('fimActo1') ? MA('La calle del Cardeal. Sin un motivo, acabo en un bar contándole lo del silbato a un desconocido. Antes, a ver qué se cuenta Concha.', 'pensativo')
    : cardealA1();
  fluvial.act = () => flag('objAndres') ? goScene('fluvial', [900, 490])
    : flag('fimActo1') ? MA('El Club Fluvial. ¿Bañarme yo solo, un martes, con estas piernas? Sin un buen motivo, no. Concha seguro que tiene uno.', 'esceptico')
    : fluvialA1();
  castelo.look = () => flag('fimActo1') ? MA('El castillo de San Vicente, otro día. Hoy mis gemelos no suben ni a una silla. Y ya sé lo que pasa cuando me subo a una silla.', 'frustrado') : casteloA1();
}

/* ---------- B1 · Rúa do Cardeal (ilustración de Oscar) ---------- */
SCENES.cardeal = {
  name: 'Rúa do Cardeal', bg: 'img/bg-cardeal.jpg', music: 'estacion', floor: 'pedra',
  walk: [[170, 520], [300, 476], [470, 398], [560, 354], [610, 340], [700, 340], [800, 400], [800, 540], [160, 540]],
  scale: [340, 0.2, 540, 0.92], actorH: 300, start: [740, 520], minSpeed: 0.5,
  draw(c, t) {
    // o neón da cruz verde latexa por riba do debuxo
    const a = 0.12 + 0.22 * Math.abs(Math.sin(t * 2.2));
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = a; c.shadowColor = '#2aff8a'; c.shadowBlur = 26; c.fillStyle = '#3aff96';
    c.fillRect(440, 42, 44, 106); c.fillRect(408, 74, 108, 42); c.restore();
    // «Se aluga» nas portas de máis abaixo
    for (const [x, y, k] of [[481, 330, 1], [545, 318, 0.8]]) {
      c.save(); c.translate(x, y); c.scale(k, k); c.fillStyle = '#f4f0e0'; c.fillRect(-15, -8, 30, 16); c.strokeStyle = '#c0221c'; c.lineWidth = 1; c.strokeRect(-15, -8, 30, 16);
      signText(c, 'SE ALUGA', 0, 3, 6, '#c0221c', '"Trebuchet MS", sans-serif'); c.restore();
    }
  },
  hotspots: [
    { name: 'Mapa', key: true, r: [700, 470, 100, 70], at: [750, 525], face: 'R', exit: ['mapa'], hint: 'D',
      look: () => MA('Por ahí vuelvo hacia el resto de Monforte. A pie, que el coche se lo llevó Valencia.', 'pensativo') },
    { name: 'Farmacia', key: true, done: () => flag('valerioFeito'), r: [158, 196, 124, 300], at: [235, 512], face: 'B', exit: ['farmacia', [900, 515]], door: true,
      look: () => MA('La farmacia del padre de Valerio. La puerta abierta y el suelo de baldosas de colores, como cuando veníamos a por caramelos de eucalipto que no nos tocaban.', 'sonriente') },
    { name: 'Cruz verde', r: [404, 38, 116, 112], look: () => MA('La cruz verde de neón, parpadeando. De crío pensaba que era una señal de vía libre. En cierto modo lo es: vía libre a la aspirina.', 'risueno') },
    { name: 'Letreiro', r: [362, 122, 118, 64], look: () => MA('«FARMACIA», en letras de las de antes. Ni nombre ni apellido: en esta calle no hace falta. Es la de Valerio y punto.', 'sonriente') },
    { name: 'Escaparate', r: [362, 302, 54, 108], look: () => MA('Un escaparate con cajitas. Ni una oferta, ni un cartel de «2x1». El padre de Valerio decía que la salud no se rebaja.', 'pensativo') },
    { name: 'Locais baleiros', r: [458, 290, 110, 110], look: () => MA('«Se aluga». Y «se aluga». En esta calle había una tienda de discos y un videoclub. Ahora hay carteles. Y eco.', 'pensativo') },
    { name: 'Toldo', r: [122, 122, 470, 188], look: () => MA('Toldo de rayas rojas y blancas. Si lo pintasen de otro color, medio Monforte se perdería buscando la farmacia.', 'sonriente') },
    { name: 'Balcóns', r: [140, 0, 200, 118], look: () => MA('Balcones de hierro con florituras. Alguien me está mirando desde un visillo. Mañana lo sabe Concha. Esta tarde, quizá.', 'esceptico') },
    { name: 'Farol', r: [528, 140, 32, 62], look: () => MA('Un farol de los de forja. A esta hora apagado, ahorrando para la noche.', 'neutro') },
    { name: 'Terraza', r: [806, 360, 154, 180], look: () => MA('Una terraza con sombrilla. La calle del Cardeal siempre fue de bares. Algunas cosas en Monforte no cierran: se jubilan detrás de la barra.', 'risueno') },
    { name: 'Árbores', r: [680, 150, 280, 200], look: () => MA('Una fila de árboles hasta el fondo. En verano dan sombra; en otoño, trabajo al barrendero.', 'neutro') },
    { name: 'Torre ao fondo', r: [648, 196, 30, 92], look: () => MA('Una torre al fondo de la calle, asomando entre los tejados. En Monforte, mires donde mires, algo de piedra te está mirando a ti.', 'pensativo') },
    { name: 'Papeleira', r: [0, 420, 30, 90], act: () => MA('No voy a tirar nada. Con la suerte que tengo, mañana me haría falta.', 'esceptico'),
      look: () => MA('Una papelera. Vacía. O pasa el barrendero muy temprano o en esta calle ya no queda nadie para ensuciar.', 'neutro') },
    { name: 'Lousas', r: [380, 420, 320, 120], look: () => MA('Losas de calle peatonal, con alguna suelta que hace «clonc». La conozco: la pisaba adrede volviendo del instituto.', 'sonriente') },
  ],
};

/* ---------- B2 · Farmacia (ilustración de Oscar) ---------- */
async function valerioTalk() {
  if (!flag('valerioSauda')) {
    await VA('Martín Pardo! Non me digas! O do cross! Pasa, pasa, que dende as once non entra ninguén... agás os de sempre.');
    await MA('Valerio. Con bata. Eres clavado a tu padre.', 'sonriente');
    await VA('É a bata do meu pai. E o mostrador do meu pai. E os clientes do meu pai, os que quedan.');
    await VA('E ti que tes nas pernas? Entraches andando coma un home de oitenta anos.');
    await MA('Una silla del Concello, un reloj de bar y veinte años sin correr. Tengo los gemelos de un señor de ochenta años. Uno de los dos, de noventa.', 'avergonzado');
    await VA('Para iso tes crema de agulletas, aí no estante. Pero coñécesme: eu non vendo nin dou nada a un amigo... sen o seu peaxe.');
    await MA('¿Peaje? ¿Qué peaje?', 'dudoso');
    await VA('Algo doce. Son lambón dende o instituto: quen che cres que roubaba os caramelos de eucalipto do meu pai? Ti non, eu.');
    await VA('Tráeme algo doce e a crema é túa. E non me veñas con caramelos de eucalipto, que eses téñoos eu.');
    setFlag('valerioSauda'); setFlag('valerioDoce');
    if (hasItem('ositos')) await MA('(Algo dulce... ¡los ositos de Concha! Los llevo encima.)', 'sonriente');
    else { await MA('(Algo dulce. En el quiosco de Concha hay ositos de goma de los de siempre. Un euro bien invertido.)', 'pensativo'); toast('Pista: Concha vende ositos no quiosco da praza'); }
  } else await VA(flag('valerioFeito') ? 'Outra vez por aquí? Iso é que che gustou a crema.' : hasItem('ositos') ? 'Iso que asoma do peto... cheira a doce.' : 'Volviches? Sen nada doce? Martín, Martín...');
  for (;;) {
    const opts = [
      { t: '¿Qué tal va Monforte?', k: 'monforte' },
      { t: '¿Has oído el silbato de noche?', k: 'asubio' },
      ...(!flag('valerioFeito') && hasItem('ositos') ? [{ t: '(Darle los ositos.)', k: 'doce' }] : []),
      ...(!flag('valerioFeito') && !hasItem('ositos') ? [{ t: '¿Y no me puedes fiar la crema?', k: 'fiar' }] : []),
      ...(flag('valerioFeito') && !hasItem('crema') && !flag('cremaPosta') ? [{ t: '¿Me das otra muestra de crema?', k: 'crema' }] : []),
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
    if (k === 'doce') return valerioOsitos();
    if (k === 'fiar') {
      await VA('Fiar? A un home que volve a Monforte despois de vinte anos? Fíoche o saúdo. A crema, a cambio de algo doce.');
      await MA('(Ositos. El quiosco de Concha, en la plaza de la estación.)', 'pensativo');
    }
    if (k === 'crema') { await VA('Xa a perdiches? Ai, Martín. Toma outra. A última, que me quedo sen mostras e teño que traballar.'); give('crema'); }
    if (k === 'adeus') { await VA('Vai, e pon a crema antes de facer o parvo, non despois.'); return; }
  }
}
async function valerioOsitos() {
  take('ositos');
  await VA('Ositos de goma! Dos de Concha, dos de sempre! Ai, Martín, ti si que sabes.');
  await VA('Un para min... outro para min... e este, para min. Toma, a crema. De mostra, que se a pago eu, fáiseme falta a min.');
  give('crema'); setFlag('valerioFeito');
  await MA(flag('faltaCrema') ? 'Crema para las agujetas. Pagada en ositos. Andrés, prepárate: el de Vilatán vuelve al agua.' : 'Crema para las agujetas, pagada en ositos. En Monforte aún quedan cosas que funcionan como antes. El trueque, por ejemplo.', 'orgulloso');
  comprobarChampions();
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
  walk: [[702, 300], [790, 296], [836, 332], [906, 440], [960, 480], [960, 540], [622, 540], [664, 420], [706, 334]],
  scale: [296, 0.34, 540, 1.0], actorH: 300, start: [900, 515], minSpeed: 0.5,
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
    { name: 'Rúa do Cardeal', key: true, r: [906, 470, 54, 70], at: [920, 520], face: 'R', exit: ['cardeal', [235, 512]], door: true, hint: 'D',
      look: () => MA('La puerta a la calle. La campanilla sigue sonando igual que hace veinte años: «tlin», y el padre de Valerio levantaba la vista por encima de las gafas.', 'sonriente') },
    { name: 'Ortopedia e deporte', r: [24, 40, 292, 72], look: () => MA('«Ortopedia y deporte». Rodilleras, tobilleras y muñequeras. Es la sección de los que vuelven a correr a los cuarenta. Y la de los que vuelven del intento.', 'avergonzado') },
    { name: 'Pantalla', r: [500, 120, 50, 42], look: () => MA('Una pantalla para los turnos. Pone «0». O no hay nadie esperando o Valerio no se fía de la tecnología.', 'esceptico') },
    { name: 'Lámpadas', r: [596, 134, 164, 50], look: () => MA('Tres lámparas de bola sobre el mostrador del fondo. Como tres pastillas efervescentes colgando del techo.', 'risueno') },
    { name: 'Cadeira', r: [782, 256, 52, 70], act: () => MA('Si me siento con estos gemelos, mañana me tienen que levantar con grúa. Y la grúa del depósito está para cosas serias.', 'avergonzado'),
      look: () => MA('Una butaca para esperar. Blanca y con cara de cómoda. Demasiado cómoda para un hombre con agujetas.', 'pensativo') },
    { name: 'Mostrador', r: [640, 230, 140, 60], look: () => MA('El mostrador del fondo, de madera con arquitos. Aquí se pagaba en duros y se esperaba sentado.', 'pensativo') },
    { name: 'Expositor', r: [354, 280, 350, 260], look: () => MA('Un expositor hasta el techo de cremas, champús y vitaminas. Si las ordenase un maquinista, irían por horario de salida.', 'risueno') },
    { name: 'Estantes de madeira', r: [20, 112, 312, 420], look: () => MA('Estanterías de madera con arcos, como un retablo. Pero en vez de santos, jarabes. Que también hacen milagros, según para qué.', 'risueno') },
    { name: 'Máis estantes', r: [370, 140, 190, 140], look: () => MA('Jarabes, pomadas y cosas que acaban en «-ol». La mitad de Monforte está aquí, en dosis de quinientos miligramos.', 'pensativo') },
    { name: 'Estantes do fondo', r: [840, 118, 100, 320], look: () => MA('Más estantes. Valerio tiene más cajas que clientes. Y eso que clientes, de los de siempre, no le faltan.', 'neutro') },
  ],
  npcs: [
    { id: 'valerio', name: 'Valerio', key: true, sheet: 'img/valerio-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0],
      x: 745, y: 320, w: 70, h: 300, at: [760, 370], face: 'B',
      done: () => flag('valerioFeito'),
      look: () => MA('Valerio, mi compañero de pupitre en el instituto. Con la bata de su padre parece un médico de serie. De serie de sobremesa.', 'sonriente'),
      talk: () => valerioTalk(),
      give: {
        ositos: async () => { if (flag('valerioFeito')) await VA('Máis ositos? Martín, levo vinte anos dicindo que o azucre fai mal. Dame un. Só un.'); else await valerioOsitos(); },
        crema: async () => { await VA('Non, non: é para ti. Póñaa ti, que eu non che dou masaxes. Iso é cousa dos fisios.'); },
        xornal: async () => { await VA('Xa o lin. As esquelas primeiro: é deformación profesional.'); },
      } },
    { id: 'xoanF', name: 'Xoán Carballeira', key: false, sheet: 'img/xoan-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 1, talkFrames: [1],
      x: 812, y: 398, w: 70, h: 296, at: [880, 450], face: 'R',
      look: () => MA('Xoán, el de Renfe, comprando jarabe para la hija de su prima. Hasta en la farmacia lleva el chaleco. Puntualidad suiza, chaleco gallego.', 'sonriente'),
      talk: () => xoanFarmacia(),
      give: { ositos: async () => { await XO('Para Eugenia? Non, non, que logo non quere o xarope. Xa sabes: primeiro o amargo, despois o doce.'); } } },
  ],
};

/* ---------- C2 · Club Fluvial: piscina e chiringuito «Malo Será» (ilustración de Oscar) ---------- */
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
    toast('Pista: Valerio ten farmacia na rúa do Cardeal (está no mapa)');
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
    await AN('Ha! A saída nula pásache factura vinte anos despois. Outra? Ou deixámolo en empate técnico e convídasme a un mojito?');
    await MA('Me ha entrado agua en la nariz. Y en el orgullo.', 'frustrado');
    const o = [{ t: 'Otra. Esta vez va en serio.', k: 'outra' }, { t: 'Empate técnico. Y mojito.', k: 'empate' }];
    if (o[await choose(o)].k === 'outra') return false;
    await AN('Empate técnico! Ti convídasme a un mojito e eu non llo conto a Concha.');
    await MA('Un empate pagado. Muy de Monforte. Trato hecho.', 'risueno');
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
  walk: [[370, 400], [400, 362], [800, 358], [960, 366], [960, 540], [196, 540], [200, 446]],
  holes: [[[380, 372], [578, 372], [578, 442], [380, 442]], [[268, 446], [642, 446], [642, 540], [268, 540]], [[826, 360], [960, 360], [960, 446], [826, 446]], [[630, 412], [826, 412], [826, 488], [630, 488]]],
  scale: [360, 0.4, 540, 0.9], actorH: 300, start: [900, 490], minSpeed: 0.45,
  draw(c, t) {
    // reflexos na auga da piscina
    c.fillStyle = 'rgba(255,255,255,.45)'; for (let i = 0; i < 7; i++) { const x = 510 + ((t * 18 + i * 61) % 280); c.fillRect(x, 304 + (i % 3) * 11, 10, 1.5); }
    // a carretilla azul das tumboas e os sacos de carbón do avó fogoneiro (por código: non están no debuxo)
    c.save(); c.translate(895, 432); c.scale(1.35, 1.35); c.translate(-895, -432); c.lineWidth = 2.5; c.strokeStyle = '#1a1a1a'; c.lineJoin = 'round';
    for (const [x, y] of [[884, 392], [906, 396], [928, 390]]) {
      c.fillStyle = '#4a4036'; c.beginPath(); c.moveTo(x - 11, y + 30); c.lineTo(x - 12, y + 6); c.quadraticCurveTo(x - 6, y - 6, x, y); c.quadraticCurveTo(x + 6, y - 6, x + 12, y + 6); c.lineTo(x + 11, y + 30); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#20201e'; c.beginPath(); c.ellipse(x, y + 2, 7, 3, 0, 0, 7); c.fill();
    }
    c.fillStyle = '#2f6bc0'; c.beginPath(); c.moveTo(848, 404); c.lineTo(900, 404); c.lineTo(892, 424); c.lineTo(856, 424); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(900, 410); c.lineTo(934, 418); c.stroke(); c.beginPath(); c.moveTo(856, 424); c.lineTo(856, 432); c.stroke(); c.beginPath(); c.moveTo(888, 424); c.lineTo(888, 432); c.stroke();
    c.fillStyle = '#222'; c.beginPath(); c.arc(872, 430, 7, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#aaa'; c.beginPath(); c.arc(872, 430, 2, 0, 7); c.fill();
    c.restore();
  },
  hotspots: [
    { name: 'Mapa', key: true, r: [924, 436, 36, 104], at: [930, 490], face: 'R', exit: ['mapa'], hint: 'R',
      look: () => MA('Por ahí vuelvo al Malecón y al resto de Monforte. Seco, a ser posible.', 'pensativo') },
    { name: 'Sacos de carbón', r: [866, 362, 94, 58], look: () => MA('Sacos de carbón... no vegetal: de piedra, del bueno. Para un churrasco es un despilfarro. Para una caldera, sería otra cosa.', 'dudoso') },
    { name: 'Carretilla', r: [826, 392, 112, 54], look: () => MA('Una carretilla azul, de las de obra, para llevar tumbonas. Con esa rueda se podría mover una vaca. O algo más pesado.', 'pensativo') },
    { name: 'Salvavidas', r: [528, 298, 40, 42], look: () => MA('Un salvavidas naranja. Lo apunto mentalmente. Por si acaso. Con estos gemelos, nunca se sabe.', 'avergonzado') },
    { name: 'Piscina', r: [500, 292, 300, 52], act: () => andresTalk(),
      look: () => MA('La piscina del Fluvial. Cerrada desde septiembre, pero con agua. Agua a catorce grados. Agua con opiniones.', 'esceptico') },
    { name: 'Letreiro', r: [86, 96, 262, 104], look: () => MA('«Malo Será», con dos palmeras. Palmeras en Monforte. Andrés tiene más optimismo que clima.', 'risueno') },
    { name: 'Lousa', r: [52, 340, 140, 160], look: () => MA('Refrescos, cerveza, agua, zumos. Ni rastro del mojito. Andrés dice que el mojito es «carta secreta». O sea, que lo hace él cuando le apetece.', 'sonriente') },
    { name: 'Chiringuito', r: [0, 196, 380, 230], look: () => MA('El «Malo Será». Techo de paja, taburetes de madera y una nevera que zumba como un compresor de locomotora. Un nombre que es toda una declaración de principios. Y de finales.', 'risueno') },
    { name: 'Mesas', r: [268, 360, 380, 180], act: () => MA('Me sentaría, pero si me siento con estas agujetas, aquí me encuentra Andrés en primavera.', 'avergonzado'),
      look: () => MA('Mesas de terraza con sombrilla. En otoño, sin nadie. Pagadas para todo el año, que el optimismo no tiene temporada.', 'pensativo') },
    { name: 'Castelo', r: [570, 60, 240, 90], look: () => MA('El castillo de San Vicente allá arriba, vigilando el río. Desde aquí parece que nos mira nadar. Y que no le impresiona.', 'pensativo') },
    { name: 'Farolas', r: [560, 180, 30, 170], look: () => MA('Farolas de bola. Para los baños de noche, supongo. Andrés seguro que tiene llave también de eso.', 'esceptico') },
  ],
  npcs: [
    { id: 'andres', name: 'Mega Andrés', key: true, sheet: 'img/andres-sprite.png', spec: { cw: 200, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0],
      x: 760, y: 480, w: 150, h: 300, at: [700, 508], face: 'R', shadow: false,
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
Object.assign(ico, {
  pilas(c) { for (const [x, r] of [[14, -0.2], [26, 0.15]]) { c.save(); c.translate(x + 4, 25); c.rotate(r); c.fillStyle = '#2a2a2e'; c.fillRect(-5, -14, 10, 28); c.fillStyle = '#d9a032'; c.fillRect(-5, -14, 10, 9); c.fillStyle = '#ccc'; c.fillRect(-2, -17, 4, 3); c.restore(); } },
});
Object.assign(ITEMS, {
  pilas: { name: 'Pilas gastadas', icon: ico.pilas, look: () => MA('Dos pilas del cajón de las gastadas. Si las froto un poco con las manos, siempre les queda energía para un par de clics. No lo dice ningún manual. Lo dice cualquier maquinista.', 'risueno') },
});
async function championsNoite() {
  await DA('Martín! Senta, que xa empeza. Gardeiche o tamborete bo. O gastado.');
  await MA('El de media vida sentándose en el mismo. Un honor.', 'risueno');
  await MA('¿Y la tele? Está negra.', 'dudoso');
  await DA('O mando. Sen pilas. E no bar non quedan: as últimas puxéronse no reloxo da parede, e xa viches como vai.');
  await DA('Isto lémbrame o meu gol ao Ourense, en Terceira. Un domingo de sol, collo o balón...');
  await XO('Foi en mércores, Demetrio. E chovía. Catorce de marzo, minuto oitenta e un, de cabeza e de rebote.');
  await DA('De rebote?! Cinco euros a que non!');
  await XO('Está na acta do partido. Teño copia.');
  await MA('(¿Copia del acta de un partido de Tercera de hace treinta años? Este hombre no tiene memoria: tiene archivo.)', 'pensativo');
  await RO('Xoán ten copia de todo. Ata das miñas notas do colexio. Por iso non o deixo entrar na casa.');
  await DA('E mentres, o partido empezando e nós mirando unha tele apagada. Coma na posguerra, pero sen radio.');
  await MA('Pilas... En casa hay un cajón en la cocina con pilas gastadas. Todas las casas tienen uno: nadie las tira, nadie las usa.', 'pensativo');
  await DA('Gastadas? E para que queres ti pilas gastadas?');
  await MA('Si las frotas un poco con las manos, siempre les queda energía para un par de clics. Ciencia de maquinista. Vuelvo en nada.', 'convencido');
  setFlag('champSauda'); setFlag('faltanPilas');
  toast('Novo obxectivo: pilas para o mando (caixón da cociña, Casa Juana)');
}
async function acenderTele() {
  take('pilas'); setFlag('teleAcesa');
  await MA('Pilas gastadas, frotadas con fe. Las meto en el mando... apunto... ¡clic!', 'convencido');
  await DA('Acendeu! Martín, es un mago! Un mago con pilas mortas!');
  await XO('Dous clics, dixo. Non cambies de canle, Demetrio. Por favor.');
  await MA('Ciencia de maquinista. Y ahora, que nadie toque el mando.', 'orgulloso');
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
async function sairChampions() {
  if (flag('teleAcesa')) return fimChampions();
  if (hasItem('pilas')) return MA('Llevo las pilas en el bolsillo. Primero, la tele; después, ya veremos.', 'convencido');
  await MA('A por las pilas: el cajón de la cocina de casa. Demetrio, guárdame el taburete.', 'convencido');
  await DA('Vai, vai. Eu vou contando o partido de memoria.');
  SFX.door(); await goScene('arenal', [672, 446]);
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
    if (!flag('teleAcesa')) { c.fillStyle = '#0b0d12'; c.fillRect(726, 80, 66, 42); c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(730, 84, 20, 4); return; }
    const f = 0.6 + 0.4 * Math.sin(t * 9) * Math.sin(t * 2.3);
    const g = c.createRadialGradient(759, 101, 6, 759, 101, 230); g.addColorStop(0, `rgba(150,200,255,${0.5 * f})`); g.addColorStop(1, 'rgba(150,200,255,0)');
    c.fillStyle = g; c.fillRect(500, 0, 460, 360);
    c.fillStyle = `rgba(120,220,140,${0.8})`; c.fillRect(726, 80, 66, 42); c.fillStyle = '#fff'; c.fillRect(756 + 10 * Math.sin(t * 1.7), 98 + 4 * Math.sin(t * 3.1), 3, 3);
  },
  async onEnter() { if (!flag('champSauda')) await championsNoite(); },
  hotspots: [
    { name: 'Saír · ás once, á cama', key: true, when: () => flag('teleAcesa'), r: [520, 82, 76, 128], at: [590, 262], face: 'B', exit: ['__casa'], door: true, act: () => fimChampions(),
      look: () => MA('La puerta. A las once en punto, por ahí salgo. Es la única regla de mi vida que nunca me he saltado.', 'convencido') },
    { name: 'Saír · a por pilas', key: true, when: () => !flag('teleAcesa'), r: [520, 82, 76, 128], at: [590, 262], face: 'B', exit: ['arenal'], door: true, act: () => sairChampions(),
      look: () => MA('La puerta. Sin pilas para el mando, aquí no hay partido. Y las pilas están en mi cocina.', 'pensativo') },
    ...SCENES.fraternal.hotspots.filter(h => !h.exit && h.name !== 'Tele' && h.name !== 'Xornal e baralla'),
    { name: 'Tele', key: true, done: () => flag('teleAcesa'), r: [724, 76, 70, 50],
      act: () => flag('teleAcesa') ? MA('Ni la toco. Dos clics, dijo Xoán. Uno ya lo hemos gastado.', 'risueno') : hasItem('pilas') ? acenderTele() : MA('Sin mando no hay tele, y sin pilas no hay mando. Las pilas gastadas del cajón de mi cocina: ese es el plan.', 'pensativo'),
      use: { pilas: () => acenderTele() },
      look: () => flag('teleAcesa') ? MA('Champions. Corre uno, se cae otro, el árbitro pita algo que nadie entiende. Lo mismo que en la Tercera de Demetrio, pero con mejor césped.', 'risueno') : MA('La tele, apagada. Negra como la carbonilla. Y Demetrio mirándola igual, por si acaso.', 'esceptico') },
  ],
  npcs: [
    { ...SCENES.fraternal.npcs[0], done: () => true, talk: async () => { await RO('Shhh, que xa empezou. E que tal a casa? Xa tes auga?'); await MA('Agua, luz y un silbato de regalo.', 'esceptico'); await RO('Iso non vén no contrato. Non me fago responsable.'); } },
    { id: 'davidN', name: 'Tío Demetrio', key: true, sheet: 'img/david-sprite.png', spec: { cw: 160, ch: 280, cols: 8 },
      get idle() { return E.dlg ? 3 : 5; }, talkFrames: [4, 9, 3, 7], x: 300, y: 430, w: 90, h: 290, at: [380, 440], face: 'L', done: () => true,
      look: () => MA('El tío Demetrio, pegado a la tele. Comenta cada jugada como si la hubiera jugado él. Algunas, según él, sí.', 'risueno'),
      give: { pilas: () => acenderTele() },
      talk: async () => {
        if (!flag('teleAcesa')) { await DA(hasItem('pilas') ? 'Esas son as pilas? Mételas no mando, home, que eu non me fío das miñas mans.' : 'As pilas, Martín! O partido non agarda. Ben, agarda, pero sen nós.'); return; }
        await DA('Viches iso? Iso marcábao eu cos ollos pechados. E de domingo.'); await MA('Y con sol, claro.', 'risueno'); await DA('Con sol! Por fin alguén con memoria nesta casa.');
      } },
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

{ // o caixón das pilas gastadas da cociña (Champions)
  const C = SCENES.casaCocina.hotspots.find(h => h.name === 'Caixóns'), actA1 = C.act, doneA1 = C.done;
  const queroPilas = () => flag('faltanPilas') && !flag('teleAcesa') && !hasItem('pilas');
  C.act = async () => {
    if (!queroPilas()) return actA1();
    give('pilas');
    await MA('El último cajón, el del caos. Gomas, un abrebotellas... y pilas gastadas, como en todas las casas. Cojo dos.', 'sonriente');
    await MA('Las froto un poco con las manos... Ya está. Para un par de clics, dan. Demetrio, aguanta.', 'convencido');
  };
  C.done = () => !queroPilas() && doneA1();
}

/* ---------- A5 · a segunda noite: o asubío vén de detrás da casa ---------- */
async function noite2() {
  await MA('Cama. Silencio. Ni un tren. Esta noche duermo de un tirón...', 'aliviado');
  E.fadeTo = 1; await sleep(900);
  setTimeout(() => SFX.whistle(), 1200);
  await cine('img/noite-dormitorio.jpg', [
    'Esa noite, outra vez...',
    'Martín: «Dos largos y uno corto. Otra vez. Pero esta vez suena... más cerca. Demasiado cerca.»',
  ]);
  await cine('img/noite-dormitorio-lampada.jpg', [
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
<p>Alguien grabó en el pilar «X. N. 1949» y, debajo, con la misma letra pero temblando, «14-I-1958». El 14 de enero de 1958 pasó algo. Y tiene que ver con él.</p>
<p>Alguien entra aquí sin llave, por la ventana del fondo, y va siempre al séptimo soporte. Se dejó un trapo con grasa de locomotora: viene del depósito.</p>
<p>El séptimo soporte tiene la tapa soldada. Los otros seis, no. Ahí dentro hay algo.</p>
<p>Y alguien silba, dos largos y uno corto, para que yo lo oiga.</p>
<p>Las cocheras del museo tienen un candado nuevo de cuatro cifras. Y en el pilar hay una fecha. Catorce, uno...</p>
<p><b>Pregunta:</b> ¿quién era Xosé N.? Y ¿quién, en el depósito, tiene tanto interés en él?</p>`);
  await MA('Un aprendiz que se hizo maquinista. Una fecha. Grasa del depósito. Y un silbato que llama a esta casa.', 'pensativo');
  await MA('Mañana, Xoán. Él se sabe todas las fechas de Monforte. A ver si se sabe esta.', 'dudoso');
  setFlag('fimActo2');
  await showDoc('<h4>FIN DO ACTO 2 · «O reencontro»</h4><p>Valerio, Andrés, a Champions con Demetrio... e un taller que alguén visita sen chave, cun nome a medias e unha data gravada no piar.</p><p>O Acto 3, «A curiosidade», chegará nun próximo hito.</p>');
}
SCENES.tallerA2 = {
  // interior do taller: ilustración de Oscar (15-11-2026). Caixón á esquerda, pegadas cara ao fondo, piar de ladrillo co trapo ao pé,
  // marcas circulares no chan á dereita, cinco fiestras e as vigas da transmisión arriba
  name: 'O taller vello', bg: 'img/bg-taller-interior.jpg', music: 'casa', floor: 'grava',
  walk: [[196, 386], [490, 380], [960, 374], [960, 540], [0, 540], [0, 448], [196, 448]],
  holes: [[[486, 474], [596, 474], [596, 506], [486, 506]]],                 // base do piar
  front: [{ y: 500, r: [490, 0, 102, 500] }],                                // o piar: Martín pasa por detrás
  scale: [380, 0.55, 540, 0.8], actorH: 300, start: [120, 505], minSpeed: 0.4,
  drawFront(c, t) {
    // a foto de 1949 cravada no piar (desaparece cando Martín a colle) e o gravado, unha vez visto co ollo; por riba da capa do piar
    if (!hasItem('foto1949') && !flag('pistaFoto')) { c.fillStyle = '#2a2018'; c.fillRect(508, 196, 64, 58); c.fillStyle = '#b9ae94'; c.fillRect(513, 201, 54, 42); c.fillStyle = '#5a5246'; for (let i = 0; i < 4; i++) c.fillRect(518 + i * 12, 218, 7, 22); }
    else { c.fillStyle = '#2a2018'; c.beginPath(); c.arc(540, 200, 2.5, 0, 7); c.fill(); }   // só queda o cravo
    if (flag('pistaData')) { c.font = 'italic 11px Georgia, serif'; c.fillStyle = 'rgba(240,230,200,.75)'; c.fillText('X.N. 1949', 512, 300); c.fillText('14-I-1958', 512, 316); }
  },
  async onEnter() {
    if (flag('tallerA2Visto')) return;
    setFlag('tallerA2Visto');
    await MA('Por fin dentro. Huele a serrín de hace setenta años y a humedad. Y a otra cosa... a grasa de máquina. Reciente.', 'pensativo');
    toast('Pista: usa o OLLO para ver o que se che escapa');
  },
  hotspots: [
    { name: 'Viga da transmisión', key: true, done: () => flag('pistaSoporte'), r: [0, 0, 960, 82], at: [640, 470], face: 'B', exit: ['vigasA2'],
      look: () => MA('La viga de la transmisión. Diez metros, siete soportes para siete poleas. Desde aquí abajo no se ve bien el último.', 'pensativo') },
    { name: 'Foto vella', key: true, when: () => !hasItem('foto1949') && !flag('pistaFoto'), r: [500, 186, 82, 76], at: [452, 484], face: 'R',
      act: async () => {
        give('foto1949');
        await MA('Una foto clavada al pilar, comida por la humedad. Un señor con bigote y tres chavales con mono delante de una sierra enorme. Me la llevo: aquí se la va a acabar de comer la humedad.', 'pensativo');
        await ITEMS.foto1949.look();
        await pistaTaller('pistaFoto');
      },
      look: () => MA('Una foto vieja clavada al pilar. Gente con mono delante de una sierra. Habrá que verla de cerca.', 'pensativo') },
    { name: 'Gravado no piar', key: true, olloOnly: 'gravadoVisto', done: () => flag('pistaData'), r: [500, 280, 82, 52], at: [452, 484], face: 'R',
      look: async () => {
        await MA('Debajo de donde estaba la foto, algo grabado a navaja en el ladrillo. Hay que acercarse mucho...', 'pensativo');
        await showDoc('<h4>Gravado a navalla no piar</h4><p style="font-size:22px;text-align:center">X. N. 1949</p><p style="font-size:22px;text-align:center;font-style:italic">14-I-1958</p><p class="sub">A mesma letra nas dúas liñas. A segunda, máis tremente, coma feita á présa.</p>');
        await MA('«X. N.», como el aprendiz de la foto. Y debajo, la misma letra, pero temblando: catorce de enero de mil novecientos cincuenta y ocho.', 'sorprendido');
        await MA('Esa fecha... Ese invierno pasó algo en el depósito. No sé qué. Pero alguien quiso dejarlo escrito donde no lo borrase nadie.', 'dudoso');
        await MA('Catorce, uno... (¿Por qué me suena a cuatro ruedecitas con números?)', 'pensativo');
        await pistaTaller('pistaData');
      } },
    { name: 'Pegadas no po', key: true, olloOnly: 'pistaPegadas', done: () => flag('pistaTrapo'), r: [240, 384, 196, 150],
      look: async () => {
        await MA('Huellas en el polvo. Recientes: el polvo de setenta años no tiene estos bordes.', 'sorprendido');
        await MA('Vienen del fondo, de debajo de las ventanas, y llegan hasta el pilar del séptimo soporte. Y vuelven. Alguien ha venido a mirar ahí arriba. Varias veces.', 'dudoso');
        if (flag('chaveTaller')) await MA('Y Concha dice que nadie le ha pedido la llave en años. Claro: este «alguien» entra por la ventana.', 'pensativo');
        setFlag('pistaPegadas');
        if (!flag('pistaTrapo')) await MA('Y donde acaban las huellas, junto al pilar, hay algo tirado. Un trapo.', 'sorprendido');
      } },
    { name: 'Trapo', key: true, done: () => flag('pistaTrapo'), r: [546, 462, 150, 50], at: [716, 494], face: 'L',
      act: async () => {
        if (flag('pistaTrapo')) return MA('El resto del trapo, donde estaba. Si el que viene lo echa en falta, sabrá que alguien ha estado aquí. Mejor que no lo sepa.', 'pensativo');
        give('trapo');
        await MA('Un trapo empapado de grasa negra y espesa... Arranco la esquina más sucia y me la llevo. El resto, que se quede donde está.', 'dudoso');
        await ITEMS.trapo.look();
        await MA('Así que el que entra aquí de noche viene del depósito. Y tiene acceso a la grasa buena.', 'pensativo');
        await pistaTaller('pistaTrapo');
      },
      look: () => MA('Un trapo tirado junto al pilar. Sucio de algo negro. No es polvo de setenta años: brilla.', 'dudoso') },
    { name: 'Caixón de madeira', r: [24, 350, 168, 92], at: [236, 470], face: 'L',
      act: async () => {
        if (!hasItem('escritura')) { give('escritura'); await MA('Entre clavos oxidados, una copia amarillenta de una escritura. 1952.', 'sorprendido'); }
        await ITEMS.escritura.look();
        await MA('La venta de la maquinaria que contó Rosario, por escrito. Treinta mil pesetas. Así se vació este taller.', 'pensativo');
      },
      look: () => MA('Un cajón de madera con herrajes. Parece de la época de las máquinas.', 'neutro') },
    { name: 'Marcas no chan', olloOnly: 'pistaPernos', r: [676, 396, 284, 122],
      look: () => MA('Círculos marcados en el cemento y, al lado, agujeros de pernos. Aquí estuvieron atornilladas las máquinas: la sierra, la cepilladora, el torno... Ahora solo queda la transmisión, allá arriba.', 'pensativo') },
    { name: 'Fiestras', r: [118, 144, 112, 162], look: () => MA('Cinco ventanas altas, de cuarterones. Por ellas entraba la luz para trabajar la madera sin encender nada. Ahorro de carpintero.', 'pensativo') },
    { name: 'Hedra', r: [776, 40, 184, 340], look: () => MA('La hiedra se ha metido por la última ventana. Setenta años sin nadie y el jardín ya se ha mudado dentro.', 'risueno') },
    { name: 'Piar', r: [490, 336, 102, 130], look: () => MA('El pilar de ladrillo que sostiene la viga, justo debajo del séptimo soporte. Ladrillo macizo, de los de antes: este no se cae ni con la Mikado encima.', 'pensativo') },
    { name: 'Patio', key: true, r: [0, 444, 70, 96], at: [40, 506], face: 'L', exit: ['casaPatio', [836, 500]], door: true, hint: 'L',
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
    'aguaAlta', 'noiteAviso', 'noiteActo1', 'fimActo1', 'vistaSalon', 'sabeChaveTaller', 'navallaCollida', 'eladioNogal', 'cadeiraPosta', 'desapCafe']) F[k] = true;
  const i = ACTS.findIndex(a => a.id === 'acto2');
  ACTS[i] = { id: 'acto2', name: 'Acto 2 · O reencontro', desc: 'Martes e mércores: o candado novo, Valerio, Mega Andrés, a Champions na Fraternal e o taller da Casa Juana',
    scene: 'praza', at: [780, 420], inv: ['chavesCasa', 'contrato', 'navalla'], flags: F, intro: () => primeiroTurno() };
}

/* ---------- A2 · Xoán no vestíbulo no Acto 2 (cambio 8 da revisión Gilbert) ----------
   O Acto 1 remata con «Mañana, Xoán»: no martes e no mércores Xoán está na estación e escápase polas ramas. */
{
  const xoanA1 = xoanTalk;
  xoanTalk = async () => {
    if (!flag('fimActo1')) return xoanA1();
    if (!flag('a2XoanSauda')) {
      setFlag('a2XoanSauda');
      await XO('Martín! Que tal a primeira noite na casa roxa? Ben de vento?');
      await MA('De vento, poco. De silbato, bastante. Dos largos y uno corto, a medianoche.', 'esceptico');
      await XO('Un asubío? Será un graciosiño. Ou un mercancías que pasou tarde. Ou o vento, que en Monforte asubía moi ben.');
      await MA('El viento no silba en código, Xoán.', 'esceptico');
      await XO('Ti non coñeces o vento de Monforte. Ten estudos.');
      await MA('(Lleva dos frases mirando el mural para no mirarme a mí.)', 'pensativo');
    } else await XO('Volves? O mural segue no seu sitio. Eu tamén.');
    for (;;) {
      const opts = [
        { t: '¿De verdad no has oído el silbato?', k: 'asubio' },
        ...(!flag('xoanCandadoV') ? [{ t: 'En las cocheras del museo hay un candado nuevo.', k: 'candado' }] : []),
        { t: '¿Qué cuenta ese mural?', k: 'mural' },
        { t: 'Me voy, que tengo cosas que hacer.', k: 'adeus' },
      ];
      const k = opts[await choose(opts)].k;
      if (k === 'asubio') {
        await XO('Oíno. Coma todo o barrio. Pero eu durmo con tapóns, e cos tapóns todo soa a vento.');
        await MA('Valerio vende tapones. Qué casualidad, otra vez.', 'esceptico');
        await XO('Monforte é pequeno. As casualidades veñen en fila.');
      }
      if (k === 'candado') {
        await XO('Nas cocheras? Iso será cousa de Adif. Ou do museo. Eu son de Renfe: de candados sei o xusto para non perder o tren.');
        await MA('(Para alguien que se sabe el ancho del vestíbulo en baldosas, hoy sabe muy poco.)', 'dudoso');
        setFlag('xoanCandadoV');
      }
      if (k === 'mural') await XO('O mural? 1954, Inchaurbe, Monforte no medio. Ese si que non cambia. Por iso me gusta.');
      if (k === 'adeus') { await XO('Vai, vai. E de noite, pecha ben a fiestra. Polo vento.'); return; }
    }
  };
  const X = SCENES.vestibulo.npcs.find(n => n.id === 'xoan'), dX = X.done;
  X.done = () => flag('fimActo1') ? flag('a2XoanSauda') : dX();
  X.give.foto1949 = async () => { await XO('...Onde atopaches isto?'); await MA('En mi taller. Clavada a un pilar.', 'dudoso'); await XO('Gárdaa ben. Moi ben. Xa falaremos.'); };
}

/* ---------- caderno de Martín · Acto 2 ---------- */
{
  const A2 = () => flag('fimActo1') && !flag('fimActo2');
  CADERNO.push(
    { when: () => A2() && !flag('objValerio'), t: 'Hablar con Concha, en el quiosco: ella sabe dónde anda todo el mundo. (Y Xoán, en la estación, quizá sepa quién silba.)' },
    { when: () => A2() && flag('objValerio') && !flag('valerioFeito'), t: () => flag('valerioDoce') ? (hasItem('ositos') ? 'Darle los ositos a Valerio, en la farmacia del Cardeal. Su «peaje» por la crema.' : 'Valerio no suelta la crema sin algo dulce. Ositos de goma, en el quiosco de Concha.') : 'Pasar por la farmacia de Valerio: calle del Cardeal (en el mapa).' },
    { when: () => A2() && flag('objAndres') && !flag('andresFeito'), t: () => 'La revancha de natación con Mega Andrés, en el Club Fluvial (en el mapa).' + (!hasItem('crema') && !flag('cremaPosta') ? ' Antes, algo para estos gemelos.' : '') },
    { when: () => A2() && flag('avisoChampions') && !flag('champions') && (!flag('faltanPilas') || flag('teleAcesa')), t: 'Champions en la Fraternal, con el tío Demetrio. Hay cosas que no se negocian.' },
    { when: () => A2() && flag('faltanPilas') && !flag('teleAcesa') && !hasItem('pilas'), t: 'Pilas para el mando de la Fraternal: el cajón de la cocina de casa, el de las pilas gastadas.' },
    { when: () => A2() && hasItem('pilas') && !flag('teleAcesa'), t: 'Volver a la Fraternal y darle vida al mando con las pilas frotadas.' },
    { when: () => A2() && flag('champions') && !flag('silbato2'), t: 'A dormir. El dormitorio, a la izquierda del salón.' },
    { when: () => A2() && flag('silbato2') && !hasItem('chave') && !flag('tallerAberto'), t: 'La llave del taller: la tiene Concha. Quiere un detalle... algo dulce de su propio quiosco.' },
    { when: () => A2() && hasItem('chave') && !flag('tallerAberto'), t: 'Abrir el taller, al fondo del patio de casa.' },
    { when: () => A2() && flag('tallerAberto'), t: () => `Revisar el taller con calma. Con el OLLO se ve lo que se escapa, y las vigas de arriba también cuentan. Pistas: ${PISTAS_TALLER.filter(flag).length} de ${PISTAS_TALLER.length}.` },
    { when: () => flag('fimActo2'), t: 'Preguntarle a Xoán quién era Xosé N. Y probar ese candado nuevo de las cocheras. (Acto 3, próximamente.)' },
  );
}
