# Proyecto Final: Tienda Virtual Multipágina "Alpaca Fashion"

**Institución:** Instituto Técnico Jesús María (Oruro - Bolivia)  
**Carrera:** Sistemas Informáticos  
**Tecnologías:** HTML5, CSS3 (Grid & Flexbox), JavaScript (ES6+, Fetch API, LocalStorage) y JSON.

---

## 1. Descripción del Proyecto
**Alpaca Fashion** es una aplicación web multipágina que simula el funcionamiento integral de una tienda virtual dedicada a la comercialización de prendas de vestir elaboradas con fibra de alpaca boliviana. Toda la información del catálogo (16 productos) se almacena en el archivo externo `data/productos.json` y se procesa dinámicamente mediante el método `fetch()` de JavaScript.

## 2. Estructura de Carpetas y Archivos
```text
TIENDA-VIRTUAL/
├── index.html          # Página de inicio con banner, categorías y destacados
├── productos.html      # Catálogo completo con buscador, filtros y ordenamiento
├── nosotros.html       # Historia, misión, visión, valores y objetivos
├── contacto.html       # Formulario de contacto con validación en JavaScript
├── dashboard.html      # Panel de control con 6 KPIs, tabla de alertas y Chart.js
├── carrito.html        # Gestión de compras persistente con localStorage
├── faq.html            # Preguntas frecuentes interactivas
├── data/
│   └── productos.json  # Base de datos local en formato JSON (16 prendas en Bs)
├── css/
│   └── estilos.css     # Hoja de estilos adaptable (Responsive Design)
├── js/
│   ├── app.js          # Lógica global, fetch(), modal de detalles y contador
│   ├── productos.js    # Búsqueda por texto, filtros combinados y orden por precio
│   ├── dashboard.js    # Cálculo automático de KPIs y gráficos con Chart.js
│   ├── contacto.js     # Validación de campos del formulario de contacto
│   └── carrito.js      # Operaciones de agregar, quitar y vaciar carrito
└── img/                # Fotografías locales de productos, banner y logotipo