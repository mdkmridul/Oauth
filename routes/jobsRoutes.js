const express = require('express');
const jobController = require('../controllers/jobController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', jobController.getAllJobs);
router.get('/myjobs',userController.protect, jobController.getMyJobs);
router.post('/', userController.protect, userController.restrictTo('recruiter'), jobController.createJob);
router.patch('/apply', userController.protect, userController.restrictTo('seeker'), jobController.applyJob);
router.patch('/', userController.protect, userController.restrictTo('recruiter'), jobController.updateJob);
router.delete('/', userController.protect, userController.restrictTo('recruiter'), jobController.deleteJob);


module.exports = router;
