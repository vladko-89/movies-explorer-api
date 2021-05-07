const Movie = require('../models/movie');
const PathNotFoundError = require('../errors/path-non-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при сохранении фильма!'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovieByID = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new PathNotFoundError('Фильм с указанным _id не найден!');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Доступ ограничен! Нельзя удалять чужие фильмы!');
      } else {
        Movie.findByIdAndRemove(req.params.id)
          // eslint-disable-next-line no-shadow
          .then((movie) => {
            res.send(movie);
          });
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некорректные данные при удалении фильма!'));
      } else {
        next(err);
      }
    });
};
