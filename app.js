const taskForm = document.getElementById("formListaTareas");
const taskInput = document.getElementById("infoTareas");
const taskList = document.getElementById("listaTareas");
const busqueda = document.getElementById("busquedaTareas")


let arrayTareas = [];


taskForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const texto = taskInput.value.trim();
    if (texto === '')return;
    
    const existe = arrayTareas.some(task => task.text.toLowerCase() === texto.toLowerCase());

    if (existe) {
        taskInput.style.border = "2px solid red";
        alert("Esa tarea ya ha sido añadida por favor introduzca otra tarea");
        setTimeout(() => {
            taskInput.style.border = "1px solid #040353";
            taskInput.value= "";
        }, 1000);
        return; 
    }

    const nuevaTarea = {
        id: Date.now(), 
        text: texto
    };

    arrayTareas.push(nuevaTarea);
    
    taskInput.value = '';
    taskInput.focus();

    guardarTarea();
});

function eliminarTarea(id) {
    
    arrayTareas = arrayTareas.filter(task => task.id !== id);
    guardarTarea();
}


function guardarTarea() {
    localStorage.setItem('tareas', JSON.stringify(arrayTareas));
    generarTarea();
}


function generarTarea() {
    taskList.innerHTML = ''; 

    arrayTareas.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('objetoTarea');
        
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="botonEliminar" onclick="eliminarTarea(${task.id})">Eliminar</button>
        `;
        
        taskList.appendChild(li);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const tareasGuardadas = localStorage.getItem('tareas');
    if (tareasGuardadas) {
        arrayTareas = JSON.parse(tareasGuardadas);
        generarTarea();
    }
});


busqueda.addEventListener('input', () => {
    const textoUsuario = busqueda.value.toLowerCase();
    const liTareas = document.querySelectorAll('.objetoTarea');
    liTareas.forEach(li => {
        const textoTarea = li.querySelector('span').textContent.toLowerCase();
        if (textoTarea.includes(textoUsuario)) {
            li.style.display = "flex"; 
        } else {
            li.style.display = "none";
        }
    });
});