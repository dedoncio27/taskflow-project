const taskForm = document.getElementById("formListaTareas");
const taskInput = document.getElementById("infoTareas");
const taskList = document.getElementById("listaTareas");
const busqueda = document.getElementById("busquedaTareas");
const prioridadInput = document.getElementById("prioridadTarea");
const recordatorioInput = document.getElementById("recordatorioTarea");
const filtroPrioridad = document.getElementById("filtroPrioridad");
let arrayTareas = [];

const ORDEN_PRIORIDAD = { urgente: 0, alta: 1, media: 2, baja: 3 };

/* Crea un ID único para cada tarea */
function crearIdTarea() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* Normaliza tareas antiguas (sin prioridad/recordatorio) */
function normalizarTarea(t) {
    return {
        ...t,
        priority: t.priority ?? 'media',
        reminder: t.reminder ?? null
    };
}

/* Resetea el input de la tarea */
function resetTaskInput() {
    taskInput.value = '';
    taskInput.style.border = "1px solid #040353";
    if (prioridadInput) prioridadInput.value = 'media';
    if (recordatorioInput) recordatorioInput.value = '';
    taskInput.focus();
}

/*Logica para añadir una tarea*/
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = taskInput.value.trim();
    if (texto === '') {
        taskInput.style.border = "2px solid red";
        setTimeout(resetTaskInput, 1000);
        return;
    }
    const existe = arrayTareas.some(
        task => task.text.toLowerCase() === texto.toLowerCase()
    );
    if (existe) {
        taskInput.style.border = "2px solid red";
        alert("Esa tarea ya ha sido añadida.");
        setTimeout(resetTaskInput, 1000);
        return;
    }
    const priority = prioridadInput?.value || 'media';
    const reminderRaw = recordatorioInput?.value?.trim();
    const reminder = reminderRaw ? new Date(reminderRaw).toISOString() : null;

    const nuevaTarea = { id: crearIdTarea(), text: texto, priority, reminder };
    arrayTareas.push(nuevaTarea);
    resetTaskInput();
    guardarYActualizar();
});

/* Ordena tareas por prioridad y luego por recordatorio */
function ordenarTareas(lista) {
    return [...lista].sort((a, b) => {
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

/* Obtiene la lista filtrada según búsqueda y prioridad */
function obtenerListaFiltrada() {
    let lista = arrayTareas.map(normalizarTarea);
    const texto = busqueda?.value?.toLowerCase().trim();
    const prioridad = filtroPrioridad?.value?.trim();
    if (texto) lista = lista.filter(t => t.text.toLowerCase().includes(texto));
    if (prioridad) lista = lista.filter(t => (t.priority || 'media') === prioridad);
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
        li.dataset.id = String(t.id);

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
            const now = new Date();
            const recordatorio = document.createElement('span');
            recordatorio.className = 'tareaRecordatorio';
            recordatorio.textContent = d.toLocaleString('es-ES', {
                dateStyle: 'short',
                timeStyle: 'short'
            });
            if (d <= now) recordatorio.classList.add('recordatorioPasado');
            meta.appendChild(recordatorio);
        }

        wrap.appendChild(span);
        wrap.appendChild(meta);

        const button = document.createElement('button');
        button.className = 'botonEliminar';
        button.type = 'button';
        button.textContent = 'Eliminar';

        li.append(wrap, button);
        fragment.appendChild(li);
    });

    taskList.appendChild(fragment);
}

function aplicarFiltrosYRenderizar() {
    renderizar();
}

/* Elimina una tarea de la lista al hacer click en el botón */
taskList.addEventListener('click', (event) => {
    if (!event.target.matches('.botonEliminar')) return;
    const li = event.target.closest('li');
    const id = li?.dataset?.id;
    if (!id) return;
    eliminarTarea(id);
});

/* Filtra las tareas por texto y prioridad */
if (busqueda) busqueda.addEventListener('input', aplicarFiltrosYRenderizar);
if (filtroPrioridad) filtroPrioridad.addEventListener('change', aplicarFiltrosYRenderizar);

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
document.addEventListener('DOMContentLoaded', () => {
    const tareasGuardadas = localStorage.getItem('tareas');
    if (tareasGuardadas) {
        try {
            const parsed = JSON.parse(tareasGuardadas);
            arrayTareas = Array.isArray(parsed) ? parsed : [];
        } catch {
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