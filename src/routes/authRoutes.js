import express from 'express';
import { register, login, logout, deleteUser } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';
const router = express.Router();

// Register user
router.post("/register", validateRequest(registerSchema), register)

// Login user
router.post("/login", validateRequest(loginSchema), login)

// Logout user
router.post("/logout", logout)

// Delete user
router.delete("/delete/:id", deleteUser)

export default router;