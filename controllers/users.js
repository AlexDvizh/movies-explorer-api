const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');
const User = require('../models/user');
const NotValidData = require('../errors/NotValidData');
const NotFoundError = require('../errors/NotFoundError');
const NotValidEmail = require('../errors/NotValidEmail');
const NotValidLoginOrPass = require('../errors/NotValidLoginOrPass');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден')))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidData('Переданы некорректные данные при обновлении профиля'));
      }
    });
};

exports.updateInfoByCurrentUser = (req, res, next) => {
  const owner = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(owner, { name, email }, { new: true, runValidators: true })
    .orFail(() => new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new NotValidData('Переданы некорректные данные при обновлении профиля'));
      }
    });
};

exports.registerUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => User.findOne({ email }).select('-password'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidData('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new NotValidEmail('Пользователь с переданным email уже существует'));
      }
    });
};

exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      console.log(token);
      return res.send({ token });
    })
    .catch(() => {
      next(new NotValidLoginOrPass('Передан неверный логин или пароль'));
    });
};