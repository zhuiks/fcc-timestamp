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
    console.log(result);
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

exports.middleware = app;