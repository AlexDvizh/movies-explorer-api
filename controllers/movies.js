const Movie = require('../models/movie');
const NotValidData = require('../errors/NotValidData');
const NotFoundError = require('../errors/NotFoundError');
const NotValidCard = require('../errors/NotValidCard');

exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const newMovie = { ...req.body, owner };

  Movie.create(newMovie)
    .then((movie) => {
      Movie.findById(movie._id).populate(['owner'])
        .then((ownerMovie) => res.send(ownerMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidData('Переданы некорректные данные при добавлении фильма'));
      } else {
        next(err);
      }
    });
};

exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError('Фильм с указанным _id не найден'))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        throw new NotValidCard('Попытка удалить чужую карточку');
      } else {
        return movie.remove()
          .then(() => res.send({ message: 'Фильм удален' }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidData('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};