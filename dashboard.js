let chartCategoriasInstance = null;
let chartStockInstance = null;

async function cargarDashboard() {
  const productos = await obtenerProductos();
  if (!productos || productos.length === 0) return;

  // 1. Cálculo de los 6 KPIs principales
  const totalProductos = productos.length;
  const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
  const cantidadCategorias = categoriasUnicas.length;

  const valorTotalInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
  const productosDisponibles = productos.filter(p => p.stock > 0).length;
  const productosAgotados = productos.filter(p => p.stock === 0).length;
  const productosBajoStock = productos.filter(p => p.stock > 0 && p.stock <= 3).length;
  const productosStockOptimo = productos.filter(p => p.stock > 3).length;

  // Renderizar valores en las tarjetas KPI
  document.getElementById('kpi-total-productos').textContent = totalProductos;
  document.getElementById('kpi-total-categorias').textContent = cantidadCategorias;
  document.getElementById('kpi-valor-inventario').textContent = 
    'Bs ' + valorTotalInventario.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('kpi-stock-disponible').textContent = productosDisponibles;
  document.getElementById('kpi-agotados').textContent = productosAgotados;
  document.getElementById('kpi-bajo-stock').textContent = productosBajoStock;

  // 2. Actualizar fecha y hora del panel
  const ahora = new Date();
  document.getElementById('fecha-actualizacion').textContent = ahora.toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // 3. Renderizar Gráfico de Productos por Categoría
  const conteoPorCategoria = categoriasUnicas.map(cat =>
    productos.filter(p => p.categoria === cat).length
  );

  const ctxCat = document.getElementById('grafico-categorias').getContext('2d');
  if (chartCategoriasInstance) chartCategoriasInstance.destroy();

  chartCategoriasInstance = new Chart(ctxCat, {
    type: 'bar',
    data: {
      labels: categoriasUnicas,
      datasets: [{
        label: 'Cantidad de Modelos',
        data: conteoPorCategoria,
        backgroundColor: ['#8C5A3C', '#C88A65', '#6B4229', '#A87658'],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });

  // 4. Renderizar Gráfico de Distribución de Stock
  const ctxStock = document.getElementById('grafico-stock').getContext('2d');
  if (chartStockInstance) chartStockInstance.destroy();

  chartStockInstance = new Chart(ctxStock, {
    type: 'doughnut',
    data: {
      labels: [
        `Stock Óptimo (> 3 u.): ${productosStockOptimo}`,
        `Bajo Stock (1 a 3 u.): ${productosBajoStock}`,
        `Agotados (0 u.): ${productosAgotados}`
      ],
      datasets: [{
        data: [productosStockOptimo, productosBajoStock, productosAgotados],
        backgroundColor: ['#2A6F4E', '#D97706', '#DC2626'],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // 5. Llenar Tabla de Productos con Bajo Inventario (<= 3 unidades)
  const tbody = document.getElementById('tabla-bajo-inventario');
  const listaCritica = productos
    .filter(p => p.stock <= 3)
    .sort((a, b) => a.stock - b.stock);

  tbody.innerHTML = listaCritica.map(prod => {
    const subtotalStock = prod.precio * prod.stock;
    return `
      <tr>
        <td>#${prod.id}</td>
        <td>
          <div style="display:flex; align-items:center; gap:0.7rem;">
            <img src="${prod.imagen}" alt="${prod.nombre}" style="width:42px; height:42px; border-radius:6px; object-fit:cover;">
            <strong>${prod.nombre}</strong>
          </div>
        </td>
        <td>${prod.categoria}</td>
        <td>Bs ${prod.precio.toFixed(2)}</td>
        <td style="font-weight:700;">${prod.stock} u.</td>
        <td>Bs ${subtotalStock.toFixed(2)}</td>
        <td>${obtenerBadgeStock(prod.stock)}</td>
      </tr>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  cargarDashboard();
  const btnActualizar = document.getElementById('btn-actualizar-panel');
  if (btnActualizar) {
    btnActualizar.addEventListener('click', () => {
      cargarDashboard();
      mostrarToast('Indicadores del dashboard actualizados');
    });
  }
});