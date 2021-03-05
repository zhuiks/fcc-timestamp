getTimestamp = (req) => {
  // console.log('*'+req+'*');
  let date = req === undefined ? new Date() : new Date(req);
  if (!date.valueOf()) {
    date = new Date(parseInt(req));
  }
  if (!date.valueOf()) {
    return { error: 'Invalid Date' };
  }
  return {
    unix: date.valueOf(),
    utc: date.toUTCString(),
  };
}

module.exports.getTimestamp = getTimestamp;
module.exports.middleware = (req, res) => {
    res.json(getTimestamp(req.params.date));
}