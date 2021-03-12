const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash")
var ObjectId = require('mongodb').ObjectID;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//********C IN CRUD********* 
mongoose.connect("mongodb+srv://admin-nekko:butthead12@cluster0.hfben.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true })
    //schema is made to set a blueprint for our data in our db
const itemsSchema = { name: String };

//singular version is used to create a modal for our db
const Item = mongoose.model('Item', itemsSchema);

//this is how documents/items are created using that modal
const item1 = new Item({
    name: "Welcome! Please click the header for documentation."
});

app.get("/about", function(req, res) {
    res.render("about");
});
const defaultItems = [item1];
const listSchema = { name: String, items: [itemsSchema] };
const List = mongoose.model('List', listSchema);



//***********R U IN CRUD*********
app.get("/", function(req, res) {
    Item.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(foundItems.name, 'Successfully added items to collections');
                }
            });
            res.redirect('/'); //not really sure why i used this
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    });
});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({ name: customListName }, function(err, foundList) {
        if (!err) {

            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect('/' + customListName)
            } else
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
        }
        if (customListName === "About") { res.render('about') }
    });



});

//*******HOW WE CAN UPDATE OUR DB AS A USER IN CRUD*******
app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({ name: itemName });
    console.log("we have successfully added to the db");
    if (listName === "Today") {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName)
        });
    }
});
//*******HOW WE CAN DELETE FROM OUR DB AS A USER IN CRUD*******
app.post('/delete', function(req, res) {
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndDelete(checkedItemID, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("we have successfully removed from the db");
            }
            res.redirect('/');

        });
    } else {

        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemID } } }, function(err, foundList) {
            if (!err) { res.redirect("/" + listName) }
        })

    }

});


app.get("/work", function(req, res) {

    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function(req, res) {
    res.render("about");
});


let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server is up and running boss!");
});