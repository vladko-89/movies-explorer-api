const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const PathNotFoundError = require('../errors/path-non-found-error');
const BadRequestError = require('../errors/bad-request-error');
const DoubleRegistrationError = require('../errors/double-registration-error');

module.exports.createUser = (req, res, next) => {
  const data = { ...req.body };

  if (!data.password) {
    throw new BadRequestError('Такой пароль не подайдет!');
  }

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: data.email,
      password: hash,
      avatar: data.avatar,
      name: data.name,
      about: data.about,
    }))
    .then((user) => {
      res.status(201).send({ data: user.toJSON() });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DoubleRegistrationError('Пользователь с таким Email уже существует!'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя!'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)

    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new PathNotFoundError('Пользователь по указанному _id не найден!');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Пользователь по указанному _id не найден!'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new PathNotFoundError('Пользователь по указанному _id не найден!');
      }
      return res.send({ user: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DoubleRegistrationError('Пользователь с таким Email уже существует!'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля!'));
      } else {
        next(err);
      }
    });
};
