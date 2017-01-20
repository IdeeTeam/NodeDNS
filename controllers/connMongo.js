//Zapravo se ne koristi, konekcija se otvara u app.js

var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Mongoose connected");
});