const express = require('express');
const { createAgent, getAgents, getAgentById, updateAgent, deleteAgent } = require('../controllers/agentController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', verifyToken, authorizeRoles('admin'), createAgent);

router.get('/', verifyToken, authorizeRoles('admin'), getAgents);

router.get('/:id', verifyToken, authorizeRoles('admin'), getAgentById);

router.put('/:id', verifyToken, authorizeRoles('admin'), updateAgent);

router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteAgent);

module.exports = router;
