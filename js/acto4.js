'use strict';
/* ==========================================================
   VÍA MORTA · Acto 4 «A implicación» (venres) · 21-11-2026
   Obxectivo: as tres cousas que pide Remedios e unha cuarta que ninguén di en voz alta. Calquera orde.
   · Apertura: chamada perdida de Valencia (punto 14, pendente de Oscar: VALENCIA) e Concha coa nova: Adif adianta a góndola ao luns.
   · Rotonda de día: Remedios reparte os encargos (válvula de Suso, carbón de Andrés, permiso de Eladio) e conta a frase da carta:
     «Deixeino onde se moven as correas, onde aprendín o oficio». Coa foto de 1949 Martín enténdeo → flag a4Soporte → puzzle das pombas (js/pombas.js).
   · Suso do Taller (rúa Morín, portas de madeira): válvula de 40 kg → carretilla de Andrés (Fluvial).
   · Andrés: dez sacos de carbón só se lle di a verdade; ofrécese de fogoneiro (sementa o Acto 5).
   · Eladio: T-14 + 100 sinaturas; a solicitude do mes pasado: «Xoán Carballeira Nogal» (o gran «¡claro!»). Concha: 112 sinaturas.
   · O parte → Remedios recoñece a súa soldadura (encargo de Anxo, cara a 1980) → Anxo marcha á praza da estación.
   · Praza: Anxo le o parte; sae Xoán da estación: «Esa letra...». Anxo promete falar mañá diante de todos.
   Fichas: docs/05_FICHAS_ESCENARIOS.md, sección «Acto 4». Suso por código ata ter a súa folla.
   Martín fala en castelán; os NPC, en galego; a interface, en galego.
   ========================================================== */
const SU = t => say('Suso do Taller', t);
PORTRAIT_COLORS['Suso do Taller'] = '#ffcf8a';
const A4ON = () => flag('a4Inicio') && !flag('fimActo4');

/* Punto 14 da revisión (pendente de Oscar): como se anuncia a oferta de Valencia.
   'chamada' = chamada perdida e audio o venres (recomendada); 'comision' = destino provisional que acaba o luns. */
const VALENCIA = 'chamada';

/* ---------- obxectos ---------- */
Object.assign(ico, {
  carretilla(c) { c.strokeStyle = '#1a1a1a'; c.lineWidth = 2; c.fillStyle = '#2f6bc0'; c.beginPath(); c.moveTo(6, 16); c.lineTo(34, 16); c.lineTo(30, 30); c.lineTo(10, 30); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(34, 20); c.lineTo(44, 24); c.stroke(); c.fillStyle = '#222'; c.beginPath(); c.arc(18, 36, 6, 0, 7); c.fill(); },
  valvula(c) { ico.carretilla(c); c.fillStyle = '#c8962e'; c.beginPath(); c.arc(20, 12, 7, 0, 7); c.fill(); c.strokeStyle = '#5a3a10'; c.stroke(); c.fillStyle = '#8a8a8a'; c.fillRect(18, 2, 4, 6); },
  t14(c) { c.fillStyle = '#f4f4ee'; c.fillRect(10, 6, 28, 36); c.fillStyle = '#2a4a8a'; c.fillRect(10, 6, 28, 6); c.fillStyle = '#888'; for (let y = 16; y < 40; y += 4) c.fillRect(14, y, 20, 1.5); },
  t14Asinado(c) { ico.t14(c); c.strokeStyle = '#1a2a9a'; c.lineWidth = 1.2; for (let y = 18; y < 40; y += 3) { c.beginPath(); c.moveTo(14, y); c.quadraticCurveTo(20, y - 3, 26, y); c.quadraticCurveTo(30, y + 2, 34, y - 1); c.stroke(); } },
  permiso(c) { ico.t14(c); c.strokeStyle = '#b0201a'; c.lineWidth = 2.5; c.beginPath(); c.arc(28, 32, 7, 0, 7); c.stroke(); c.fillStyle = '#b0201a'; c.font = 'bold 7px sans-serif'; c.fillText('OK', 23, 35); },
});
Object.assign(ITEMS, {
  carretilla: { name: 'Carretilla', icon: ico.carretilla,
    look: () => MA('La carretilla azul de las tumbonas de Andrés. Con esa rueda se mueve una vaca. Hoy, una válvula de cuarenta kilos.', 'sonriente') },
  valvula: { name: 'Válvula na carretilla', icon: ico.valvula,
    look: () => MA('La válvula de seguridad buena de la Mikado, de bronce, con su placa de 1953. Cuarenta kilos, y en una carretilla de tumbonas. Para Remedios, a la rotonda.', 'orgulloso') },
  t14: { name: 'Impreso T-14', icon: ico.t14,
    look: () => MA('Modelo T-14: «Solicitude de acto en vía pública». Cien casillas para firmas de vecinos empadronados. Cien. Yo en Monforte conozco a doce, y tres no me hablan.', 'esceptico') },
  t14Asinado: { name: 'T-14 con 112 sinaturas', icon: ico.t14Asinado,
    look: () => MA('Ciento doce firmas. Hay letra de cura, letra de médico y una que pone «Mega Andrés, tumbona 4». Concha es un servicio público.', 'risueno') },
  permiso: { name: 'Permiso do Concello', icon: ico.permiso,
    look: () => MA('«Corte da rúa do paso a nivel do ramal de A Barreira. Sábado, de 21:00 a 23:00. Homenaxe ao ferrocarril.» Con sello rojo. Lo más legal que he hecho esta semana.', 'orgulloso') },
});

/* ---------- apertura do acto ---------- */
async function inicioActo4() {
  E.act = 'acto4';
  setFlag('a4Inicio');
  await showDoc('<h4>ACTO 4 · «A implicación»</h4><p>Venres.</p><p>Unha máquina que respira, catro xubilados, un mes de prazo... e unha carta que ninguén entendeu.</p><p class="sub">Obxectivo: o que pida Remedios.</p>');
  await goScene('casaSalon', [600, 480]);
  if (VALENCIA === 'chamada') {
    await MA('Viernes. El móvil, en la mesilla: una llamada perdida. De Valencia. Y un audio.', 'dudoso');
    await showDoc('<h4>Audio · 07:12</h4><p>«Martín, soy Ferrer, del depósito de Valencia. Te llamo yo porque por la vía oficial tardan un mes. La plaza de jefe de maquinistas: es tuya si la quieres.»</p><p>«Me tienes que contestar el lunes. Piénsalo, que esto no pasa dos veces.»</p>');
    await MA('Jefe de maquinistas. En Valencia. Hace un mes habría dado palmas.', 'pensativo');
    await MA('El lunes. Lo pienso el lunes. Hoy... hoy no sé ni qué día es en Monforte.', 'esceptico');
    setFlag('a4Valencia');
  } else {
    await MA('Viernes. La comisión de servicio en Monforte acaba el lunes. Después, o pido la plaza fija... o vuelvo a Valencia.', 'pensativo');
  }
  await goScene('praza2', [520, 420]);
  await CO('MARTÍN! Ven aquí, rapaz, corre!');
  await MA('(Concha, con el periódico abierto, como si fuera un parte de guerra.)', 'sorprendido');
  await CO('Saíu no xornal. Adif adianta a góndola. Ao LUNS. Que leva a máquina o luns, Martín.');
  await MA('¿El lunes? Remedios dijo un mes.', 'preocupado');
  await CO('Pois Adif di o luns. Ou a Mikado sae mañá, sábado, ou non sae nunca.');
  await CO('E Remedios mandou recado: que vaias á rotonda do museo. Xa. Que «se o maquinista quere ser maquinista, hoxe é o día».');
  await MA('¿Y tú cómo sabes lo de Remedios?', 'dudoso');
  await CO('Eu sei o que hai que saber, rapaz. O resto lévoo no xornal.');
  toast('Novo obxectivo: ir ver a Remedios á rotonda do museo');
}

/* ---------- A7b · Rotonda de día: Remedios e Don Anxo ---------- */
async function remediosA4() {
  if (!flag('a4Encargos')) {
    setFlag('a4Encargos');
    await RE('Chegas tarde. Xa o sabes, non? O luns vén a góndola.');
    await MA('Me lo ha dicho Concha. Y medio Monforte, supongo.', 'esceptico');
    await RE('Pois escoita, que só o digo unha vez. Para saír mañá fan falta tres cousas.');
    await RE('Unha: a válvula de seguridade boa, a da Mikado de verdade. Tena Suso, o do taller da rúa Morín, dende que a desmontaron. Non lla vende a ninguén. Pero ti vas da miña parte.');
    await RE('Dúas: carbón. O que temos dá para unha proba, non para ir ata A Barreira. Fai falta dez veces máis. Iso só o ten Andrés, o do Fluvial.');
    await RE('Tres: un permiso. O ramal vello de A Barreira non é de Adif, pero cruza a rúa por un paso a nivel. Sen cortar a rúa, mañá chega a Policía Local antes ca nós. Iso é cousa de Eladio, no Concello.');
    await MA('Una válvula, carbón y un permiso del Concello. En un día. Ni en Renfe piden tanto en tan poco.', 'esceptico');
    await RE('En Renfe non che piden nada con cariño. Eu si.');
    toast('Novo obxectivo: válvula (Suso, rúa Morín), carbón (Andrés, Fluvial) e permiso (Eladio, Concello)');
  }
  for (;;) {
    const opts = [
      ...(!flag('a4Carta') ? [{ t: 'Anoche, el motor de las cocheras tenía los tornillos nuevos. ¿Quién lo abre?', k: 'motor' }] : []),
      ...(flag('a4Carta') && !flag('a4Soporte') && hasItem('foto1949') ? [{ t: '(Enseñarle la foto de 1949.)', k: 'foto' }] : []),
      ...(flag('a4Carbon') && !flag('a4CarbonDito') ? [{ t: 'Andrés trae el carbón. Y se ofrece de fogonero.', k: 'carbon' }] : []),
      ...(hasItem('parte') && !flag('a4Soldadura') ? [{ t: '(Enseñarle el parte de 1958.)', k: 'parte' }] : []),
      { t: 'Repíteme lo que falta.', k: 'falta' },
      { t: 'Me pongo a ello.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'motor') await remediosCarta();
    if (k === 'foto') { await entenderOficio(true); return; }
    if (k === 'carbon') {
      setFlag('a4CarbonDito');
      await RE('Andrés? De fogoneiro?');
      await RE('...');
      await RE('Ben. Ese rapaz ten os brazos do avó. Que non o saiba Anxo ata mañá, que se pon nervioso.');
      await MA('(Si ella supiera lo que sabe Andrés... Y Andrés, lo que sabe ella. En este pueblo cada uno guarda un secreto para proteger a otro.)', 'pensativo');
    }
    if (k === 'parte') { await remediosParte(); return; }
    if (k === 'falta') await RE(faltaA4());
    if (k === 'adeus') { await RE('Pois vai. E non corras, que os maquinistas con présa descarrilan.'); return; }
  }
}
function faltaA4() {
  const f = [];
  if (!flag('a4Valvula')) f.push(hasItem('valvula') ? 'a válvula, que xa a tes aí: dámola' : 'a válvula de Suso');
  if (!flag('a4Carbon')) f.push('o carbón de Andrés');
  if (!flag('a4Permiso')) f.push(hasItem('permiso') ? 'o permiso, que xa o tes: dámo' : 'o permiso de Eladio');
  return f.length ? 'Fáltanos ' + f.join(', ').replace(/, ([^,]*)$/, ' e $1') + '. E pronto, que a Mikado non espera.' : 'De min, nada. O que falte, falta noutra parte. E ti sabes onde.';
}
async function remediosCarta() {
  setFlag('a4Carta');
  await RE('O motor...');
  await RE('O do asubío ten unha carta do seu avó. A última que mandou. Ensinouma cando montamos o grupo.');
  await RE('Di: «Deixeino onde se moven as correas, onde aprendín o oficio».');
  await RE('El cre que o oficio é o de maquinista. O depósito. E o único sitio do depósito onde aínda se moven correas é ese motor. Leva meses abríndoo e pechándoo. Nada.');
  await MA('«Donde aprendí el oficio»...', 'pensativo');
  await MA('(Xosé N. fue maquinista, sí. Pero antes... la foto de 1949.)', 'pensativo');
  toast('Novo obxectivo: onde aprendeu o oficio Xosé? (a foto de 1949)');
}
/* o «¡claro!» do acto: coa foto, Martín entende que o primeiro oficio de Xosé foi o de carpinteiro, na súa casa */
async function entenderOficio(conRemedios) {
  if (flag('a4Soporte')) return;
  if (conRemedios) await MA('Mira, Remedios. 1949. La carpintería del señor Alfredo: mi casa. Y ese, el de los brazos cruzados: Xosé N., aprendiz.', 'convencido');
  else await MA('Xosé N., 1949, aprendiz de carpintero. En mi casa.', 'pensativo');
  await MA('Antes que maquinista, fue carpintero. El primer oficio lo aprendió en mi taller. Y allí las correas se movían mucho antes que en el depósito.', 'sorprendido');
  await MA('«Onde se moven as correas»: la transmisión. Las poleas. Los soportes. El séptimo soporte, el que tiene los tornillos soldados. Está en mi casa.', 'entusiasmado');
  if (conRemedios) {
    await RE('Os parafusos... soldados?');
    await RE('...');
    await RE('Vai. E non lle digas nada a ninguén ata saber que hai dentro.');
  }
  setFlag('a4Soporte');
  toast('Novo obxectivo: abrir a tapa do 7.º soporte (taller, mirando ás vigas)');
}
async function remediosParte() {
  await RE('A ver...');
  await showDoc(DOC_PARTE);
  await RE('«Freo automático: tres quilos. Reparación denegada.» E abaixo: «Para quen veña buscar».');
  await RE('E como abriches a tapa? Eses parafusos non se abren nin coa radial.');
  await MA('Tenían un punto de soldadura en la cabeza, los cuatro. Me ayudaron unas palomas. Es largo de contar.', 'avergonzado');
  await RE('Catro puntos. Na cabeza do parafuso. Pequenos, redondos...');
  await RE('...');
  await RE('Iso fíxeno eu.');
  await MA('¿Tú?', 'sorprendido');
  await RE('Hai máis de corenta anos. Un home pediume que lle soldase catro parafusos dunha tapa, nun taller baleiro. Non me dixo que había dentro. E eu non preguntei: era o meu xefe de quenda. E era amigo.');
  await RE('Anxo.');
  await MA('(Don Anxo deja la bayeta en el ténder. No dice nada. Se va, despacio, con su bastón, hacia la calle.)', 'preocupado');
  setFlag('a4Soldadura');
  await RE('Sabíao. Sabía o que había dentro. Sesenta e oito anos.');
  await RE('Vai buscalo, Martín. A min agora non me vai escoitar. Estará na praza da estación, diante da porta, vendo pasar o rexional. Alí vai sempre.');
  toast('Novo obxectivo: buscar a Don Anxo na praza da estación');
}
async function anxoRotondaA4() {
  await AX('Hoxe hai moito que limpar, rapaz. Mañá vaina mirar todo Monforte.');
  if (!flag('a4AnxoLimpa')) {
    setFlag('a4AnxoLimpa');
    await MA('¿Usted conoció a Xosé Nogal, Don Anxo?', 'dudoso');
    await AX('Limpa, rapaz. Limpa. Que o latón non se pule só.');
    await MA('(Ha frotado tres veces el mismo tornillo.)', 'pensativo');
  }
}
{
  const R = SCENES.rotonda;
  R.npcs = [...(R.npcs || []),
    { id: 'remediosD', name: 'Remedios', key: true, sheet: 'img/remedios-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0],
      x: 640, y: 500, w: 60, h: 330, at: [560, 512], face: 'R', when: () => A4ON(),
      done: () => flag('a4Encargos') && !(hasItem('valvula') || hasItem('permiso') || (hasItem('parte') && !flag('a4Soldadura')) || (flag('a4Carta') && !flag('a4Soporte'))),
      look: () => MA('Remedios, con el mono azul y sus zapatillas de cuadros, apuntando en una libreta. De día parece la encargada de una obra. De noche, también.', 'sonriente'),
      talk: () => remediosA4(),
      give: {
        valvula: async () => {
          take('valvula'); give('carretilla'); setFlag('a4Valvula');
          await RE('A boa. Coa súa placa de 1953. Suso gardouna mellor ca un fillo.');
          await RE('Déixaa aí, que esta tarde a montamos. E devólvelle a carretilla a Andrés, que ese rapaz conta as cousas aínda que non o pareza.');
          await comprobarFimActo4();
        },
        permiso: async () => {
          take('permiso'); setFlag('a4Permiso');
          await RE('Selado e todo. Eladio sabe correr cando quere.');
          await RE('Cento doce sinaturas... Medio Monforte sabe que mañá sae a Mikado. Adeus segredo.');
          await MA('Un secreto que firman ciento doce personas ya no es un secreto. Es una fiesta.', 'risueno');
          await comprobarFimActo4();
        },
        parte: () => flag('a4Soldadura') ? RE('Xa o lin, Martín. Ensínallo a quen lle queime.') : remediosParte(),
        foto1949: () => flag('a4Carta') && !flag('a4Soporte') ? entenderOficio(true) : RE('Xosé... Iso gárdao, Martín. Hai quen daría un brazo por esa foto. E non son eu.'),
        t14: () => RE('Sinaturas? A min non. Eu asino partes de soldadura, non solicitudes. Concha. Concha é quen as consegue.'),
        t14Asinado: () => RE('Moi ben. Agora a Eladio, que o selo é seu.'),
        carretilla: () => RE('A carretilla de Andrés? Pois cárgaa con algo, que baleira non me serve.'),
        millo: () => RE('Millo? Eu non teño galiñas, rapaz.'),
      } },
    { id: 'anxoD', name: 'Don Anxo', key: true, sheet: 'img/anxo-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0],
      x: 300, y: 488, w: 60, h: 310, at: [380, 500], face: 'L', when: () => A4ON() && !flag('a4Soldadura'),
      look: () => MA('Don Anxo, con una bayeta, sacándole brillo al latón del ténder. Frota como si pudiera borrar algo.', 'pensativo'),
      talk: () => anxoRotondaA4(),
      give: { parte: () => AX('Agora non, rapaz. Agora limpo.'), foto1949: async () => { await AX('...'); await AX('Gárdaa ben.'); } } },
  ];
  const mik = R.hotspots.find(h => h.name === 'Mikado'), mikAct = mik.act;
  mik.act = () => A4ON() ? MA('Hoy no subo. Mañá, sí. Mañana, con válvula, con carbón y con permiso.', 'convencido') : mikAct();
}

/* ---------- A4c · Rúa Morín: Suso do Taller (portas de madeira, provisional) ---------- */
async function susoTalk() {
  if (!flag('a4SusoSauda')) {
    setFlag('a4SusoSauda');
    await SU('Bos días! Non me digas que é a luz amarela. Todos veñen pola luz amarela.');
    await MA('No traigo coche. Vengo por una válvula. La de seguridad de la Mikado.', 'convencido');
    await SU('...');
    await SU('Quen cho dixo?');
  }
  if (flag('a4SusoPeso')) {
    if (hasItem('carretilla')) return cargarValvula();
    return SU(flag('a4ValvulaColleita') ? 'Xa a levas. Coidado coas baldosas da rúa, que son da época de Franco e teñen máis furados ca un queixo.' : 'É túa, pero eu non cha levo. Corenta quilos e a miña hernia non se levan ben. Trae rodas.');
  }
  for (;;) {
    const opts = [
      { t: 'Me manda Remedios.', k: 're' },
      ...(!flag('a4SusoMaq') ? [{ t: 'Soy maquinista. Me interesa profesionalmente.', k: 'maq' }] : []),
      ...(!flag('a4SusoPax') ? [{ t: 'Me lo ha dicho un pajarito.', k: 'pax' }] : []),
      { t: 'Nada, ya vuelvo.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'pax') { setFlag('a4SusoPax'); await SU('Os paxariños que saben iso levan gafas de soldar e zapatillas de cadros. A min non me enganas.'); }
    if (k === 'maq') {
      setFlag('a4SusoMaq');
      await SU('E eu son mecánico, e non lla vendo nin ao suízo ese que vén cada mes a preguntar por ela. Fala demasiado ben. Desconfío dos que falan ben.');
      await MA('¿El suizo?', 'dudoso');
      await SU('Un que vén puntual coma un reloxo, educado coma un revisor de primeira. Suízo.');
      await MA('(Puntual como un reloj, educado como un revisor... Me suena a alguien con chaleco.)', 'pensativo');
    }
    if (k === 're') {
      await SU('Remedios?!');
      await SU('Ai, Remedios. Ela ensinoume a soldar cando eu era un mequetrefe. Débolle unha soldadura e media e un susto.');
      await SU('Pois é túa. Gárdoa dende o 87, envolta nunha manta, coma un leitón.');
      await SU('Pero son corenta quilos de bronce e ferro. Eu non cha levo, que teño a hernia que me puxo o médico. E ti en brazos non chegas nin á gasolineira.');
      setFlag('a4SusoPeso');
      if (hasItem('carretilla')) return cargarValvula();
      await MA('Necesito ruedas. (La carretilla azul de las tumbonas de Andrés, en el Fluvial. «Con esa rueda se mueve una vaca».)', 'pensativo');
      toast('Novo obxectivo: algo con rodas para levar a válvula');
      return;
    }
    if (k === 'adeus') return SU('Volve cando queiras. E se é pola luz amarela, tamén.');
  }
}
async function cargarValvula() {
  take('carretilla'); give('valvula'); setFlag('a4ValvulaColleita');
  SFX.noise(0.5, 500, 0.5, 0.2, 0, 'lowpass');
  await SU('Unha carretilla de tumbonas. Moi profesional. Alá vai: un, dous... e tres.');
  await SU('Dille a Remedios que estamos en paz. E que a próxima soldadura ma faga ela a min.');
  await MA('Cuarenta kilos de válvula en una carretilla de piscina. Si me cruzo con Concha, mañana sale en portada.', 'risueno');
  toast('Novo obxectivo: levarlle a válvula a Remedios (rotonda do museo)');
}
{
  const M = SCENES.morin;
  M.npcs = [...(M.npcs || []),
    { id: 'suso', name: 'Suso do Taller', key: true, x: 214, y: 418, w: 44, h: 290, at: [272, 432], face: 'L', when: () => A4ON(),
      done: () => flag('a4ValvulaColleita') || (flag('a4SusoPeso') && !hasItem('carretilla')),
      draw(c, t, talking, s) { figura(c, this.x, this.y, this.h * s, { roupa: '#5a6a7a', pernas: '#4a5a6a', zapatos: '#222', pel: '#e8b890', pelo: '#3a2a1a', gorra: '#1a3a8a', botons: true, peto: true, luvas: '#2a2a2a' }, t, talking); },
      look: () => MA('Un mecánico con mono gris, gorra azul y las manos negras de grasa hasta el codo. Tiene cara de saber lo que le pasa a un coche solo por cómo frena en la esquina.', 'sonriente'),
      talk: () => susoTalk(),
      give: {
        carretilla: () => flag('a4SusoPeso') ? cargarValvula() : SU('Unha carretilla? Que queres, que che lave as rodas?'),
        foto1949: () => SU('Iso é a carpintaría de Alfredo! Meu avó compráballe as cuñas. Gárdaa, que xa non se fan fotos así.'),
        parte: () => SU('Iso non é para min, rapaz. Eu sei de válvulas, non de culpas.'),
      } },
  ];
  const portas = M.hotspots.find(h => h.name === 'Portas de madeira'), pLook = portas.look;
  portas.look = () => A4ON() ? MA('El taller de Suso. Puertas de madera de las de antes y, dentro, olor a aceite y a radio encendida. Un cartel a mano: «Non me digas que é a luz amarela».', 'sonriente') : pLook();
  portas.use = { carretilla: () => A4ON() && flag('a4SusoPeso') ? cargarValvula() : MA('¿Meter una carretilla en un taller ajeno? Sin que me lo pidan, no.', 'esceptico') };
}

/* ---------- C2 · Fluvial: o carbón e a carretilla ---------- */
async function andresA4() {
  if (!flag('a4AndresSauda')) { setFlag('a4AndresSauda'); await AN('Martín! Hoxe non hai revancha, que hai vento. E eu co vento non me molla nin o río.'); }
  for (;;) {
    const opts = [
      ...(!flag('a4Carbon') ? [{ t: 'Necesito carbón. Mucho carbón.', k: 'carbon' }] : []),
      ...(flag('a4SusoPeso') && !flag('a4ValvulaColleita') && !hasItem('carretilla') ? [{ t: '¿Me prestas la carretilla de las tumbonas?', k: 'carr' }] : []),
      { t: 'Hablar de otra cosa.', k: 'outra' },
      { t: 'Nada, Andrés. Sigue a lo tuyo.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'carbon') return andresCarbon();
    if (k === 'carr') return darCarretilla();
    if (k === 'outra') return andresTalk();
    if (k === 'adeus') return AN('Malo será.');
  }
}
async function andresCarbon() {
  await AN('Carbón? Eu nunca pregunto para que é o carbón. Un saco desaparece, aparece un billete debaixo dunha pedra, e eu tan feliz.');
  await AN('Pero dez sacos xa é unha pregunta.');
  for (;;) {
    const k = await choose([
      { t: 'Para un churrasco. Grande.' },
      { t: 'Para calentar la casa. La Casa Juana es una nevera.' },
      { t: 'Es para la Mikado. Sale mañana por la noche, hasta A Barreira.' },
    ]);
    if (k === 0) { await AN('Dez sacos de churrasco? Ti non comes tanto nin no San Lucas. E vinche comer no San Lucas.'); continue; }
    if (k === 1) { await AN('Con carbón de pedra? Ti queres quentar a casa ou fundila? Outra.'); continue; }
    break;
  }
  await AN('...');
  await MA('(Se levanta de la tumbona. Andrés. De pie. Y se pone a colocar tumbonas, una detrás de otra, en fila, sin que nadie se lo pida.)', 'sorprendido');
  await AN('A Mikado.');
  await AN('Levade todos. Os que fagan falta. Mañá levovolos eu na furgoneta á rotonda.');
  await AN('E... quen vos vai palear? Iso pesa. Hai que ter brazos. E saber escoitar o carbón.');
  await MA('Fogonero no tenemos, no.', 'dudoso');
  await AN('Pois agora si.');
  await MA('(No pregunta quién más va. Ni lo va a preguntar. Andrés sabe callar mejor que nadie en este pueblo. Y mira que el listón está alto.)', 'pensativo');
  setFlag('a4Carbon');
  toast('Carbón: feito. Andrés lévao mañá (e palea)');
  if (flag('a4SusoPeso') && !flag('a4ValvulaColleita') && !hasItem('carretilla')) await darCarretilla();
  await comprobarFimActo4();
}
async function darCarretilla() {
  give('carretilla'); setFlag('a4Carretilla');
  await AN('A carretilla? Para a válvula de Suso, non? Non mo digas: xa o sei. Aquí sábese todo antes de que pase.');
  await AN('Lévaa. Pero devólvema con as rodas, que é a única que non chía.');
}
{
  const F = SCENES.fluvial, a = F.npcs.find(n => n.id === 'andres'), aT = a.talk;
  a.talk = () => A4ON() ? andresA4() : aT();
  const oDone = a.done; a.done = () => A4ON() ? flag('a4Carbon') && (!flag('a4SusoPeso') || flag('a4ValvulaColleita') || hasItem('carretilla')) : oDone();
  a.give = { ...a.give, carretilla: () => AN(flag('a4ValvulaColleita') ? 'Xa ma devolves? Non, quédaa ata mañá. Para a Mikado todo é pouco.' : 'Leva, leva. Para iso cha deixei.') };
  const carr = F.hotspots.find(h => h.name === 'Carretilla');
  carr.when = () => !(hasItem('carretilla') || hasItem('valvula') || flag('a4Valvula'));
  carr.act = async () => {
    if (!A4ON() || !flag('a4SusoPeso')) return MA('Llevarme la carretilla de Andrés sin motivo sería robar. Y para robar carbón ya hay alguien. Con billetes.', 'esceptico');
    return darCarretilla();
  };
  const sacos = F.hotspots.find(h => h.name === 'Sacos de carbón'), sLook = sacos.look;
  sacos.look = () => A4ON() ? MA(flag('a4Carbon') ? 'Los sacos de Andrés. Mañana, en la caldera de la Mikado. El mejor churrasco de la historia de Monforte.' : 'Diez sacos de estos, y la Mikado llega a A Barreira. Uno solo, y llega a la rotonda de al lado.', 'pensativo') : sLook();
}

/* ---------- B4 · Concello: o permiso ---------- */
async function eladioA4() {
  if (hasItem('t14Asinado')) return eladioSelo();
  if (flag('a4PermisoColleito')) return EL('O permiso xa o levas, Martín. Agora que non chova. Iso non depende do Concello.');
  if (flag('a4T14')) return EL('Cen sinaturas, Martín. De veciños empadroados. Sen elas, nin o alcalde.');
  await EL('Martín! Hoxe non me escapo ao café, que é venres e os venres veñen as inspeccións.');
  const k = await choose([{ t: 'Un permiso para cortar una calle mañana por la noche.' }, { t: 'Solo pasaba a saludar.' }]);
  if (k === 1) return EL('Os saúdos, pola ventanilla 2. Esta é de trámites.');
  await EL('Cortar unha rúa. Mañá. Pídesmo un venres á mañá para o sábado á noite. Que rúa?');
  await MA('La del paso a nivel del ramal viejo de A Barreira. Para un homenaje al ferrocarril.', 'convencido');
  await EL('Homenaxe... Modelo T-14, solicitude de acto en vía pública. E cen sinaturas de veciños empadroados.');
  await EL('T-14, T-14... Espera.');
  await EL('Isto xa o vin.');
  await EL('Hai un mes. A mesma solicitude: a mesma rúa, un sábado á noite. Non se tramitou: viña sen sinaturas.');
  await EL('Asinada por... «Xoán Carballeira Nogal».');
  await MA('Carballeira... Nogal.', 'sorprendido');
  if (flag('eladioNogal')) await MA('El «tal Nogal» que preguntaba por mi casa el mes pasado. No era un Nogal cualquiera.', 'sorprendido');
  await MA('Xoán. El de la estación. Nogal por parte de madre.', 'sorprendido');
  await MA('(El nieto de Xosé. Por eso el silbato, por eso el mural, por eso los horarios de 1958 de memoria. Por eso me consiguió esta casa.)', 'pensativo');
  await EL('Coñécelo? Pois dille que a próxima vez traia as sinaturas.');
  setFlag('a4XoanNogal'); setFlag('a4T14'); give('t14');
  await MA('(Cien firmas en un día. Solo conozco a una persona en Monforte capaz de eso.)', 'convencido');
  toast('Novo obxectivo: cen sinaturas no T-14 (Concha?)');
}
async function eladioSelo() {
  await EL('Vexamos... noventa e oito, noventa e nove, cen... cento doce.');
  await EL('Hai unha que pon «Mega Andrés, tumbona 4». Está empadroado? Está. Vale igual.');
  SFX.noise(0.12, 300, 0.9, 0.3, 0, 'lowpass');
  await EL('Selo. Permiso concedido: corte da rúa do paso a nivel, sábado de 21:00 a 23:00. Homenaxe ao ferrocarril.');
  take('t14Asinado'); give('permiso'); setFlag('a4PermisoColleito');
  await EL('...');
  await EL('Martín. O meu pai era guardagullas. No depósito. Moitos anos.');
  await MA(flag('pistaFoto') || hasItem('foto1949') ? '¿Pepe? ¿El de la foto de 1949, el mayor de los aprendices?' : '¿Guardagujas? ¿Aquí, en Monforte?', 'sorprendido');
  await EL('Pepe. Nunca falaba daquel inverno. Nin unha palabra. Pero cando pasaba un tren de vapor, quitaba a gorra.');
  await EL('Leva o permiso, home. E mañá... mañá alí estarei, no paso a nivel. Co meu selo.');
  toast('Novo obxectivo: levarlle o permiso a Remedios (rotonda do museo)');
}
{
  const n = SCENES.concelloVest.npcs.find(n => n.id === 'eladioV'), t0 = n.talk, d0 = n.done;
  n.talk = () => A4ON() ? eladioA4() : t0();
  n.done = () => A4ON() ? flag('a4PermisoColleito') || (flag('a4T14') && !hasItem('t14Asinado')) : d0();
  n.give = { ...n.give, t14: () => EL('Baleiro non mo dés, que non vale. Cen sinaturas, Martín.'), t14Asinado: () => eladioSelo(),
    permiso: () => EL('Xa está selado. Dous selos non o fan máis legal. Só máis vermello.') };
}

/* ---------- A3b · Concha: as sinaturas ---------- */
async function conchaSinaturas() {
  await CO('Cen sinaturas? Para mañá? Para a homenaxe... ao ferrocarril?');
  await CO('Rapaz. Dáme media hora.');
  await showDoc('<h4>Media hora despois</h4><p>Concha volve co impreso dobrado e o bolígrafo dos crucigramas detrás da orella.</p>');
  take('t14'); give('t14Asinado'); setFlag('a4Sinaturas');
  await CO('Cento doce. Os do bar, as da perruquería, o cura, o de Correos, o rapaz da gasolineira... e Andrés, que asinou dúas veces e risqueille unha.');
  await MA('Ciento doce en media hora. Concha, deberías llevar la campaña de las elecciones.', 'risueno');
  await CO('Xa as levo, rapaz. Eles cren que non.');
  toast('Novo obxectivo: o T-14 con sinaturas, a Eladio (Concello)');
}
async function conchaA4() {
  if (hasItem('t14')) return conchaSinaturas();
  const opts = [
    ...(flag('a4XoanNogal') && !flag('a4ConchaNogal') ? [{ t: 'Concha, ¿tú sabías que Xoán es Nogal por parte de madre?', k: 'nogal' }] : []),
    { t: '¿Qué más dice el periódico?', k: 'xornal' },
    { t: 'Hablar de otra cosa.', k: 'outra' },
  ];
  const k = opts[await choose(opts)].k;
  if (k === 'nogal') { setFlag('a4ConchaNogal'); await CO('Rapaz, eu sei de quen é fillo cada can de Monforte. Pero hai cousas que se contan e cousas que se calan.'); await CO('E esa é del, non miña.'); }
  if (k === 'xornal') await CO('Que o luns, góndola. Que o martes, choiva. E que o Dépor... mellor non che digo.');
  if (k === 'outra') return conchaQuiosco();
}
{
  const n = SCENES.praza2.npcs.find(n => n.id === 'conchaQ'), t0 = n.talk;
  n.talk = () => A4ON() ? conchaA4() : t0();
  n.give = { ...n.give, t14: () => conchaSinaturas(), t14Asinado: () => CO('Xa as tes, rapaz. Agora a Eladio, que o selo non o teño eu. Aínda.'),
    parte: () => CO('Iso non mo ensines na rúa, Martín. Hai papeis que se len sentados.') };
}

/* ---------- A2 · Xoán no vestíbulo (Acto 4) e Valerio ---------- */
{
  const n = SCENES.vestibulo.npcs.find(n => n.id === 'xoan'), t0 = n.talk;
  n.talk = async () => {
    if (!A4ON()) return t0();
    if (flag('a4Anxo')) return XO('Mañá, Martín. Mañá na vía. Hoxe deixa que me treman as mans tranquilo.');
    if (flag('a4XoanNogal')) {
      await MA('Xoán... Carballeira Nogal.', 'pensativo');
      await XO('...');
      await XO('Eladio. Ese home garda os papeis mellor ca un arquivo. E os segredos, peor.');
      await XO('Mañá, Martín. Hoxe aínda teño un turno e un nó na gorxa. Mañá.');
      return;
    }
    await XO('Venres. O de Ourense chegou puntual. Hai días nos que todo chega puntual. E iso dá medo.');
  };
}
{
  const n = SCENES.farmacia.npcs.find(n => n.id === 'valerio'), t0 = n.talk;
  n.talk = async () => {
    if (!A4ON() || flag('a4ValerioMana')) return t0();
    setFlag('a4ValerioMana');
    await VA('Martín. Mañá pecho cedo. Non me preguntes por que.');
    await MA('¿Por qué?', 'risueno');
    await VA('Porque mo pediu Concha. E porque quero ver unha cousa que meu avó apuntou nun libro e nunca viu.');
  };
}
SCENES.farmacia.npcs.find(n => n.id === 'xoanF').when = () => !flag('fimActo2');

/* ---------- A3 · Praza da Estación: Don Anxo e Xoán ---------- */
async function anxoPraza(conParte) {
  if (!conParte) {
    await AX('Xa sei a que vés, maquinista.');
    if (!hasItem('parte')) return AX('Pero sen o papel non hai nada que falar.');
    const k = await choose([{ t: '(Enseñarle el parte.)' }, { t: 'Le dejo tranquilo.' }]);
    if (k === 1) return AX('Tranquilo non estou dende o 58. Pero vai, vai.');
  }
  await MA('Lo dejó Xosé en el séptimo soporte, en mi taller. «Para quen veña buscar».', 'pensativo');
  await AX('...');
  await AX('A letra de Xosé. Facía os setes cunha raia no medio, coma os suízos. Xa os facía así no taller, de rapaz.');
  await MA('Remedios dice que la soldadura...', 'dudoso');
  await AX('Remedios di a verdade. Sempre a dixo. Ese é o seu problema.');
  setFlag('a4XoanPraza');
  await sleep(400); SFX.door();
  await XO('Martín? Que fas co señor Anxo a estas ho...');
  await XO('...');
  await XO('Esa letra.');
  await MA('(Xoán acaba de salir de la estación con el chaleco puesto. Se ha quedado blanco. Mira el papel como quien ve a alguien que no ve desde hace mucho.)', 'sorprendido');
  await AX('Ti tes os ollos dela. Da filla de Xosé.');
  await XO('Da miña nai.');
  await MA('(Ahí está. Sin solicitud del Concello, sin firma: la cara de Xoán lo ha dicho todo.)', 'pensativo');
  await XO('Mañá, Martín. Na vía. Contámolo todo. Eu, o meu.');
  await AX('E eu, o meu. Mañá falarei. Diante de todos.');
  await AX('Sesenta e oito anos calado. Unha noite máis non me mata. Ou si. Pero xa non importa.');
  await MA('(Se van los dos hacia la estación, sin hablar. Uno con bastón, el otro con chaleco. Como si se conocieran de siempre. Y en cierto modo, así es.)', 'pensativo');
  setFlag('a4Anxo');
  await comprobarFimActo4();
}
{
  const P = SCENES.praza;
  P.npcs = [...(P.npcs || []),
    { id: 'anxoP', name: 'Don Anxo', key: true, sheet: 'img/anxo-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 0, talkFrames: [1, 0], flip: true,
      x: 700, y: 392, w: 60, h: 310, at: [640, 410], face: 'R', when: () => A4ON() && flag('a4Soldadura') && !flag('a4Anxo'),
      look: () => MA('Don Anxo, de pie delante de la estación, apoyado en el bastón. Mira las vías como quien espera un tren que ya pasó.', 'pensativo'),
      talk: () => anxoPraza(false),
      give: { parte: () => anxoPraza(true), foto1949: async () => { await AX('Pepe, Manolo e Xosé.'); await AX('Manolo era eu. Despois do 58 non quixen que me chamasen así nunca máis.'); } } },
    { id: 'xoanP', name: 'Xoán Carballeira', key: false, sheet: 'img/xoan-sprite.png', spec: { cw: 160, ch: 280, cols: 8 }, idle: 3, talkFrames: [7, 0],
      x: 790, y: 396, w: 70, h: 296, at: [720, 410], face: 'R', when: () => A4ON() && flag('a4XoanPraza') && !flag('a4Anxo'),
      look: () => MA('Xoán, quieto, mirando el parte.', 'pensativo'), talk: () => XO('Mañá, Martín.') },
  ];
}

/* ---------- a foto de 1949, coa frase da carta na cabeza ---------- */
{
  const fl = ITEMS.foto1949.look;
  ITEMS.foto1949.look = async () => { await fl(); if (A4ON() && flag('a4Carta') && !flag('a4Soporte')) await entenderOficio(false); };
}

/* ---------- o parte: abrir a lata xa non pecha o acto (pombas.js) ---------- */
async function parteAtopado() {
  await MA('Esto no es mío. Es de Xosé... y de quien le esperaba. Remedios tiene que verlo.', 'convencido');
  toast('Novo obxectivo: ensinarlle o parte a Remedios (rotonda do museo)');
}

/* ---------- fin do acto ---------- */
async function comprobarFimActo4() {
  if (!A4ON() || !['a4Valvula', 'a4Carbon', 'a4Permiso', 'a4Anxo'].every(flag)) return;
  setFlag('fimActo4');
  await MA('Válvula, carbón, permiso. Y la palabra de Don Anxo. Remedios no me pidió la cuarta, pero era la que más pesaba.', 'convencido');
  if (hasItem('carretilla')) { take('carretilla'); await MA('(Y la carretilla de Andrés, de vuelta al Fluvial. Con las dos ruedas. Que es la única que no chirría.)', 'risueno'); }
  await showDoc('<h4>FIN DO ACTO 4 · «A implicación»</h4><p>Unha válvula nunha carretilla de tumbonas, dez sacos de carbón, cento doce sinaturas e un parte que esperou sesenta e oito anos.</p><p>E un vello que mañá vai falar.</p><p>E agora, o Acto 5: «O descubrimento».</p>');
  if (typeof inicioActo5 === 'function') await inicioActo5();   // js/acto5.js
}
{
  const f3 = fimActo3;
  fimActo3 = async () => { await f3(); if (!flag('a4Inicio')) await inicioActo4(); };
}

/* ---------- preset do Acto 4 en «Escoller acto» ---------- */
{
  const F = { ...(ACTS.find(a => a.id === 'acto3').flags || {}) };
  for (const k of ['a3XoseN', 'a3Graxa', 'libro1958', 'candadoAberto', 'pistaLousa', 'pistaMotor', 'pistaPeza', 'pistaPegadasC', 'pistaCarbon', 'a3Noite', 'a3NoiteEntrada',
    'anxoPastillas', 'inxectorFeito', 'remediosConta', 'fimActo3', 'vigasArribaVisto']) F[k] = true;
  const i = ACTS.findIndex(a => a.id === 'acto4');
  ACTS[i] = { id: 'acto4', name: 'Acto 4 · A implicación', desc: 'Venres: a válvula de Suso, o carbón de Andrés, o permiso de Eladio, as pombas do taller e o parte de 1958',
    scene: 'casaSalon', at: [600, 480], inv: ['chavesCasa', 'contrato', 'navalla', 'chave', 'foto1949', 'trapo'], flags: F,
    intro: () => inicioActo4() };
}

/* ---------- caderno de Martín · Acto 4 ---------- */
CADERNO.push(
  { when: () => A4ON() && !flag('a4Encargos'), t: 'Remedios quiere verme en la rotonda del museo (plaza de la estación, calle del fondo, y a la derecha de las cocheras).' },
  { when: () => A4ON() && flag('a4Encargos') && !flag('a4ValvulaColleita') && !flag('a4SusoPeso'), t: 'La válvula de seguridad buena: la tiene Suso do Taller, en la calle Morín (la de la gasolinera). Voy de parte de Remedios.' },
  { when: () => A4ON() && flag('a4SusoPeso') && !flag('a4ValvulaColleita'), t: () => hasItem('carretilla') ? 'Con la carretilla, a por la válvula de Suso (calle Morín).' : 'La válvula pesa cuarenta kilos. Necesito ruedas: la carretilla azul de las tumbonas de Andrés, en el Fluvial.' },
  { when: () => A4ON() && hasItem('valvula'), t: 'Llevarle la válvula a Remedios, a la rotonda.' },
  { when: () => A4ON() && flag('a4Encargos') && !flag('a4Carbon'), t: 'Carbón para ir hasta A Barreira: diez veces el de la prueba. Andrés, en el Club Fluvial.' },
  { when: () => A4ON() && flag('a4Encargos') && !flag('a4T14') && !flag('a4Permiso'), t: 'El permiso para cortar la calle del paso a nivel: Eladio, en el Concello.' },
  { when: () => A4ON() && hasItem('t14'), t: 'Cien firmas de vecinos en el impreso T-14. En Monforte, quien consigue firmas es Concha.' },
  { when: () => A4ON() && hasItem('t14Asinado'), t: 'Llevarle el T-14 con las firmas a Eladio, para el sello.' },
  { when: () => A4ON() && hasItem('permiso'), t: 'Llevarle el permiso sellado a Remedios.' },
  { when: () => A4ON() && flag('a4Encargos') && !flag('a4Carta'), t: 'Alguien abre el motor «A.F.G.» de las cocheras buscando algo. Preguntarle a Remedios.' },
  { when: () => A4ON() && flag('a4Carta') && !flag('a4Soporte'), t: '«Deixeino onde se moven as correas, onde aprendín o oficio.» ¿Dónde aprendió el oficio Xosé? Mirar bien la foto de 1949.' },
  { when: () => A4ON() && flag('a4Parte') && !flag('a4Soldadura'), t: 'Enseñarle el parte de 1958 a Remedios.' },
  { when: () => A4ON() && flag('a4Soldadura') && !flag('a4Anxo'), t: 'Don Anxo lo sabía. Buscarlo en la plaza de la estación y enseñarle el parte.' },
  { when: () => flag('fimActo4') && !flag('a5Inicio'), t: 'Sábado, 21:00. La Mikado sale.' },
);
