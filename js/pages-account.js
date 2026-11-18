/* Mi cuenta, devoluciones, privacidad, cookies y formularios de empresas. */
(function () {
  var FG = window.FG, esc = FG.esc, page = document.body.dataset.page, $ = function (s) { return document.querySelector(s); };
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
  function mark(el, ok) { el.closest(".field").classList.toggle("bad", !ok); return ok; }
  function dateEs(iso) { return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }); }
  function daysSince(iso) { return Math.floor((Date.now() - new Date(iso).getTime()) / 864e5); }

  /* ================= CUENTA ================= */
  function account() {
    var root = $("#acc"), tab = (location.hash || "#pedidos").slice(1);
    function login() {
      var reg = location.hash === "#registro";
      var head = '<div class="acc-switch" role="tablist" aria-label="Entrar o registrarse"><button role="tab" aria-selected="' + !reg + '" data-mode="entrar">Iniciar sesión</button><button role="tab" aria-selected="' + reg + '" data-mode="registro">Registrarse</button></div>';
      var form = reg ?
        '<h2>Crea tu cuenta</h2><p class="muted">Tarda menos de un minuto y no necesitas contraseña.</p><form id="rgf" novalidate><div class="row2"><div class="field"><label for="r-n">Nombre</label><input id="r-n" autocomplete="given-name" maxlength="60" required><span class="err">Escribe tu nombre.</span></div><div class="field"><label for="r-l">Apellidos</label><input id="r-l" autocomplete="family-name" maxlength="80"><span class="err">Revisa este dato.</span></div></div>' +
          '<div class="field"><label for="r-m">Correo electrónico</label><input id="r-m" type="email" inputmode="email" autocapitalize="none" autocomplete="email" maxlength="120" required><span class="err" id="r-m-err">Introduce un correo válido.</span></div>' +
          '<div class="field"><label for="r-t">Teléfono <span class="muted small">(opcional)</span></label><input id="r-t" type="tel" autocomplete="tel" maxlength="20"><span class="err">Revisa el teléfono.</span></div>' +
          '<div class="field"><label class="check"><input type="checkbox" id="r-ok"><span>Acepto los <a href="terminos.html">términos y condiciones</a> y la <a href="privacidad.html">política de privacidad</a>.</span></label><span class="err">Tienes que aceptarlos para crear la cuenta.</span></div>' +
          '<button class="btn btn-primary btn-block" type="submit">Crear mi cuenta</button></form><p class="small acc-alt">¿Ya tienes cuenta? <a href="#entrar">Inicia sesión</a></p>'
        :
        '<h2>Inicia sesión</h2><p class="muted">Escribe el correo con el que te registraste.</p><form id="lf" novalidate><div class="field"><label for="l-m">Correo electrónico</label><input id="l-m" type="email" inputmode="email" autocapitalize="none" autocomplete="email" maxlength="120" required><span class="err" id="l-m-err">Introduce un correo válido.</span></div><button class="btn btn-primary btn-block" type="submit">Entrar</button></form><p class="small acc-alt">¿Aún no tienes cuenta? <a href="#registro">Regístrate gratis</a></p>';
      root.innerHTML = '<div class="acc-login"><div class="acc-login-art"><div class="acc-login-ill">' + FG.art("suitcase", "coral", { scale: .8, initials: "HOLA" }) + '</div><h2>¡Bienvenido a bordo!</h2><p>Desde tu cuenta sigues tus pedidos, guardas tus favoritos y pagas más rápido la próxima vez.</p></div>' +
        '<div class="acc-login-form">' + head + form + '</div></div>';
      var lf = $("#lf"), rgf = $("#rgf");
      if (lf) lf.addEventListener("submit", function (e) {
        e.preventDefault(); var m = $("#l-m"), mail = m.value.trim(), err = $("#l-m-err");
        err.textContent = "Introduce un correo válido.";
        if (!mark(m, emailOk(mail))) return m.focus();
        var acc = FG.accounts.find(mail);
        if (!acc) { err.innerHTML = 'No hay ninguna cuenta con este correo. <a href="#registro">¿Quieres registrarte?</a>'; FG.write("regMail", mail); mark(m, false); return m.focus(); }
        FG.session.login((acc.name + " " + (acc.last || "")).trim(), acc.email); history.replaceState(null, "", "#pedidos"); tab = "pedidos"; location.reload();
      });
      if (rgf) {
        var pre = FG.read("regMail", ""); if (pre) { $("#r-m").value = pre; FG.write("regMail", ""); }
        rgf.addEventListener("submit", function (e) {
          e.preventDefault();
          var n = $("#r-n"), l = $("#r-l"), m = $("#r-m"), t = $("#r-t"), ok = $("#r-ok"), mail = m.value.trim(), tel = t.value.trim(), err = $("#r-m-err");
          err.textContent = "Introduce un correo válido.";
          var good = [mark(n, n.value.trim().length > 0), mark(m, emailOk(mail)), mark(t, !tel || tel.replace(/[\s.\-+()]/g, "").replace(/^34/, "").length >= 9), mark(ok, ok.checked)];
          if (good.indexOf(false) < 0 && FG.accounts.find(mail)) { err.innerHTML = 'Ya hay una cuenta con este correo. <a href="#entrar">Inicia sesión</a>'; good.push(mark(m, false)); }
          if (good.indexOf(false) > -1) { var bad = rgf.querySelector(".field.bad input"); if (bad) bad.focus(); return; }
          var acc = FG.accounts.add({ name: n.value.trim(), last: l.value.trim(), email: mail, tel: tel });
          FG.profile.set(Object.assign({}, FG.profile.get(), { name: acc.name, last: acc.last, email: acc.email, tel: tel }));
          FG.session.login((acc.name + " " + acc.last).trim(), acc.email); history.replaceState(null, "", "#pedidos"); location.reload();
        });
      }
    }
    function orderHTML(o) {
      var ret = (o.returns || []).length;
      return '<article class="order"><div class="order-top"><strong class="mono">' + esc(o.id) + '</strong><span class="muted small">' + dateEs(o.date) + '</span><span class="status' + (ret ? " ret" : "") + '">' + (ret ? "Devolución solicitada" : esc(o.status)) + '</span><strong class="mono">' + FG.eur(o.totals.total) + '</strong></div>' +
        '<div style="margin-top:10px">' + FG.orderSummary(o) + '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><a class="btn btn-sm btn-ghost" href="devoluciones.html?pedido=' + encodeURIComponent(o.id) + '">Solicitar devolución</a></div></article>';
    }
    function draw() {
      var s = FG.session.get(); if (!s) return login();
      if (!FG.accounts.find(s.email)) { var pn = (s.name || "").trim().split(/\s+/); FG.accounts.add({ name: pn[0] || "", last: pn.slice(1).join(" "), email: s.email, tel: "" }); }
      var orders = FG.orders.get(), favs = FG.favs.get().map(FG.product).filter(Boolean), club = FG.club.get(), subs = FG.subs.get();
      var tabs = [["pedidos", "Pedidos (" + orders.length + ")"], ["favoritos", "Favoritos (" + favs.length + ")"], ["suscripciones", "Club y suscripción"], ["datos", "Mis datos"]];
      if (!tabs.some(function (t) { return t[0] === tab; })) tab = "pedidos";
      var body = "";
      if (tab === "pedidos") body = orders.length ? orders.map(orderHTML).join("") : '<div class="acc-empty"><div class="acc-empty-art">' + FG.art("pack3", "salvia") + '</div><h3>Tu primer viaje con FindGo empieza aquí</h3><p>Todavía no has hecho ningún pedido. Cuando compres, lo verás aquí con su estado.</p><a class="btn btn-primary" href="catalogo.html?cat=maletas">Ver maletas</a></div>';
      if (tab === "favoritos") body = favs.length ? '<div class="grid">' + favs.map(FG.card).join("") + '</div>' : '<div class="acc-empty"><div class="acc-empty-art">' + FG.art("tag", "coral", { initials: "♥" }) + '</div><h3>Aún no tienes favoritos</h3><p>Pulsa el corazón en cualquier producto y lo guardamos aquí para que no se te escape.</p><a class="btn btn-ghost" href="catalogo.html">Explorar la tienda</a></div>';
      if (tab === "suscripciones") body = '<div class="panel"><h3>Club FindGo</h3>' + (club ? '<p>Suscrito con <strong>' + esc(club.email) + '</strong>. Tu código: <span class="mono"><strong>CLUB10</strong></span> (−10 %).</p>' : '<p class="muted">Aún no eres del club. <a href="index.html#club">Únete y consigue un 10 %</a>.</p>') + '</div><div class="panel" style="margin-top:14px"><h3>FindGo Premium</h3>' + (subs ? '<p>Activa (2,99 €/mes).</p><button class="btn btn-ghost btn-sm" id="cancel-sub">Cancelar suscripción</button>' : '<p class="muted">No tienes Premium. <a href="producto.html?id=premium">Descubrir</a>.</p>') + '</div>';
      if (tab === "datos") {
        var pr = FG.profile.get(), nm = (s.name || "").split(" "), val = function (k, d) { return esc(pr[k] != null && pr[k] !== "" ? pr[k] : d || ""); };
        var c = pr.country && FG.COUNTRIES[pr.country] ? pr.country : "ES", pm = pr.pay || "card";
        var fld = function (id, label, k, d, attrs) { return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" name="' + k + '" value="' + val(k, d) + '" ' + (attrs || "") + '><span class="err">Revisa este dato.</span></div>'; };
        body = '<form id="pf" class="panel" novalidate><h3>Mis datos y preferencias</h3><p class="muted small" style="margin-top:0">Se guardan en este navegador y rellenan el pago en tus próximas compras.</p>' +
          '<div class="row2">' + fld("pf-name", "Nombre", "name", nm[0], 'autocomplete="given-name" maxlength="60"') + fld("pf-last", "Apellidos", "last", nm.slice(1).join(" "), 'autocomplete="family-name" maxlength="80"') + '</div>' +
          '<div class="row2">' + fld("pf-email", "Correo electrónico", "email", s.email, 'type="email" autocomplete="email" maxlength="120"') + fld("pf-tel", "Teléfono", "tel", "", 'type="tel" autocomplete="tel" maxlength="20"') + '</div>' +
          '<h3 style="margin-top:18px">Dirección de envío</h3>' + fld("pf-addr", "Calle y número", "addr", "", 'autocomplete="street-address" maxlength="120"') +
          '<div class="row2">' + fld("pf-cp", "Código postal", "cp", "", 'autocomplete="postal-code" maxlength="8"') + fld("pf-city", "Ciudad", "city", "", 'autocomplete="address-level2" maxlength="60"') + '</div>' +
          '<div class="field"><label for="pf-country">País</label><select id="pf-country" name="country">' + Object.keys(FG.COUNTRIES).map(function (k) { return '<option value="' + k + '"' + (k === c ? " selected" : "") + '>' + esc(FG.COUNTRIES[k].n) + '</option>'; }).join("") + '</select></div>' +
          '<h3 style="margin-top:18px">Forma de pago preferida</h3><div class="field"><label for="pf-pay">Método</label><select id="pf-pay" name="pay">' + FG.PAYMENTS.map(function (m) { return '<option value="' + m[0] + '"' + (m[0] === pm ? " selected" : "") + '>' + esc(m[1]) + '</option>'; }).join("") + '</select></div>' +
          '<div id="pf-bizum"' + (pm === "bizum" ? "" : " hidden") + '>' + fld("pf-bz", "Móvil asociado a Bizum", "bizumTel", pr.tel, 'type="tel" maxlength="20"') + '</div>' +
          '<div id="pf-paypal"' + (pm === "paypal" ? "" : " hidden") + '>' + fld("pf-pp", "Correo de PayPal", "paypalMail", s.email, 'type="email" maxlength="120"') + '</div>' +
          '<button class="btn btn-primary" type="submit">Guardar mis datos</button></form>' +
          '';
      }
      var first = (s.name || "").trim().split(/\s+/)[0] || "viajero", h = new Date().getHours(), hi = h < 13 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
      var ini = (s.name || "").trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase() || "FG";
      var tiles = { pedidos: ["c-blue", orders.length, orders.length === 1 ? "pedido" : "pedidos", "Sigue tus compras"], favoritos: ["c-coral", favs.length, favs.length === 1 ? "favorito" : "favoritos", "Lo que te ha gustado"], suscripciones: ["c-sage", club ? "−10 %" : "Club", subs ? "y Premium activo" : "y suscripción", club ? "Ya eres del club" : "Únete y ahorra"], datos: ["c-sand", "Tus", "datos", "Paga más rápido"] };
      root.innerHTML = '<section class="acc-hello"><div class="acc-hello-text"><span class="acc-avatar" aria-hidden="true">' + esc(ini) + '</span><div><p class="acc-hi">' + hi + ',</p><h2>¡Hola, ' + esc(first) + '!</h2><p>¿Adónde te lleva tu próximo viaje? Aquí tienes todo lo tuyo a mano.</p><div class="acc-hello-act"><button class="acc-chip" id="logout">Cerrar sesión</button><button class="acc-chip" id="delete-acc">Eliminar cuenta</button></div></div></div><div class="acc-hello-art" aria-hidden="true">' + FG.art("suitcase", "coral", { scale: .7, initials: ini }) + '</div></section>' +
        '<div class="acc-tiles" role="tablist" aria-label="Secciones de tu cuenta">' + tabs.map(function (t) { var d = tiles[t[0]]; return '<button class="acc-tile ' + d[0] + '" role="tab" aria-selected="' + (t[0] === tab) + '" data-tab="' + t[0] + '"><span class="acc-tile-n">' + d[1] + '</span><span class="acc-tile-l">' + d[2] + '</span><small>' + d[3] + '</small></button>'; }).join("") + '</div><div class="acc-body ' + tiles[tab][0] + '">' + body + '</div>';
    }
    root.addEventListener("click", function (e) {
      var md = e.target.closest("[data-mode]"); if (md) { history.replaceState(null, "", "#" + md.dataset.mode); login(); return; }
      var t = e.target.closest("[data-tab]"); if (t) { tab = t.dataset.tab; history.replaceState(null, "", "#" + tab); draw(); goBody(); return; }
      if (e.target.closest("#logout")) { FG.session.logout(); history.replaceState(null, "", "#entrar"); location.reload(); }
      if (e.target.closest("#delete-acc") && window.confirm("¿Seguro que quieres eliminar tu cuenta? Se borrarán tus pedidos, favoritos, club y datos guardados. No se puede deshacer.")) {
        var me = FG.session.get(); if (me) FG.accounts.remove(me.email);
        ["cart", "orders", "favs", "club", "session", "subs", "checkout", "orderSeq", "profile"].forEach(function (k) { FG.write(k, k === "orders" || k === "cart" || k === "favs" ? [] : k === "profile" ? {} : null); });
        FG.write("accDeleted", true); history.replaceState(null, "", "#registro"); location.reload();
      }
      if (e.target.closest("#cancel-sub")) { FG.subs.set(false); FG.toast("Suscripción cancelada"); draw(); }
    });
    root.addEventListener("change", function (e) {
      if (e.target.id !== "pf-pay") return;
      $("#pf-bizum").hidden = e.target.value !== "bizum"; $("#pf-paypal").hidden = e.target.value !== "paypal";
    });
    root.addEventListener("submit", function (e) {
      if (e.target.id !== "pf") return;
      e.preventDefault();
      var f = e.target, v = function (n) { return f.elements[n].value.trim(); };
      var ok = [mark(f.elements.name, v("name").length > 0), mark(f.elements.email, emailOk(v("email")))];
      if (v("tel")) ok.push(mark(f.elements.tel, v("tel").replace(/[\s.\-+()]/g, "").replace(/^34/, "").length >= 9));
      if (v("cp")) ok.push(mark(f.elements.cp, FG.country(f.elements.country.value).cp.test(v("cp"))));
      if (f.elements.pay.value === "bizum" && v("bizumTel")) ok.push(mark(f.elements.bizumTel, v("bizumTel").replace(/[\s.\-+()]/g, "").replace(/^34/, "").length === 9));
      if (f.elements.pay.value === "paypal" && v("paypalMail")) ok.push(mark(f.elements.paypalMail, emailOk(v("paypalMail"))));
      if (ok.indexOf(false) > -1) { var bad = f.querySelector(".field.bad input"); if (bad) bad.focus(); return; }
      FG.profile.set({ name: v("name"), last: v("last"), email: v("email"), tel: v("tel"), addr: v("addr"), cp: v("cp").toUpperCase(), city: v("city"), country: f.elements.country.value, pay: f.elements.pay.value, bizumTel: v("bizumTel"), paypalMail: v("paypalMail") });
      var prev = FG.session.get(); if (prev && prev.email.toLowerCase() !== v("email").toLowerCase()) FG.accounts.remove(prev.email);
      FG.accounts.add({ name: v("name"), last: v("last"), email: v("email"), tel: v("tel") });
      FG.session.login((v("name") + " " + v("last")).trim(), v("email"));
      FG.toast("Datos guardados"); draw();
    });
    document.addEventListener("fg:change", function (e) { if (e.detail === "favs") draw(); });
    function goBody() {
      var b = root.querySelector(".acc-body"); if (!b) return;
      var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      b.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    window.addEventListener("hashchange", function () { tab = (location.hash || "#pedidos").slice(1); draw(); if (FG.session.get()) goBody(); });
    draw();
    if (FG.read("accDeleted", false)) { FG.write("accDeleted", false); FG.toast("Tu cuenta se ha eliminado"); }
    if (FG.session.get() && /^#(pedidos|favoritos|suscripciones|datos)$/.test(location.hash)) setTimeout(goBody, 60);
  }

  /* ================= DEVOLUCIONES ================= */
  function returns() {
    var box = $("#ret"), orders = FG.orders.get(), pre = new URLSearchParams(location.search).get("pedido");
    if (!orders.length) { box.innerHTML = '<div class="note">Aún no tienes pedidos. Cuando compres, podrás solicitar aquí la devolución.</div><a class="btn" href="catalogo.html">Ir a la tienda</a>'; return; }
    box.innerHTML = '<form id="rf" novalidate><div class="field"><label for="rf-o">Pedido</label><select id="rf-o">' + orders.map(function (o) { return '<option value="' + esc(o.id) + '"' + (o.id === pre ? " selected" : "") + '>' + esc(o.id) + ' · ' + dateEs(o.date) + '</option>'; }).join("") + '</select></div><div class="field"><span class="lbl">Productos a devolver</span><div id="rf-items"></div><span class="err" id="rf-err">Elige al menos un producto.</span></div><label class="check"><input type="checkbox" id="rf-def"><span>El producto tiene un <strong>defecto</strong> (permite devolver también los personalizados).</span></label><div class="field"><label for="rf-r">Motivo</label><select id="rf-r"><option>No era lo que esperaba</option><option>Me ha llegado dañado</option><option>No funciona correctamente</option><option>Otro</option></select></div><button class="btn btn-primary" type="submit">Solicitar devolución</button></form><div id="rf-ok" class="form-ok" hidden></div>';
    function items() {
      var o = orders.filter(function (x) { return x.id === $("#rf-o").value; })[0], def = $("#rf-def").checked, h = "";
      o.lines.forEach(function (l, i) {
        var blocked = l.nonReturnable && !def, done = (o.returns || []).some(function (r) { return r.items.indexOf(l.name) > -1; });
        h += '<label class="check"><input type="checkbox" data-i="' + i + '"' + (blocked || done ? " disabled" : "") + '><span>' + esc(l.name) + (l.initials ? " (" + esc(l.initials) + ")" : "") + (blocked ? '<br><small class="muted">Personalizado: no admite devolución salvo defecto (art. 103 TRLGDCU).</small>' : "") + (done ? '<br><small class="muted">Devolución ya solicitada.</small>' : "") + '</span></label>';
      });
      $("#rf-items").innerHTML = h;
    }
    items(); $("#rf-o").addEventListener("change", items); $("#rf-def").addEventListener("change", items);
    $("#rf").addEventListener("submit", function (e) {
      e.preventDefault();
      var o = orders.filter(function (x) { return x.id === $("#rf-o").value; })[0], sel = [].slice.call(document.querySelectorAll("#rf-items input:checked")).map(function (c) { return o.lines[+c.dataset.i].name; });
      $("#rf-err").parentNode.classList.toggle("bad", !sel.length); if (!sel.length) return;
      var out = $("#rf-ok"); out.hidden = false;
      if (daysSince(o.date) > 30) { out.innerHTML = '<strong>Fuera de plazo.</strong> Han pasado más de 30 días desde el pedido. Si hay un defecto, la garantía de 3 años sigue vigente.'; return; }
      var code = "DEV-" + o.id.slice(-5);
      FG.orders.update(o.id, function (x) { (x.returns = x.returns || []).push({ code: code, items: sel, date: new Date().toISOString(), defect: $("#rf-def").checked }); });
      out.innerHTML = '<strong>Solicitud registrada: <span class="mono">' + code + '</span>.</strong><br>Recogeremos el paquete gratis en tu dirección y recibirás el reembolso en un máximo de 14 días. <a href="cuenta.html#pedidos">Ver en Mi cuenta</a>.';
      orders = FG.orders.get(); items();
    });
  }

  /* ================= PRIVACIDAD ================= */
  function simpleForm(formSel, okSel, validate, msg) {
    var f = $(formSel); if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault(); if (!validate()) return;
      f.hidden = true; var ok = $(okSel); ok.hidden = false; ok.innerHTML = msg(); ok.scrollIntoView({ block: "nearest" });
    });
  }
  function privacy() {
    simpleForm("#rights", "#rights-ok", function () { var a = mark($("#r-name"), $("#r-name").value.trim().length > 0), b = mark($("#r-mail"), emailOk($("#r-mail").value.trim())); return a && b; },
      function () { return '<strong>Solicitud de ' + esc($("#r-type").value.toLowerCase()) + ' recibida.</strong> Responderíamos a <strong>' + esc($("#r-mail").value.trim()) + '</strong> en el plazo máximo de un mes.'; });
  }
  function b2b() {
    simpleForm("#b2b", "#b2b-ok", function () { var a = mark($("#b-co"), $("#b-co").value.trim().length > 0), n = +$("#b-n").value, b = mark($("#b-n"), n >= 1 && n <= 100000), c = mark($("#b-mail"), emailOk($("#b-mail").value.trim())); return a && b && c; },
      function () { return '<strong>Gracias, ' + esc($("#b-co").value.trim()) + '.</strong> Un asesor te escribirá a ' + esc($("#b-mail").value.trim()) + ' con una propuesta para ' + (+$("#b-n").value) + ' unidades.'; });
  }
  function cookies() {
    function show() { var v = FG.read("cookies", null); $("#ck-state").textContent = v === "all" ? "Aceptadas todas" : v === "necessary" ? "Solo necesarias" : "sin decidir"; }
    document.addEventListener("click", function (e) { var b = e.target.closest("[data-set]"); if (b) { FG.write("cookies", b.dataset.set); show(); FG.toast("Preferencia guardada"); } });
    show();
  }

  ({ account: account, returns: returns, privacy: privacy, b2b: b2b, cookies: cookies }[page] || function () {})();
})();
