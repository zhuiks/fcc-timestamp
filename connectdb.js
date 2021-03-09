const mongoose = require('mongoose');

module.exports = async () => {
  return mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).
    catch(error => {
      console.error(`ERROR connecting to DB: ${error}`);
    });
}    
