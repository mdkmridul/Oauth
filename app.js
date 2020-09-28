const express = require('express');
var cons = require('consolidate');
const path = require('path');
const userRouter = require('./routes/userRoutes');
const jobsRouter = require('./routes/jobsRoutes');

const app = express();

app.use(express.json());
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/ggl', (req,res) => {
  res.status(200).render('views');
});

app.get('/', (req, res) => {
  res.status(200).render('home');
});

app.use('/users', userRouter);
app.use('/jobs', jobsRouter);

module.exports = app;