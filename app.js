const date = require(__dirname + '/date.js'); //is how we require other local js files as a module

const bodyParser = require("body-parser");

const express = require('express');

const ejs = require('ejs');

const { static } = require("express");

const app = express();

const items = [];
const workItems = [];

app.set('view engine', 'ejs'); // Must be placed after app is declared,  reads our markers inside veiws doc


app.use(bodyParser.urlencoded({ extended: true })) //here is how we use express to read another document


app.use(express.static("public"))


app.get('/', function(req, res) {
    let day = date.getDate();
    // let day = date.getDay() this would return just the day of the week after we create our own module
    res.render("list", { listTitle: day, newListItems: items })

});

// this controls what happens when our button is pressed on our to list
app.post("/", function(req, res) {

    let item = req.body.newItems;

    if (req.body.list === "Work List") {
        workItems.push(item);
        res.redirect('/work');
    } else {
        items.push(item);
        res.redirect("/");
    }
})
app.get('/work', function(req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

// this is the creation of our server
app.listen(3000, function() {
    console.log("The server is being ran on port 3000");
});