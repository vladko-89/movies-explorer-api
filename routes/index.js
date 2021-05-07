const router = require('express').Router();
const { createUser, login } = require('../controllers/users');

const userRouter = require('./users');
const movieRouter = require('./movies');

const PathNotFoundError = require('../errors/path-non-found-error');
const auth = require('../midlewares/auth');
const { validateCreateUser, validateLogin } = require('../midlewares/validatons');

router.post('/signup', validateCreateUser, createUser);

router.post('/signin', validateLogin, login);

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('/*', (req, res, next) => {
  next(new PathNotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
