//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const app = express();
const PORT = process.env.PORT || 6969;

app.set('view engine', 'ejs');


app.use(express.static("public"));

app.get("/", (req, res) =>{
    res.render("home");
  });
  
app.get("/login", function(req, res){   
    res.render("login");
});



app.listen(PORT, () =>{
    console.log("Server started on port http://localhost:6969/");
});