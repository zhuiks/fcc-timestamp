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
  username: String,
  log: [exerciseSchema],
});

const ExerciseLog = mongoose.model('ExerciseLog', exerciseLogSchema);



exports.middleware = app;