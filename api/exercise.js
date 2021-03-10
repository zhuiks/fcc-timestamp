const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const connectDb = require('../connectdb.js');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));


const exerciseSchema = new mongoose.Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: Date,
});

const exerciseLogSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  log: [exerciseSchema],
});

const ExerciseLog = mongoose.model('ExerciseLog', exerciseLogSchema);


app.post('/new-user', async (req, res) => {
  try {
    await connectDb();
    const user = new ExerciseLog({username: req.body.username});
    const result = await user.save()
    // console.log(result);
    res.json({
      _id: result._id,
      username: result.username,
    });
  } catch(err) {
    res.json({error: err.message});
  }
});

app.get('/users', async (req, res) => {
  try {
    await connectDb();
    const users = await ExerciseLog.find({}, 'username').exec();
    res.json(users);  
  } catch(err) {
    res.json({error: err.message});
  }
});

app.post('/add', async (req, res) => {
  try {
    await connectDb();
      const user = await ExerciseLog.findById(  req.body.userId);
      const exercise = {
        description: req.body.description,
        duration: parseInt(req.body.duration),
        date: isNaN(Date.parse(req.body.date)) ? new Date() : new Date(req.body.date),
      };
      user.log.push(exercise);
      await user.save();
      res.json({
        _id: user._id,
        username: user.username,
        ...exercise,
        date: exercise.date.toDateString(),
      });
  } catch (err) {
    res.json({error: err.message})
  }
});

app.get('/log', async (req, res) => {
  try {
    // console.log(req.query);
    await connectDb();

    const dateFrom = new Date(req.query.from);
    const conditionFrom = !isNaN(dateFrom) ? 
      { $gte: ['$$exrs.date', dateFrom] } :
      {};
    const from = !isNaN(dateFrom) ?
      { from: dateFrom.toDateString() } :
      {}  
    const dateTo = new Date(req.query.to);
    const conditionTo = !isNaN(dateTo) ? 
      { $lte: ['$$exrs.date', dateTo] } :
      {};
    const to = !isNaN(dateTo) ?
      { to: dateTo.toDateString() } :
      {}  
    const condition = !isNaN(dateFrom) && !isNaN(dateTo) ?
      { $and: [conditionFrom, conditionTo] } :
      {...conditionFrom, ...conditionTo };

    const limit = parseInt(req.query.limit);

    const user = await ExerciseLog.findById(req.query.userId,
        {
          username: '$username',
          log: { $slice: [
            {$filter: {
              input: '$log',
              as: 'exrs',
              cond: condition
            }}, 
            !isNaN(limit) && limit > 0 ?
              limit :
              { $size: '$log' }
          ]}
        });

    res.json({
      _id: user._id,
      username: user.username,
      count: user.log.length,
      ...from,
      ...to,
      log: user.log.map(exrs => ({
        description: exrs.description,
        duration: exrs.duration,
        date: exrs.date.toDateString(),
      })),
    })
  } catch(err) {
    res.json({error: err.message});
  }
});

exports.middleware = app;