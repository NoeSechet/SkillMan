const express = require('express');
const router = express.Router();
const controllerUser = require('../controllers/controllerProject');
const userMiddleware = require('../middlewares/userMiddleware');

router.post('/add', userMiddleware.ensureToken, controllerUser.addProject);
router.delete('/delete/:id', userMiddleware.ensureToken, controllerUser.deleteProject);
router.get('/get/:id', userMiddleware.ensureToken, controllerUser.getUserProject);
router.put('/modify/:id', userMiddleware.ensureToken, controllerUser.modifyProject);

module.exports = router