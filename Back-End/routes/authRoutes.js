import express from 'express';
import { createData } from '../controllers/authController.js';
const authRoutes = express.Router();

authRoutes.post("/signup", createData);

export default authRoutes;