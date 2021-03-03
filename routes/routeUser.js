const express = require('express');
const router = express.Router();
const controllerUser = require('../controllers/controllerUser');
const userMiddleware = require('../middlewares/userMiddleware');

router.get('/', controllerUser.getUserInfo);
router.post('/register', controllerUser.registerUser);
router.post('/login', controllerUser.loginUser);
router.post('/login/google', controllerUser.loginGoogleUser);
router.get('/confirm', controllerUser.confirmUser);
router.get('/get/:id', userMiddleware.ensureToken, controllerUser.getUser);

module.exports = router;