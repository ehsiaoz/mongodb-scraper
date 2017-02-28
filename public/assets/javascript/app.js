// GRAB THE ARTICLES AS A JSON
$.getJSON('/articles', function(data) {

    //for loop for each articles
    for (var i = 0; i < data.length; i++) {
        $('#articles').append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /> " + data[i].link + "</p>" +
            "<a href='" + data[i].link + "'>" + "Go to Article" + "</ a>");
    };
});

//Whenever someone clicks a p tag
$(document).on("click", "p", function() {
    // empty the notes from the note section
    $('#notes').empty();
    //Save the id from the p tag
    var thisId = $(this).attr("data-id");

    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // with that done, add the note information to the page
        .done(function(data) {
            console.log(data);

            //the title of the artcle
            $("#notes").append("<h2>" + data.title + "<h2>");
            //An input to enter a new title
            $('#notes').append("<input id='titleinput' name='title'>");
            //A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'</textarea>");
            //A button to submit a new note, with the id of the article saved to titleinput
            $('#notes').append("<button class = 'btn btn-default btn-lg' data-id='" + data._id + "'id='savenote'>Save Note</button>");


            //uf there's a note in the article 
            if (data.note) {
                // place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                //place the body of the note in teh body textarea
                $("#bodyinput").val(data.note.body);
            }
        });

});

//When you click the savenote button 
$(document).on('click', "#savenote", function() {
    // Grab the id associated with the article from the subit button
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            //value taken from the title input
            title: $("#titleinput").val(),
            //value taken from the note textarea
            body: $("#bodyinput").val()
        }
    })

    //with that done
    .done(function(data) {
        //Log the response
        console.log(data);
        //empty the notes sections
        $('#notes').empty();
    });

    $('#titleinput').val("");
    $('#bodyinput').val('');
});