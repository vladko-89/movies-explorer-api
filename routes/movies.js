const router = require('express').Router();
const {
  getMovies,
  addMovie,
  deleteMovieByID,
} = require('../controllers/movies');
const { validateDeleteMovie, validateCreateMovie } = require('../midlewares/validatons');

router.get('/', getMovies);
router.post('/', validateCreateMovie, addMovie);
router.delete('/:id', validateDeleteMovie, deleteMovieByID);

module.exports = router;
