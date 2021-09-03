const moviesRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovie, validateMovieId } = require('../middlewares/validation');

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', validateMovie, createMovie);
moviesRouter.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = moviesRouter;
