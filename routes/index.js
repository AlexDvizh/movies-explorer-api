const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRoutes = require('./users');
const moviesRouter = require('./movies');
const { validateRegister, validateLogin } = require('../middlewares/validation');

router.post('/signup', validateRegister, registerUser);
router.post('/signin', validateLogin, loginUser);
router.use(auth);
router.use('/', usersRoutes);
router.use('/', moviesRouter);

module.exports = router;