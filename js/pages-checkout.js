/* Carrito, finalizar compra (una sola página) y confirmación. */
(function () {
  var FG = window.FG, esc = FG.esc, page = document.body.dataset.page, $ = function (s) { return document.querySelector(s); };

  function lineMeta(l) {
    var o = [];
    if (l.color) o.push(FG.colorName(l.color));
    if (l.variant) o.push("Talla " + l.variant);
    if (l.initials) o.push("Iniciales: " + l.initials);
    return o.join(" · ");
  }

  /* Resumen: totales, envío y progreso hacia el envío gratis */
  function summaryHTML(compact) {
    var co = FG.checkout.get(), lines = FG.lines(), t = FG.totals(lines, { code: co.code, shipping: co.shipping });
    var h = '<h2>Resumen del pedido</h2>';
    if (compact) h += lines.map(function (x) { return '<div class="sum-item"><span>' + x.line.qty + ' × ' + esc(x.p.name) + '</span><span>' + FG.eur(x.total) + '</span></div>'; }).join("") + '<hr style="border:0;border-top:1px solid var(--line);margin:12px 0">';
    h += '<div class="sum-row"><span>Subtotal</span><span>' + FG.eur(t.sub) + '</span></div>';
    if (t.discount) h += '<div class="sum-row disc"><span>CLUB10 (−10 %)</span><span>−' + FG.eur(t.discount) + '</span></div>';
    h += '<div class="sum-row"><span>Envío ' + (co.shipping === "express" ? "express" : "estándar") + '</span><span>' + (t.ship ? FG.eur(t.ship) : "Gratis") + '</span></div>' +
      '<div class="sum-row total"><span>Total</span><span>' + FG.eur(t.total) + '</span></div><p class="muted small" style="margin:8px 0 0">IVA incluido. Prototipo: no se cobra nada.</p>';
    return { html: h, t: t };
  }
  function renderSummary(compact) { var r = summaryHTML(compact); $("#summary").innerHTML = r.html; var m = $("#mpay-total"); if (m) m.textContent = FG.eur(r.t.total); return r.t; }

  /* ================= CARRITO ================= */
  function cart() {
    function draw() {
      var lines = FG.lines(), box = $("#lines");
      if (!lines.length) {
        $("#co").innerHTML = '<div class="empty" style="grid-column:1/-1"><h2>Tu carrito está vacío</h2><p>Añade una maleta y empieza a viajar.</p><a class="btn btn-primary btn-lg" href="catalogo.html?cat=maletas">Ver maletas</a></div>'; return;
      }
      var co = FG.checkout.get(), t0 = FG.totals(lines, { code: co.code, shipping: "standard" });
      box.innerHTML = FG.progress(t0) + lines.map(function (x) {
        var l = x.line;
        return '<div class="cart-line" data-key="' + esc(l.key) + '"><div class="thumb">' + FG.productArt(x.p, l.color, l.initials) + '</div><div><h3><a href="producto.html?id=' + esc(x.p.id) + '" style="color:inherit;text-decoration:none">' + esc(x.p.name) + '</a></h3><div class="muted small">' + esc(lineMeta(l)) + (x.p.monthly ? "Suscripción mensual" : "") + '</div><div class="muted small">' + FG.eur(x.unit) + (x.p.monthly ? "/mes" : " / ud.") + '</div>' +
          '<div class="cl-tools">' + (x.p.single ? "" : '<div class="qty" role="group" aria-label="Cantidad"><button data-dec aria-label="Menos">' + FG.icon("minus") + '</button><output>' + l.qty + '</output><button data-inc aria-label="Más">' + FG.icon("plus") + '</button></div>') + '<button class="linkish" data-del>Eliminar</button></div>' +
          (x.p.nonReturnable || l.initials ? '<div class="muted small" style="margin-top:4px">Personalizado: sin devolución salvo defecto.</div>' : "") + '</div><div class="cl-price">' + FG.eur(x.total) + '</div></div>';
      }).join("");
      var up = FG.upsell(3);
      $("#cross").innerHTML = up.length ? '<div class="cross"><h2>Completa tu viaje</h2><div class="cross-grid">' + up.map(function (p) { return '<div class="cross-it"><span class="thumb">' + FG.productArt(p) + '</span><span><strong>' + esc(p.name) + '</strong><span class="muted small">' + FG.eur(p.price) + '</span></span><button class="btn btn-sm" data-add="' + esc(p.id) + '">Añadir</button></div>'; }).join("") + '</div></div>' : "";
      var t = renderSummary(false), s = $("#summary");
      s.insertAdjacentHTML("beforeend",
        '<button class="promo-toggle" id="promo-toggle" aria-expanded="' + (co.code ? "true" : "false") + '">¿Tienes un código de descuento?</button>' +
        '<div id="promo-box"' + (co.code ? "" : " hidden") + '><form class="promo" id="promo" novalidate><input id="code" placeholder="Código" aria-label="Código de descuento" value="' + esc(co.code) + '" autocapitalize="characters" autocomplete="off" maxlength="20"><button class="btn btn-sm" type="submit">Aplicar</button></form><p class="promo-msg ' + (co.code === "CLUB10" ? "ok" : "") + '" id="pmsg">' + (co.code === "CLUB10" ? "CLUB10 aplicado: −10 % en productos." : "Pista: CLUB10 con la suscripción al club.") + '</p></div>' +
        '<a class="btn btn-primary btn-lg btn-block" href="checkout.html" style="margin-top:8px">Finalizar compra</a><a class="btn btn-ghost btn-block" style="margin-top:10px" href="catalogo.html">Seguir comprando</a>' +
        '<ul class="assure"><li>' + FG.icon("check") + 'Sin crear cuenta: compra como invitado</li><li>' + FG.icon("check") + '30 días para devolver, recogida gratis</li><li>' + FG.icon("check") + 'Garantía de 3 años</li></ul>');
      $("#promo-toggle").addEventListener("click", function () { var b = $("#promo-box"); b.hidden = !b.hidden; this.setAttribute("aria-expanded", !b.hidden); if (!b.hidden) $("#code").focus(); });
      $("#promo").addEventListener("submit", function (e) {
        e.preventDefault(); var v = $("#code").value.trim().toUpperCase();
        if (!v) { FG.checkout.set({ code: "" }); draw(); return; }
        if (v === "CLUB10") { FG.checkout.set({ code: v }); draw(); FG.toast("Código CLUB10 aplicado"); }
        else { var m = $("#pmsg"); m.className = "promo-msg no"; m.textContent = "Código no válido."; }
      });
    }
    $("#co").addEventListener("click", function (e) {
      var add = e.target.closest("[data-add]"); if (add) { FG.cart.add({ id: add.dataset.add }); FG.toast("Añadido al carrito"); draw(); return; }
      var row = e.target.closest(".cart-line"); if (!row) return; var key = row.dataset.key, l = FG.cart.get().filter(function (x) { return x.key === key; })[0];
      if (e.target.closest("[data-inc]")) FG.cart.setQty(key, l.qty + 1);
      else if (e.target.closest("[data-dec]")) FG.cart.setQty(key, l.qty - 1);
      else if (e.target.closest("[data-del]")) FG.cart.remove(key);
      else return;
      draw();
    });
    draw();
  }

  function mark(el, ok) { el.closest(".field").classList.toggle("bad", !ok); return ok; }

  /* ================= FINALIZAR COMPRA (una página) ================= */
  function checkout() {
    if (!FG.lines().length) { location.replace("carrito.html"); return; }
    var co = FG.checkout.get(), d = co.data || {}, f = $("#form");
    ["name", "last", "email", "tel", "addr", "cp", "city"].forEach(function (k) { if (d[k]) f.elements[k].value = d[k]; });
    function opts() {
      var cur = FG.checkout.get().shipping, t = FG.totals(FG.lines(), { code: FG.checkout.get().code }), free = (t.sub - t.discount) >= FG.FREE_FROM;
      function fmt(n) { return new Date(Date.now() + 0).toLocaleDateString("es-ES"); }
      $("#ship-opts").innerHTML =
        '<label class="opt"><input type="radio" name="ship" value="standard"' + (cur !== "express" ? " checked" : "") + '><span class="grow"><strong>Envío estándar</strong><br><span class="muted small">Llega entre ' + FG.deliveryText() + '</span></span><strong>' + (free ? "Gratis" : "4,95 €") + '</strong></label>' +
        '<label class="opt"><input type="radio" name="ship" value="express"' + (cur === "express" ? " checked" : "") + '><span class="grow"><strong>Envío express</strong><br><span class="muted small">24 a 48 horas laborables</span></span><strong>9,95 €</strong></label>';
    }
    opts(); renderSummary(true); document.body.classList.add("has-mobile-pay");
    $("#ship-opts").addEventListener("change", function (e) { FG.checkout.set({ shipping: e.target.value }); renderSummary(true); });

    var num = $("#c-num"), exp = $("#c-exp"), cvc = $("#c-cvc");
    num.addEventListener("input", function () { var v = num.value.replace(/\D/g, "").slice(0, 16); num.value = v.replace(/(.{4})/g, "$1 ").trim(); });
    exp.addEventListener("input", function () { var v = exp.value.replace(/\D/g, "").slice(0, 4); exp.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v; });
    cvc.addEventListener("input", function () { cvc.value = cvc.value.replace(/\D/g, "").slice(0, 3); });
    f.addEventListener("input", function (e) { if (e.target.name === "cp") e.target.value = e.target.value.replace(/\D/g, "").slice(0, 5); if (e.target.closest(".field.bad")) e.target.closest(".field").classList.remove("bad"); });

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (n) { return f.elements[n].value.trim(); };
      var name = $("#c-name"), digits = num.value.replace(/\s/g, "");
      var m = /^(\d{2})\/(\d{2})$/.exec(exp.value), now = new Date(), okE = false;
      if (m) { var mm = +m[1], yy = 2000 + +m[2]; okE = mm >= 1 && mm <= 12 && (yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1)); }
      $("#c-num-err").textContent = digits.length < 16 ? "Introduce los 16 dígitos de la tarjeta de prueba." : "Solo se admite la tarjeta de prueba 4242 4242 4242 4242.";
      var checks = [
        mark(f.elements.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))),
        mark(f.elements.tel, v("tel").replace(/[\s.\-+()]/g, "").replace(/^34/, "").length >= 9 && /^[\d\s.\-+()]+$/.test(v("tel"))),
        mark(f.elements.name, v("name").length > 0), mark(f.elements.last, v("last").length > 0), mark(f.elements.addr, v("addr").length > 4),
        mark(f.elements.cp, /^\d{5}$/.test(v("cp"))), mark(f.elements.city, v("city").length > 0),
        mark(name, name.value.trim().length > 1), mark(num, digits === "4242424242424242"), mark(exp, okE), mark(cvc, /^\d{3}$/.test(cvc.value))
      ];
      if (checks.indexOf(false) > -1) { var bad = f.querySelector(".field.bad input"); if (bad) { bad.focus(); bad.scrollIntoView({ block: "center", behavior: "smooth" }); } return; }
      if (!$("#c-terms").checked) { FG.toast("Acepta los términos para completar el pedido"); $("#c-terms").focus(); return; }
      var data = {}; ["name", "last", "email", "tel", "addr", "cp", "city"].forEach(function (k) { data[k] = v(k); });
      FG.checkout.set({ data: data, shipping: f.elements.ship.value });
      var btn = $("#pay"), mb = document.querySelector("#mpay .btn"); btn.disabled = true; btn.textContent = "Procesando…"; if (mb) mb.disabled = true;
      setTimeout(function () {
        var lines = FG.lines(), co2 = FG.checkout.get(), t = FG.totals(lines, { code: co2.code, shipping: co2.shipping });
        var order = {
          id: FG.orders.nextId(), date: new Date().toISOString(), status: "Confirmado", shipping: co2.shipping, code: t.club ? "CLUB10" : "", totals: t, address: co2.data, last4: "4242", returns: [],
          lines: lines.map(function (x) { return { id: x.p.id, name: x.p.name, qty: x.line.qty, unit: x.unit, color: x.line.color, variant: x.line.variant, initials: x.line.initials, nonReturnable: !!(x.p.nonReturnable || x.line.initials), monthly: !!x.p.monthly }; })
        };
        FG.orders.add(order);
        if (order.lines.some(function (l) { return l.id === "premium"; })) FG.subs.set(true);
        if (!FG.session.get()) FG.session.login(co2.data.name + " " + co2.data.last, co2.data.email);
        FG.cart.clear(); FG.checkout.set({ code: "" });
        location.href = "confirmacion.html?o=" + encodeURIComponent(order.id);
      }, 1100);
    });
  }

  /* ================= CONFIRMACIÓN ================= */
  function confirm() {
    var id = new URLSearchParams(location.search).get("o"), orders = FG.orders.get(), o = orders.filter(function (x) { return x.id === id; })[0] || (id ? null : orders[0]);
    if (!o) { $("#confirm").innerHTML = '<div class="empty"><h2>No encontramos ese pedido</h2><a class="btn" href="cuenta.html">Ir a Mi cuenta</a></div>'; return; }
    var a = o.address;
    $("#confirm").innerHTML = '<div class="confirm"><div class="big-ok">' + FG.icon("check") + '</div><h1 style="font-size:2.2rem">Gracias, ' + esc(a.name) + '</h1><p class="muted">Tu pedido simulado está confirmado. Hemos enviado un correo de ejemplo a <strong>' + esc(a.email) + '</strong>.</p><div class="order-no" aria-label="Número de pedido">' + esc(o.id) + '</div>' +
      '<div class="panel"><h2 style="font-size:1.2rem">Resumen del pedido</h2>' + FG.orderSummary(o) + '</div>' +
      '<div class="panel"><h2 style="font-size:1.2rem">Entrega</h2><p style="margin:0">' + esc(a.name + " " + a.last) + '<br>' + esc(a.addr) + '<br>' + esc(a.cp + " " + a.city) + '<br><span class="muted">' + (o.shipping === "express" ? "Express: 24 a 48 horas" : "Estándar: 3 a 5 días laborables") + ' · Tarjeta de prueba •••• ' + o.last4 + '</span></p></div>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:26px"><a class="btn btn-primary" href="cuenta.html">Ver en Mi cuenta</a><a class="btn btn-ghost" href="index.html">Volver al inicio</a></div></div>';
  }

  ({ cart: cart, checkout: checkout, confirm: confirm }[page] || function () {})();
})();
