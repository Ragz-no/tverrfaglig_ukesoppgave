//jshint esversion:6

const express = require("express");


const app = express();


app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(6969, function(){
    console.log("Server started on port http://localhost:6969/");
});