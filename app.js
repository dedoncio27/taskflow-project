const taskForm = document.getElementById("formListaTareas");
const taskInput = document.getElementById("infoTareas");
const taskList = document.getElementById("listaTareas");
const busqueda = document.getElementById("busquedaTareas");
const prioridadInput = document.getElementById("prioridadTarea");
const recordatorioInput = document.getElementById("recordatorioTarea");
const filtroPrioridad = document.getElementById("filtroPrioridad");
const filtroEstado = document.getElementById("filtroEstado");
const VERSION_ACTUAL = "1.1";
let arrayTareas = [];
let idTareaEnEdicion = null;

const ORDEN_PRIORIDAD = { urgente: 0, alta: 1, media: 2, baja: 3 };

/* Crea un ID único para cada tarea */
function crearIdTarea() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* Normaliza tareas antiguas (sin prioridad/recordatorio/completado) */
function normalizarTarea(t) {
    return {
        ...t,
        priority: t.priority ?? 'media',
        reminder: t.reminder ?? null,
        completed: t.completed ?? false
    };
}

/* Resetea el input de la tarea */
function resetTaskInput() {
    taskInput.value = '';
    taskInput.style.border = "1px solid #040353";
    if (prioridadInput) prioridadInput.value = 'media';
    if (recordatorioInput) recordatorioInput.value = '';

    idTareaEnEdicion = null;
    const btnSubmit = taskForm.querySelector('button[type="submit"]');
    if (btnSubmit) btnSubmit.textContent = 'Añadir Tarea';
    taskInput.focus();
}

/*Logica para añadir una tarea*/
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = taskInput.value.trim();
    
    if (texto === '') {
        taskInput.style.border = "2px solid red";
        // Aquí no usamos resetTaskInput para no cancelar la edición accidentalmente
        setTimeout(() => taskInput.style.border = "1px solid #040353", 1000); 
        return;
    }

    // Validamos que no exista otra tarea con el mismo nombre (ignorando la que estamos editando)
    const existe = arrayTareas.some(
        task => task.text.toLowerCase() === texto.toLowerCase() && task.id !== idTareaEnEdicion
    );
    
    if (existe) {
        taskInput.style.border = "2px solid red";
        alert("Esa tarea ya ha sido añadida.");
        setTimeout(() => taskInput.style.border = "1px solid #040353", 1000);
        return;
    }

    const priority = prioridadInput?.value || 'media';
    const reminderRaw = recordatorioInput?.value?.trim();
    const reminder = reminderRaw ? new Date(reminderRaw).toISOString() : null;

    if (idTareaEnEdicion !== null) {
        // MODO EDICIÓN
        const index = arrayTareas.findIndex(t => t.id === idTareaEnEdicion);
        if (index !== -1) {
            arrayTareas[index].text = texto;
            arrayTareas[index].priority = priority;
            arrayTareas[index].reminder = reminder;
        }
    } else {
        // MODO CREACIÓN
        const nuevaTarea = { id: crearIdTarea(), text: texto, priority, reminder, completed: false };
        arrayTareas.push(nuevaTarea);
    }

    resetTaskInput();
    guardarYActualizar();
});

/* Ordena tareas: pendientes primero, luego por prioridad y recordatorio */
function ordenarTareas(lista) {
    return [...lista].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const pa = ORDEN_PRIORIDAD[a.priority] ?? 2;
        const pb = ORDEN_PRIORIDAD[b.priority] ?? 2;
        if (pa !== pb) return pa - pb;
        if (!a.reminder) return 1;
        if (!b.reminder) return -1;
        return new Date(a.reminder) - new Date(b.reminder);
    });
}

/* Guarda y actualiza las tareas en el localStorage */
function guardarYActualizar() {
    localStorage.setItem('tareas', JSON.stringify(arrayTareas));
    aplicarFiltrosYRenderizar();
}

/* Elimina una tarea de la lista */
function eliminarTarea(id) {
    const idStr = String(id);
    arrayTareas = arrayTareas.filter(task => String(task.id) !== idStr);
    guardarYActualizar();
}

/* Marca o desmarca una tarea como completada */
function toggleCompletada(id) {
    const idStr = String(id);
    const task = arrayTareas.find(t => String(t.id) === idStr);
    if (!task) return;
    task.completed = !task.completed;
    guardarYActualizar();
}

/* Obtiene la lista filtrada según búsqueda, prioridad y estado */
function obtenerListaFiltrada() {
    let lista = arrayTareas.map(normalizarTarea);
    const texto = busqueda?.value?.toLowerCase().trim();
    const prioridad = filtroPrioridad?.value?.trim();
    const estado = filtroEstado?.value?.trim();
    if (texto) lista = lista.filter(t => t.text.toLowerCase().includes(texto));
    if (prioridad) lista = lista.filter(t => (t.priority || 'media') === prioridad);
    if (estado === 'pendientes') lista = lista.filter(t => !t.completed);
    if (estado === 'completadas') lista = lista.filter(t => t.completed);
    return ordenarTareas(lista);
}

/* Renderiza la lista de tareas */
function renderizar(listaAMostrar) {
    const lista = listaAMostrar ?? obtenerListaFiltrada();
    taskList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    lista.forEach(task => {
        const t = normalizarTarea(task);
        const li = document.createElement('li');
        li.classList.add('objetoTarea', `prioridad-${t.priority}`);
        if (t.completed) li.classList.add('tareaCompletada');
        li.dataset.id = String(t.id);

        // --- ELIMINAMOS EL BLOQUE DEL CHECKBOX ---

        const wrap = document.createElement('div');
        wrap.className = 'tareaContenido';

        const span = document.createElement('span');
        span.className = 'tareaTexto';
        span.textContent = t.text;

        const meta = document.createElement('div');
        meta.className = 'tareaMeta';

        const badge = document.createElement('span');
        badge.className = `badgePrioridad prioridad-${t.priority}`;
        badge.textContent = t.priority.charAt(0).toUpperCase() + t.priority.slice(1);

        meta.appendChild(badge);

        if (t.reminder) {
            const d = new Date(t.reminder);
            const recordatorio = document.createElement('span');
            recordatorio.className = 'tareaRecordatorio';
            recordatorio.textContent = d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
            meta.appendChild(recordatorio);
        }

        wrap.appendChild(span);
        wrap.appendChild(meta);

        const botonEditar = document.createElement('button');
        botonEditar.className = 'botonEditar';
        botonEditar.type = 'button';
        botonEditar.textContent = '✏️';

        const buttonEliminar = document.createElement('button');
        buttonEliminar.className = 'botonEliminar';
        buttonEliminar.type = 'button';
        buttonEliminar.textContent = '🗑️';

        // Solo añadimos el contenido y los botones
        li.append(wrap, botonEditar, buttonEliminar);
        fragment.appendChild(li);
    });

    taskList.appendChild(fragment);
}

function aplicarFiltrosYRenderizar() {
    renderizar();
}

/* Elimina una tarea o marca completada al hacer click */
taskList.addEventListener('click', (event) => {
    const li = event.target.closest('li');
    const id = li?.dataset?.id;
    if (!id) return;

    // 1. Si el clic fue en el botón Eliminar
    if (event.target.matches('.botonEliminar')) {
        eliminarTarea(id);
        return; // Salimos para que no ejecute el toggle
    }

    // 2. Si el clic fue en el botón Editar
    if (event.target.matches('.botonEditar')) {
        const task = arrayTareas.find(t => String(t.id) === String(id));
        if (!task) return;

        idTareaEnEdicion = task.id;
        taskInput.value = task.text;
        if (prioridadInput) prioridadInput.value = task.priority;
        if (recordatorioInput && task.reminder) {
            recordatorioInput.value = new Date(task.reminder).toISOString().slice(0, 16);
        }

        const btnSubmit = taskForm.querySelector('button[type="submit"]');
        if (btnSubmit) btnSubmit.textContent = 'Actualizar Tarea';
        
        taskInput.focus();
        return; // Salimos para que no ejecute el toggle
    }

    // 3. Si se pulsó en cualquier otra parte del LI (fondo, texto, etc.)
    toggleCompletada(id);
});

/* Filtra las tareas por texto, prioridad y estado */
if (busqueda) busqueda.addEventListener('input', aplicarFiltrosYRenderizar);
if (filtroPrioridad) filtroPrioridad.addEventListener('change', aplicarFiltrosYRenderizar);
if (filtroEstado) filtroEstado.addEventListener('change', aplicarFiltrosYRenderizar);

/* Comprueba recordatorios y muestra notificaciones */
function comprobarRecordatorios() {
    const now = new Date();
    arrayTareas.forEach(t => {
        const r = t.reminder;
        if (!r) return;
        const d = new Date(r);
        if (d > now) return;
        const key = `recordatorio-visto-${t.id}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
        const titulo = 'Recordatorio: ' + t.text;
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(titulo, { body: 'Tu misión del Olimpo te espera.' });
        } else {
            alert(titulo + '\n\nTu misión del Olimpo te espera.');
        }
    });
}

/* Solicita permiso de notificaciones al cargar */
const tareasPorDefecto = [
    { id: crearIdTarea(), text: "Leer capitulo Zeus", priority: "alta", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Hera", priority: "media", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Poseidón", priority: "alta", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Apolo", priority: "alta", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Demeter", priority: "alta", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Artemisa", priority: "alta", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Ares", priority: "alta", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Hermes", priority: "alta", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Atenea", priority: "alta", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Afrodita", priority: "alta", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Hefesto", priority: "alta", reminder: null, completed: false },
    { id: crearIdTarea(), text: "Leer capitulo Hestía", priority: "alta", reminder: null, completed: false },
];

/* Solicita permiso de notificaciones al cargar e inicializa tareas */
document.addEventListener('DOMContentLoaded', () => {
    const tareasGuardadas = localStorage.getItem('tareas');
    console.log("Estado inicial de localStorage:", tareasGuardadas);
    const versionGuardada = localStorage.getItem('app_version');

    // Si la versión es distinta a la actual, forzamos la carga de tareas nuevas
    if (versionGuardada !== VERSION_ACTUAL) {
        console.log("Nueva versión detectada. Actualizando tareas...");
        
        // Opción A: Reemplazar todo por lo nuevo
        arrayTareas = [...tareasPorDefecto, ...JSON.parse(tareasGuardadas || '[]')];
    
        localStorage.setItem('app_version', VERSION_ACTUAL);
        guardarYActualizar();
    }

    if (tareasGuardadas === null) {
        // Solo entra aquí si NUNCA se ha guardado nada
        arrayTareas = tareasPorDefecto;
        guardarYActualizar();
    } else {
        try {
            const parsed = JSON.parse(tareasGuardadas);
            // Si el array existe pero está vacío, cargamos lo que haya (lista vacía)
            arrayTareas = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Error al parsear tareas:", e);
            arrayTareas = [];
            localStorage.removeItem('tareas');
        } finally {
            aplicarFiltrosYRenderizar();
        }
    }

    comprobarRecordatorios();
    setInterval(comprobarRecordatorios, 60000);

    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});