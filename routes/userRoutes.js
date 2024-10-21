import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import checkUserAuth from '../middlewares/auth_middlewares.js';

// Route Level middleware- to protect Routes
router.use('/changePassword',checkUserAuth)
router.use('/loggedUser',checkUserAuth)

// Public Routes
router.post('/register',UserController.userRegistration);
router.post('/login',UserController.userLogin);
router.post('/send-reset-password-email',UserController.sendUserPasswordResetEmail);
router.post('/reset-password/:id/:token',UserController.userPasswordRest);

// Protected Routes
router.post('/changePassword',UserController.changePassword);
router.get('/loggedUser',UserController.loggedUser);

export default router