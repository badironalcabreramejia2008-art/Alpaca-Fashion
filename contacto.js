document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-contacto');
    if (!formulario) return;
  
    const campos = {
      nombre: document.getElementById('nombre'),
      correo: document.getElementById('correo'),
      celular: document.getElementById('celular'),
      asunto: document.getElementById('asunto'),
      mensaje: document.getElementById('mensaje')
    };
  
    function mostrarError(idCampo, mostrar) {
      const errorEl = document.getElementById(`error-${idCampo}`);
      if (errorEl) {
        errorEl.style.display = mostrar ? 'block' : 'none';
      }
      campos[idCampo].style.borderColor = mostrar ? 'var(--peligro)' : 'var(--borde)';
    }
  
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      let esValido = true;
  
      // 1. Validar Nombre
      if (campos.nombre.value.trim().length < 3) {
        mostrarError('nombre', true);
        esValido = false;
      } else {
        mostrarError('nombre', false);
      }
  
      // 2. Validar Correo Electrónico
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexCorreo.test(campos.correo.value.trim())) {
        mostrarError('correo', true);
        esValido = false;
      } else {
        mostrarError('correo', false);
      }
  
      // 3. Validar Celular de Bolivia (8 dígitos comenzando en 6 o 7)
      const regexCelular = /^[67]\d{7}$/;
      if (!regexCelular.test(campos.celular.value.trim())) {
        mostrarError('celular', true);
        esValido = false;
      } else {
        mostrarError('celular', false);
      }
  
      // 4. Validar Asunto
      if (campos.asunto.value.trim().length < 3) {
        mostrarError('asunto', true);
        esValido = false;
      } else {
        mostrarError('asunto', false);
      }
  
      // 5. Validar Mensaje
      if (campos.mensaje.value.trim().length < 10) {
        mostrarError('mensaje', true);
        esValido = false;
      } else {
        mostrarError('mensaje', false);
      }
  
      // Si todos los campos son válidos, simular envío
      const alertaExito = document.getElementById('mensaje-exito');
      if (esValido) {
        alertaExito.style.display = 'block';
        mostrarToast('Formulario validado y enviado correctamente');
        formulario.reset();
        setTimeout(() => {
          alertaExito.style.display = 'none';
        }, 6000);
      } else {
        alertaExito.style.display = 'none';
      }
    });
  });