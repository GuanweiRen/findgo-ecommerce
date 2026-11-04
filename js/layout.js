/* Elementos compartidos: cabecera, menú, buscador, pie, cookies, drawer, toasts, tema. */
(function () {
  var FG = window.FG, esc = FG.esc;

  var ICONS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20c1-4 4-5.5 7.5-5.5s6.5 1.5 7.5 5.5"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>',
    pause: '<path d="M9 6v12M15 6v12"/>',
    play: '<path d="M8 5.5l11 6.5-11 6.5z"/>',
    pin: '<path d="M12 21s-6-5.200-6-10a6 6 0 0 1 12 0c0 4.800-6 10-6 10z"/><circle cx="12" cy="11" r="2.200"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    chevu: '<path d="M6 15l6-6 6 6"/>',
    pencil: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.500" r="1.800"/><circle cx="17" cy="17.500" r="1.800"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/>'
  };
  FG.icon = function (n, cls) {
    return '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>';
  };

  /* ---------- Toasts ---------- */
  FG.toast = function (msg) {
    var box = document.getElementById("toasts"), t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; box.appendChild(t);
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add("in"); }); });
    setTimeout(function () { t.classList.remove("in"); setTimeout(function () { t.remove(); }, 220); }, 3200);
  };

  /* ---------- Diálogos animados ---------- */
  FG.openDialog = function (d) {
    if (!d.open) d.showModal();
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add("is-in"); }); });
  };
  FG.closeDialog = function (d) {
    if (!d.open) return;
    d.classList.remove("is-in");
    var done = false;
    function fin() { if (done) return; done = true; d.close(); }
    d.addEventListener("transitionend", fin, { once: true });
    setTimeout(fin, 260);
  };
  function wireDialog(d) {
    d.addEventListener("click", function (e) { if (e.target === d) FG.closeDialog(d); });
    d.addEventListener("cancel", function (e) { e.preventDefault(); FG.closeDialog(d); });
    d.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) FG.closeDialog(d); });
  }

  /* ---------- Tarjeta de producto ---------- */
  FG.priceText = function (p) {
    if (p.price == null) return "Consultar";
    if (p.monthly) return FG.eur(p.price) + "/mes";
    if (p.variants) return "Desde " + FG.eur(Math.min.apply(null, p.variants.map(function (v) { return v.price; })));
    return FG.eur(p.price);
  };

  FG.lineName = function (p) {
    var n = p.name.replace(/^FindGo\s+/i, "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+\d+\s*cm.*$/i, "").replace(/\s+\d+(\s*Wh)?$/i, "").trim();
    return n.toUpperCase();
  };
  FG.cardDesc = function (p) {
    var d = p.short || "";
    if (p.dims) d += " | " + p.dims + (p.weight ? " | " + p.weight : "");
    return d;
  };
  FG.card = function (p) {
    var href = p.href || "producto.html?id=" + encodeURIComponent(p.id);
    var quick = p.price != null && !p.colors && !p.variants && !p.needsInitials;
    var dots = "";
    if (p.colors) {
      dots = '<span class="dots" aria-label="' + p.colors.length + ' colores">' + p.colors.slice(0, 6).map(function (c) { return '<i style="background:' + FG.COLORS[c].hex + '"></i>'; }).join("") + (p.colors.length > 6 ? '<b>+' + (p.colors.length - 6) + '</b>' : "") + '</span>';
    }
    var fav = FG.favs.has(p.id);
    return '<article class="card" data-id="' + esc(p.id) + '">' +
      '<div class="card-art">' + (p.tag ? '<span class="badge">' + esc(p.tag) + '</span>' : "") + FG.productArt(p) + dots + '</div>' +
      '<button class="fav-btn' + (fav ? " on" : "") + '" data-fav="' + esc(p.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? "Quitar de favoritos: " : "Añadir a favoritos: ") + esc(p.name) + '">' + FG.icon("heart") + '</button>' +
      '<div class="card-body"><h3 class="card-title"><a class="card-link" href="' + esc(href) + '">' + esc(FG.lineName(p)) + '</a></h3>' +
      '<p class="card-desc">' + esc(FG.cardDesc(p)) + '</p>' +
      (p.rating ? '<div class="rate"><span class="st" aria-hidden="true">★★★★★</span><span>' + String(p.rating).replace(".", ",") + ' (' + p.reviews + ')</span></div>' : "") +
      '<div class="card-foot"><span class="price">' + FG.priceText(p) + (p.was ? ' <s>' + FG.eur(p.was) + '</s>' : "") + '</span>' +
      (quick ? '<button class="btn btn-sm" data-quick="' + esc(p.id) + '">Añadir</button>' : "") + '</div></div></article>';
  };

  /* ---------- Drawer "añadido al carrito" ---------- */
  FG.progress = function (t) {
    var net = t.sub - t.discount, pct = Math.min(100, Math.round((net / FG.FREE_FROM) * 100)), missing = Math.max(0, FG.FREE_FROM - net);
    return '<div class="ship-prog"><p class="ship-msg">' + (missing > 0 ? 'Te faltan <strong>' + FG.eur(missing) + '</strong> para el <strong>envío gratis</strong>' : '<strong>Tienes envío estándar gratis</strong>') + '</p><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="width:' + pct + '%"></i></div></div>';
  };
  FG.upsell = function (limit) {
    var inCart = FG.cart.get().map(function (l) { return l.id; });
    var ids = ["bateria", "candado", "p-etiqueta", "tag", "cargador", "bascula"].filter(function (id) { return inCart.indexOf(id) < 0 && FG.product(id) && !FG.product(id).needsInitials && !FG.product(id).colors && !FG.product(id).variants; });
    return ids.slice(0, limit || 2).map(FG.product);
  };
  FG.showAdded = function (line) {
    var x = FG.lines([line])[0], d = document.getElementById("drawer"), cart = FG.lines(), t = FG.totals(cart, { code: FG.checkout.get().code });
    var opts = [];
    if (line.color) opts.push(FG.colorName(line.color));
    if (line.variant) opts.push(line.variant);
    if (line.initials) opts.push("Iniciales: " + esc(line.initials) + (line.font && line.font !== "clasica" && FG.FONTS[line.font] ? " (" + esc(FG.FONTS[line.font].n) + ")" : ""));
    var up = FG.upsell(2);
    d.querySelector(".drawer-inner").innerHTML =
      '<div class="drawer-head"><h2 class="drawer-title"><span class="ok-dot">' + FG.icon("check") + '</span> Añadido al carrito</h2><button class="icon-btn" data-close aria-label="Cerrar">' + FG.icon("close") + '</button></div>' +
      '<div class="added-item"><div class="thumb">' + FG.productArt(x.p, line.color, line.initials, line.font) + '</div><div><strong>' + esc(x.p.name) + '</strong><div class="muted small">' + (opts.join(" · ") || "&nbsp;") + '</div><div class="small"><strong>' + x.line.qty + ' × ' + FG.eur(x.unit) + '</strong></div></div></div>' +
      FG.progress(t) +
      (up.length ? '<div class="upsell"><h3>Completa tu viaje</h3>' + up.map(function (p) { return '<div class="up-row"><span class="thumb">' + FG.productArt(p) + '</span><span><strong>' + esc(p.name) + '</strong><span class="muted small">' + FG.eur(p.price) + '</span></span><button class="btn btn-sm" data-quick="' + esc(p.id) + '">Añadir</button></div>'; }).join("") + '</div>' : "") +
      '<div class="drawer-actions"><a class="btn btn-primary btn-lg" href="carrito.html">Ver carrito y pagar (' + FG.cart.count() + ')</a><button class="btn btn-ghost" data-close>Seguir comprando</button></div>';
    FG.openDialog(d);
  };

  /* ---------- Cabecera ---------- */
  function headerHTML() {
    var navD = FG.MENU.map(function (m) {
      var c = FG.CATS[m.cat];
      return '<li class="nav-item"><a class="nav-top" href="catalogo.html?cat=' + m.cat + '" data-cat="' + m.cat + '">' + c.name + '</a><div class="mega"><div class="mega-in container">' +
        m.cols.map(function (col) { return '<div><h4>' + col.t + '</h4><ul>' + col.links.map(function (l) { return '<li><a href="' + l[1] + '">' + l[0] + '</a></li>'; }).join("") + '</ul></div>'; }).join("") +
        (function () { var f = FG.product(m.feat); return f ? '<a class="mega-feat" href="' + (f.href || "producto.html?id=" + f.id) + '"><div class="fa">' + FG.productArt(f) + '</div><span>' + esc(FG.lineName(f)) + '</span></a>' : ""; })() + '</div></div></li>';
    }).join("");
    var navM = FG.MENU.map(function (m) {
      return '<details><summary>' + FG.CATS[m.cat].name + '</summary>' + m.cols.map(function (col) { return '<p class="mn-t">' + col.t + '</p>' + col.links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + '</a>'; }).join(""); }).join("") + '</details>';
    }).join("");
    return '<a class="skip" href="#main">Saltar al contenido</a>' +
      (FG.read("annClosed", false) ? "" : '<div class="announce"><div class="ann-in"><span class="ann-l"></span><p class="ann-t">Únete al club y consigue un 10 % de descuento. <a href="index.html#club">HAZ CLIC AQUÍ</a></p>' +
      '<div class="ann-r"><a class="ann-ship" href="devoluciones.html">' + FG.icon("pin") + '<span>Envío a España</span></a><div class="lang"><button class="lang-btn" id="lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="Idioma: español"><span>ES</span>' + FG.icon("chev") + '</button><div class="lang-pop" id="lang-pop" hidden><button class="on" disabled>Español</button><button disabled>English <small>próximamente</small></button></div></div></div><button class="ann-x" id="ann-x" aria-label="Cerrar el aviso">' + FG.icon("close") + '</button></div></div>') +
      '<header class="site-header"><div class="hbar">' +
      '<div class="h-left"><button class="icon-btn burger" id="burger" aria-label="Abrir menú" aria-expanded="false">' + FG.icon("menu") + '</button></div>' +
      '<a class="logo" href="index.html" aria-label="FindGo, inicio"><img src="img/logo.png" alt="FindGo" width="90" height="40"></a>' +
      '<nav class="main-nav" aria-label="Principal"><ul>' + navD + '</ul></nav>' +
      '<div class="h-right"><button class="h-search" id="search-btn" data-search aria-label="Buscar"><span>Buscar</span>' + FG.icon("search") + '</button>' +
      '<button class="icon-btn m-search" data-search aria-label="Buscar">' + FG.icon("search") + '</button>' +
      '<a class="icon-btn hide-xs" href="cuenta.html" aria-label="Mi cuenta">' + FG.icon("user") + '</a>' +
      '<a class="icon-btn has-badge hide-xs" href="cuenta.html#favoritos" aria-label="Favoritos">' + FG.icon("heart") + '<span class="count" id="fav-count" hidden></span></a>' +
      '<a class="icon-btn has-badge" href="carrito.html" aria-label="Carrito">' + FG.icon("bag") + '<span class="count" id="cart-count"></span></a></div></div></header>' +
      '<div class="mnav-wrap" id="mnav-wrap" hidden><div class="mnav-back" data-mclose></div><aside class="mnav" aria-label="Menú"><div class="mnav-head"><span class="logo-text">Menú</span><button class="icon-btn" data-mclose aria-label="Cerrar menú">' + FG.icon("close") + '</button></div>' + navM +
      '<div class="mn-links"><a href="cuenta.html">Mi cuenta</a><a href="cuenta.html#favoritos">Favoritos</a><a href="devoluciones.html">Devoluciones y garantía</a><a href="empresas.html">Empresas</a></div></aside></div>' +
      '<dialog class="search-dlg" id="search-dlg" aria-label="Buscar"><form class="search-form" role="search"><span class="s-ico">' + FG.icon("search") + '</span><input id="search-in" type="search" placeholder="Busca maletas, accesorios…" autocomplete="off" enterkeyhint="search" aria-label="Buscar productos"><button type="button" class="icon-btn" data-close aria-label="Cerrar">' + FG.icon("close") + '</button></form><div class="search-sugg" id="search-sugg"><span>Populares:</span>' + ["Cabin", "Batería", "Candado TSA", "Funda", "Mochila"].map(function (t) { return '<button type="button" data-sugg="' + t + '">' + t + '</button>'; }).join("") + '</div><ul class="search-res" id="search-res"></ul></dialog>' +
      '<dialog class="drawer" id="drawer" aria-label="Carrito"><div class="drawer-inner"></div></dialog><div id="toasts" aria-live="polite"></div>';
  }

  function footerHTML() {
    return '<section class="trust-row"><div class="container trust-in">' +
      '<div class="trust-it"><span class="ic">' + FG.icon("truck") + '</span><div><h4>Envío gratuito</h4><p>Envío estándar gratis desde 99 €, en 3 a 5 días laborables.</p></div></div>' +
      '<div class="trust-it"><span class="ic">' + FG.icon("close").replace('<path d="M6 6l12 12M18 6L6 18"/>', '<path d="M4 8h11a5 5 0 0 1 0 10H8"/><path d="M8 4L4 8l4 4"/>') + '</span><div><h4>Devoluciones gratuitas</h4><p>30 días para devolver, con recogida gratis en tu casa.</p></div></div>' +
      '<div class="trust-it"><span class="ic">' + FG.icon("check") + '</span><div><h4>Pago seguro</h4><p>Pago de prueba: no se cobra nada.</p></div></div>' +
      '<div class="trust-it"><span class="ic">' + FG.icon("check").replace('<path d="M5 12.5l4.5 4.5L19 7.5"/>', '<path d="M12 3l7 3v5c0 4.500-3 8-7 10-4-2-7-5.500-7-10V6z"/><path d="M9 12l2 2 4-4"/>') + '</span><div><h4>Garantía de 3 años</h4><p>Cubre la batería de movimiento y el sistema Follow Me.</p></div></div>' +
      '</div></section>' +
      '<footer class="site-footer"><div class="container foot-grid">' +
      '<div><h4>Comprar</h4><ul>' + Object.keys(FG.CATS).map(function (k) { return '<li><a href="catalogo.html?cat=' + k + '">' + FG.CATS[k].name + '</a></li>'; }).join("") + '</ul></div>' +
      '<div><h4>Asistencia</h4><ul><li><a href="cuenta.html">Mi cuenta</a></li><li><a href="devoluciones.html">Devoluciones y garantía</a></li><li><a href="index.html#faq">Preguntas frecuentes</a></li><li><a href="empresas.html">Empresas</a></li></ul></div>' +
      '<div><h4>La empresa</h4><ul><li><a href="sobre-nosotros.html">Sobre nosotros</a></li><li><a href="index.html#baterias">Cómo funcionan las baterías</a></li><li><a href="index.html#club">Club FindGo</a></li></ul></div>' +
      '<div><h4>Legal</h4><ul><li><a href="privacidad.html">Política de privacidad</a></li><li><a href="cookies.html">Política de cookies</a></li><li><a href="terminos.html">Términos y condiciones</a></li></ul></div>' +
      '</div><div class="container foot-mid"><a class="logo" href="index.html">FindGo</a><div class="social">' + ["Facebook", "Instagram", "YouTube", "TikTok", "Pinterest"].map(function (s) { return '<a href="#" data-fake aria-label="' + s + '">' + s + '</a>'; }).join("") + '</div></div>' +
      '<div class="container foot-bottom"><span>© 2026 FindGo. Precios con IVA incluido.</span><span>Tarjeta de prueba: 4242 4242 4242 4242</span></div></footer>' +
      '<div class="cookie" id="cookie" role="dialog" aria-label="Cookies" hidden><p><strong>Cookies.</strong> Usamos cookies técnicas y, si lo aceptas, de analítica para mejorar la tienda. <a href="cookies.html">Más información</a></p><div class="cookie-actions"><button class="btn btn-ghost btn-sm" data-ck="necessary">Solo necesarias</button><button class="btn btn-primary btn-sm" data-ck="all">Aceptar todas</button></div></div>' +
      '<a class="club-tab" href="index.html#club" aria-label="Únete al club">' + FG.icon("heart").replace(/<path[^>]*\/>/, '<rect x="3" y="5" width="18" height="14"/><path d="M3 7l9 7 9-7"/>') + '</a>';
  }

  function updateBadges() {
    var c = FG.cart.count(), f = FG.favs.get().length, cc = document.getElementById("cart-count"), fc = document.getElementById("fav-count");
    if (cc) { cc.hidden = false; cc.textContent = c > 99 ? "99+" : c; }
    if (fc) { fc.hidden = !f; fc.textContent = f > 99 ? "99+" : f; }
  }

  function init() {
    var hdr = document.createElement("div"); hdr.id = "site-top"; hdr.innerHTML = headerHTML();
    document.body.insertBefore(hdr, document.body.firstChild);
    var ft = document.createElement("div"); ft.innerHTML = footerHTML(); document.body.appendChild(ft);
    var main = document.querySelector("main"); if (main) main.id = "main";

    ["search-dlg", "drawer"].forEach(function (id) { wireDialog(document.getElementById(id)); });

    // Navegación actual
    var q = new URLSearchParams(location.search), cat = q.get("cat");
    if (!cat && q.get("id")) { var pp = FG.product(q.get("id")); if (pp) cat = pp.cat; }
    if (cat) { var a = document.querySelector('.nav-top[data-cat="' + cat + '"]'); if (a) a.setAttribute("aria-current", "page"); }

    // Menú móvil
    var wrap = document.getElementById("mnav-wrap"), burger = document.getElementById("burger");
    function mopen(v) {
      if (v) { wrap.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { wrap.classList.add("is-in"); }); }); }
      else { wrap.classList.remove("is-in"); setTimeout(function () { wrap.hidden = true; }, 240); }
      burger.setAttribute("aria-expanded", v); document.body.classList.toggle("no-scroll", v);
    }
    burger.addEventListener("click", function () { mopen(true); });
    wrap.addEventListener("click", function (e) { if (e.target.closest("[data-mclose]") || e.target.closest("a")) mopen(false); });

    // Idioma
    var lb = document.getElementById("lang-btn"), lp = document.getElementById("lang-pop");
    if (lb) {
      lb.addEventListener("click", function (e) { e.stopPropagation(); lp.hidden = !lp.hidden; lb.setAttribute("aria-expanded", !lp.hidden); });
      document.addEventListener("click", function () { lp.hidden = true; lb.setAttribute("aria-expanded", "false"); });
    }

    // Cerrar la barra azul (se recuerda en las demás páginas)
    var ax = document.getElementById("ann-x");
    if (ax) ax.addEventListener("click", function () { FG.write("annClosed", true); ax.closest(".announce").remove(); });

    // Buscador
    var sd = document.getElementById("search-dlg"), si = document.getElementById("search-in"), sr = document.getElementById("search-res");
    function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
    function doSearch() {
      var t = norm(si.value.trim()); if (!t) { sr.innerHTML = '<li class="muted s-empty">Escribe para buscar en el catálogo.</li>'; return; }
      var hits = FG.PRODUCTS.filter(function (p) { return norm(p.name + " " + p.short + " " + FG.CATS[p.cat].name).indexOf(t) > -1; }).slice(0, 8);
      sr.innerHTML = hits.length ? hits.map(function (p) { return '<li><a href="' + (p.href || "producto.html?id=" + p.id) + '"><span class="thumb">' + FG.productArt(p) + '</span><span><strong>' + esc(p.name) + '</strong><small class="muted"> ' + esc(FG.CATS[p.cat].name) + '</small></span><span class="mono">' + FG.priceText(p) + '</span></a></li>'; }).join("") : '<li class="muted s-empty">Sin resultados para «' + esc(si.value.trim()) + '».</li>';
    }
    document.querySelectorAll("[data-search]").forEach(function (b) { b.addEventListener("click", function () { FG.openDialog(sd); si.focus(); doSearch(); }); });
    document.getElementById("search-sugg").addEventListener("click", function (e) { var b = e.target.closest("[data-sugg]"); if (b) { si.value = b.dataset.sugg; doSearch(); si.focus(); } });
    si.addEventListener("input", doSearch);
    sd.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); if (si.value.trim()) location.href = "catalogo.html?q=" + encodeURIComponent(si.value.trim()); });

    // Delegación: favoritos, añadir rápido, redes
    document.addEventListener("click", function (e) {
      var f = e.target.closest("[data-fav]");
      if (f) { var on = FG.favs.toggle(f.dataset.fav); document.querySelectorAll('[data-fav="' + f.dataset.fav + '"]').forEach(function (b) { b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); }); FG.toast(on ? "Añadido a favoritos" : "Quitado de favoritos"); return; }
      var qk = e.target.closest("[data-quick]");
      if (qk) { var l = FG.cart.add({ id: qk.dataset.quick }); if (l) FG.showAdded(l); return; }
      if (e.target.closest("[data-fake]")) { e.preventDefault(); FG.toast("Enlace no disponible"); }
    });

    // Cookies
    var ck = document.getElementById("cookie");
    if (!FG.read("cookies", null)) { ck.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { ck.classList.add("is-in"); }); }); }
    ck.addEventListener("click", function (e) {
      var b = e.target.closest("[data-ck]"); if (!b) return;
      FG.write("cookies", b.dataset.ck); ck.classList.remove("is-in"); setTimeout(function () { ck.hidden = true; }, 240);
    });

    updateBadges();
    document.addEventListener("fg:change", updateBadges);
    window.addEventListener("storage", updateBadges);
    document.dispatchEvent(new Event("fg:ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
