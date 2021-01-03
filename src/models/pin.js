const mongoose=require('mongoose');

var Schema=mongoose.Schema;

var pinSchema=new Schema({
    officeName:String,
    pincode:Number,
    taluk:String,
    districtName:String,
    stateName:String

},{collection:'pin'});

module.exports = mongoose.model("Pin",pinSchema);
