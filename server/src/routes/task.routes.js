'use strict';

const { Router } = require('express');
const controller = require('../controllers/task.controller');

const router = Router();

router.get('/', controller.obtenerTodas);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crearTarea);
router.put('/:id', controller.actualizarTotal);
router.patch('/:id', controller.actualizarParcial);
router.delete('/:id', controller.eliminarTarea);

module.exports = router;
