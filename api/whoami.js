module.exports.middleware = (req, res) => {
  res.json({
    ipaddress: req.ip,
    language: 'Uk',
    software: 'Firefox',
  });
}