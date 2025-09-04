const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

//only admin can acces this router
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

//All can access this router
router.get('/user', verifyToken, authorizeRoles('admin', 'user'), (req, res) => {
  res.json({ message: 'Welcome User' });
});

module.exports = router;
