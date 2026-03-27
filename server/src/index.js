'use strict';

const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');

const taskRouter = require('./routes/task.routes');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());

// Middleware de auditoría
const loggerAcademico = (req, res, next) => {
  const inicio = performance.now();
  res.on('finish', () => {
    const duracion = (performance.now() - inicio).toFixed(2);
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duracion}ms)`);
  });
  next();
};
app.use(loggerAcademico);

// Rutas
app.use('/api/v1/tasks', taskRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── Fase C: Robustez y Manejo de Errores ────────────────────────────────────

// 1. Middleware final de manejo de errores (4 parámetros)
app.use((err, req, res, next) => {
  // Mapeo semántico de errores HTTP
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Recurso no encontrado.' });
  }

  // Error 400 por defecto para errores de validación simple si los lanzamos como error
  if (err.message === 'BAD_REQUEST') {
    return res.status(400).json({ error: 'Petición incorrecta.' });
  }

  // Para cualquier otro fallo no controlado:
  // Registramos la traza en consola para el desarrollador
  console.error('[SERVER ERROR]', err);

  // Devolvemos mensaje genérico al cliente (sin filtrar detalles técnicos)
  res.status(500).json({ error: 'Error interno del servidor. Inténtalo más tarde.' });
});

// 2. Manejo de rutas inexistentes (404 por defecto de red)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

if (process.env.NODE_ENV !== 'production' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Servidor en http://localhost:${PORT}`);
  });
}

module.exports = app;

