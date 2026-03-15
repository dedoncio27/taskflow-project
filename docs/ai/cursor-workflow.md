# Cursor

## 📕Descripción📕

Instalación de cursor y analizaremos los autocompletados y atajos de teclado, tambien explicaremos las mejoras que hemos tenido con cursor y las nuevas funcionalidades aplicadas.

## ⌨️Atajos de teclado de cursor⌨️

Atajos que uso ctrl+k para la edicion inline, alt+flecha arriba o abajo que cambia el codigo o texto que hay en tu linea o lo que tienes seleccionado a la de arriba o la de abajo, si te equivocas de linea o quieres organizarlo mucho mas rápido y comodo que volverlo a escribir o hacer ctrl+c ctrl+v, personalmente no uso ninguno mas habitualmente pero me parece muy interesante y util el ctrl+shift+f que te abre la busqueda entre archivos que busca lo que pongas en todos los archivos por si no encuentras una funcion o algo en especifico.

---

## 🔝Mejoras con cursor🔝

- **Seguridad**
    Se corrigió una vulnerabilidad de inyección XSS en el renderizado de tareas: se sustituyó el uso de innerHTML por la creación de nodos DOM y textContent, evitando la ejecución de código malicioso introducido por el usuario.

    Ha mejorado la generación de identificadores únicos mediante crypto.randomUUID(), con un fallback para entornos que no lo soporten, reduciendo el riesgo de colisiones al crear tareas de forma rápida.

    Añadió manejo de errores en la carga de datos desde localStorage mediante try/catch, evitando fallos si los datos están corruptos o son inválidos.

- **Robustez y mantenibilidad**
    Eliminó la dependencia de variables globales en la navegación entre páginas. Los botones se obtienen mediante document.getElementById() y se asocian mediante addEventListener, lo que mejora la estabilidad y la legibilidad del código.

    Ha añadido validación para elementos inexistentes en el DOM (por ejemplo, páginas no encontradas) y se ha implementado un sistema de tokens para cancelar transiciones obsoletas cuando el usuario navega rápidamente entre secciones.

    Corrigió el borrado de tareas antiguas normalizando la comparación de identificadores a string, de modo que tanto tareas con ID numérico como con UUID funcionen correctamente.

- **Rendimiento**
    Optimizó el renderizado de la lista de tareas usando DocumentFragment, reduciendo las operaciones directas sobre el DOM y mejorando el rendimiento al mostrar muchas tareas.

- **Compatibilidad con datos existentes**
    Ha añadido la función normalizarTarea() para adaptar tareas antiguas al nuevo modelo de datos, asignando valores por defecto (prioridad "media" y recordatorio nulo) cuando faltan estos campos, garantizando compatibilidad con datos guardados antes de las mejoras.

---

## MCP

### Instalación

Entras a las settings de cursor y buscas la opción Tools & MCP y le das a New MCP Server, se te abrirá un archivo mcp.json que completas con el siguiente código:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"]
    }
  }
}
```
Y después de esto reinicias cursor por completo y para saber si funciona o no vuelves a la opción de Tools & MCP y que no aparezca filesystem con error, después consulta al chat de cursor por ejemplo lee el contenido de index.html o que archivos.js hay en mi proyecto, si responde bien es que está funcionando.

Puede ser muy útil en proyectos reales ya que permite acceder a información rápido, puede servir para consultas rápidas por ejemplo con bases de datos preguntas rápidas como cuantos usuarios se registraron esta semana o la lectura rápida de documentos y archivos del proyecto.

---

## 🔨Funcionalidades🔨

### Funcionalidad 1 y 2: Prioridades y recordatorios

Nueva funcionalidad en la que se eligen prioridades al añadir una tarea, tiene prioridades baja, media, alta y urgente y aplica un filtro para buscar tambien por prioridad de tareas.
A la vez añadimos otra funcionalidad que lo que hace es poder añadir una fecha y hora a tus tareas para que estas se recuerden al navegador en el momento que han de ser realizadas.

#### HTML:

<form id="formListaTareas">
    <input type="text" id="infoTareas" placeholder="Escribe una nueva misión" required>
    <select id="prioridadTarea" title="Prioridad">
        <option value="baja">Baja</option>
        <option value="media" selected>Media</option>
        <option value="alta">Alta</option>
        <option value="urgente">Urgente</option>
    </select>
    <input type="datetime-local" id="recordatorioTarea" title="Fecha y hora del recordatorio">
    <button type="submit" id="botonAñadirTarea">Asignar Tarea</button>
</form>

<select id="prioridadTarea" title="Prioridad">
    <option value="baja">Baja</option>
    <option value="media" selected>Media</option>
    <option value="alta">Alta</option>
    <option value="urgente">Urgente</option>
</select>
<div class="filtrosTareas">
    <input type="text" id="busquedaTareas" placeholder="Busca tus misiones">
    <select id="filtroPrioridad" title="Filtrar por prioridad">
        <option value="">Todas las prioridades</option>
        <option value="urgente">Urgente</option>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
    </select>
</div>

Simplemente la estructura que se ha dado al html para los botones y opciones de estos para la seleccion al añadir tareas y la busqueda de estas.


#### JavaScript:
```javascript
const prioridadInput = document.getElementById("prioridadTarea");
const recordatorioInput = document.getElementById("recordatorioTarea");
const filtroPrioridad = document.getElementById("filtroPrioridad");

function resetTaskInput() {
    taskInput.value = '';
    taskInput.style.border = "1px solid #040353";
    if (prioridadInput) prioridadInput.value = 'media';
    if (recordatorioInput) recordatorioInput.value = '';
    taskInput.focus();
}
```
Modifica el resetTaskImput para que se resetee en el valor de prioridad media y la funcionalidad de la fecha y hora para los recordatorios quede vacio ya que esta funcionalidad es opcional

```javascript
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
```
Funcion que ordena por prioridad las tareas y luego por la fecha y hora de los recordatorios.

```javascript
function obtenerListaFiltrada() {
    let lista = arrayTareas.map(normalizarTarea);
    const texto = busqueda?.value?.toLowerCase().trim();
    const prioridad = filtroPrioridad?.value?.trim();
    if (texto) lista = lista.filter(t => t.text.toLowerCase().includes(texto));
    if (prioridad) lista = lista.filter(t => (t.priority || 'media') === prioridad);
    return ordenarTareas(lista);
}
if (busqueda) busqueda.addEventListener('input', aplicarFiltrosYRenderizar);
if (filtroPrioridad) filtroPrioridad.addEventListener('change', aplicarFiltrosYRenderizar);
```

Esta función filtra la lista de tareas por prioridad elegida, primero accede a la función normalizarTarea para que le de una prioridad a las tareas si alguna es antigua y no la tiene y deja el recordatorio en null, añade el texto añadido a una constante y filtra si tu búsqueda coincide con alguna de las tareas ya añadidas a la lista y toma la prioridad seleccionada para devolver las tareas que coincidan con la prioridad.

```javascript
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
```

Esta función comprueba los recordatorios y envía un alert en tu pagina cuando llega la fecha elegida en la tarea, recorre todas las tareas, comprueba si tiene recordatorio, comprueba también si este recordatorio ya pasó, le da un valor key que indica si este recordatorio ha sido visto o no, comprueba que el navegador permita las notificaciones y envía el alert con el nombre de la tarea a la fecha y hora elegida.

```javascript
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
```

Este código pide permiso de recibir notificaciones para que la funcionalidad de recordatorio funcione.

---

### Funcionalidad 3: Checkbox para tareas completadas

Al marcar el checkbox la tarea se tacha visualmente y se guarda el estado en localStorage. Incluye un filtro por estado (Todas, Pendientes, Completadas) y las tareas completadas se ordenan al final de la lista.

#### HTML:

<select id="filtroEstado" title="Filtrar por estado">
    <option value="">Todas</option>
    <option value="pendientes">Pendientes</option>
    <option value="completadas">Completadas</option>
</select>

Se añade este select dentro de .filtrosTareas para filtrar por estado de la tarea.

#### JavaScript:

```javascript
function normalizarTarea(t) {
    return {
        ...t,
        priority: t.priority ?? 'media',
        reminder: t.reminder ?? null,
        completed: t.completed ?? false
    };
}

function toggleCompletada(id) {
    const idStr = String(id);
    const task = arrayTareas.find(t => String(t.id) === idStr);
    if (!task) return;
    task.completed = !task.completed;
    guardarYActualizar();
}
```

La función normalizarTarea añade completed: false por defecto a tareas antiguas. La función toggleCompletada invierte el estado completed de la tarea al hacer clic en el checkbox y guarda los cambios.

```javascript
const filtroEstado = document.getElementById("filtroEstado");

// ordenarTareas actualizado: pendientes primero, completadas al final
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

// obtenerListaFiltrada actualizado: filtro por estado
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
if (filtroEstado) filtroEstado.addEventListener('change', aplicarFiltrosYRenderizar);
```

```javascript
// En renderizar: se crea un checkbox por tarea
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.className = 'checkboxTarea';
checkbox.checked = !!t.completed;
// Se añade al li: li.append(checkbox, wrap, button);

// Event listener para checkbox y botón eliminar
taskList.addEventListener('click', (event) => {
    const li = event.target.closest('li');
    const id = li?.dataset?.id;
    if (!id) return;
    if (event.target.matches('.botonEliminar')) {
        eliminarTarea(id);
        return;
    }
    if (event.target.matches('.checkboxTarea')) {
        toggleCompletada(id);
    }
});
```

Cada tarea muestra un checkbox a la izquierda. Si la tarea esta completada, el li recibe la clase tareaCompletada y el texto se muestra tachado (text-decoration: line-through). El evento click distingue entre el boton Eliminar y el checkbox para ejecutar la acción correspondiente.

---

### Funcionalidad 4: Modo oscuro o claro persistente

JavaScript:
```JavaScript
const guardado = localStorage.getItem('theme');
if (guardado === 'dark' || guardado === 'light') aplicarTheme(guardado);
else aplicarTheme(root.classList.contains('dark') ? 'dark' : 'light');
/* Cambia el tema al hacer click en el botón */
btnDark.addEventListener('click', () => {
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    aplicarTheme(next);
});
```
Guarda el tema en una constante en el localStorage y asi recuerda si tenías el modo claro o oscuro para la próxima vez que entres a la página sea en el modo que esuviste por última vez

Comprueba la constante y aplica el tema guardado en la constante, también aplica un addEventListener para que al dar al botón cambie el tema y también el valor de la constante ya que tiene el valor 'theme'.