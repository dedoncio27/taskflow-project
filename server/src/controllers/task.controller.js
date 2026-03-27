'use strict';

const taskService = require('../services/task.service');

const obtenerTodas = (req, res) => {
  res.json(taskService.obtenerTodas());
};

const obtenerPorId = (req, res, next) => {
  try {
    const tarea = taskService.obtenerPorId(req.params.id);
    res.json(tarea);
  } catch (err) {
    next(err);
  }
};

const crearTarea = (req, res, next) => {
  try {
    const { titulo, prioridad, recordatorio } = req.body;
    if (!titulo || titulo.trim().length < 3) {
      return res.status(400).json({ error: 'El título es obligatorio (min 3 carac).' });
    }
    const nuevaTarea = taskService.crearTarea({ titulo, prioridad, recordatorio });
    res.status(201).json(nuevaTarea);
  } catch (err) {
    next(err);
  }
};

const actualizarTotal = (req, res, next) => {
  try {
    const { titulo } = req.body;
    if (!titulo) return res.status(400).json({ error: 'PUT requiere título completo.' });
    const actualizada = taskService.actualizarTarea(req.params.id, req.body, true);
    res.json(actualizada);
  } catch (err) {
    next(err);
  }
};

const actualizarParcial = (req, res, next) => {
  try {
    const actualizada = taskService.actualizarTarea(req.params.id, req.body, false);
    res.json(actualizada);
  } catch (err) {
    next(err);
  }
};

const eliminarTarea = (req, res, next) => {
  try {
    taskService.eliminarTarea(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crearTarea,
  actualizarTotal,
  actualizarParcial,
  eliminarTarea
};
