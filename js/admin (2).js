/* ============================================================
   FACE COFFEE — Lógica del panel de administración
   ============================================================ */

let categorias = [];
let productos = [];

/* ---------- Reintento automático para conexiones lentas/inestables ---------- */
async function reintentar(fn, intentos = 5, esperaMs = 2000){
  let ultimoError;
  for(let i = 0; i < intentos; i++){
    try{
      return await fn();
    }catch(err){
      ultimoError = err;
      console.warn(`Intento ${i+1}/${intentos} falló, reintentando en ${esperaMs}ms...`, err.message);
      await new Promise(res => setTimeout(res, esperaMs));
    }
  }
  throw ultimoError;
}

/* ---------- Autenticación ---------- */
auth.onAuthStateChanged(user=>{
  if(user){
    document.getElementById("pantallaLogin").style.display = "none";
    document.getElementById("panel").classList.add("visible");
    iniciarPanel();
  } else {
    document.getElementById("pantallaLogin").style.display = "flex";
    document.getElementById("panel").classList.remove("visible");
  }
});

document.getElementById("btnLogin").addEventListener("click", ()=>{
  const email = document.getElementById("inputEmail").value.trim();
  const pass = document.getElementById("inputPassword").value;
  const error = document.getElementById("errorLogin");
  error.textContent = "";
  auth.signInWithEmailAndPassword(email, pass).catch(err=>{
    error.textContent = "No se pudo iniciar sesión. Revisa tu correo y contraseña.";
    console.error(err);
  });
});
document.getElementById("inputPassword").addEventListener("keydown", e=>{
  if(e.key==="Enter") document.getElementById("btnLogin").click();
});

document.getElementById("btnLogout").addEventListener("click", ()=> auth.signOut());

/* ---------- Navegación por pestañas ---------- */
document.querySelectorAll(".pestana").forEach(tab=>{
  tab.addEventListener("click", ()=>{
    document.querySelectorAll(".pestana").forEach(t=>t.classList.remove("activa"));
    document.querySelectorAll(".seccion").forEach(s=>s.classList.remove("activa"));
    tab.classList.add("activa");
    document.getElementById("seccion-"+tab.getAttribute("data-seccion")).classList.add("activa");
  });
});

/* ---------- Arranque del panel tras login ---------- */
async function iniciarPanel(){
  await cargarCategorias();
  await cargarProductos();
  await cargarConfig();
}

/* ---------- Categorías ---------- */
async function cargarCategorias(){
  const snap = await reintentar(() => db.collection("categorias").orderBy("orden").get());
  categorias = snap.docs.map(d=>({ id:d.id, ...d.data() }));
  const filtro = document.getElementById("filtroCategoria");
  const selectProd = document.getElementById("prodCategoria");
  filtro.innerHTML = `<option value="">Todas las categorías</option>` +
    categorias.map(c=>`<option value="${c.id}">${c.emoji||""} ${c.nombre_es}</option>`).join("");
  selectProd.innerHTML = categorias.map(c=>`<option value="${c.id}">${c.emoji||""} ${c.nombre_es}</option>`).join("");
}

/* ---------- Productos: cargar y renderizar tabla ---------- */
async function cargarProductos(){
  const snap = await reintentar(() => db.collection("productos").orderBy("orden").get());
  productos = snap.docs.map(d=>({ id:d.id, ...d.data() }));
  renderTablaProductos();
}

function renderTablaProductos(){
  const filtroCat = document.getElementById("filtroCategoria").value;
  const busqueda = document.getElementById("filtroBusqueda").value.toLowerCase();
  const tbody = document.getElementById("tablaProductos");

  const lista = productos.filter(p=>{
    const pasaCat = !filtroCat || p.categoria===filtroCat;
    const pasaBusqueda = !busqueda || p.nombre.toLowerCase().includes(busqueda);
    return pasaCat && pasaBusqueda;
  });

  if(!lista.length){
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;">No hay productos que coincidan.</td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(p=>{
    const cat = categorias.find(c=>c.id===p.categoria);
    const disponible = p.disponible !== false;
    return `
      <tr>
        <td data-etiqueta="Producto"><strong>${p.nombre}</strong></td>
        <td data-etiqueta="Categoría">${cat ? (cat.emoji+" "+cat.nombre_es) : p.categoria}</td>
        <td data-etiqueta="Precio" class="precio-tabla">$${Number(p.precio).toFixed(2)}</td>
        <td data-etiqueta="Estado"><span class="badge ${disponible?'badge--ok':'badge--no'}">${disponible?'Disponible':'Agotado'}</span></td>
        <td data-etiqueta="Acciones">
          <div class="fila-acciones">
            <button class="icono-btn" data-editar="${p.id}">✏️</button>
            <button class="icono-btn" data-disponible="${p.id}">${disponible?'🚫':'✅'}</button>
            <button class="icono-btn" data-eliminar="${p.id}">🗑️</button>
          </div>
        </td>
      </tr>`;
  }).join("");

  tbody.querySelectorAll("[data-editar]").forEach(b=>b.addEventListener("click",()=>abrirModalProducto(b.getAttribute("data-editar"))));
  tbody.querySelectorAll("[data-disponible]").forEach(b=>b.addEventListener("click",()=>alternarDisponibilidad(b.getAttribute("data-disponible"))));
  tbody.querySelectorAll("[data-eliminar]").forEach(b=>b.addEventListener("click",()=>eliminarProducto(b.getAttribute("data-eliminar"))));
}

document.getElementById("filtroCategoria").addEventListener("change", renderTablaProductos);
document.getElementById("filtroBusqueda").addEventListener("input", renderTablaProductos);

/* ---------- Modal de producto ---------- */
const modalOverlay = document.getElementById("modalOverlay");

document.getElementById("btnNuevoProducto").addEventListener("click", ()=> abrirModalProducto(null));
document.getElementById("btnCancelarProducto").addEventListener("click", ()=> modalOverlay.classList.remove("visible"));
modalOverlay.addEventListener("click", e=>{ if(e.target===modalOverlay) modalOverlay.classList.remove("visible"); });

function abrirModalProducto(id){
  const p = id ? productos.find(x=>x.id===id) : null;
  document.getElementById("modalTitulo").textContent = p ? "Editar producto" : "Nuevo producto";
  document.getElementById("prodId").value = id || "";
  document.getElementById("prodNombre").value = p ? p.nombre : "";
  document.getElementById("prodCategoria").value = p ? p.categoria : (categorias[0]?.id || "");
  document.getElementById("prodPrecio").value = p ? p.precio : "";
  document.getElementById("prodDescripcion").value = p ? (p.descripcion||"") : "";
  document.getElementById("prodOrden").value = p ? (p.orden||1) : (productos.length+1);
  document.getElementById("prodDisponible").checked = p ? p.disponible!==false : true;
  modalOverlay.classList.add("visible");
}

document.getElementById("btnGuardarProducto").addEventListener("click", async ()=>{
  const id = document.getElementById("prodId").value;
  const datos = {
    nombre: document.getElementById("prodNombre").value.trim(),
    categoria: document.getElementById("prodCategoria").value,
    precio: parseFloat(document.getElementById("prodPrecio").value) || 0,
    descripcion: document.getElementById("prodDescripcion").value.trim(),
    orden: parseInt(document.getElementById("prodOrden").value) || 1,
    disponible: document.getElementById("prodDisponible").checked
  };
  if(!datos.nombre || !datos.categoria){ alert("El nombre y la categoría son obligatorios."); return; }

  if(id) await db.collection("productos").doc(id).update(datos);
  else await db.collection("productos").add(datos);

  modalOverlay.classList.remove("visible");
  await cargarProductos();
});

async function alternarDisponibilidad(id){
  const p = productos.find(x=>x.id===id);
  await db.collection("productos").doc(id).update({ disponible: !(p.disponible!==false) });
  await cargarProductos();
}

async function eliminarProducto(id){
  const p = productos.find(x=>x.id===id);
  if(!confirm(`¿Eliminar "${p.nombre}" del menú? Esta acción no se puede deshacer.`)) return;
  await db.collection("productos").doc(id).delete();
  await cargarProductos();
}

/* ---------- Configuración del negocio ---------- */
async function cargarConfig(){
  const doc = await reintentar(() => db.collection("config").doc("general").get());
  const c = doc.exists ? doc.data() : {};
  document.getElementById("cfgNombre").value = c.nombreNegocio || "";
  document.getElementById("cfgWhatsapp").value = c.whatsapp || "";
  document.getElementById("cfgDireccion").value = c.direccion || "";
  document.getElementById("cfgInstagram").value = c.instagram || "";
  document.getElementById("cfgApertura").value = c.horarioApertura || "";
  document.getElementById("cfgCierre").value = c.horarioCierre || "";
  document.getElementById("cfgEsloganEs").value = c.eslogan_es || "";
  document.getElementById("cfgEsloganEn").value = c.eslogan_en || "";
  document.getElementById("cfgMensajeEs").value = c.mensaje_es || "";
  document.getElementById("cfgMensajeEn").value = c.mensaje_en || "";
}

document.getElementById("btnGuardarConfig").addEventListener("click", async ()=>{
  const datos = {
    nombreNegocio: document.getElementById("cfgNombre").value.trim(),
    whatsapp: document.getElementById("cfgWhatsapp").value.trim(),
    direccion: document.getElementById("cfgDireccion").value.trim(),
    instagram: document.getElementById("cfgInstagram").value.trim(),
    horarioApertura: document.getElementById("cfgApertura").value,
    horarioCierre: document.getElementById("cfgCierre").value,
    eslogan_es: document.getElementById("cfgEsloganEs").value.trim(),
    eslogan_en: document.getElementById("cfgEsloganEn").value.trim(),
    mensaje_es: document.getElementById("cfgMensajeEs").value.trim(),
    mensaje_en: document.getElementById("cfgMensajeEn").value.trim()
  };
  await db.collection("config").doc("general").set(datos, { merge:true });
  const estado = document.getElementById("estadoConfig");
  estado.textContent = "✅ Guardado correctamente";
  setTimeout(()=> estado.textContent="", 2500);
});

/* ---------- Siembra inicial del menú (solo primera vez) ---------- */
document.getElementById("btnSembrar").addEventListener("click", async ()=>{
  if(!confirm("Esto creará las categorías, el menú completo y los datos del negocio en Firebase. Úsalo solo una vez. ¿Continuar?")) return;
  const estado = document.getElementById("estadoSembrado");
  estado.textContent = "⏳ Cargando...";
  try{
    const lote = db.batch();
    CATEGORIAS_INICIALES.forEach(cat=>{
      const ref = db.collection("categorias").doc(cat.id);
      lote.set(ref, cat);
    });
    await reintentar(() => lote.commit());

    for(const prod of PRODUCTOS_INICIALES){
      await reintentar(() => db.collection("productos").add(prod));
    }

    await reintentar(() => db.collection("config").doc("general").set(CONFIG_INICIAL, { merge:true }));

    estado.textContent = "✅ ¡Listo! Menú cargado correctamente. Ve a la pestaña Productos para verlo.";
    await cargarCategorias();
    await cargarProductos();
    await cargarConfig();
  }catch(err){
    console.error(err);
    estado.textContent = "❌ Ocurrió un error. Revisa la consola del navegador.";
  }
});
