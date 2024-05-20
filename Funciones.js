let arreglosTareas = [];
let elementosGuardados = 0;

let done = new Audio('pop-94319.mp3');
let undone = new Audio('pop-94319.mp3');

function init(){
    // Registro del service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
            console.log('SW registrado correctamente');
        }, function(err) {
            console.log('SW fallo', err);
        });
    } else {
        console.log("ERROR");
    }

    let fecha = new Date();
    let mesNúmero = fecha.getMonth();
    let mes = "";

    // Si ya existen tareas guardadas en el LS, los vamos a obtener en la interfaz
    if (localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'));
        for (let i = 0; i < tareas.length; i++) {
            arreglosTareas.push(tareas[i]);
        }
        // Mandar llamar función que cargue las tareas en la interfaz
        loadTareas();
    } else {
        // Si no hay tareas, crear el espacio de memoria en LS
        localStorage.setItem('tareas', JSON.stringify(arreglosTareas));
    }

    switch (mesNúmero) {
        case 0: mes = "Enero"; break;
        case 1: mes = "Febrero"; break;
        case 2: mes = "Marzo"; break;
        case 3: mes = "Abril"; break;
        case 4: mes = "Mayo"; break;
        case 5: mes = "Junio"; break;
        case 6: mes = "Julio"; break;
        case 7: mes = "Agosto"; break;
        case 8: mes = "Septiembre"; break;
        case 9: mes = "Octubre"; break;
        case 10: mes = "Noviembre"; break;
        case 11: mes = "Diciembre"; break;
    }
    document.getElementById('fecha').innerHTML = fecha.getDate() + " de " + mes;
}

function loadTareas() {
    // Antes de cargar las tareas limpiamos la interfaz
    document.querySelector('.Hacer').innerHTML = "<h3>Por hacer</h3>";
    document.querySelector('.Ejer').innerHTML = "<h3>Terminado</h3>";

    // Cargar las tareas de LS
    for (let i = 0; i < arreglosTareas.length; i++) {
        // Crear los elementos en el HTML
        let elemento = "<div class='In'>" +
        "<input type='checkbox' class='checkbox-style' name='myCheckbox' id='" + i + "' " + (arreglosTareas[i].estatus === 'terminado' ? 'checked' : '') + " onchange='cambiarEstado(" + i + ")'>" +
        "<label for='" + i + "' class='labelcheck'>" + arreglosTareas[i].valor + 
        "<i class='fas fa-check'></i>" + 
        "</label><br>" +
        "</div>";
        
        // Dividir las tareas por su estado para poderlas plasmar en el espacio html correspondiente
        if (arreglosTareas[i].estatus === 'pendiente') {
            document.querySelector('.Hacer').innerHTML += elemento;
        } else if (arreglosTareas[i].estatus === 'terminado') {
            document.querySelector('.Ejer').innerHTML += elemento;
        }
    }
    elementosGuardados = arreglosTareas.length;
}

function agregar(event) {
    event.preventDefault(); // Evitar que el formulario recargue la página

    // Capturar el elemento de la entrada de texto
    let tareasTexto = document.getElementById('nuevaTarea');

    // Nuevo objeto JS
    let jsonTarea = {
        'valor': tareasTexto.value,
        'estatus': 'pendiente'
    };

    // Agregar al arreglo de JSON la nueva tarea
    arreglosTareas.push(jsonTarea);

    // Crear nuevo elemento en la interfaz de usuario
    let elemento = "<div class='In' id='" + elementosGuardados + "'>" +
        "<input type='checkbox' class='checkbox-style' name='myCheckbox' id='" + elementosGuardados + "' onchange='cambiarEstado(" + elementosGuardados + ")'>" +
        "<label for='" + elementosGuardados + "' class='labelcheck'>" + jsonTarea.valor + "</label><br>" +
        "</div>";

    // Lo agrego a la interfaz
    document.querySelector('.Hacer').innerHTML += elemento;

    // Agregar al LS el arreglo de JSON en formato texto
    localStorage.setItem('tareas', JSON.stringify(arreglosTareas));

    // Limpiar cuadro de texto(input)
    tareasTexto.value = '';

    // Incrementamos los elementos guardados
    elementosGuardados++;
}

function actualizarLocalStorage() {
    localStorage.setItem('tareas', JSON.stringify(arreglosTareas));
}

function cambiarEstado(id) {
    // Cambiar el estado de la tarea
    if (arreglosTareas[id].estatus === 'pendiente') {
        arreglosTareas[id].estatus = 'terminado';
        done.play();
    } else {
        arreglosTareas[id].estatus = 'pendiente';
        undone.play();
    }
    // Actualizar Local Storage
    actualizarLocalStorage();
    // Recargar las tareas en la interfaz
    loadTareas();
}

function limpiarTodo() {
    // Limpiar el arreglo de tareas
    arreglosTareas = [];
    // Actualizar Local Storage
    localStorage.setItem('tareas', JSON.stringify(arreglosTareas));
    // Recargar la interfaz
    loadTareas();
}

// Evento al cargar la página
window.addEventListener('load', init);
