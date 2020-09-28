const express = require('express');
const jobController = require('../controllers/jobController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/',  function(){});
router.post('/', userController.protect, userController.restrictTo('recruiter'), jobController.createJob);
router.patch('/apply', userController.protect, userController.restrictTo('seeker'), jobController.applyJob);

module.exports = router;
