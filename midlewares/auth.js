const jwt = require('jsonwebtoken');
const UnAuthError = require('../errors/un-auth-error');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw UnAuthError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;

    next();
  } catch (err) {
    next(new UnAuthError('Необходима авторизация'));
  }
};
