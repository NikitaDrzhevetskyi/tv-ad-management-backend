const express = require('express');
const { 
  createAdvertisement, 
  getAdvertisements, 
  getUserAdvertisements,
  updateAdvertisementStatus, 
  deleteAdvertisement 
} = require('../controllers/advertisementController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

//Create new advertisement order for authenticated users
router.post('/', verifyToken, createAdvertisement);

// Get all advertisements only for admin 
router.get('/', verifyToken, authorizeRoles('admin'), getAdvertisements);

//Get user's own advertisements
router.get('/my', verifyToken, getUserAdvertisements);

// PUT Update advertisement status (admin only)
router.put('/:id/status', verifyToken, authorizeRoles('admin'), updateAdvertisementStatus);

// Delete advertisement (admin only)
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteAdvertisement);

module.exports = router;