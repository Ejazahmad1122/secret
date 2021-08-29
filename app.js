require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

//database connection
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true})

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));


//user Schema
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

//creating secrete
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})

//user model
const User = new mongoose.model("User", userSchema);

//home route
app.get("/", function (req, res) {
    res.render("home");
})

//login route
app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser) {
        if(err)
        {
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }
            }
        }

    });
});






//register route
app.get("/register", function (req, res) {
    res.render("register");
})

app.post("/register", function (req,res){
   const newuser = new User({
       email: req.body.username,
       password: req.body.password
   })

   newuser.save(function(err){
       if(err)
       {
           console.log(err);
       }else{
           res.render("secrets")
       }
   });
});













app.listen(3000, function() {
  console.log("Server started on port 3000");
});