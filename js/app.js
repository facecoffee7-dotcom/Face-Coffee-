/* ============================================================
   FACE COFFEE — Lógica del sitio público
   ============================================================ */

/* ---------- Diccionario de idiomas (interfaz) ---------- */
const I18N = {
  es: {
    carrito: "Pedido", ver_menu: "Ver menú", como_llegar: "Cómo llegar",
    ubicanos: "📍 Ubícanos", horario: "🕒 Horario", contacto: "📲 Contacto",
    no_seas_quedao: "¡No te sea quedao, te esperamos veci! 😎",
    tu_pedido: "🧾 Tu pedido", carrito_vacio: "Tu carrito está vacío. ¡Agrega algo bien chevere!",
    tipo_entrega: "Tipo de entrega", recoger: "Recoger en local", delivery: "Delivery",
    direccion_entrega: "Dirección de entrega", metodo_pago: "Método de pago",
    efectivo: "Efectivo", transferencia: "Transferencia",
    pago_linea: "Pago en línea (coordinar por WhatsApp)",
    tu_nombre: "Tu nombre", total: "Total", enviar_whatsapp: "Enviar pedido por WhatsApp",
    agregado: "¡Agregado al pedido!", fuera_horario: "Estamos cerrados ahora, pero igual puedes dejarnos tu pedido y lo confirmamos por WhatsApp.",
    agotado: "Agotado", agregar: "Agregar", nombre_requerido: "Escribe tu nombre para continuar",
    direccion_requerida: "Escribe la dirección de entrega"
  },
  en: {
    carrito: "Order", ver_menu: "View menu", como_llegar: "Get directions",
    ubicanos: "📍 Find us", horario: "🕒 Hours", contacto: "📲 Contact",
    no_seas_quedao: "Don't be shy, we're waiting for you! 😎",
    tu_pedido: "🧾 Your order", carrito_vacio: "Your cart is empty. Add something great!",
    tipo_entrega: "Delivery type", recoger: "Pickup", delivery: "Delivery",
    direccion_entrega: "Delivery address", metodo_pago: "Payment method",
    efectivo: "Cash", transferencia: "Bank transfer",
    pago_linea: "Online payment (coordinate via WhatsApp)",
    tu_nombre: "Your name", total: "Total", enviar_whatsapp: "Send order via WhatsApp",
    agregado: "Added to your order!", fuera_horario: "We're closed right now, but you can still send your order and we'll confirm it on WhatsApp.",
    agotado: "Sold out", agregar: "Add", nombre_requerido: "Please enter your name to continue",
    direccion_requerida: "Please enter the delivery address"
  }
};
let idiomaActual = localStorage.getItem("fc_idioma") || "es";

/* ---------- Estado ---------- */
let categorias = [];
let productos = [];
let config = {};
let carrito = JSON.parse(localStorage.getItem("fc_carrito") || "[]");
let tipoEntrega = "recoger";

/* ---------- Rayos del hero (SVG generado) ---------- */
function dibujarRayos(){
  const cx = 100, cy = 100, rInner = 34, rOuter = 96, n = 20;
  let puntos = [];
  for(let i=0;i<n*2;i++){
    const ang = (Math.PI*2*i)/(n*2);
    const r = i%2===0 ? rOuter : rInner;
    puntos.push(`${(cx+r*Math.cos(ang)).toFixed(1)},${(cy+r*Math.sin(ang)).toFixed(1)}`);
  }
  document.querySelector(".hero__rayos svg").innerHTML =
    `<polygon points="${puntos.join(" ")}" fill="#FFC629" stroke="#1C140F" stroke-width="1.5"/>`;
}
dibujarRayos();

/* ---------- Formato de precio ---------- */
function formatoPrecio(n){
  return "$" + Number(n).toFixed(2).replace(".", ",");
}

/* ---------- Aplicar traducciones a etiquetas estáticas ---------- */
function aplicarIdioma(){
  const dic = I18N[idiomaActual];
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const clave = el.getAttribute("data-i18n");
    if(dic[clave]) el.textContent = dic[clave];
  });
  document.getElementById("btnIdioma").textContent = idiomaActual === "es" ? "EN" : "ES";
  document.getElementById("eslogan").textContent = idiomaActual === "es" ? (config.eslogan_es || "¡Qué chevere!") : (config.eslogan_en || config.eslogan_es || "");
  document.getElementById("heroTexto").textContent = idiomaActual === "es" ? (config.mensaje_es || "") : (config.mensaje_en || config.mensaje_es || "");
  document.getElementById("mensajeCierre").textContent = dic.no_seas_quedao;
  renderMenu();
  renderCarrito();
}
document.getElementById("btnIdioma").addEventListener("click", ()=>{
  idiomaActual = idiomaActual === "es" ? "en" : "es";
  localStorage.setItem("fc_idioma", idiomaActual);
  aplicarIdioma();
});

/* ---------- Carga de datos desde Firestore ---------- */
let _catCargada = false, _prodCargado = false, _cfgCargada = false;
let _timeoutAviso = null;

function _intentarRenderizarInicial(){
  if(_catCargada && _prodCargado && _cfgCargada){
    clearTimeout(_timeoutAviso);
    renderChips();
    renderMenu();
    verificarHorario();
    aplicarIdioma();
  }
}

function cargarDatos(){
  // Si la conexión tarda demasiado, avisamos sin cortar la espera:
  // los listeners de abajo se quedan escuchando y se actualizan solos
  // en cuanto la conexión llega, incluso si tarda varios segundos.
  _timeoutAviso = setTimeout(()=>{
    document.getElementById("contenedorMenu").innerHTML =
      `<p style="text-align:center;padding:60px 0;">Cargando el menú… tu conexión está lenta, pero seguimos intentando. Si esto no cambia en un minuto, revisa tu internet o vuelve a intentarlo.</p>`;
  }, 8000);

  db.collection("categorias").orderBy("orden").onSnapshot(catSnap=>{
    categorias = catSnap.docs.map(d=>({ id:d.id, ...d.data() }));
    _catCargada = true;
    _intentarRenderizarInicial();
  }, err=>{
    console.error("Error escuchando categorías:", err);
  });

  db.collection("productos").orderBy("orden").onSnapshot(prodSnap=>{
    productos = prodSnap.docs.map(d=>({ id:d.id, ...d.data() }));
    _prodCargado = true;
    _intentarRenderizarInicial();
    renderMenu();
  }, err=>{
    console.error("Error escuchando productos:", err);
  });

  db.collection("config").doc("general").onSnapshot(cfgSnap=>{
    config = cfgSnap.exists ? cfgSnap.data() : {};
    document.getElementById("nombreNegocio").textContent = config.nombreNegocio || "Face Coffee";
    document.getElementById("direccionTexto").textContent = config.direccion || "";
    document.getElementById("linkInstagram").textContent = config.instagram || "Instagram";
    document.getElementById("linkInstagram").href = config.instagram ? `https://instagram.com/${config.instagram.replace("@","")}` : "#";
    const wa = (config.whatsapp || "").replace(/\D/g,"");
    document.getElementById("linkWhatsappFooter").href = wa ? `https://wa.me/593${wa.replace(/^0/,"")}` : "#";
    document.getElementById("linkWhatsappFooter").textContent = config.whatsapp || "";
    if(config.horarioApertura && config.horarioCierre){
      document.getElementById("horarioTexto").textContent = `${config.horarioApertura} – ${config.horarioCierre}`;
    }
    _cfgCargada = true;
    _intentarRenderizarInicial();
    verificarHorario();
    aplicarIdioma();
  }, err=>{
    console.error("Error escuchando config:", err);
  });
}

/* ---------- Aviso fuera de horario ---------- */
function verificarHorario(){
  if(!config.horarioApertura || !config.horarioCierre) return;
  const ahora = new Date();
  const [hA,mA] = config.horarioApertura.split(":").map(Number);
  const [hC,mC] = config.horarioCierre.split(":").map(Number);
  const minAhora = ahora.getHours()*60 + ahora.getMinutes();
  const abre = hA*60+mA, cierra = hC*60+mC;
  const dentro = abre < cierra ? (minAhora>=abre && minAhora<cierra) : (minAhora>=abre || minAhora<cierra);
  const aviso = document.getElementById("avisoHorario");
  if(!dentro){
    aviso.textContent = "🕒 " + I18N[idiomaActual].fuera_horario;
    aviso.classList.add("visible");
  } else {
    aviso.classList.remove("visible");
  }
}

/* ---------- Render de chips de categoría ---------- */
function renderChips(){
  const lista = document.getElementById("listaChips");
  lista.innerHTML = categorias.map(c=>{
    const nombre = idiomaActual==="es" ? c.nombre_es : (c.nombre_en||c.nombre_es);
    return `<a href="#cat-${c.id}" class="chip" data-cat="${c.id}">${c.emoji||""} ${nombre}</a>`;
  }).join("");
}

/* ---------- Render del menú ---------- */
function renderMenu(){
  const cont = document.getElementById("contenedorMenu");
  if(!categorias.length){
    cont.innerHTML = `<p style="text-align:center;padding:60px 0;">Todavía no hay productos cargados en el menú. Entra al panel de administración para cargarlos.</p>`;
    return;
  }
  cont.innerHTML = categorias.map(cat=>{
    const nombre = idiomaActual==="es" ? cat.nombre_es : (cat.nombre_en||cat.nombre_es);
    const subt = idiomaActual==="es" ? cat.subt_es : (cat.subt_en||cat.subt_es);
    const items = productos.filter(p=>p.categoria===cat.id).sort((a,b)=>(a.orden||0)-(b.orden||0));
    if(!items.length) return "";
    return `
      <div class="categoria" id="cat-${cat.id}">
        <h2 class="categoria__titulo">${cat.emoji||""} ${nombre}</h2>
        ${subt ? `<p class="categoria__subt">${subt}</p>` : ""}
        <div class="grid-productos">
          ${items.map(p=>tarjetaProducto(p)).join("")}
        </div>
      </div>`;
  }).join("");

  cont.querySelectorAll("[data-agregar]").forEach(btn=>{
    btn.addEventListener("click", ()=> agregarAlCarrito(btn.getAttribute("data-agregar")));
  });
}

function tarjetaProducto(p){
  const dic = I18N[idiomaActual];
  return `
    <div class="producto">
      <div class="producto__fila">
        <span class="producto__nombre">${p.nombre}</span>
        <span class="producto__precio mono">${formatoPrecio(p.precio)}</span>
      </div>
      ${p.descripcion ? `<span class="producto__desc">${p.descripcion}</span>` : ""}
      ${p.disponible===false ? `<span class="producto__agotado">${dic.agotado}</span>` : ""}
      <button class="producto__btn" data-agregar="${p.id}" ${p.disponible===false?"disabled":""}>
        ➕ ${dic.agregar}
      </button>
    </div>`;
}

/* ---------- Scroll-spy de chips ---------- */
window.addEventListener("scroll", ()=>{
  let actual = null;
  document.querySelectorAll(".categoria").forEach(sec=>{
    if(window.scrollY + 150 >= sec.offsetTop) actual = sec.id.replace("cat-","");
  });
  document.querySelectorAll(".chip").forEach(chip=>{
    chip.classList.toggle("activo", chip.getAttribute("data-cat")===actual);
  });
});

/* ---------- Carrito ---------- */
function guardarCarrito(){ localStorage.setItem("fc_carrito", JSON.stringify(carrito)); }

function agregarAlCarrito(idProducto){
  const prod = productos.find(p=>p.id===idProducto);
  if(!prod || prod.disponible===false) return;
  const existente = carrito.find(i=>i.id===idProducto);
  if(existente) existente.cant += 1;
  else carrito.push({ id: idProducto, nombre: prod.nombre, precio: prod.precio, cant: 1 });
  guardarCarrito();
  renderCarrito();
  mostrarToast(I18N[idiomaActual].agregado);
}

function cambiarCantidad(idProducto, delta){
  const item = carrito.find(i=>i.id===idProducto);
  if(!item) return;
  item.cant += delta;
  if(item.cant<=0) carrito = carrito.filter(i=>i.id!==idProducto);
  guardarCarrito();
  renderCarrito();
}

function quitarDelCarrito(idProducto){
  carrito = carrito.filter(i=>i.id!==idProducto);
  guardarCarrito();
  renderCarrito();
}

function totalCarrito(){ return carrito.reduce((s,i)=>s+i.precio*i.cant,0); }
function cantidadCarrito(){ return carrito.reduce((s,i)=>s+i.cant,0); }

function renderCarrito(){
  document.getElementById("contadorCarrito").textContent = cantidadCarrito();
  const lista = document.getElementById("listaCarrito");
  const opciones = document.getElementById("opcionesCarrito");
  const resumen = document.getElementById("resumenCarrito");
  const btnEnviar = document.getElementById("btnEnviarPedido");
  const dic = I18N[idiomaActual];

  if(!carrito.length){
    lista.innerHTML = `<p class="carrito__vacio">${dic.carrito_vacio}</p>`;
    opciones.style.display = "none";
    resumen.style.display = "none";
    btnEnviar.style.display = "none";
    return;
  }
  opciones.style.display = "flex";
  resumen.style.display = "block";
  btnEnviar.style.display = "flex";

  lista.innerHTML = carrito.map(i=>`
    <div class="item-carrito">
      <span class="item-carrito__nombre">${i.nombre}</span>
      <span class="item-carrito__precio">${formatoPrecio(i.precio*i.cant)}</span>
      <div class="item-carrito__controles">
        <button data-menos="${i.id}">−</button>
        <span>${i.cant}</span>
        <button data-mas="${i.id}">+</button>
      </div>
      <button class="item-carrito__quitar" data-quitar="${i.id}">✕</button>
    </div>`).join("");

  lista.querySelectorAll("[data-mas]").forEach(b=>b.addEventListener("click",()=>cambiarCantidad(b.getAttribute("data-mas"),1)));
  lista.querySelectorAll("[data-menos]").forEach(b=>b.addEventListener("click",()=>cambiarCantidad(b.getAttribute("data-menos"),-1)));
  lista.querySelectorAll("[data-quitar]").forEach(b=>b.addEventListener("click",()=>quitarDelCarrito(b.getAttribute("data-quitar"))));

  document.getElementById("totalCarrito").textContent = formatoPrecio(totalCarrito());
}

/* ---------- Abrir / cerrar carrito ---------- */
const elCarrito = document.getElementById("carrito");
const elOverlay = document.getElementById("overlay");
function abrirCarrito(){ elCarrito.classList.add("abierto"); elOverlay.classList.add("visible"); }
function cerrarCarrito(){ elCarrito.classList.remove("abierto"); elOverlay.classList.remove("visible"); }
document.getElementById("btnAbrirCarrito").addEventListener("click", abrirCarrito);
document.getElementById("btnCerrarCarrito").addEventListener("click", cerrarCarrito);
elOverlay.addEventListener("click", cerrarCarrito);

/* ---------- Tipo de entrega ---------- */
document.getElementById("btnRecoger").addEventListener("click", ()=>{
  tipoEntrega = "recoger";
  document.getElementById("btnRecoger").classList.add("activo");
  document.getElementById("btnDelivery").classList.remove("activo");
  document.getElementById("campoDireccion").style.display = "none";
});
document.getElementById("btnDelivery").addEventListener("click", ()=>{
  tipoEntrega = "delivery";
  document.getElementById("btnDelivery").classList.add("activo");
  document.getElementById("btnRecoger").classList.remove("activo");
  document.getElementById("campoDireccion").style.display = "flex";
});

/* ---------- Toast ---------- */
let toastTimeout;
function mostrarToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(()=>t.classList.remove("visible"), 1800);
}

/* ---------- Envío del pedido por WhatsApp ---------- */
document.getElementById("btnEnviarPedido").addEventListener("click", ()=>{
  const dic = I18N[idiomaActual];
  const nombre = document.getElementById("inputNombre").value.trim();
  const direccion = document.getElementById("inputDireccion").value.trim();
  const pago = document.getElementById("selectPago").value;

  if(!nombre){ mostrarToast(dic.nombre_requerido); return; }
  if(tipoEntrega==="delivery" && !direccion){ mostrarToast(dic.direccion_requerida); return; }

  const pagoTexto = { efectivo: dic.efectivo, transferencia: dic.transferencia, linea: dic.pago_linea }[pago];
  const entregaTexto = tipoEntrega==="recoger" ? dic.recoger : dic.delivery;

  let msg = `☕ *PEDIDO — ${config.nombreNegocio || "Face Coffee"}*\n\n`;
  msg += `👤 ${dic.tu_nombre}: ${nombre}\n`;
  msg += `🚚 ${dic.tipo_entrega}: ${entregaTexto}\n`;
  if(tipoEntrega==="delivery") msg += `📍 ${dic.direccion_entrega}: ${direccion}\n`;
  msg += `💳 ${dic.metodo_pago}: ${pagoTexto}\n\n`;
  msg += `*${idiomaActual==="es"?"Detalle":"Order details"}:*\n`;
  carrito.forEach(i=>{
    msg += `• ${i.cant}x ${i.nombre} — ${formatoPrecio(i.precio*i.cant)}\n`;
  });
  msg += `\n*${dic.total}: ${formatoPrecio(totalCarrito())}*`;

  const wa = (config.whatsapp || "").replace(/\D/g,"");
  const numero = wa ? `593${wa.replace(/^0/,"")}` : "";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");

  carrito = [];
  guardarCarrito();
  renderCarrito();
  cerrarCarrito();
});

/* ---------- Inicio ---------- */
cargarDatos();
setInterval(verificarHorario, 60000);
