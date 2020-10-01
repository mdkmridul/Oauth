const mongoose = require('mongoose');
const validator = require('validator')
const Job = require('./jobModel');

const userSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      trim: true,
      maxlength: [40, 'Too long for a name!'],
      minlength: [2, 'really? that small a name'],
      required: [true, 'Name field is necessary!'],
    },
    profilePic:{
      type: String,
    },
    mobileNo:{
      type: Number,
      min: 1000000000,
      max: 9999999999,
      unique: true,
    },
    email:{
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Please provide a Email!'],
      validate: [validator.isEmail, 'Please provide with a valid email'],
    },
    role: {
      type: String,
      enum: ['seeker', 'recruiter'],
      default: 'seeker',
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,

      validator: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords don't match up !"
      },
    },
    jobs: [
      {
      type: mongoose.Schema.ObjectId,
      ref: 'Job',
      },
    ],
    // jobStatus: [
    //   {
    //   type: String,
    //   enum: ['Accepted', 'Pending', 'Rejected'],
    //   },
    // ],
  }
)

const User = mongoose.model('User', userSchema);
module.exports = User;