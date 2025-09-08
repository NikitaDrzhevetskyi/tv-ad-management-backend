const express = require('express');
const { 
  createAdvertisement, 
  getAdvertisements, 
  getUserAdvertisements,
  updateAdvertisementStatus,
  assignAgentToAdvertisement,
  deleteAdvertisement 
} = require('../controllers/advertisementController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', verifyToken, createAdvertisement);

router.get('/', verifyToken, authorizeRoles('admin'), getAdvertisements);

router.get('/my', verifyToken, getUserAdvertisements);

router.put('/:id/status', verifyToken, authorizeRoles('admin'), updateAdvertisementStatus);

router.put('/:id/agent', verifyToken, authorizeRoles('admin'), assignAgentToAdvertisement);

router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteAdvertisement);

module.exports = router;