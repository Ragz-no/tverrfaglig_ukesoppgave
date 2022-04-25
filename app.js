//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');


app.use(express.static("public"));

// app.get("/", function(req, res){
//     res.sendFile(__dirname + "/index.html");
// });

app.get("/", function(req, res){
    res.render("home");
  });
  

app.listen(6969, function(){
    console.log("Server started on port http://localhost:6969/");
});