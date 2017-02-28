//Require mongoose
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Create Schema class
var ArticleSchema = new Schema({
    //title is required
    title: {
        type: String,
        require: true
    },
    //link is also required
    link: {
        type: String,
        required: true
    },
    //this only saves one Note's ObjectId, ref refers to the Note model
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

//Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

//Export the module
module.exports = Article;
