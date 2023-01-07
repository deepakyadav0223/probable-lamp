let mongoose = require("mongoose")

var data = new mongoose.Schema({
    email:{
        type: String,
        required:true
    }
   
  });

var sign = mongoose.model('email', data);
module.exports = sign ;