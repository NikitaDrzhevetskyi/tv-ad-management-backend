const express = require('express');
const { createProgram, getPrograms, deleteProgram, updateProgram } = require('../controllers/programController');

const router = express.Router();

router.post('/', createProgram);
router.get('/', getPrograms);
router.delete('/:id', deleteProgram);
router.put('/:id', updateProgram);

module.exports = router;
