const mongoose=require('mongoose');

var Schema=mongoose.Schema;

var userSchema=new Schema({
    username:String,
    userpass:String,
    
},{collection:'user'});

module.exports = mongoose.model("User",userSchema);
