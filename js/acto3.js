'use strict';
/* ==========================================================
   VÍA MORTA · Acto 3 «A curiosidade» (xoves) · 16-11-2026
   Obxectivo: descubrir quen é o pantasma. Dous camiños abertos á vez que se xuntan na noite:
   · Xoán (vestíbulo) → «pregúntalle a quen garda papeis vellos» → Valerio: o libro de xaneiro de 1958 (ficción)
     e as pastillas de Don Anxo, que este luns non baixou buscalas;
   · o trapo con graxa → «os do museo» → o candado das cocheras (1401, a data do piar) → cinco pistas dentro
     (lousa coa proba de lume de hoxe ás 23:00, o motor «A.F.G.», graxa no carril, pegadas e o carbón de Andrés).
   Coas dúas cousas, á noite: escondido tras o coche de viaxeiros → dentro, a Mikado acesa, Remedios, Don Anxo e os xubilados.
   Anxo busca as pastillas (problema) → Martín dállas (solución) → Remedios fala → puzzle do inxector → FIN DO ACTO 3.
   Fichas: docs/05_FICHAS_ESCENARIOS.md, sección «Acto 3». Fondos do interior PROVISIONAIS (tools/fondos-acto3.py);
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
      await CO('E que de noite, nas cocheras do museo, hai luz. Pero iso non cho dixen eu.');
      await MA('¿Luz? ¿Quién lo ha visto?', 'sorprendido');
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
      await VA('Anxo Corredoira. Foi fogoneiro no depósito; ese inverno do 58 tiña dezasete anos.');
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
  await VA('Este luns non veu. As veciñas din que sae todas as noites e volve ás tantas cheirando a carbón. Aos oitenta e cinco anos!');
  await MA('¿Cómo se llama?', 'pensativo');
  await VA('Don Anxo. Anxo Corredoira. Foi fogoneiro. Pero do 58 non fala, Martín. Nunca.');
  await MA('¿Corredoira? ¿Como Andrés, el del Fluvial?', 'sorprendido');
  await VA('É o seu avó. Non o sabías? Andrés cóidao coma quen coida unha máquina vella: a pastilla, o caldo, o Dépor... e nin unha pregunta.');
  await MA(flag('andresInverno') ? '(«Todas las historias menos las de un invierno. Y yo no se lo pregunto.» Andrés no pregunta por el carbón... ni por su abuelo.)' : '(«Eu non pregunto», dijo Andrés del carbón. Por lo visto, tampoco pregunta por su abuelo.)', 'pensativo');
  setFlag('anxoNetoSabe');
  await VA('Xa que andas tanto pola estación... se o atopas, dálle isto. Que sen elas, el non é el.');
  give('pastillas');
  await MA('Un fogonero de ochenta y cinco años que sale de noche y vuelve oliendo a carbón. Ya sé dónde buscar. Y a qué hora no.', 'convencido');
  toast(cocherasCompletas() ? 'Novo obxectivo: ás once, ás cocheras. Agardar tras o coche de viaxeiros' : 'Novo obxectivo: as cocheras do museo (o candado de catro cifras)');
}
{
  const valerioA2 = valerioTalk;
  valerioTalk = () => flag('fimActo2') ? valerioActo3() : valerioA2();
  const V = SCENES.farmacia.npcs.find(n => n.id === 'valerio'), dV = V.done;
  V.done = () => flag('fimActo2') ? flag('libro1958') : dV();
  V.give.pastillas = () => VA('Non, non: son de Anxo. Eu xa tomo as miñas. E as de medio barrio, se me descoido.');
  V.give.nota1958 = () => VA('Copiáchelo ben. Ata as faltas do meu pai. Ese home escribía «queimaduras» con dúas emes cando estaba canso.');
  V.give.foto1949 = () => VA('Serrín e rapaces con mono... Iso é antes do meu pai. Pero o señor do bigote ten cara de pagar ao contado.');
}

/* ---------- C2 · Mega Andrés no Acto 3 (opcional) ---------- */
{
  const andresA2 = andresTalk;
  andresTalk = async () => {
    if (flag('fimActo2') && flag('anxoNetoSabe') && !flag('a3AndresAvo')) return andresAvoActo3();
    if (flag('fimActo2') && flag('pistaCarbon') && !flag('a3AndresCarbon')) {
      setFlag('a3AndresCarbon');
      await MA('Andrés, tu carbón. Sé dónde acaba: en las cocheras del museo. Al lado de una Mikado.', 'pensativo');
      await AN('Nas cocheras? Nunha Mikado?');
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
  if (flag('candadoAberto')) { SFX.door(); return goScene('cocherasDentro', [480, 520]); }
  if (!fallosCandado) await MA(flag('a3Graxa') || flag('pistaData') ? 'Cuatro ruedecitas. Y una fecha grabada en mi pilar que no se me va de la cabeza.' : 'Cuatro ruedecitas con números. Vamos a ver qué tengo en la cabeza.', 'pensativo');
  const c = await candadoCombinacion({ title: 'Candado das cocheras', n: 4, hint: 'Xira as rodas (ou escribe os números) e preme «Probar».' });
  if (c === null) return MA('Lo dejo. Por ahora. Este candado y yo tenemos una conversación pendiente.', 'esceptico');
  if (c === '1401') {
    setFlag('candadoAberto');
    SFX.tone(880, 0.08, 'square', 0.05); await sleep(120); SFX.tone(660, 0.12, 'square', 0.05);
    await MA('Uno, cuatro, cero, uno. Catorce del uno... ¡Clac!', 'sorprendido');
    await MA('¿Quién pone de contraseña una fecha? Mi madre. Y por lo visto, los jubilados del depósito.', 'risueno');
    toast('Abriches o candado das cocheras');
    SFX.door(); return goScene('cocherasDentro', [480, 520]);
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
  coche.act = () => listoNoite() && !flag('a3Noite') ? vixilia() : MA(flag('fimActo2') ? 'Un coche de viajeros de los de cortinas. Buen sitio para esconderse... si tuviera algo que vigilar.' : 'Me subiría ahora mismo, aunque no vaya a ninguna parte. Pero está cerrado. Como todo lo bonito.', 'pensativo');
  coche.look = () => listoNoite() && !flag('a3Noite') ? MA('El coche de viajeros. Desde detrás se ve la puerta del taller y nadie me ve a mí. Perfecto para esperar a las once.', 'convencido') : cocheLook();
  const enter0 = C.onEnter;
  C.onEnter = async function () {
    if (enter0) await enter0.call(this);
    if (listoNoite() && !flag('a3Noite') && !flag('a3AvisoNoite')) {
      setFlag('a3AvisoNoite');
      await MA('Las once, «prueba de fuego». Y un fogonero que sale de noche oliendo a carbón. Me escondo detrás del coche de viajeros y espero.', 'convencido');
      toast('Pista: agarda tras o coche de viaxeiros, á esquerda');
    }
  };
}

/* ---------- A8 · Interior das cocheras, de día (fondo provisional) ---------- */
const PISTAS_COCHERAS = ['pistaLousa', 'pistaMotor', 'pistaCarril', 'pistaPegadasC', 'pistaCarbon'];
const cocherasCompletas = () => PISTAS_COCHERAS.every(flag);
const listoNoite = () => cocherasCompletas() && flag('libro1958') && !flag('fimActo3');
async function pistaCocheras(k) {
  if (flag(k)) return;
  setFlag(k);
  const n = PISTAS_COCHERAS.filter(flag).length;
  if (n < PISTAS_COCHERAS.length) { toast(`Pistas das cocheras: ${n} de ${PISTAS_COCHERAS.length}`); return; }
  await MA('Vale. Lo junto todo antes de que me pillen aquí dentro.', 'pensativo');
  await showDoc(`<h4>Caderno de Martín · xoves</h4><p class="sub">Lo que sé</p>
<p>Alguien está restaurando la Mikado a escondidas: presión de trabajo de 9 kilos, tubos, inyector. Esto no es un museo: es un taller.</p>
<p>Grasa fresca en el carril, la misma de mi taller. Carbón de piedra, el de Andrés. Huellas de botas con carbonilla... y de zapatillas de andar por casa.</p>
<p>El motor de la carpintería de mi casa, aquí, con «A.F.G.» grabado con la misma letra que el pilar. Y alguien lo ha abierto buscando algo.</p>
<p><b>Hoy, a las once: «proba de lume».</b></p>`);
  if (flag('libro1958')) await MA('Esta noche, a las once, aquí. Escondido detrás del coche de viajeros. Y con las pastillas de Don Anxo en el bolsillo.', 'convencido');
  else await MA('Hasta las once tengo tiempo. Y Xoán me dijo que preguntara a quien guarda papeles viejos: Valerio y los libros de su padre.', 'convencido');
  toast(flag('libro1958') ? 'Novo obxectivo: ás once, agardar tras o coche de viaxeiros' : 'Novo obxectivo: o libro de 1958 de Valerio (Farmacia de la Estación)');
}
const LOUSA = ['Presión: 9 kg', 'Probar inxector', 'Mércores: tubos ✓', 'Xoves 23:00:', 'proba de lume'];
function pintarLousa(c, a) {
  c.save(); c.globalAlpha = a; c.fillStyle = '#e8ecdf'; c.font = 'italic 12px Georgia, serif';
  LOUSA.forEach((l, i) => c.fillText(l, 76, 210 + i * 17 - i * 1.2)); c.restore();
}
function pintarMotor(c) {
  if (!flag('pistaMotor')) return;
  // a lona retirada deixa ver o motor Siemens desmontado e as iniciais
  c.save();
  c.fillStyle = '#4a5a6a'; c.strokeStyle = '#141010'; c.lineWidth = 2;
  c.beginPath(); c.roundRect(80, 362, 110, 62, 10); c.fill(); c.stroke();
  c.fillStyle = '#3a4a58'; for (let x = 92; x < 184; x += 12) c.fillRect(x, 366, 5, 54);
  c.fillStyle = '#7a7a80'; c.beginPath(); c.arc(198, 392, 18, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#2a2a2e'; c.beginPath(); c.arc(198, 392, 5, 0, 7); c.fill();
  c.fillStyle = '#6a7a50'; c.beginPath(); c.moveTo(40, 440); c.lineTo(70, 400); c.lineTo(84, 436); c.closePath(); c.fill(); c.stroke();   // lona dobrada
  c.fillStyle = '#e8d8b0'; c.font = 'bold 13px Georgia, serif'; c.fillText('A.F.G.', 108, 400);
  c.restore();
}
SCENES.cocherasDentro = {
  name: 'Cocheras do museo', bg: 'img/bg-cocheras-interior.jpg', music: null, floor: 'pedra',
  walk: [[0, 540], [0, 512], [236, 492], [330, 478], [630, 478], [730, 500], [960, 514], [960, 540]],
  scale: [470, 0.46, 540, 0.56], actorH: 300, start: [480, 520], minSpeed: 0.4,
  draw(c, t) {
    pintarLousa(c, flag('pistaLousa') ? 0.9 : 0.55);
    pintarMotor(c);
    // fume tenue: a caldeira está morna
    c.save(); c.globalAlpha = 0.12; c.fillStyle = '#c8c8d0';
    for (let i = 0; i < 3; i++) { const k = (t * 0.15 + i / 3) % 1; c.beginPath(); c.arc(480 + Math.sin(t + i) * 8, 228 - k * 90, 10 + k * 20, 0, 7); c.fill(); }
    c.restore();
  },
  async onEnter() {
    if (flag('a3DentroVisto')) return;
    setFlag('a3DentroVisto');
    await MA('Madre mía. La Mikado. Aquí dentro, escondida, como quien guarda el coche bueno para las bodas.', 'sorprendido');
    await MA('Y esto no huele a museo. Huele a taller: aceite, carbón... y a alguien que ha estado aquí hace nada.', 'pensativo');
    toast('Pista: usa o OLLO, que o chan tamén fala');
  },
  hotspots: [
    { name: 'Saír ás cocheras', key: true, r: [300, 512, 360, 28], at: [480, 528], face: 'F', exit: ['cocheras', [700, 446]], hint: 'D',
      look: () => MA('La salida. Antes de irme, dejo todo como estaba. Un maquinista sabe dejar las cosas como estaban: es lo que más le piden.', 'pensativo') },
    { name: 'Lousa', key: true, done: () => flag('pistaLousa'), r: [60, 186, 138, 120], at: [150, 500], face: 'L',
      look: async () => {
        await showDoc('<h4>A lousa</h4><p style="font-size:20px;font-style:italic;line-height:1.5">Presión: 9 kg<br>Probar inxector<br>Mércores: tubos ✓<br><b>Xoves 23:00: proba de lume</b></p><p class="sub">Letra de xiz, moi coidada. Letra de quen aprendeu a escribir con pluma.</p>');
        await MA('Nueve kilos de presión: presión de trabajo de verdad. Esto no es limpiar una locomotora para las fotos. Esto es volver a ponerla en marcha.', 'sorprendido');
        await MA('«Jueves, a las once: prueba de fuego». Jueves... es hoy.', 'convencido');
        await pistaCocheras('pistaLousa');
      } },
    { name: 'Motor baixo a lona', key: true, done: () => flag('pistaMotor'), r: [60, 336, 160, 100], at: [236, 500], face: 'L',
      act: async () => {
        if (flag('pistaMotor')) return motorLook();
        await MA('Una lona sobre algo grande, encima del banco. Levanto una esquina... con cuidado, que aquí todo está ordenado como un cuadro de servicio.', 'pensativo');
        setFlag('pistaMotorAberto');
        await motorLook();
        await pistaCocheras('pistaMotor');
      },
      look: () => flag('pistaMotor') ? motorLook() : MA('Algo grande tapado con una lona verde, encima del banco de trabajo. Con forma de motor. O de cerdo muy cuadrado.', 'dudoso') },
    { name: 'Carril', key: true, olloOnly: 'carrilVisto', done: () => flag('pistaCarril'), r: [360, 476, 240, 40], at: [480, 520], face: 'B',
      look: async () => {
        await MA('El carril, delante de las ruedas de la Mikado. Grasa fresca, brillante, sin una mota de polvo. De hoy, o de anoche.', 'sorprendido');
        if (hasItem('trapo')) await MA('Y es la misma grasa que la del trapo de mi taller. Negra, espesa, de bielas. Idéntica.', 'convencido');
        await pistaCocheras('pistaCarril');
      },
      use: { trapo: async () => { await MA('Comparo el trapo con el carril... La misma grasa. El que entra en mi taller sale de aquí. O entra aquí saliendo de mi taller.', 'convencido'); await pistaCocheras('pistaCarril'); } } },
    { name: 'Pegadas', key: true, olloOnly: 'pegadasCVistas', done: () => flag('pistaPegadasC'), r: [214, 480, 120, 50],
      look: async () => {
        await MA('Huellas en el polvo de carbón. Unas de botas, con la suela marcada de carbonilla: alguien que trabaja de pie. Muchas horas.', 'pensativo');
        await MA('Y otras... de zapatillas de andar por casa. Con cuadros, si no me engaña el polvo. ¿Quién viene a una cochera en zapatillas?', 'sorprendido');
        await MA('Alguien que sale de casa de noche sin que se note que sale.', 'pensativo');
        await pistaCocheras('pistaPegadasC');
      } },
    { name: 'Sacos de carbón', key: true, done: () => flag('pistaCarbon'), r: [700, 400, 220, 110], at: [740, 512], face: 'R',
      look: async () => {
        await MA('Sacos de carbón de piedra. Del bueno: brilla y casi no mancha.', 'pensativo');
        if (flag('carbonRoubado')) await MA('Carbón de piedra, que según Concha no compra nadie en Monforte desde hace años... Aquí acaba el carbón de Andrés. Saco a saco, y pagado.', 'convencido');
        else await MA('Carbón de piedra. Eso no se compra en el súper. Alguien lo trae de algún sitio, saco a saco.', 'dudoso');
        await pistaCocheras('pistaCarbon');
      },
      act: () => MA('No toco nada. Ya tengo bastante con que me pillen dentro; como encima me pillen con carbón en las manos, no hay excusa que valga.', 'avergonzado') },
    { name: 'Mikado', r: [330, 230, 300, 240], at: [480, 500], face: 'B',
      look: () => MA('La Mikado. Ochenta toneladas de hierro que llevaban años de adorno. Y la chimenea está tibia. Esta máquina ha tenido fuego hace menos de un día.', 'sorprendido'),
      act: () => MA('¿Subir a la cabina sin permiso? Es como entrar en casa ajena. Aunque la casa sea una Mikado. Sobre todo si es una Mikado.', 'pensativo') },
    { name: 'Bidóns', r: [640, 300, 50, 60], look: () => MA('Bidones azules de aceite. Etiquetas nuevas. Aquí alguien hace la compra con lista.', 'pensativo') },
    { name: 'Pa', r: [870, 350, 60, 160], look: () => MA('Una pala de fogonero, con el mango gastado justo donde se agarra. Esta pala ha trabajado más que yo esta semana.', 'risueno') },
    { name: 'Fiestras', r: [740, 50, 220, 200], look: () => MA('Ventanas altas, con la luz de la tarde. De noche, desde fuera, se tiene que ver si hay alguien. Por eso la gente lo sabe. Por eso Concha lo sabe.', 'pensativo') },
    { name: 'Cuberta', r: [250, 0, 460, 60], look: () => MA('Vigas de madera, como las de mi taller. Aquí también hubo correas y poleas, seguro. Todo Monforte se movía con correas.', 'pensativo') },
  ],
};
async function motorLook() {
  await showDoc('<h4>O motor da lona</h4><p>Un motor eléctrico Siemens de 10 CV, vello, desmontado polea a polea e todo moi ordenado.</p><p style="font-size:22px;text-align:center">A.F.G.</p><p class="sub">Gravado a navalla na carcasa. A mesma letra que o «X. N.» do piar do taller. Os parafusos da tapa son novos: alguén o abriu hai pouco. (O motor nas cocheras é ficción do xogo)</p>');
  await MA('A.F.G.... Alfredo Fernández Gutiérrez. El carpintero de mi casa. Rosario dijo que el taller tenía un motor Siemens de diez caballos.', 'sorprendido');
  await MA('Y las letras están grabadas a navaja con la misma letra que el pilar de mi taller. La de Xosé N.', 'pensativo');
  await MA('Cómo llegó hasta aquí el motor, ni idea. Pero el que lo grabó sabía de dónde venía. Y alguien lo ha abierto hace poco. Buscando algo.', 'dudoso');
}

/* ---------- A7 · A noite: vixilancia ---------- */
async function vixilia() {
  setFlag('a3Noite');
  await MA('Las once menos cuarto. Me agacho detrás del coche de viajeros. Si me ve alguien, estoy buscando un gato. Uno muy grande.', 'avergonzado');
  E.fadeTo = 1; await sleep(500);
  enterScene('cocherasNoite', [200, 470]);
  await sleep(300); E.fadeTo = 0;
  await MA('...', 'pensativo');
  SFX.noise(1.6, 300, 0.6, 0.12);
  await MA('Un resoplido. Dentro. Como un animal grande que respira despacio. Eso es una caldera cogiendo presión.', 'sorprendido');
  await MA('Y la persiana del taller está subida un palmo. Hay luz. Vamos allá, Martín: tú tienes licencia de maquinista. Ellos, no sé qué tienen.', 'convencido');
  toast('Novo obxectivo: entrar no taller das cocheras');
}
SCENES.cocherasNoite = {
  ...SCENES.cocheras, name: 'Museo do Ferrocarril · noite', bg: 'img/noite-cocheras.jpg', music: null,
  draw(c, t) { c.save(); c.globalAlpha = 0.18 + 0.08 * Math.sin(t * 5); c.fillStyle = '#ffb050'; c.fillRect(710, 380, 110, 18); c.restore(); },
  onEnter: null,
  hotspots: [
    { name: 'Porta do taller', key: true, done: () => false, r: [720, 288, 102, 138], at: [700, 446], face: 'R', exit: ['cocherasNoiteDentro', [480, 520]], door: true,
      look: () => MA('La persiana, subida un palmo. Luz naranja por debajo, como un horno. Y ese olor... carbón quemándose.', 'pensativo') },
    { name: 'Coche de viaxeiros', r: [0, 215, 160, 238], look: () => MA('Mi escondite. Bonito, pero cada vez que pasa un coche me late el corazón a nueve kilos de presión.', 'avergonzado') },
    { name: 'Praza da Estación', r: [300, 506, 360, 34], at: [480, 528], face: 'F',
      act: () => MA('¿Irme ahora? ¿Con una Mikado respirando ahí dentro? Ni loco. Bueno, un poco loco, pero no tanto.', 'convencido'),
      look: () => MA('Por ahí se vuelve a la plaza. Hoy, no.', 'convencido') },
    { name: 'Fiestras acesas', r: [600, 240, 60, 60], look: () => MA('Las ventanas, iluminadas. Desde la plaza se tiene que ver. Media ciudad lo sabe y nadie dice nada. Muy de Monforte.', 'pensativo') },
  ],
};

/* ---------- A8 · Interior de noite: a Mikado acesa, Remedios, Don Anxo e os xubilados ---------- */
async function noiteEntrada() {
  if (flag('a3NoiteEntrada')) return;
  setFlag('a3NoiteEntrada');
  await MA('...', 'sorprendido');
  await RE('Quen anda aí?! Isto é propiedade do museo!');
  await MA('Y yo, propiedad de Renfe. Martín Pardo, maquinista. El de la casa roja de Doctor Casares.', 'avergonzado');
  await RE('O da casa roxa...');
  await RE('Pecha esa persiana. Rápido. E non toques nada, que aquí cada parafuso ten o seu nome.');
  await MA('(Una mujer con mono azul y gafas de soldar. Un señor mayor con gorra... y zapatillas de cuadros. Y dos más junto a la máquina, de espaldas, que hacen como que no existen.)', 'pensativo');
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
  if (k === 'fogo') { await AX('Dezasete anos tiña. A pa pesaba máis ca min.'); await AX('E agora pesa outra vez. Pero esta vez non me queixo.'); }
  if (k === 'adeus') await AX('Ao deitarse. Xa o sei. Valerio escríbeo grande para que o lea sen lentes.');
}
async function anxoNota() {
  setFlag('anxoNota');
  await AX('...');
  await AX('Hai noites que mellor non lembrar.');
  await MA('(Se da la vuelta y se va hacia el hogar. Le tiemblan las manos. No de frío.)', 'preocupado');
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
    await RE('Ben. Xa que estás dentro... Chámome Remedios. Soldadora do depósito, xubilada. Aprendinlle a soldar a medio Monforte.');
    await RE('Adif lévase a Mikado nun mes. Nun góndola, ao museo doutra cidade. Para sempre.');
    await RE('E nós queremos unha última saída. Polas súas rodas. Con lume de verdade. Unha vez.');
    await MA('¿Una salida? ¿Por la vía? ¿Con esta máquina? Eso no es restaurar: eso es... precioso. Y bastante ilegal.', 'sorprendido');
    await RE('Precioso primeiro. O ilegal xa o arranxaremos.');
  }
  for (;;) {
    const opts = [
      ...(!flag('inxectorFeito') ? [{ t: '¿Qué os falta?', k: 'falta' }] : []),
      ...(!flag('reLousa') ? [{ t: 'Nueve kilos de presión. Lo pone la pizarra.', k: 'lousa' }] : []),
      ...(!flag('reMotor') ? [{ t: 'El motor de la lona es de mi casa. A.F.G.', k: 'motor' }] : []),
      ...(!flag('reCarbon') ? [{ t: 'El carbón es del Fluvial. Y alguien lo paga con billetes.', k: 'carbon' }] : []),
      ...(!flag('reAsubio') ? [{ t: '¿Quién silba de noche? Dos largos y uno corto.', k: 'asubio' }] : []),
      { t: 'Os dejo trabajar.', k: 'adeus' },
    ];
    const k = opts[await choose(opts)].k;
    if (k === 'falta') { await inxector(); if (flag('fimActo3')) return; }
    if (k === 'lousa') { setFlag('reLousa'); await RE('Le a lousa e xa se cre de casa. Iso escribino eu. Letra de soldadora: recta e sen rebabas.'); }
    if (k === 'motor') {
      setFlag('reMotor');
      await RE('Iso...');
      await RE('Iso é cousa doutro. Dese motor sabe máis outro que non está aquí esta noite. Leva meses abríndoo e pechándoo.');
      await MA('¿Buscando qué?', 'dudoso');
      await RE('Pregúntallo a el. Cando chegue o momento, xa cho dirá. Eu non lle conto as cousas a ninguén. Para iso está Concha.');
      await MA('¿Y cómo llegó aquí? Rosario dice que en el cincuenta y dos se vendió todo a un ingeniero de Caminos y a un contratista.', 'pensativo');
      await RE('Iso non o sabe ninguén, rapaz. Cando entrei eu no depósito, no setenta e cinco, xa estaba aí, nun recuncho, cunha lona enriba.');
      await MA('Pues no me lo invento. Lo que no se sabe, se queda en pregunta. Y esta se queda aquí, con el motor.', 'convencido');
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
  await RE('Fáltanos o que non se compra. A caldeira colle presión, pero o inxector non mete auga. E sen auga na caldeira, non hai saída: hai unha bomba.');
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
  await showDoc('<h4>FIN DO ACTO 3 · «A curiosidade»</h4><p>Non había pantasma. Había unha soldadora, un fogoneiro de oitenta e cinco anos en zapatillas, dous xubilados de oficinas e unha Mikado que volve respirar.</p><p>E alguén que asubía, e que esta noite non veu.</p><p>O Acto 4, «A implicación», chegará nun próximo hito.</p>');
}
SCENES.cocherasNoiteDentro = {
  ...SCENES.cocherasDentro, name: 'Cocheras do museo · noite', bg: 'img/noite-cocheras-interior.jpg',
  draw(c, t) {
    pintarLousa(c, 0.5);
    pintarMotor(c);
    // fume da chimenea e lume que latexa na fornalla
    c.save(); c.fillStyle = '#d8d8e0';
    for (let i = 0; i < 6; i++) { const k = (t * 0.25 + i / 6) % 1; c.globalAlpha = 0.35 * (1 - k); c.beginPath(); c.arc(480 + Math.sin(t * 0.8 + i) * 14 * k, 226 - k * 200, 12 + k * 40, 0, 7); c.fill(); }
    c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.25 + 0.15 * Math.sin(t * 9) * Math.sin(t * 3.1); c.fillStyle = '#ff8a30';
    c.beginPath(); c.ellipse(480, 490, 70, 22, 0, 0, 7); c.fill(); c.restore();
  },
  onEnter: () => noiteEntrada(),
  hotspots: [
    { name: 'Saír', r: [300, 512, 360, 28], at: [480, 528], face: 'F',
      act: () => MA(flag('fimActo3') ? 'Irme ahora sería como bajarse del tren en marcha. Ya habrá tiempo de dormir.' : 'Ahora no me voy. Ni aunque me echen. Bueno, si me echa Remedios, igual sí.', 'convencido') },
    { name: 'Mikado', r: [330, 230, 300, 240], at: [480, 500], face: 'B',
      look: () => MA('La Mikado, encendida. El farol, la chimenea, el resoplido... Está viva. Hace años que no veía una de vapor respirar así.', 'entusiasmado'),
      act: () => MA(flag('inxectorFeito') ? 'Ya la he tocado. Y me ha contestado.' : 'Sin permiso de Remedios, a la cabina no subo. Aquí dentro, ella es el jefe de depósito.', 'pensativo') },
    { name: 'Lousa', r: [60, 186, 138, 120], look: () => MA('«Jueves, 23:00: prueba de fuego». Y aquí estoy. Puntual, como un horario de tren.', 'risueno') },
    { name: 'Motor baixo a lona', r: [60, 336, 160, 100], look: () => MA('El motor de mi casa. A.F.G. Remedios dice que de él sabe más otro que no está aquí.', 'pensativo') },
    { name: 'Sacos de carbón', r: [700, 400, 220, 110], look: () => MA('El carbón de Andrés, haciendo por fin lo que tiene que hacer: arder en una caldera.', 'sonriente') },
  ],
  npcs: [
    { id: 'remedios', name: 'Remedios', key: true, x: 200, y: 512, w: 60, h: 300, at: [280, 514], face: 'L',
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
    { id: 'anxo', name: 'Don Anxo', key: true, x: 770, y: 514, w: 60, h: 290, at: [690, 516], face: 'R',
      draw(c, t, talking, s) { figura(c, this.x, this.y, this.h * s, LOOK_ANXO, t, talking); },
      done: () => flag('anxoPastillas'),
      look: () => MA(flag('anxoPastillas') ? 'Don Anxo, con su gorra, mirando el fuego como quien mira una tele que solo él entiende.' : 'Un señor mayor con gorra y zapatillas de cuadros. Se palpa los bolsillos una y otra vez. Busca algo que no lleva.', 'pensativo'),
      talk: () => anxoTalk(),
      give: {
        pastillas: () => darPastillas(),
        nota1958: () => flag('anxoPastillas') ? (flag('anxoNota') ? AX('...') : anxoNota()) : AX('Agora non, rapaz. Agora busco as pastillas.'),
        foto1949: async () => { await AX('...'); await AX('Era bo rapaz.'); await MA('(No dice quién. No hace falta.)', 'preocupado'); },
      } },
    { id: 'xub1', name: 'Xubilado', key: false, x: 318, y: 462, w: 40, h: 280,
      draw(c, t, talking, s) { figura(c, this.x, this.y, this.h * s, { costas: true, roupa: '#3a3a44', pelo: '#9a9a9a', pa: true }, t, talking); },
      look: () => MA('Un jubilado de oficinas, de espaldas, con una pala. Hace como que no está. Se le da fatal.', 'risueno'),
      talk: () => say('Xubilado', 'Eu non estou aquí. Eu estou na cama. Pregúntalle á miña muller.') },
    { id: 'xub2', name: 'Xubilada', key: false, x: 648, y: 462, w: 40, h: 270,
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
    { when: () => listoNoite() && !flag('a3Noite'), t: 'Esta noche, a las once, a las cocheras: esconderse detrás del coche de viajeros. Y llevar las pastillas de Don Anxo.' },
    { when: () => A3() && flag('a3Noite') && !flag('a3NoiteEntrada'), t: 'Entrar en el taller de las cocheras. La persiana está subida un palmo.' },
    { when: () => A3() && flag('a3NoiteEntrada') && !flag('anxoPastillas'), t: 'Don Anxo busca sus pastillas. Las llevo yo, de parte de Valerio.' },
    { when: () => A3() && flag('anxoPastillas'), t: 'Hablar con Remedios. ¿Qué les falta?' },
    { when: () => flag('fimActo3'), t: 'Una salida de la Mikado. Un mes. Y alguien que silba y esta noche no vino. (Acto 4, próximamente.)' },
  );
}
