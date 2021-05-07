const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const redExLink = /^https?:\/\/(www\.)?([a-z0-9-]*\.)?([a-z0-9-]*)\.([a-z0-9-]*)(\/([\w\-.~:/?#[]@!\$&'\(\)\*\+,;=])*)?/;

const validateCurrentUser = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
});

const validateUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().required(),
    movieId: Joi.number().required(),
    year: Joi.string().min(4).max(4).required(),
    description: Joi.string().min(5).max(120).required(),
    nameRU: Joi.string().min(2).max(30).required(),
    nameEN: Joi.string().min(2).max(30).required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (redExLink.test(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (redExLink.test(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (redExLink.test(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(),
});

module.exports = {
  validateCurrentUser,
  validateUpdateUserInfo,
  validateCreateUser,
  validateLogin,
  validateDeleteMovie,
  validateCreateMovie,
};
