# ☕ Face Coffee — Web + Pedidos por WhatsApp

Sitio 100% independiente (HTML/CSS/JS puro, sin frameworks) con:
- Menú público editable desde un panel de administración
- Carrito de compras con checkout que arma el pedido y lo envía por WhatsApp
- Panel de admin protegido con usuario y contraseña
- Selección de recoger/delivery, método de pago y aviso de horario
- Interfaz en Español / Inglés

Solo hay **una parte que no puedo crear por ti**: tu propia base de datos en
Firebase (es gratuita, pero requiere una cuenta tuya). Todo lo demás —el
código, el menú, el diseño— ya está listo. Sigue estos pasos una sola vez.

---

## 1. Crear tu proyecto de Firebase (10 minutos, una sola vez)

1. Ve a **https://console.firebase.google.com** e inicia sesión con tu cuenta de Google.
2. Clic en **"Agregar proyecto"** → nómbralo, por ejemplo, `face-coffee` → sigue los pasos por defecto → **Crear proyecto**.
3. En el menú lateral, ve a **Compilación → Firestore Database** → **Crear base de datos** → elige **modo producción** → selecciona una ubicación (ej. `us-central` o la más cercana) → **Habilitar**.
4. En el menú lateral, ve a **Compilación → Authentication** → pestaña **Sign-in method** → habilita **Correo electrónico/contraseña**.
5. En **Authentication → Users**, clic en **Agregar usuario**: ese será tu usuario y contraseña para entrar al panel de administración (ej. `admin@facecoffee.com`).
6. Ve a **Configuración del proyecto** (ícono de engranaje) → baja hasta **Tus apps** → clic en el ícono `</>` (Web) → nómbrala `face-coffee-web` → **Registrar app**.
7. Copia el objeto `firebaseConfig` que te muestra (tiene `apiKey`, `authDomain`, etc.).

## 2. Pegar tu configuración en el proyecto

Abre el archivo `js/firebase-config.js` y reemplaza los valores de ejemplo por
los que copiaste en el paso anterior. Guarda el archivo.

## 3. Configurar las reglas de seguridad de Firestore

En **Firestore Database → Reglas**, reemplaza el contenido por esto y publica:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Esto permite que cualquiera **vea** el menú (necesario para que la web
funcione) pero solo alguien que haya iniciado sesión en el panel pueda
**editarlo**.

## 4. Publicar el sitio en GitHub Pages

1. Crea un repositorio nuevo en GitHub (ej. `face-coffee-web`).
2. Sube todos los archivos de esta carpeta (`index.html`, `admin.html`, `css/`, `js/`, `README.md`) a ese repositorio.
3. En el repositorio, ve a **Settings → Pages**.
4. En **Source**, elige la rama `main` y la carpeta `/ (root)` → **Save**.
5. En un par de minutos tu sitio estará disponible en:
   `https://TU-USUARIO.github.io/face-coffee-web/`

## 5. Cargar el menú por primera vez

1. Entra a `https://TU-USUARIO.github.io/face-coffee-web/admin.html`
2. Inicia sesión con el correo y contraseña que creaste en el paso 1.5.
3. Ve a la pestaña **🚀 Primeros pasos** → clic en **"Cargar menú inicial en Firebase"**.
4. Eso carga automáticamente las 7 categorías y los más de 25 productos del
   menú de Face Coffee, junto con el WhatsApp, dirección y horario.
5. Revisa la pestaña **⚙️ Datos del negocio** y ajusta lo que quieras
   (WhatsApp, horario, dirección, mensaje de bienvenida).

**Importante:** usa el botón de "Cargar menú inicial" **solo una vez**. Si lo
vuelves a usar después de haber editado productos, duplicará el menú.

---

## Cómo editar el menú día a día

Entra a `admin.html`, inicia sesión, y en la pestaña **🧾 Productos**:
- **➕ Nuevo producto** para agregar algo nuevo
- ✏️ para editar nombre, precio, descripción o categoría
- 🚫 / ✅ para marcar un producto como agotado o disponible sin borrarlo
- 🗑️ para eliminarlo definitivamente

Todo se refleja **al instante** en la web pública, sin tocar código.

## Sobre el pago en línea

La opción "Pago en línea" que ve el cliente en el carrito no procesa el pago
dentro de la web (eso requiere contratar una pasarela como Payphone, Datafast
o similar, con tus propias credenciales de comercio). Por ahora, cuando el
cliente elige esa opción, el pedido llega por WhatsApp con esa indicación
para que coordines el cobro directamente con él. Si más adelante quieres
integrar una pasarela real, es un proyecto aparte que puedo ayudarte a armar.

## Estructura de archivos

```
face-coffee-web/
├── index.html          → sitio público (menú + carrito + WhatsApp)
├── admin.html           → panel de administración
├── css/
│   ├── style.css         → estilos del sitio público
│   └── admin.css         → estilos del panel de admin
├── js/
│   ├── firebase-config.js → TU configuración de Firebase (paso 2)
│   ├── data-seed.js        → menú inicial (solo para la primera carga)
│   ├── app.js               → lógica del sitio público
│   └── admin.js              → lógica del panel de administración
└── README.md
```

## Solución de problemas

- **"No se pudo cargar el menú"** → revisa que copiaste bien los datos en
  `js/firebase-config.js` y que las reglas de Firestore estén publicadas.
- **No puedo iniciar sesión en el panel** → confirma que creaste el usuario
  en Authentication → Users, y que habilitaste el método "Correo/contraseña".
- **Los cambios no se ven en la web** → refresca la página (Ctrl+F5); los
  datos se leen en vivo desde Firestore, así que no debería haber caché.
