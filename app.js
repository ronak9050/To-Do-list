const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

// console.log(date());

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1/todolistDB", { useNewUrlParser: true });

const itemSchema = {
  name: String,
};

//Model
const Item = mongoose.model("Item", itemSchema);

//Document
const item1 = new Item({
  name: "Welcome to your to do list",
});

const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema],
};

//Model
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  // var today = new Date();
  // var currentDay = today.getDay();

  // let options = {
  //   weekday: "long",
  //   day: "numeric",
  //   month: "long",
  // };

  // let day = today.toLocaleDateString("en-US", options);

  // let day = date.getDate();
  // let day = date.getDay();

  //Check Condiion for default item

  //FInd
  Item.find({}, function (err, foundItems) {
    // console.log(foundItems);
    if (foundItems.length === 0) {
      //Insert in db
      Item.insertMany(defaultItems, function (err, foundItems) {
        if (err) {
          console.log(err);
        } else {
          console.log("successFully add items to DB");
        }
      });
      res.redirect("/");
    } else {
      res.render("lists", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

//Dynamic route
app.get("/:customeListName", function (req, res) {
  const customListName = _.capitalize(req.params.customeListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create a new List
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show Exist List
        res.render("lists", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  // if (req.body.list === "Work List") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/"); //Redireect to home route and trigger get request
  // }

  //Database Using
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

//Delete Route
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("SuccessFully Deleted");
      }
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },

      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

// app.post("/work", function (req, res) {
//   let item = req.body.newItem;
//   workItems.push(item);
//   res.redirect("/work");
// });

app.listen(3000, function () {
  console.log("The server is live on port 3000");
});
