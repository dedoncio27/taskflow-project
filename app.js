const taskForm = document.getElementById("formListaTareas");
const taskInput = document.getElementById("infoTareas");
const taskList = document.getElementById("listaTareas");
const busqueda = document.getElementById("busquedaTareas");

let arrayTareas = [];


taskForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const texto = taskInput.value.trim();
    if (texto === '') return;
    
    
    const existe = arrayTareas.some(task => task.text.toLowerCase() === texto.toLowerCase());

    if (existe) {
        taskInput.style.border = "2px solid red";
        alert("Esa tarea ya ha sido añadida.");
        setTimeout(() => {
            taskInput.style.border = "1px solid #040353";
            taskInput.value = "";
        }, 1000);
        return; 
    }

    const nuevaTarea = { id: Date.now(), text: texto };
    arrayTareas.push(nuevaTarea);
    
    taskInput.value = '';
    taskInput.focus();
    guardarYActualizar();
});

function guardarYActualizar() {
    localStorage.setItem('tareas', JSON.stringify(arrayTareas));
    renderizar(arrayTareas);
}

function eliminarTarea(id) {
    arrayTareas = arrayTareas.filter(task => task.id !== id);
    guardarYActualizar();
}


function renderizar(listaAMostrar = arrayTareas) {
    taskList.innerHTML = ''; 

    listaAMostrar.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('objetoTarea');
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="botonEliminar" onclick="eliminarTarea(${task.id})">Eliminar</button>
        `;
        taskList.appendChild(li);
    });
}



busqueda.addEventListener('input', () => {
    const textoUsuario = busqueda.value.toLowerCase();
    
    const tareasFiltradas = arrayTareas.filter(task => 
        task.text.toLowerCase().includes(textoUsuario)
    );
    
    renderizar(tareasFiltradas);
});

document.addEventListener('DOMContentLoaded', () => {
    const tareasGuardadas = localStorage.getItem('tareas');
    if (tareasGuardadas) {
        arrayTareas = JSON.parse(tareasGuardadas);
        renderizar();
    }
});