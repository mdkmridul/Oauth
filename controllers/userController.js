const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const { promisify } = require('util');
const { json } = require('express');

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.gglToken = async(req, res, next) => {
  try{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ){
      token = req.headers.authorization.split(' ')[1];
    }
    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const decoded = ticket.getPayload();
    const userid = decoded['sub'];
    
    if(!token) {
      res.status(401).json({
        status: 'fail',
        message: 'You are not logged in Please log in again',
      })
    }
    console.log(decoded);
    user = await User.findOne({email: decoded.email});
    if (!user) {
      x = await User.create({
        name: decoded.name,
        email: decoded.email,
        image: decoded.picture,
      })
      res.status(200).json({
        status:'Success',
        x,
      })
    }
  } catch (err){
      res.status(500).json({
        status:'fail',
        message:err.message,
      });
    };
}

exports.protect = async(req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ){
      token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
      res.status(401).json({
        status: 'fail',
        message: 'You are not logged in Please log in again',
      })
    } 

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);


    next();
  } catch (err){
      res.status(500).json({
        status:'fail',
        message:err.message,
      });
    };
};

exports.signUp = async (req, res) => {
  try{
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passowrdConfirm,
      role: req.body.role,
      mobileNo: req.body.mobileNo,
    });
    const token = signToken(newUser._id);
    if(newUser.role === "seeker") {
      const jobs = await Job.find();    
      res.status(201).json({
        status: 'Success',
        jobs,
        newUser,
        token,
      });
    }
    else{
      res.status(201).json({
        status: 'Success',
        newUser,
        token,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.logIn = async (req, res) => {
  console.log("****");
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    const jobs = await Job.find({_id: {$in: user.jobs}})
    if (user && req.body.password){
      if (req.body.password === user.password) {
        const token = signToken(user._id)
        res.status(200).json({
          status: 'Success',
          jobs,
          user,
          token,
        })
      }
      else{
        res.status(400).json({
          status: "something is missing",
        })
      }
    }   
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.body.role)) {
      res.status(403).json({
        status: 'Fail',
        message: 'You are not authorised to perform this task',
      })
    }
    next();
  }
};
