const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.originalUrl}`);
  next();
});

const timestamp = require('./api/timestamp').middleware;
app.use('/timestamp/:date?', timestamp);

module.exports = app;