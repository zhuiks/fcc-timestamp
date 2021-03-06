const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.originalUrl}`);
  next();
});

const timestamp = require('./api/timestamp').middleware;
app.use('/timestamp/:date?', timestamp);

const whoami = require('./api/whoami').middleware;
app.use('/whoami', whoami);

const shorturl = require('./api/shorturl').middleware;
app.use('/shorturl', shorturl);

const exercise = require('./api/exercise').middleware;
app.use('/exercise', exercise);

const fileanalyse = require('./api/fileanalyse.js').middleware;
app.use('/fileanalyse', fileanalyse);

module.exports = app;