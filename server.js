/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Armin Sharifiyan Student ID: 130891203 Date: 17 September 2021
 *  Heroku Link: https://hidden-gorge-64232.herokuapp.com/
 *
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const RestaurantDB = require("./modules/restaurantDB");
const db = new RestaurantDB();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

//API ROUTES
app.post("/api/restaurants", (req, res) => {
  db.addNewRestaurant(req.body)
    .then(() => {
      res.status(201).json("New data Added successfully");
    })
    .catch((err) => {
      res.status(500).json("error " + err);
    });
});

app.get("/api/restaurants", (req, res) => {
  db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.get("/api/restaurants/:value", (req, res) => {
  db.getRestaurantById(req.params.value)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.put("/api/restaurants/:value", (req, res) => {
  db.updateRestaurantById(req.body, req.params.value)
    .then(() => {
      res.status(200).json(`Updating ${req.params.value} done`);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
app.delete("/api/restaurants/:val", (req, res) => {
  db.deleteRestaurantById(req.params.val)
    .then(() => {
      res.status(200).json("Done!");
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//----------app initialize---------
db.initialize(
  "mongodb+srv://dbuser1:dbuser@cluster0.avgax.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
)
  .then(() => {
    console.log("done");
    app.listen(HTTP_PORT, () => {
      console.log("Server is ready on PORT " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
