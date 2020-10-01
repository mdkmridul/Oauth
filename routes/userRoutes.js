const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.logIn)
router.post('/gglLogin', userController.gglToken)
router.post('/signup', userController.signUp)
router.use(userController.protect)

router.patch('/', userController.updateMe);

module.exports = router;
