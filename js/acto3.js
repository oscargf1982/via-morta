'use strict';
/* ==========================================================
   VÍA MORTA · Acto 3 «A curiosidade» (xoves) · 16-11-2026
   Obxectivo: descubrir quen é o pantasma. Dous camiños abertos á vez que se xuntan na noite:
   · Xoán (vestíbulo) → «pregúntalle a quen garda papeis vellos» → Valerio: o libro de xaneiro de 1958 (ficción)
     e as pastillas de Don Anxo, que este luns non baixou buscalas;
   · o trapo con graxa → «os do museo» → o candado das cocheras (1401, a data do piar) → cinco pistas dentro.
     As cocheras son un almacén coa maquinaria da carpintería da Casa Juana (decisión de Oscar do 16-11-2026; ficción):
     lousa coa proba de lume de hoxe ás 23:00, o motor «A.F.G.», unha peza da Mikado con graxa, pegadas cara á rotonda e o carbón de Andrés.
   A Mikado NON está dentro: está fóra, na rotonda do museo. Coas dúas cousas, á noite: escondido dentro do coche de viaxeiros (decisión de Oscar do 16-11-2026),
     Martín ve saír os xubilados coa carretilla cara á rotonda e séguelos → a Mikado acesa na rotonda, Remedios, Don Anxo e os xubilados.
   Anxo busca as pastillas (problema) → Martín dállas (solución) → Remedios fala → puzzle do inxector → FIN DO ACTO 3.
   Fichas: docs/05_FICHAS_ESCENARIOS.md, sección «Acto 3». Fondos do interior e da rotonda de noite PROVISIONAIS (tools/fondos-acto3.py);
   Remedios, Don Anxo e os xubilados, debuxados por código ata ter as follas de Oscar.
   Martín fala en castelán; os NPC, en galego; a interface, en galego.
   ========================================================== */
const RE = t => say('Remedios', t);
const AX = t => say('Don Anxo', t);
Object.assign(PORTRAIT_COLORS, { 'Remedios': '#9fc2ff', 'Don Anxo': '#e8c89a' });

/* Quen leva o carbón de Andrés: Xoán (escollido por Oscar o 16-11-2026; as outras opcións eran 'remedios' e 'anxo').
   No Acto 3 só cambia o que responde Remedios na noite. */
const CARBON_QUEN = 'xoan';

/* ---------- obxectos novos ---------- */
Object.assign(ico, {
  nota(c) { c.fillStyle = '#f4ecd2'; c.fillRect(10, 8, 28, 34); c.strokeStyle = '#7a6a4a'; c.lineWidth = 1.5; for (let y = 16; y < 38; y += 5) { c.beginPath(); c.moveTo(14, y); c.lineTo(34, y); c.stroke(); } c.fillStyle = '#c0221c'; c.fillRect(14, 24, 18, 2); },
  pastillas(c) { c.fillStyle = '#f2f2f2'; c.fillRect(12, 12, 24, 28); c.strokeStyle = '#333'; c.lineWidth = 2; c.strokeRect(12, 12, 24, 28); c.fillStyle = '#1aa860'; c.fillRect(12, 18, 24, 6); c.fillStyle = '#fff'; c.fillRect(22, 19, 4, 4); c.fillStyle = '#c0221c'; c.fillRect(16, 30, 16, 3); },
});
const DOC_LIBRO = `<h4>Libro de curas e receitas · xaneiro de 1958</h4><p class="sub">Tapas negras. Letra de pluma do pai de Valerio. (Libro e anotacións: ficción do xogo)</p>
<p>13-I · Xarope para a tose. Nena da Estación. Fiado.</p>
<p>14-I · Bicarbonato. Rapaz do depósito, antes do turno.</p>
<p style="font-size:19px"><b>14-I, noite · Curas por queimaduras nas mans. X. Nogal. Non quixo ir ao médico.</b></p>
<p>15-I · Tila. Moita tila. Medio barrio.</p>`;
Object.assign(ITEMS, {
  nota1958: { name: 'Nota do libro de 1958', icon: ico.nota, look: async () => { await showDoc(DOC_LIBRO.replace('Libro de curas e receitas', 'Copia de Martín do libro')); await MA('Quemaduras en las manos, la misma noche. Un maquinista no se quema las manos fregando: se las quema agarrando algo al rojo. Un freno. Una palanca.', 'pensativo'); } },
  pastillas: { name: 'Pastillas de Don Anxo', icon: ico.pastillas, look: () => MA('Una cajita con una etiqueta a mano: «Anxo C. Unha ao deitarse». Letra de Valerio. Y debajo, más pequeño: «E non te esquezas».', 'pensativo') },
});

/* ---------- figuras provisionais (Remedios, Don Anxo e os xubilados) ----------
   Debuxo sinxelo por código, de fronte, ata ter as follas de personaxe de Oscar. h = altura en píxeles. */
function figura(c, x, y, h, o, t, talking) {
  const u = h / 100, ink = '#141010';
  c.save(); c.translate(x, y); c.scale(u, u); c.lineJoin = 'round'; c.lineWidth = 1.4; c.strokeStyle = ink;
  const R = (col, x0, y0, w, hh, r = 2) => { c.fillStyle = col; c.beginPath(); c.roundRect(x0, y0, w, hh, r); c.fill(); c.stroke(); };
  if (o.costas) {   // de costas, en contraluz
    R(o.roupa, -8, -46, 7, 46); R(o.roupa, 1, -46, 7, 46); R(o.roupa, -12, -82, 24, 40, 5);
    c.fillStyle = o.pelo; c.beginPath(); c.arc(0, -89, 8.5, 0, 7); c.fill(); c.stroke();
    if (o.pa) { c.strokeStyle = '#6a4a2a'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(12, -70); c.lineTo(22, -8); c.stroke(); c.fillStyle = '#555'; c.fillRect(17, -10, 10, 10); }
    c.restore(); return;
  }
  const enc = o.encorvado || 0;
  // pernas e calzado
  R(o.pernas, -8, -46, 7, 44); R(o.pernas, 1, -46, 7, 44);
  R(o.zapatos, -10, -4, 10, 5, 2); R(o.zapatos, 0, -4, 10, 5, 2);
  // corpo
  c.save(); c.translate(enc * 0.3, 0);
  R(o.roupa, -13, -82, 26, 40, 6);
  if (o.botons) { c.fillStyle = '#e8d8b0'; for (let yy = -76; yy < -46; yy += 8) { c.beginPath(); c.arc(0, yy, 1, 0, 7); c.fill(); } }
  if (o.peto) { c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(-9, -72, 7, 6); }
  // brazos: Anxo bota as mans aos petos mentres busca as pastillas
  const bus = o.buscando && o.buscando();
  const sw = bus ? Math.sin(t * 6) * 2 : talking ? Math.sin(t * 8) * 3 : 0;
  R(o.roupa, -19, -80, 7, bus ? 26 : 34, 3); R(o.roupa, 12, -80 + sw, 7, bus ? 26 : 34, 3);
  c.fillStyle = o.luvas || o.pel; c.beginPath(); c.arc(-15.5, bus ? -52 : -45, 3.2, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(15.5, (bus ? -52 : -45) + sw, 3.2, 0, 7); c.fill(); c.stroke();
  // cabeza
  c.translate(enc, enc * 0.4);
  c.fillStyle = o.pel; c.beginPath(); c.arc(0, -90, 9, 0, 7); c.fill(); c.stroke();
  if (o.pelo) { c.fillStyle = o.pelo; c.beginPath(); c.arc(0, -93, 9.2, Math.PI, 0); c.fill(); if (o.mono) { c.beginPath(); c.arc(0, -101, 4, 0, 7); c.fill(); c.stroke(); } }
  if (o.gorra) { c.fillStyle = o.gorra; c.beginPath(); c.ellipse(0, -96, 10.5, 4.5, 0, Math.PI, 0); c.fill(); c.stroke(); c.fillRect(-11, -96, 22, 2.4); }
  if (o.gafasSoldar) { c.fillStyle = '#2f4a3a'; for (const gx of [-4, 4]) { c.beginPath(); c.arc(gx, -97, 3.4, 0, 7); c.fill(); c.stroke(); } c.fillStyle = '#5a4a3a'; c.fillRect(-9, -98, 18, 1.2); }
  c.fillStyle = ink; c.beginPath(); c.arc(-3.2, -90, 1.1, 0, 7); c.arc(3.2, -90, 1.1, 0, 7); c.fill();
  if (o.bigote) { c.fillStyle = '#eee'; c.beginPath(); c.ellipse(0, -85.5, 4.4, 1.6, 0, 0, 7); c.fill(); }
  c.fillStyle = '#5a2020'; if (talking && Math.floor(t * 8) % 2) c.fillRect(-1.8, -84.5, 3.6, 2.4); else c.fillRect(-2, -84, 4, 0.9);
  c.restore();
  c.restore();
}
const LOOK_REMEDIOS = { roupa: '#3a5a8c', pernas: '#33507e', zapatos: '#2a2420', pel: '#e8c0a0', pelo: '#c8c8c8', mono: true, gafasSoldar: true, luvas: '#c89a5a', peto: true };
const LOOK_ANXO = { roupa: '#8a6a4a', pernas: '#6a6a70', zapatos: '#7a2a2a', pel: '#e0b898', gorra: '#4a3a2e', bigote: true, botons: true, encorvado: 3, buscando: () => !flag('anxoPastillas') };

/* ---------- apertura do acto ---------- */
async function inicioActo3() {
  E.act = 'acto3';
  await showDoc('<h4>ACTO 3 · «A curiosidade»</h4><p>Xoves.</p><p>Un nome a medias, unha data gravada a navalla e un candado de catro cifras.</p><p class="sub">Obxectivo: descubrir quen é o pantasma.</p>');
  setFlag('a3Inicio');
  await goScene('vestibulo', [880, 430]);
  await MA('Jueves. Turno de mañana en el depósito, y anoche ni un silbato. Eso, en esta ciudad, ya es sospechoso.', 'esceptico');
  await MA('Y ahí está Xoán, delante del mural, como siempre. Hoy no se me escapa: ¿quién era Xosé N.?', 'convencido');
  toast('Novo obxectivo: preguntarlle a Xoán quen era Xosé N.');
}

/* ---------- A2 · Xoán no vestíbulo (Acto 3) ---------- */
async function xoanActo3() {
  if (!flag('a3XoanSauda')) {
    setFlag('a3XoanSauda');
    await XO('Martín! Que cara traes. Coma de quen leu algo que non debía.');
    await MA('Algo así. Grabado en un pilar, con navaja.', 'pensativo');
  } else await XO('Outra vez ti? O mural non cambiou dende onte. Nin dende 1954.');
  for (;;) {
    const opts = [
      { t: '¿Quién era Xosé N.?', k: 'xose' },
      { t: 'Dos largos y uno corto.', k: 'asubio' },
      ...(hasItem('trapo') && !flag('a3Graxa') ? [{ t: '¿Reconoces esta grasa? (Enseñarle el trapo.)', k: 'graxa' }] : []),
      ...(hasItem('foto1949') && !flag('a3XoanFoto') ? [{ t: 'Mira esta foto de 1949.', k: 'foto' }] : []),
      { t: 'Me voy, que tengo cosas que hacer.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'xose') await xoanXose();
    if (k === 'asubio') {
      await XO('...');
      await XO('...');
      await XO('Sabías que en 1958 o rexional das 21:30 saía dez minutos tarde todos os días? Todos os días. Agás un.');
      await MA('¿Qué día?', 'dudoso');
      await XO('Uf, mira que hora. O de Ourense non agarda. E eu tampouco.');
      await MA('(Ha cambiado de vía más rápido que una aguja automática.)', 'pensativo');
      setFlag('a3Asubio');
    }
    if (k === 'graxa') await xoanGraxa();
    if (k === 'foto') await xoanFoto();
    if (k === 'adeus') { await XO('Vai, vai. E Martín... hai preguntas que é mellor facer de día.'); return; }
  }
}
async function xoanXose() {
  await XO('Xosé N.? En Monforte hai Xosés para encher un tren. E enes, para encher outro.');
  if (flag('eladioNogal')) await MA('Eladio me dijo que el mes pasado un tal Nogal preguntó por mi casa. Xosé N.... ¿Nogal?', 'dudoso');
  else await MA('N... de Nogal, por ejemplo. Es un apellido de aquí, ¿no?', 'dudoso');
  await XO('Nogal é un apelido moi común...');
  await XO('...ou non.');
  await MA('(Se ha quedado mirando el emigrante del mural. El que lleva setenta años esperando su tren.)', 'pensativo');
  await XO('Pregúntalle a quen garda papeis vellos, Martín. Eu só gardo horarios.');
  if (!flag('a3XoseN')) {
    setFlag('a3XoseN');
    await MA('(Papeles viejos... Valerio. Los libros de su padre, desde 1950. Con la fecha del pilar, a ver qué dice enero del 58.)', 'convencido');
    toast('Novo obxectivo: o libro de 1958 de Valerio (Farmacia de la Estación)');
  }
}
async function xoanGraxa() {
  await XO('Graxa de bielas. Da boa: da que xa non se fai.');
  await XO('Do almacén do depósito vai faltando dende o verán. O xefe di que a levan os do museo para lustrar as pezas. Eu nin digo nin deixo de dicir.');
  await MA('Los del museo. Las cocheras. El candado nuevo de cuatro cifras.', 'pensativo');
  await MA('(Y una fecha grabada en mi pilar: catorce del uno. Cuatro cifras justas.)', 'convencido');
  if (!flag('a3Graxa')) { setFlag('a3Graxa'); toast('Novo obxectivo: probar o candado das cocheras do museo'); }
}
async function xoanFoto() {
  await XO('...Onde... Iso é unha serra de cinta. 1949.');
  await XO('Gárdaa ben, Martín. Moi ben.');
  await MA('¿Conoces a alguien de la foto?', 'dudoso');
  await XO('Coñezo o mural. Coñezo os horarios. A xente... a xente vai e vén.');
  setFlag('a3XoanFoto');
}
{
  const xoanA2 = xoanTalk;
  xoanTalk = () => flag('fimActo2') ? xoanActo3() : xoanA2();
  const X = SCENES.vestibulo.npcs.find(n => n.id === 'xoan'), dX = X.done, fotoA2 = X.give.foto1949;
  X.done = () => flag('fimActo2') ? flag('a3XoseN') && (flag('a3Graxa') || flag('candadoAberto')) : dX();
  X.give.foto1949 = () => flag('fimActo2') ? xoanFoto() : fotoA2();
  X.give.trapo = () => flag('fimActo2') ? xoanGraxa() : XO('Un trapo? Grazas, pero xa teño. Na estación sobran trapos e faltan maquinistas.');
  X.give.nota1958 = async () => { await XO('...'); await XO('Isto... gárdao. Non mo ensines a min. Ensínallo a quen o teña que ler.'); };
  X.give.pastillas = () => XO('Pastillas? Eu non tomo nada. Bueno, café. Moito.');
}
// no Acto 3 Xoán xa non está na farmacia: está no vestíbulo
{ const XF = SCENES.farmacia.npcs.find(n => n.id === 'xoanF'); XF.when = () => !flag('fimActo2'); }

/* ---------- A3b · Concha no Acto 3 ---------- */
async function conchaActo3() {
  if (!flag('a3ConchaSauda')) { setFlag('a3ConchaSauda'); await CO('Martiño! Xa abriches o taller? Que había? Non mo digas. Si, dimo.'); await MA('Polvo, Concha. Mucho polvo.', 'esceptico'); await CO('Mentireiro. Tes cara de pó... e de algo máis.'); }
  else await CO('Volves? Isto é peor ca un vicio.');
  for (;;) {
    const opts = [
      { t: '¿Qué se cuenta hoy?', k: 'conto' },
      ...(!hasItem('ositos') ? [{ t: 'Una bolsa de ositos.', k: 'ositos' }] : []),
      ...(!hasItem('xornal') ? [{ t: 'El periódico de hoy.', k: 'xornal' }] : []),
      { t: 'Hasta luego, Concha.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'conto') {
      await CO('Que se conta? Que Valerio anda preocupado: Don Anxo, o vello fogoneiro do depósito, non baixou o luns polas pastillas. En cincuenta anos, nunca fallara.');
      await CO('E que de noite, nas cocheras do museo, hai luz. E na rotonda, a Mikado bota fume coma un cura fumador. Pero iso non cho dixen eu.');
      await MA('¿Humo? ¿La Mikado? ¿Quién lo ha visto?', 'sorprendido');
      await CO('O de sempre: ninguén. Pero todo o mundo o sabe.');
      setFlag('a3ConchaConto');
    }
    if (k === 'ositos') { await CO('Os de sempre! Un euro.'); give('ositos'); }
    if (k === 'xornal') { await CO('O xornal de hoxe. Xa o lin, pero vai coma novo.'); give('xornal'); }
    if (k === 'adeus') { await CO('Vai, vai. E se ves luz nalgún sitio, ti primeiro cóntamo a min.'); return; }
  }
}
{
  const conchaA12 = conchaQuiosco;
  conchaQuiosco = () => flag('fimActo2') ? conchaActo3() : conchaA12();
  const N = SCENES.praza2.npcs.find(n => n.id === 'conchaQ'), H = SCENES.praza2.hotspots.find(h => h.name === 'Quiosco');
  const d1 = N.done, d2 = H.done;
  N.done = () => flag('fimActo2') ? flag('a3ConchaConto') : d1();
  H.done = () => flag('fimActo2') ? flag('a3ConchaConto') : d2();
}

/* ---------- B2 · Valerio: o libro de 1958 e a porta a Don Anxo (ideas de Oscar do 15-11-2026; ficción) ---------- */
async function valerioActo3() {
  if (!flag('a3ValerioSauda')) { setFlag('a3ValerioSauda'); await VA('Martín! Hoxe xa andas coma unha persoa. A crema do meu pai: nin un fallo en setenta anos.'); }
  else await VA('Outra vez? Vas acabar pagando cota.');
  for (;;) {
    const opts = [
      ...(!flag('libro1958') ? [{ t: '¿Me enseñas el libro de tu padre de enero de 1958?', k: 'libro' }] : []),
      ...(flag('libro1958') ? [{ t: 'Háblame de Don Anxo.', k: 'anxo' }] : []),
      ...(flag('libro1958') && !hasItem('pastillas') && !flag('anxoPastillas') ? [{ t: 'Dame otra vez las pastillas de Don Anxo.', k: 'pastillas' }] : []),
      { t: '¿Qué tal va Monforte?', k: 'monforte' },
      { t: 'Hasta luego, Valerio.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'libro') await valerioLibro();
    if (k === 'anxo') {
      await VA('Anxo Corredoira. Foi fogoneiro no depósito; ese inverno do 58 tiña vinte e catro anos.');
      await VA('Fala do tempo, do Dépor e da tensión, por esa orde. Do resto, nada. E eu véndolle pastillas dende que teño bata.');
      await MA('Y ahora sale de noche y vuelve oliendo a carbón.', 'pensativo');
      await VA('Iso din as veciñas. O neto non di nada: nesa casa calan por xeracións. Eu só digo que sen pastillas non é el. Se o ves, dállas.');
    }
    if (k === 'pastillas') { await VA('Perdíchelas? Ai, Martín. Toma, a caixa de reserva. E esta vai fiada.'); give('pastillas'); }
    if (k === 'monforte') { await VA('Coma sempre: tres «Se aluga», dous vellos na porta e un maquinista que volve. Iso último é novidade.'); }
    if (k === 'adeus') { await VA(hasItem('pastillas') ? 'Vai. E se ves a Anxo, que tome a pastilla ao deitarse. Non ao amencer.' : 'Vai, e non corras. Que a crema ten límites.'); return; }
  }
}
async function valerioLibro() {
  if (!flag('librosValerio')) {
    await VA('O libro? Ah, os do meu pai. Apuntaba cada cura, cada receita e cada xarope fiado en libros de tapas negras. Dende o cincuenta. Están na rebotica.');
    setFlag('librosValerio');
  }
  await VA('O cincuenta e oito? Para que queres ti o cincuenta e oito?');
  await MA('Una fecha grabada a navaja en el pilar de mi taller: catorce de enero. Y unas iniciales, X. N.', 'pensativo');
  await VA('...Agarda aí.');
  SFX.door(); await sleep(700); SFX.paper();
  await VA('Aquí está. Xaneiro. O meu pai tiña letra de farmacéutico, pero deixábase ler.');
  await showDoc(DOC_LIBRO);
  await MA('«Catorce de enero, noche. Curas por quemaduras en las manos. X. Nogal. No quiso ir al médico.»', 'sorprendido');
  await MA('Quemarse las manos un maquinista, de noche, en pleno turno... Eso es agarrar algo al rojo. Un freno. Una palanca.', 'pensativo');
  await MA('No prueba nada. Pero dice que Xosé Nogal estuvo aquí esa noche, con las manos destrozadas. Y que no quiso que lo viera nadie más.', 'dudoso');
  await MA('¿Me lo dejas llevar?', 'dudoso');
  await VA('Os libros do meu pai non saen da rebotica. Nin para ti.');
  await MA('Entonces lo copio. Letra de maquinista: peor que la de farmacéutico, pero se entiende.', 'risueno');
  give('nota1958'); setFlag('libro1958');
  await VA('Nogal...');
  await VA('Martín, hai un home que estaba no depósito ese inverno. Venlle buscar as pastillas os luns, coma un reloxo.');
  await VA('Este luns non veu. As veciñas din que sae todas as noites e volve ás tantas cheirando a carbón. Aos noventa e dous anos!');
  await MA('¿Cómo se llama?', 'pensativo');
  await VA('Don Anxo. Anxo Corredoira. Foi fogoneiro. Pero do 58 non fala, Martín. Nunca.');
  await MA('¿Corredoira? ¿Como Andrés, el del Fluvial?', 'sorprendido');
  await VA('É o seu avó. Non o sabías? Andrés cóidao coma quen coida unha máquina vella: a pastilla, o caldo, o Dépor... e nin unha pregunta.');
  await MA(flag('andresInverno') ? '(«Todas las historias menos las de un invierno. Y yo no se lo pregunto.» Andrés no pregunta por el carbón... ni por su abuelo.)' : '(«Eu non pregunto», dijo Andrés del carbón. Por lo visto, tampoco pregunta por su abuelo.)', 'pensativo');
  setFlag('anxoNetoSabe');
  await VA('Xa que andas tanto pola estación... se o atopas, dálle isto. Que sen elas, el non é el.');
  give('pastillas');
  await MA('Un fogonero de noventa y dos años que sale de noche y vuelve oliendo a carbón. Ya sé dónde buscar. Y a qué hora no.', 'convencido');
  toast(cocherasCompletas() ? 'Novo obxectivo: ás once, ás cocheras. Agardar dentro do coche de viaxeiros' : 'Novo obxectivo: as cocheras do museo (o candado de catro cifras)');
}
{
  const valerioA2 = valerioTalk;
  valerioTalk = () => flag('fimActo2') ? valerioActo3() : valerioA2();
  const V = SCENES.farmacia.npcs.find(n => n.id === 'valerio'), dV = V.done;
  V.done = () => flag('fimActo2') ? flag('libro1958') : dV();
  V.give.pastillas = () => VA('Non, non: son de Anxo. Eu xa tomo as miñas. E as de medio barrio, se me descoido.');
  V.give.nota1958 = () => VA('Copiáchelo ben. Ata as faltas do meu pai. Ese home escribía «queimaduras» con dúas emes cando estaba canso.');
  // V.give.foto1949: en js/foto1949.js
}

/* ---------- C2 · Mega Andrés no Acto 3 (opcional) ---------- */
{
  const andresA2 = andresTalk;
  andresTalk = async () => {
    if (flag('fimActo2') && flag('anxoNetoSabe') && !flag('a3AndresAvo')) return andresAvoActo3();
    if (flag('fimActo2') && flag('pistaCarbon') && !flag('a3AndresCarbon')) {
      setFlag('a3AndresCarbon');
      await MA('Andrés, tu carbón. Sé dónde acaba: en las cocheras del museo. Con una pala de fogonero al lado. Y la Mikado a cien metros.', 'pensativo');
      await AN('Nas cocheras? E a Mikado ao lado?');
      await AN('...Pois que lle aproveite á Mikado. Mellor nunha caldeira ca nunha grella: iso dío sempre o meu avó.');
      await AN('E agora, se me desculpas, as tumboas. Que están tortas.');
      await MA('(Las tumbonas están perfectas. Andrés las mueve un centímetro y las vuelve a poner donde estaban. Ahí hay algo que no me quiere contar.)', 'esceptico');
      return;
    }
    return andresA2();
  };
  SCENES.fluvial.npcs.find(n => n.id === 'andres').give.pastillas = async () => {
    if (flag('anxoNetoSabe')) await AN('As do avó? Non, non. Valerio deuchas a ti: algo verá en ti. Ti sabes onde anda de noite. Eu prefiro non sabelo.');
    else await AN('Pastillas? Eu só tomo o sol. E en novembro, nin iso.');
  };
  /* Andrés sabe dende sempre que o avó foi o fogoneiro de Xosé Nogal (decisión de Oscar do 16-11-2026, opción 2):
     cala para protexelo, porque o coida. Non mente: desvía. Ao saber Martín o apelido, admite só o que xa se ve. */
  async function andresAvoActo3() {
    setFlag('a3AndresAvo');
    await MA('Andrés. Anxo Corredoira es tu abuelo.', 'pensativo');
    await AN('Ti es de Vilatán ou da Garda Civil?');
    await MA('Fogonero en el 58. Sale de noche y vuelve oliendo a carbón. A tu carbón.', 'dudoso');
    await AN('...');
    await AN('Mira, Martín. Oitenta e cinco anos, a tensión polo teito e un inverno que leva no peito coma un saco.');
    await AN('Se sae de noite e volve cheirando a carbón... e volve contento, contento coma non o vin nunca... eu non pregunto.');
    await MA('Lo sabías.', 'sorprendido');
    await AN('Sei que o meu avó foi o fogoneiro de Nogal. Contoumo a avoa, antes de morrer. El non sabe que o sei.');
    await AN('E así vai seguir. Cóidoo eu: a pastilla, o caldo, o Dépor. E calar tamén é coidar.');
    await MA(flag('andresTumboas') || flag('a3AndresCarbon') ? '(Y por eso el «ladrón honrado», y las tumbonas, y «la curiosidad cansa». No era pereza: era cariño.)' : '(Y por eso el «ladrón honrado» y «la curiosidad cansa». No era pereza: era cariño.)', 'pensativo');
    await AN('Unha cousa, maquinista. Se o ves alá... que tome a pastilla. E que non saiba que fun eu quen cho dixo.');
    await MA('Tú no me has dicho nada, Andrés. Me lo ha dicho Valerio. Y Valerio en los frascos guarda pastillas, no secretos.', 'sonriente');
    await AN('Iso é verdade. Iso é moi verdade.');
  }
}

/* ---------- A7 · Exterior das cocheras no Acto 3: o candado (1401) ---------- */
let fallosCandado = 0;
async function abrirCandado() {
  if (flag('candadoAberto')) { SFX.door(); return goScene('cocherasDentro', [500, 520]); }
  if (!fallosCandado) await MA(flag('a3Graxa') || flag('pistaData') ? 'Cuatro ruedecitas. Y una fecha grabada en mi pilar que no se me va de la cabeza.' : 'Cuatro ruedecitas con números. Vamos a ver qué tengo en la cabeza.', 'pensativo');
  const c = await candadoCombinacion({ title: 'Candado das cocheras', n: 4, hint: 'Xira as rodas (ou escribe os números) e preme «Probar».' });
  if (c === null) return MA('Lo dejo. Por ahora. Este candado y yo tenemos una conversación pendiente.', 'esceptico');
  if (c === '1401') {
    setFlag('candadoAberto');
    SFX.tone(880, 0.08, 'square', 0.05); await sleep(120); SFX.tone(660, 0.12, 'square', 0.05);
    await MA('Uno, cuatro, cero, uno. Catorce del uno... ¡Clac!', 'sorprendido');
    await MA('¿Quién pone de contraseña una fecha? Mi madre. Y por lo visto, los jubilados del depósito.', 'risueno');
    toast('Abriches o candado das cocheras');
    SFX.door(); return goScene('cocherasDentro', [500, 520]);
  }
  fallosCandado++;
  if (c === '1958') await MA('Mil novecientos cincuenta y ocho. Ya lo probé el martes. El año no: el día y el mes.', 'frustrado');
  else if (c === '0000' || c === '1234') await MA('El candado más caro de Monforte no se abre con ' + (c === '0000' ? 'cuatro ceros' : 'uno, dos, tres, cuatro') + '. Lo sabía, pero había que intentarlo.', 'avergonzado');
  else await MA('Nada. Ni un clic.', 'frustrado');
  if (fallosCandado >= 2) await MA('A ver, Martín, con método. En el pilar ponía «14-I-1958». Catorce del uno: día y mes. Cuatro cifras justas.', 'pensativo');
}
{
  const C = SCENES.cocheras, cand = C.hotspots.find(h => h.name === 'Candado'), porta = C.hotspots.find(h => h.name === 'Porta do taller');
  const coche = C.hotspots.find(h => h.name === 'Coche de viaxeiros');
  const cAct = cand.act, cLook = cand.look, pAct = porta.act, pLook = porta.look, cocheLook = coche.look;
  cand.act = () => flag('fimActo2') ? abrirCandado() : cAct();
  cand.look = () => flag('candadoAberto') ? MA('El candado, abierto y colgando. Catorce del uno. Lo dejo así, como si nadie hubiera pasado. Bueno, casi.', 'pensativo')
    : flag('fimActo2') ? MA('El candado nuevo: cerradura de llave y, debajo, cuatro ruedecitas con números. Una fecha cabe de sobra.', 'pensativo') : cLook();
  cand.done = () => flag('candadoAberto');
  porta.act = () => flag('candadoAberto') ? abrirCandado() : flag('fimActo2') ? MA('Cerrada con el candado nuevo. Antes de empujar, mejor convencer al candado.', 'pensativo') : pAct();
  porta.look = () => flag('candadoAberto') ? MA('La puerta del taller, con la persiana a medio subir. Dentro huele a carbón y a aceite.', 'pensativo') : pLook();
  coche.key = true;
  coche.at = [200, 470]; coche.face = 'L';
  coche.done = () => !listoNoite() || flag('a3Noite');
  // Martín escóndese DENTRO do coche (Oscar, 16-11-2026). Ábreo coa chave de cuadradillo que leva todo maquinista.
  coche.act = () => listoNoite() && !flag('a3Noite') ? vixilia() : MA(flag('fimActo2') ? 'Un coche de viajeros de los de cortinas. La puerta se abre con llave de cuadradillo, y yo llevo una en el bolsillo, como todo maquinista. Pero sin nada que vigilar, entrar sería allanamiento con vistas.' : 'Me subiría ahora mismo, aunque no vaya a ninguna parte. Pero está cerrado. Como todo lo bonito.', 'pensativo');
  coche.look = () => listoNoite() && !flag('a3Noite') ? MA('El coche de viajeros. Desde sus ventanillas, con las cortinas echadas, se ve la puerta del taller y nadie me ve a mí. Y se abre con mi llave de cuadradillo. Perfecto para esperar a las once.', 'convencido') : cocheLook();
  const enter0 = C.onEnter;
  C.onEnter = async function () {
    if (enter0) await enter0.call(this);
    if (listoNoite() && !flag('a3Noite') && !flag('a3AvisoNoite')) {
      setFlag('a3AvisoNoite');
      await MA('Las once, «prueba de fuego». Y un fogonero que sale de noche oliendo a carbón. Me meto en el coche de viajeros, con mi llave de cuadradillo, y espero.', 'convencido');
      toast('Pista: agarda dentro do coche de viaxeiros, á esquerda');
    }
  };
}

/* ---------- A8 · Interior das cocheras, de día (fondo provisional) ----------
   Decisión de Oscar (16-11-2026): dentro NON está a Mikado. As cocheras gardan, baixo lonas, a maquinaria da carpintería
   da Casa Juana (a da escritura de 1952 e a da foto de 1949). Como chegou aquí é ficción e non se sabe. A Mikado está fóra,
   na rotonda do museo; aquí só se amañan as pezas e se garda o carbón. */
const PISTAS_COCHERAS = ['pistaLousa', 'pistaMotor', 'pistaPeza', 'pistaPegadasC', 'pistaCarbon'];
const cocherasCompletas = () => PISTAS_COCHERAS.every(flag);
const listoNoite = () => cocherasCompletas() && flag('libro1958') && !flag('fimActo3');
async function pistaCocheras(k) {
  if (flag(k)) return;
  setFlag(k);
  const n = PISTAS_COCHERAS.filter(flag).length;
  if (n < PISTAS_COCHERAS.length) { toast(`Pistas das cocheras: ${n} de ${PISTAS_COCHERAS.length}`); return; }
  await MA('Vale. Lo junto todo antes de que me pillen aquí dentro.', 'pensativo');
  await showDoc(`<h4>Caderno de Martín · xoves</h4><p class="sub">Lo que sé</p>
<p>Alguien está poniendo en marcha la Mikado de la rotonda: presión de trabajo de 9 kilos, tubos, inyector. Las piezas se arreglan aquí dentro y se montan ahí fuera.</p>
<p>Un inyector de bronce con la grasa de mi taller. Carbón de piedra, el de Andrés. Huellas de botas y de zapatillas de andar por casa, del carbón a la puerta de carga que da a la rotonda.</p>
<p>La carpintería de mi casa, o una gemela, aquí guardada. Y el motor con «A.F.G.» grabado con la misma letra que el pilar. Alguien lo ha abierto buscando algo.</p>
<p><b>Hoy, a las once: «proba de lume».</b></p>`);
  if (flag('libro1958')) await MA('Esta noche, a las once, aquí. Escondido dentro del coche de viajeros, a ver quién sale con la carretilla. Y con las pastillas de Don Anxo en el bolsillo.', 'convencido');
  else await MA('Hasta las once tengo tiempo. Y Xoán me dijo que preguntara a quien guarda papeles viejos: Valerio y los libros de su padre.', 'convencido');
  toast(flag('libro1958') ? 'Novo obxectivo: ás once, agardar dentro do coche de viaxeiros' : 'Novo obxectivo: o libro de 1958 de Valerio (Farmacia de la Estación)');
}
/* nota da proba de lume: un papel pegado na esquina da lousa (o debuxo de Oscar só ten as tres primeiras liñas) */
function pintarLousa(c, a) {
  c.save(); c.translate(503, 199); c.rotate(0.06);
  c.fillStyle = '#f2ecd8'; c.strokeStyle = '#6a5a3a'; c.lineWidth = 1; c.fillRect(0, 0, 52, 30); c.strokeRect(0, 0, 52, 30);
  c.fillStyle = 'rgba(220,200,120,.8)'; c.fillRect(18, -3, 16, 6);
  c.fillStyle = flag('pistaLousa') ? '#a01810' : '#3a2a1a'; c.font = 'italic bold 8.5px Georgia, serif';
  c.fillText('Xoves 23:00', 4, 13); c.fillText('proba de lume', 3, 24);
  c.restore();
}
const motorPista = () => ({ name: 'Motor A.F.G.', key: true, done: () => flag('pistaMotor'),
  act: async () => {
    if (flag('pistaMotor')) return motorLook();
    await MA('Un motor enorme, medio tapado con una lona que alguien ha dejado caer. Esta lona no tiene polvo: la quitan y la ponen a menudo. La levanto del todo...', 'pensativo');
    setFlag('pistaMotorAberto');
    await motorLook();
    await pistaCocheras('pistaMotor');
  },
  look: () => flag('pistaMotor') ? motorLook() : MA('Un motor eléctrico enorme, medio tapado con una lona. En la carcasa, en relieve, unas letras: A.F.G. Eso hay que mirarlo de cerca.', 'sorprendido') });
const COCHERAS_COMUNS = {
  lampada: { name: 'Lámpada', look: () => MA('Una lámpara de taller, de las de pantalla verde. Encendida de día: aquí alguien no paga la luz. O la paga el museo sin saberlo.', 'esceptico') },
  transmision: { name: 'Transmisión', look: () => MA('Poleas y correas colgando del techo, como en mi taller. Aquí también se movía todo con un solo motor. Con ese motor, apostaría.', 'pensativo') },
  porta: { name: 'Porta de carga', look: () => MA('La puerta de carga del fondo, entreabierta. Se ven las vías y una farola. Por ahí se sale a la rotonda de la Mikado sin pasar por la plaza.', 'pensativo'),
    act: () => MA('Salir por la puerta de atrás de un museo, de día y con uniforme de Renfe... No. Salgo por donde entré, como las personas decentes. Y los cerrajeros.', 'risueno') },
};
SCENES.cocherasDentro = {
  name: 'Cocheras do museo', bg: 'img/bg-cocheras-interior-esq.jpg', music: null, floor: 'pedra',
  // ilustración de Oscar (16-11-2026), metade esquerda da panorámica: as máquinas da carpintería e o motor
  walk: [[330, 540], [330, 450], [470, 420], [600, 420], [570, 500], [960, 500], [960, 540]],
  scale: [420, 0.5, 540, 0.66], actorH: 300, start: [480, 520], minSpeed: 0.4,
  async onEnter() {
    if (flag('a3DentroVisto')) return;
    setFlag('a3DentroVisto');
    await MA('Madre mía. Ni una locomotora. Máquinas de carpintería: una sierra de cinta, una sierra circular, un torno... y poleas colgando del techo, como en mi taller.', 'sorprendido');
    await MA('Es lo que Rosario me contó del taller de mi casa. La escritura de 1952 dice a quién se vendió, no dónde acabó. Igual es otra carpintería. O igual no.', 'pensativo');
    await MA('Y esto no huele a almacén. Huele a aceite, a carbón... y a alguien que ha estado aquí hace nada.', 'pensativo');
    toast('Pista: a nave segue á dereita. E usa o OLLO, que o chan tamén fala');
  },
  hotspots: [
    { name: 'Saír ás cocheras', key: true, r: [400, 512, 300, 28], at: [500, 530], face: 'F', exit: ['cocheras', [700, 446]], hint: 'D',
      look: () => MA('La salida a la plaza del museo. Antes de irme, dejo todo como estaba. Un maquinista sabe dejar las cosas como estaban: es lo que más le piden.', 'pensativo') },
    { name: 'Resto da nave', key: true, r: [924, 300, 36, 200], at: [948, 520], face: 'R', exit: ['cocherasDentroD', [40, 515]], hint: 'R',
      look: () => MA('La nave sigue hacia la derecha: bancos, una pizarra, sacos...', 'pensativo') },
    { ...motorPista(), r: [570, 291, 360, 200], at: [700, 510], face: 'B' },
    { name: 'Serra de cinta', r: [18, 99, 147, 237],
      look: () => MA(hasItem('foto1949') ? 'Una sierra de cinta de las de antes: volantes de hierro y una cinta que ya no corta nada. Se parece muchísimo a la de la foto de 1949.' : 'Una sierra de cinta de las de antes: volantes de hierro y una cinta que ya no corta nada. Como un reloj de pared, pero para madera.', 'pensativo'),
      use: { foto1949: async () => {
        await MA('Pongo la foto delante. El mismo bastidor, la misma mesa... y la misma muesca en el brazo, a la altura de la mano.', 'sorprendido');
        await MA('O es ella, o tiene una gemela muy bien conservada. La sierra donde posaban Alfredo y los aprendices. Aquí, en las cocheras del museo.', 'pensativo');
        await MA('No lo puedo demostrar. Pero el motor de la lona, con «A.F.G.», piensa lo mismo que yo.', 'convencido');
        setFlag('serraFoto');
      } } },
    { name: 'Serra circular', r: [0, 360, 324, 180], look: () => MA('Un banco con su sierra circular. El disco, sin un diente roto. Esto lo ha engrasado alguien que sabe que las máquinas se oxidan de tristeza.', 'pensativo') },
    { name: 'Máquina tapada', r: [198, 186, 120, 150], look: () => MA('Algo tapado con una sábana vieja. Por la forma, una cepilladora. Esta no la ha destapado nadie en años: el polvo encima hace dunas.', 'pensativo') },
    { name: 'Regruesadora', r: [318, 252, 135, 174], look: () => MA('Una regruesadora de hierro verde, de las que pesan como un vagón. En la escritura de 1952 venía en la lista. «Cepilladora/regruesadora, una». Pues aquí hay una.', 'pensativo') },
    { name: 'Torno', r: [456, 249, 150, 147], look: () => MA('Un torno para madera, con la bancada lisa de tanto trabajar. Aquí se hicieron patas de mesa para medio Monforte. O eso me gusta pensar.', 'pensativo') },
    { name: 'Escaleira', r: [603, 150, 63, 198], look: () => MA('Una escalera de madera apoyada en la pared. Para llegar a las poleas del techo. O para huir por una ventana, si te pillan. No es mi caso. Todavía.', 'risueno') },
    { ...COCHERAS_COMUNS.porta, r: [672, 156, 252, 130] },
    { ...COCHERAS_COMUNS.lampada, r: [759, 57, 81, 60] },
    { ...COCHERAS_COMUNS.transmision, r: [282, 0, 174, 240] },
    { name: 'Fiestras', r: [36, 0, 240, 156], look: () => MA('Ventanas altas, de arco. De noche, desde fuera, se tiene que ver si hay alguien. Por eso la gente lo sabe. Por eso Concha lo sabe.', 'pensativo') },
  ],
};
SCENES.cocherasDentroD = {
  name: 'Cocheras do museo', bg: 'img/bg-cocheras-interior-der.jpg', music: null, floor: 'pedra',
  // ilustración de Oscar (16-11-2026), metade dereita: a lousa, o banco do inxector, a carretilla e o carbón
  walk: [[0, 540], [0, 494], [250, 490], [270, 390], [480, 380], [520, 470], [520, 540]],
  scale: [380, 0.48, 540, 0.66], actorH: 300, start: [40, 515], minSpeed: 0.4,
  draw(c) { pintarLousa(c); },
  hotspots: [
    { name: 'Saír ás cocheras', key: true, r: [280, 512, 200, 28], at: [380, 530], face: 'F', exit: ['cocheras', [700, 446]], hint: 'D',
      look: () => MA('La salida a la plaza del museo.', 'pensativo') },
    { name: 'As máquinas', key: true, r: [0, 494, 30, 46], at: [14, 520], face: 'L', exit: ['cocherasDentro', [930, 520]], hint: 'L',
      look: () => MA('Por ahí, las sierras, el torno y el motor.', 'pensativo') },
    { name: 'Lousa', key: true, done: () => flag('pistaLousa'), r: [378, 192, 180, 120], at: [440, 400], face: 'B',
      look: async () => {
        await showDoc('<h4>A lousa</h4><p style="font-size:20px;font-style:italic;line-height:1.5">Presión: 9 kg.<br>Probar inxector.<br>Mércores: tubos</p><p class="sub">E nun papel pegado na esquina, coa mesma letra:</p><p style="font-size:20px;font-style:italic"><b>Xoves 23:00: proba de lume</b></p><p class="sub">Letra de xiz, moi coidada. Letra de quen aprendeu a escribir con pluma.</p>');
        await MA('Nueve kilos de presión: presión de trabajo de verdad. Pero aquí dentro no hay nada con caldera. Sierras, un torno... madera y hierro frío.', 'dudoso');
        await MA('La única caldera en cien metros es la de la Mikado de la rotonda. «Jueves, a las once: prueba de fuego». Jueves... es hoy.', 'convencido');
        await pistaCocheras('pistaLousa');
      } },
    { name: 'Peza de bronce', key: true, done: () => flag('pistaPeza'), r: [564, 288, 138, 60], at: [500, 420], face: 'R',
      look: async () => {
        await MA('Piezas de bronce encima del banco, pulidas como trofeos: válvulas, racores... y un inyector de locomotora de vapor. Lo que mete el agua en la caldera.', 'sorprendido');
        await MA('Lleva el sello de Renfe, y grasa de bielas fresca hasta en las roscas. Esto no es para una vitrina: es para montarlo esta noche.', 'pensativo');
        if (hasItem('trapo')) await MA('Y es la misma grasa que la del trapo de mi taller. Negra, espesa, de bielas. Idéntica.', 'convencido');
        await pistaCocheras('pistaPeza');
      },
      act: () => MA('No lo toco. Un inyector recién ajustado es como un reloj suizo: si lo mueves, alguien lo nota. Y alguien va a venir a por él.', 'pensativo'),
      use: { trapo: async () => { await MA('Comparo el trapo con el inyector... La misma grasa. El que entra en mi taller sale de aquí. O entra aquí saliendo de mi taller.', 'convencido'); await pistaCocheras('pistaPeza'); } } },
    { name: 'Pegadas', key: true, olloOnly: 'pegadasCVistas', done: () => flag('pistaPegadasC'), r: [150, 360, 330, 120],
      look: async () => {
        await MA('Huellas en el polvo de carbón. Unas de botas, con la suela marcada de carbonilla: alguien que trabaja de pie. Muchas horas.', 'pensativo');
        await MA('Y otras... de zapatillas de andar por casa. Con cuadros, si no me engaña el polvo. ¿Quién viene a una cochera en zapatillas?', 'sorprendido');
        await MA('Y todas van y vienen de los sacos a la puerta de carga del fondo. La que está entreabierta y da a las vías... y a la rotonda.', 'convencido');
        await pistaCocheras('pistaPegadasC');
      } },
    { name: 'Sacos de carbón', key: true, done: () => flag('pistaCarbon'), r: [663, 426, 135, 110], at: [520, 500], face: 'R',
      look: async () => {
        await MA('Sacos de carbón de piedra. Del bueno: brilla y casi no mancha. Y al lado, una carretilla con las ruedas negras de ir y venir.', 'pensativo');
        if (flag('carbonRoubado')) await MA('Carbón de piedra, que según Concha no compra nadie en Monforte desde hace años... Aquí acaba el carbón de Andrés. Saco a saco, y pagado.', 'convencido');
        else await MA('Carbón de piedra. Eso no se compra en el súper. Alguien lo trae de algún sitio, saco a saco.', 'dudoso');
        await pistaCocheras('pistaCarbon');
      },
      act: () => MA('No toco nada. Ya tengo bastante con que me pillen dentro; como encima me pillen con carbón en las manos, no hay excusa que valga.', 'avergonzado') },
    { name: 'Carretilla', r: [537, 384, 126, 114], look: () => MA('Una carretilla de obra con las ruedas negras de carbón. Ha hecho más viajes esta semana que el regional de Ourense.', 'risueno') },
    { ...motorPista(), r: [0, 288, 252, 198], at: [200, 500], face: 'L' },
    { name: 'Postigo', r: [279, 192, 69, 159], look: () => MA('Una puerta pequeña con ventanuco. Cerrada con llave. La que usan es la de al lado, la de carga, entreabierta.', 'pensativo'),
      act: () => MA('Cerrada. Y no tengo la combinación de esta. Ni ganas: la de carga ya está abierta.', 'esceptico') },
    { ...COCHERAS_COMUNS.porta, r: [0, 156, 246, 130] },
    { name: 'Plano', r: [816, 126, 114, 111], look: () => MA('Un plano de locomotora clavado con chinchetas. Una Mikado, de perfil. Con anotaciones a lápiz en los tubos y en el inyector. Esto es el manual de instrucciones de esta noche.', 'sorprendido') },
    { name: 'Chaves', r: [816, 237, 120, 80], look: () => MA('Llaves fijas en fila, de la más grande a la más pequeña. Ni una fuera de su sitio. Aquí trabaja alguien con alma de jefe de depósito.', 'pensativo') },
    { name: 'Taladro', r: [672, 171, 78, 120], look: () => MA('Un taladro de columna. Este no viene de una carpintería: es de taller de ferrocarril. Aquí se juntan dos oficios. Como en mi familia.', 'pensativo') },
    { name: 'Esmeriladoras', r: [768, 296, 192, 80], look: () => MA('Dos esmeriladoras al final del banco. Con chispas de hace nada en la pared. Aquí se ha afilado algo hoy.', 'pensativo') },
    { name: 'Armario', r: [423, 318, 81, 54], look: () => MA('Un armario metálico verde, con candado de los de llave. Los secretos de verdad no se escriben en la pizarra.', 'esceptico') },
    { name: 'Poleas do chan', r: [240, 414, 144, 72], look: () => MA('Poleas sueltas en el suelo, de las que iban en el eje del techo. Alguien está montando o desmontando la transmisión. O buscando algo dentro.', 'pensativo') },
    { ...COCHERAS_COMUNS.lampada, r: [84, 60, 78, 57] },
    { ...COCHERAS_COMUNS.transmision, r: [339, 18, 81, 90] },
  ],
};
async function motorLook() {
  await showDoc('<h4>O motor da lona</h4><p>Un motor eléctrico Siemens de 10 CV, vello, desmontado polea a polea e todo moi ordenado.</p><p style="font-size:22px;text-align:center">A.F.G.</p><p class="sub">Gravado a navalla na carcasa. A mesma letra que o «X. N.» do piar do taller. Os parafusos da tapa son novos: alguén o abriu hai pouco. (O motor e a maquinaria nas cocheras son ficción do xogo)</p>');
  await MA('A.F.G.... Alfredo Fernández Gutiérrez. El carpintero de mi casa. Rosario dijo que el taller tenía un motor Siemens de diez caballos.', 'sorprendido');
  await MA('Y las letras están grabadas a navaja con la misma letra que el pilar de mi taller. La de Xosé N.', 'pensativo');
  await MA('Cómo llegó hasta aquí, con la sierra y el torno, ni idea. Pero el que lo grabó sabía de dónde venía. Y alguien lo ha abierto hace poco. Buscando algo.', 'dudoso');
}

/* ---------- A7b · A rotonda do museo coa Mikado, de día (portada de Oscar) ----------
   Opcional. Chégase pola dereita do exterior das cocheras. A Mikado é unha peza de exposición ao aire libre. */
const ROTONDA_CROP = [0, 160, 1536, 864];
const ROTONDA_WALK = [[140, 424], [868, 424], [940, 540], [30, 540]];
SCENES.rotonda = {
  name: 'Rotonda do museo', bg: 'img/portada-rotonda.jpg', crop: ROTONDA_CROP, music: 'estacion', floor: 'pedra',
  walk: ROTONDA_WALK, scale: [424, 0.4, 540, 0.56], actorH: 300, start: [480, 520], minSpeed: 0.4,
  hotspots: [
    { name: 'Cocheras do museo', key: true, r: [300, 506, 360, 34], at: [480, 530], face: 'F', exit: ['cocheras', [900, 480]], hint: 'D',
      look: () => MA('Por ahí vuelvo a la fachada del museo y a las cocheras.', 'pensativo') },
    { name: 'Mikado', key: true, r: [250, 130, 610, 210], at: [540, 432], face: 'B',
      done: () => !flag('fimActo2') || flag('a3MikadoTibia'),
      look: async () => {
        if (!flag('fimActo2')) return MA('La Mikado. Ochenta toneladas de hierro negro, quieta encima de la plataforma como esperando turno. De crío pensaba que de noche se iba a dar una vuelta. Cosas de crío.', 'sonriente');
        await MA('La Mikado. Le pongo la mano en la caldera, como quien toca la frente a un niño...', 'pensativo');
        await MA('Tibia. Una máquina que lleva años de adorno no está tibia en noviembre. Esta ha tenido fuego hace menos de un día.', 'sorprendido');
        setFlag('a3MikadoTibia');
      },
      act: () => MA('¿Subirme a la cabina de una pieza de museo, a plena luz del día y con el uniforme de Renfe? Mañana sale en el periódico. Y Concha lo lee antes que nadie.', 'avergonzado') },
    { name: 'Ténder', r: [180, 160, 280, 170],
      look: () => MA(flag('fimActo2') ? 'El ténder, con carbón. Carbón de piedra, brillante, recién echado: el de adorno es mate y tiene polvo. Este no.' : 'El ténder, lleno de carbón de exposición. Ese no ha ardido nunca. O eso creo.', 'pensativo') },
    { name: 'Plataforma xiratoria', r: [120, 330, 760, 90], look: () => MA('La plataforma giratoria. Con ella se daba la vuelta a las locomotoras como quien gira un plato. Desde aquí se mandaba una máquina a cualquier vía. Hoy no manda a ninguna.', 'pensativo') },
    { name: 'Rotonda', r: [0, 0, 960, 130], look: () => MA('Las cocheras en abanico, cada una con su máquina o su coche dormido. Un museo que, si cierras los ojos, todavía huele a turno de noche.', 'sonriente') },
  ],
};
{
  // exterior das cocheras: paso á rotonda pola dereita (todos os actos)
  SCENES.cocheras.hotspots.push({ name: 'Rotonda do museo', key: true, r: [912, 372, 48, 130], at: [936, 480], face: 'R', exit: ['rotonda', [480, 520]], hint: 'R',
    look: () => MA('Por ahí, rodeando el museo, está la rotonda con la Mikado. La que se ve desde mi balcón.', 'pensativo') });
}

/* ---------- A7c · A noite: vixilancia dende dentro do coche de viaxeiros ----------
   Oscar (16-11-2026): Martín escóndese DENTRO do coche clásico, non detrás. Fondo: ilustración de Oscar do coche comedor
   pasada a noite (tools/fondos-acto3.py). Dende a fiestra da esquerda vese a porta do taller. */
async function vixilia() {
  setFlag('a3Noite');
  await MA('Las once menos cuarto. Llave de cuadradillo, media vuelta... y dentro. Si me pillan, estoy revisando el material. De noche. Sin que nadie me lo pida.', 'avergonzado');
  E.fadeTo = 1; await sleep(500);
  enterScene('cocheNoite', [150, 512]);
  await sleep(300); E.fadeTo = 0;
  await MA('Un coche comedor. Mesa larga, sillas de terciopelo, lamparitas... y unas cortinas con una rendija justo a la altura del ojo. El escondite perfecto.', 'risueno');
  await MA('...', 'pensativo');
  SFX.door(); await sleep(400);
  await MA('Ahí está. La persiana de las cocheras sube un palmo. Salen sombras: una carretilla cargada de carbón, un farol de mano... y unas zapatillas de cuadros.', 'sorprendido');
  await MA('No van hacia la plaza. Rodean el museo hacia la rotonda. Hacia la Mikado.', 'pensativo');
  SFX.noise(1.6, 300, 0.6, 0.12);
  await MA('Y al rato, un resoplido que hace temblar el cristal. Una caldera cogiendo presión. Al aire libre, en mitad de Monforte.', 'sorprendido');
  await MA('Vamos allá, Martín: tú tienes licencia de maquinista. Ellos, no sé qué tienen.', 'convencido');
  toast('Novo obxectivo: saír do coche e seguilos ata a rotonda da Mikado');
}
SCENES.cocheNoite = {
  name: 'Coche de viaxeiros · noite', bg: 'img/noite-coche-viaxeiros.jpg', music: null, floor: 'madeira',
  // ilustración de Oscar (img/bg-coche-viaxeiros.jpg) pasada a noite con tools/fondos-acto3.py. Martín, agachado á esquerda, xunto á fiestra.
  walk: [[16, 482], [292, 482], [250, 540], [0, 540]],
  scale: [482, 0.5, 540, 0.6], actorH: 300, start: [150, 512], minSpeed: 0.4,
  draw(c, t) {
    // a luz da persiana do taller, que latexa na fiestra da esquerda
    c.save(); c.globalAlpha = 0.16 + 0.07 * Math.sin(t * 5); c.fillStyle = '#ffb050'; c.fillRect(26, 236, 52, 16); c.restore();
  },
  hotspots: [
    { name: 'Porta do coche', key: true, done: () => flag('a3NoiteEntrada'), r: [0, 470, 60, 70], at: [40, 520], face: 'L', exit: ['cocherasNoite', [200, 470]], door: true, hint: 'L',
      look: () => MA('La puerta del coche, a mi espalda. Fuera, el frío de noviembre y una Mikado respirando.', 'pensativo') },
    { name: 'Fiestra', key: true, done: () => true, r: [0, 24, 92, 250], at: [120, 500], face: 'L',
      look: () => MA(flag('a3Noite') ? 'Por la rendija de la cortina: la persiana del taller subida un palmo y luz naranja por debajo. Y nadie a la vista. Se han ido todos a la rotonda.' : 'La ventanilla, con su cortina. Desde aquí se ve la puerta del taller.', 'pensativo') },
    { name: 'Fiestras do outro lado', r: [866, 24, 94, 280], look: () => MA('Al otro lado, solo noche y vías. Por ahí no viene nadie. Por eso me he puesto en este.', 'pensativo') },
    { name: 'Cadro da parella', r: [380, 84, 66, 84], look: () => MA('Una pareja de las de antes, muy tiesa, con sombrero y vestido de domingo. Mirándome como si yo no hubiera pagado billete. Que no lo he pagado.', 'avergonzado') },
    { name: 'Foto da locomotora', r: [538, 84, 58, 42], look: () => MA('Una foto de una máquina de vapor echando humo. Hasta en la pared de un coche comedor, el protagonista es la locomotora. Como debe ser.', 'sonriente') },
    { name: 'Roda', r: [538, 130, 58, 60], look: () => MA('Una rueda de latón colgada en la pared, de adorno. Parece un timón de barco. En un tren. Alguien se equivocó de museo, o tenía mucho humor.', 'risueno') },
    { name: 'Lámpada', r: [348, 166, 38, 46], look: () => MA('Una lamparita de mesa con su pantalla. Apagada. Encenderla ahora sería como poner un cartel: «Martín, aquí».', 'esceptico') },
    { name: 'Lámpada', r: [594, 166, 38, 46], look: () => MA('La otra lamparita, también apagada. Esta noche aquí se espía a oscuras, como en las películas que daban en la tele los sábados.', 'pensativo') },
    { name: 'Apliques', r: [164, 36, 44, 74], look: () => MA('Apliques de latón con su pantallita. Con la luz encendida, este coche debía de parecer un salón de baile. A oscuras parece una sala de espera de fantasmas.', 'risueno') },
    { name: 'Mesa', r: [340, 236, 270, 236], look: () => MA('La mesa larga del coche comedor, con su mantel. Aquí cenaban los que podían, mientras en tercera los demás se comían el bocadillo de pie.', 'pensativo') },
    { name: 'Cadeiras', r: [190, 290, 140, 190], look: () => MA('Sillas de madera con el asiento de terciopelo azul. Me siento en una y no me levanto en tres días. Pero no he venido a eso.', 'sonriente') },
    { name: 'Cortinas', r: [84, 0, 78, 270], look: () => MA('Cortinas azules, gordas, de las que tapan de verdad. Por la rendija se ve todo y a mí no me ve nadie.', 'convencido') },
    { name: 'Cortina do fondo', r: [456, 86, 64, 104], look: () => MA('Al fondo, otra cortina. Detrás debe de estar la cocina o el pasillo. No miro: bastante tengo con vigilar una puerta.', 'pensativo') },
  ],
};
SCENES.cocherasNoite = {
  ...SCENES.cocheras, name: 'Museo do Ferrocarril · noite', bg: 'img/noite-cocheras.jpg', music: null,
  draw(c, t) { c.save(); c.globalAlpha = 0.18 + 0.08 * Math.sin(t * 5); c.fillStyle = '#ffb050'; c.fillRect(710, 380, 110, 18); c.restore(); },
  onEnter: null,
  hotspots: [
    { name: 'Rotonda do museo', key: true, done: () => false, r: [912, 372, 48, 130], at: [936, 480], face: 'R', exit: ['rotondaNoite', [480, 528]], hint: 'R',
      look: () => MA('Por ahí se fueron, con la carretilla. Rodeando el museo, hacia la rotonda. Y de ahí viene el resoplido.', 'pensativo') },
    { name: 'Porta do taller', r: [720, 288, 102, 138], at: [700, 446], face: 'R',
      act: () => MA('Dentro ya no queda nadie: se han llevado el carbón y el inyector. Lo que importa esta noche está en la rotonda.', 'convencido'),
      look: () => MA('La persiana, subida un palmo. Luz naranja por debajo: se la han dejado encendida para volver.', 'pensativo') },
    { name: 'Coche de viaxeiros', r: [0, 215, 160, 238], at: [200, 470], face: 'L', exit: ['cocheNoite', [150, 512]], door: true,
      look: () => MA('Mi escondite. Bonito, pero cada vez que pasa un coche de verdad me late el corazón a nueve kilos de presión.', 'avergonzado') },
    { name: 'Praza da Estación', r: [300, 506, 360, 34], at: [480, 528], face: 'F',
      act: () => MA('¿Irme ahora? ¿Con una Mikado respirando a la vuelta de la esquina? Ni loco. Bueno, un poco loco, pero no tanto.', 'convencido'),
      look: () => MA('Por ahí se vuelve a la plaza. Hoy, no.', 'convencido') },
    { name: 'Fiestras acesas', r: [600, 240, 60, 60], look: () => MA('Las ventanas de las cocheras, iluminadas. Desde la plaza se tiene que ver. Media ciudad lo sabe y nadie dice nada. Muy de Monforte.', 'pensativo') },
  ],
};

/* ---------- A7b · A rotonda de noite: a Mikado acesa, Remedios, Don Anxo e os xubilados ---------- */
async function noiteEntrada() {
  if (flag('a3NoiteEntrada')) return;
  setFlag('a3NoiteEntrada');
  await MA('...', 'sorprendido');
  await RE('Quen anda aí?! Isto é propiedade do museo!');
  await MA('Y yo, propiedad de Renfe. Martín Pardo, maquinista. El de la casa roja de Doctor Casares.', 'avergonzado');
  await RE('O da casa roxa...');
  await RE('Apaga a lanterna do móbil e baixa a voz. Se pasa a patrulla, aquí somos catro vellos limpando unha máquina. E ti, o sobriño.');
  await MA('(Una mujer con mono azul y gafas de soldar. Un señor mayor con gorra... y zapatillas de cuadros. Y dos más junto al ténder, de espaldas, que hacen como que no existen.)', 'pensativo');
  await MA('(Y la Mikado, encima de la plataforma, con fuego en la caldera. Respirando.)', 'entusiasmado');
  await AX('Remedios... As pastillas. Non as atopo.');
  await RE('Non as baixaches buscar, Anxo. Teimudo. Ti e mais a túa tensión.');
  await MA('(Don Anxo. El fogonero. Y se busca en los bolsillos unas pastillas que tengo yo.)', 'convencido');
  toast('Novo obxectivo: darlle as pastillas a Don Anxo');
}
async function darPastillas() {
  take('pastillas'); setFlag('anxoPastillas');
  await MA('Don Anxo. Sus pastillas, de parte de Valerio. «Una al acostarse.»', 'sonriente');
  await AX('...');
  await AX('Valerio. Ese rapaz non sabe gardar un segredo nin nun frasco.');
  await AX('Grazas, maquinista.');
  await RE('Se Anxo che dá as grazas, algo terás. Leva tres semanas sen darllas nin ao Dépor.');
  await MA('(Primera vez que me llaman «maquinista» en Monforte sin que suene a reproche.)', 'aliviado');
  toast('Novo obxectivo: falar con Remedios');
}
async function anxoTalk() {
  if (!flag('anxoPastillas')) {
    if (hasItem('pastillas')) {
      const i = await choose([{ t: 'Don Anxo, le traigo sus pastillas. (Dárselas.)' }, { t: 'Mejor no le molesto.' }]);
      if (i === 0) return darPastillas();
      return AX('...');
    }
    return AX('As pastillas... Onde as deixei.');
  }
  const opts = [
    ...(hasItem('nota1958') && !flag('anxoNota') ? [{ t: 'Catorce de enero de 1958. X. Nogal. (Enseñarle la nota.)', k: 'nota' }] : []),
    ...(flag('anxoNetoSabe') && !flag('anxoNeto') ? [{ t: 'Conozco a su nieto. Andrés, el del Fluvial.', k: 'neto' }] : []),
    { t: '¿Usted fue fogonero aquí?', k: 'fogo' },
    { t: 'Nada, Don Anxo. Que se tome la pastilla.', k: 'adeus' },
  ];
  const k = opts[await choose(opts)].k;
  if (k === 'nota') return anxoNota();
  if (k === 'neto') {
    setFlag('anxoNeto');
    await AX('Andrés...');
    await AX('Non lle digas que me viches aquí. Ese rapaz xa carga bastante comigo. E cando se preocupa, ponse a traballar. E iso non é natural nel.');
    await RE('O neto non sabe nada, Martín. Que siga así.');
    await MA('(No sabe nada. Ya. Y yo soy de Valencia.)', 'esceptico');
    return;
  }
  if (k === 'fogo') { await AX('Vinte e catro anos tiña, e xa me queixaba da pa.'); await AX('E agora pesa outra vez. Pero esta vez non me queixo.'); }
  if (k === 'adeus') await AX('Ao deitarse. Xa o sei. Valerio escríbeo grande para que o lea sen lentes.');
}
async function anxoNota() {
  setFlag('anxoNota');
  await AX('...');
  await AX('Hai noites que mellor non lembrar.');
  await MA('(Se da la vuelta y se va hacia la cabina, hacia el fuego. Le tiemblan las manos. No de frío.)', 'preocupado');
  await RE('Déixao, Martín. Hai cousas que levan sesenta e oito anos no mesmo sitio. Non se moven nunha noite.');
}
async function remediosTalk() {
  if (!flag('anxoPastillas')) {
    await RE('Primeiro dime que fas aquí a estas horas. E por que Anxo non para de mirarte.');
    await MA('(Mira... o mira mis bolsillos. Las pastillas de Valerio.)', 'pensativo');
    return;
  }
  if (!flag('remediosConta')) {
    setFlag('remediosConta');
    await RE('Ben. Xa que estás aquí... Chámome Remedios. Soldadora do depósito, xubilada. Aprendinlle a soldar a medio Monforte.');
    await RE('Adif lévase a Mikado nun mes. Nun góndola, ao museo doutra cidade. Para sempre.');
    await RE('E nós queremos unha última saída. Polas súas rodas. Con lume de verdade. Unha vez.');
    await MA('¿Una salida? ¿Por la vía? ¿Con esta máquina? Eso no es restaurar: eso es... precioso. Y bastante ilegal.', 'sorprendido');
    await RE('Precioso primeiro. O ilegal xa o arranxaremos.');
  }
  for (;;) {
    const opts = [
      ...(!flag('inxectorFeito') ? [{ t: '¿Qué os falta?', k: 'falta' }] : []),
      ...(!flag('reRotonda') ? [{ t: '¿Una caldera encendida en plena rotonda y nadie dice nada?', k: 'rotonda' }] : []),
      ...(!flag('reLousa') ? [{ t: 'Nueve kilos de presión. Lo pone la pizarra de las cocheras.', k: 'lousa' }] : []),
      ...(!flag('reMotor') ? [{ t: 'Lo de las cocheras es la carpintería de mi casa. El motor pone A.F.G.', k: 'motor' }] : []),
      ...(!flag('reCarbon') ? [{ t: 'El carbón es del Fluvial. Y alguien lo paga con billetes.', k: 'carbon' }] : []),
      ...(!flag('reAsubio') ? [{ t: '¿Quién silba de noche? Dos largos y uno corto.', k: 'asubio' }] : []),
      { t: 'Os dejo trabajar.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'falta') { await inxector(); if (flag('fimActo3')) return; }
    if (k === 'rotonda') {
      setFlag('reRotonda');
      await RE('Ás once da noite, en Monforte, só quedan os gatos e Concha. E os gatos non falan.');
      await MA('Concha sí.', 'esceptico');
      await RE('Concha sábeo todo e non conta nada importante. É o seu xeito de gardar segredos.');
      await RE('E de día, catro vellos con bayetas: «mantemento». Ninguén lle pregunta nada a un vello cunha bayeta.');
    }
    if (k === 'lousa') { setFlag('reLousa'); await RE('Le a lousa e xa se cre de casa. Iso escribino eu. Letra de soldadora: recta e sen rebabas.'); }
    if (k === 'motor') {
      setFlag('reMotor');
      await RE('O motor...');
      await RE('Iso é cousa doutro. Dese motor sabe máis outro que non está aquí esta noite. Leva meses abríndoo e pechándoo.');
      await MA('¿Buscando qué?', 'dudoso');
      await RE('Pregúntallo a el. Cando chegue o momento, xa cho dirá. Eu non lle conto as cousas a ninguén. Para iso está Concha.');
      await MA('¿Y cómo llegó a las cocheras toda una carpintería? Rosario dice que en el cincuenta y dos se vendió todo a un ingeniero de Caminos y a un contratista.', 'pensativo');
      await RE('Iso non o sabe ninguén, rapaz. Cando entrei eu no depósito, no setenta e cinco, xa estaba alí: serras, torno, prensas... todo baixo lonas, nun recuncho. Ninguén preguntaba. Nós usámola para amañar as pezas.');
      await MA('Pues no me lo invento. Lo que no se sabe, se queda en pregunta. Y esta se queda en las cocheras, con el motor.', 'convencido');
    }
    if (k === 'carbon') {
      setFlag('reCarbon');
      if (CARBON_QUEN === 'remedios') { await RE('Pillada. Son eu. Un saco cada dúas semanas, e vinte euros baixo a pedra. Da miña pensión, que conste.'); await MA('Un robo con factura. Andrés va a querer darte de alta como socia.', 'risueno'); }
      else if (CARBON_QUEN === 'anxo') { await RE('Iso pregúntallo a Anxo. El escolle o carbón polo son ao caer na pa.'); await AX('O bo carbón soa a campá. O malo, a lata.'); }
      else { await RE('O carbón tráeo un amigo. E págao, que é moi seu para as contas. Máis non che digo.'); await MA('(Puntual con las cuentas. Como un horario de tren. Otra vez.)', 'pensativo'); }
    }
    if (k === 'asubio') { setFlag('reAsubio'); await RE('O asubío ten dono. E esta noite non veu.'); await MA('¿Y quién es?', 'dudoso'); await RE('Un que asubía mellor do que fala. Que xa é dicir.'); }
    if (k === 'adeus') { await RE('Traballar? Se non temos maquinista, isto é un museo con fume.'); return; }
  }
}
/* puzzle do inxector: procedemento de maquinista, sen morte nin volta atrás (as opcións malas só dan broma) */
async function inxector() {
  await RE('Fáltanos o que non se compra. A caldeira colle presión, pero o inxector non mete auga. Montámolo esta noite, recén amañado, e nada. E sen auga na caldeira, non hai saída: hai unha bomba.');
  await RE('E ningún de nós ten licenza para movela. Anxo foi fogoneiro, eu soldadora, eses dous, de oficinas.');
  await RE('Ti dis que es maquinista. Pois cébame ese inxector, maquinista.');
  for (;;) {
    const k = await choose([
      { t: 'Vapor a tope, y que sea lo que Dios quiera.' },
      { t: 'Un golpe seco con la llave inglesa, que a veces se pega.' },
      { t: 'Primero el agua del ténder. Luego el vapor, poco a poco, hasta que deje de escupir por el rebose.' },
    ]);
    if (k === 0) {
      SFX.noise(0.8, 900, 0.5, 0.15);
      await MA('Abro el vapor... ¡FSSSSH! Sale todo por el rebose, en una nube. Uno de los de oficinas ha salido regado.', 'avergonzado');
      await RE('Así se rega un xubilado, non unha caldeira. Outra vez. E con xeito.');
      continue;
    }
    if (k === 1) {
      await MA('¡Clonc!', 'risueno');
      await RE('Iso valía nos Seat 600. Na Mikado, non. Ela ten máis estudos ca ti.');
      continue;
    }
    break;
  }
  await MA('Agua primero. Abro el grifo del ténder... Ahora el vapor, despacio. Escupe por el rebose... escupe... y...', 'pensativo');
  SFX.tone(660, 0.25, 'sine', 0.06); await sleep(260); SFX.tone(880, 0.6, 'sine', 0.05);
  await MA('...canta. ¿Lo oís? Ese silbidito fino. El inyector está metiendo agua en la caldera.', 'orgulloso');
  await AX('Canta. Coma no 58.');
  await RE('Anxo...');
  await AX('Non dixen nada. Dixen que canta.');
  setFlag('inxectorFeito');
  await RE('Martín Pardo. Fáltanos un maquinista con licenza. Un que saiba o que fai. E que non lle teña medo a Adif.');
  await RE('Un mes. Unha saída. Que dis?');
  await MA('Digo que he venido a Monforte a instalarme. Que llevo cuatro días. Y que esta semana ya he hecho de fontanero, de detective y de cerrajero.', 'esceptico');
  await MA('...Y que maquinista es lo único que sé hacer bien.', 'convencido');
  await fimActo3();
}
async function fimActo3() {
  setFlag('fimActo3');
  await showDoc('<h4>FIN DO ACTO 3 · «A curiosidade»</h4><p>Non había pantasma. Había unha soldadora, un fogoneiro de noventa e dous anos en zapatillas, dous xubilados de oficinas e unha Mikado que volve respirar no medio da rotonda.</p><p>E alguén que asubía, e que esta noite non veu.</p><p>O Acto 4, «A implicación», chegará nun próximo hito.</p>');
}
function pintarCarretilla(c, x, y) {
  c.save(); c.strokeStyle = '#141010'; c.lineWidth = 2;
  c.fillStyle = '#3c6a46'; c.beginPath(); c.moveTo(x - 30, y - 22); c.lineTo(x + 26, y - 22); c.lineTo(x + 16, y); c.lineTo(x - 22, y); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#18181a'; c.beginPath(); c.ellipse(x - 2, y - 22, 26, 7, 0, Math.PI, 0); c.fill();
  c.fillStyle = '#222'; c.beginPath(); c.arc(x + 20, y + 4, 8, 0, 7); c.fill(); c.stroke();
  c.strokeStyle = '#6a4a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 28, y - 14); c.lineTo(x - 52, y + 6); c.stroke();
  c.restore();
}
SCENES.rotondaNoite = {
  ...SCENES.rotonda, name: 'Rotonda do museo · noite', bg: 'img/noite-rotonda.jpg', crop: null, music: null,
  draw(c, t) {
    pintarCarretilla(c, 150, 470);
    // fume da cheminea, lume que latexa na cabina e o farol de man
    c.save(); c.fillStyle = '#c8c8d4';
    for (let i = 0; i < 6; i++) { const k = (t * 0.25 + i / 6) % 1; c.globalAlpha = 0.32 * (1 - k); c.beginPath(); c.arc(760 + Math.sin(t * 0.8 + i) * 14 * k, 118 - k * 110, 10 + k * 34, 0, 7); c.fill(); }
    c.globalCompositeOperation = 'lighter';
    c.globalAlpha = 0.1 + 0.07 * Math.sin(t * 9) * Math.sin(t * 3.1); c.fillStyle = '#ff8a30';
    c.beginPath(); c.ellipse(520, 232, 26, 20, 0, 0, 7); c.fill();
    c.globalAlpha = 0.16 + 0.05 * Math.sin(t * 7); c.fillStyle = '#ffc070';
    c.beginPath(); c.arc(190, 456, 26, 0, 7); c.fill();
    c.restore();
  },
  onEnter: () => noiteEntrada(),
  hotspots: [
    { name: 'Saír', r: [300, 512, 360, 28], at: [480, 530], face: 'F',
      act: () => MA(flag('fimActo3') ? 'Irme ahora sería como bajarse del tren en marcha. Ya habrá tiempo de dormir.' : 'Ahora no me voy. Ni aunque me echen. Bueno, si me echa Remedios, igual sí.', 'convencido') },
    { name: 'Mikado', r: [250, 130, 610, 210], at: [540, 432], face: 'B',
      look: () => MA('La Mikado, encendida. El farol, la chimenea, el resoplido... Está viva. Hace años que no veía una de vapor respirar así. Y al aire libre, con las estrellas de público.', 'entusiasmado'),
      act: () => MA(flag('inxectorFeito') ? 'Ya la he tocado. Y me ha contestado.' : 'Sin permiso de Remedios, a la cabina no subo. Aquí, esta noche, ella es el jefe de depósito.', 'pensativo') },
    { name: 'Carretilla', r: [96, 440, 90, 50], look: () => MA('La carretilla de las cocheras, con el carbón de Andrés. Haciendo por fin lo que tiene que hacer: viajar hasta una caldera.', 'sonriente') },
    { name: 'Plataforma xiratoria', r: [120, 340, 760, 70], look: () => MA('La plataforma giratoria, con la Mikado encima. De noche, con el fuego, parece un escenario. Y yo, el que llega tarde a la función.', 'pensativo') },
    { name: 'Rotonda', r: [0, 0, 960, 120], look: () => MA('Las cocheras en abanico, a oscuras. Las otras máquinas duermen. La Mikado, esta noche, no.', 'pensativo') },
  ],
  npcs: [
    { id: 'remedios', name: 'Remedios', key: true, x: 250, y: 506, w: 60, h: 300, at: [330, 512], face: 'L',
      draw(c, t, talking, s) { figura(c, this.x, this.y, this.h * s, LOOK_REMEDIOS, t, talking); },
      done: () => flag('fimActo3'),
      look: () => MA('Mono azul, gafas de soldar en la frente y unas manos que han cerrado más costuras que una modista. Aquí manda ella.', 'pensativo'),
      talk: () => remediosTalk(),
      give: {
        pastillas: () => RE('A min non. A Anxo. Eu as miñas tómoas á hora, coma as persoas.'),
        nota1958: () => RE('Iso non mo ensines a min. A min non me queima. Hai quen leva sesenta e oito anos queimándose con iso.'),
        foto1949: () => RE('Xosé... Iso gárdao, Martín. Hai quen daría un brazo por esa foto. E non son eu.'),
        trapo: () => RE('O meu trapo! Levaba días buscándoo. Non, quédao: xa está feito unha pena.'),
      } },
    { id: 'anxo', name: 'Don Anxo', key: true, x: 720, y: 508, w: 60, h: 290, at: [640, 514], face: 'R',
      draw(c, t, talking, s) { figura(c, this.x, this.y, this.h * s, LOOK_ANXO, t, talking); },
      done: () => flag('anxoPastillas'),
      look: () => MA(flag('anxoPastillas') ? 'Don Anxo, con su gorra, mirando el fuego de la cabina como quien mira una tele que solo él entiende.' : 'Un señor mayor con gorra y zapatillas de cuadros. Se palpa los bolsillos una y otra vez. Busca algo que no lleva.', 'pensativo'),
      talk: () => anxoTalk(),
      give: {
        pastillas: () => darPastillas(),
        nota1958: () => flag('anxoPastillas') ? (flag('anxoNota') ? AX('...') : anxoNota()) : AX('Agora non, rapaz. Agora busco as pastillas.'),
        foto1949: async () => { await AX('...'); await AX('Era bo rapaz.'); await MA('(No dice quién. No hace falta.)', 'preocupado'); },
      } },
    { id: 'xub1', name: 'Xubilado', key: false, x: 390, y: 446, w: 40, h: 280,
      draw(c, t, talking, s) { figura(c, this.x, this.y, this.h * s, { costas: true, roupa: '#3a3a44', pelo: '#9a9a9a', pa: true }, t, talking); },
      look: () => MA('Un jubilado de oficinas, de espaldas, con una pala junto al ténder. Hace como que no está. Se le da fatal.', 'risueno'),
      talk: () => say('Xubilado', 'Eu non estou aquí. Eu estou na cama. Pregúntalle á miña muller.') },
    { id: 'xub2', name: 'Xubilada', key: false, x: 600, y: 446, w: 40, h: 270,
      draw(c, t, talking, s) { figura(c, this.x, this.y, this.h * s, { costas: true, roupa: '#5a3a3a', pelo: '#d8d8d8' }, t, talking); },
      look: () => MA('Otra jubilada, de espaldas, apuntando algo en una libreta. La presión, seguro. O la lista de la compra. O las dos.', 'risueno'),
      talk: () => say('Xubilada', 'Nove quilos, Remedios! E subindo!') },
  ],
};

/* ---------- preset do Acto 3 en «Escoller acto» ---------- */
{
  const F = { ...(ACTS.find(a => a.id === 'acto2').flags || {}) };
  for (const k of ['a2Inicio', 'a2ConchaSauda', 'objValerio', 'objAndres', 'valerioSauda', 'valerioDoce', 'valerioFeito', 'librosValerio', 'pistaCurma', 'andresSauda', 'andresFeito',
    'carbonRoubado', 'avisoChampions', 'champions', 'teleAcesa', 'silbato2', 'chaveNovidade', 'chaveTaller', 'tallerAberto', 'tallerA2Visto', 'pistaFoto', 'pistaData',
    'gravadoVisto', 'pistaPegadas', 'pistaTrapo', 'pistaSoporte', 'a2XoanSauda', 'a2Candado', 'fimActo2', 'a3Inicio']) F[k] = true;
  const i = ACTS.findIndex(a => a.id === 'acto3');
  ACTS[i] = { id: 'acto3', name: 'Acto 3 · A curiosidade', desc: 'Xoves: Xoán e Xosé N., o libro de 1958 de Valerio, o candado das cocheras e a noite da Mikado',
    scene: 'vestibulo', at: [880, 430], inv: ['chavesCasa', 'contrato', 'navalla', 'chave', 'foto1949', 'trapo'], flags: F,
    intro: async () => { E.act = 'acto3'; await MA('Jueves. Y ahí está Xoán, delante del mural. Hoy no se me escapa: ¿quién era Xosé N.?', 'convencido'); toast('Novo obxectivo: preguntarlle a Xoán quen era Xosé N.'); } };
}

/* ---------- caderno de Martín · Acto 3 ---------- */
{
  const A3 = () => flag('fimActo2') && !flag('fimActo3');
  CADERNO.push(
    { when: () => A3() && !flag('a3XoseN'), t: 'Preguntarle a Xoán, en el vestíbulo de la estación, quién era Xosé N.' },
    { when: () => A3() && hasItem('trapo') && !flag('a3Graxa') && !flag('candadoAberto'), t: 'Enseñarle a Xoán el trapo con grasa. Él sabe de dónde sale cada gota del depósito.' },
    { when: () => A3() && flag('a3XoseN') && !flag('libro1958'), t: 'Valerio guarda los libros de su padre desde 1950. Pedirle enero de 1958 (Farmacia de la Estación).' },
    { when: () => A3() && !flag('candadoAberto'), t: 'El candado de cuatro cifras de las cocheras del museo. En el pilar del taller ponía 14-I-1958.' },
    { when: () => A3() && flag('candadoAberto') && !cocherasCompletas(), t: () => `Mirar bien dentro de las cocheras (con el OLLO, el suelo también habla). Pistas: ${PISTAS_COCHERAS.filter(flag).length} de ${PISTAS_COCHERAS.length}.` },
    { when: () => listoNoite() && !flag('a3Noite'), t: 'Esta noche, a las once, a las cocheras: esconderse dentro del coche de viajeros (se abre con mi llave de cuadradillo). Y llevar las pastillas de Don Anxo.' },
    { when: () => A3() && flag('a3Noite') && !flag('a3NoiteEntrada'), t: 'Seguir a los de la carretilla hasta la rotonda de la Mikado, a la derecha del museo.' },
    { when: () => A3() && flag('a3NoiteEntrada') && !flag('anxoPastillas'), t: 'Don Anxo busca sus pastillas. Las llevo yo, de parte de Valerio.' },
    { when: () => A3() && flag('anxoPastillas'), t: 'Hablar con Remedios. ¿Qué les falta?' },
    { when: () => flag('fimActo3'), t: 'Una salida de la Mikado. Un mes. Y alguien que silba y esta noche no vino. (Acto 4, próximamente.)' },
  );
}
