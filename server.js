//Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//Require Articles Model
var Article = require('./models/Article.js');
var Note = require("./models/Note.js");
//Scraping tools
var request = require('request');
var cheerio = require('cheerio');

//Mongoose promises
var Promise = require('bluebird');

mongoose.Promise = Promise;

//Initialize express
var app = express();

//Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

//Make Public a static dir
app.use(express.static('public'));

//Database configuration with mongoose
mongoose.connect("mongodb://localhost/scraper_bot/articles");
var db = mongoose.connection;

//Show any mongoose errors
db.on('error',function(error) {
    console.log("Mongoose Error: ", error);
});

//Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection succesful");
});

//Routes
//A GET request to scrape zerohedge.com
app.get("/scrape", function(req,res) {

    //First, we grab the body of the html with request
    request("http://www.zerohedge.com/", function(error, response, html){

        // then load the website into cheerio and give it to $ for shorthand
        var $ = cheerio.load(html);

        //Now grab every div with article tag node-teaser
        $('article.node-teaser').each(function(i, element) {

        //Save an empty result object
        var result = {};

        //this needs work , right now I cannot get to the article title
        result.title = $(element).children('h2.teaser-title').text();

        //this locates the link in zerohedge and copies
        result.link =  'http://www.zerohedge.com/' + $(element).find('a').attr("href");

        //Use the Article Model, create a new entry
        //this effectively passes the result object ot the entry (and the title and link)
        var entry = new Article(result);
        console.log(entry);
        //Now, save that entry to the db 
        entry.save(function(err,doc) {
            //Log any errors
            if (err) {
                console.log(err);
            }
            //Or log the doc
            else{
            console.log(doc);
            }
          });
        });
    });
    //Tell the browser that we finished scraping the text
    res.send("Scrape Complete");
});


//Get articles from the Mongo DB (scraber_bot/articles)
app.get("/articles", function(req,res){
    Article.find({}, function(error, doc) {
        // log any errors if occured
        if (error) {
            console.log("this is an error @ line 97  ", error);
        }else {
            res.json(doc);
        }
    });
});


//Grab an article by it's objectID
app.get("/articles/:id", function(req,res) {
    //using the id passed in the id parameter, prepare a query that finds that exact article
    Article.findOne({"_id": req.params.id})
    //populate all of the notes associated with it
    .populate("note")
    //now execute that query
    .exec(function(error,doc) {
        //Log any errors
        if (error) {
            console.log(error);
        }
        else {
            res.json(doc);
        }
    });
});

// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});


app.listen(3000, function() {
    console.log("App running on port 3000");
});