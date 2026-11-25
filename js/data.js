/* Fuente única de datos del catálogo. */
(function () {
  var COLORS = {
    grafito:   { name: "Grafito",     hex: "#3a3f4a" },
    arena:     { name: "Arena",       hex: "#d6c3a1" },
    azul:      { name: "Azul noche",  hex: "#16275a" },
    salvia:    { name: "Salvia",      hex: "#9db89a" },
    hielo:     { name: "Blanco hielo", hex: "#eaf1f7" },
    coral:     { name: "Coral",       hex: "#ff7e6b" },
    negro:     { name: "Negro",       hex: "#121316" },
    cuero:     { name: "Cuero",       hex: "#9a6a3c" },
    bosque:    { name: "Verde bosque", hex: "#1f4d3a" },
    rojo:      { name: "Rojo",        hex: "#c8102e" }
  };
  var SUIT = ["grafito", "arena", "azul", "salvia", "hielo", "coral", "negro", "rojo"];
  var BAG = ["grafito", "arena", "azul", "salvia", "hielo", "coral", "negro"];

  var CATS = {
    maletas:         { name: "Maletas",         desc: "Maletas inteligentes que te siguen y se localizan solas." },
    equipaje:        { name: "Packs",           desc: "Dos o tres maletas FindGo en el mismo color, con descuento." },
    bolsas:          { name: "Bolsas",          desc: "Mochilas, bolsas y maletines para cada tipo de viaje." },
    personalizacion: { name: "Personalización", desc: "Hazla tuya: iniciales, colores y diseños propios." },
    accesorios:      { name: "Accesorios",      desc: "Baterías, cargadores, fundas y pequeños imprescindibles." },
    servicios:       { name: "Servicios",       desc: "Garantía, app Premium, reparación y soluciones para empresas." }
  };

  var SPEC_MOVE = [
    ["Follow Me", "Te sigue por el aeropuerto con sensores y cámara"],
    ["Batería de movimiento", "98 Wh, extraíble con un clic desde fuera"],
    ["Autonomía de seguimiento", "3 a 4 horas (objetivo de diseño)"],
    ["Módulo localizador", "Pila de botón fija, activo durante meses"],
    ["Power bank", "USB-C en cabina con la batería extraída"],
    ["Sin batería", "Las ruedas giran libres (modo manual)"]
  ];

  var P = [
    // MALETAS
    { id: "cabin", cat: "maletas", name: "FindGo Cabin 55 cm", price: 349, kind: "suit-cabin", scale: .78, size: "cabina", func: "maleta", trip: "escapada",
      short: "La de cabina: Follow Me, localización y power bank.", colors: SUIT, initials: true, followMe: true, litres: "38 L", weight: "3,9 kg", tag: "Más vendida",
      desc: "Cabe en cabina en casi todas las aerolíneas. Te sigue por el aeropuerto, la ves en el mapa aunque esté facturada y su batería extraíble carga tu móvil.", spec: SPEC_MOVE },
    { id: "medium", cat: "maletas", name: "FindGo Medium 65 cm", price: 399, kind: "suit-medium", scale: .9, size: "mediano", func: "maleta", trip: "largo",
      short: "Para semanas fuera. Tres ideas clave en un solo cuerpo.", colors: SUIT, initials: true, followMe: true, litres: "65 L", weight: "4,6 kg",
      desc: "El tamaño ideal para una semana o dos. Misma tecnología que la Cabin con más capacidad.", spec: SPEC_MOVE },
    { id: "large", cat: "maletas", name: "FindGo Large 75 cm", price: 449, kind: "suit-large", scale: 1, size: "grande", func: "maleta", trip: "familia",
      short: "Máxima capacidad para viajes largos o en familia.", colors: SUIT, initials: true, followMe: true, litres: "92 L", weight: "5,3 kg",
      desc: "La más grande de la gama. Pensada para viajes largos o para repartir equipaje entre varias personas.", spec: SPEC_MOVE },
    { id: "lite", cat: "maletas", name: "FindGo Lite 55 cm", price: 229, kind: "suit-lite", scale: .78, size: "cabina", func: "maleta", trip: "escapada",
      short: "Solo GPS: sin Follow Me, sin batería extraíble.", colors: SUIT, initials: true, followMe: false, litres: "38 L", weight: "3,1 kg", tag: "Solo GPS",
      desc: "La opción más ligera y económica. Incluye el módulo localizador con pila de botón fija, pero no lleva Follow Me ni batería de movimiento, así que puede facturarse tal cual.",
      spec: [["Follow Me", "No incluido"], ["Módulo localizador", "Pila de botón fija, activo durante meses"], ["Batería extraíble", "No lleva: se factura sin retirar nada"], ["Peso", "3,1 kg"]] },

    { id: "cabin-limited", cat: "maletas", name: "FindGo Cabin Edición Limitada 55 cm", price: 429, kind: "suit-limited", scale: .78, size: "cabina", func: "maleta", trip: "escapada",
      short: "La Cabin en verde bosque con detalles dorados.", colors: ["bosque"], initials: true, followMe: true, litres: "38 L", weight: "3,9 kg", tag: "Edición limitada",
      desc: "La misma Cabin con Follow Me, localización y batería extraíble, en un verde bosque exclusivo con franja dorada. Tirada limitada y disponible en un único color.", spec: SPEC_MOVE },

    // EQUIPAJE
    { id: "pack-viaje", cat: "equipaje", name: "Pack Viaje (Cabin + Medium)", price: 699, kind: "pack2", size: "pack", func: "pack", trip: "largo", was: 748,
      short: "Cabin 55 cm y Medium 65 cm. Ahorras 49 €.", colors: SUIT, initials: false, tag: "Ahorras 49 €",
      desc: "Dos maletas FindGo en el mismo color: la de cabina para el viaje corto y la mediana para el largo." },
    { id: "pack-familia", cat: "equipaje", name: "Pack Familia (Cabin + Medium + Large)", price: 1049, kind: "pack3", size: "pack", func: "pack", trip: "familia", was: 1197,
      short: "Las tres maletas. Ahorras 148 €.", colors: SUIT, initials: false, tag: "Ahorras 148 €",
      desc: "Las tres tallas FindGo en el mismo color, para no perder de vista a ninguna." },
    { id: "mochila-day", cat: "bolsas", name: "Mochila Day", price: 149, kind: "backpack", size: "pequeno", func: "mochila", trip: "escapada",
      short: "Mochila diaria con bolsillo localizador.", colors: BAG, initials: false, litres: "22 L",
      desc: "Mochila de uso diario con bolsillo antirrobo para el tag localizador y puerto USB-C externo." },
    { id: "weekender", cat: "bolsas", name: "Bolsa Weekender", price: 129, kind: "duffel", size: "mediano", func: "bolsa", trip: "escapada",
      short: "Para escapadas de fin de semana.", colors: BAG, initials: false, litres: "40 L",
      desc: "Bolsa blanda que se cuelga sobre el asa de la maleta. Cabe bajo el asiento en la mayoría de vuelos." },
    { id: "underseat", cat: "bolsas", name: "Bolsa Bajo el Asiento", price: 79, kind: "underseat", size: "pequeno", func: "bolsa", trip: "escapada",
      short: "Cabe bajo el asiento de la mayoría de vuelos.", colors: BAG, initials: false, litres: "18 L",
      desc: "Bolsa blanda de 40 × 20 × 25 cm para llevar lo imprescindible sin gastar espacio en el compartimento. Lleva bolsillo para el tag localizador y se cuelga del asa de la maleta." },
    { id: "maletin", cat: "bolsas", name: "Maletín Negocios", price: 179, kind: "briefcase", size: "pequeno", func: "trabajo", trip: "negocios",
      short: "Portátil de hasta 16\" y acabado en cuero.", colors: ["negro", "grafito", "azul", "cuero"], initials: false,
      desc: "Maletín para portátil de hasta 16 pulgadas con compartimento para el cargador y encaje en el asa de la maleta." },
    { id: "kids", cat: "bolsas", name: "FindGo Kids", price: 179, kind: "kids", size: "pequeno", func: "infantil", trip: "familia",
      short: "Maleta infantil que se localiza y se monta.", colors: ["coral", "salvia", "azul", "hielo"], initials: false, litres: "18 L",
      desc: "Maleta pequeña para los más viajeros, con módulo localizador. Se puede montar y se lleva de la mano." },

    // PERSONALIZACION
    { id: "p-iniciales", cat: "personalizacion", name: "Iniciales grabadas", price: 19, kind: "engrave", size: "-", func: "grabado", trip: "-", nonReturnable: true, initials: true, needsInitials: true,
      short: "Hasta 3 letras grabadas en la maleta.", desc: "Grabado láser de hasta tres iniciales. Al ser un producto personalizado no admite devolución salvo defecto (art. 103 TRLGDCU)." },
    { id: "p-asas", cat: "personalizacion", name: "Asas y ruedas de color", price: 25, kind: "wheel", size: "-", func: "color", trip: "-", colors: SUIT.concat("cuero"),
      short: "Cambia el color de asas y ruedas.", desc: "Kit de asas y ruedas en el color que elijas, para que tu maleta sea fácil de reconocer en la cinta." },
    { id: "p-funda-diseno", cat: "personalizacion", name: "Funda con tu diseño", price: 45, kind: "cover", size: "-", func: "funda", trip: "-", nonReturnable: true,
      short: "Sube tu imagen y la imprimimos.", desc: "Funda protectora impresa con la imagen que tú elijas. Producto personalizado: no admite devolución salvo defecto (art. 103 TRLGDCU)." },
    { id: "p-etiqueta", cat: "personalizacion", name: "Etiqueta de cuero grabada", price: 18, kind: "tag", size: "-", func: "etiqueta", trip: "-", nonReturnable: true, initials: true, needsInitials: true,
      short: "Etiqueta de cuero con tus iniciales.", desc: "Etiqueta de cuero con grabado a tu nombre o iniciales. Producto personalizado: no admite devolución salvo defecto (art. 103 TRLGDCU)." },

    // ACCESORIOS
    { id: "bateria", cat: "accesorios", name: "Batería extra 98 Wh", price: 59, kind: "battery", size: "-", func: "energia", trip: "-",
      short: "Segunda batería de movimiento, extraíble.", desc: "Batería de repuesto de 98 Wh (por debajo del límite de 100 Wh para cabina). Compatible con toda la gama Follow Me." },
    { id: "cargador", cat: "accesorios", name: "Cargador USB-C", price: 35, kind: "charger", size: "-", func: "energia", trip: "-",
      short: "Carga rápida para la batería.", desc: "Cargador USB-C de carga rápida para la batería de movimiento." },
    { id: "funda", cat: "accesorios", name: "Funda protectora", price: 29, kind: "cover", size: "-", func: "funda", trip: "-",
      short: "Funda transparente por tallas (29 a 39 €).", variants: [{ n: "Cabin", price: 29 }, { n: "Medium", price: 34 }, { n: "Large", price: 39 }],
      desc: "Funda resistente al rozamiento y a la lluvia. Elige la talla de tu maleta." },
    { id: "tag", cat: "accesorios", name: "Tag localizador", price: 25, kind: "tag", size: "-", func: "localizador", trip: "-",
      short: "Localizador con pila para cualquier bolsa.", desc: "El mismo módulo localizador de FindGo para mochilas, bolsos y llaves." },
    { id: "candado", cat: "accesorios", name: "Candado TSA", price: 19, kind: "lock", size: "-", func: "seguridad", trip: "-",
      short: "Candado homologado TSA.", desc: "Candado de combinación que los agentes de seguridad pueden abrir sin romperlo." },
    { id: "correa", cat: "accesorios", name: "Correa", price: 15, kind: "strap", size: "-", func: "seguridad", trip: "-", colors: ["coral", "azul", "negro", "salvia"],
      short: "Correa para identificar tu maleta.", desc: "Correa ajustable que mantiene cerrada la maleta y la hace inconfundible." },
    { id: "organizadores", cat: "accesorios", name: "Organizadores", price: 24, kind: "organizer", size: "-", func: "orden", trip: "-",
      short: "Set de 3 organizadores.", desc: "Tres cubos de distintos tamaños para separar ropa, calzado y neceser." },
    { id: "bascula", cat: "accesorios", name: "Báscula de equipaje", price: 22, kind: "scale", size: "-", func: "orden", trip: "-",
      short: "Evita sorpresas en el mostrador.", desc: "Báscula digital de mano hasta 50 kg." },

    { id: "neceser", cat: "accesorios", name: "Neceser con localizador", price: 39, kind: "toiletry", size: "-", func: "orden", trip: "-", colors: ["grafito", "azul", "salvia", "coral"],
      short: "Neceser con tag localizador integrado.", desc: "Neceser impermeable con cremallera amplia y un bolsillo con localizador integrado, para no perder lo que más se olvida." },
    { id: "laptop", cat: "accesorios", name: "Funda para portátil", price: 29, kind: "laptop", size: "-", func: "funda", trip: "-", colors: ["negro", "grafito", "azul", "arena"], variantLabel: "Tamaño del portátil", variants: [{ n: "13 pulgadas", price: 29 }, { n: "15 pulgadas", price: 34 }, { n: "16 pulgadas", price: 39 }],
      short: "Acolchada, con bolsillo para el cargador (29 a 39 €).", desc: "Funda acolchada con cierre de cremallera y bolsillo para el cargador. Elige el tamaño de tu portátil." },
    { id: "adaptador", cat: "accesorios", name: "Adaptador de enchufe universal", price: 22, kind: "plug", size: "-", func: "energia", trip: "-",
      short: "Un adaptador para Europa, Reino Unido, EE. UU. y Australia.", desc: "Adaptador de enchufe universal con cuatro salidas de clavija y protección contra sobrecargas. Compatible con el cargador USB-C de FindGo." },
    { id: "almohada", cat: "accesorios", name: "Almohada de viaje", price: 26, kind: "pillow", size: "-", func: "comodidad", trip: "-", colors: ["grafito", "azul", "salvia", "coral"],
      short: "Almohada cervical de espuma viscoelástica.", desc: "Almohada cervical de espuma viscoelástica con funda lavable. Se pliega y cuelga de la maleta con un mosquetón." },
    { id: "kit-ruedas", cat: "accesorios", name: "Kit de recambio de ruedas", price: 29, kind: "wheelkit", size: "-", func: "reparacion", trip: "-",
      short: "Cuatro ruedas giratorias y la llave para cambiarlas.", desc: "Kit con cuatro ruedas dobles giratorias, ejes y llave, compatible con toda la gama FindGo. Se cambia en pocos minutos." },

    // SERVICIOS
    { id: "garantia", cat: "servicios", name: "Garantía ampliada", price: 39, kind: "shield", size: "-", func: "garantia", trip: "-", noDiscount: true,
      short: "2 años más (5 en total) con golpes accidentales.", desc: "Añade 2 años a la garantía de 3 años y cubre además golpes accidentales." },
    { id: "premium", cat: "servicios", name: "FindGo Premium", price: 2.99, kind: "app", size: "-", func: "app", trip: "-", monthly: true, noDiscount: true, single: true,
      short: "App, historial y alertas · 2,99 €/mes.", desc: "Historial de ubicaciones, alertas de movimiento y avisos de batería en la app. Suscripción mensual, cancelable desde Mi cuenta." },
    { id: "reparacion", cat: "servicios", name: "Reparación exprés", price: 25, kind: "tools", size: "-", func: "reparacion", trip: "-",
      short: "Revisión y reparación en 48 horas.", desc: "Servicio de reparación prioritaria: recogida, diagnóstico y devolución en 48 horas laborables." },
    { id: "empresas", cat: "servicios", name: "FindGo para empresas (B2B)", price: null, kind: "building", size: "-", func: "b2b", trip: "-", href: "empresas.html",
      short: "Flotas de maletas para equipos y eventos.", desc: "Condiciones especiales para empresas." }
  ];

  var MENU = [
    { cat: "maletas", feat: "cabin", cols: [
      { t: "Por modelo", links: [["FindGo Cabin 55 cm", "producto.html?id=cabin"], ["FindGo Medium 65 cm", "producto.html?id=medium"], ["FindGo Large 75 cm", "producto.html?id=large"], ["FindGo Lite (solo GPS)", "producto.html?id=lite"]] },
      { t: "Descubre", links: [["Todas las maletas", "catalogo.html?cat=maletas"], ["Cómo funciona Follow Me", "index.html#follow-me"], ["Las dos baterías", "index.html#baterias"]] }
    ]},
    { cat: "equipaje", feat: "pack-familia", cols: [
      { t: "Packs", links: [["Pack Viaje (Cabin + Medium)", "producto.html?id=pack-viaje"], ["Pack Familia (Cabin + Medium + Large)", "producto.html?id=pack-familia"]] },
      { t: "Ver todo", links: [["Todos los packs", "catalogo.html?cat=equipaje"]] }
    ]},
    { cat: "bolsas", feat: "mochila-day", cols: [
      { t: "Por tamaño", links: [["Pequeño", "catalogo.html?cat=bolsas&size=pequeno"], ["Mediano", "catalogo.html?cat=bolsas&size=mediano"]] },
      { t: "Por función", links: [["Mochilas", "catalogo.html?cat=bolsas&func=mochila"], ["Bolsas", "catalogo.html?cat=bolsas&func=bolsa"], ["Trabajo", "catalogo.html?cat=bolsas&func=trabajo"], ["Infantil", "catalogo.html?cat=bolsas&func=infantil"]] },
      { t: "Por tipo de viaje", links: [["Escapada", "catalogo.html?cat=bolsas&trip=escapada"], ["Negocios", "catalogo.html?cat=bolsas&trip=negocios"], ["Familia", "catalogo.html?cat=bolsas&trip=familia"]] }
    ]},
    { cat: "personalizacion", feat: "p-iniciales", cols: [
      { t: "Personaliza", links: [["Iniciales grabadas", "producto.html?id=p-iniciales"], ["Asas y ruedas de color", "producto.html?id=p-asas"], ["Funda con tu diseño", "producto.html?id=p-funda-diseno"], ["Etiqueta de cuero", "producto.html?id=p-etiqueta"]] },
      { t: "Ver todo", links: [["Toda la personalización", "catalogo.html?cat=personalizacion"]] }
    ]},
    { cat: "accesorios", feat: "bateria", cols: [
      { t: "Energía", links: [["Batería extra", "producto.html?id=bateria"], ["Cargador USB-C", "producto.html?id=cargador"]] },
      { t: "Protección", links: [["Fundas", "producto.html?id=funda"], ["Candado TSA", "producto.html?id=candado"], ["Correa", "producto.html?id=correa"]] },
      { t: "Organiza", links: [["Tag localizador", "producto.html?id=tag"], ["Organizadores", "producto.html?id=organizadores"], ["Báscula", "producto.html?id=bascula"]] }
    ]},
    { cat: "servicios", feat: "premium", cols: [
      { t: "Para ti", links: [["Garantía ampliada", "producto.html?id=garantia"], ["FindGo Premium", "producto.html?id=premium"], ["Reparación exprés", "producto.html?id=reparacion"]] },
      { t: "Para empresas", links: [["FindGo para empresas (B2B)", "empresas.html"], ["Devoluciones y garantía", "devoluciones.html"]] }
    ]}
  ];

  var COMPETITION = [
    ["Maletas que te siguen", "ForwardX (Ovis), Airwheel (SR5)", "600 a 900 €", "Caras, pesadas, casi sin personalización"],
    ["Maletas smart con batería", "Away, Samsonite (gamas USB)", "250 a 450 €", "No te siguen ni se localizan solas"],
    ["Maletas de marca tradicionales", "Samsonite, Rimowa, Delsey", "100 a 1.200 €", "Sin seguimiento ni app"],
    ["Localizadores", "Apple AirTag, Samsung SmartTag, Tile", "30 a 40 €", "Solo localizan y hay que acordarse de ponerlos"]
  ];


  var EXTRA = {
    cabin:  { dims: "55 × 40 × 23 cm", who: "Escapadas de 1 a 3 días", days: "corto", cabinOk: true },
    medium: { dims: "65 × 44 × 27 cm", who: "Viajes de 4 a 7 días", days: "semana", cabinOk: false },
    large:  { dims: "75 × 50 × 30 cm", who: "Viajes largos o en familia", days: "largo", cabinOk: false },
    lite:   { dims: "55 × 40 × 23 cm", who: "Quien solo quiere localizarla", days: "corto", cabinOk: true },
    "cabin-limited": { dims: "55 × 40 × 23 cm", who: "Quien quiere una Cabin diferente", days: "corto", cabinOk: true }
  };
  P.forEach(function (p) { var e = EXTRA[p.id]; if (e) for (var k in e) p[k] = e[k]; });

  var REVIEWS = [
    { n: "Marta R.", r: 5, t: "Por fin no pierdo la maleta de vista", x: "Con la app vi que la mía seguía en la cinta mientras esperaba. Me quitó mucha tensión.", p: "cabin" },
    { n: "Javier L.", r: 5, t: "La batería extraíble es lo mejor", x: "Facturé sin problemas: saqué la batería, la llevé en cabina y el localizador siguió funcionando.", p: "cabin" },
    { n: "Lucía P.", r: 5, t: "Tamaño perfecto para una semana", x: "La Medium aguanta de sobra una semana de ropa y el Follow Me va genial por la terminal.", p: "medium" },
    { n: "Carlos M.", r: 5, t: "Viajamos cuatro con las tres tallas", x: "Pedimos el Pack Familia en el mismo color y así no nos confundimos en la cinta.", p: "large" },
    { n: "Elena S.", r: 5, t: "Calidad-precio inmejorable", x: "Compré la Lite por el localizador y estoy encantada: ligera, bonita y siempre sé dónde está.", p: "lite" },
    { n: "Pablo G.", r: 5, t: "El Follow Me impresiona", x: "En la T4 me siguió sin problema hasta la puerta de embarque. La gente se quedaba mirando.", p: "cabin" },
    { n: "Nuria V.", r: 4, t: "Muy práctica", x: "Me encanta poder cargar el móvil con la batería mientras espero el embarque.", p: "cabin" },
    { n: "Andrés T.", r: 5, t: "Cabe en cabina sin problemas", x: "La he llevado en tres aerolíneas distintas y nunca me han puesto pegas con las medidas.", p: "cabin" },
    { n: "Irene C.", r: 5, t: "La app es una maravilla", x: "Ver en el mapa dónde está la maleta te da muchísima tranquilidad. Muy buena calidad.", p: "cabin" },
    { n: "Sergio D.", r: 5, t: "Las iniciales quedan geniales", x: "Pedí mis iniciales con letra elegante y en la cinta la reconozco al momento.", p: "cabin" },
    { n: "Lorena B.", r: 5, t: "La localicé en otra cinta", x: "Mi maleta salió por la cinta equivocada y la encontré en dos minutos gracias al mapa.", p: "medium" },
    { n: "Óscar L.", r: 5, t: "Enorme y resistente", x: "Cabe todo lo de un viaje largo y llega impecable vuelo tras vuelo.", p: "large" },
    { n: "Alicia F.", r: 5, t: "Ligera de verdad", x: "Con 3,1 kg me deja más margen para el peso de cabina. Encantada.", p: "lite" },
    { n: "Mario Z.", r: 5, t: "Tranquilidad en cada viaje", x: "Saber dónde está la maleta en todo momento no tiene precio.", p: "lite" },
    { n: "Raquel M.", r: 5, t: "Perfecta para diez días", x: "Me cupo la ropa de diez días en Italia y aún sobró espacio para traer cosas.", p: "medium" },
    { n: "Diego F.", r: 5, t: "Buenísima compra", x: "El seguimiento funciona de maravilla y la maleta es comodísima de llevar.", p: "medium" },
    { n: "Tomás R.", r: 5, t: "Mucha capacidad", x: "Ideal para viajes en familia. Las correas la mantienen perfecta aunque vaya muy llena.", p: "large" },
    { n: "Beatriz H.", r: 5, t: "Resistente de verdad", x: "Ha volado ya seis veces facturada y no tiene ni un arañazo en las esquinas.", p: "large" },
    { n: "Marina P.", r: 5, t: "Ligera y con GPS", x: "No necesitaba el Follow Me. Con saber dónde está me basta y es muy ligera.", p: "lite" },
    { n: "Hugo S.", r: 5, t: "Sencilla y útil", x: "Ligera, bonita y con GPS. Para escapadas cortas es perfecta.", p: "lite" },
    { n: "Clara J.", r: 5, t: "Preciosa en verde", x: "El verde con la franja dorada es todavía más bonito en persona.", p: "cabin-limited" },
    { n: "Rubén A.", r: 5, t: "Ahorro y mismo color", x: "Con el pack ahorré y las dos maletas combinan. Muy recomendable.", p: "pack-viaje" },
    { n: "Silvia N.", r: 5, t: "Pack muy completo", x: "Las dos tallas son muy útiles y llegaron bien protegidas. Repetiría.", p: "pack-viaje" },
    { n: "Jorge E.", r: 5, t: "Mochila del día a día", x: "La uso para ir a clase y al trabajo. El bolsillo del localizador es muy cómodo.", p: "mochila-day" },
    { n: "Paula K.", r: 5, t: "Comodísima", x: "La llevo todos los días y caben el portátil y todo lo demás.", p: "mochila-day" },
    { n: "Alberto Q.", r: 5, t: "Imprescindible para viajes largos", x: "Con la batería extra hice una escala de seis horas sin preocuparme del Follow Me.", p: "bateria" },
    { n: "Eva G.", r: 5, t: "Cumple lo que promete", x: "Se cambia en segundos y aguanta todo el día. Muy recomendable.", p: "bateria" },
    { n: "Iván M.", r: 5, t: "Lo llevo en las llaves", x: "Pequeño, ligero y la pila dura meses. Ya no pierdo las llaves.", p: "tag" },
    { n: "Natalia R.", r: 5, t: "Sin sustos en el control", x: "En Estados Unidos lo abrieron sin romperlo, justo lo que buscaba.", p: "candado" },
    { n: "Fernando C.", r: 5, t: "Cabe bajo el asiento", x: "Perfecta para vuelos baratos: ni un euro de más en equipaje.", p: "underseat" },
    { n: "Lucía G.", r: 5, t: "Dormí todo el vuelo", x: "Se adapta bien al cuello y se guarda en nada.", p: "almohada" }
  ];
  // La valoración y el número de opiniones salen solo de las opiniones que existen
  P.forEach(function (p) {
    var mine = REVIEWS.filter(function (r) { return r.p === p.id; });
    if (mine.length) { p.reviews = mine.length; p.rating = Math.round(mine.reduce(function (a, r) { return a + r.r; }, 0) / mine.length * 10) / 10; }
  });
  var FAQ = [
    ["¿Puedo facturar la maleta con batería?", "Sí, pero la batería de movimiento (98 Wh) se saca con un clic desde fuera y viaja contigo en cabina, como exigen las aerolíneas (norma IATA). El módulo localizador lleva una pila de botón fija, permitida en bodega, y sigue activo."],
    ["¿Cuánto dura el Follow Me?", "El objetivo de diseño es de 3 a 4 horas de seguimiento por carga. La app te avisa al 20 % y recuerda sacar la batería al llegar al aeropuerto."],
    ["¿Qué pasa si se agota la batería?", "Las ruedas giran libres y la maleta funciona como una maleta normal. Puedes llevar una batería extra (59 €)."],
    ["¿Cabe en cabina?", "La FindGo Cabin (55 cm) y la Lite cumplen las medidas habituales, pero las aerolíneas varían: comprueba las condiciones de la tuya antes de volar."],
    ["¿Cómo funciona la devolución?", "Tienes 30 días, la recogida es gratis y el reembolso llega en un máximo de 14 días. Las maletas con iniciales grabadas no se pueden devolver salvo defecto (art. 103 TRLGDCU)."],
    ["¿La ubicación de mi maleta es privada?", "Solo tú la ves. El historial se borra a los 30 días. Más detalle en la política de privacidad."]
  ];

  // Tipos de letra para las iniciales: f = familia CSS, w = grosor, k = tamaño relativo, ls = espaciado
  var FONTS = {
    clasica:   { n: "Clásica",           f: "Archivo, sans-serif",              w: 500, k: 1,    ls: 3 },
    elegante:  { n: "Elegante",          f: "'Playfair Display', serif",        w: 600, k: 1,    ls: 2 },
    manuscrita:{ n: "Manuscrita",        f: "'Dancing Script', cursive",        w: 600, k: 1.25, ls: 1 },
    maquina:   { n: "Máquina de escribir", f: "'Special Elite', monospace",     w: 400, k: .95,  ls: 3 },
    redondeada:{ n: "Redondeada",        f: "Fredoka, sans-serif",              w: 500, k: 1.05, ls: 3 }
  };

  // Orden de «más vendidos» (ilustrativo: la tienda es de ejemplo y no tiene ventas reales)
  var BEST = ["cabin", "medium", "bateria", "candado", "lite", "mochila-day", "large", "tag", "pack-viaje", "funda", "premium", "weekender", "p-iniciales", "cargador", "cabin-limited", "almohada", "adaptador", "maletin", "kids", "pack-familia", "correa", "bascula", "organizadores", "neceser", "underseat", "laptop", "kit-ruedas", "p-asas", "p-etiqueta", "p-funda-diseno", "garantia", "reparacion", "empresas"];

  window.FG = window.FG || {};
  FG.BESTSELLERS = BEST;
  FG.FONTS = FONTS;
  FG.COLORS = COLORS; FG.CATS = CATS; FG.PRODUCTS = P; FG.MENU = MENU; FG.COMPETITION = COMPETITION; FG.REVIEWS = REVIEWS; FG.FAQ = FAQ;
  FG.product = function (id) { return P.filter(function (p) { return p.id === id; })[0]; };
})();
