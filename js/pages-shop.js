/* Inicio, catálogo y ficha de producto. */
(function () {
  var FG = window.FG, esc = FG.esc, page = document.body.dataset.page;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ================= INICIO ================= */
  function nest(artSvg, x, y, w) { return artSvg.replace('<svg viewBox="0 0 200 200"', '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + w + '" viewBox="0 0 200 200"'); }

  function home() {
    document.querySelectorAll("[data-art]").forEach(function (el) {
      var p = FG.product(el.dataset.art); el.innerHTML = FG.art(p.kind, el.dataset.color, { scale: p.scale, initials: el.dataset.ini });
    });

    /* Portada: la idea principal en diapositivas */
    var T = function (x, y, t, o) { return '<text x="' + x + '" y="' + y + '" font-family="Archivo,sans-serif" font-weight="800" letter-spacing="2" fill="#fff" ' + (o || 'font-size="14"') + '>' + t + '</text>'; };
    var GRID = '<g stroke="#fff" stroke-opacity=".12" fill="none"><path d="M0 80H520M0 180H520M0 280H520M0 380H520M90 0V460M210 0V460M330 0V460M450 0V460"/></g>';
    var svgOpen = function (label) { return '<svg viewBox="0 0 520 460" role="img" aria-label="' + label + '">'; };
    $("#pitch-art").innerHTML = svgOpen("La maleta FindGo sigue a su dueño y aparece localizada en el mapa") + GRID +
      '<path class="pitch-trail" d="M150 360 C230 360 270 170 430 150" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round"/>' +
      '<circle cx="430" cy="140" r="34" fill="none" stroke="#fff" stroke-width="1.5"/><circle cx="430" cy="140" r="7" fill="#fff"/>' + T(430, 200, "TÚ", 'font-size="14" text-anchor="middle"') +
      '<g class="pitch-bag">' + nest(FG.art("suitcase", "coral", { scale: .8 }), 20, 190, 250) + '</g>' +
      '<circle cx="145" cy="176" r="14" fill="#8fb0ff" class="pulse"/><circle cx="145" cy="176" r="8" fill="#151d5c" stroke="#fff" stroke-width="3"/>' +
      '<rect x="166" y="150" width="148" height="36" fill="#fff"/><text x="180" y="173" font-family="Archivo,sans-serif" font-size="13" font-weight="800" letter-spacing="1.5" fill="#151d5c">CINTA 4 · T2</text></svg>';
    $("#pitch-art-2").innerHTML = svgOpen("La maleta sigue a la persona a 1,5 metros") + GRID +
      '<path d="M40 404H500" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>' +
      '<path class="pitch-trail" d="M270 330 H420" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round"/>' +
      '<path d="M270 350V362M420 350V362M270 356H420" stroke="#fff" stroke-width="1.5"/>' + T(345, 384, "1,5 M", 'font-size="14" text-anchor="middle"') +
      '<g class="pitch-walk"><circle cx="450" cy="150" r="22" fill="#fff"/><path d="M450 176 V290 M450 290 L424 400 M450 290 L478 400 M450 200 L420 262 M450 200 L482 258" stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none"/></g>' +
      '<g class="pitch-bag">' + nest(FG.art("suitcase", "salvia", { scale: .8 }), 60, 170, 250) + '</g></svg>';
    $("#pitch-art-3").innerHTML = svgOpen("Mapa del aeropuerto con la maleta localizada") + GRID +
      '<path d="M0 400L150 300L270 290L520 120" fill="none" stroke="#fff" stroke-width="2.5"/>' +
      '<rect x="60" y="60" width="150" height="90" fill="#fff" fill-opacity=".12" stroke="#fff" stroke-opacity=".4"/>' + T(76, 112, "TERMINAL 2", 'font-size="12"') +
      '<rect x="330" y="300" width="140" height="80" fill="#fff" fill-opacity=".12" stroke="#fff" stroke-opacity=".4"/>' + T(346, 346, "BODEGA", 'font-size="12"') +
      '<circle cx="270" cy="290" r="22" fill="#9fe3d6" class="pulse"/><path d="M270 296c-16-18-24-30-24-42a24 24 0 0 1 48 0c0 12-8 24-24 42z" fill="#fff"/><circle cx="270" cy="254" r="9" fill="#0f3d3a"/>' +
      '<rect x="296" y="196" width="168" height="40" fill="#fff"/><text x="312" y="222" font-family="Archivo,sans-serif" font-size="14" font-weight="800" letter-spacing="1.5" fill="#0f3d3a">CINTA 4 · AHORA</text></svg>';
    $("#pitch-art-4").innerHTML = svgOpen("Batería extraíble de 98 Wh que viaja en cabina") + GRID +
      '<g class="pitch-bag">' + nest(FG.art("battery", "azul"), 110, 40, 300) + '</g>' +
      T(260, 380, "98 Wh", 'font-size="58" text-anchor="middle" style="font-stretch:125%"') + T(260, 420, "SE SACA CON UN CLIC · VA EN CABINA", 'font-size="13" text-anchor="middle" fill-opacity=".85"') + '</svg>';

    (function pitchSlider() {
      var root = $("#idea"), track = $("#pitch-track"), slides = [].slice.call(track.children), n = slides.length, cur = 0, timer = null, paused = false, hold = false, DELAY = 10000;
      var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches, dots = $("#pitch-dots"), pz = $("#pitch-pause");
      dots.innerHTML = slides.map(function (s, i) { return '<button class="pitch-dot" aria-label="Ir a la diapositiva ' + (i + 1) + '"><i></i></button>'; }).join("");
      $("#pitch-prev").innerHTML = FG.icon("left"); $("#pitch-next").innerHTML = FG.icon("right");
      function go(i, user) {
        cur = (i + n) % n; track.style.transform = "translateX(" + (-100 * cur) + "%)";
        slides.forEach(function (s, k) { s.setAttribute("aria-hidden", k !== cur); s.inert = k !== cur; });
        [].forEach.call(dots.children, function (d, k) { d.classList.toggle("on", k === cur); d.setAttribute("aria-current", k === cur); });
        restart();
      }
      function restart() {
        clearTimeout(timer); root.classList.remove("run"); void root.offsetWidth;
        if (paused || hold || reduce || document.hidden) return;
        root.classList.add("run"); timer = setTimeout(function () { go(cur + 1); }, DELAY);
      }
      function paint() { pz.innerHTML = FG.icon(paused ? "play" : "pause"); pz.setAttribute("aria-label", paused ? "Reanudar cambio automático" : "Pausar cambio automático"); }
      root.style.setProperty("--pitch-delay", DELAY + "ms");
      $("#pitch-prev").addEventListener("click", function () { go(cur - 1); });
      $("#pitch-next").addEventListener("click", function () { go(cur + 1); });
      pz.addEventListener("click", function () { paused = !paused; paint(); restart(); });
      dots.addEventListener("click", function (e) { var b = e.target.closest(".pitch-dot"); if (b) go([].indexOf.call(dots.children, b)); });
      root.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); });
      var x0 = null, y0 = 0;
      track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; hold = true; restart(); }, { passive: true });
      track.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null; hold = false; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1)); else restart(); }, { passive: true });
      document.addEventListener("visibilitychange", restart);
      paint(); if (reduce) pz.hidden = true; go(0);
    })();

    /* Mosaico principal: el bloque grande cambia solo de modelo y color */
    var items = [["cabin", "coral"], ["medium", "arena"], ["large", "salvia"]];
    var box = $("#hero-slides"), pauseBtn = $("#car-pause");
    box.innerHTML = items.map(function (it, i) { var p = FG.product(it[0]); return '<div class="sl' + (i ? "" : " on") + '" role="img" aria-label="' + esc(p.name) + ", " + FG.colorName(it[1]) + '">' + FG.art(p.kind, it[1], { scale: p.scale }) + '</div>'; }).join("");
    var idx = 0, timer = null, userPaused = false, hover = false, touching = false, DELAY = 4500;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches, tile = $(".tile-xl");
    function show(n) { idx = (n + items.length) % items.length; [].forEach.call(box.children, function (s, k) { s.classList.toggle("on", k === idx); }); }
    function stop() { clearInterval(timer); timer = null; }
    function start() { stop(); if (userPaused || hover || touching || document.hidden || reduce) return; timer = setInterval(function () { show(idx + 1); }, DELAY); }
    function paintPause() { pauseBtn.innerHTML = FG.icon(userPaused ? "play" : "pause"); pauseBtn.setAttribute("aria-label", userPaused ? "Reanudar cambio automático" : "Pausar cambio automático"); }
    pauseBtn.addEventListener("click", function () { userPaused = !userPaused; paintPause(); start(); });
    tile.addEventListener("mouseenter", function () { hover = true; start(); }); tile.addEventListener("mouseleave", function () { hover = false; start(); });
    tile.addEventListener("focusin", function () { hover = true; start(); }); tile.addEventListener("focusout", function () { hover = false; start(); });
    tile.addEventListener("touchstart", function () { touching = true; start(); }, { passive: true });
    tile.addEventListener("touchend", function () { setTimeout(function () { touching = false; start(); }, 3000); }, { passive: true });
    document.addEventListener("visibilitychange", start);
    paintPause(); if (reduce) pauseBtn.hidden = true; start();

    /* Recomendaciones: fila deslizante con barra de progreso */
    var rail = $("#reco"), thumb = $("#rail-thumb");
    rail.innerHTML = ["cabin", "medium", "large", "pack-viaje", "mochila-day", "weekender", "bateria"].map(function (id) { return FG.card(FG.product(id)); }).join("");
    $("#rail-prev").innerHTML = FG.icon("left"); $("#rail-next").innerHTML = FG.icon("right");
    function prog() { var sw = rail.scrollWidth, cw = rail.clientWidth; if (sw <= cw + 2) { thumb.parentNode.style.visibility = "hidden"; return; } thumb.parentNode.style.visibility = ""; thumb.style.width = (cw / sw * 100) + "%"; thumb.style.left = (rail.scrollLeft / sw * 100) + "%"; }
    rail.addEventListener("scroll", function () { requestAnimationFrame(prog); }, { passive: true }); window.addEventListener("resize", prog); prog();
    $("#rail-prev").addEventListener("click", function () { rail.scrollBy({ left: -rail.clientWidth * .8, behavior: "smooth" }); });
    $("#rail-next").addEventListener("click", function () { rail.scrollBy({ left: rail.clientWidth * .8, behavior: "smooth" }); });

    /* Estilos favoritos */
    var tiles = [["maletas", "cabin", "azul", "#d9e1e8"], ["equipaje", "pack-viaje", "salvia", "#e6dde0"], ["personalizacion", "p-iniciales", "coral", "#dde1ea"], ["accesorios", "bateria", "azul", "#e3e5df"]];
    $("#styles").innerHTML = tiles.map(function (t) { var p = FG.product(t[1]); return '<a class="style-tile" href="catalogo.html?cat=' + t[0] + '"><div class="st-art" style="background:' + t[3] + '">' + FG.art(p.kind, t[2], { scale: p.scale, initials: "AB" }) + '</div><span>' + FG.CATS[t[0]].name + '</span></a>'; }).join("");

    /* Guía de tamaños */
    var MAP = { corto: "cabin", semana: "medium", largo: "large" }, order = ["cabin", "medium", "large", "lite"];
    function sizes(d) {
      $("#sizes").innerHTML = order.map(function (id) {
        var p = FG.product(id), rec = MAP[d] === id;
        return '<article class="size' + (rec ? " rec" : "") + '"><span class="rec-tag">Recomendada para ti</span><div class="sz-art">' + FG.productArt(p) + '</div><h3>' + esc(FG.lineName(p)) + '</h3><dl><div><dt>Medidas</dt><dd>' + p.dims + '</dd></div><div><dt>Capacidad</dt><dd>' + p.litres + '</dd></div><div><dt>Peso</dt><dd>' + p.weight + '</dd></div><div><dt>Follow Me</dt><dd>' + (p.followMe ? "Sí" : "No") + '</dd></div></dl><p class="muted small" style="margin:6px 0 4px">' + esc(p.who) + '</p><div class="price">' + FG.eur(p.price) + '</div><a class="btn ' + (rec ? "btn-primary" : "") + ' btn-sm" href="producto.html?id=' + id + '">Ver ' + esc(FG.lineName(p)) + '</a></article>';
      }).join("");
    }
    sizes("corto");
    $("#trip-seg").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; [].forEach.call($("#trip-seg").children, function (x) { x.setAttribute("aria-checked", x === b); }); sizes(b.dataset.d); });

    /* Bloques "shop the look" */
    var cab = FG.art("suitcase", "coral", { scale: .8 });
    $("#art-follow").innerHTML = '<svg viewBox="0 0 480 560" role="img" aria-label="La maleta sigue a la persona" style="color:var(--ink)"><path d="M70 470 C150 470 170 230 400 200" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 9" stroke-linecap="round"/><circle cx="400" cy="190" r="30" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="400" cy="190" r="6" fill="currentColor"/><text x="384" y="244" font-family="Archivo,sans-serif" font-size="13" font-weight="700" letter-spacing="2" fill="currentColor">TÚ</text><text x="196" y="340" font-family="Archivo,sans-serif" font-size="12" font-weight="600" letter-spacing="2" fill="currentColor" transform="rotate(-28 196 340)">1,5 M</text>' + nest(cab, 20, 290, 260) + '</svg>';
    $("#art-map").innerHTML = '<svg viewBox="0 0 480 560" role="img" aria-label="Mapa con la ubicación de la maleta" style="color:var(--ink)"><g stroke="currentColor" stroke-opacity=".18" stroke-width="1" fill="none"><path d="M0 90H480M0 190H480M0 290H480M0 390H480M0 490H480M70 0V560M170 0V560M270 0V560M370 0V560"/></g><path d="M0 470L170 360L290 330L480 190" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="290" cy="330" r="14" fill="currentColor" class="pulse"/><circle cx="290" cy="330" r="8" fill="var(--bg)" stroke="currentColor" stroke-width="3"/><rect x="310" y="262" width="150" height="40" fill="currentColor"/><text x="324" y="287" font-family="Archivo,sans-serif" font-size="14" font-weight="700" letter-spacing="1.5" fill="var(--bg)">CINTA 4 · T2</text></svg>';
    $("#art-bat").innerHTML = '<svg viewBox="0 0 480 560" role="img" aria-label="Batería de 98 Wh" style="color:var(--ink)">' + nest(FG.art("battery", "azul"), 70, 110, 340) + '<text x="240" y="470" text-anchor="middle" font-family="Archivo,sans-serif" font-size="54" font-weight="800" fill="currentColor" style="font-stretch:125%">98 Wh</text></svg>';

    /* Personalización */
    $("#pers").innerHTML = [["p-iniciales", "Iniciales grabadas"], ["p-asas", "Asas y ruedas de color"], ["p-funda-diseno", "Funda con tu diseño"]].map(function (r) { var p = FG.product(r[0]); return '<a class="pers-tile" href="producto.html?id=' + r[0] + '"><div class="pt-art">' + FG.productArt(p, p.colors ? "coral" : null, "AB") + '</div><strong>' + r[1] + '</strong><span>Desde ' + FG.eur(p.price) + '</span></a>'; }).join("");

    var yes = '<span class="tick">✓</span>', no = '<span class="no">—</span>';
    var rows = [["Precio", function (p) { return "<strong>" + FG.eur(p.price) + "</strong>"; }], ["Medidas", function (p) { return p.dims; }], ["Capacidad", function (p) { return p.litres; }], ["Peso", function (p) { return p.weight; }], ["Follow Me", function (p) { return p.followMe ? yes : no; }], ["Localización en tiempo real", function () { return yes; }], ["Batería extraíble", function (p) { return p.followMe ? yes : no; }], ["Iniciales grabadas", function () { return yes; }], ["Ideal para", function (p) { return esc(p.who); }]];
    $("#cmp").innerHTML = rows.map(function (r) { return "<tr><td>" + r[0] + "</td>" + order.map(function (id) { return "<td>" + r[1](FG.product(id)) + "</td>"; }).join("") + "</tr>"; }).join("");
    $("#comp").innerHTML = FG.COMPETITION.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") + '<tr class="us"><td>FindGo</td><td>Seguimiento + localización + personalización</td><td>229 a 449 € (Cabin 349 €)</td><td>—</td></tr>';
    var avg = FG.REVIEWS.reduce(function (a, r) { return a + r.r; }, 0) / FG.REVIEWS.length, big = $(".rev-sum .big");
    if (big) big.textContent = avg.toFixed(1).replace(".", ",");
    $("#revs").innerHTML = FG.REVIEWS.slice(0, 3).map(function (r) { return '<article class="rev"><div class="st" aria-label="' + r.r + ' de 5">' + "★★★★★".slice(0, r.r) + '<span class="off">' + "★★★★★".slice(r.r) + '</span></div><h3>' + esc(r.t) + '</h3><p>' + esc(r.x) + '</p><small>' + esc(r.n) + ' · opinión de ejemplo</small></article>'; }).join("");
    $("#faq-list").innerHTML = FG.FAQ.map(function (q, i) { return '<details class="faq"' + (i === 0 ? " open" : "") + '><summary>' + esc(q[0]) + '</summary><p>' + esc(q[1]) + '</p></details>'; }).join("");

    var cbox = $("#club-box");
    function renderClub() {
      var c = FG.club.get();
      if (c) {
        cbox.innerHTML = '<div class="club-ok"><p style="margin:0 0 6px">Bienvenido al club. Tu código del 10 %:</p><div class="code">CLUB10</div><p style="margin:10px 0 0;font-size:.92rem">Se aplica en el carrito. Enviado a <strong>' + esc(c.email) + '</strong>.</p><button class="btn btn-sm" id="copy-code" style="margin-top:14px">Copiar código</button></div>';
        $("#copy-code").addEventListener("click", function () { try { navigator.clipboard.writeText("CLUB10"); } catch (e) {} FG.toast("Código CLUB10 copiado"); });
      } else {
        cbox.innerHTML = '<form id="club-form" novalidate><div class="field"><label for="club-mail">Tu correo electrónico</label><input id="club-mail" type="email" inputmode="email" autocomplete="email" autocapitalize="none" placeholder="nombre@correo.com" required><span class="err">Introduce un correo válido.</span></div><label class="check"><input type="checkbox" id="club-ok" required><span>Acepto recibir comunicaciones y la <a href="privacidad.html">política de privacidad</a>.</span></label><button class="btn btn-block btn-lg" type="submit">Quiero mi 10 %</button></form>';
        $("#club-form").addEventListener("submit", function (e) {
          e.preventDefault();
          var m = $("#club-mail"), ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim()), chk = $("#club-ok").checked;
          m.closest(".field").classList.toggle("bad", !ok);
          if (!chk) { FG.toast("Acepta las condiciones para continuar"); return; }
          if (!ok) { m.focus(); return; }
          FG.club.join(m.value.trim()); renderClub(); FG.toast("Ya eres del club. Código: CLUB10");
        });
      }
    }
    renderClub();
  }

  /* ================= CATÁLOGO ================= */
  var LABELS = { size: { cabina: "Cabina", mediano: "Mediano", grande: "Grande", pequeno: "Pequeño", pack: "Packs" },
    func: { maleta: "Maletas", pack: "Packs", mochila: "Mochilas", bolsa: "Bolsas", trabajo: "Trabajo", infantil: "Infantil", grabado: "Grabado", color: "Color", funda: "Fundas", etiqueta: "Etiquetas", energia: "Energía", comodidad: "Comodidad", localizador: "Localizadores", seguridad: "Seguridad", orden: "Organización", garantia: "Garantía", app: "App", reparacion: "Reparación", b2b: "Empresas" },
    trip: { escapada: "Escapada", negocios: "Negocios", familia: "Familia", largo: "Viaje largo" } };
  var NAMES = { size: "Tamaño", func: "Función", trip: "Tipo de viaje", color: "Color", sort: "Ordenar" };

  /* SEO de la ficha: título, descripción, Open Graph y datos estructurados propios de cada producto */
  function seo(p) {
    var kind = p.followMe ? "maleta inteligente con Follow Me" : p.id === "lite" ? "maleta con localizador GPS" : String(p.short || "").replace(/\.$/, "").replace(/^./, function (c) { return c.toLowerCase(); });
    var title = p.name + (kind ? ", " + kind : "") + " | FindGo";
    var d0 = String(p.desc || p.short || ""), desc = d0.length > 155 ? d0.slice(0, 152).replace(/\s+\S*$/, "") + "…" : d0;
    var url = location.origin + location.pathname + "?id=" + p.id;
    function meta(sel, attr, val) { var m = document.querySelector(sel); if (!m) { m = document.createElement("meta"); var k = sel.match(/\[(\w+)="([^"]+)"\]/); m.setAttribute(k[1], k[2]); document.head.appendChild(m); } m.setAttribute(attr, val); }
    document.title = title;
    meta('meta[name="description"]', "content", desc);
    meta('meta[property="og:title"]', "content", title);
    meta('meta[property="og:description"]', "content", desc);
    meta('meta[property="og:url"]', "content", url);
    meta('meta[property="og:type"]', "content", "product");
    var ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.desc, brand: { "@type": "Brand", name: "FindGo" }, url: url };
    if (p.price != null) ld.offers = { "@type": "Offer", price: String(p.price.toFixed(2)), priceCurrency: "EUR", availability: "https://schema.org/InStock", url: url };
    var sc = document.getElementById("ld-product") || document.createElement("script"); sc.id = "ld-product"; sc.type = "application/ld+json"; sc.textContent = JSON.stringify(ld); document.head.appendChild(sc);
  }

  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  var PR = { "0-50": [0, 50, "Hasta 50 €"], "50-200": [50, 200, "De 50 a 200 €"], "200-400": [200, 400, "De 200 a 400 €"], "400+": [400, 1e9, "Más de 400 €"] };

  var COLOR_CARDS = { cabin: 1, medium: 1 };  // en Maletas, una tarjeta por color
  function catalog() {
    var ALL = !!document.body.dataset.all, PAGE = ALL ? "todos.html" : "catalogo.html";
    var q = new URLSearchParams(location.search), st = { cat: q.get("cat") || "", size: q.get("size") || "", func: q.get("func") || "", trip: q.get("trip") || "", color: "", pmin: q.get("pmin") || "", pmax: q.get("pmax") || "", fm: q.get("fm") || "", q: q.get("q") || "", sort: q.get("sort") || "" };
    if (st.cat && !FG.CATS[st.cat]) st.cat = "";
    if (ALL) { st.cat = ""; $("#sort").options[0].textContent = "Más vendidos"; }
    var RANK = {}; FG.BESTSELLERS.forEach(function (id, i) { RANK[id] = i; });
    var closed = {};

    var base = FG.PRODUCTS.filter(function (p) { return !st.cat || p.cat === st.cat; });
    if (st.q) base = FG.search(st.q, base);
    var pr = base.filter(function (p) { return p.price != null; }).map(function (p) { return p.price; });
    var PMIN = pr.length ? Math.floor(Math.min.apply(null, pr) / 10) * 10 : 0, PMAX = pr.length ? Math.ceil(Math.max.apply(null, pr) / 10) * 10 : 0, STEP = (PMAX - PMIN) > 300 ? 10 : 5;
    function lo() { var v = st.pmin === "" ? PMIN : +st.pmin; return isNaN(v) ? PMIN : Math.max(PMIN, Math.min(v, PMAX)); }
    function hi() { var v = st.pmax === "" ? PMAX : +st.pmax; return isNaN(v) ? PMAX : Math.max(PMIN, Math.min(v, PMAX)); }
    function priceOn() { return PMAX > PMIN && (lo() > PMIN || hi() < PMAX); }
    function ok(p, skip) {
      if (skip !== "size" && st.size && p.size !== st.size) return false;
      if (skip !== "func" && st.func && p.func !== st.func) return false;
      if (skip !== "trip" && st.trip && p.trip !== st.trip) return false;
      if (skip !== "color" && st.color && !(p.colors || []).includes(st.color)) return false;
      if (skip !== "price" && priceOn()) { if (p.price == null || p.price < lo() || p.price > hi()) return false; }
      if (skip !== "fm" && st.fm && !p.followMe) return false;
      return true;
    }
    function values(key) { var seen = {}; base.forEach(function (p) { var v = p[key]; if (v && v !== "-") seen[v] = 1; }); return Object.keys(seen); }
    function active() { return ["size", "func", "trip", "color", "price", "fm"].filter(function (k) { return k === "price" ? priceOn() : st[k]; }); }

    function radioGroup(key, title, opts) {
      var all = base.filter(function (p) { return ok(p, key); }).length;
      var rows = '<label class="f-opt"><input type="radio" name="' + key + '" value=""' + (!st[key] ? " checked" : "") + '><span class="f-name">Todos</span><span class="f-count">' + all + '</span></label>' + opts.map(function (o) {
        var n = base.filter(function (p) { return ok(p, key) && p[key] === o[0]; }).length;
        return '<label class="f-opt' + (!n && st[key] !== o[0] ? " off" : "") + '"><input type="radio" name="' + key + '" value="' + esc(o[0]) + '"' + (st[key] === o[0] ? " checked" : "") + (!n && st[key] !== o[0] ? " disabled" : "") + '><span class="f-name">' + esc(o[1]) + '</span><span class="f-count">' + n + '</span></label>';
      }).join("");
      return group(key, title, rows);
    }
    function group(key, title, inner) { return '<details class="f-group" data-g="' + key + '"' + (closed[key] ? "" : " open") + '><summary>' + title + '</summary><div class="f-body">' + inner + '</div></details>'; }

    function pct(v) { return Math.round(((v - PMIN) / (PMAX - PMIN)) * 100); }
    function priceHTML() {
      var a = lo(), b = hi(), n = base.filter(function (p) { return ok(p, "price") && p.price != null && p.price >= a && p.price <= b; }).length;
      return '<div class="f-price"><div class="f-vals"><span id="pv-min">' + FG.eur(a) + '</span><span class="f-dash" aria-hidden="true">–</span><span id="pv-max">' + FG.eur(b) + '</span></div>' +
        '<div class="f-range" style="--a:' + pct(a) + '%;--b:' + pct(b) + '%"><div class="f-fill"></div><input type="range" id="pmin" min="' + PMIN + '" max="' + PMAX + '" step="' + STEP + '" value="' + a + '" aria-label="Precio mínimo"><input type="range" id="pmax" min="' + PMIN + '" max="' + PMAX + '" step="' + STEP + '" value="' + b + '" aria-label="Precio máximo"></div>' +
        '<p class="f-note" id="pv-n">' + n + (n === 1 ? " producto" : " productos") + ' en este rango</p></div>';
    }
    function drawFilters() {
      var a = document.activeElement, fk = a && a.closest && a.closest("#filters") ? (a.name ? a.name + "|" + a.value : a.dataset.color ? "c|" + a.dataset.color : a.id) : null;
      var scroll = $("#filters").scrollTop, h = '<div class="f-mob"><strong>Filtros</strong><button class="icon-btn" id="f-close" aria-label="Cerrar filtros">' + FG.icon("close") + '</button></div>';
      h += '<div class="f-head"><h2>Filtrar</h2>' + (active().length ? '<button class="f-clear" id="f-clear">Limpiar (' + active().length + ')</button>' : "") + '</div>';
      ["size", "func", "trip"].forEach(function (k) { var v = values(k); if (v.length > 1 || st[k]) h += radioGroup(k, NAMES[k], v.map(function (x) { return [x, LABELS[k][x] || x]; })); });
      if (PMAX > PMIN && pr.length > 3) h += group("price", "Precio", priceHTML());
      var hasFm = base.some(function (p) { return p.followMe; }) && base.some(function (p) { return !p.followMe && p.cat === "maletas"; });
      if (hasFm || st.fm) h += group("fm", "Características", '<label class="f-opt"><input type="checkbox" name="fm" value="1"' + (st.fm ? " checked" : "") + '><span class="f-name">Con Follow Me</span><span class="f-count">' + base.filter(function (p) { return ok(p, "fm") && p.followMe; }).length + '</span></label>');
      h += '<div class="f-mob f-foot"><button class="btn btn-primary btn-block" id="f-apply">Ver resultados</button></div>';
      $("#filters").innerHTML = h; $("#filters").scrollTop = scroll;
      if (fk) { var el = null; [].forEach.call($("#filters").querySelectorAll("input,button"), function (e) { var key = e.name ? e.name + "|" + e.value : e.dataset.color ? "c|" + e.dataset.color : e.id; if (key === fk) el = e; }); if (el && !el.disabled) el.focus({ preventScroll: true }); }
    }

    function labelOf(k) { return k === "color" ? FG.colorName(st[k]) : k === "price" ? FG.eur(lo()) + " – " + FG.eur(hi()) : k === "fm" ? "Con Follow Me" : (LABELS[k][st[k]] || st[k]); }
    function drawGrid() {
      var list = base.filter(function (p) { return ok(p); });
      if (st.sort) list = list.slice().sort(function (a, b) { var x = a.price == null ? 1e9 : a.price, y = b.price == null ? 1e9 : b.price; return st.sort === "asc" ? x - y : y - x; });
      else if (ALL && !st.q) list = list.slice().sort(function (a, b) { return (RANK[a.id] == null ? 999 : RANK[a.id]) - (RANK[b.id] == null ? 999 : RANK[b.id]); });
      var title = st.q ? "Resultados para «" + st.q + "»" : ALL ? "Todos los productos" : st.cat ? FG.CATS[st.cat].name : "Todo el catálogo";
      $("#cat-title").textContent = title; document.title = title + " · FindGo"; $("#crumb").textContent = title;
      $("#cat-desc").textContent = ALL ? "Toda la tienda, de los más vendidos a los menos vendidos." : st.cat ? FG.CATS[st.cat].desc : "Todo lo que necesitas para viajar con FindGo.";
      // En Maletas la Cabin y la Medium salen una vez por cada color
      var cardList = [];
      list.forEach(function (p) { if (st.cat === "maletas" && !st.q && COLOR_CARDS[p.id] && p.colors) p.colors.forEach(function (c) { cardList.push(FG.card(p, { color: c })); }); else cardList.push(FG.card(p)); });
      $("#count").textContent = cardList.length + (cardList.length === 1 ? " producto" : " productos");
      $("#sort").value = st.sort;
      var n = active().length, fb = $("#f-badge"); fb.hidden = !n; fb.textContent = n;
      var chips = "";
      if (st.q) chips += '<button class="chip" data-clear="q">Búsqueda: «' + esc(st.q) + '» ✕</button>';
      active().forEach(function (k) { chips += '<button class="chip" data-clear="' + k + '">' + (k === "fm" ? "" : NAMES[k] ? NAMES[k] + ": " : k === "price" ? "Precio: " : "") + esc(labelOf(k)) + ' ✕</button>'; });
      // «Limpiar todo» solo aparece si se ha cambiado algún filtro (la búsqueda sola no cuenta)
      $("#chips").innerHTML = chips + (active().length ? '<button class="chip chip-clear" data-clear="all">Limpiar todo</button>' : "");
      var cards = cardList;
      $("#grid").innerHTML = list.length ? cards.join("") : !base.length && st.q
        ? '<div class="empty" style="grid-column:1/-1"><h3>No encontramos «' + esc(st.q) + '»</h3><p>Prueba con ' + FG.SEARCH_SUGG.map(function (x) { return '<a class="link-u" href="catalogo.html?q=' + encodeURIComponent(x) + '">' + esc(x) + '</a>'; }).join(", ") + '.</p><a class="btn btn-primary" href="catalogo.html">Ver todo el catálogo</a></div>'
        : '<div class="empty" style="grid-column:1/-1"><h3>No hay productos con esos filtros</h3><p>Prueba a quitar alguno.</p><button class="btn btn-primary" data-clear="all">Limpiar filtros</button></div>';
      var pb = $("#promo");
      pb.innerHTML = list.length && st.cat !== "personalizacion" && !st.q ? '<div class="promo-bar"><div class="pb-art" aria-hidden="true">' + FG.art("tag", "cuero", { initials: "AB" }) + FG.art("engrave", "azul", { initials: "AMG" }) + '</div><div class="pb-text"><strong>Hazla tuya</strong><p>Iniciales grabadas, asas de color y fundas con tu diseño.</p></div><a class="btn btn-sm" href="catalogo.html?cat=personalizacion">Ver personalización</a></div>' : "";
      var fa = $("#f-apply"); if (fa) fa.textContent = "Ver " + cards.length + (cards.length === 1 ? " resultado" : " resultados");
      if (!drawGrid.first) $("#grid").querySelectorAll(".card").forEach(function (c, i) { c.classList.add("rise"); c.style.animationDelay = Math.min(i, 8) * 40 + "ms"; });
      drawGrid.first = 1;
    }
    function sync() {
      var p = new URLSearchParams(); Object.keys(st).forEach(function (k) { if (st[k]) p.set(k, st[k]); });
      try { history.replaceState(null, "", PAGE + (p.toString() ? "?" + p : "")); } catch (e) {}
    }
    function update() { sync(); drawFilters(); drawGrid(); }
    function clearKey(k) { if (k === "all") { ["size", "func", "trip", "color", "pmin", "pmax", "fm"].forEach(function (x) { st[x] = ""; }); } else if (k === "q") { location.href = PAGE + (st.cat ? "?cat=" + st.cat : ""); return; } else if (k === "price") { st.pmin = ""; st.pmax = ""; } else st[k] = ""; update(); }

    var panel = $("#filters"), back = $("#f-back");
    function openPanel(v) { panel.classList.toggle("open", v); back.hidden = !v; document.body.classList.toggle("no-scroll", v && window.innerWidth < 960); if (v) { var f = panel.querySelector("input:checked,input,button"); if (f) f.focus({ preventScroll: true }); } else $("#filter-open").focus({ preventScroll: true }); }
    panel.addEventListener("input", function (e) {
      var t = e.target; if (t.type !== "range") return;
      var a = +$("#pmin").value, b = +$("#pmax").value;
      if (t.id === "pmin" && a > b) { a = b; t.value = a; } if (t.id === "pmax" && b < a) { b = a; t.value = b; }
      st.pmin = a <= PMIN ? "" : String(a); st.pmax = b >= PMAX ? "" : String(b);
      var box = t.closest(".f-range"); box.style.setProperty("--a", pct(a) + "%"); box.style.setProperty("--b", pct(b) + "%");
      $("#pv-min").textContent = FG.eur(a); $("#pv-max").textContent = FG.eur(b);
      var n = base.filter(function (p) { return ok(p, "price") && p.price != null && p.price >= a && p.price <= b; }).length; $("#pv-n").textContent = n + (n === 1 ? " producto" : " productos") + " en este rango";
      sync(); drawGrid();
    });
    panel.addEventListener("change", function (e) { var t = e.target; if (t.type === "radio") st[t.name] = t.value; else if (t.type === "checkbox") st[t.name] = t.checked ? t.value : ""; update(); });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("#f-clear")) { clearKey("all"); return; }
      if (e.target.closest("#f-close") || e.target.closest("#f-apply")) openPanel(false);
    });
    panel.addEventListener("toggle", function (e) { var g = e.target.dataset && e.target.dataset.g; if (g) closed[g] = !e.target.open; }, true);
    $("#sort").addEventListener("change", function (e) { st.sort = e.target.value; update(); });
    $("#chips").addEventListener("click", function (e) { var c = e.target.closest("[data-clear]"); if (c) clearKey(c.dataset.clear); });
    $("#grid").addEventListener("click", function (e) { var c = e.target.closest("[data-clear]"); if (c) clearKey(c.dataset.clear); });
    var layout = $("#cat-layout");
    $("#filter-open").addEventListener("click", function () {
      if (window.innerWidth >= 960) { var c = layout.classList.toggle("no-filters"); this.setAttribute("aria-expanded", !c); }
      else openPanel(true);
    });
    back.addEventListener("click", function () { openPanel(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) openPanel(false); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 960 && panel.classList.contains("open")) openPanel(false); });
    drawFilters(); drawGrid();
  }

  /* ================= PRODUCTO ================= */
  function product() {
    var qs = new URLSearchParams(location.search), id = qs.get("id"), p = FG.product(id), root = $("#pdp");
    if (!p) { root.innerHTML = '<div class="empty container"><h1>Producto no encontrado</h1><a class="btn" href="catalogo.html">Ver catálogo</a></div>'; return; }
    if (p.href) { location.replace(p.href); return; }
    seo(p);
    var qc = qs.get("color");
    var s = { color: p.colors ? (qc && p.colors.indexOf(qc) > -1 ? qc : p.colors[0]) : null, variant: p.variants ? p.variants[0].n : null, initials: "", font: "clasica", tsize: "m", tpos: "mid", qty: 1 };
    var needIni = !!p.needsInitials;
    function unit() {
      var base = p.price;
      if (p.variants) base = p.variants.filter(function (v) { return v.n === s.variant; })[0].price;
      if (s.initials && p.initials && !p.needsInitials) base += 19;
      return base;
    }
    var hasViews = !!p.followMe || p.id === "lite";
    var views = !hasViews ? [["Frontal", "front"]] : p.id === "lite" ? [["Frontal", "front"], ["App", "app"], ["Tamaños", "size"]] : [["Frontal", "front"], ["Batería", "bat"], ["App", "app"], ["Tamaños", "size"]];
    function viewArt(v) {
      if (v === "front") return { svg: FG.productArt(p, s.color, s.initials, s.font, { size: s.tsize, pos: s.tpos }), cap: "" };
      if (v === "bat") return { svg: FG.art("battery", "azul"), cap: "Batería de 98 Wh: se extrae con un clic y viaja contigo en cabina." };
      if (v === "app") return { svg: FG.art("app", "azul"), cap: "Sigue tu maleta en el mapa desde la app, también facturada." };
      return { svg: FG.art("pack3", s.color || "azul"), cap: "Cabin 55 cm · Medium 65 cm · Large 75 cm." };
    }
    var SUIT = ["cabin", "medium", "large", "lite"], isSuit = SUIT.indexOf(p.id) > -1;
    var rate = p.rating ? '<div class="p-rate" aria-label="Valoración ' + p.rating + ' de 5"><span class="st" aria-hidden="true">★★★★★</span> <a href="#reviews">' + p.rating.toFixed(1).replace(".", ",") + " (" + p.reviews + ")</a></div>" : "";
    var subtitle = p.followMe ? "Maleta inteligente con Follow Me" : p.id === "lite" ? "Maleta con localizador GPS" : esc(p.short || "");
    var h = '<div class="pdp2"><div class="gal" id="gal" aria-label="Imágenes del producto"></div><div class="pinfo">' +
      '<nav class="crumbs" aria-label="Migas"><a href="index.html">Inicio</a> / <a href="catalogo.html?cat=' + p.cat + '">' + FG.CATS[p.cat].name + '</a></nav>' +
      '<div class="p-head"><div><h1 class="p-line">' + esc(FG.lineName(p)) + '</h1><p class="p-name">' + subtitle + (p.dims ? " " + p.dims.split(" × ")[0].replace(/\D/g, "") + " cm" : "") + '</p></div>' + rate + '</div>' +
      '<div class="p-price"><b id="price"></b>' + (p.was ? ' <s>' + FG.eur(p.was) + '</s>' : "") + (p.monthly ? ' <small class="muted">primer mes, cancelable</small>' : "") + ' <small class="muted p-vat">IVA incluido</small><span class="stock"><i></i>En existencias</span></div>';
    if (p.initials && !needIni) h += '<div class="p-offer">Iniciales grabadas: +' + FG.eur(19) + '</div>';
    if (isSuit) h += '<div class="p-opt"><div class="p-lab"><b>Tamaño</b> <span>' + p.dims + '</span> <a href="index.html#tamano">Guía de tamaños</a></div><div class="boxes">' + SUIT.map(function (sid) { var q = FG.product(sid); return '<a class="box' + (sid === p.id ? " on" : "") + '" href="producto.html?id=' + sid + (s.color ? "&color=" + s.color : "") + '"' + (sid === p.id ? ' aria-current="page"' : "") + '>' + esc(FG.lineName(q)) + '<small>' + q.dims.split(" × ")[0] + ' cm</small></a>'; }).join("") + '</div></div>';
    if (p.variants) h += '<div class="p-opt"><div class="p-lab"><b>' + (p.variantLabel || "Talla de la maleta") + '</b></div><div class="boxes" role="radiogroup" aria-label="' + (p.variantLabel || "Talla") + '">' + p.variants.map(function (v) { return '<button class="box" role="radio" aria-checked="false" data-variant="' + v.n + '">' + v.n + '<small>' + FG.eur(v.price) + '</small></button>'; }).join("") + '</div></div>';
    if (p.colors) h += '<div class="p-opt"><div class="p-lab"><b>Color</b> <span id="color-name"></span></div><div class="swatches" role="radiogroup" aria-label="Color">' + p.colors.map(function (c) { return '<button class="swatch" role="radio" aria-checked="false" data-color="' + c + '" aria-label="' + FG.colorName(c) + '"><i style="background:' + FG.COLORS[c].hex + '"></i></button>'; }).join("") + '</div></div>';
    if (p.initials) h += '<div class="field p-ini"><label for="ini">Iniciales grabadas' + (needIni ? "" : " (opcional)") + '</label><input id="ini" maxlength="3" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="Ej.: AMG"><span class="hint">Hasta 3 letras o números. Producto personalizado: no admite devolución salvo defecto.</span><span class="err" id="ini-err">Escribe al menos una inicial.</span></div>';
    if (p.initials) h += '<div class="p-opt p-font"><div class="p-lab"><b>Tipo de letra</b> <span id="font-name"></span></div><div class="boxes" role="radiogroup" aria-label="Tipo de letra">' + Object.keys(FG.FONTS).map(function (k) { var f = FG.FONTS[k]; return '<button type="button" class="box" role="radio" aria-checked="false" data-font="' + k + '" aria-label="' + esc(f.n) + '"><span class="font-sample" style="font-family:' + f.f + ';font-weight:' + f.w + '">ABC</span><small>' + esc(f.n) + '</small></button>'; }).join("") + '</div></div>';
    if (p.initials) h += '<div class="p-opt p-tsize"><div class="p-lab"><b>Tamaño del texto</b> <span id="tsize-name"></span></div><div class="boxes" role="radiogroup" aria-label="Tamaño del texto">' + Object.keys(FG.TEXT_SIZES).map(function (k) { return '<button type="button" class="box" role="radio" aria-checked="false" data-tsize="' + k + '"><span class="font-sample" style="font-size:' + (FG.TEXT_SIZES[k].k * 1.05) + 'em">A1</span><small>' + FG.TEXT_SIZES[k].n + '</small></button>'; }).join("") + '</div></div>' +
      '<div class="p-opt p-tpos"><div class="p-lab"><b>Posición del texto</b> <span id="tpos-name"></span></div><div class="boxes" role="radiogroup" aria-label="Posición del texto">' + Object.keys(FG.TEXT_POS).map(function (k) { return '<button type="button" class="box" role="radio" aria-checked="false" data-tpos="' + k + '">' + FG.TEXT_POS[k].n + '</button>'; }).join("") + '</div></div>';
    if (p.nonReturnable && !p.initials) h += '<div class="note warn">Producto personalizado: no admite devolución salvo defecto (art. 103 TRLGDCU).</div>';
    if (p.monthly) h += '<div class="note">Suscripción: 2,99 € al mes, cancelable desde Mi cuenta. No se aplica el código CLUB10.</div>';
    h += '<div class="p-buy">' + '<button class="btn btn-primary btn-block btn-lg" id="add">Añadir al carrito</button><button class="fav-line" data-fav="' + p.id + '" aria-pressed="false">' + FG.icon("heart") + '<span>Añadir a favoritos</span></button></div>' +
      '<div class="p-strip">Envío estándar gratis desde ' + FG.eur(99) + ' · Devolución gratuita en 30 días</div>' +
      '<div class="p-reass"><div>' + FG.icon("truck") + '<span>Envíos gratis desde ' + FG.eur(99) + '<br>Devoluciones gratuitas</span></div><div>' + FG.icon("pin") + '<span>Recíbela entre<br>' + FG.deliveryText() + '</span></div></div>';
    var spec = p.spec || [];
    if (p.dims) spec = [["Medidas", p.dims]].concat(spec);
    if (p.litres) spec = [["Capacidad", p.litres]].concat(p.weight ? [["Peso", p.weight]] : []).concat(spec);
    h += '<div class="acc">';
    h += '<details open><summary>Detalles del producto</summary><div class="in"><p>' + esc(p.desc) + '</p>' + (spec.length ? '<dl class="specs">' + spec.map(function (r) { return '<div class="r"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join("") + '</dl>' : "") + '</div></details>';
    if (p.followMe) h += '<details><summary>Batería y vuelos</summary><div class="in"><p>Al facturar, extrae la batería de movimiento (98 Wh; las aerolíneas permiten hasta 100 Wh en cabina, norma IATA). El módulo localizador, con pila de botón fija, sigue activo en bodega. La app te recuerda sacar la batería al llegar al aeropuerto.</p></div></details>';
    if (p.id === "lite") h += '<details><summary>Qué diferencia a la Lite</summary><div class="in"><p>No lleva Follow Me ni batería extraíble: solo el módulo localizador de pila fija, por eso puede facturarse tal cual.</p></div></details>';
    h += '<details><summary>Envíos y devoluciones</summary><div class="in"><p>Envío estándar ' + FG.eur(4.95) + ' (gratis desde ' + FG.eur(99) + ', 3 a 5 días laborables) o express ' + FG.eur(9.95) + ' (24 a 48 horas). 30 días para devolver con recogida gratis y reembolso en un máximo de 14 días. <a href="devoluciones.html">Más información</a>.</p></div></details>';
    h += '<details><summary>Garantía</summary><div class="in"><p>Garantía de 3 años que cubre la batería de movimiento y el sistema Follow Me. Puedes ampliarla con la garantía ampliada (' + FG.eur(39) + ').</p></div></details></div></div></div>';
    root.innerHTML = h;
    var fb = $('[data-fav="' + p.id + '"]'); function paintFav() { var on = FG.favs.has(p.id); fb.classList.toggle("on", on); fb.setAttribute("aria-pressed", on); fb.querySelector("span").textContent = on ? "En tus favoritos" : "Añadir a favoritos"; } paintFav();

    function render() {
      $("#gal").innerHTML = views.map(function (v, i) { var a = viewArt(v[1]); return '<figure class="gal-p" id="gp' + i + '"><div class="gal-art">' + a.svg + '</div>' + (a.cap ? '<figcaption>' + esc(a.cap) + '</figcaption>' : "") + '</figure>'; }).join("") + (views.length > 1 ? '<span class="gal-count" id="gal-count">1 / ' + views.length + '</span>' : "");
      var u = unit(); $("#price").textContent = FG.eur(u) + (p.monthly ? " / mes" : "");
      $("#mbuy-price").textContent = FG.eur(u * s.qty);
      if (p.colors) { $("#color-name").textContent = FG.colorName(s.color); root.querySelectorAll(".swatch").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.color === s.color); }); }
      if (p.initials) { $("#font-name").textContent = FG.FONTS[s.font].n; root.querySelectorAll("[data-font]").forEach(function (b) { var on = b.dataset.font === s.font; b.setAttribute("aria-checked", on); b.classList.toggle("on", on); }); }
      if (p.initials) {
        $("#tsize-name").textContent = FG.TEXT_SIZES[s.tsize].n; $("#tpos-name").textContent = FG.TEXT_POS[s.tpos].n;
        root.querySelectorAll("[data-tsize]").forEach(function (b) { var on = b.dataset.tsize === s.tsize; b.setAttribute("aria-checked", on); b.classList.toggle("on", on); });
        root.querySelectorAll("[data-tpos]").forEach(function (b) { var on = b.dataset.tpos === s.tpos; b.setAttribute("aria-checked", on); b.classList.toggle("on", on); });
      }
      if (p.variants) root.querySelectorAll("[data-variant]").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.variant === s.variant); b.classList.toggle("on", b.dataset.variant === s.variant); });
      if (isSuit) root.querySelectorAll(".boxes a.box").forEach(function (a) { a.href = a.href.replace(/&color=[^&]*/, "") + (s.color ? "&color=" + s.color : ""); });
    }
    function add() {
      if (needIni && !s.initials) { $("#ini").closest(".field").classList.add("bad"); $("#ini").focus(); return; }
      var l = FG.cart.add({ id: p.id, qty: s.qty, color: s.color, variant: s.variant, initials: s.initials, font: s.font, tsize: s.tsize, tpos: s.tpos });
      if (l) FG.showAdded(l);
    }
    root.addEventListener("click", function (e) {
      var c = e.target.closest("[data-color]"); if (c) { s.color = c.dataset.color; render(); return; }
      var fo = e.target.closest("[data-font]"); if (fo) { s.font = fo.dataset.font; render(); return; }
      var ts = e.target.closest("[data-tsize]"); if (ts) { s.tsize = ts.dataset.tsize; render(); return; }
      var tp = e.target.closest("[data-tpos]"); if (tp) { s.tpos = tp.dataset.tpos; render(); return; }
      var v = e.target.closest("[data-variant]"); if (v) { s.variant = v.dataset.variant; render(); return; }
      if (e.target.closest("#add")) add();
      if (e.target.closest(".fav-line")) setTimeout(paintFav, 0);
    });
    var ini = $("#ini");
    if (ini) ini.addEventListener("input", function () { ini.value = ini.value.replace(/[^A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñÀ-ÿ]/g, "").toUpperCase().slice(0, 3); s.initials = ini.value; ini.closest(".field").classList.remove("bad"); render(); });
    $("#mbuy-btn").addEventListener("click", add);
    $("#mbuy").classList.add("on"); document.body.classList.add("has-mobile-buy");
    // En escritorio la barra de compra aparece cuando el botón principal sale de la pantalla
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { var out = !en[0].isIntersecting; $("#mbuy").classList.toggle("show", out); document.body.classList.toggle("buy-bar-on", out); }, { threshold: 0 }).observe($("#add"));
    else { $("#mbuy").classList.add("show"); document.body.classList.add("buy-bar-on"); }
    render();
    var gal = $("#gal");
    gal.addEventListener("scroll", function () { var n = Math.round(gal.scrollLeft / gal.clientWidth) + 1, el = $("#gal-count"); if (el && gal.scrollWidth > gal.clientWidth + 2) el.textContent = n + " / " + views.length; }, { passive: true });

    if (p.reviews) { $("#reviews").hidden = false; $("#rev-list").innerHTML = FG.REVIEWS.filter(function (r) { return r.p === p.id; }).map(function (r) { return '<article class="rev"><div class="st" aria-label="' + r.r + ' de 5">' + "★★★★★".slice(0, r.r) + '<span class="off">' + "★★★★★".slice(r.r) + '</span></div><h3>' + esc(r.t) + '</h3><p>' + esc(r.x) + '</p><small>' + esc(r.n) + ' · opinión de ejemplo</small></article>'; }).join(""); }
    var rel = FG.upsell(4);
    if (!rel.length) rel = FG.PRODUCTS.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 4);
    if (rel.length) { $("#related").hidden = false; $("#related-grid").innerHTML = rel.map(FG.card).join(""); }
  }

  ({ home: home, catalog: catalog, product: product }[page] || function () {})();
})();
