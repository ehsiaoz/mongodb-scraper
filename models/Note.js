//Require mongoose
var mongoose = require('mongoose');
//Create a schema class
var Schema = mongoose.Schema;

//Create the note Schema
var NoteSchema = new Schema({
    //Just a string
    title: {
        type: String
    },
    //just a String
    body: {
        type: String
     }
});

//Remember, Mongoose will automatically save the objectIds of the Notes 
// these ids are referred to in the article model
var Note = mongoose.model('Note', NoteSchema);

//Export the module
module.exports = Note;