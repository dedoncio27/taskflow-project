'use strict';

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../../data/tasks.json');

// Intentar asegurar que el directorio de datos existe (fallará en Vercel, pero lo ignoramos)
try {
  if (!fs.existsSync(path.dirname(FILE_PATH))) {
    fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  }
} catch (err) {
  console.warn('[Service] No se pudo crear el directorio de datos (esto es normal en Vercel):', err.message);
}

function generarId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const DEFAULT_TASKS = [
  { id: generarId(), titulo: "Leer capitulo Zeus", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Hera", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Poseidón", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Apolo", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Demeter", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Artemisa", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Ares", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Hermes", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Atenea", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Afrodita", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Hefesto", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
  { id: generarId(), titulo: "Leer capitulo Hestía", prioridad: "alta", recordatorio: null, completada: false, creadaEn: new Date().toISOString() },
];

function cargarTareas() {
  if (!fs.existsSync(FILE_PATH)) {
    guardarTareas(DEFAULT_TASKS);
    return DEFAULT_TASKS;
  }
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[Service] Error cargando tareas, usando vacías:', err);
    return [];
  }
}

function guardarTareas(lista) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(lista, null, 2));
  } catch (err) {
    // En Vercel no se puede escribir, así que solo avisamos en el log.
    // Los cambios seguirán funcionando en memoria mientras la instancia esté viva.
    console.warn('[Service] No se pudo persistir en disco (Vercel read-only):', err.message);
  }
}

let tasks = cargarTareas();

const PRIORIDADES_VALIDAS = ['baja', 'media', 'alta', 'urgente'];

const obtenerTodas = () => tasks;

const obtenerPorId = (id) => {
  const tarea = tasks.find(t => t.id === id);
  if (!tarea) throw new Error('NOT_FOUND');
  return tarea;
};

const crearTarea = (data) => {
  const { titulo, prioridad, recordatorio } = data;
  const nuevaTarea = {
    id: generarId(),
    titulo: titulo.trim(),
    prioridad: prioridad || 'media',
    recordatorio: recordatorio || null,
    completada: false,
    creadaEn: new Date().toISOString(),
  };
  tasks.push(nuevaTarea);
  guardarTareas(tasks);
  return nuevaTarea;
};

const actualizarTarea = (id, cambios, completo = false) => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error('NOT_FOUND');

  if (completo) {
    tasks[index] = {
      ...tasks[index],
      titulo: cambios.titulo.trim(),
      prioridad: cambios.prioridad || 'media',
      recordatorio: cambios.recordatorio || null,
      completada: cambios.completada ?? false,
    };
  } else {
    tasks[index] = { ...tasks[index], ...cambios };
  }

  guardarTareas(tasks);
  return tasks[index];
};

const eliminarTarea = (id) => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error('NOT_FOUND');
  tasks.splice(index, 1);
  guardarTareas(tasks);
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  PRIORIDADES_VALIDAS
};
