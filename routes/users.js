const usersRoutes = require('express').Router();
const { getUserById, updateInfoByCurrentUser } = require('../controllers/users');
const { validateUpdatedUser } = require('../middlewares/validation');

usersRoutes.get('/users/me', getUserById);
usersRoutes.patch('/users/me', validateUpdatedUser, updateInfoByCurrentUser);

module.exports = usersRoutes;