'use strict';
/* ==========================================================
   VÍA MORTA · Acto 2 «O reencontro» (versión intermedia elixida por Oscar, 14-11-2026)
   Martes: primeiro turno (candado novo) → Concha reparte os encargos → Valerio (Farmacia de la Estación, rúa Calvo Sotelo, pasando pola Panadería Estación: pasteis de crema de Genaro)
   e Mega Andrés (Club Fluvial), en calquera orde → Champions na Fraternal → segunda noite (o asubío vén do taller).
   Mércores: a chave do taller (Concha, a cambio dun detalle: unha novidade, o carbón do Fluvial) → o taller e as catro pistas → FIN DO ACTO 2.
   Sen Brais nin a Volta do Castelo. Fichas: docs/05_FICHAS_ESCENARIOS.md, sección «Acto 2».
   Fondos: rúa da farmacia (Calvo Sotelo), farmacia e Club Fluvial son ilustracións de Oscar (a carretilla e os sacos de carbón do Fluvial píntanse por código).
   Martín fala en castelán; os NPC, en galego; a interface, en galego.
   ========================================================== */
const VA = t => say('Valerio', t);
const AN = t => say('Mega Andrés', t);
const GE = (t, m) => say('Genaro', t, m);
const GE4 = (t, m) => say('Genaro (a ti)', t, m);   // cuarta parede: fala ao xogador, non a Martín
Object.assign(PORTRAIT_COLORS, { 'Valerio': '#9fe0b0', 'Mega Andrés': '#ffd27a', 'Genaro': '#f4d9a0', 'Genaro (a ti)': '#f4d9a0' });

/* ---------- obxectos novos ---------- */
Object.assign(ico, {
  pasteis(c) { c.fillStyle = '#f2f2ee'; c.fillRect(4, 32, 40, 6); for (const x of [10, 24, 38]) { c.fillStyle = '#d9a050'; c.beginPath(); c.ellipse(x, 28, 7, 6, 0, 0, 7); c.fill(); c.fillStyle = '#fff2b0'; c.beginPath(); c.ellipse(x, 24, 5, 3, 0, 0, 7); c.fill(); } },
  crema(c) { c.fillStyle = '#e8f0f4'; c.beginPath(); c.moveTo(10, 14); c.lineTo(34, 14); c.lineTo(38, 40); c.lineTo(14, 40); c.closePath(); c.fill(); c.fillStyle = '#1aa860'; c.fillRect(18, 22, 12, 4); c.fillRect(22, 18, 4, 12); c.fillStyle = '#3a6aa8'; c.fillRect(34, 8, 8, 10); },
});
Object.assign(ITEMS, {
  pasteis: { name: 'Pasteis de crema', icon: ico.pasteis, look: () => MA('Tres pasteles de crema de la Panadería Estación, en su bandejita de cartón. Huelen a domingo. Son para Valerio. Casi todos.', 'risueno') },
  crema: { name: 'Crema de agulletas', icon: ico.crema, look: () => MA('Crema para las agujetas, «de muestra». Huele a pino, a vestuario de instituto y a derrota digna.', 'risueno') },
});

/* Valerio e Mega Andrés: sprites das follas de Oscar (tools/sprite-valerio.py e tools/sprite-andres.py). */
Object.assign(PORTRAITS, { 'Valerio': 'img/valerio-face.png', 'Mega Andrés': 'img/andres-face.png', 'Genaro': 'img/genaro/sonriente.webp', 'Genaro (a ti)': 'img/genaro/apelando.webp' });
/* expresións de Genaro (folla de Oscar, tools/expresiones-genaro.py): o retrato cambia segundo a frase */
const GENARO_EXP = ['sonriente', 'hablando', 'explicando', 'brazos-cruzados', 'pensativo', 'oh', 'riendo', 'triste', 'enfadado', 'asustado', 'preocupado', 'aburrido',
  'gritando-enfadado', 'rascandose', 'guino', 'dudoso', 'rezando', 'celebrando', 'neutro', 'esceptico', 'resignado', 'gritando', 'contento', 'serio',
  'apelando'];   // apelando: o debuxo grande de Oscar, falando ao xogador (cuarta parede)
PORTRAIT_MOODS['Genaro'] = PORTRAIT_MOODS['Genaro (a ti)'] = Object.fromEntries(GENARO_EXP.map(e => [e, `img/genaro/${e}.webp`]));

/* ---------- C2 · cinemática da primeira quenda (martes) ----------
   js/cinematica2.js (CINE2), guion A «Primeira quenda»: a Mikado ao amencer, a xornada diante das cocheras,
   o carril engraxado e as pegadas, o candado novo da porta dereita e Xoán, que non quere falar del.
   Sáltase só co botón «Saltar cinemática». Non di de que tipo é o candado. */
async function primeiroTurno() {
  E.act = 'acto2';
  SFX.music(null);
  await CINE2.play();
  setFlag('a2Inicio');
  await goScene('praza');
  await MA('Primer turno superado. Y los gemelos, destrozados: lo de subirme ayer a la silla del Concello me ha dejado las piernas de un señor de ochenta años.', 'frustrado');
  await MA('Y con tanto trabajo el primer día, se me ha olvidado preguntarle a Xoán por el silbido. Solo le saqué lo del candado, y me despachó. Ya lo haré más tarde, después de ver a los de siempre.', 'avergonzado');
  await MA('Para saber dónde anda todo el mundo en Monforte no hace falta GPS: hace falta Concha.', 'sonriente');
  toast('Novo obxectivo: falar con Concha, no quiosco da praza');
}

/* ---------- a mañá do martes (cambio 2 da 3.ª revisión Gilbert) ----------
   Entre a cinemática do final do Acto 1 e a do primeiro turno, un respiro xogable: Martín esperta no salón
   e é o xogador quen sae á rúa. A porta lanza «Primeira quenda». */
async function espertarMartes() {
  E.act = 'acto2';
  await goScene('casaSalon', [170, 492]);
  E.fadeTo = 0;
  await MA('Martes, seis de la mañana. He dormido cuatro horas, y tres eran de silbato.', 'esceptico');
  await MA('Primer turno en el depósito. Y hoy, Xoán: él sabrá quién silba así. O conocerá a alguien que lo sepa.', 'pensativo');
  toast('Novo obxectivo: primeiro turno no depósito (sae á rúa pola porta de abaixo)');
}
{
  const S = SCENES.casaSalon.hotspots.find(h => h.name === 'Saír á rúa'), actA1 = S.act, lookA1 = S.look;
  S.act = () => flag('fimActo1') && !flag('a2Inicio') ? primeiroTurno() : actA1();
  S.look = () => flag('fimActo1') && !flag('a2Inicio') ? MA('La puerta de la calle. Detrás, el primer turno. Delante, un hombre que ha dormido cuatro horas.', 'esceptico') : lookA1();
}

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
      ...(flag('silbato2') && flag('chaveNovidade') && !hasItem('chave') && !flag('tallerAberto') ? [{ t: 'Te traigo una noticia que no sabe nadie.', k: 'detalle' }] : []),
      ...((flag('sombraPatio') || flag('sombraVista')) && !flag('conchaSombra') ? [{ t: 'El lunes vi una sombra saltar el muro de mi patio.', k: 'sombra' }] : []),
      ...(!hasItem('ositos') ? [{ t: 'Una bolsa de ositos, de los de siempre.', k: 'ositos' }] : []),
      ...(!hasItem('xornal') ? [{ t: 'El periódico de hoy, por favor.', k: 'xornal' }] : []),
      { t: 'Hasta luego, Concha.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'sombra') {
      setFlag('conchaSombra');
      await CO('Unha sombra? No muro da casa roxa? Ai, iso non o sabía.');
      await CO('Pero unha sombra non é unha novidade, Martiño: é media. A novidade é de quen é a sombra. Cando o saibas, vés e cóntasmo.');
      await MA('Concha no quiere rumores: quiere nombres. Y yo, de momento, solo tengo un muro.', 'pensativo');
    }
    if (k === 'conto') {
      if (!flag('objValerio')) {
        await CO('Que se conta? Pois que Valerio, o da Farmacia de la Estación, preguntou por ti. Aí arriba, en Calvo Sotelo, saíndo por detrás do meu quiosco. Que pases, que non che cobra.');
        await CO('E Mega Andrés, o do chiringuito do Fluvial, anda dicindo por aí que lle debes unha revancha de natación dende o instituto.');
        await MA('¿Una revancha? Le gané yo. Por una brazada. Él dice que fue salida nula.', 'risueno');
        await CO('Pois arregládeo na auga. Eu dende aquí non vexo a piscina, pero vou saber quen gañou antes ca vós.');
        setFlag('objValerio'); setFlag('objAndres');
        toast('Novo obxectivo: Valerio (Farmacia de la Estación, rúa Calvo Sotelo, xunto ao quiosco) e Andrés (mapa, Club Fluvial)');
      } else if (flag('silbato2')) {
        await CO('Que se conta? Que onte á noite volveu soar o tren pantasma. E que a ti viuse baixar ao patio en pixama. De raias.');
        await MA('¿Quién me ha visto? ¡Si eran las tantas!', 'avergonzado');
        await CO('En Monforte sempre hai alguén mirando. Eu non. Eu só escoito.');
      } else {
        await CO('Que se conta? Que esta noite hai Champions e Demetrio xa anda contando o gol ao Ourense para quentar.');
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
      await CO('E nada de doces nin de flores. A min págaseme en novidades: algo que non saiba ninguén en Monforte. Ninguén é ninguén. Nin eu.');
      await MA('(Una noticia que no sepa ni Concha. Algo que me hayan contado a mí... y a nadie más.)', 'pensativo');
      setFlag('chaveNovidade');
    }
    if (k === 'detalle') { if (await conchaNovidade()) return; }
    if (k === 'ositos') {
      await CO('Os de sempre! Un euro.');
      give('ositos');
      await MA(flag('silbato2') ? 'Un euro. Y ahora, con toda la ceremonia, se los regalo a ella. Un circuito comercial perfecto.' : 'Un euro, como ayer. Esta vez no me los como en el camino. Bueno, solo uno.', 'risueno');
    }
    if (k === 'xornal') { await CO('O xornal de hoxe. Xa o lin, pero vai coma novo.'); give('xornal'); }
    if (k === 'adeus') { await CO('Vai, vai. E pecha ben de noite.'); return; }
  }
}
/* cambio 8 da 3.ª revisión Gilbert: a chave do taller págase cunha novidade, non con doces (Valerio cobra en pasteis).
   A boa é a do carbón que lle desaparece a Andrés (sempre se sabe antes da Champions); as outras teñen a súa broma. */
async function conchaNovidade() {
  const opts = [
    { t: 'Que anoche volvió a sonar el silbato.', k: 'asubio' },
    { t: flag('natacionGanada') ? 'Que le gané la revancha a Andrés.' : 'Que Andrés y yo empatamos la revancha.', k: 'andres' },
    ...(!flag('a2Candado') ? [{ t: 'Que hay un candado nuevo en las cocheras del museo.', k: 'candado' }] : []),
    { t: 'Que en el Fluvial alguien roba carbón... y lo paga.', k: 'carbon' },
    { t: 'Mejor me lo pienso.', k: 'nada' },
  ];
  const k = opts[await choose(opts)].k;
  if (k === 'asubio') { await CO('Iso? Contéicho eu esta mañá, rapaz. Non me vendas o meu propio xornal.'); return false; }
  if (k === 'andres') { await CO(flag('natacionGanada') ? 'Por unha brazada. Andrés di que foi saída nula. Contoumo antes de secarse.' : 'Empate técnico e un mojito. Andrés contoumo antes de secarse. Dixo que non mo contaba, e contoumo dúas veces.'); return false; }
  if (k === 'candado') { await CO('Un candado novo? Iso vese dende a rúa, rapaz. Iso non é unha novidade: é unha paisaxe. Pero grazas.'); setFlag('a2Candado'); return false; }
  if (k === 'nada') { await CO('Pensa, pensa. Eu aquí sigo. Sempre sigo aquí.'); return false; }
  await conchaChaveTaller();
  return true;
}
async function conchaChaveTaller() {
  await MA('En el Fluvial, cada dos o tres semanas, a Andrés le desaparece un saco de carbón. Del de piedra. Y al día siguiente, debajo de una piedra, veinte euros.', 'pensativo');
  await CO('...');
  await CO('Un ladrón que paga?! E eu sen sabelo?! Iso non o sabe ninguén. Ata agora.');
  await CO('Carbón de pedra... Iso hai anos que non o merca ninguén en Monforte. Ninguén que eu saiba. E eu sei todo.');
  await MA('Por eso te lo cuento. Dos cabezas piensan más que una. Y una de ellas tiene quiosco.', 'risueno');
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
  N.give.ositos = () => flag('fimActo1') && flag('silbato2') && !hasItem('chave') && !flag('tallerAberto') ? CO('Ositos? Que detalle... pero non. A esa chave non se lle paga en doce: págase en novidades.')
    : flag('fimActo1') ? CO(flag('silbato2') ? 'Ositos para min? Agora non, rapaz. Gárdaos para cando me pidas algo.' : 'Os ositos? Gárdaos, que aínda non me pediches nada. E eu sei esperar.') : ositosA1();
}

/* ---------- Mapa no Acto 2 ----------
   Andrés abre o Club Fluvial. A farmacia de Valerio xa non está no Cardeal: está en Calvo Sotelo, saíndo da praza 2 polo
   noroeste (cambio pedido por Oscar o 15-11-2026). O Cardeal queda pechado no Acto 2 ata que Oscar decida que facer con el. */
{
  ZONAS.find(z => z.id === 'fluvial').open = () => flag('objAndres');
  ZONAS.find(z => z.id === 'cardeal').open = () => false;
  const M = SCENES.mapa.hotspots, cardeal = M.find(h => h.name === 'Rúa do Cardeal'), fluvial = M.find(h => h.name === 'Club Fluvial'), castelo = M.find(h => h.name === 'Castelo de San Vicente');
  const cardealA1 = cardeal.act, fluvialA1 = fluvial.act, casteloA1 = castelo.look;
  cardeal.act = () => flag('fimActo1') ? mapaPechado('La calle del Cardeal, la de los bares. Hoy no: lo que busco está en el barrio de la estación. La farmacia de Valerio, en Calvo Sotelo, al lado del quiosco de Concha.', '')
    : cardealA1();
  fluvial.act = () => flag('objAndres') ? goScene('fluvial', [900, 490])
    : flag('fimActo1') ? MA('El Club Fluvial. ¿Bañarme yo solo, un martes, con estas piernas? Sin un buen motivo, no. Concha seguro que tiene uno.', 'esceptico')
    : fluvialA1();
  castelo.look = () => flag('fimActo1') ? MA('El castillo de San Vicente, otro día. Hoy mis gemelos no suben ni a una silla. Y ya sé lo que pasa cuando me subo a una silla.', 'frustrado') : casteloA1();
}

/* ---------- B0 · Rúa Calvo Sotelo, primeiro tramo: Panadería Estación (ilustración de Oscar, 16-11-2026) ----------
   Entre a praza da estación e a farmacia: para ir á farmacia pásase antes por aquí. Panadería de ficción.
   Genaro, o panadeiro (folla de Oscar, tools/sprite-genaro.py), vende os pasteis de crema que Valerio pide pola crema de agulletas. */
async function genaroTalk() {
  if (!flag('genaroSauda')) {
    await GE('Bo día! Ti es o da casa roxa. Non mo digas: Concha. Pasou ás oito a por unha barra e contoume a túa vida en tres minutos. A barra levouna sen cortar, de tanto que falaba.', 'hablando');
    await MA('En Monforte las noticias llegan antes que el pan.', 'risueno');
    await GE('O pan sae ás sete. As novidades, ás seis. Eu érguome ás catro: son o primeiro en sabelo todo e o último en contalo.', 'sonriente');
    setFlag('genaroSauda');
  } else await GE(flag('valerioFeito') ? 'Que, chegaron os pasteis enteiros á farmacia? Non me mintas, que coñezo a Valerio.' : flag('valerioDoce') && !hasItem('pasteis') ? 'Xa sei a que vés. Cheirábache a crema dende a farmacia, eh?' : 'Outra vez por aquí? Iso é que te chamou o cheiro.', 'brazos-cruzados');
  if (flag('genaroCuarta') && flag('valerioDoce') && !flag('valerioFeito') && !hasItem('pasteis') && !flag('genaroCuarta2')) {   // segunda e última chiscadela ao xogador
    setFlag('genaroCuarta2'); E.cuartaT0 = E.t; SFX.music(null);
    try {
      await GE4('Psst. Ti outra vez. Martín vén a por pasteis e aínda non sabe como pedilos. Ti si.', 'gritando');
      await GE4('Non lle digas que cho dixen. Os protagonistas son moi susceptibles.', 'guino');
    } finally { E.cuartaT0 = null; SFX.music(E.scene.music); }
  }
  for (;;) {
    const opts = [
      { t: '¿Qué tienes hoy de bueno?', k: 'bo' },
      ...(flag('valerioDoce') && !flag('valerioFeito') && !hasItem('pasteis') ? [{ t: 'Tres pasteles de crema, por favor.', k: 'mercar' }] : []),
      { t: '¿Y esas obras?', k: 'obras' },
      { t: '¿Y el local de al lado, el de «Se vende»?', k: 'sevende' },
      { t: 'Si madrugas tanto... ¿no oyes nada raro de noche?', k: 'asubio' },
      { t: '¿Y tú qué haces cuando no estás amasando?', k: 'xogos' },
      ...(milloPreciso() && flag('milloVisto') && !hasItem('millo') ? [{ t: '(Despistarlo.) Oye, Genaro... ¿eso que huele no es la broa quemándose?', k: 'despiste' }] : []),
      { t: 'Hasta luego, Genaro.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'bo') {
      await GE('Bolla de manteiga, empanada de raxo e pasteis de crema. Os de crema voan: Valerio, o da farmacia, lévame tres cada tarde.', 'explicando');
      await GE('«Para os clientes», di. Os clientes non os viron nunca.', 'esceptico');
      await MA('Valerio... ya robaba los caramelos de eucalipto de su padre en el instituto. Hay vocaciones que no se pierden.', 'risueno');
      if (!flag('valerioDoce')) await MA('(Y yo con hambre. Pero si me compro pasteles sin motivo, me los como por el camino.)', 'pensativo');
      setFlag('genaroPasteis');
    }
    if (k === 'mercar') {
      await GE('Tres de crema... Iso é o pedido de Valerio. Mandoute el, non? Ese home non pide favores: pide peaxes.', 'dudoso');
      await MA('Me cobra la crema de agujetas en crema pastelera.', 'esceptico');
      await GE('Crema por crema. E logo din que en Monforte non hai economía circular. Tres euros.', 'riendo');
      await GE('Vanche en bandexa, que se os levas na man chegan á farmacia feitos marmelada.', 'hablando');
      give('pasteis'); setFlag('genaroPasteis');
      await MA('Tres euros. El peaje más dulce de toda la calle Calvo Sotelo.', 'sonriente');
      await GE('Obxecto conseguido: «Pasteis de Valerio». Agora lévallos antes de que se che crucen pola cabeza. Hai xogos nos que comerte o obxecto da misión é o final malo.', 'celebrando');
    }
    if (k === 'obras') {
      await GE('Tres semanas leva así. Abriron a rúa para cambiar as tubaxes e atoparon debaixo outras tubaxes máis vellas. E debaixo desas, outras.', 'aburrido');
      await GE('Agora non saben se arranxar a rúa ou chamar a un arqueólogo.', 'resignado');
      await MA('Monforte por capas. Como un milhojas.', 'risueno');
      await GE('Non me deas ideas, que mañá fago milfollas «da obra» e véndoos ao dobre.', 'riendo');
    }
    if (k === 'sevende') {
      await GE('Foi unha mercería, hai moitos anos. O cartel leva aí tanto tempo que xa non o le ninguén. Algún turista fíxolle unha foto: pensaba que era arte.', 'triste');
      await MA('Calle arriba, «Se aluga». Aquí, «Se vende». Monforte está de rebajas.', 'pensativo');
      await GE('Se o mercas ti, fágoche desconto no pan. Un veciño máis é un cliente máis. E un cliente máis, en Calvo Sotelo, é case unha festa.', 'contento');
    }
    if (k === 'asubio') {
      await GE('Ás catro da mañá, en Monforte, estamos o forno, eu, os gatos... e ese asubío do que fala todo o mundo. Hai noites que o oio e noites que non.', 'serio');
      await MA('¿Y no te pica la curiosidad?', 'dudoso');
      await GE('A min pícame a masa, se leveda ou non leveda. O demais, se ten que saír, sae coma o pan: á súa hora.', 'pensativo');
    }
    if (k === 'xogos') {   // dato de Oscar (16-11-2026): Genaro é moi afeccionado aos videoxogos e platina todo
      await GE('Xogar. Aventuras gráficas, sobre todo: das de apuntar e premer. E platínoas todas. Todas. Ata as que non teñen platino: póñoo eu.', 'celebrando');
      await MA('¿Platinar? ¿Eso no es cosa de joyeros?', 'dudoso');
      await GE('É conseguilo todo, rapaz. Mirar cada cousa, falar con cada un, probar cada obxecto con cada porta. Coma ti, que entraches nesta rúa mirando ata a tapa do sumidoiro.', 'explicando');
      await MA('Es que en esta calle cada cosa tiene su historia.', 'pensativo');
      await GE('Iso din todos os protagonistas. Consello de xogador vello: se alguén che pide algo raro, é que xa o viches noutra pantalla. Os bos xogos non fan trampas.', 'hablando');
      await GE('E se te atascas, nada de mirar a solución no móbil. Vés aquí, mércasme unha bolla e pensamos xuntos. A bolla axuda.', 'sonriente');
      await MA('Un panadero que platina la vida. Me lo apunto en el cuaderno. Literalmente.', 'risueno');
      if (!flag('genaroCuarta')) { setFlag('genaroCuarta'); await genaroCuartaParede(); }
    }
    if (k === 'despiste') {
      await GE('A broa?! Se se me queima a broa, Concha sábeo antes ca min!', 'asustado');
      await MA('(Ahora o nunca.)', 'pensativo');
      setFlag('genaroDentro'); SFX.door && SFX.door();
      return;
    }
    if (k === 'adeus') { await GE('Vai, e mira por onde pisas: entre as vallas e as tapas, esta rúa é unha carreira de obstáculos.', 'contento'); return; }
  }
}
/* idea de Oscar (16-11-2026): Genaro rompe a cuarta parede unha vez. Vira a cara ao xogador (cela 6, de fronte)
   e fálalle a el; Martín non se entera. Non bloquea nada. */
async function genaroCuartaParede() {
  const G = SCENES.panaderia.npcs.find(n => n.id === 'genaro'), idle = G.idle, tf = G.talkFrames, fl = G.flip;
  G.idle = 6; G.talkFrames = [6, 7]; G.flip = false; SFX.music(null); E.cuartaT0 = E.t;
  try {
    await GE4('...', 'serio');
    await GE4('Ti. Si, ti. O do outro lado da pantalla. Martín non me oe: está moi ocupado cos seus xemelgos.', 'apelando');
    await GE4('Se estás falando cun panadeiro en vez de ir á farmacia, xa sei que es dos meus: dos que platinan.', 'riendo');
    await GE4('Un consello entre nós: mantén o dedo premido sobre as cousas, ou dálles co botón dereito. Aquí todo ten algo que dicir. Ata a reixa.', 'apelando');
    await GE4('E cando remates o xogo, volve a esta rúa. Non hai trofeo. Pero eu sabereino.', 'guino');
  } finally { G.idle = idle; G.talkFrames = tf; G.flip = fl; E.cuartaT0 = null; SFX.music(E.scene.music); }
  await MA('¿Con quién hablas, Genaro?', 'dudoso');
  await GE('Cos gatos. Ás catro da mañá fálolles moito. Hoxe adianteime.', 'rascandose');
}
/* ---------- o cambiazo do serrín polo millo (idea de Oscar, 16-11-2026) ----------
   O saco de serrín cóllese na porta de Maderas Somel (rúa da farmacia). Os sacos de millo da broa están ao pé da
   panadería: con Genaro diante, «iso non se toca». Despístase (a broa queimándose), Genaro entra no forno e Martín
   cambia un saco por outro. Tempo de Hollywood: Genaro non volve ata que Martín fai algo cos sacos ou sae da rúa.
   O millo só ten sentido no Acto 4 (as pombas do taller, js/pombas.js); antes, a opción de despistar non sae. Repetible. */
const milloPreciso = () => flag('pombaVista') || flag('tapaGolpe');
ico.serrin = c => { c.fillStyle = '#e8dcc0'; c.beginPath(); c.moveTo(12, 14); c.quadraticCurveTo(8, 42, 24, 42); c.quadraticCurveTo(40, 42, 36, 14); c.closePath(); c.fill();
  c.strokeStyle = '#8a7650'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#c8a870'; for (let i = 0; i < 9; i++) c.fillRect(16 + (i * 7) % 16, 22 + (i * 5) % 16, 3, 2); c.fillStyle = '#8a7650'; c.fillRect(18, 10, 12, 5); };
if (!ITEMS.serrin) ITEMS.serrin = { name: 'Saco de serrín', icon: ico.serrin,
  look: () => MA('Un saco de serrín de Maderas Somel. Pesa como un saco de harina y huele a pino. No sé para qué, pero tal vez me resulte útil.', 'pensativo') };
ico.millo = ico.millo || (c => { c.fillStyle = '#d9c08a'; c.beginPath(); c.moveTo(12, 14); c.quadraticCurveTo(8, 42, 24, 42); c.quadraticCurveTo(40, 42, 36, 14); c.closePath(); c.fill();
  c.strokeStyle = '#7a5a2a'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#f2c020'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(16 + (i * 7) % 16, 22 + (i * 5) % 16, 2, 0, 7); c.fill(); } c.fillStyle = '#7a5a2a'; c.fillRect(18, 10, 12, 5); });
if (!ITEMS.millo) ITEMS.millo = { name: 'Saco de millo', icon: ico.millo,
  look: () => MA('Un saco de maíz de la panadería de Genaro. En su sitio dejé uno de serrín. Mismo peso, mismo saco... distinta broa.', 'avergonzado') };
function sacoDraw(c, x, y, k, cor, gran) {
  c.save(); c.translate(x, y); c.scale(k, k);
  c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(0, 0, 20, 5, 0, 0, 7); c.fill();
  c.fillStyle = cor; c.strokeStyle = '#4a3a22'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-17, 0); c.quadraticCurveTo(-22, -26, -11, -38); c.lineTo(11, -38); c.quadraticCurveTo(22, -26, 17, 0); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(-8, -38); c.lineTo(-5, -45); c.lineTo(5, -45); c.lineTo(8, -38); c.fill(); c.stroke();
  c.fillStyle = gran; for (let i = 0; i < 6; i++) c.fillRect(-10 + (i * 7) % 18, -30 + (i * 9) % 22, 3, 2);
  c.restore();
}
async function genaroVolve(trocado) {
  await sleep(500); setFlag('genaroDentro', false);
  await GE('Falsa alarma: a broa estaba perfecta. Será o forno da veciña, que esa queima ata a auga.', 'resignado');
  if (!trocado) return;
  await MA('(Ni se ha fijado en los sacos. Bien.)', 'sonriente');
  E.cuartaT0 = E.t; SFX.music(null);
  try { await GE4('Eu non vin nada. Ti tampouco. Pero este cambiazo vaiche dar un trofeo, xa verás.', 'guino'); }
  finally { E.cuartaT0 = null; SFX.music(E.scene.music); }
}
SCENES.panaderia = {
  name: 'Rúa Calvo Sotelo · Panadería Estación', bg: 'img/bg-panaderia.jpg', music: 'estacion', floor: 'pedra',
  walk: [[660, 540], [960, 540], [960, 524], [800, 480], [700, 454], [600, 430], [520, 406], [440, 378], [360, 350], [326, 340], [352, 356], [412, 386], [470, 420], [512, 450], [570, 490]],
  scale: [330, 0.03, 540, 0.58], actorH: 300, start: [452, 386], minSpeed: 0.5,
  onEnter() { setFlag('genaroDentro', false); for (const e of GENARO_EXP) img(`img/genaro/${e}.webp`); },
  draw(c) { sacoDraw(c, 812, 482, 1, '#d9c08a', '#f2c020'); sacoDraw(c, 846, 486, 1.05, '#d4b880', '#f2c020'); },   // precarga as expresións (24 × ~15 KB)
  // cuarta parede: a rúa escurece e Genaro aparece en primeiro plano, de fronte, mirando ao xogador
  drawFront(c, t) {
    if (E.cuartaT0 == null) return;
    const k = Math.min(1, (t - E.cuartaT0) / 0.6), talking = E.dlg && E.dlg.who === 'Genaro (a ti)' && E.dlg.shown < E.dlg.text.length;
    c.save(); c.fillStyle = `rgba(10,8,6,${0.72 * k})`; c.fillRect(0, 0, W, H); c.globalAlpha = k;
    const mood = (E.dlg && E.dlg.who === 'Genaro (a ti)' && E.dlg.mood) || 'serio', im = img(`img/genaro/${mood}.webp`), sz = mood === 'apelando' ? 400 : 430, base = mood === 'apelando' ? 412 : 395;
    if (im) c.drawImage(im, 480 - sz / 2, base - sz + (1 - k) * 40 + (talking ? Math.abs(Math.sin(t * 9)) * 3 : 0), sz, sz);
    c.restore();
  },
  front: [
    { y: 446, r: [466, 222, 46, 222] },   // tronco da árbore de diante
    { y: 366, r: [372, 196, 32, 168] },   // a segunda árbore
  ],
  hotspots: [
    { name: 'Farmacia de la Estación', key: true, r: [640, 510, 320, 30], at: [800, 530], face: 'F', exit: ['calvoSotelo', [880, 505]], hint: 'D',
      look: () => MA('Por aquí, hacia el sur, la Farmacia de la Estación, la de Valerio. La de la cruz verde de toda la vida.', 'pensativo') },
    { name: 'Praza da Estación', key: true, r: [296, 318, 100, 44], at: [346, 350], face: 'B', exit: ['praza2', [450, 346]], hint: 'U',
      look: () => MA('Al fondo de la calle, la plaza de la estación y el quiosco de Concha. Medio minuto, si no me para nadie. En Monforte siempre te para alguien.', 'pensativo') },
    { name: 'Sacos de millo', key: true, done: () => hasItem('millo') || !milloPreciso(), r: [788, 432, 80, 58], at: [780, 505], face: 'R',
      look: () => MA(flag('genaroDentro') ? 'Los sacos de maíz, solos. Genaro está dentro con la broa. Es el momento.' : 'Sacos de harina de maíz, de los gordos, al pie de la panadería. Para la broa. Genaro los vigila como si fueran lingotes.', 'pensativo'),
      act: async () => {
        setFlag('milloVisto');
        if (hasItem('millo')) return MA('Ya tengo uno. Dos sería abusar, y Genaro acabaría haciendo broa de serrín de verdad.', 'avergonzado');
        if (!flag('genaroDentro')) {
          await GE('Eh, eh! Iso non se toca, rapaz. É fariña de millo para a broa. Ten máis valor ca o pan que levas na barriga.', 'enfadado');
          return MA(milloPreciso() ? '(Con él delante, imposible. Tendría que entretenerlo un momento... y no dejar un hueco que se note.)' : 'Perdona, perdona. Solo miraba. Tampoco sabría qué hacer con un saco de maíz.', milloPreciso() ? 'pensativo' : 'avergonzado');
        }
        if (!hasItem('serrin')) {
          await MA('Si me llevo un saco sin más, Genaro verá el hueco en cuanto salga. Necesito algo que ocupe su sitio: otro saco que pese lo mismo.', 'pensativo');
          await MA('(Serrín, por ejemplo. En el almacén de maderas de al lado de la farmacia seguro que lo barren a sacos.)', 'pensativo');
          return genaroVolve(false);
        }
        return cambiazo();
      },
      use: { serrin: async () => { setFlag('milloVisto'); if (hasItem('millo')) return MA('Ya hice el cambio una vez. Mejor no tentar a la suerte. Ni a Genaro.', 'avergonzado');
        if (!flag('genaroDentro')) { await GE('Que fas cos meus sacos? Iso non se toca!', 'enfadado'); return MA(milloPreciso() ? '(Con él mirando, no. Primero tengo que mandarlo dentro con alguna excusa.)' : 'Nada, nada. Comparaba sacos. Es una afición.', 'avergonzado'); }
        return cambiazo(); } } },
    { name: 'Panadería Estación', key: true, r: [724, 318, 70, 150], at: [705, 478], face: 'R',
      act: () => flag('genaroDentro') ? MA('Genaro está dentro, peleándose con el horno. No es momento de pedir bollos.', 'pensativo') : genaroTalk(),
      look: () => MA('La puerta de la panadería, blanca y con cristales empañados de calor. Huele a pan, a azúcar y a madrugón.', 'sonriente') },
    { name: 'Escaparate', r: [662, 318, 60, 130], look: () => MA('Bandejas de bollos, empanadas y pasteles detrás del cristal. Es un escaparate peligroso para un hombre que acaba de volver a casa con hambre atrasada.', 'risueno') },
    { name: 'Rótulo', r: [580, 236, 300, 82], look: () => MA('«PANADERIA ESTACIÓN». Sin tilde en panadería y con tilde en estación. Las prioridades de este barrio, por orden.', 'risueno') },
    { name: 'Porta do «Se vende»', r: [532, 288, 40, 128], act: () => MA('Cerrada. Y con el precio que no pone, mejor no preguntar.', 'esceptico'),
      look: () => MA('Una puerta de madera con un «SE VENDE» amarillo. El cartel ya tiene más años que algunos vecinos.', 'pensativo') },
    { name: 'Portal branco', r: [596, 318, 30, 112], act: () => MA('Es un portal de vecinos. Si llamo a un timbre al azar, mañana lo sabe Concha. Y pasado, Genaro.', 'esceptico'),
      look: () => MA('Un portal blanco, estrecho, de los de escalera empinada y buzones con nombres escritos a boli.', 'neutro') },
    { name: 'Contador da luz', r: [886, 222, 44, 46], look: () => MA('La caja del contador de la luz, colgada en la fachada. En esta calle hasta la electricidad toma el sol.', 'neutro') },
    { name: 'Balcóns', r: [528, 56, 410, 176], look: () => MA('Balcones de piedra calada, como encaje de granito. Los hicieron cuando el ferrocarril daba de comer a medio Monforte y había para florituras.', 'pensativo') },
    { name: 'Vallas da obra', r: [264, 330, 216, 140], act: () => MA('No pienso mover las vallas de una obra. En mi primera semana ya me he peleado con el Concello. Una vez basta.', 'avergonzado'),
      look: () => MA('Vallas amarillas de obra a lo largo del bordillo, con sus cintas rojas y blancas. Por debajo, Monforte está cambiando de tuberías. Por encima, sigue igual.', 'esceptico') },
    { name: 'Árbores', r: [330, 180, 200, 150], look: () => MA('Plátanos podados a muñón, con los brazos en alto. Parecen pidiendo la vez en la panadería.', 'risueno') },
    { name: 'Coches', r: [0, 330, 210, 110], look: () => MA('Coches aparcados en fila. Uno lleva tanto polvo encima que ya es mobiliario urbano.', 'neutro') },
    { name: 'Bar', r: [8, 230, 150, 110], act: () => MA('Un café ahora me sentaría bien. Pero la última vez que me senté en un bar acabé subido a un reloj. Mejor otro día.', 'esceptico'),
      look: () => MA('El bar de enfrente, con toldo rojo y su terraza. En esta calle, entre el pan y el café, uno puede desayunar en diez metros.', 'sonriente') },
    { name: 'Tapa de sumidoiro', r: [288, 444, 60, 22], look: () => MA('Una tapa de alcantarilla. Con las obras, no sé si debajo hay tuberías, arqueología o las dos cosas.', 'pensativo') },
    { name: 'Reixa', r: [512, 480, 70, 24], look: () => MA('Una rejilla. Por aquí se cuelan las monedas de los que salen de la panadería contando el cambio.', 'risueno') },
  ],
  npcs: [
    { id: 'genaro', name: 'Genaro', key: true, sheet: 'img/genaro-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0], flip: true,
      x: 770, y: 476, w: 60, h: 300, at: [705, 478], face: 'R', when: () => !flag('genaroDentro'),
      done: () => flag('genaroSauda') && (!flag('valerioDoce') || hasItem('pasteis') || flag('valerioFeito')),
      look: () => MA('El panadero, en la puerta, con el gorro, el mandil y harina hasta en las cejas. Tiene cara de haberse levantado a las cuatro y de no arrepentirse.', 'sonriente'),
      talk: () => genaroTalk(),
      give: {
        ositos: () => GE('Ositos? Na miña panadería? Iso é coma levarlle leña ao monte. Gárdaos, rapaz.', 'oh'),
        pasteis: () => GE('Non, non: xa están pagados. O que sae pola porta non volve, que despois tráenme pasteis chuchados.', 'brazos-cruzados'),
        crema: () => GE('Crema de agulletas? A min dóenme as costas de amasar, non as pernas. Pero grazas polo detalle.', 'aburrido'),
        xornal: () => GE('Xa o lin ás cinco. Antes ca Concha. Non llo digas, que me retira o saúdo.', 'riendo'),
        serrin: () => GE('Serrín? Para que o quero eu? Fago pan, non chourizos de feira. Lévao, lévao.', 'esceptico'),
        millo: () => GE('Ese saco... é igualiño ca os meus. Hoxe todo o mundo leva sacos. Moda nova.', 'dudoso'),
      } },
  ],
};

/* ---------- B1 · Rúa Calvo Sotelo: a Farmacia de la Estación (ilustración de Oscar, img/bg-calvo-sotelo.jpg, 16-11-2026) ----------
   Sáese da praza 2 polo noroeste, xunto ao quiosco de Concha, pasando pola Panadería Estación. Debuxo novo de Oscar:
   rótulo «FARMACIA DE LA ESTACIÓN», cruz verde de neón, Maderas Somel ao lado (sen papel na trama polo de agora),
   máquina expendedora azul (dá un preservativo: o seu uso está pendente da idea de Oscar) e o castelo ao fondo. */
ico.preservativo = c => { c.fillStyle = '#3a6ad8'; c.fillRect(8, 10, 32, 30); c.strokeStyle = '#cfe0ff'; c.lineWidth = 2; c.setLineDash([3, 2]); c.strokeRect(9, 11, 30, 28); c.setLineDash([]);
  c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.beginPath(); c.arc(24, 25, 8, 0, 7); c.stroke(); };
// o hilo das pombas (js/pombas.js) define o mesmo obxecto para a cadea do taller; este é o de reserva
if (!ITEMS.preservativo) ITEMS.preservativo = { name: 'Preservativo', icon: ico.preservativo,
  look: () => MA('Un preservativo en su sobrecito azul, de la máquina de la farmacia. No sé para qué lo he cogido. Bueno, sé para qué sirve; lo que no sé es para qué me va a servir a mí.', 'avergonzado') };
SCENES.calvoSotelo = {
  name: 'Rúa Calvo Sotelo · Farmacia de la Estación', bg: 'img/bg-calvo-sotelo.jpg', music: 'estacion', floor: 'pedra',
  walk: [[236, 358], [402, 372], [574, 399], [746, 425], [826, 452], [960, 458], [960, 540], [0, 540], [0, 470], [150, 380]],
  scale: [358, 0.23, 540, 0.85], actorH: 300, start: [880, 505], minSpeed: 0.5,
  draw(c, t) {
    // o neón da cruz verde latexa por riba do debuxo
    const a = 0.10 + 0.22 * Math.abs(Math.sin(t * 2.2));
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = a; c.shadowColor = '#2aff8a'; c.shadowBlur = 24; c.fillStyle = '#3aff96';
    c.fillRect(426, 186, 30, 76); c.fillRect(408, 208, 66, 30); c.restore();
    // sacos de serrín ao pé do portalón de Maderas Somel (por código: non saen no debuxo)
    sacoDraw(c, 340, 364, 0.55, '#ece2c8', '#c8a870'); sacoDraw(c, 360, 367, 0.6, '#e4d8bc', '#c8a870');
  },
  front: [
    { y: 459, r: [694, 300, 22, 160] },   // tronco da árbore de diante
    { y: 422, r: [624, 362, 50, 61] },    // macetón da dereita
    { y: 397, r: [458, 342, 38, 55] },    // macetón da esquerda
  ],
  hotspots: [
    { name: 'Panadería Estación', key: true, r: [868, 476, 92, 64], at: [900, 515], face: 'R', exit: ['panaderia', [800, 530]], hint: 'D',
      look: () => MA('Por aquí se vuelve a la panadería de Genaro, y luego a la plaza de la estación. Dos minutos. En este barrio todo está a dos minutos de un tren.', 'pensativo') },
    { name: 'Farmacia de la Estación', key: true, done: () => flag('valerioFeito'), r: [540, 268, 44, 132], at: [563, 412], face: 'B', exit: ['farmacia', [900, 515]], door: true,
      look: () => MA('La Farmacia de la Estación, la del padre de Valerio. Puerta verde, campanilla y escaparates llenos de botes. Aquí veníamos a por caramelos de eucalipto que no nos tocaban.', 'sonriente') },
    { name: 'Cruz verde', r: [404, 184, 72, 80], look: () => MA('La cruz verde de neón, parpadeando. De crío pensaba que era una señal de vía libre. En cierto modo lo es: vía libre a la aspirina.', 'risueno') },
    { name: 'Letreiro', r: [494, 192, 114, 62], look: () => MA('«FARMACIA DE LA ESTACIÓN», con letras de las de antes. A dos minutos del andén: los maquinistas venían aquí antes del turno a por pastillas para el estómago.', 'sonriente') },
    { name: 'Escaparate', r: [404, 266, 56, 102], look: () => MA('Botes, frascos y cajitas en fila, como soldados. Ni una oferta, ni un «2x1». El padre de Valerio decía que la salud no se rebaja.', 'pensativo') },
    { name: 'Escaparates', r: [586, 264, 68, 110], look: () => MA('Champús, cremas y jarabes. Hay un bote de colonia de las de abuela que juraría que lleva en ese estante desde que yo iba al instituto.', 'risueno') },
    { name: 'Máquina expendedora', key: true, done: () => hasItem('preservativo'), r: [716, 306, 48, 82], at: [738, 432], face: 'B',
      act: async () => {
        if (hasItem('preservativo')) return MA('Ya llevo uno. Uno es previsión; dos ya sería optimismo.', 'avergonzado');
        await MA('Pido... rebusco... Ni una moneda suelta. Todo en tarjeta, y esta máquina es de antes de las tarjetas.', 'frustrado');
        await MA(hasItem('navalla') ? '(Aunque la tapa se ve floja. Con algo que haga palanca, como mi navaja...)' : '(La tapa se ve floja. Con algo que haga palanca... En los cajones de la cocina de casa había de todo.)', 'pensativo');
      },
      use: { navalla: async () => {
        if (hasItem('preservativo')) return MA('Ya llevo uno. No voy a desvalijar la máquina: no soy un ladrón, soy un hombre previsor.', 'avergonzado');
        await MA('Meto la punta de la navaja en la ranura, un poquito de palanca... «clonc».', 'neutro');
        const primeira = !flag('preservativoColleito');
        setFlag('preservativoColleito'); give('preservativo');
        await MA(primeira ? 'Un preservativo. Robado a punta de navaja, a dos metros de la farmacia de Valerio. Si me ve Concha, mañana lo sabe medio Monforte. Y la otra mitad, pasado.' : 'Otro sobrecito. La máquina ya ni se resiste: creo que me tiene cariño.', 'avergonzado');
      } },
      look: () => MA(flag('preservativoColleito') ? 'La máquina azul de la farmacia. La tapa ya cierra regular, por mi culpa. Mejor no quedarme mirándola mucho rato.' : 'Una máquina azul de esas de las farmacias, para cuando están cerradas. Por el dibujo del cartel, vende preservativos. A plena luz del día y a dos metros de la puerta de Valerio. Qué valor.', 'avergonzado') },
    { name: 'Maderas Somel', r: [270, 184, 102, 64], look: () => MA('«Maderas Somel». Un almacén de madera de los de toda la vida, con el pino apilado en el patio. Huele a serrín desde la acera.', 'pensativo') },
    { name: 'Sacos de serrín', key: true, done: () => hasItem('serrin') || flag('milloTrocado'), r: [326, 324, 50, 46], at: [352, 380], face: 'B',
      look: () => MA('Sacos de serrín tirados junto al portalón de Maderas Somel. Los deben de dejar para quien los quiera: para las cuadras, para los gatos...', 'pensativo'),
      act: async () => { if (hasItem('serrin')) return MA('Ya llevo uno. Con uno ya parezco un serrador de feria.', 'risueno');
        give('serrin'); await MA('Me llevo uno. Aquí sobran, y tal vez me resulte útil. Uno nunca sabe cuándo va a necesitar un saco de serrín. Bueno, casi nunca.', 'pensativo'); } },
    { name: 'Portalón verde', r: [286, 248, 40, 118], act: () => MA('No es asunto mío meterme en un almacén ajeno. Además, si piso un tablón, seguro que me cae otro.', 'esceptico'),
      look: () => MA('El portalón verde del almacén, abierto de par en par. Al fondo, tablones apilados como un tren de mercancías parado.', 'pensativo') },
    { name: 'Portal', r: [826, 258, 74, 196], act: () => MA('Es un portal de vecinos. No conozco a nadie aquí. Bueno, en Monforte seguro que sí, pero no sé a quién.', 'dudoso'),
      look: () => MA('Un portal gris con rejilla, en la casa naranja. Los buzones deben de estar llenos de propaganda de la farmacia de al lado.', 'neutro') },
    { name: 'Galerías', r: [378, 74, 124, 100], look: () => MA('Galerías blancas, de las de cristal. En Galicia se inventaron para mirar la lluvia sin mojarse. Y para mirar quién entra en la farmacia.', 'risueno') },
    { name: 'Balcón', r: [786, 88, 138, 102], look: () => MA('Un balcón de hierro con florituras. Alguien me está mirando desde el visillo. Mañana lo sabe Concha. Esta tarde, quizá.', 'esceptico') },
    { name: 'Coches aparcados', r: [72, 300, 126, 58], look: () => MA('Coches aparcados en fila, todos de color «Monforte»: gris, verde gris y gris verde.', 'risueno') },
    { name: 'Árbores', r: [628, 146, 164, 150], look: () => MA('Árboles en fila hasta el fondo de la calle. En verano dan sombra; en otoño, trabajo al barrendero.', 'neutro') },
    { name: 'Torre ao fondo', r: [44, 168, 48, 52], look: () => MA('La torre del castillo de San Vicente, asomando al fondo. En Monforte, mires donde mires, algo de piedra te está mirando a ti.', 'pensativo') },
    { name: 'Rúa', r: [0, 380, 300, 100], act: () => MA('La calle sigue hacia el centro. Por ese lado no se me ha perdido nada. Lo que busco está en esta acera.', 'pensativo'),
      look: () => MA('Calvo Sotelo, recta, con los coches aparcados a un lado y los árboles al otro. Una calle de ir a la estación sin pensar.', 'neutro') },
  ],
};
async function cambiazo() {
  await MA('Saco de serrín aquí... saco de maíz para mí. Mismo color, mismo peso. Ni un mago de feria.', 'sonriente');
  take('serrin'); give('millo'); setFlag('milloTrocado');
  await genaroVolve(true);
}
SCENES.cardeal = SCENES.calvoSotelo;   // partidas gardadas antes do cambio

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
    await VA('Pasteis de crema da Panadería Estación, aquí ao lado, a de Genaro. Ti tráesme crema e eu dóuche crema. Troco xusto.');
    setFlag('valerioSauda'); setFlag('valerioDoce');
    if (hasItem('pasteis')) await MA('(¡Los pasteles de Genaro! Los llevo encima. Este hombre es más previsible que un horario de cercanías.)', 'sonriente');
    else { await MA(flag('genaroPasteis') ? '(Tres pasteles de crema, como cada tarde. Genaro ya me lo había chivado.)' : '(Pasteles de crema. La panadería por la que acabo de pasar, aquí al lado.)', 'pensativo'); toast('Pista: pasteis de crema na Panadería Estación, entre a praza e a farmacia'); }
  } else await VA(flag('valerioFeito') ? 'Outra vez por aquí? Iso é que che gustou a crema.' : hasItem('pasteis') ? 'Ese cheiro... iso é de Genaro. Non me enganas.' : 'Volviches? Sen pasteis? Martín, Martín...');
  for (;;) {
    const opts = [
      { t: '¿Qué tal va Monforte?', k: 'monforte' },
      { t: '¿Has oído el silbato de noche?', k: 'asubio' },
      { t: '¿Guardas todavía las cosas de tu padre?', k: 'libros' },
      ...(!flag('valerioFeito') && hasItem('pasteis') ? [{ t: '(Darle los pasteles de crema.)', k: 'doce' }] : []),
      ...(!flag('valerioFeito') && !hasItem('pasteis') ? [{ t: '¿Y no me puedes fiar la crema?', k: 'fiar' }] : []),
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
    if (k === 'libros') {   // sementa o libro de 1958 do Acto 3 (ideas de Oscar do 15-11-2026)
      await VA('Todas. A bata, o mostrador... e os libros. O meu avó, que abriu a botica, apuntaba cada cura, cada receita e cada xarope fiado nuns libros de tapas negras. Dende o cincuenta. E meu pai seguiu co costume.');
      await VA('Están na rebotica, nun estante que xa non aguanta máis. Nin os tiro nin os leo. Son coma el: non ocupan moito, pero se os tiras, quedas sen nada.');
      await MA('Medio Monforte, apuntado a pluma. Con letra de farmacéutico.', 'pensativo');
      await VA('Letra de farmacéutico, que é coma a de médico pero entendéndose. Iso si: o que pasou no barrio, alí está.');
      setFlag('librosValerio');
    }
    if (k === 'doce') return valerioPasteis();
    if (k === 'fiar') {
      await VA('Fiar? A un home que volve a Monforte despois de vinte anos? Fíoche o saúdo. A crema, a cambio de tres pasteis de Genaro.');
      await MA('(Pasteles de crema. La Panadería Estación, la de Genaro, aquí al lado.)', 'pensativo');
    }
    if (k === 'crema') { await VA('Xa a perdiches? Ai, Martín. Toma outra. A última, que me quedo sen mostras e teño que traballar.'); give('crema'); }
    if (k === 'adeus') { await VA('Vai, e pon a crema antes de facer o parvo, non despois.'); return; }
  }
}
async function valerioPasteis() {
  take('pasteis');
  await VA('Pasteis de crema de Genaro! E aínda mornos! Ai, Martín, ti si que sabes.');
  await VA('Un para min... outro para min... e este, para min. Toma, a crema. De mostra, que se a pago eu, fáiseme falta a min.');
  give('crema'); setFlag('valerioFeito');
  await MA(flag('faltaCrema') ? 'Crema para las agujetas, pagada en crema pastelera. Andrés, prepárate: el de Vilatán vuelve al agua.' : 'Crema para las agujetas, pagada en crema pastelera. En Monforte aún quedan cosas que funcionan como antes. El trueque, por ejemplo.', 'orgulloso');
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
  name: 'Farmacia de la Estación', bg: 'img/bg-farmacia.jpg', music: 'casa', floor: 'madeira',
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
    { name: 'Rúa Calvo Sotelo', key: true, r: [906, 470, 54, 70], at: [920, 520], face: 'R', exit: ['calvoSotelo', [563, 414]], door: true, hint: 'D',
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
        pasteis: async () => { if (flag('valerioFeito')) await VA('Máis pasteis? Martín, levo vinte anos dicindo que o azucre fai mal. Déixaos no mostrador. Para os clientes.'); else await valerioPasteis(); },
        ositos: async () => { await VA(flag('valerioFeito') ? 'Máis doce? Martín, levo vinte anos dicindo que o azucre fai mal. Dame un osito. Só un.' : 'Ositos? Iso era no instituto, Martín. Agora son un home serio: pasteis de crema da panadería de Genaro.'); },
        crema: async () => { await VA('Non, non: é para ti. Póñaa ti, que eu non che dou masaxes. Iso é cousa dos fisios.'); },
        xornal: async () => { await VA('Xa o lin. As esquelas primeiro: é deformación profesional.'); },
      } },
    { id: 'xoanF', name: 'Xoán Carballeira', key: false, sheet: 'img/xoan-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 1, talkFrames: [1],
      x: 812, y: 398, w: 70, h: 296, at: [880, 450], face: 'R',
      look: () => MA('Xoán, el de Renfe, comprando jarabe para la hija de su prima. Hasta en la farmacia lleva el chaleco. Puntualidad suiza, chaleco gallego.', 'sonriente'),
      talk: () => xoanFarmacia(),
      give: { ositos: async () => { await XO('Para Eugenia? Non, non, que logo non quere o xarope. Xa sabes: primeiro o amargo, despois o doce.'); },
        pasteis: async () => { await XO('De Genaro? Iso son os de Valerio. Non toco eu os pasteis de Valerio nin por todo o ouro do Banco de España.'); } } },
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
      ...(flag('carbonRoubado') ? [{ t: '¿Te ha vuelto a desaparecer carbón?', k: 'carbon' }] : []),
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
      await AN('Fogoneiro no depósito, si. Di que o carbón bo se coñece polo son ao caer na pa. Por iso gardo sacos do bo, para o churrasco.');
      await AN('E aquela carretilla, a das tumboas, é súa. Leva cen quilos sen queixarse. Coma min, pero sen queixarse.');
      if (flag('andresInverno')) { await AN('E do inverno aquel, xa cho dixen: no saco e á sombra.'); continue; }
      setFlag('andresInverno');
      await MA('¿Todavía vive? Tiene que tener historias del depósito para dar y tomar.', 'sonriente');
      await AN('Noventa e dous anos e máis teimudo ca unha mula. Cóidoo eu: a pastilla, o caldo e o Dépor, por esa orde.');
      await AN('Historias, todas. Das máquinas, dos turnos, do frío que facía na cabina... Todas menos as dun inverno.');
      await MA('¿Qué invierno?', 'dudoso');
      await AN('Ese. O que non conta. E eu non llo pregunto. Hai cousas que se gardan coma o carbón: no saco, e o saco á sombra.');
      await MA('(Andrés, el de la vida mejor tumbado, hablando en serio. Dos frases seguidas. Me lo apunto.)', 'pensativo');
    }
    if (k === 'carbon') {
      await AN('Esta semana inda non. Pero mira: os sacos están aí, á vista. Quen os leva sabe que non hai can, nin cadeado, nin eu esperto.');
      await MA('¿Y el billete siempre debajo de la misma piedra?', 'dudoso');
      await AN('Sempre. Coma quen paga a cota do clube. Ordenado. Puntual. Coma un horario de tren.');
      await MA('(Puntual como un horario de tren. Eso huele a ferroviario. A ferroviario con grasa en las manos.)', 'pensativo');
      if (flag('andresTumboas')) { await AN('E non me fagas máis preguntas de caldeiras, que me poño a traballar. Xa sabes o que pasa.'); continue; }
      setFlag('andresTumboas');
      await MA('Andrés, ¿quién en Monforte tiene todavía una caldera de vapor?', 'dudoso');
      await AN('Unha caldeira? Pois... o hospital. Ou un panadeiro antigo. Ou un tolo. Hai moito tolo con caldeira.');
      await AN('E agora, se me desculpas, teño que pór as tumboas en fila. Que logo vén xente.');
      await MA('(¿Gente? ¿En noviembre? Andrés levantándose a colocar tumbonas sin que nadie se lo pida. Eso es más raro que el carbón.)', 'esceptico');
    }
    if (k === 'adeus') { await AN(flag('andresFeito') ? 'Vai, vai. A tumboa catro queda reservada para ti.' : 'Ti volve, que a revancha non caduca.'); return; }
  }
}
/* pista do misterio (opción 1 elixida por Oscar, 15-11-2026): alguén merca carbón de pedra ás agachadas.
   Quen é non se di no Acto 2 (é para a Mikado: ver 03_HISTORIA, «O carbón que desaparece»). */
async function carbonMisterio() {
  await AN('E xa que es de trens, unha cousa rara: cada dúas ou tres semanas desaparéceme un saco. Do bo, do de pedra, non do vexetal.');
  await AN('E ao día seguinte, debaixo da pedra grande da entrada, un billete de vinte dobrado en catro. Nin nota, nin nome, nin nada.');
  await MA('¿Alguien te roba carbón... y te lo paga?', 'sorprendido');
  await AN('Un ladrón honrado. Inda quedan, en Monforte. Eu non pregunto: vinte euros por saco é mellor prezo do que me fai o almacén.');
  await MA('¿Y no te pica la curiosidad? ¿Ni un poco?', 'dudoso');
  await AN('A curiosidade cansa. E eu son de tumboa.');
  await MA('(Carbón de piedra, del bueno. Con eso nadie hace un churrasco: eso lo traga una caldera. Una caldera de vapor.)', 'pensativo');
  await AN('Ti non lle deas voltas, que se che enruga a cara. E se o pillas, dille que a próxima vez deixe tamén para un mojito.');
  setFlag('carbonRoubado');
}
async function retoNatacion() {
  if (!hasItem('crema') && !flag('cremaPosta')) {
    await MA('¿Nadar? ¿Con estos gemelos? Me hundo como un ancla. Necesito algo para las agujetas antes. Una farmacia o un milagro. La farmacia queda más cerca.', 'avergonzado');
    await AN('Valerio, na Farmacia de la Estación, en Calvo Sotelo, por detrás do quiosco de Concha. Dille que vas da miña parte e cóbrache o dobre.');
    setFlag('faltaCrema');
    toast('Pista: a Farmacia de la Estación está en Calvo Sotelo, saíndo da praza polo quiosco de Concha');
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
    setFlag('natacionGanada');
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
  await AN('Sabes que o meu avó foi fogoneiro no depósito? Di que o carbón bo se coñece polo son. Noventa e dous anos e aínda mo corrixe. Gardo uns sacos dos que lle gustan, para o churrasco.');
  await MA('Un fogonero en la familia. Andrés, eso tiene más mérito que cuatro largos.', 'sonriente');
  await carbonMisterio();
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
    // a carretilla azul das tumboas e os sacos de carbón do avó fogoneiro (Don Anxo) (por código: non están no debuxo)
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
      look: async () => {
        await MA('Mega Andrés, en su tumbona, con camisa de flores y gafas de sol. En otoño. Es un estilo de vida, no una estación del año.', 'risueno');
        await MA('Andrés Castiñeira. En el instituto le llamábamos «el Castaño»: grande, fuerte y quieto como un árbol. Hasta que se metía en el agua. Por eso lo de «Mega».', 'sonriente');
      },
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
  await MA('Pilas... Alguna habrá en este bar. Aunque sea gastada: si las frotas un poco con las manos, siempre les queda energía para un par de clics. Ciencia de maquinista.', 'pensativo');
  await DA('Pilas gastadas? Ti estudaches en Valencia ou en Lourdes?');
  setFlag('champSauda'); setFlag('faltanPilas');
  toast('Novo obxectivo: pilas para o mando (Demetrio dixo onde foron parar as últimas)');
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
      ...(flag('carbonRoubado') && !flag('xoanCarbon') ? [{ t: 'En el Fluvial alguien le roba carbón a Andrés... y se lo paga.', k: 'carbon' }] : []),
      ...((flag('sombraPatio') || flag('sombraVista')) && !flag('xoanSombra') ? [{ t: 'El lunes vi una sombra saltar el muro de mi patio.', k: 'sombra' }] : []),
      { t: 'Nada, Xoán. A ver el partido.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'candado') {
      if (flag('xoanCandadoV')) await XO('Xa mo preguntaches esta mañá, Martín. E esta mañá tampouco sabía nada. Os candados non me deixan durmir... digo, non me quitan o sono.');
      else await XO('Un candado? Nas cocheras? Cousas de Adif, ou do museo. Eu son de Renfe: de candados sei o xusto para non perder o tren.');
      await XO('Por certo: ese gol de Demetrio foi de rebote. Non llo digas, que me cobra os cinco euros igual.');
      await MA('(Ha cambiado de tema más rápido que un cambio de agujas.)', 'dudoso');
      setFlag('xoanCandado');
    }
    if (k === 'memoria') {
      await XO('As datas son coma os horarios: se as aprendes ben unha vez, xa non marchan.');
      await XO('Ademais, chovía. Os días de choiva acórdanse mellor. Pregúntalle a calquera galego.');
    }
    if (k === 'carbon') {
      setFlag('xoanCarbon');
      await XO('Carbón? Do de pedra?');
      await MA('(Se le ha ido el mosto por el otro lado. Tose como una locomotora con el tiro sucio.)', 'dudoso');
      await XO('Iso... será para unha cociña de leña. Ou para un afiador. Hai xente moi antiga en Monforte. E moi honrada.');
      await MA('Nadie ha dicho que fuera honrado, Xoán. Lo he dicho yo, y tú lo has adivinado.', 'esceptico');
      await XO('Gol! Ai, non. Era a repetición.');
    }
    if (k === 'sombra') { setFlag('xoanSombra'); await xoanSombra(); }
    if (k === 'adeus') { await XO('Iso. E non apostes con Demetrio, que paga en goles.'); return; }
  }
}
/* a sombra do muro (Acto 1: «Mañana pregunto»): Xoán é a sombra, e ponse nervioso */
async function xoanSombra() {
  await XO('Unha sombra? Serán os gatos da gasolineira. Son moi grandes. Moi... altos.');
  await MA('¿Gatos altos? ¿Con zapatos?', 'esceptico');
  await XO('En Monforte os gatos van ben calzados. Hai moita humidade.');
  await MA('(Y se ha mirado los zapatos. Dos veces.)', 'pensativo');
}
async function sairChampions() {
  if (flag('teleAcesa')) return fimChampions();
  if (hasItem('pilas')) return MA('Llevo las pilas en el bolsillo. Primero, la tele; después, ya veremos.', 'convencido');
  await MA('Podría ir a casa a por pilas... o mirar un poco mejor este bar, que Demetrio ya ha dicho dónde fueron a parar las últimas.', 'pensativo');
  const o = [{ t: 'Me quedo y busco aquí.', k: 'fica' }, { t: 'Voy a casa, al cajón de la cocina.', k: 'casa' }];
  if (o[await choose(o)].k === 'fica') return;
  await DA('Vai, vai. Eu vou contando o partido de memoria.');
  SFX.door(); await goScene('arenal', [672, 446]);
}
// cambio 7 da 3.ª revisión Gilbert: as pilas saen do reloxo parado da Fraternal (sen viaxe á casa; o caixón segue valendo)
async function pilasReloxo() {
  if (flag('reloxoSenPilas') || hasItem('pilas')) return MA('El reloj, sin pilas y tan tranquilo. Total, iba a seguir marcando las nueve y cuarto igual.', 'risueno');
  if (!flag('faltanPilas')) return MA('Las nueve y cuarto. Desde hace años, a juzgar por el polvo. No se lo voy a recordar a nadie.', 'risueno');
  await MA('Demetrio, ¿desde cuándo está parado este reloj?', 'dudoso');
  await DA('Dende o Mundial do 82. Ou do 86. Dende que lle puxemos as últimas pilas do bar, iso seguro.');
  await MA('Pues ya ha descansado bastante. Con permiso... de puntillas... ¡ya está!', 'convencido');
  setFlag('reloxoSenPilas'); give('pilas');
  await MA('Dos pilas gastadas. Las froto un poco con las manos... Para un par de clics, dan.', 'sonriente');
  await RO('Deixádeo. Nese reloxo eran sempre as nove e cuarto. Era a hora máis tranquila do mundo.');
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
    reloxoFraternal(c);
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
      look: () => MA('La puerta. Sin pilas para el mando, aquí no hay partido. En mi cocina hay pilas... pero a lo mejor no hace falta ir tan lejos.', 'pensativo') },
    { name: 'Reloxo da parede', key: true, when: () => flag('faltanPilas') && !flag('teleAcesa'), done: () => flag('reloxoSenPilas') || hasItem('pilas'), r: [238, 64, 40, 40], at: [300, 250], face: 'B',
      act: () => pilasReloxo(), look: () => MA('El reloj de la pared, parado a las nueve y cuarto. «As últimas pilas puxéronse no reloxo», dijo Demetrio. Y el reloj no las está usando.', 'pensativo') },
    ...SCENES.fraternal.hotspots.filter(h => !h.exit && h.name !== 'Tele' && h.name !== 'Xornal e baralla'),
    { name: 'Tele', key: true, done: () => flag('teleAcesa'), r: [724, 76, 70, 50],
      act: () => flag('teleAcesa') ? MA('Ni la toco. Dos clics, dijo Xoán. Uno ya lo hemos gastado.', 'risueno') : hasItem('pilas') ? acenderTele() : MA('Sin mando no hay tele, y sin pilas no hay mando. Demetrio dijo dónde acabaron las últimas pilas del bar. Y ese sitio no está dando la hora.', 'pensativo'),
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

{ // praza 2: a rúa Calvo Sotelo ábrese no Acto 2 (leva á Farmacia de la Estación)
  const C = SCENES.praza2.hotspots.find(h => h.name === 'Rúa Calvo Sotelo'), actA1 = C.act;
  C.act = () => flag('fimActo1') ? goScene('panaderia', [452, 386]) : actA1();
  C.look = () => flag('fimActo1') ? MA('La calle Calvo Sotelo. Primero la panadería de la estación y, más arriba, la Farmacia de la Estación, la de Valerio: la de la cruz verde de toda la vida.', 'sonriente') : actA1();
  Object.defineProperty(C, 'exit', { get: () => flag('fimActo1') ? ['panaderia', [452, 386]] : ['__rua'] });   // no Acto 1 segue pechada
  Object.defineProperty(C, 'key', { get: () => flag('fimActo1') });
  C.hint = 'U';
  C.done = () => flag('valerioFeito');
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
   · 7.º soporte: tapa de catro parafusos con puntos de soldadura; non se abre neste acto (ábrese no Acto 4 coas pombas: js/pombas.js).
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
const pistasCompletas = () => PISTAS_TALLER.every(flag) && !flag('fimActo2');
async function pistaTaller(k) {
  if (flag(k)) { if (pistasCompletas()) await cadernoMartin(); return; }
  setFlag(k);
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
<p>El séptimo soporte tiene los cuatro tornillos de la tapa soldados. Los otros seis se abren con la mano. Ahí dentro hay algo.</p>
<p>Y alguien silba, dos largos y uno corto, para que yo lo oiga.</p>
<p>A Andrés le desaparece, cada pocas semanas, un saco de carbón de piedra. Y aparece pagado, debajo de una piedra. Ese carbón no es para un churrasco: es para una caldera.</p>
<p>Las cocheras del museo tienen un candado nuevo de cuatro cifras. Y en el pilar hay una fecha. Catorce, uno...</p>
<p><b>Pregunta:</b> ¿quién era Xosé N.? Y ¿quién, en el depósito, tiene tanto interés en él?</p>`);
  await MA('Un aprendiz que se hizo maquinista. Una fecha. Grasa del depósito. Y un silbato que llama a esta casa.', 'pensativo');
  await MA('Mañana, Xoán. Él se sabe todas las fechas de Monforte. A ver si se sabe esta.', 'dudoso');
  delete E.flags._pista; setFlag('fimActo2');   // a nota de pista do taller xa non serve no Acto 3
  await showDoc('<h4>FIN DO ACTO 2 · «O reencontro»</h4><p>Valerio, Andrés, a Champions con Demetrio... e un taller que alguén visita sen chave, cun nome a medias e unha data gravada no piar.</p>');
  if (typeof inicioActo3 === 'function') await inicioActo3();   // js/acto3.js
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
    if (pistasCompletas()) return cadernoMartin();   // partidas gardadas co fallo do gravado: 4 de 4 sen pechar o acto
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
    // olloOnly: non usar 'pistaData', que o engine marca o flag olloOnly ao interactuar e entón a pista non contaba (4 de 4 sen pechar o acto)
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
/* ---------- A6b · O taller vello, mirando arriba (ilustración de Oscar, 16-11-2026) ----------
   Eixo da transmisión, o 7.º soporte (caixa de ferro con tapa de catro parafusos, cada un cun punto de soldadura na cabeza),
   o piar de ladrillo de dous buratos (fan de chanzos), o burato do tellado e un niño (oco para o paxaro NPC futuro).
   Acto 4: ábrese coas pombas do taller (js/pombas.js). A piqueta de Remedios queda sen uso (cambio de Oscar do 16-11-2026). */
Object.assign(ico, {
  piqueta(c) { c.strokeStyle = '#6a4a2a'; c.lineWidth = 5; c.beginPath(); c.moveTo(12, 40); c.lineTo(30, 16); c.stroke(); c.fillStyle = '#8a8f96'; c.save(); c.translate(30, 15); c.rotate(-0.65); c.fillRect(-14, -4, 28, 8); c.beginPath(); c.moveTo(14, -4); c.lineTo(22, 0); c.lineTo(14, 4); c.fill(); c.restore(); },
});
Object.assign(ITEMS, {
  piqueta: { name: 'Piqueta de soldador', icon: ico.piqueta, look: () => MA('La piqueta de Remedios: martillo por un lado, cincel por el otro. Para quitar la escoria de una soldadura. O los puntos de alguien que no quería visitas.', 'pensativo') },
});
const PARAFUSOS_SOPORTE = [[687, 150], [766, 160], [694, 260], [775, 269]];
async function soporteAbrir(con) {
  if (flag('soporteAberto')) return MA('Ya está abierto. Dentro solo queda el hueco donde estaba la lata.', 'neutro');
  if (!flag('puntosPicados')) {
    setFlag('puntosPicados');
    await MA('Subo por los agujeros del ladrillo, me agarro al eje... y pico. Un punto. Dos. Tres. Cuatro. Saltan como pipas.', 'convencido');
    if (!hasItem('desaparafusador')) return MA('Ahora los tornillos ya tienen ranura. Me falta un destornillador. En el cajón de la cocina hay uno, como en todas las cocinas de España.', 'pensativo');
    if (con !== 'desaparafusador') await MA('Y ahora, el destornillador de la cocina. Para algo lo llevo encima.', 'risueno');
  }
  setFlag('soporteAberto'); setFlag('lataCollida');
  await MA('Cuatro tornillos, setenta años de óxido... crac, crac, crac, crac. La tapa se suelta y casi me la como.', 'sorprendido');
  give('lata');
  await MA('Dentro no hay grasa. Hay una lata de tabaco. Escondida, encima de un pilar, debajo de cuatro tornillos soldados. Xosé, eres un artista.', 'sorprendido');
}
const usosSoporte = {
  navalla: async () => { await MA(flag('puntosPicados') ? 'La navaja en la ranura... se dobla. Para esto está el destornillador.' : 'Meto la punta de la navaja en la ranura del tornillo... no hay ranura: la llena una gota de soldadura. La navaja se mella y el tornillo ni se entera.', 'frustrado'); if (!flag('fimActo2')) await pistaTaller('pistaSoporte'); },
  desaparafusador: async () => {
    if (flag('puntosPicados')) return soporteAbrir('desaparafusador');
    await MA('Pongo el destornillador... y no entra. La ranura de cada tornillo está llena de soldadura. Es como parar una Mikado con un paraguas.', 'risueno');
    if (!flag('fimActo2')) await pistaTaller('pistaSoporte');
  },
  piqueta: () => soporteAbrir('piqueta'),
};
SCENES.vigasA2 = {
  name: 'O taller vello · arriba', bg: 'img/bg-taller-arriba.jpg', noActor: true, music: 'casa',
  draw(c, t) {
    // escena sen Martín: o engine non pinta as frechas de saída, así que «Baixar a mirada» leva a súa
    if (!E.dlg && !E.busy && !(E.olloT > 0)) { c.save(); c.translate(480, 512); c.rotate(Math.PI / 2); c.globalAlpha = 0.75 + 0.25 * Math.sin(t * 3); c.lineJoin = c.lineCap = 'round';
      c.beginPath(); c.moveTo(-11, -19); c.lineTo(11, 0); c.lineTo(-11, 19); c.lineWidth = 13; c.strokeStyle = '#0b0c0e'; c.stroke(); c.lineWidth = 6; c.strokeStyle = '#9fe0ff'; c.stroke(); c.restore(); }
    if (flag('soporteAberto')) {
      // a caixa aberta: oco escuro e a tapa colgada dun parafuso
      const g = c.createLinearGradient(0, 140, 0, 282); g.addColorStop(0, '#0e0b09'); g.addColorStop(1, '#2a211a');
      c.fillStyle = g; c.fillRect(676, 142, 104, 136); c.strokeStyle = '#4a3a2c'; c.lineWidth = 3; c.strokeRect(676, 142, 104, 136);
      c.fillStyle = 'rgba(160,120,70,.25)'; c.fillRect(690, 250, 76, 22);                                  // a marca da lata no po
      c.save(); c.translate(694, 266); c.rotate(0.32);                                                       // tapa colgada dun parafuso, ferruxenta
      c.fillStyle = '#5a5550'; c.fillRect(-14, -6, 116, 132); c.fillStyle = 'rgba(140,80,40,.35)'; c.fillRect(-14, 60, 116, 66);
      c.strokeStyle = '#151414'; c.lineWidth = 3; c.strokeRect(-14, -6, 116, 132);
      c.fillStyle = '#151414'; for (const [x, y] of [[0, 6], [88, 6], [88, 112]]) { c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); }
      c.fillStyle = '#8a8580'; c.beginPath(); c.arc(0, 0, 5, 0, 7); c.fill(); c.restore();
      return;
    }
    if (!flag('puntosPicados')) {
      // un punto de soldadura brillante en cada cabeza (a tapa do debuxo é atornillada: o que a «solda» son estes puntos)
      for (const [x, y] of PARAFUSOS_SOPORTE) { const g = c.createRadialGradient(x - 1.5, y - 1.5, 0.5, x, y, 6); g.addColorStop(0, '#f2efe6'); g.addColorStop(0.5, '#a9a59c'); g.addColorStop(1, 'rgba(90,86,80,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill(); }
    }
  },
  async onEnter() {
    if (pistasCompletas()) return cadernoMartin();
    if (flag('vigasArribaVisto')) return;
    setFlag('vigasArribaVisto');
    await MA('Me pongo al pie del pilar y miro arriba. El eje de la transmisión, de punta a punta... y encima del pilar, el séptimo soporte.', 'pensativo');
  },
  hotspots: [
    // os parafusos: franxa de arriba, columna dereita e franxa de abaixo da tapa (sen key, para que o resaltado marque só a tapa)
    { name: 'Parafusos da tapa',
      when: () => !flag('soporteAberto'),
      poly: [[666, 132], [794, 132], [794, 290], [666, 290], [666, 245], [752, 245], [752, 172], [666, 172]],
      look: async () => {
        if (flag('puntosPicados')) return MA('Los cuatro tornillos, ya sin los puntos. Ahora sí tienen ranura.', 'convencido');
        await MA('Cuatro tornillos, uno en cada esquina. Y en la cabeza de cada uno, una gota de soldadura brillante. Eso no es óxido: es a propósito.', 'sorprendido');
        await MA('Quien cerró esto no quería que lo abriera cualquiera con un destornillador. Ni con una navaja.', 'pensativo');
        if (!flag('fimActo2')) await pistaTaller('pistaSoporte');
      },
      act: async () => { await MA('Subo por los agujeros del ladrillo y pruebo a girar uno con los dedos. Ni un milímetro. Están soldados.', 'frustrado'); if (!flag('fimActo2')) await pistaTaller('pistaSoporte'); },
      use: usosSoporte },
    { name: 'Tapa do sétimo soporte', key: true, done: () => flag('soporteAberto') || (flag('pistaSoporte') && !hasItem('piqueta')), r: [666, 172, 86, 73],
      look: async () => {
        if (flag('soporteAberto')) return MA('La tapa, colgando de un tornillo. Y el soporte, vacío. Setenta años guardando una lata.', 'pensativo');
        await MA('El séptimo soporte, encima del pilar. Una caja de hierro con su tapa. Los otros seis se abren con una palometa y la mano. Este tiene cuatro tornillos... soldados.', 'dudoso');
        await MA('¿Quién suelda los tornillos de una polea? Alguien que no quería que nadie la abriese. O alguien muy aburrido.', 'pensativo');
        if (!flag('fimActo2')) await pistaTaller('pistaSoporte');
      },
      act: async () => {
        if (flag('soporteAberto')) return MA('Ya está abierto.', 'neutro');
        if (flag('puntosPicados')) return hasItem('desaparafusador') ? soporteAbrir('desaparafusador') : MA('Sin los puntos, los tornillos ya giran... con un destornillador. Con los dedos, no. El de la cocina me haría falta.', 'pensativo');
        await MA('Subo apoyando la punta del pie en los agujeros del ladrillo, me cuelgo del eje y tiro de la tapa. Nada. La soldadura aguanta como el primer día.', 'frustrado');
        if (!flag('fimActo2')) await pistaTaller('pistaSoporte');
      },
      use: usosSoporte },
    { name: 'Caixa do soporte', r: [628, 128, 170, 182],
      look: () => MA(flag('soporteAberto') ? 'El soporte del cojinete, abierto. Por dentro, ni grasa: solo el hueco cuadrado de una lata.' : 'La caja de hierro del cojinete: por ahí entra el eje y gira. Le doy con los nudillos... suena hueco. Ahí dentro hay algo que no es grasa.', 'pensativo') },
    { name: 'Eixo da transmisión', r: [0, 146, 668, 110],
      look: () => MA('El eje de la transmisión, de lado a lado de la nave. El motor lo hacía girar y de él bajaban las correas a cada máquina. Aquí arriba es donde se movían las correas.', 'pensativo') },
    { name: 'Piar de ladrillo', r: [617, 300, 196, 186],
      look: () => MA('El pilar de ladrillo, de los de dos agujeros. Puestos así, los agujeros hacen de peldaños. Alguien lo sabía... y alguien lo sigue sabiendo: las huellas acaban justo aquí abajo.', 'dudoso'),
      act: () => MA('Pongo la punta del pie en un agujero, luego en otro... Sí: se sube. Como una escalera de mano, pero de ladrillo y sin seguro.', 'risueno') },
    { name: 'Columna de formigón', r: [646, 0, 108, 132],
      look: () => MA('Encima del ladrillo, una columna de hormigón hasta el tejado. Un remiendo de otra época. El soporte quedó en medio, como el relleno de un bocadillo.', 'esceptico') },
    { name: 'Niño', r: [756, 78, 142, 86],
      look: () => MA('Un nido de paja en la viga, bien hecho, redondo. Ahora está vacío. Alguien tiene aquí mejor casa que yo en Valencia.', 'sonriente'),
      act: () => MA('No toco. Si vuelve la dueña y lo encuentra revuelto, me denuncia en el Concello. Y Eladio le da cita.', 'risueno') },
    { name: 'Burato do tellado', r: [14, 84, 290, 242],
      look: () => MA('El tejado está roto y entra la luz a chorros. Cielo azul entre las tablas. Bonito para una foto. Peligroso para una siesta.', 'esceptico') },
    { name: 'Vigas', r: [0, 0, 960, 486],
      look: () => MA('Vigas de castaño, gordas como troncos. Las pusieron para aguantar una transmisión entera girando todo el día. Y aguantan.', 'pensativo') },
    { name: 'Baixar a mirada', r: [0, 486, 960, 54], exit: ['tallerA2', [620, 500]], hint: 'D',
      look: () => MA('Abajo, el taller y mis huellas mezcladas con las del otro. Ya me duele el cuello de mirar arriba.', 'risueno') },
  ],
};

/* ---------- preset do Acto 2 en «Escoller acto» ---------- */
{
  const F = {};
  for (const k of ['chavesDadas', 'conchaRecoñece', 'davidSauda', 'objetivoContrato', 'davidAmparo', 'amparoMan', 'faltaBoli', 'sabeCrucigrama', 'sabePalabra', 'boliDado',
    'contratoAsinado', 'sabeCasa', 'xoanCoñece', 'muralExplicado', 'trenSaiu', 'salonVisto', 'sinAgua', 'eladioAusente', 'eladioFicha', 'eladioVolveu', 'cadeiraDevolta',
    'aguaAlta', 'duchado', 'noiteAviso', 'noiteActo1', 'fimActo1', 'vistaSalon', 'sabeChaveTaller', 'navallaCollida', 'eladioNogal', 'cadeiraPosta', 'desapCafe']) F[k] = true;
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
        ...((flag('sombraPatio') || flag('sombraVista')) && !flag('xoanSombra') ? [{ t: 'El lunes vi una sombra saltar el muro de mi patio.', k: 'sombra' }] : []),
        { t: '¿Qué cuenta ese mural?', k: 'mural' },
        { t: 'Me voy, que tengo cosas que hacer.', k: 'adeus' },
      ];
      const k = opts[await choose(opts)].k;
      if (k === 'asubio') {
        await XO('Oíno. Coma todo o barrio. Pero eu durmo con tapóns, e cos tapóns todo soa a vento.');
        await MA(flag('valerioSauda') ? 'Tapones. Como los que vende Valerio en la farmacia. Qué casualidad.' : 'Con tapones. Qué casualidad: justo hoy.', 'esceptico');
        await XO('Monforte é pequeno. As casualidades veñen en fila.');
      }
      if (k === 'candado') {
        await XO('Nas cocheras? Iso será cousa de Adif. Ou do museo. Eu son de Renfe: de candados sei o xusto para non perder o tren.');
        await MA('(Para alguien que se sabe el ancho del vestíbulo en baldosas, hoy sabe muy poco.)', 'dudoso');
        setFlag('xoanCandadoV');
      }
      if (k === 'sombra') { setFlag('xoanSombra'); await xoanSombra(); }
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
    { when: () => A2() && !flag('a2Inicio'), t: 'Primer turno en el depósito. Salir a la calle por la puerta de abajo del salón.' },
    { when: () => A2() && flag('a2Inicio') && !flag('objValerio'), t: 'Hablar con Concha, en el quiosco: ella sabe dónde anda todo el mundo. (Y Xoán, en la estación, quizá sepa quién silba.)' },
    { when: () => A2() && flag('objValerio') && !flag('valerioFeito'), t: () => flag('valerioDoce') ? (hasItem('pasteis') ? 'Darle los pasteles a Valerio, en la Farmacia de la Estación (calle Calvo Sotelo). Su «peaje» por la crema.' : 'Valerio no suelta la crema sin tres pasteles de crema. Se compran en la Panadería Estación, la de Genaro, camino de la farmacia.') : 'Pasar por la Farmacia de la Estación, la de Valerio: calle Calvo Sotelo arriba, pasada la panadería, saliendo de la plaza por detrás del quiosco de Concha.' },
    { when: () => A2() && flag('objAndres') && !flag('andresFeito'), t: () => 'La revancha de natación con Mega Andrés, en el Club Fluvial (en el mapa).' + (!hasItem('crema') && !flag('cremaPosta') ? ' Antes, algo para estos gemelos.' : '') },
    { when: () => A2() && flag('avisoChampions') && !flag('champions') && (!flag('faltanPilas') || flag('teleAcesa')), t: 'Champions en la Fraternal, con el tío Demetrio. Hay cosas que no se negocian.' },
    { when: () => A2() && flag('faltanPilas') && !flag('teleAcesa') && !hasItem('pilas'), t: 'Pilas para el mando de la Fraternal. Demetrio dijo que las últimas del bar acabaron en el reloj de la pared... que está parado. (En casa, el cajón de la cocina también tiene.)' },
    { when: () => A2() && hasItem('pilas') && !flag('teleAcesa'), t: 'Volver a la Fraternal y darle vida al mando con las pilas frotadas.' },
    { when: () => A2() && flag('champions') && !flag('silbato2'), t: 'A dormir. El dormitorio, a la izquierda del salón.' },
    { when: () => A2() && flag('silbato2') && !hasItem('chave') && !flag('tallerAberto'), t: () => flag('chaveNovidade') ? 'La llave del taller: Concha quiere una noticia que no sepa nadie. ¿Qué me han contado a mí y a nadie más?' : 'La llave del taller: la tiene Concha. Quiere un detalle.' },
    { when: () => A2() && hasItem('chave') && !flag('tallerAberto'), t: 'Abrir el taller, al fondo del patio de casa.' },
    { when: () => A2() && flag('tallerAberto'), t: () => `Revisar el taller con calma. Con el OLLO se ve lo que se escapa, y las vigas de arriba también cuentan. Pistas: ${PISTAS_TALLER.filter(flag).length} de ${PISTAS_TALLER.length}.` },
  );
}
