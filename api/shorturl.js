const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns').promises;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

const validateUrl = async (url) => {
  const parts = url.split('/');
  // console.log(parts, parts[0] !== 'http:' && parts[0] !== 'https:' && parts[1] !== '');
  if(parts[0] !== 'http:' && parts[0] !== 'https:' && parts[1] !== '') {
    console.log('ups: '+parts[0]);
    return Promise.reject();
  }  
  // console.log('dns lookup: '+parts[2]);
  await dns.lookup(parts[2]).
    then(res => {
      console.log(res);
    }).
    catch(error => {
      console.error(error);
    });
  return true;

}

const shortUrlSchema = new mongoose.Schema({
  short: {
    type: Number,
    required: true,
    unique: true,
    },
  url: {
    type: String,
    required: true,
  }  
});
const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

const connectDb = () => {
  return mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).
    catch(error => {
      console.error(`ERROR connecting to DB: ${error}`);
    });
}    

const addToDb = async (url, short) => {
  await validateUrl(url);
  // console.log('url validated!');
  await connectDb();
  const shortUrl = new ShortUrl({url, short});
  return shortUrl.save();;
}

const lookupDb = async (short) => {
  await connectDb();
  const shortUrl = await ShortUrl.findOne({short});
  // console.log(short, shortUrl.url);
  return shortUrl.url;
}

app.post('/new', (req, res) => {
  const original_url = req.body.url;
  const short_url = Date.now()-Date.parse('2021-03-01');
  // console.log(`trying to add "${original_url}"-->"${short_url}"`);
  addToDb(original_url, short_url).then(() => {
    res.json({
      original_url,
      short_url,
    });
  }).catch(error => {
    res.json({
      error: 'invalid url'
    });
  });
});

app.get('/:short', (req, res) => {
  lookupDb(req.params.short).
    then( url => {
      res.redirect(url);
    }).catch(error => {
      res.send(`Can't find the shortcut provided: "${req.params.short}"`);
    });
});

exports.middleware = app;