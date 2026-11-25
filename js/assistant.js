/* Asistente virtual de FindGo: responde dudas frecuentes con los datos de la tienda.
   Funciona sin servidor: reconoce la intención de la pregunta por palabras clave. */
(function () {
  var FG = window.FG; if (!FG) return;
  var esc = FG.esc, eur = FG.eur;

  function norm(t) { return (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ%\s]/g, " ").replace(/\s+/g, " ").trim(); }
  function link(href, txt) { return '<a href="' + href + '">' + txt + '</a>'; }
  function plink(id, txt) { var p = FG.product(id); return p ? link(p.href || "producto.html?id=" + id, txt || esc(p.name)) : esc(txt || id); }
  function price(id) { var p = FG.product(id); return p ? eur(p.price) : ""; }

  /* Productos que se pueden nombrar en una pregunta */
  var PROD_WORDS = [
    ["cabin", ["cabin", "cabina 55"]], ["medium", ["medium", "mediana", "65 cm"]], ["large", ["large", "grande", "75 cm"]], ["lite", ["lite", "ligera", "barata"]],
    ["pack-familia", ["pack familia"]], ["pack-viaje", ["pack viaje"]], ["mochila-day", ["mochila"]], ["weekender", ["weekender", "bolsa"]], ["maletin", ["maletin", "negocios"]], ["kids", ["kids", "infantil", "ninos", "nino"]],
    ["bateria", ["bateria extra", "power bank"]], ["tag", ["tag localizador", "tag"]], ["candado", ["candado", "tsa"]], ["garantia", ["garantia ampliada"]], ["premium", ["premium", "suscripcion"]]
  ];
  function findProduct(q) {
    for (var i = 0; i < PROD_WORDS.length; i++) for (var j = 0; j < PROD_WORDS[i][1].length; j++) if ((" " + q + " ").indexOf(" " + PROD_WORDS[i][1][j]) > -1) return PROD_WORDS[i][0];
    return null;
  }
  function findZone(q) {
    var Z = { canarias: "IC", tenerife: "IC", "gran canaria": "IC", lanzarote: "IC", ceuta: "CE", melilla: "ML", portugal: "PT", francia: "FR", italia: "IT", alemania: "DE", "paises bajos": "NL", holanda: "NL", belgica: "BE", "reino unido": "GB", inglaterra: "GB", londres: "GB", baleares: "ES", mallorca: "ES", ibiza: "ES" };
    for (var k in Z) if (q.indexOf(k) > -1) return Z[k];
    return null;
  }
  function days(q) {
    var m = q.match(/(\d+)\s*(dia|dias|noche|noches)/); if (m) return +m[1];
    if (/semanas|mes|meses/.test(q)) return 15; if (/semana/.test(q)) return 7; if (/finde|fin de semana/.test(q)) return 2;
    return null;
  }

  /* Intenciones: palabras clave y respuesta */
  var I = [
    { id: "hola", k: ["hola", "livi", "quien eres", "como te llamas", "buenas", "buenos dias", "buenas tardes", "hey", "saludos"], a: function () { return "¡Hola! 😊 Pregúntame lo que quieras sobre las maletas FindGo: cómo funcionan, qué tamaño te conviene, envíos, devoluciones, pagos…"; } },
    { id: "gracias", k: ["gracias", "genial", "perfecto", "adios", "hasta luego"], a: function () { return "¡A ti! Si te surge otra duda, aquí estaré. ¡Buen viaje! ✈️"; } },
    { id: "tamano", k: ["tamano", "talla", "que maleta", "cual me", "recomiend", "dias", "semana", "viaje de", "familia", "hijos", "capacidad", "litros"], a: function (q) {
      var d = days(q), fam = /familia|hijos|ninos|varios|pareja/.test(q);
      if (fam || (d && d > 7)) return "Para " + (fam ? "viajar en familia" : "más de una semana") + " te recomiendo la " + plink("large", "FindGo Large 75 cm") + " (92 L, " + price("large") + "). Si viajáis varios, el " + plink("pack-familia", "Pack Familia") + " trae las tres tallas por " + price("pack-familia") + " y ahorras 148 €.";
      if (d && d > 3) return "Para " + d + " días, la " + plink("medium", "FindGo Medium 65 cm") + " es ideal: 65 L por " + price("medium") + ". Tiene Follow Me, localización y batería extraíble.";
      if (d) return "Para " + d + (d === 1 ? " día" : " días") + " te basta con la " + plink("cabin", "FindGo Cabin 55 cm") + " (38 L, " + price("cabin") + "), que además cabe en cabina en casi todas las aerolíneas.";
      return "Depende de cuánto viajes:<br>• 1 a 3 días → " + plink("cabin", "Cabin 55 cm") + " (" + price("cabin") + ")<br>• 4 a 7 días → " + plink("medium", "Medium 65 cm") + " (" + price("medium") + ")<br>• Más de una semana o en familia → " + plink("large", "Large 75 cm") + " (" + price("large") + ")<br>¿Cuántos días sueles viajar?";
    } },
    { id: "follow", k: ["follow", "sigue", "seguir", "siguiendo", "persigue", "manos libres", "camina", "obstaculo", "sensor", "camara"], a: function () {
      return "<strong>Follow Me</strong> hace que la maleta te siga a tu ritmo por el aeropuerto, a unos 1,5 m. Se empareja con tu móvil, esquiva obstáculos y frena cuando te paras. La llevan la Cabin, la Medium y la Large (la " + plink("lite", "Lite") + " no). Si se agota la batería, las ruedas giran libres y la llevas como una maleta normal.";
    } },
    { id: "autonomia", k: ["dura", "autonomia", "horas", "carga", "cargar", "recargar"], a: function () { return FG.FAQ[1][1] + " Si quieres más margen, tienes la " + plink("bateria", "batería extra") + " por " + price("bateria") + "."; } },
    { id: "facturar", k: ["factur", "avion", "aerolinea", "iata", "bodega", "98 wh", "wh", "litio", "bateria", "seguridad del aeropuerto"], a: function () { return FG.FAQ[0][1] + " Más detalle en " + link("index.html#baterias", "Dos baterías para facturar sin problemas") + "."; } },
    { id: "cabina", k: ["cabina", "cabe", "medidas", "dimensiones", "equipaje de mano", "ryanair", "vueling", "iberia"], a: function () { var c = FG.product("cabin"); return FG.FAQ[3][1] + " La Cabin mide " + (c.dims || "55 × 40 × 23 cm") + " y pesa " + c.weight + "."; } },
    { id: "localiza", k: ["localiz", "gps", "donde esta", "mapa", "perdid", "pierde", "perder", "rastre", "airtag", "ubicacion", "encontrar"], a: function () {
      return "Ves tu maleta en el mapa desde la app, incluso facturada: el módulo localizador lleva su propia pila y sigue activo en bodega durante meses. Con " + plink("premium", "FindGo Premium") + " (" + price("premium") + "/mes) tienes historial y alertas. Solo tú ves la ubicación.";
    } },
    { id: "envio", k: ["envio", "envios", "enviar", "entrega", "llega", "tarda", "plazo", "gastos", "express", "urgente", "domicilio", "mandais"], a: function (q) {
      var z = findZone(q), c = FG.country(z || "ES");
      return "Envío a <strong>" + esc(c.n) + "</strong>: estándar " + eur(c.std) + " (gratis desde " + eur(c.free) + "), llega en " + c.days[0] + " a " + c.days[1] + " días laborables. Express " + eur(c.exp) + "." + (z ? "" : " Si me dices a qué país o zona lo envías (Canarias, Portugal…), te digo su precio.");
    } },
    { id: "impuestos", k: ["iva", "igic", "ipsi", "impuesto", "impuestos", "aduana", "canarias", "ceuta", "melilla"], a: function (q) {
      var z = findZone(q);
      if (z && FG.country(z).tax) { var c = FG.country(z); return "En " + esc(c.n.replace("España (", "").replace(")", "")) + " no se paga IVA: se aplica el " + c.tax + " (" + c.vat + " %). Al pagar te quitamos el IVA del precio y aplicamos el " + c.tax + ", así que el total sale más barato. Nos encargamos de la aduana."; }
      return "Los precios llevan el IVA español (21 %) incluido. Al pagar se aplica el impuesto del lugar de entrega: IGIC del 7 % en Canarias, IPSI en Ceuta y Melilla, y el IVA de cada país en el resto de Europa. En el resumen verás la base imponible y el impuesto desglosados.";
    } },
    { id: "devolucion", k: ["devol", "devuelvo", "reembolso", "cambio", "cambiar", "desistimiento", "no me gusta"], a: function () { return FG.FAQ[4][1] + " Puedes pedirla desde " + link("devoluciones.html", "Devoluciones") + "."; } },
    { id: "garantia", k: ["garantia", "roto", "rota", "rompe", "rompio", "rompi", "averia", "estropea", "repar", "defecto", "golpe"], a: function () { return "Todas las maletas tienen <strong>3 años de garantía</strong>. Con la " + plink("garantia", "garantía ampliada") + " (" + price("garantia") + ") sumas 2 años más y cubres golpes accidentales. Si algo se rompe, tienes la " + plink("reparacion", "reparación exprés") + "."; } },
    { id: "pago", k: ["pagar", "pago", "tarjeta", "bizum", "paypal", "apple pay", "google pay", "transferencia", "plazos", "metodo"], a: function () { return "Puedes pagar con: " + FG.PAYMENTS.map(function (p) { return p[1]; }).join(", ") + ". Todo se elige en el último paso del pedido."; } },
    { id: "descuento", k: ["descuento", "cupon", "codigo", "oferta", "rebaja", "club", "promo", "ahorrar"], a: function () { return "Únete al " + link("index.html#club", "club FindGo") + " y te damos el código <strong>CLUB10</strong>: un 10 % de descuento en tu primera compra. Los packs ya vienen con descuento (hasta 148 € menos)."; } },
    { id: "personaliza", k: ["personaliz", "iniciales", "grabad", "nombre", "color", "colores", "funda", "diseno", "asas"], a: function () {
      return "Puedes hacerla tuya con " + plink("p-iniciales", "iniciales grabadas") + " (" + price("p-iniciales") + ", 5 tipos de letra), " + plink("p-asas", "asas y ruedas de color") + " (" + price("p-asas") + ") o una " + plink("p-funda-diseno", "funda con tu diseño") + " (" + price("p-funda-diseno") + "). Hay 7 colores: " + ["grafito", "arena", "azul", "salvia", "hielo", "coral", "negro"].map(FG.colorName).join(", ") + ". Ojo: lo personalizado no se puede devolver salvo defecto.";
    } },
    { id: "packs", k: ["pack", "packs", "conjunto", "juego de maletas", "las tres", "dos maletas"], a: function () { return "Tenemos dos packs con el mismo color:<br>• " + plink("pack-viaje", "Pack Viaje") + " (Cabin + Medium): " + price("pack-viaje") + ", ahorras 49 €.<br>• " + plink("pack-familia", "Pack Familia") + " (las tres tallas): " + price("pack-familia") + ", ahorras 148 €."; } },
    { id: "precio", k: ["precio", "precios", "cuesta", "cuanto", "vale", "valen", "barato", "caro", "economica"], a: function () { return "Nuestras maletas:<br>• " + ["lite", "cabin", "medium", "large"].map(function (id) { return plink(id) + ": " + price(id); }).join("<br>• ") + "<br>La Lite es la más económica, pero solo lleva localizador (sin Follow Me)."; } },
    { id: "diferencia", k: ["diferencia", "competencia", "mejor que", "por que", "ventaja", "samsonite", "otras marcas", "comparar"], a: function () { return "Frente a una maleta normal + un AirTag, FindGo lleva el localizador integrado y siempre activo en bodega, te sigue sola con Follow Me y su batería se saca para poder facturarla. Mira la " + link("index.html#diferencia", "comparativa con la competencia") + "."; } },
    { id: "privacidad", k: ["privacidad", "privada", "mis datos", "rgpd", "espiar", "quien ve"], a: function () { return FG.FAQ[5][1] + " " + link("privacidad.html", "Ver política de privacidad") + "."; } },
    { id: "cuenta", k: ["cuenta", "registr", "sesion", "login", "contrasena", "mis pedidos", "pedido"], a: function () { return "Desde " + link("cuenta.html", "Mi cuenta") + " ves tus pedidos, favoritos y datos guardados. Para registrarte solo necesitas nombre y correo, sin contraseña."; } },
    { id: "empresas", k: ["empresa", "empresas", "b2b", "flota", "factura", "corporativo"], a: function () { return "Tenemos condiciones para empresas: pide presupuesto en " + link("empresas.html", "FindGo para empresas") + "."; } },
    { id: "humano", k: ["persona", "humano", "agente", "contacto", "contactar", "hablar con", "telefono", "llamar", "email", "correo"], a: function () { return "Soy Livi, una asistente automática, pero si necesitas a alguien del equipo puedes escribirnos desde " + link("empresas.html", "el formulario de contacto") + ". También te pueden ayudar las " + link("index.html#faq", "preguntas frecuentes") + "."; } }
  ];

  function answer(text) {
    var q = norm(text); if (!q) return null;
    /* Si habla de enviar o de una zona de entrega, gana la respuesta de envíos (salvo que pregunte por impuestos) */
    var ship = /\benvi(o|os|ar|ais|amos|an)\b/.test(q), zone = findZone(q), tax = /\b(iva|igic|ipsi|impuesto|impuestos|aduana)\b/.test(q);
    if (ship || (zone && !tax)) { var si = I.filter(function (x) { return x.id === "envio"; })[0]; if (si) return si.a(q); }
    var best = null, bestScore = 0;
    I.forEach(function (it) {
      var sc = 0; it.k.forEach(function (k) { if ((" " + q + " ").indexOf(" " + k) > -1) sc += k.length > 4 ? 2 : 1; });
      if (sc > bestScore) { best = it; bestScore = sc; }
    });
    var pid = findProduct(q);
    if (pid && (!best || best.id === "precio" || best.id === "hola" || bestScore < 2)) {
      var p = FG.product(pid);
      return "<strong>" + plink(pid) + "</strong>: " + eur(p.price) + (p.monthly ? "/mes" : "") + ". " + esc(p.short || p.desc || "") + (p.followMe != null ? (p.followMe ? " Lleva Follow Me." : " No lleva Follow Me.") : "");
    }
    if (best) return best.a(q);
    /* Último intento: la pregunta frecuente que más palabras comparte */
    var words = q.split(" ").filter(function (w) { return w.length > 3; }), fq = null, fs = 0;
    FG.FAQ.forEach(function (f) { var n = norm(f[0] + " " + f[1]), s = words.filter(function (w) { return n.indexOf(w) > -1; }).length; if (s > fs) { fs = s; fq = f; } });
    if (fq && fs >= 2) return "<strong>" + esc(fq[0]) + "</strong><br>" + esc(fq[1]);
    return null;
  }
  var FALLBACK = "Uy, esa no la sé responder 🙈. Prueba a preguntarme por tamaños, Follow Me, localización, baterías, envíos, impuestos, devoluciones, pagos o personalización. También tienes las " + '<a href="index.html#faq">preguntas frecuentes</a>.';
  var CHIPS = ["¿Qué tamaño necesito?", "¿Puedo facturarla con la batería?", "¿Cómo funciona Follow Me?", "Envíos a Canarias", "¿Cómo devuelvo un pedido?", "¿Tenéis descuentos?"];

  /* ---------- Interfaz ---------- */
  var wrap = document.createElement("div");
  wrap.className = "bot";
  wrap.innerHTML =
    '<button class="bot-fab" id="bot-fab" aria-label="Pregunta a Livi" aria-expanded="false" aria-controls="bot-panel"><span class="bot-fab-ic" aria-hidden="true">' + FG.icon("chat") + '</span><span class="bot-fab-t">Pregunta a Livi</span></button>' +
    '<section class="bot-panel" id="bot-panel" role="dialog" aria-label="Livi, asistente de FindGo" hidden>' +
      '<header class="bot-head"><span class="bot-ava" aria-hidden="true">L</span><div><strong>Livi</strong><small><i></i>Asistente de FindGo · responde al momento</small></div><button class="bot-x" id="bot-x" aria-label="Cerrar a Livi">' + FG.icon("close") + '</button></header>' +
      '<div class="bot-log" id="bot-log" aria-live="polite"></div>' +
      '<div class="bot-chips" id="bot-chips">' + CHIPS.map(function (c) { return '<button type="button">' + esc(c) + '</button>'; }).join("") + '</div>' +
      '<form class="bot-form" id="bot-form" autocomplete="off"><input id="bot-in" maxlength="300" placeholder="Escribe tu pregunta…" aria-label="Tu pregunta" enterkeyhint="send"><button class="bot-send" aria-label="Enviar">' + FG.icon("right") + '</button></form>' +
    '</section>';
  document.body.appendChild(wrap);

  var fab = wrap.querySelector("#bot-fab"), panel = wrap.querySelector("#bot-panel"), log = wrap.querySelector("#bot-log"), input = wrap.querySelector("#bot-in"), started = false;
  function add(who, html) {
    var m = document.createElement("div"); m.className = "bot-msg " + who; m.innerHTML = html; log.appendChild(m);
    log.scrollTop = log.scrollHeight; return m;
  }
  function ask(text) {
    text = (text || "").trim(); if (!text) return;
    add("me", esc(text)); input.value = "";
    var typing = add("it typing", "<span></span><span></span><span></span>");
    setTimeout(function () { typing.remove(); add("it", answer(text) || FALLBACK); }, 450 + Math.min(text.length * 8, 500));
  }
  function open(v) {
    panel.hidden = !v; fab.setAttribute("aria-expanded", v); wrap.classList.toggle("is-open", v);
    if (v && !started) { started = true; add("it", "¡Hola! Soy Livi, la asistente de FindGo 👋 ¿En qué te puedo ayudar? Elige una pregunta o escríbeme la tuya."); }
    if (v) setTimeout(function () { input.focus(); }, 60); else fab.focus();
  }
  fab.addEventListener("click", function () { open(panel.hidden); });
  wrap.querySelector("#bot-x").addEventListener("click", function () { open(false); });
  wrap.querySelector("#bot-chips").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) ask(b.textContent); });
  wrap.querySelector("#bot-form").addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) open(false); });

  FG.assistantAnswer = answer;
})();
