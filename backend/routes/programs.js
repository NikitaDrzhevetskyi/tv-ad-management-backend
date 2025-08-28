const express = require('express');
const { createProgram, getPrograms, deleteProgram } = require('../controllers/programController');

const router = express.Router();

router.post('/', createProgram);
router.get('/', getPrograms);
router.delete('/:id', deleteProgram);

module.exports = router;
