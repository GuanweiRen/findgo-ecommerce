/* Ilustraciones SVG propias, en trazo sobrio. FG.art(kind, colorKey, {scale, initials}) -> string SVG */
(function () {
  var FG = window.FG = window.FG || {};

  function light(hex) { var n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 160; }
  var F = function (v) { return 'style="fill:var(--art-' + v + ')"'; };
  var S = function (v, w) { return 'style="stroke:var(--art-' + v + ');fill:none" stroke-width="' + w + '" stroke-linecap="round"'; };
  var BOT = 182;

  /* Maleta de ranuras finas. x, w, h en unidades del viewBox; apoyada en BOT. */
  var curFont = "clasica";
  function suit(x, w, h, hex, ini, led, model) {
    model = model || "cabin";
    var y = BOT - h, cx = x + w / 2, lt = light(hex), ink = lt ? "20,22,28" : "255,255,255", g = "", d = "";
    var n = Math.max(4, Math.floor(w / 8));
    if (model === "cabin" || model === "large" || model === "limited") {
      // Ranuras verticales
      for (var i = 1; i < n; i++) {
        var gx = x + (w * i) / n;
        g += '<path d="M' + gx + ' ' + (y + 10) + 'V' + (y + h - 10) + '" stroke="rgba(0,0,0,.17)" stroke-width="1.3"/><path d="M' + (gx + 1.4) + ' ' + (y + 10) + 'V' + (y + h - 10) + '" stroke="rgba(255,255,255,.16)" stroke-width="1"/>';
      }
    } else if (model === "medium") {
      // Costillas horizontales y banda inferior de ampliación
      for (var k = 1; k <= 4; k++) {
        var gy = y + h * 0.13 + k * h * 0.13;
        g += '<path d="M' + (x + 9) + ' ' + gy + 'H' + (x + w - 9) + '" stroke="rgba(0,0,0,.17)" stroke-width="1.6"/><path d="M' + (x + 9) + ' ' + (gy + 1.6) + 'H' + (x + w - 9) + '" stroke="rgba(255,255,255,.16)" stroke-width="1"/>';
      }
      d += '<path d="M' + x + ' ' + (y + h * 0.8) + 'H' + (x + w) + 'V' + (y + h - 14) + 'a14 14 0 0 1-14 14H' + (x + 14) + 'a14 14 0 0 1-14-14z" fill="rgba(0,0,0,.2)"/><path d="M' + (x + 8) + ' ' + (y + h * 0.8) + 'H' + (x + w - 8) + '" stroke="rgba(255,255,255,.45)" stroke-width="1.4" stroke-dasharray="3 3"/>';
    } else if (model === "lite") {
      // Carcasa lisa y brillante
      d += '<path d="M' + (x + 10) + ' ' + (y + 8) + 'H' + (x + w * 0.58) + 'L' + (x + 10) + ' ' + (y + h * 0.52) + 'z" fill="rgba(255,255,255,.2)"/>';
    }
    if (model === "cabin") {
      // Bolsillo frontal para portátil, con cremallera
      d += '<path d="M' + (x + 12) + ' ' + (y + h * 0.26) + 'H' + (x + w - 12) + '" stroke="rgba(' + ink + ',.45)" stroke-width="1.6" stroke-dasharray="2 2.5"/><rect x="' + (cx - 3) + '" y="' + (y + h * 0.26 - 2) + '" width="6" height="9" rx="2" fill="rgba(' + ink + ',.6)"/>';
    }
    if (model === "large") {
      // Esquineras, correas de compresión y asa lateral
      var c = '" stroke="rgba(0,0,0,.42)" stroke-width="4" fill="none" stroke-linecap="round"/>';
      d += '<path d="M' + (x + 3) + ' ' + (y + 24) + 'V' + (y + 16) + 'a13 13 0 0 1 13-13H' + (x + 24) + c + '<path d="M' + (x + w - 3) + ' ' + (y + 24) + 'V' + (y + 16) + 'a13 13 0 0 0-13-13H' + (x + w - 24) + c +
        '<path d="M' + (x + 3) + ' ' + (y + h - 24) + 'V' + (y + h - 16) + 'a13 13 0 0 0 13 13H' + (x + 24) + c + '<path d="M' + (x + w - 3) + ' ' + (y + h - 24) + 'V' + (y + h - 16) + 'a13 13 0 0 1-13 13H' + (x + w - 24) + c +
        '<rect x="' + x + '" y="' + (y + h * 0.58) + '" width="' + w + '" height="8" fill="rgba(0,0,0,.3)"/><rect x="' + (cx - 7) + '" y="' + (y + h * 0.58 - 2) + '" width="14" height="12" rx="2" fill="rgba(255,255,255,.7)"/>' +
        '<rect x="' + (x - 6) + '" y="' + (y + h * 0.3) + '" width="7" height="28" rx="3" ' + F(1) + '/>';
    }
    if (model === "limited") {
      // Franja dorada y estrella
      d += '<rect x="' + x + '" y="' + (y + h * 0.3) + '" width="' + w + '" height="6" fill="#d9b26a"/><path d="M' + cx + ' ' + (y + h * 0.62) + 'l3.4 7 7.6 1.1-5.5 5.4 1.3 7.6-6.8-3.6-6.8 3.6 1.3-7.6-5.5-5.4 7.6-1.1z" fill="#d9b26a"/>';
    }
    var txt = ini ? '<text x="' + cx + '" y="' + (y + h * 0.54) + '" text-anchor="middle" font-family="' + FG.FONTS[curFont].f.replace(/"/g, "'") + '" font-weight="' + FG.FONTS[curFont].w + '" font-size="' + Math.min(w * 0.25, 24) * FG.FONTS[curFont].k + '" fill="rgba(' + ink + ',.92)" letter-spacing="' + FG.FONTS[curFont].ls + '" style="paint-order:stroke">' + FG.esc(ini) + '</text>' : "";
    var wheels = model === "large" ?
      '<circle cx="' + (x + 9) + '" cy="' + (BOT + 3) + '" r="4.5" ' + F(1) + '/><circle cx="' + (x + 23) + '" cy="' + (BOT + 3) + '" r="4.5" ' + F(1) + '/><circle cx="' + (x + w - 23) + '" cy="' + (BOT + 3) + '" r="4.5" ' + F(1) + '/><circle cx="' + (x + w - 9) + '" cy="' + (BOT + 3) + '" r="4.5" ' + F(1) + '/>' :
      '<circle cx="' + (x + 12) + '" cy="' + (BOT + 3) + '" r="5" ' + F(1) + '/><circle cx="' + (x + w - 12) + '" cy="' + (BOT + 3) + '" r="5" ' + F(1) + '/>';
    var handle = model === "lite" ?
      '<path d="M' + (x + w * 0.5) + ' ' + y + 'V' + (y - 16) + '" ' + S(2, 3) + '/><rect x="' + (x + w * 0.36) + '" y="' + (y - 24) + '" width="' + w * 0.28 + '" height="9" rx="4" ' + F(1) + '/>' :
      '<path d="M' + (x + w * 0.3) + ' ' + y + 'V' + (y - 16) + 'M' + (x + w * 0.7) + ' ' + y + 'V' + (y - 16) + '" ' + S(2, 3) + '/><rect x="' + (x + w * 0.24) + '" y="' + (y - 24) + '" width="' + w * 0.52 + '" height="9" rx="2" ' + F(1) + '/>';
    var dot = led ? '<circle cx="' + (cx + 15) + '" cy="' + (y + 14.5) + '" r="2" fill="#2f5bff"/>' : model === "lite" ? '<circle cx="' + (cx + 15) + '" cy="' + (y + 14.5) + '" r="2" fill="rgba(' + ink + ',.55)"/>' : "";
    return handle +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14" fill="' + hex + '"/>' + g +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14" fill="url(#sh)"/>' + d +
      '<rect x="' + (x + 5) + '" y="' + (y + 5) + '" width="' + (w - 10) + '" height="' + (h - 10) + '" rx="9" fill="none" stroke="rgba(' + ink + ',.14)"/>' +
      '<rect x="' + (cx - 10) + '" y="' + (y + 12) + '" width="20" height="5" rx="1" fill="rgba(' + ink + ',.55)"/>' + dot + txt + wheels;
  }
  var DEFS = '<defs><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>';

  FG.art = function (kind, colorKey, o) {
    o = o || {};
    var hex = (FG.COLORS[colorKey] || FG.COLORS.azul).hex, s = o.scale || 1, ini = o.initials || "", body = "", rx = 56;
    curFont = FG.FONTS[o.font] ? o.font : "clasica";
    switch (kind) {
      case "suitcase": case "suit-cabin": case "suit-medium": case "suit-large": case "suit-lite": case "suit-limited":
        var model = kind === "suitcase" ? "cabin" : kind.slice(5), w = 66 + 34 * s, h = 70 + 86 * s; rx = w * 0.6; body = suit(100 - w / 2, w, h, hex, ini, model !== "lite", model); break;
      case "pack2": rx = 90; body = suit(28, 64, 100, hex, "", true, "cabin") + suit(108, 84, 134, hex, "", true, "medium"); break;
      case "pack3": rx = 92; body = suit(8, 50, 86, hex, "", true, "cabin") + suit(68, 64, 116, hex, "", true, "medium") + suit(142, 52, 146, hex, "", true, "large"); break;
      case "backpack": body = '<path d="M86 56q14-20 28 0" ' + S(1, 4) + '/><rect x="56" y="52" width="88" height="130" rx="32" fill="' + hex + '"/><rect x="56" y="52" width="88" height="130" rx="32" fill="url(#sh)"/><rect x="70" y="112" width="60" height="52" rx="10" fill="rgba(0,0,0,.14)"/><path d="M70 100h60M78 124h44" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/><path d="M52 90q-6 40 4 70M148 90q6 40-4 70" ' + S(1, 3) + '/>'; break;
      case "duffel": rx = 76; body = '<path d="M64 104q36-52 72 0" ' + S(1, 5) + '/><rect x="22" y="96" width="156" height="84" rx="36" fill="' + hex + '"/><rect x="22" y="96" width="156" height="84" rx="36" fill="url(#sh)"/><path d="M48 124h104" stroke="rgba(0,0,0,.28)" stroke-width="1.5"/><path d="M62 100v76M138 100v76" stroke="rgba(0,0,0,.14)"/><rect x="86" y="144" width="28" height="6" rx="1" fill="rgba(255,255,255,.5)"/>'; break;
      case "briefcase": rx = 70; body = '<path d="M78 80v-12q0-6 6-6h32q6 0 6 6v12" ' + S(1, 5) + '/><rect x="28" y="78" width="144" height="100" rx="8" fill="' + hex + '"/><rect x="28" y="78" width="144" height="100" rx="8" fill="url(#sh)"/><path d="M28 118h144" stroke="rgba(0,0,0,.3)" stroke-width="1.5"/><rect x="58" y="110" width="18" height="14" rx="2" ' + F(2) + ' stroke="rgba(0,0,0,.25)"/><rect x="124" y="110" width="18" height="14" rx="2" ' + F(2) + ' stroke="rgba(0,0,0,.25)"/><rect x="34" y="84" width="132" height="88" rx="4" fill="none" stroke="rgba(255,255,255,.14)" stroke-dasharray="3 3"/>'; break;
      case "kids": rx = 52; body = suit(66, 68, 104, hex, "", true) + '<rect x="66" y="' + (BOT - 52) + '" width="68" height="7" fill="rgba(255,255,255,.35)"/><path d="M130 ' + (BOT - 104) + 'q22 10 14 40" ' + S(2, 2) + '/><rect x="138" y="' + (BOT - 66) + '" width="14" height="20" rx="2" fill="' + hex + '"/>'; break;
      case "underseat": rx = 78; body = '<path d="M58 102q42-34 84 0" ' + S(1, 4) + '/><rect x="22" y="98" width="156" height="82" rx="24" fill="' + hex + '"/><rect x="22" y="98" width="156" height="82" rx="24" fill="url(#sh)"/><rect x="46" y="130" width="108" height="36" rx="10" fill="rgba(0,0,0,.16)"/><path d="M46 140h108" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-dasharray="3 3"/><path d="M30 112q-14 28 0 56M170 112q14 28 0 56" ' + S(1, 3) + '/><circle cx="100" cy="117" r="4" fill="#2f5bff"/>'; break;
      case "toiletry": rx = 62; body = '<path d="M96 100q4-22 22-20" ' + S(2, 2) + '/><circle cx="122" cy="80" r="6" fill="#2f5bff"/><rect x="44" y="100" width="112" height="78" rx="18" fill="' + hex + '"/><rect x="44" y="100" width="112" height="78" rx="18" fill="url(#sh)"/><path d="M56 112h88" stroke="rgba(0,0,0,.3)" stroke-width="2" stroke-dasharray="4 3"/><rect x="92" y="107" width="16" height="10" rx="3" fill="rgba(255,255,255,.7)"/><rect x="62" y="136" width="46" height="30" rx="6" fill="rgba(0,0,0,.14)"/><circle cx="130" cy="150" r="9" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>'; break;
      case "laptop": rx = 62; body = '<rect x="34" y="52" width="132" height="130" rx="14" fill="' + hex + '"/><rect x="34" y="52" width="132" height="130" rx="14" fill="url(#sh)"/><path d="M34 88h132" stroke="rgba(0,0,0,.28)" stroke-width="1.5"/><path d="M66 88V76q0-8 8-8h52q8 0 8 8v12" fill="rgba(0,0,0,.12)"/><rect x="50" y="108" width="100" height="62" rx="5" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="92" y="96" width="16" height="6" rx="2" fill="rgba(255,255,255,.7)"/>'; break;
      case "plug": rx = 58; body = '<rect x="52" y="64" width="96" height="108" rx="14" style="fill:var(--art-1)"/><rect x="52" y="64" width="96" height="108" rx="14" fill="url(#sh)"/><rect x="64" y="76" width="72" height="10" rx="5" style="fill:var(--art-3)"/><rect x="64" y="94" width="72" height="10" rx="5" style="fill:var(--art-3)"/><rect x="76" y="77.500" width="22" height="7" rx="3.500" fill="#2f5bff"/><rect x="100" y="95.500" width="22" height="7" rx="3.500" fill="#2f5bff"/><rect x="64" y="126" width="12" height="32" rx="4" style="fill:var(--art-3)"/><rect x="82" y="126" width="12" height="32" rx="4" style="fill:var(--art-3)"/><rect x="100" y="126" width="12" height="32" rx="4" style="fill:var(--art-3)"/><rect x="118" y="126" width="12" height="32" rx="4" style="fill:var(--art-3)"/><rect x="68" y="136" width="4" height="10" rx="2" fill="#2f5bff"/><path d="M82 64V46M118 64V46" ' + S(2, 5) + '/>'; break;
      case "pillow": rx = 72; body = '<path d="M30 118a70 64 0 0 1 140 0v30a24 24 0 0 1-24 24h-6a16 16 0 0 1-16-16v-24a34 34 0 0 0-68 0v24a16 16 0 0 1-16 16h-6a24 24 0 0 1-24-24z" fill="' + hex + '"/><path d="M30 118a70 64 0 0 1 140 0v30a24 24 0 0 1-24 24h-6a16 16 0 0 1-16-16v-24a34 34 0 0 0-68 0v24a16 16 0 0 1-16 16h-6a24 24 0 0 1-24-24z" fill="url(#sh)"/><path d="M44 112a56 52 0 0 1 112 0" stroke="rgba(255,255,255,.3)" stroke-width="1.5" fill="none" stroke-dasharray="4 4"/><rect x="92" y="66" width="16" height="6" rx="2" fill="rgba(255,255,255,.55)"/>'; break;
      case "wheelkit": rx = 70; body = [[62, 66], [138, 66], [62, 142], [138, 142]].map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="28" ' + F(1) + '/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="17" fill="' + hex + '"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="17" fill="url(#sh)"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="5" ' + F(1) + '/>'; }).join("") + '<path d="M96 104h8M100 100v8" stroke="var(--art-2)" stroke-width="2" stroke-linecap="round"/>'; break;
      case "engrave": body = suit(54, 92, 140, hex, ini || "AB", false); break;
      case "wheel": body = '<circle cx="100" cy="110" r="54" ' + F(1) + '/><circle cx="100" cy="110" r="36" fill="' + hex + '"/><circle cx="100" cy="110" r="36" fill="url(#sh)"/><circle cx="100" cy="110" r="10" ' + F(1) + '/><path d="M100 74v72M64 110h72M74 84l52 52M126 84l-52 52" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/><rect x="68" y="34" width="64" height="10" rx="3" fill="' + hex + '"/>'; break;
      case "cover": body = '<rect x="38" y="40" width="124" height="146" rx="14" fill="none" stroke="' + hex + '" stroke-width="2" stroke-dasharray="5 5"/><rect x="38" y="40" width="124" height="146" rx="14" fill="' + hex + '" opacity=".16"/>' + suit(66, 68, 110, "#b9bdc6", "", false).replace(/<circle[^>]*\/>/g, ""); break;
      case "tag": body = '<path d="M100 20v38" ' + S(1, 3) + '/><rect x="62" y="56" width="76" height="116" rx="6" fill="' + hex + '"/><rect x="62" y="56" width="76" height="116" rx="6" fill="url(#sh)"/><circle cx="100" cy="74" r="6" fill="var(--bg)"/><rect x="68" y="88" width="64" height="78" rx="3" fill="none" stroke="rgba(255,255,255,.4)" stroke-dasharray="3 3"/><text x="100" y="138" text-anchor="middle" font-family="' + FG.FONTS[curFont].f + '" font-weight="' + FG.FONTS[curFont].w + '" font-size="' + 22 * FG.FONTS[curFont].k + '" fill="rgba(255,255,255,.92)" letter-spacing="' + FG.FONTS[curFont].ls + '">' + FG.esc(ini || "FG") + '</text>'; break;
      case "battery": body = '<rect x="42" y="68" width="116" height="74" rx="8" ' + F(1) + '/><rect x="158" y="92" width="8" height="26" rx="2" ' + F(2) + '/><path d="M58 84v42M72 84v42M86 84v42" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/><path d="M122 80l-16 26h14l-6 22 20-30h-14z" fill="#2f5bff"/>'; break;
      case "charger": body = '<rect x="64" y="52" width="72" height="76" rx="8" style="fill:var(--art-3);stroke:var(--art-2)" stroke-width="1.5"/><rect x="90" y="128" width="20" height="24" rx="3" ' + F(2) + '/><path d="M100 152v28" ' + S(2, 4) + '/><rect x="88" y="70" width="24" height="10" rx="2" ' + F(1) + '/>'; break;
      case "lock": body = '<path d="M72 98V78a28 28 0 0 1 56 0v20" ' + S(2, 9) + '/><rect x="54" y="96" width="92" height="76" rx="8" ' + F(1) + '/><circle cx="100" cy="128" r="8" style="fill:var(--bg)"/><rect x="98" y="132" width="4" height="14" style="fill:var(--bg)"/>'; break;
      case "strap": body = '<rect x="14" y="88" width="172" height="24" rx="2" fill="' + hex + '"/><rect x="14" y="88" width="172" height="24" fill="url(#sh)"/><rect x="82" y="80" width="36" height="40" rx="4" ' + S(1, 4) + '/><path d="M20 100h56M124 100h56" stroke="rgba(255,255,255,.35)" stroke-dasharray="3 4"/>'; break;
      case "organizer": body = '<rect x="26" y="78" width="68" height="94" rx="6" ' + F(2) + '/><rect x="104" y="48" width="72" height="124" rx="6" ' + F(1) + '/><path d="M26 98h68M104 70h72" stroke="rgba(0,0,0,.22)" stroke-width="1.5"/><rect x="52" y="108" width="16" height="4" rx="1" fill="rgba(255,255,255,.7)"/><rect x="132" y="82" width="16" height="4" rx="1" fill="rgba(255,255,255,.4)"/>'; break;
      case "scale": body = '<path d="M100 36v-8" ' + S(2, 3) + '/><rect x="68" y="36" width="64" height="112" rx="10" ' + F(1) + '/><rect x="76" y="48" width="48" height="28" rx="3" style="fill:var(--bg)"/><text x="100" y="68" text-anchor="middle" font-family="Archivo,sans-serif" font-size="14" style="fill:var(--ink)">23.4</text><path d="M100 148v22" ' + S(2, 3) + '/>'; break;
      case "shield": body = '<path d="M100 32l56 20v44c0 38-24 62-56 76-32-14-56-38-56-76V52z" ' + F(1) + '/><path d="M76 104l18 18 32-38" fill="none" stroke="var(--bg)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'; break;
      case "app": body = '<rect x="64" y="28" width="72" height="144" rx="12" ' + F(1) + '/><rect x="70" y="42" width="60" height="112" rx="4" ' + F(3) + '/><path d="M70 82h60M70 112h60M92 42v112M112 42v112" stroke="var(--art-2)" stroke-width="1"/><circle cx="100" cy="98" r="5" fill="#2f5bff"/><circle cx="100" cy="98" r="12" fill="none" stroke="#2f5bff" opacity=".4"/>'; break;
      case "tools": body = '<g transform="rotate(-45 100 100)"><rect x="92" y="60" width="16" height="104" rx="6" ' + F(1) + '/><path d="M80 66a20 20 0 0 1 40 0v14H80z" ' + F(1) + '/><path d="M92 40h16v26H92z" style="fill:var(--bg)"/></g>'; break;
      case "building": body = '<rect x="54" y="40" width="92" height="140" ' + F(1) + '/>' + [0, 1, 2, 3].map(function (r) { return [0, 1, 2].map(function (c) { return '<rect x="' + (66 + c * 26) + '" y="' + (54 + r * 30) + '" width="14" height="16" ' + F(3) + ' opacity="' + ((r + c) % 2 ? 1 : .5) + '"/>'; }).join(""); }).join(""); break;
      default: body = '<rect x="60" y="60" width="80" height="80" rx="6" fill="' + hex + '"/>';
    }
    return '<svg viewBox="0 0 200 200" role="img" aria-hidden="true" focusable="false">' + DEFS + '<ellipse cx="100" cy="191" rx="' + rx + '" ry="3.5" fill="#000" opacity=".12"/>' + body + '</svg>';
  };
  FG.productArt = function (p, color, ini, font) {
    var c = color || (p.colors && p.colors[0]) || (p.kind === "tag" ? "cuero" : "azul");
    return FG.art(p.kind, c, { scale: p.scale, initials: ini, font: font });
  };
})();
