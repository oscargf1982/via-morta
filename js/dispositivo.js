/* ---------- Genaro le o dispositivo do xogador (idea de Oscar, 17-11-2026) ----------
   Cuarta parede: Genaro mira con que estás xogando e que hora é, e faille broma.
   Todo se le só no navegador (navigator.userAgent, navigator.userAgentData, tamaño de pantalla, hora local)
   e NON se garda nin se envía a ningures. Se o navegador non dá un dato, Genaro dío con gracia: nunca o inventa.
   - iPhone/iPad: Safari só di «iPhone» ou «iPad», nunca o modelo.
   - Android: Chrome e Edge dan o modelo (userAgentData, getHighEntropyValues). Firefox e outros, non.
   - Ordenador: sistema e navegador si; portátil ou de mesa, non se pode saber. */

/* ---- lectura (só local) ---- */
const MARCAS_ANDROID = [
  [/^(SM-|SC-|SCV|GT-|Galaxy)/i, 'Samsung'], [/^Pixel/i, 'Google'], [/POCO/i, 'POCO'], [/Redmi/i, 'Xiaomi'],
  [/^(Mi |MI |Xiaomi|M2\d{3}|2\d{3}[0-9A-Z]{4,})/, 'Xiaomi'], [/^(CPH|PH|PE|PF)\d/, 'OPPO'], [/^RMX/, 'realme'],
  [/^(moto|XT\d)/i, 'Motorola'], [/^(ONEPLUS|OnePlus|KB\d|LE\d|IN20|NE\d|CPH2[45])/, 'OnePlus'], [/^V2\d{3}/, 'vivo'],
  [/^(HUAWEI|[A-Z]{3}-[A-Z]{1,2}\d)/, 'Huawei'], [/^(Nokia|TA-)/i, 'Nokia'], [/^(XQ-|SO-)/, 'Sony'], [/^LM-/, 'LG'],
  [/^(TCL|T\d{3}[A-Z])/, 'TCL'], [/^(ZTE|Blade)/i, 'ZTE'], [/^(SHARP|SH-)/i, 'Sharp'], [/^Lenovo/i, 'Lenovo'], [/^Nothing|^A06[35]/i, 'Nothing'],
];
function navegadorDe(ua) {
  return /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /EdgiOS|EdgA|Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera'
    : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : null;
}
async function lerDispositivo() {
  const ua = navigator.userAgent || '', d = { tipo: 'descoñecido', modelo: null, marca: null, so: null, nav: navegadorDe(ua),
    pantalla: [Math.round(screen.width || 0), Math.round(screen.height || 0)] };
  const uad = navigator.userAgentData;
  let hi = {};
  try { if (uad && uad.getHighEntropyValues) hi = await Promise.race([uad.getHighEntropyValues(['model', 'platformVersion']), sleep(800).then(() => ({}))]); } catch (e) { }
  const iPadDisfrazado = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;   // os iPad novos din que son un Mac
  if (/iPhone|iPod/.test(ua)) d.tipo = 'iphone';
  else if (/iPad/.test(ua) || iPadDisfrazado) d.tipo = 'ipad';
  else if (/Android/.test(ua) || (uad && uad.platform === 'Android')) {
    d.tipo = 'android';
    let m = (hi.model || '').trim();
    if (!m) { const x = ua.match(/Android [\d.]+; ([^;)]+?)(?: Build|\))/); if (x && !/^(K|Mobile|wv|Tablet)$/i.test(x[1].trim())) m = x[1].trim(); }   // navegadores vellos aínda o levan no userAgent
    if (m) { d.modelo = m; const f = MARCAS_ANDROID.find(([re]) => re.test(m)); d.marca = f ? f[1] : null; }
  } else if (/Windows/.test(ua) || (uad && uad.platform === 'Windows')) {
    d.tipo = 'pc'; const v = parseInt(hi.platformVersion || '0', 10);
    d.so = v >= 13 ? 'Windows 11' : v > 0 ? 'Windows 10' : 'Windows';
  } else if (/Macintosh|Mac OS X/.test(ua)) { d.tipo = 'mac'; d.so = 'macOS'; }
  else if (/CrOS/.test(ua)) { d.tipo = 'pc'; d.so = 'ChromeOS'; }
  else if (/Linux|X11/.test(ua)) { d.tipo = 'pc'; d.so = 'Linux'; }
  return d;
}
// imaxes por segundo reais neste momento (medidas durante uns 700 ms)
function medirFPS(ms = 700) {
  return new Promise(res => {
    let n = 0; const t0 = performance.now();
    const f = () => { n++; const dt = performance.now() - t0; if (dt < ms) requestAnimationFrame(f); else res(Math.round(n * 1000 / dt)); };
    requestAnimationFrame(f);
    setTimeout(() => res(Math.round(n * 1000 / Math.max(1, performance.now() - t0))), ms + 600);   // por se a lapela está en segundo plano
  });
}

/* ---- frases ---- */
const unha = a => a[Math.floor(Math.random() * a.length)];
const DIAS_GL = ['domingo', 'luns', 'martes', 'mércores', 'xoves', 'venres', 'sábado'];
const MESES_GL = ['xaneiro', 'febreiro', 'marzo', 'abril', 'maio', 'xuño', 'xullo', 'agosto', 'setembro', 'outubro', 'novembro', 'decembro'];
const horaGL = h => { const k = h % 12 || 12; return k === 1 ? 'a unha' : `as ${k}`; };

function frasesDispositivo(d, fps) {
  const L = [], lento = fps && fps < 40;
  if (d.tipo === 'iphone') {
    L.push([unha(['Un iPhone. Claro. Pagaches a mazá máis cara de toda Galicia.', 'Un iPhone! Xa sabía eu que tiñas cara de pagar a marca.']), 'esceptico']);
    L.push(['Co que che custou iso, cun Pocophone tiñas o mesmo xogo, a mesma rúa e o mesmo panadeiro. E sobrábache para bollas un ano enteiro.', 'explicando']);
    L.push(['O modelo non mo deixa ver. Apple gárdao coma se fose a receita da broa.', 'rascandose']);
  } else if (d.tipo === 'ipad') {
    L.push(['Un iPad. Unha pantalla enorme para ver de preto a fariña do meu mandil. Gracias, supoño.', 'dudoso']);
    L.push(['Pagaches a mazá enteira, con pel e todo. Cunha tableta POCO verías esta rúa igual de ben e sobrábache para empanada.', 'explicando']);
    L.push(['Que modelo é? Non mo di. Os da mazá son moi calados.', 'rascandose']);
  } else if (d.tipo === 'android') {
    if (d.modelo && d.marca) L.push([`Un ${d.marca}! O ${d.modelo}, nada menos.${/\d{3,}|-/.test(d.modelo) ? ' Que nome tan bonito: parece unha matrícula.' : ''}`, 'celebrando']);
    else if (d.modelo) L.push([`Un Android, modelo «${d.modelo}». A marca non a coñezo, e mira que coñezo marcas de fariña.`, 'pensativo']);
    else L.push(['Un Android. A marca e o modelo, o teu navegador non mos deixa ver. Que misterio! Seguro que é dos bos e dáche vergonza.', 'rascandose']);
    if (d.marca === 'POCO') L.push(['Un POCO! Ti si que sabes o que é calidade-prezo. Ti e mais eu imos entendernos.', 'guino']);
    L.push([lento ? `E xa vexo que vai a tirones: ${fps} imaxes por segundo. Eu amaso máis rápido. Por Nadal, pide un iPhone.` : 'Polo de agora vai fino. Pero se algún día o xogo che dá tirones, xa sabes que pedir por Nadal: un iPhone. E logo vés e rímonos xuntos da factura.', lento ? 'resignado' : 'explicando']);
  } else if (d.tipo === 'pc' || d.tipo === 'mac') {
    const nav = d.nav ? `, co ${d.nav}` : '', px = d.pantalla[0] ? ` e unha pantalla de ${d.pantalla[0]} por ${d.pantalla[1]}` : '';
    if (d.tipo === 'mac') L.push([`Un Mac${nav}${px}. Outro da mazá. Co que pagaches, tiñas un PC con luciñas de cores e aínda che sobraba para empanadas.`, 'esceptico']);
    else if (d.so === 'Linux') L.push([`Linux${nav}${px}. Ti es dos que platinan ata o sistema operativo. Respeto.`, 'celebrando']);
    else L.push([`Un ordenador con ${d.so || 'sabe Deus que sistema'}${nav}${px}. Ti xogas en serio, eh?`, 'hablando']);
    L.push(['Se é portátil ou de mesa non mo di. Pero se o xogo che vai lento, non é culpa miña: pídelles un equipo novo aos Reis. Eu pedín un forno novo hai dez anos e aínda espero.', lento ? 'resignado' : 'explicando']);
    if (lento) L.push([`E vai lento, si: ${fps} imaxes por segundo. Ese equipo xa tiña idade cando a Mikado se retirou.`, 'riendo']);
  } else {
    L.push(['E isto con que é? Non o sei. O teu aparello é máis discreto ca un cura de aldea. Que misterio!', 'rascandose']);
  }
  return L;
}

function frasesHora(now = new Date()) {
  const h = now.getHours(), min = now.getMinutes(), dia = now.getDay(), fin = dia === 0 || dia === 6;
  const hh = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  const L = [[`E logo, hoxe é ${DIAS_GL[dia]}, ${now.getDate()} de ${MESES_GL[now.getMonth()]}, e son ${horaGL(h)} e ${min} (${hh}, para os do reloxo dixital).`.replace(' e 0 (', ' en punto ('), 'explicando']];
  if (h < 6) L.push([unha([
    `${hh} da madrugada e ti aquí! Eu érguome ás catro porque o pan non se fai só. E ti, por que? Vai durmir, que a Mikado mañá segue no mesmo sitio.`,
    `A estas horas só estamos despertos o forno, os gatos, eu... e ti. E eu teño escusa. Á cama, rapaz!`,
  ]), 'gritando-enfadado']);
  else if (h < 9) L.push([unha([
    'Tan cedo e xa xogando! Ti es dos meus, madrugador. Pero almorza algo antes, que xogar co estómago baleiro dá pistas falsas.',
    'A estas horas eu xa levo tres fornadas. Ti levas... unha partida. Algo é algo.',
  ]), 'sonriente']);
  else if (h < 14) L.push([fin ? `${DIAS_GL[dia][0].toUpperCase() + DIAS_GL[dia].slice(1)} pola mañá e xogando a aventuras gráficas. Iso é saber vivir.` : `Un ${DIAS_GL[dia]} pola mañá... ti non deberías estar no traballo? Ou no cole? Eu non digo nada. Pero o xefe ten un primo en Monforte.`, fin ? 'contento' : 'esceptico']);
  else if (h < 16) L.push(['Hora de xantar. Se tes o caldo no prato e o xogo na man, o caldo arrefría. E un caldo frío non o arranxa nin Valerio.', 'dudoso']);
  else if (h < 21) L.push([unha([
    'Boa hora para xogar, si señor. A esta hora eu xa vendín todo e só me quedan as migas.',
    'Media tarde: a hora dos pasteis de Valerio. E das aventuras gráficas. Coincidencia? Non o creo.',
  ]), 'hablando']);
  else if (dia === 5 || dia === 6) L.push([`É ${DIAS_GL[dia]} de noite e estás xogando a isto en vez de saír de festa. Xa o sabía: ti es dos meus.`, 'guino']);
  else L.push([`Xa é de noite e mañá é ${DIAS_GL[(dia + 1) % 7]}. Unha pantalla máis e á cama, eh? Que despois non hai quen te erga.`, 'preocupado']);
  return L;
}

/* ---- a conversa ---- */
async function genaroDispositivo() {
  const G = SCENES.panaderia.npcs.find(n => n.id === 'genaro'), idle = G.idle, tf = G.talkFrames, fl = G.flip;
  const pFps = medirFPS(), pDisp = lerDispositivo();
  G.idle = 6; G.talkFrames = [6, 7]; G.flip = false; SFX.music(null); E.cuartaT0 = E.t;
  try {
    await GE4(flag('genaroDispositivo') ? 'Ti outra vez. A ver, deixa que te mire ben...' : 'Cos gatos non. Contigo. Agarda, que te vexo mellor... A ver con que me estás mirando ti a min.', 'apelando');
    const [fps, d] = await Promise.all([pFps, pDisp]);
    for (const [t, m] of frasesDispositivo(d, fps)) await GE4(t, m);
    for (const [t, m] of frasesHora()) await GE4(t, m);
    if (!flag('genaroDispositivo')) await GE4('E tranquilo, que non o apunto en ningures. O que vexo queda entre nós e o forno.', 'guino');
  } finally { G.idle = idle; G.talkFrames = tf; G.flip = fl; E.cuartaT0 = null; SFX.music(E.scene.music); }
  setFlag('genaroDispositivo');
  await MA('¿Genaro? ¿Hola? Te has quedado mirando a la nada.', 'dudoso');
  await GE(unha(['Facía inventario. De xente.', 'Saudaba a un cliente. Dos de lonxe.', 'Nada, nada. Cousas de panadeiros.']), 'rascandose');
}
