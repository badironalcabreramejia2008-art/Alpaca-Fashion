function renderizarPaginaCarrito() {
    const contenedor = document.getElementById('carrito-contenido');
    const resumenEl = document.getElementById('carrito-resumen');
    if (!contenedor || !resumenEl) return;
  
    const carrito = obtenerCarrito();
  
    if (carrito.length === 0) {
      contenedor.innerHTML = `
        <div class="panel-card" style="text-align:center; padding:3rem 1.5rem;">
          <h3 style="margin-bottom:0.8rem;">Tu carrito está vacío</h3>
          <p style="color:var(--texto-suave); margin-bottom:1.5rem;">
            Explora nuestra colección de prendas de fibra de alpaca y añade tus favoritas.
          </p>
          <a href="productos.html" class="btn btn-primario">Explorar Catálogo</a>
        </div>
      `;
      resumenEl.innerHTML = '';
      return;
    }
  
    let totalGeneral = 0;
  
    const filasHTML = carrito.map(item => {
      const subtotal = item.precio * item.cantidad;
      totalGeneral += subtotal;
      return `
        <tr>
          <td style="display:flex; align-items:center; gap:0.8rem;">
            <img src="${item.imagen}" alt="${item.nombre}" style="width:56px; height:56px; object-fit:cover; border-radius:8px;">
            <div>
              <strong>${item.nombre}</strong>
              <div style="font-size:0.8rem; color:var(--texto-suave);">${item.categoria}</div>
            </div>
          </td>
          <td>Bs ${item.precio.toFixed(2)}</td>
          <td>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <button class="btn btn-secundario" style="padding:0.2rem 0.6rem;" onclick="cambiarCantidad(${item.id}, -1)">-</button>
              <span style="font-weight:700; min-width:24px; text-align:center;">${item.cantidad}</span>
              <button class="btn btn-secundario" style="padding:0.2rem 0.6rem;" onclick="cambiarCantidad(${item.id}, 1)">+</button>
            </div>
          </td>
          <td style="font-weight:700;">Bs ${subtotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-secundario" style="color:var(--peligro); border-color:var(--peligro); padding:0.35rem 0.7rem;" onclick="eliminarDelCarrito(${item.id})">
              Quitar
            </button>
          </td>
        </tr>
      `;
    }).join('');
  
    contenedor.innerHTML = `
      <div class="panel-card tabla-responsive">
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>Prenda</th>
              <th>Precio Unit.</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${filasHTML}
          </tbody>
        </table>
      </div>
    `;
  
    resumenEl.innerHTML = `
      <div class="panel-card">
        <h3>Resumen del Pedido</h3>
        <div style="display:flex; justify-content:space-between; margin:1rem 0; font-size:0.95rem;">
          <span>Envío nacional (Bolivia):</span>
          <strong style="color:var(--exito);">Gratis</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin:1rem 0; font-size:1.25rem; border-top:1px solid var(--borde); padding-top:1rem;">
          <strong>Total a Pagar:</strong>
          <strong style="color:var(--primario-oscuro);">Bs ${totalGeneral.toFixed(2)}</strong>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.7rem; margin-top:1.2rem;">
          <button class="btn btn-primario" onclick="finalizarCompraSimulada()">Confirmar Pedido</button>
          <button class="btn btn-secundario" onclick="vaciarCarrito()">Vaciar Carrito</button>
        </div>
      </div>
    `;
  }
  
  function cambiarCantidad(id, delta) {
    const carrito = obtenerCarrito();
    const item = carrito.find(i => i.id === id);
    if (!item) return;
  
    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    if (nuevaCantidad > item.stockMax) {
      mostrarToast(`Solo existen ${item.stockMax} unidades disponibles en stock.`);
      return;
    }
  
    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    renderizarPaginaCarrito();
  }
  
  function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(i => i.id !== id);
    guardarCarrito(carrito);
    renderizarPaginaCarrito();
    mostrarToast('Prenda eliminada del carrito');
  }
  
  function vaciarCarrito() {
    localStorage.removeItem('alpaca_carrito');
    actualizarContadorCarrito();
    renderizarPaginaCarrito();
    mostrarToast('Se vació el carrito de compras');
  }
  
  function finalizarCompraSimulada() {
    localStorage.removeItem('alpaca_carrito');
    actualizarContadorCarrito();
    renderizarPaginaCarrito();
    alert('¡Gracias por tu compra en Alpaca Fashion! Tu pedido ha sido registrado exitosamente.');
  }
  
  document.addEventListener('DOMContentLoaded', renderizarPaginaCarrito);