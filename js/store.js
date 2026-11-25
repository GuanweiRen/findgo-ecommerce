/* Utilidades, carrito, pedidos, favoritos y club (todo en localStorage). */
(function () {
  var FG = window.FG = window.FG || {};

  /* Si el navegador bloquea localStorage (p. ej. Chrome con «Bloquear datos de sitios» o el modo
     de algunos antivirus), los datos se guardan en memoria y en window.name, que se conserva al
     cambiar de página en la misma pestaña. Así el carrito y el pago siguen funcionando. */
  var LS = (function () { try { var k = "fg:__test"; window.localStorage.setItem(k, "1"); window.localStorage.removeItem(k); return window.localStorage; } catch (e) { return null; } })();
  var mem = (function () { try { var o = JSON.parse(window.name || "{}"); return o && o.__fg ? o.d : {}; } catch (e) { return {}; } })();
  var NO_NAME = { profile: 1, session: 1, accounts: 1 };  // datos personales: solo en memoria
  function keepInName() { try { var d = {}; for (var k in mem) if (!NO_NAME[k]) d[k] = mem[k]; window.name = JSON.stringify({ __fg: 1, d: d }); } catch (e) {} }
  function valid(v, fallback) { return Array.isArray(fallback) && !Array.isArray(v) ? fallback : v; }
  function read(key, fallback) {
    if (LS) {
      try { var v = LS.getItem("fg:" + key); return v ? valid(JSON.parse(v), fallback) : fallback; }
      catch (e) { if (!(key in mem)) return fallback; }
    }
    return key in mem && mem[key] != null ? valid(mem[key], fallback) : fallback;
  }
  function write(key, val) {
    mem[key] = val;
    if (LS) { try { LS.setItem("fg:" + key, JSON.stringify(val)); } catch (e) { LS = null; } }
    if (!LS) keepInName();
    try { document.dispatchEvent(new CustomEvent("fg:change", { detail: key })); } catch (e) {}
  }
  FG.remove = function (key) { delete mem[key]; if (LS) { try { LS.removeItem("fg:" + key); } catch (e) {} } else keepInName(); };
  FG.read = read; FG.write = write;

  FG.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  FG.eur = function (n) {
    return "€\u00a0" + new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: "always" }).format(n);
  };

  /* ---------- Texto grabado: tamaño y posición ---------- */
  FG.TEXT_SIZES = { s: { n: "Pequeño", k: .75 }, m: { n: "Mediano", k: 1 }, l: { n: "Grande", k: 1.3 } };
  FG.TEXT_POS = { top: { n: "Arriba", y: .3 }, mid: { n: "Centro", y: .54 }, bot: { n: "Abajo", y: .78 } };
  /* Detalles de las iniciales distintos de los de por defecto: tipo de letra, tamaño y posición */
  FG.iniDetails = function (l) {
    var d = [];
    if (l.font && l.font !== "clasica" && FG.FONTS[l.font]) d.push(FG.FONTS[l.font].n);
    if (l.tsize && l.tsize !== "m" && FG.TEXT_SIZES[l.tsize]) d.push("tamaño " + FG.TEXT_SIZES[l.tsize].n.toLowerCase());
    if (l.tpos && l.tpos !== "mid" && FG.TEXT_POS[l.tpos]) d.push(FG.TEXT_POS[l.tpos].n.toLowerCase());
    return d;
  };

  /* ---------- Carrito ---------- */
  // línea: { key, id, qty, color, initials, font, variant }
  FG.cart = {
    get: function () { return read("cart", []); },
    count: function () { return this.get().reduce(function (a, l) { return a + l.qty; }, 0); },
    clear: function () { write("cart", []); },
    add: function (opt) {
      var p = FG.product(opt.id); if (!p || p.price == null) return null;
      var line = { id: p.id, qty: Math.max(1, opt.qty || 1), color: opt.color || null, initials: (opt.initials || "").trim().slice(0, 3).toUpperCase(), variant: opt.variant || null };
      line.font = line.initials ? (FG.FONTS[opt.font] ? opt.font : "clasica") : null;
      line.tsize = line.initials ? (FG.TEXT_SIZES[opt.tsize] ? opt.tsize : "m") : null;
      line.tpos = line.initials ? (FG.TEXT_POS[opt.tpos] ? opt.tpos : "mid") : null;
      line.key = [line.id, line.color, line.initials, line.font, line.variant, line.tsize, line.tpos].join("|");
      var cart = this.get(), ex = cart.filter(function (l) { return l.key === line.key; })[0];
      if (ex) ex.qty = Math.min(p.single ? 1 : 99, ex.qty + line.qty); else cart.push(line);
      if (p.single) line.qty = 1;
      write("cart", cart);
      return line;
    },
    setQty: function (key, qty) {
      var cart = this.get();
      cart = cart.map(function (l) { if (l.key === key) l.qty = Math.max(0, Math.min(99, qty)); return l; })
                 .filter(function (l) { return l.qty > 0; });
      write("cart", cart);
    },
    remove: function (key) { write("cart", this.get().filter(function (l) { return l.key !== key; })); }
  };

  FG.unitPrice = function (l) {
    var p = FG.product(l.id), base = p.price;
    if (l.variant && p.variants) { var v = p.variants.filter(function (x) { return x.n === l.variant; })[0]; if (v) base = v.price; }
    if (l.initials && p.initials && !p.needsInitials) base += 19;
    return base;
  };

  FG.lines = function (cart) {
    return (cart || FG.cart.get()).filter(function (l) { return FG.product(l.id); }).map(function (l) {
      var p = FG.product(l.id), unit = FG.unitPrice(l);
      return { line: l, p: p, unit: unit, total: unit * l.qty };
    });
  };

  FG.FREE_FROM = 99;

  /* ---------- Países de envío (importes de ejemplo) ---------- */
  // vat: impuesto del destino (%) · tax: nombre del impuesto si no es el IVA (IGIC en Canarias, IPSI en Ceuta y Melilla) · cp: validación del código postal · std/exp: envío estándar/express · free: envío estándar gratis desde · days: días laborables
  FG.COUNTRIES = {
    ES: { n: "España (península y Baleares)", vat: 21, cp: /^(?!35|38|51|52)\d{5}$/, ph: "28001", std: 4.95, exp: 9.95, free: 99, days: [3, 5], cpErr: "Debe tener 5 cifras. Para Canarias, Ceuta o Melilla elige esa zona." },
    IC: { n: "España (Islas Canarias)", vat: 7, tax: "IGIC", cp: /^(35|38)\d{3}$/, ph: "35001", std: 9.95, exp: 19.95, free: 149, days: [5, 8], cpErr: "En Canarias empieza por 35 o 38.", note: "Envío a Canarias: no lleva IVA; se aplica el IGIC canario (7 %). Nos encargamos del despacho de aduana." },
    CE: { n: "España (Ceuta)", vat: 10, tax: "IPSI", cp: /^51\d{3}$/, ph: "51001", std: 9.95, exp: 19.95, free: 149, days: [5, 8], cpErr: "En Ceuta empieza por 51.", note: "Envío a Ceuta: no lleva IVA; se aplica el IPSI. Nos encargamos del despacho de aduana." },
    ML: { n: "España (Melilla)", vat: 10, tax: "IPSI", cp: /^52\d{3}$/, ph: "52001", std: 9.95, exp: 19.95, free: 149, days: [5, 8], cpErr: "En Melilla empieza por 52.", note: "Envío a Melilla: no lleva IVA; se aplica el IPSI. Nos encargamos del despacho de aduana." },
    PT: { n: "Portugal", vat: 23, cp: /^\d{4}-?\d{3}$/, ph: "1000-001", std: 6.95, exp: 14.95, free: 149, days: [4, 6], cpErr: "Formato 0000-000." },
    FR: { n: "Francia", vat: 20, cp: /^\d{5}$/, ph: "75001", std: 8.95, exp: 17.95, free: 199, days: [5, 8], cpErr: "Debe tener 5 cifras." },
    IT: { n: "Italia", vat: 22, cp: /^\d{5}$/, ph: "00100", std: 8.95, exp: 17.95, free: 199, days: [5, 8], cpErr: "Debe tener 5 cifras." },
    DE: { n: "Alemania", vat: 19, cp: /^\d{5}$/, ph: "10115", std: 8.95, exp: 17.95, free: 199, days: [5, 8], cpErr: "Debe tener 5 cifras." },
    NL: { n: "Países Bajos", vat: 21, cp: /^\d{4}\s?[A-Za-z]{2}$/, ph: "1011 AB", std: 8.95, exp: 17.95, free: 199, days: [5, 8], cpErr: "Formato 0000 AA." },
    BE: { n: "Bélgica", vat: 21, cp: /^\d{4}$/, ph: "1000", std: 8.95, exp: 17.95, free: 199, days: [5, 8], cpErr: "Debe tener 4 cifras." },
    GB: { n: "Reino Unido", vat: 20, cp: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/, ph: "SW1A 1AA", std: 14.95, exp: 24.95, free: 249, days: [7, 10], cpErr: "Código postal no válido." }
  };
  FG.country = function (k) { return FG.COUNTRIES[k] || FG.COUNTRIES.ES; };

  /* ---------- Métodos de pago ---------- */
  FG.PAYMENTS = [
    ["card", "Tarjeta de crédito o débito", "Visa, Mastercard. Usa la tarjeta de prueba indicada."],
    ["bizum", "Bizum", "Paga con tu móvil desde la app de tu banco."],
    ["paypal", "PayPal", "Con tu cuenta de PayPal."],
    ["applepay", "Apple Pay", "Con Touch ID o Face ID."],
    ["googlepay", "Google Pay", "Con las tarjetas guardadas en tu cuenta de Google."],
    ["transfer", "Transferencia bancaria", "El pedido se prepara al recibir el pago."]
  ];
  FG.payName = function (k) { var p = FG.PAYMENTS.filter(function (x) { return x[0] === k; })[0]; return p ? p[1] : ""; };

  FG.totals = function (lines, opts) {
    opts = opts || {};
    var sub = 0, eligible = 0;
    lines.forEach(function (x) { sub += x.total; if (!x.p.noDiscount) eligible += x.total; });
    var club = !!opts.code && opts.code === "CLUB10";
    var discount = club ? Math.round(eligible * 10) / 100 : 0;
    var net = sub - discount, ship = 0;
    if (lines.length) {
      var c = FG.country(opts.country);
      if (opts.shipping === "express") ship = c.exp;
      else ship = net >= c.free ? 0 : c.std;
    }
    /* Los precios del catálogo llevan el IVA español (21 %). Se quita y se aplica el impuesto del destino. */
    var dest = FG.country(opts.country), vat = dest.vat, gross = net + ship;
    var base = Math.round(gross / 1.21 * 100) / 100, tax = Math.round(base * vat) / 100, total = Math.round((base + tax) * 100) / 100;
    return { sub: sub, discount: discount, ship: ship, total: total, club: club, vat: vat, taxName: dest.tax || "IVA", tax: tax, base: base, adj: Math.round((total - gross) * 100) / 100 };
  };

  /* ---------- Favoritos ---------- */
  FG.favs = {
    get: function () { return read("favs", []); },
    has: function (id) { return this.get().indexOf(id) > -1; },
    toggle: function (id) {
      var f = this.get(), i = f.indexOf(id);
      if (i > -1) f.splice(i, 1); else f.push(id);
      write("favs", f); return i === -1;
    }
  };

  /* ---------- Club, pedidos, borrador de checkout ---------- */
  FG.club = {
    get: function () { return read("club", null); },
    join: function (email) { write("club", { email: email, code: "CLUB10", date: new Date().toISOString() }); }
  };
  FG.checkout = {
    get: function () { return read("checkout", { code: "", shipping: "standard", data: {} }); },
    set: function (patch) { var c = this.get(); for (var k in patch) c[k] = patch[k]; write("checkout", c); }
  };
  FG.orders = {
    get: function () { return read("orders", []); },
    add: function (o) { var l = this.get(); l.unshift(o); write("orders", l); },
    update: function (id, fn) { var l = this.get(); l.forEach(function (o) { if (o.id === id) fn(o); }); write("orders", l); },
    nextId: function () {
      var n = read("orderSeq", 0) + 1; write("orderSeq", n);
      return "FG-2026-" + String(10000 + n * 7 + Math.floor(Math.random() * 6));
    }
  };
  // Datos del cliente para rellenar el pago en próximas compras
  // { name, last, email, tel, addr, cp, city, country, pay, bizumTel, paypalMail }
  FG.profile = {
    get: function () { return read("profile", {}); },
    set: function (patch) { var p = this.get(); for (var k in patch) p[k] = patch[k]; write("profile", p); },
    clear: function () { write("profile", {}); }
  };
  /* Cuentas registradas en este navegador (sin contraseña) */
  FG.accounts = {
    all: function () { return read("accounts", []); },
    find: function (email) { email = (email || "").trim().toLowerCase(); return this.all().filter(function (a) { return a.email === email; })[0] || null; },
    add: function (a) { var list = this.all().filter(function (x) { return x.email !== a.email.toLowerCase(); }); a.email = a.email.toLowerCase(); a.date = new Date().toISOString(); list.push(a); write("accounts", list); return a; },
    remove: function (email) { email = (email || "").toLowerCase(); write("accounts", this.all().filter(function (a) { return a.email !== email; })); }
  };

  FG.session = {
    get: function () { return read("session", null); },
    login: function (name, email) { write("session", { name: name, email: email }); },
    logout: function () { write("session", null); }
  };
  FG.subs = {
    get: function () { return read("subs", false); },
    set: function (v) { write("subs", v); }
  };

  /* Desglose de impuestos: los precios llevan el IVA incluido */
  FG.taxHTML = function (t, country) {
    var c = FG.country(country), vat = t.vat != null ? t.vat : c.vat, name = t.taxName || c.tax || "IVA", tax = t.tax != null ? t.tax : Math.round((t.total - t.total / (1 + vat / 100)) * 100) / 100;
    return '<div class="sum-row tax"><span>Base imponible</span><span>' + FG.eur(t.total - tax) + '</span></div><div class="sum-row tax"><span>' + name + ' (' + vat + ' %) incluido</span><span>' + FG.eur(tax) + '</span></div>';
  };

  /* Diferencia entre el IVA español de los precios y el impuesto del destino */
  FG.adjHTML = function (t) {
    if (!t.adj) return "";
    return '<div class="sum-row ' + (t.adj < 0 ? "disc" : "") + '"><span>Ajuste por impuesto de destino (' + (t.taxName || "IVA") + ' ' + t.vat + ' % en lugar de IVA 21 %)</span><span>' + (t.adj < 0 ? "−" : "+") + FG.eur(Math.abs(t.adj)) + '</span></div>';
  };

  FG.orderSummary = function (o) {
    var t = o.totals;
    return o.lines.map(function (l) { return '<div class="sum-item"><span>' + l.qty + ' × ' + FG.esc(l.name) + (l.initials ? ' (' + FG.esc([l.initials].concat(FG.iniDetails(l)).join(" · ")) + ')' : "") + (l.color ? ' · ' + FG.esc(FG.colorName(l.color)) : "") + '</span><span class="mono">' + FG.eur(l.unit * l.qty) + '</span></div>'; }).join("") +
      '<hr style="border:0;border-top:1px solid var(--line);margin:10px 0"><div class="sum-row"><span>Subtotal</span><span>' + FG.eur(t.sub) + '</span></div>' +
      (t.discount ? '<div class="sum-row disc"><span>CLUB10 (−10 %)</span><span>−' + FG.eur(t.discount) + '</span></div>' : "") +
      '<div class="sum-row"><span>Envío ' + (o.shipping === "express" ? "express" : "estándar") + '</span><span>' + (t.ship ? FG.eur(t.ship) : "Gratis") + '</span></div>' + FG.adjHTML(t) + '<div class="sum-row total"><span>Total</span><span>' + FG.eur(t.total) + '</span></div>' + FG.taxHTML(t, o.address && o.address.country);
  };

  function addDays(n, from) { var d = from ? new Date(from) : new Date(), k = 0; while (k < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) k++; } return d; }
  function fmtDay(d) { return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }).replace(".", ""); }
  FG.deliveryText = function (days, from) { days = days || [3, 5]; return fmtDay(addDays(days[0], from)) + " y " + fmtDay(addDays(days[1], from)); };


  /* ---------- Buscador: palabras sueltas, sinónimos, erratas y relevancia ---------- */
  (function () {
    function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/follow[\s-]*me/g, "followme").replace(/[^a-z0-9ñ]+/g, " ").trim(); }
    var STOP = "de del la las el los lo un una unos unas y e o u a al en con sin para por que mi mis tu tus su sus me se es".split(" ");
    // Frases que se sustituyen antes de dividir en palabras
    var PHRASES = [[/equipaje de mano/g, "cabin"], [/air ?tags?/g, "tag localizador"]];
    // Cada palabra también vale por estas otras
    var SYN = { grande: ["large"], grandes: ["large"], mediana: ["medium"], mediano: ["medium"], medianas: ["medium"], cabina: ["cabin"], regalo: ["personalizacion"], regalos: ["personalizacion"] };
    var SIZES = ["cabin", "medium", "large"];
    // Frases que dicen que el producto NO tiene algo: no deben contar como coincidencia
    function clean(t) { return t.replace(/\b(sin|ni|no lleva|no incluye|no tiene) followme\b/g, " "); }
    function fields(p) {
      var specs = (p.spec || []).filter(function (r) { return !/^no\b/i.test(r[1]); }).map(function (r) { return r[0] + " " + r[1]; }).join(" ");
      return [
        [norm(p.name) + (p.followMe ? " followme" : ""), 10],
        [norm(FG.CATS[p.cat] ? FG.CATS[p.cat].name : ""), 5],
        [norm([p.size, p.func, p.litres, p.dims, (p.variants || []).map(function (v) { return v.n; }).join(" ")].join(" ")), 4],
        [clean(norm(p.short + " " + p.tag)), 3],
        [clean(norm(p.desc + " " + specs + " " + (p.who || ""))), 1]
      ];
    }
    function lev(a, b, max) {
      if (Math.abs(a.length - b.length) > max) return max + 1;
      var prev = [], cur, i, j;
      for (j = 0; j <= b.length; j++) prev[j] = j;
      for (i = 1; i <= a.length; i++) {
        cur = [i]; var best = i;
        for (j = 1; j <= b.length; j++) { cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); if (cur[j] < best) best = cur[j]; }
        if (best > max) return max + 1;
        prev = cur;
      }
      return prev[b.length];
    }
    // Puntuación de una palabra (con sus alternativas) en un texto; 0 si no aparece
    function hit(alts, text) {
      var words = text.split(" "), i, k, w;
      for (k = 0; k < alts.length; k++) { w = alts[k]; if ((" " + text).indexOf(" " + w) > -1) return 1; if (text.indexOf(w) > -1) return .6; }
      if (alts.strict) return 0;
      for (k = 0; k < alts.length; k++) {
        w = alts[k]; if (w.length < 4) continue;
        var max = w.length >= 8 ? 2 : 1;
        for (i = 0; i < words.length; i++) if (words[i].length >= 3 && lev(w, words[i], max) <= max) return .5;
      }
      return 0;
    }
    FG.searchTerms = function (q) {
      var t = norm(q); PHRASES.forEach(function (r) { t = t.replace(r[0], r[1]); });
      return t.split(" ").filter(function (w) { return w && STOP.indexOf(w) < 0; }).map(function (w) {
        var alts = [w].concat(SYN[w] || []);
        if (w.length > 4 && /s$/.test(w)) alts.push(w.slice(0, -1));
        // Tallas: solo cuentan en nombre, categoría y tamaño (no en «la batería viaja en cabina»)
        alts.strict = alts.some(function (a) { return SIZES.indexOf(a) > -1; });
        return alts;
      });
    };
    /* Devuelve los productos que contienen todas las palabras, de más a menos relevante */
    FG.search = function (q, list) {
      var terms = FG.searchTerms(q); list = list || FG.PRODUCTS;
      if (!terms.length) return [];
      return list.map(function (p, idx) {
        var f = fields(p), score = 0;
        for (var i = 0; i < terms.length; i++) {
          var best = 0;
          for (var j = 0; j < f.length; j++) { if (terms[i].strict && f[j][1] < 4) continue; var h = hit(terms[i], f[j][0]); if (h * f[j][1] > best) best = h * f[j][1]; }
          if (!best) return null;
          score += best;
        }
        return { p: p, s: score, i: idx };
      }).filter(Boolean).sort(function (a, b) { return b.s - a.s || a.i - b.i; }).map(function (r) { return r.p; });
    };
    FG.SEARCH_SUGG = ["Cabin", "Maleta grande", "Batería", "Mochila", "Candado TSA", "Regalo"];
  })();

  FG.colorName = function (k) { return FG.COLORS[k] ? FG.COLORS[k].name : ""; };
})();
