const express = require('express');
const { body, param } = require('express-validator');
const movieController = require('../controllers/movie.controller');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Validation middleware
const movieValidation = [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('releaseYear').isInt({ min: 1888 }),
  body('genre').notEmpty().trim(),
  body('rating').isFloat({ min: 0, max: 10 }),
  body('imageUrl').isURL(),
  body('director').notEmpty().trim(),
  body('actors').isArray().notEmpty(),
  body('duration').isInt({ min: 1 })
];

// Routes
router.get('/', movieController.getAllMovies);
router.get('/:id', param('id').isInt(), validateRequest, movieController.getMovieById);
router.post('/', movieValidation, validateRequest, movieController.createMovie);
router.put('/:id', param('id').isInt(), movieValidation, validateRequest, movieController.updateMovie);
router.delete('/:id', param('id').isInt(), validateRequest, movieController.deleteMovie);

module.exports = {
  movieRoutes: router
};