const API_BASE = '/api/v1/tasks';

async function peticion(url, opciones = {}) {
  const respuesta = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  });

  if (respuesta.status === 204) return null;

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || `Error ${respuesta.status}`);
  }

  return datos;
}

export const obtenerTareas = () => peticion(API_BASE);

export const crearTarea = (datos) => peticion(API_BASE, {
  method: 'POST',
  body: JSON.stringify(datos),
});

export const eliminarTarea = (id) => peticion(`${API_BASE}/${id}`, {
  method: 'DELETE',
});

export const actualizarTarea = (id, cambios) => peticion(`${API_BASE}/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(cambios),
});
