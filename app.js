

//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");
const app = express();
const port = 3000;

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});


const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", async function(req, res) {
  try {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    await newUser.save();
    res.render("secrets");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async function(req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = await User.findOne({ email: username });
    if (foundUser && foundUser.password === password) {
      res.render("secrets");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error logging in");
  }
});

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});

