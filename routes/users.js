const usersRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUserById, updateInfoByCurrentUser, registerUser, loginUser,
} = require('../controllers/users');

usersRoutes.get('/users/me', getUserById);
usersRoutes.patch('/users/me',updateInfoByCurrentUser);
usersRoutes.post('/signup', registerUser);
usersRoutes.post('/signin', loginUser);

module.exports = usersRoutes;