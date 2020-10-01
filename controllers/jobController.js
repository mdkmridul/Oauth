const Job = require('../models/jobModel');
const User = require('../models/userModel');

exports.createJob = async(req, res) => {
  const newJob = await Job.create(req.body);
  const user = await User.findById(req.user._id)
  user.findByIdAndUpdate({
    $push: { jobs: newJob._id}
  })

  res.status(201).json({
    status: 'success',
    data: {
      data: newJob,
    }
  });
};

exports.getAllJobs = async(req, res) => {
  try{
    const jobs = Job.find({status:{$ne: 'Closed'}});
    status(200).json({
      status:'Success',
      jobs,
    })
  } catch(err){
    res.status(400).json({
      status: 'Fail',
      meassage: err.message,
    })
  }
};

exports.getMyJobs = async(req, res) => {
  try {
    const jobs = await Job.find({_id:{$in: req.user.jobs}}, {status:{$ne: 'Closed'}});
    

    res.status(200).json({
      status: 'Success',
      jobs,
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    })
  }
};

exports.getJob = async(req, res) => {
  try {
    const job = await Job.findOne(req.params.id)

    res.status(200).json({
      status: 'Success',
      job,
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
};

exports.updateJob = async(req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new:true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'Success',
      job,
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    })
  };
};

exports.deleteJob = async(req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
  
    res.status(204).json({
      status: 'Success',
      data: null,
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    })
  }
};

exports.applyJob = async(req, res) => {
  try{
    const user = await User.findById(req.user._id)
    user.findByIdAndUpdate({
      $push: { jobs: req.body.jobId}
    })
    res.status(200).json({
      status:'Success',
      user,
    });
  }
  catch(err) {
    res.status(400).json({
      sttaus:'fail',
      message: err.message,
    })
  };
}; 
