import { obtenerTareas, crearTarea, eliminarTarea, actualizarTarea } from './client.js';

const taskForm = document.getElementById("formListaTareas");
const taskInput = document.getElementById("infoTareas");
const taskList = document.getElementById("listaTareas");
const busqueda = document.getElementById("busquedaTareas");
const prioridadInput = document.getElementById("prioridadTarea");
const recordatorioInput = document.getElementById("recordatorioTarea");
const filtroPrioridad = document.getElementById("filtroPrioridad");
const filtroEstado = document.getElementById("filtroEstado");

let arrayTareas = [];
let idTareaEnEdicion = null;

const ORDEN_PRIORIDAD = { urgente: 0, alta: 1, media: 2, baja: 3 };

// ─── Gestión de Estados de Red ───────────────────────────────────────────────

function mostrarEstadoRed(tipo, mensaje) {
  document.querySelectorAll('.bannerRed').forEach(b => b.remove());
  if (!tipo) return;

  const banner = document.createElement('div');
  banner.className = `bannerRed bannerRed--${tipo}`;
  banner.textContent = mensaje;
  taskList.before(banner);

  if (tipo === 'exito') setTimeout(() => banner.remove(), 2000);
}

function setCargando(activo) {
  const btn = taskForm.querySelector('button[type="submit"]');
  if (btn) btn.disabled = activo;
  taskInput.disabled = activo;
}

// ─── Lógica de la Aplicación ─────────────────────────────────────────────────

async function cargarTareas() {
  mostrarEstadoRed('cargando', '⏳ Cargando misiones del Olimpo...');
  try {
    arrayTareas = await obtenerTareas();
    mostrarEstadoRed(null);
    renderizar();
  } catch (err) {
    mostrarEstadoRed('error', `❌ Error: ${err.message}`);
  }
}

function renderizar() {
  const lista = obtenerListaFiltrada();
  taskList.innerHTML = '';
  const fragment = document.createDocumentFragment();

  lista.forEach(t => {
    const li = document.createElement('li');
    li.classList.add('objetoTarea', `prioridad-${t.prioridad}`);
    if (t.completada) li.classList.add('tareaCompletada');
    li.dataset.id = String(t.id);

    li.innerHTML = `
      <div class="tareaContenido">
        <span class="tareaTexto">${t.titulo}</span>
        <div class="tareaMeta">
          <span class="badgePrioridad prioridad-${t.prioridad}">${t.prioridad}</span>
          ${t.recordatorio ? `<span class="tareaRecordatorio">📅 ${new Date(t.recordatorio).toLocaleString()}</span>` : ''}
        </div>
      </div>
      <button class="botonEditar">✏️</button>
      <button class="botonEliminar">🗑️</button>
    `;
    fragment.appendChild(li);
  });
  taskList.appendChild(fragment);
}

function obtenerListaFiltrada() {
  let lista = [...arrayTareas];
  const texto = busqueda?.value?.toLowerCase().trim();
  const prioridad = filtroPrioridad?.value?.trim();
  const estado = filtroEstado?.value?.trim();

  if (texto) lista = lista.filter(t => t.titulo.toLowerCase().includes(texto));
  if (prioridad) lista = lista.filter(t => t.prioridad === prioridad);
  if (estado === 'ninguna') return [];
  if (estado === 'pendientes') lista = lista.filter(t => !t.completada);
  if (estado === 'completadas') lista = lista.filter(t => t.completada);

  return lista.sort((a, b) => (ORDEN_PRIORIDAD[a.prioridad] || 0) - (ORDEN_PRIORIDAD[b.prioridad] || 0));
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = taskInput.value.trim();
  if (titulo.length < 3) return;

  setCargando(true);
  try {
    if (idTareaEnEdicion) {
      const actualizada = await actualizarTarea(idTareaEnEdicion, {
        titulo,
        prioridad: prioridadInput.value,
        recordatorio: recordatorioInput.value || null
      });
      const idx = arrayTareas.findIndex(t => t.id === idTareaEnEdicion);
      arrayTareas[idx] = actualizada;
      mostrarEstadoRed('exito', '✅ Tarea actualizada.');
    } else {
      const nueva = await crearTarea({
        titulo,
        prioridad: prioridadInput.value,
        recordatorio: recordatorioInput.value || null
      });
      arrayTareas.push(nueva);
      mostrarEstadoRed('exito', '✅ Tarea asignada.');
    }
    taskInput.value = '';
    recordatorioInput.value = '';
    idTareaEnEdicion = null;
    taskForm.querySelector('button[type="submit"]').textContent = 'Asignar Tarea';
    renderizar();
  } catch (err) {
    mostrarEstadoRed('error', err.message);
  } finally {
    setCargando(false);
  }
});

taskList.addEventListener('click', async (e) => {
  const li = e.target.closest('li');
  const id = li?.dataset?.id;
  if (!id) return;

  if (e.target.matches('.botonEliminar')) {
    try {
      await eliminarTarea(id);
      arrayTareas = arrayTareas.filter(t => t.id !== id);
      renderizar();
    } catch (err) {
      alert(err.message);
    }
    return;
  }

  if (e.target.matches('.botonEditar')) {
    const t = arrayTareas.find(t => t.id === id);
    idTareaEnEdicion = id;
    taskInput.value = t.titulo;
    prioridadInput.value = t.prioridad;
    recordatorioInput.value = t.recordatorio || '';
    taskForm.querySelector('button[type="submit"]').textContent = 'Actualizar Tarea';
    taskInput.focus();
    return;
  }

  // Toggle completada
  const t = arrayTareas.find(t => t.id === id);
  try {
    const actualizada = await actualizarTarea(id, { completada: !t.completada });
    const idx = arrayTareas.findIndex(t => t.id === id);
    arrayTareas[idx] = actualizada;
    renderizar();
  } catch (err) {
    alert(err.message);
  }
});

if (busqueda) busqueda.addEventListener('input', renderizar);
if (filtroPrioridad) filtroPrioridad.addEventListener('change', renderizar);
if (filtroEstado) filtroEstado.addEventListener('change', renderizar);

document.addEventListener('DOMContentLoaded', cargarTareas);