import express from 'express';
import { body } from 'express-validator';
import {
  register,
  verifyOTP,
  resendOTP,
  login,
  getProfile,
  updateProfile,
  forgotPassword,        
  resetPassword,         
  sendChangePasswordOTP, 
  changePassword         
} from '../controllers/auth.controller.js';
import protect from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
], register);

router.post('/verify-otp', verifyOTP);

router.post('/resend-otp', resendOTP);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password-otp', protect, sendChangePasswordOTP);
router.post('/change-password', protect, changePassword);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  validate
], login);

// Protected routes
router.get('/profile', protect, getProfile);

router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().matches(/^[0-9]{10}$/),
  body('address').optional().isLength({ max: 200 }),
  validate
], updateProfile);

export default router;
