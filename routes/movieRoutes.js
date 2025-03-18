const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const auth = require('../middleware/authMiddleware');
const { validateCreateMovie, validateUpdateMovie } = require('../middleware/validateMovie');

// ✅ Public Routes (No authentication required)
router.get('/all', movieController.getAllMovies);
router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMoviesByMovieId);

// Group routes that require Admin & Permission Middleware
router.use(auth.protect);
// Admin-Only Routes (Protected)
router.post('/insert',  auth.checkPermission('movies', 'create'), validateCreateMovie, movieController.createMovie);
router.put('/update/:id', auth.checkPermission('movies', 'update'), validateUpdateMovie, movieController.updateMovie);
router.delete('/delete/:id', auth.checkPermission('movies', 'delete'), movieController.deleteMovie);
// router.put('/assign-movie-ids', movieController.assignMovieIDs);

module.exports = router;
