/**
 * Created by Stefan on 1/8/2017.
 */
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    username : String,
    password : String,
    email : String,
    verified : Boolean,
    token : String
});

User = mongoose.model('User',UserSchema);

module.exports=User;