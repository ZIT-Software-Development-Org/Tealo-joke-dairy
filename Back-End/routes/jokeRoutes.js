import express from 'express';
import * as jokeController from '../controllers/jokeController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create a new joke (protected route)
router.post('/', authMiddleware, jokeController.createJoke);

// Get all jokes (public route)
router.get('/', jokeController.getAllJokes);

// Get a specific joke (public route)
router.get('/:id', jokeController.getJokeById);

// Update a joke (protected route)
router.put('/:id', authMiddleware, jokeController.updateJoke);

// Delete a joke (protected route)
router.delete('/:id', authMiddleware, jokeController.deleteJoke);

export default router;
