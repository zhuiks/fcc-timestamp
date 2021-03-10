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
    console.log(req.body.date);
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
    console.log(req.query);
    await connectDb();
    const user = await ExerciseLog.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.query.userId) } },
        // { $project: {
        //   username: '$username',
        //   log: {$filter: {
        //     input: '$log',
        //     as: 'exrs',
        //     cond: { $gt: ['$$exrs.duration', 5]}
        //   }},
        // }},
        { $addFields: {
          count: { $size: '$log'},
          username: '$username',
          // log: { $map: {
          //   input: '$log',
          //   as: 'exrs',
          //   in: { 
          //     description: '$$exrs.description',
          //     duration: '$$exrs.duration',
          //     date: {$function: {
          //       body: function(d) {
          //         return new Date(d).toUTCString();
          //       }, 
          //       args: ['$$exrs.date'],
          //       lang: 'js'
          //     }}  
          //   }
          // }}
          }}
      ]);
    // res.json(user);
    res.json({
      ...user[0],
      log: user[0].log.map(exrs => ({
        ...exrs,
        date: exrs.date.toDateString(),
      })),
    })
  } catch(err) {
    res.json({error: err.message});
  }
});

exports.middleware = app;