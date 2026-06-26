import express from 'express';
import {
  createListing,
  getAllListings,
  getListingsByUser,
  getUserListingById,
  getListingById,
  updateListing,
  deleteListing,
} from '../controllers/listingControllers.js';
import authMiddleware  from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllListings); 
// Protected routes

router.get('/user/:userId', authMiddleware, getListingsByUser); 
router.get('/user/:userId/:listingId', authMiddleware, getUserListingById); 
router.post('/create', authMiddleware, createListing); 
router.put('/:id', authMiddleware, updateListing); 
router.delete('/:id', authMiddleware, deleteListing); 

router.get('/:id', getListingById);


export default router;