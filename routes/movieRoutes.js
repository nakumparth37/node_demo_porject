const express = require('express');
const movieController = require('../controllers/movieController');
const { validateCreateMovie, validateUpdateMovie } = require('../middleware/validateMovie');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/all', movieController.getAllMovies);
router.post('/insert', auth.adminOnly, validateCreateMovie, movieController.createMovie);
router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMoviesByMovieId);
router.put('/update/:id', auth.adminOnly, validateUpdateMovie, movieController.updateMovie);
router.delete('/delete/:id', auth.adminOnly, movieController.deleteMovie);

module.exports = router;
