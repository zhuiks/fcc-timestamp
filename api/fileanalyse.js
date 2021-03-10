const express = require('express');

const app = express();

app.post('/', (req, res) => {
  res.json({
    name: 'aaa',
    type: 'zzz',
    size: 123,
  });
})


exports.middleware = app;