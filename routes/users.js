const router = require('express').Router();
const {
  getCurrentUser, updateUserInfo,
} = require('../controllers/users');

const { validateCurrentUser, validateUpdateUserInfo } = require('../midlewares/validatons');

router.get('/me', validateCurrentUser, getCurrentUser);

router.patch('/me', validateUpdateUserInfo, updateUserInfo);

module.exports = router;
