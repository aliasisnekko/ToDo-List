const bodyParser = require("body-parser");
const express = require('express');
const ejs = require('ejs');
const { static } = require("express");
const app = express();
var items = ["Buy Food", "Cook Food"];

app.set('view engine', 'ejs'); // Must be placed after app is declared,  reads our markers inside veiws doc
app.use(bodyParser.urlencoded({ extended: true })) //here is how we use express to read another document
    // this echos out what we see on our servers/site
app.use(express.static("public"))
app.get('/', function(req, res) {
    var today = new Date(); // Some vanilla JS
    var options = { weekday: 'long', day: 'numeric', month: 'long' };

    var day = today.toLocaleDateString("en-US", options);


    res.render("list", { kindOfDay: day, newListItems: items })
});
// this controls what happens when our button is pressed
app.post("/", function(req, res) {
    var item = req.body.newItems;
    items.push(item); //array.action(what it is)
    res.redirect("/");
})


// this is the creation of our server
app.listen(3000, function() {
    console.log("The server is being ran on port 3000");
});
// if (today.getDay() === 6 || today.getDay() === 0) { never forget that programmers count from zero
//     day = "Weekend"
// } else {
//     day = "Weekday";
//     res.sendFile(__dirname + "/weekday.html")
// }