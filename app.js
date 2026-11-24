const URL_PRODUCTOS = 'data/productos.json';
let catalogoGlobal = [];

// 1. Obtener productos desde JSON usando fetch()
async function obtenerProductos() {
  if (catalogoGlobal.length > 0) return catalogoGlobal;
  try {
    const respuesta = await fetch(URL_PRODUCTOS);
    if (!respuesta.ok) throw new Error('No se pudo cargar productos.json');
    catalogoGlobal = await respuesta.json();
    return catalogoGlobal;
  } catch (error) {
    console.error('Error al cargar el catálogo:', error);
    return [];
  }
}

// 2. Funciones globales de Carrito con localStorage
function obtenerCarrito() {
  const data = localStorage.getItem('alpaca_carrito');
  return data ? JSON.parse(data) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('alpaca_carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const contadorEl = document.getElementById('contador-carrito');
  if (!contadorEl) return;
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contadorEl.textContent = totalItems;
}

async function agregarAlCarrito(idProducto) {
  const productos = await obtenerProductos();
  const producto = productos.find(p => p.id === Number(idProducto));
  if (!producto || producto.stock <= 0) {
    mostrarToast('Este producto se encuentra agotado.');
    return;
  }

  const carrito = obtenerCarrito();
  const itemExistente = carrito.find(item => item.id === producto.id);

  if (itemExistente) {
    if (itemExistente.cantidad < producto.stock) {
      itemExistente.cantidad += 1;
      mostrarToast(`Se añadió otra unidad de "${producto.nombre}"`);
    } else {
      mostrarToast(`Stock máximo alcanzado (${producto.stock} disp.)`);
      return;
    }
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria,
      stockMax: producto.stock,
      cantidad: 1
    });
    mostrarToast(`"${producto.nombre}" agregado al carrito`);
  }

  guardarCarrito(carrito);
}

// 3. Generador de etiquetas de estado de stock
function obtenerBadgeStock(stock) {
  if (stock === 0) {
    return `<span class="badge-stock stock-agotado">Agotado</span>`;
  } else if (stock <= 3) {
    return `<span class="badge-stock stock-bajo">¡Últimas ${stock} u.!</span>`;
  }
  return `<span class="badge-stock stock-disponible">Disponible (${stock})</span>`;
}

// 4. Plantilla HTML de tarjeta de producto (reutilizable)
function crearTarjetaProductoHTML(prod) {
  const agotado = prod.stock === 0;
  return `
    <article class="card-producto">
      <div class="card-img-wrapper">
        <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
        ${obtenerBadgeStock(prod.stock)}
      </div>
      <div class="card-body">
        <span class="card-categoria-tag">${prod.categoria}</span>
        <h3 class="card-titulo">${prod.nombre}</h3>
        <p class="card-desc">${prod.descripcion}</p>
        <div class="card-precio">Bs ${prod.precio.toFixed(2)}</div>
        <div class="card-acciones">
          <button class="btn btn-secundario" onclick="abrirModalDetalle(${prod.id})">
            Ver detalles
          </button>
          <button class="btn btn-primario" onclick="agregarAlCarrito(${prod.id})" ${agotado ? 'disabled' : ''}>
            ${agotado ? 'Sin stock' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  `;
}

// 5. Modal de vista de detalle de producto
async function abrirModalDetalle(idProducto) {
  const productos = await obtenerProductos();
  const prod = productos.find(p => p.id === Number(idProducto));
  if (!prod) return;

  let modal = document.getElementById('modal-detalle-global');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-detalle-global';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const agotado = prod.stock === 0;
  modal.innerHTML = `
    <div class="modal-contenido">
      <button class="modal-cerrar" onclick="cerrarModalDetalle()">×</button>
      <div style="height:100%; min-height:280px;">
        <img src="${prod.imagen}" alt="${prod.nombre}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div style="padding:1.8rem; display:flex; flex-direction:column; justify-content:center;">
        <span class="card-categoria-tag">${prod.categoria}</span>
        <h2 style="margin-bottom:0.5rem;">${prod.nombre}</h2>
        <p style="color:var(--primario-oscuro); font-size:1.4rem; font-weight:700; margin-bottom:0.8rem;">
          Bs ${prod.precio.toFixed(2)}
        </p>
        <p style="color:var(--texto-suave); font-size:0.92rem; margin-bottom:1rem;">${prod.descripcion}</p>
        <p style="font-size:0.88rem; margin-bottom:0.4rem;"><strong>Material:</strong> ${prod.material}</p>
        <p style="font-size:0.88rem; margin-bottom:0.4rem;"><strong>Tallas:</strong> ${prod.tallas.join(', ')}</p>
        <p style="font-size:0.88rem; margin-bottom:1.2rem;"><strong>Disponibilidad:</strong> ${prod.stock} unidades en inventario</p>
        <button class="btn btn-primario" onclick="agregarAlCarrito(${prod.id}); cerrarModalDetalle();" ${agotado ? 'disabled' : ''}>
          ${agotado ? 'Producto Agotado' : 'Añadir al Carrito'}
        </button>
      </div>
    </div>
  `;
  modal.classList.add('activo');
}

function cerrarModalDetalle() {
  const modal = document.getElementById('modal-detalle-global');
  if (modal) modal.classList.remove('activo');
}

// 6. Notificaciones flotantes (Toast)
function mostrarToast(mensaje) {
  let contenedor = document.querySelector('.toast-contenedor');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.className = 'toast-contenedor';
    document.body.appendChild(contenedor);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensaje;
  contenedor.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

// 7. Inicialización de la página de Inicio (index.html) y Menú Móvil
document.addEventListener('DOMContentLoaded', async () => {
  actualizarContadorCarrito();

  const btnMenu = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (btnMenu && navMenu) {
    btnMenu.addEventListener('click', () => navMenu.classList.toggle('abierto'));
  }

  const contenedorDestacados = document.getElementById('contenedor-destacados');
  const contenedorCategorias = document.getElementById('contenedor-categorias-inicio');

  if (contenedorDestacados || contenedorCategorias) {
    const productos = await obtenerProductos();

    if (contenedorDestacados) {
      const destacados = productos.filter(p => p.destacado).slice(0, 6);
      contenedorDestacados.innerHTML = destacados.map(crearTarjetaProductoHTML).join('');
    }

    if (contenedorCategorias) {
      const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
      contenedorCategorias.innerHTML = categoriasUnicas.map(cat => {
        const totalCat = productos.filter(p => p.categoria === cat).length;
        return `
          <a href="productos.html?categoria=${encodeURIComponent(cat)}" class="card-categoria">
            <h3>${cat}</h3>
            <p style="color:var(--texto-suave); font-size:0.9rem;">${totalCat} prendas exclusivas</p>
          </a>
        `;
      }).join('');
    }
  }
});