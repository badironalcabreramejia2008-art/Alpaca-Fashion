document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedor-productos');
    const buscadorInput = document.getElementById('buscador-nombre');
    const selectCategoria = document.getElementById('filtro-categoria');
    const selectDisponibilidad = document.getElementById('filtro-disponibilidad');
    const selectOrden = document.getElementById('orden-precio');
    const btnLimpiar = document.getElementById('btn-limpiar-filtros');
    const contadorResultados = document.getElementById('contador-resultados');
  
    const productos = await obtenerProductos();
  
    // 1. Cargar categorías dinámicamente en el select
    const categorias = [...new Set(productos.map(p => p.categoria))];
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      selectCategoria.appendChild(option);
    });
  
    // 2. Verificar si viene una categoría seleccionada por URL desde index.html
    const params = new URLSearchParams(window.location.search);
    const categoriaURL = params.get('categoria');
    if (categoriaURL && categorias.includes(categoriaURL)) {
      selectCategoria.value = categoriaURL;
    }
  
    // 3. Función principal de filtrado y ordenamiento
    function filtrarYRenderizar() {
      const texto = buscadorInput.value.trim().toLowerCase();
      const categoria = selectCategoria.value;
      const disponibilidad = selectDisponibilidad.value;
      const orden = selectOrden.value;
  
      let resultado = productos.filter(prod => {
        const coincideNombre = prod.nombre.toLowerCase().includes(texto) ||
                               prod.descripcion.toLowerCase().includes(texto);
        const coincideCategoria = (categoria === 'todas') || (prod.categoria === categoria);
  
        let coincideStock = true;
        if (disponibilidad === 'disponibles') {
          coincideStock = prod.stock > 0;
        } else if (disponibilidad === 'agotados') {
          coincideStock = prod.stock === 0;
        }
  
        return coincideNombre && coincideCategoria && coincideStock;
      });
  
      // Ordenamiento por precio
      if (orden === 'asc') {
        resultado.sort((a, b) => a.precio - b.precio);
      } else if (orden === 'desc') {
        resultado.sort((a, b) => b.precio - a.precio);
      } else {
        resultado.sort((a, b) => a.id - b.id);
      }
  
      // Actualizar contador y vista
      contadorResultados.textContent = `Mostrando ${resultado.length} de ${productos.length} prendas registradas`;
  
      if (resultado.length === 0) {
        contenedor.innerHTML = `
          <div class="panel-card" style="grid-column: 1 / -1; text-align:center; padding: 3rem;">
            <h3>No se encontraron prendas con esos criterios</h3>
            <p style="color:var(--texto-suave); margin-top:0.5rem;">
              Intenta con otro término de búsqueda o restablece los filtros.
            </p>
          </div>
        `;
        return;
      }
  
      contenedor.innerHTML = resultado.map(crearTarjetaProductoHTML).join('');
    }
  
    // 4. Eventos en tiempo real
    buscadorInput.addEventListener('input', filtrarYRenderizar);
    selectCategoria.addEventListener('change', filtrarYRenderizar);
    selectDisponibilidad.addEventListener('change', filtrarYRenderizar);
    selectOrden.addEventListener('change', filtrarYRenderizar);
  
    btnLimpiar.addEventListener('click', () => {
      buscadorInput.value = '';
      selectCategoria.value = 'todas';
      selectDisponibilidad.value = 'todos';
      selectOrden.value = 'defecto';
      window.history.replaceState({}, document.title, 'productos.html');
      filtrarYRenderizar();
    });
  
    // Renderizado inicial
    filtrarYRenderizar();
  });