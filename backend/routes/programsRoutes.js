const express = require('express');
const { createProgram, getPrograms, deleteProgram, updateProgram } = require('../controllers/programController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', verifyToken, authorizeRoles('admin'), createProgram);
router.get('/', verifyToken, authorizeRoles('admin', 'user'), getPrograms);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteProgram);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateProgram);

module.exports = router;
