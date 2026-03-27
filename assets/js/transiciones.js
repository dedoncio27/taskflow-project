
const misPaginas = [
    ".paginaPortada",
    ".paginaIndex",
    ".paginaZeus",
    ".paginaHera",
    ".paginaPoseidon",
    ".paginaApolo",
    ".paginaDemeter",
    ".paginaArtemisa",
    ".paginaAres",
    ".paginaHermes",
    ".paginaAtenea",
    ".paginaAfrodita",
    ".paginaHefesto",
    ".paginaHestia",
].map((sel) => document.querySelector(sel)).filter(Boolean);

let navToken = 0;
let navTimeouts = [];

/* Función para ir a una página */
function irAPagina(destino) {
    navToken += 1;
    const token = navToken;

    navTimeouts.forEach(clearTimeout);
    navTimeouts = [];

    /* Aplica la transición de flip a las páginas */
    misPaginas.forEach((p, i) => {
        const delay = Math.abs(i - destino) * 30;

        const t = setTimeout(() => {
            if (token !== navToken) return;
            if (i < destino) {
                p.classList.add('flipped');
            } else {
                p.classList.remove('flipped');
            }
        }, delay);

        navTimeouts.push(t);
    });
}

/* Define las páginas y sus destinos */
const navegacion = [
    ["botonPortada", 0],
    ["botonIndex", 1],
    ["botonZeus", 2],
    ["botonHera", 3],
    ["botonPoseidon", 4],
    ["botonApolo", 5],
    ["botonDemeter", 6],
    ["botonArtemisa", 7],
    ["botonAres", 8],
    ["botonHermes", 9],
    ["botonAtenea", 10],
    ["botonAfrodita", 11],
    ["botonHefesto", 12],
    ["botonHestia", 13],
];


navegacion.forEach(([id, destino]) => {
    const link = document.getElementById(id);
    if (!link) return;

    link.addEventListener('click', (e) => {
        e.preventDefault();
        irAPagina(destino);
    });
});

/**Boton modo oscuro */
const btnDark = document.getElementById('toggle-dark');

if (btnDark) {
    const root = document.documentElement;
    /* Aplica el tema oscuro o claro */
    const aplicarTheme = (theme) => {
        const dark = theme === 'dark';
        root.classList.toggle('dark', dark);
        btnDark.setAttribute('aria-pressed', String(dark));
        btnDark.textContent = dark ? "Modo claro☀️" : "Modo oscuro🌙";
    };

    const guardado = localStorage.getItem('theme');
    if (guardado === 'dark' || guardado === 'light') aplicarTheme(guardado);
    else aplicarTheme(root.classList.contains('dark') ? 'dark' : 'light');

    btnDark.addEventListener('click', () => {
        const next = root.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        aplicarTheme(next);
    });
}
