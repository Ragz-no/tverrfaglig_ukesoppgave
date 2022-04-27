//jshint esversion:6

//require npm packages som har blit installert i terminal
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");


// Google auth
const {OAuth2Client} = require('google-auth-library');
const req = require("express/lib/request");
const res = require("express/lib/response");
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const app = express();
const PORT = process.env.PORT || 6969; // for å få localhost til å kjøre med portnr


//middleware
app.set('view engine', 'ejs');
app.use(express.json()); // sender JSON til backend server
app.use(cookieParser()); // lagrer uesr access user token


app.use(express.static("public")); // for å bruke statiske filer fra public folder

//get request for å få sidene til å bli vist på localhost
app.get("/", (req, res) =>{
    res.render("home");
  });
  
app.get("/login", (req, res) =>{   
    res.render("login");
});

app.post("/login", (req, res) => {
  let token = req.body.token

  console.log(token); //logger user token som er masse random bokstaver og tall


  // Using a Google API Client Library
  async function verify() {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
});
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  console.log(payload);
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  }
  verify()
  .then(()=> {
    res.cookie("session-token", token );
    res.send("Success");
  }).
  catch(console.error);
  });

  app.get("/dashboard", checkAuthenticated, (req, res) => {
    let user = req.user;
    res.render("dashboard", {user});
  });

  app.get("/logout", (req, res) => {
    res.clearCookie("session-token");
    res.redirect("/login");
  });

  function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/login')
      })

}

app.listen(PORT, () =>{
    console.log("Server started on port http://localhost:6969/");
});