const misPaginas = [
    document.querySelector(".paginaPortada"), 
    document.querySelector(".paginaIndex"),   
    document.querySelector(".paginaZeus"),    
    document.querySelector(".paginaHera"),    
    document.querySelector(".paginaPoseidon"),
    document.querySelector(".paginaApolo"),
    document.querySelector(".paginaDemeter"),
    document.querySelector(".paginaArtemisa"),
    document.querySelector(".paginaAres"),
    document.querySelector(".paginaHermes"),
    document.querySelector(".paginaAtenea"),
    document.querySelector(".paginaAfrodita"),
    document.querySelector(".paginaHefesto"),
    document.querySelector(".paginaHestia")
];

function irAPagina(destino) {
    misPaginas.forEach((p, i) => {
        // Calculamos un pequeño retraso basado en la posición de la página
        // para que no giren todas a la vez si hay mucha distancia
        const delay = Math.abs(i - destino) * 30; 

        setTimeout(() => {
            if (i < destino) {
                p.classList.add('flipped');
            } else {
                p.classList.remove('flipped');
            }
        }, delay);
    });
}

botonPortada.onclick = () => irAPagina(0);
botonIndex.onclick = () => irAPagina(1);
botonZeus.onclick = () => irAPagina(2);
botonHera.onclick = () => irAPagina(3);
botonPoseidon.onclick = () => irAPagina(4);
botonApolo.onclick = () => irAPagina(5);
botonDemeter.onclick = () => irAPagina(6);
botonArtemisa.onclick = () => irAPagina(7);
botonAres.onclick = () => irAPagina(8);
botonHermes.onclick = () => irAPagina(9);
botonAtenea.onclick = () => irAPagina(10);
botonAfrodita.onclick = () => irAPagina(11);
botonHefesto.onclick = () => irAPagina(12);
botonHestia.onclick = () => irAPagina(13);

const btnDark = document.getElementById('toggle-dark');

if (btnDark) {
    btnDark.onclick = () => {
        document.documentElement.classList.toggle('dark');
    };
}


