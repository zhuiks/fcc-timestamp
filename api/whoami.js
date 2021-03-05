module.exports.middleware = (req, res) => {
  res.json({
    ipaddress: req.ip,
    language: req.get('Accept-Language'),
    software: req.get('User-Agent'),
  });
}