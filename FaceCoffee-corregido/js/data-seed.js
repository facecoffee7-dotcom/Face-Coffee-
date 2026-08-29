/* ============================================================
   FACE COFFEE — Datos iniciales del menú
   Este archivo solo se usa UNA VEZ desde el Panel de Admin,
   con el botón "Cargar menú inicial en Firebase".
   Después de esa primera carga, todo se edita desde el panel
   y este archivo ya no se vuelve a usar (los productos viven
   en Firestore, no aquí).
   ============================================================ */

const CATEGORIAS_INICIALES = [
  { id: "frio",      nombre_es: "Ñaño pal Frío",      nombre_en: "For When You're Cold", subt_es: "Bebidas calientes", subt_en: "Hot drinks",  emoji: "🥶", orden: 1 },
  { id: "calor",     nombre_es: "Ñaño pal Calor",      nombre_en: "For When It's Hot",     subt_es: "Bebidas frías",     subt_en: "Cold drinks", emoji: "🥵", orden: 2 },
  { id: "frappe",    nombre_es: "Frappé",              nombre_en: "Frappé",                subt_es: "",                  subt_en: "",             emoji: "🥤", orden: 3 },
  { id: "milkshake", nombre_es: "Milkshake",           nombre_en: "Milkshake",             subt_es: "",                  subt_en: "",             emoji: "🍦", orden: 4 },
  { id: "cerveza",   nombre_es: "Cerveza · 20 Miedo",  nombre_en: "Beer",                  subt_es: "",                  subt_en: "",             emoji: "🍺", orden: 5 },
  { id: "miches",    nombre_es: "Miches",              nombre_en: "Miches (Fruit Shots)",  subt_es: "",                  subt_en: "",             emoji: "🍻", orden: 6 },
  { id: "cocteles",  nombre_es: "Cócteles",            nombre_en: "Cocktails",             subt_es: "",                  subt_en: "",             emoji: "🍸", orden: 7 },
];

const PRODUCTOS_INICIALES = [
  // Ñaño pal Frío (calientes)
  { nombre: "Espresso",              categoria: "frio",   precio: 1.75, disponible: true, orden: 1 },
  { nombre: "Americano",             categoria: "frio",   precio: 2.00, disponible: true, orden: 2 },
  { nombre: "Capuchino",             categoria: "frio",   precio: 2.50, disponible: true, orden: 3 },
  { nombre: "Mocachino",             categoria: "frio",   precio: 2.75, disponible: true, orden: 4 },

  // Ñaño pal Calor (frías)
  { nombre: "Ice Coffee",            categoria: "calor",  precio: 2.00, disponible: true, orden: 1 },
  { nombre: "Ice Latte",             categoria: "calor",  precio: 2.50, disponible: true, orden: 2 },
  { nombre: "Espresso Tonic",        categoria: "calor",  precio: 1.75, disponible: true, orden: 3 },
  { nombre: "Honey Lemon Espresso",  categoria: "calor",  precio: 2.50, disponible: true, orden: 4 },
  { nombre: "Orange Espresso",       categoria: "calor",  precio: 2.50, disponible: true, orden: 5 },

  // Frappé
  { nombre: "Frappé Vainilla",       categoria: "frappe", precio: 2.75, disponible: true, orden: 1 },
  { nombre: "Frappé Frutos Rojos",   categoria: "frappe", precio: 3.00, disponible: true, orden: 2 },
  { nombre: "Frappé Oreo",           categoria: "frappe", precio: 2.75, disponible: true, orden: 3 },
  { nombre: "Frappé Piña Colada",    categoria: "frappe", precio: 2.75, disponible: true, orden: 4 },

  // Milkshake
  { nombre: "Milkshake Vainilla con Caramelo", categoria: "milkshake", precio: 3.00, disponible: true, orden: 1 },
  { nombre: "Milkshake Oreo",                  categoria: "milkshake", precio: 2.75, disponible: true, orden: 2 },
  { nombre: "Milkshake Fresa",                 categoria: "milkshake", precio: 2.75, disponible: true, orden: 3 },
  { nombre: "Milkshake Choco Banana",          categoria: "milkshake", precio: 3.00, disponible: true, orden: 4 },

  // Cerveza
  { nombre: "Corona",                categoria: "cerveza", precio: 2.00, disponible: true, orden: 1 },
  { nombre: "Heineken",              categoria: "cerveza", precio: 2.00, disponible: true, orden: 2 },
  { nombre: "Club",                  categoria: "cerveza", precio: 2.00, disponible: true, orden: 3 },
  { nombre: "Combo x3 Cervezas",     categoria: "cerveza", precio: 5.00, disponible: true, orden: 4 },

  // Miches
  { nombre: "Miche de Limón",        categoria: "miches", precio: 2.75, disponible: true, orden: 1 },
  { nombre: "Miche de Piña",         categoria: "miches", precio: 3.00, disponible: true, orden: 2 },
  { nombre: "Miche de Mango",        categoria: "miches", precio: 3.00, disponible: true, orden: 3 },
  { nombre: "Miche de Maracuyá",     categoria: "miches", precio: 3.00, disponible: true, orden: 4 },

  // Cócteles
  { nombre: "Sex on the Beach",      categoria: "cocteles", precio: 3.50, disponible: true, orden: 1 },
  { nombre: "Moscow Mule",           categoria: "cocteles", precio: 3.50, disponible: true, orden: 2 },
  { nombre: "Black Russian",         categoria: "cocteles", precio: 3.50, disponible: true, orden: 3 },
  { nombre: "Daiquiri Clásico",      categoria: "cocteles", precio: 3.75, disponible: true, orden: 4 },
  { nombre: "Cuba Libre",            categoria: "cocteles", precio: 3.50, disponible: true, orden: 5 },
  { nombre: "Paloma",                categoria: "cocteles", precio: 4.00, disponible: true, orden: 6 },
  { nombre: "Gin Tonic",             categoria: "cocteles", precio: 3.50, disponible: true, orden: 7 },
];

const CONFIG_INICIAL = {
  nombreNegocio: "Face Coffee",
  whatsapp: "0963650750",
  direccion: "Calle General Enrique Gallo, diagonal al Cementerio Municipal, La Maná",
  instagram: "@ffacecoffee",
  horarioApertura: "08:00",
  horarioCierre: "22:00",
  eslogan_es: "¡Qué chevere!",
  eslogan_en: "How cool!",
  mensaje_es: "El spot más bacán del barrio para desestresarse del camello o las clases. Pégate unas crepes buenazas, un café helado bien del puctas y pasa con tus panas como en casa.",
  mensaje_en: "The coolest spot in the neighborhood to unwind from work or class. Grab some great crepes, a proper iced coffee, and hang out with your friends like you're at home."
};
