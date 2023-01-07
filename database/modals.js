let mongoose = require("mongoose")

var data = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    value: {
        type: String,
        required:true
    },
    status: Boolean,
    time :{
        type: String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
    
   
  });

var sign = mongoose.model('minorproject', data);
module.exports = sign ;