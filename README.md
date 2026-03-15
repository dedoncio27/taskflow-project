# Mitología Griega · Dioses del Olimpo

Web interactiva sobre mitología griega con interfaz de libro y gestor de tareas inspirado en el Olimpo.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## Descripción

Sitio web que combina:

- **Enciclopedia de mitología griega**: información sobre los doce dioses olímpicos (Zeus, Hera, Poseidón, Apolo, Deméter, Artemisa, Ares, Hermes, Atenea, Afrodita, Hefesto y Hestia).
- **Interfaz tipo libro**: navegación por capítulos con transiciones de páginas.
- **Tareas del Olimpo**: gestor de tareas con prioridades y recordatorios.

---

## Características

### Libro interactivo
- Navegación por capítulos desde el menú lateral
- Transiciones animadas entre páginas
- Portada, índice y capítulos por dios

### Gestor de tareas
- Crear, buscar y eliminar tareas
- **Prioridades**: Baja, Media, Alta, Urgente
- **Recordatorios**: fecha y hora con notificaciones del navegador
- Filtro por prioridad y búsqueda por texto
- Persistencia en `localStorage`

### Interfaz
- Modo claro / oscuro con persistencia
- Diseño adaptable
- Estilos con Tailwind CSS

---

## Estructura del proyecto

```
taskflow-project/
├── index.html          # Página principal
├── app.js              # Lógica de tareas
├── transiciones.js     # Navegación y modo oscuro
├── estilo.css          # Estilos fuente (Tailwind)
├── output.css          # CSS compilado
├── tailwind.config.js  # Configuración Tailwind
├── imagenes/           # Recursos gráficos
└── docs/               # Documentación
```

---

## Uso

1. **Navegar**: usa los botones del menú lateral para cambiar de capítulo.
2. **Añadir tarea**: escribe el texto, elige prioridad y opcionalmente una fecha de recordatorio.
3. **Filtrar**: usa la búsqueda o el desplegable de prioridad.
4. **Modo oscuro**: haz clic en el botón de la barra de navegación.

Para recibir recordatorios como notificaciones del sistema, acepta el permiso cuando el navegador lo solicite.

---

## Tecnologías

- **HTML5**
- **CSS3** + Tailwind CSS v4
- **JavaScript** (vanilla)
- **localStorage** para persistencia
- **Notification API** para recordatorios

---

## Licencia

Proyecto educativo. Consulta los archivos del repositorio para más detalles.
