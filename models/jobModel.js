const { CronJob } = require('cron');
const mongoose = require('mongoose');
const User = require('./userModel');
const cron = require('cron').CronJob;

const jobSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      required: [true, 'Provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Provide a description'],
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'Provide an area'],
    },
    city: {
      type: String,
      required: [true, 'Provide a City'],
    },
    state: {
      type: String,
      required: [true, 'Provide a State'],
    },
    country: {
      type: String,
      required: [true, 'Provide a Country'],
    },
    companyName: {
      type: String,
      required: [true, 'Provide a dCompanyName'],
    },
    totalPositions: {
      type: Number,
    },
    minExp: {
      type: Number,
      default: 0,
    },
    maxExp: Number,
    minSalary: Number,
    maxSalary: Number,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    status:{
      type: String,
      enum:['Active', 'Closed'],
      default:'Active',
    },
  }
)

jobSchema.post('save', function (next) {
  const task = new CronJob('* * * 15 * *', function(){
    this.status = 'Closed',
    this.save()
  },
  null,true) 
})

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;