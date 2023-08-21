//require mongoose library
const mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb://localhost/socialcode_development');

//acquire the connection (to check if it is successful)
const db = mongoose.connection;

//db on error
db.on('error', console.error.bind(console, 'error connecting to db'));

//up and running then print the message
db.once('open', function(){
    console.log('Successfully connected to database :: MongoDB');
});

module.exports = db;