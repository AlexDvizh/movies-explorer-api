const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
//const moviesRouter = require('./movies');

//const router = express.Router();

router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.use(auth);
router.use('/', usersRouter);
//router.use('/movies', moviesRouter);

module.exports = router;