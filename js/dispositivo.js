/* ---------- Genaro le o dispositivo do xogador (idea de Oscar, 17-11-2026) ----------
   Cuarta parede: Genaro mira con que estás xogando e que hora é, e faille broma.
   Todo se le só no navegador (navigator.userAgent, navigator.userAgentData, tamaño de pantalla, hora local)
   e NON se garda nin se envía a ningures. Se o navegador non dá un dato, Genaro dío con gracia: nunca o inventa.
   - iPhone/iPad: Safari só di «iPhone» ou «iPad», nunca o modelo.
   - Android: Chrome e Edge dan o modelo (userAgentData, getHighEntropyValues). Firefox e outros, non.
   - Ordenador: sistema e navegador si; portátil ou de mesa, non se pode saber.
   Ampliación (Oscar, 17-11-2026): batería (só Chrome, Edge e Opera a dan), núcleos do procesador, rato ou dedo
   e ubicación. A ubicación pídese ao premer «Toca para comezar» (aviso do navegador); o lugar sácase dunha táboa
   propia de cidades (sen servizos de fóra). Se non se dá ou non chega, Genaro tira de fuso horario e idioma, e non insiste. */

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

/* ---- ubicación: pídese unha vez ao comezar, só se garda en memoria mentres o xogo está aberto ---- */
const UBIC = { estado: 'sen-pedir' };   // sen-pedir | agardando | ok | negada | non-dispoñible
function pedirUbicacion() {
  if (UBIC.estado !== 'sen-pedir') return;
  const pol = document.featurePolicy || document.permissionsPolicy;
  if (!navigator.geolocation || !window.isSecureContext || (pol && pol.allowsFeature && !pol.allowsFeature('geolocation'))) { UBIC.estado = 'non-dispoñible'; return; }
  UBIC.estado = 'agardando';
  try {
    navigator.geolocation.getCurrentPosition(
      p => { UBIC.estado = 'ok'; UBIC.lat = p.coords.latitude; UBIC.lon = p.coords.longitude; },
      e => { UBIC.estado = e && e.code === 1 ? 'negada' : 'non-dispoñible'; },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 3600000 });
  } catch (e) { UBIC.estado = 'non-dispoñible'; }
}
{ const b = document.getElementById('btnStart'); if (b) b.addEventListener('click', pedirUbicacion); }
// táboa propia de lugares (lat, lon): sen servizos de fóra. Gaña o máis próximo se está a menos de 30 km.
const LUGARES = [
  ['Monforte de Lemos', 42.5216, -7.5143], ['Lugo', 43.0097, -7.5560], ['Ourense', 42.3360, -7.8640], ['Santiago de Compostela', 42.8782, -8.5448],
  ['A Coruña', 43.3623, -8.4115], ['Vigo', 42.2406, -8.7207], ['Pontevedra', 42.4310, -8.6444], ['Ferrol', 43.4832, -8.2369],
  ['Chantada', 42.6086, -7.7712], ['Sarria', 42.7810, -7.4142], ['Quiroga', 42.4760, -7.2700], ['O Barco de Valdeorras', 42.4155, -6.9830],
  ['Viveiro', 43.6620, -7.5946], ['Vilalba', 43.2970, -7.6800], ['Ribadeo', 43.5360, -7.0405], ['Verín', 41.9410, -7.4360],
  ['Carballiño', 42.4320, -8.0780], ['Lalín', 42.6610, -8.1130], ['Vilagarcía de Arousa', 42.5960, -8.7660], ['Ponferrada', 42.5460, -6.5900],
  ['Madrid', 40.4168, -3.7038], ['Barcelona', 41.3874, 2.1686], ['Valencia', 39.4699, -0.3763], ['Sevilla', 37.3891, -5.9845],
  ['Bilbao', 43.2630, -2.9350], ['Oviedo', 43.3614, -5.8494], ['Gijón', 43.5322, -5.6611], ['León', 42.5987, -5.5671],
  ['Valladolid', 41.6523, -4.7245], ['Salamanca', 40.9701, -5.6635], ['Zamora', 41.5035, -5.7446], ['Santander', 43.4623, -3.8099],
  ['Zaragoza', 41.6488, -0.8891], ['Málaga', 36.7213, -4.4214], ['Granada', 37.1773, -3.5986], ['Córdoba', 37.8882, -4.7794],
  ['Murcia', 37.9922, -1.1307], ['Alacant', 38.3452, -0.4810], ['Palma', 39.5696, 2.6502], ['Las Palmas de Gran Canaria', 28.1235, -15.4363],
  ['Santa Cruz de Tenerife', 28.4636, -16.2518], ['Pamplona', 42.8125, -1.6458], ['Logroño', 42.4627, -2.4450], ['Burgos', 42.3439, -3.6969],
  ['Cáceres', 39.4753, -6.3724], ['Badajoz', 38.8794, -6.9707], ['Toledo', 39.8628, -4.0273], ['Porto', 41.1579, -8.6291],
  ['Lisboa', 38.7223, -9.1393], ['París', 48.8566, 2.3522], ['Londres', 51.5074, -0.1278], ['Buenos Aires', -34.6037, -58.3816],
];
const MONFORTE = [42.5216, -7.5143];
function kmEntre(a, b, c, d) {
  const r = x => x * Math.PI / 180, dLa = r(c - a), dLo = r(d - b);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(dLo / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}
function lugarDe(lat, lon) {
  let best = null;
  for (const [n, a, b] of LUGARES) { const k = kmEntre(lat, lon, a, b); if (!best || k < best.km) best = { n, km: k }; }
  return best && best.km < 30 ? best : null;
}
// bateria: Chrome, Edge e Opera; Safari e Firefox non a dan
async function lerBateria() {
  try { if (!navigator.getBattery) return null; const b = await Promise.race([navigator.getBattery(), sleep(800).then(() => null)]); return b ? { pct: Math.round(b.level * 100), cargando: !!b.charging } : null; }
  catch (e) { return null; }
}
function lerPunteiro() {
  const mm = q => { try { return matchMedia(q).matches; } catch (e) { return false; } };
  const rato = mm('(any-pointer: fine)') && mm('(any-hover: hover)'), tactil = navigator.maxTouchPoints > 0 || mm('(any-pointer: coarse)');
  return rato && tactil ? 'os-dous' : rato ? 'rato' : tactil ? 'dedo' : null;
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

function frasesHardware(nucleos, punteiro, bat, movil) {
  const L = [];
  const pn = punteiro === 'rato' ? 'E xogas co rato, coma os de antes. Clic dereito para mirar, que xa o sabes.'
    : punteiro === 'dedo' ? 'E co dedo. Ese dedo vai facer máis quilómetros ca Martín nesta rúa.'
    : punteiro === 'os-dous' ? 'Rato e pantalla táctil á vez. Ti non te decides, eh? Coma min entre a bolla e a empanada.' : '';
  if (nucleos) {
    const nn = nucleos >= 12 ? `${nucleos} núcleos! Con iso podías cocer pan, e de paso facer a declaración da renda.`
      : nucleos >= 6 ? `${nucleos} núcleos no procesador. Eu teño dous brazos e amaso o mesmo.`
      : `${nucleos} núcleos, coma os fornos de leña: poucos pero honrados.`;
    L.push([`${nn} ${pn}`.trim(), nucleos >= 12 ? 'celebrando' : 'explicando']);
  } else if (pn) L.push([pn, 'explicando']);
  if (bat) {
    if (bat.cargando) L.push([`Batería ao ${bat.pct}% e enchufado. Xogas atado á parede, coma a Mikado ás vías.`, 'riendo']);
    else if (bat.pct <= 20) L.push([`Ollo: queda o ${bat.pct}% de batería e non está cargando. Busca un enchufe antes de que Martín quede ás escuras no medio dun puzzle.`, 'preocupado']);
    else if (bat.pct >= 90) L.push([`Batería ao ${bat.pct}%. Cargadiño coma un forno ás catro da mañá.`, 'contento']);
    else L.push([`Batería ao ${bat.pct}%. Chega para un par de puzzles. Para platinar, xa non sei.`, 'pensativo']);
  } else if (movil) L.push(['A batería non ma deixa ver o teu navegador. Seica é cousa privada. Coma a receita da miña broa.', 'rascandose']);
  return L;
}
function frasesUbicacion() {
  const L = [];
  if (UBIC.estado === 'ok') {
    const km = Math.round(kmEntre(UBIC.lat, UBIC.lon, MONFORTE[0], MONFORTE[1])), lug = lugarDe(UBIC.lat, UBIC.lon);
    if (km <= 5) {
      L.push(['E estás... en Monforte! Coma min! Ben, coma min non, que eu son de debuxo.', 'celebrando']);
      L.push(['Se baixas á rúa Calvo Sotelo, a miña panadería non a vas atopar: é invento. Pero o pan de Monforte é de verdade. Vai mercar unha bolla, anda.', 'guino']);
    } else {
      const onde = lug ? (lug.km < 8 ? `en ${lug.n}` : `preto de ${lug.n}`) : 'nun sitio que non teño no mapa';
      L.push([`E estás ${onde}, a ${km.toLocaleString('es-ES')} quilómetros de Monforte.${lug ? '' : ' Seica o mundo é máis grande que a miña rúa.'}`, 'explicando']);
      L.push([km < 120 ? 'Iso está aquí ao lado. Colle o tren, que aínda pasa, e vés a por unha bolla.'
        : km < 1200 ? 'Lonxe, pero nada que non arranxe un tren. Iso si: chegas e a bolla xa está fría.'
        : 'Do outro lado do mundo, case! E aínda así xogando nunha rúa de Monforte. Iso é morriña, rapaz.', 'sonriente']);
    }
    return L;
  }
  if (UBIC.estado === 'negada') L.push(['Onde estás, non mo deixaches ver. Fas ben: nunca lle digas a un panadeiro onde vives, que che leva bolla todos os días e despois cóbracha.', 'guino']);
  else L.push([unha(['Onde estás non o sei: o teu navegador non mo conta. Pero teño olfato...', 'Onde estás non mo di o aparello. Pero eu, de panadeiro, adiviño moito.']), 'pensativo']);
  let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { }
  const lang = (navigator.language || '').toLowerCase();
  const idioma = lang.startsWith('gl') ? ' E tes o aparello en galego! Así me gusta.' : lang.startsWith('es') ? ' E tes o aparello en castelán. Nada, nada, aquí falamos todos.' : lang.startsWith('pt') ? ' E en portugués! Case veciños.' : lang ? ' E tes o aparello nun idioma de fóra. Benvido a Monforte, de onde queira que sexas.' : '';
  const zona = tz === 'Atlantic/Canary' ? 'Pola hora, estás en Canarias: unha hora menos e moito máis sol.'
    : tz === 'Europe/Madrid' || tz === 'Africa/Ceuta' ? 'Pola hora, estás na España peninsular. Iso xa o adiviñaba calquera.'
    : tz === 'Europe/Lisbon' ? 'Pola hora, estás en Portugal. Ou en Galicia con reloxo portugués, que tamén pode ser.'
    : /^America\//.test(tz) ? 'Pola hora, estás en América! A estas alturas, medio Monforte ten un curmán aí.'
    : tz ? 'Pola hora, estás lonxe de aquí. Moi lonxe.' : 'E pola hora tampouco sei. Misterio total.';
  L.push([zona + idioma, 'explicando']);
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
  const pFps = medirFPS(), pDisp = lerDispositivo(), pBat = lerBateria();
  G.idle = 6; G.talkFrames = [6, 7]; G.flip = false; SFX.music(null); E.cuartaT0 = E.t;
  try {
    await GE4(flag('genaroDispositivo') ? 'Ti outra vez. A ver, deixa que te mire ben...' : 'Cos gatos non. Contigo. Agarda, que te vexo mellor... A ver con que me estás mirando ti a min.', 'apelando');
    const [fps, d] = await Promise.all([pFps, pDisp]);
    for (const [t, m] of frasesDispositivo(d, fps)) await GE4(t, m);
    for (const [t, m] of frasesHardware(navigator.hardwareConcurrency || 0, lerPunteiro(), await pBat, d.tipo === 'iphone' || d.tipo === 'android' || d.tipo === 'ipad')) await GE4(t, m);
    for (const [t, m] of frasesUbicacion()) await GE4(t, m);
    for (const [t, m] of frasesHora()) await GE4(t, m);
    if (!flag('genaroDispositivo')) await GE4('E tranquilo, que non o apunto en ningures. O que vexo queda entre nós e o forno.', 'guino');
  } finally { G.idle = idle; G.talkFrames = tf; G.flip = fl; E.cuartaT0 = null; SFX.music(E.scene.music); }
  setFlag('genaroDispositivo');
  await MA('¿Genaro? ¿Hola? Te has quedado mirando a la nada.', 'dudoso');
  await GE(unha(['Facía inventario. De xente.', 'Saudaba a un cliente. Dos de lonxe.', 'Nada, nada. Cousas de panadeiros.']), 'rascandose');
}
