//jshint esversion:6

//require npm packages som har blit installert i terminal
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");


// Google auth libary for Node.js
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID; // Google client ID for Node.js lagret i .env filen
const client = new OAuth2Client(CLIENT_ID);

// express npm
const req = require("express/lib/request"); // for å få tilgang til req.body
const res = require("express/lib/response"); // express npm
const app = express(); // middleware som sjekker om brukeren er autorisert

const PORT = process.env.PORT || 6969; // for å få localhost til å kjøre med portnr

//Her settes EJS som view engine for express applikasjonen
app.set('view engine', 'ejs');
app.use(express.static((__dirname,"../public"))); // for å bruke statiske filer fra public folder
app.set("views", "../views") // gjør det mulig å få tilgang til denne mappen via HTTP


//middleware
app.use(express.json()); // sender JSON til backend server
app.use(cookieParser()); // lagrer uesr access user token


//get request for å få sidene til å bli vist på localhost
app.get("/", (req, res) =>{
    res.render("home"); // viser home.ejs
  }); 
  
app.get("/login", (req, res) =>{   
    res.render("login"); // viser login.ejs
});

app.post("/login", (req, res) => {
  let token = req.body.token // henter token fra body

  console.log(token); //logger user token som er masse random bokstaver og tall

  //The verifyIdToken function verifies the JWT signature, the aud claim, the exp claim, and the iss claim.

  // Using a Google API Client Library
  async function verify() {
  const ticket = await client.verifyIdToken({ // henter ticket fra client
    idToken: token, // user token
    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
});

  const payload = ticket.getPayload(); // henter payload fra ticket
  const userid = payload["sub"]; // henter user id fra payload
  console.log(payload); //logger payload som henter informasjon om din google konto
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}


verify() // caller på den funksjonen verify
  verify() 
  .then(()=> {
    res.cookie("session-token", token ); // lagrer user token i cookie
    res.send("Success"); // sender tilbake til login side
  })
  .catch(console.error); // logger feilmelding
});

  app.get("/dashboard", checkAuthenticated, (req, res) => {
    let user = req.user; // henter user objektet fra checkAuthenticated
    res.render("dashboard", {user}); // sender user objektet til dashboard.ejs
  });

  //sletter session-cookies når bruker har loget ut 
  app.get("/logout", (req, res) => {
    res.clearCookie("session-token"); // sletter session-token
    res.redirect("/login"); // sender tilbake til login side
  });

  //slutt på async function


  //sjekker om brukeren er autorisert
  function checkAuthenticated(req, res, next){  

    let token = req.cookies["session-token"]; 

    let user = {}; // lagrer brukeren som er autorisert
    async function verify() { // async function for å få tilgang til user objektet
        const ticket = await client.verifyIdToken({
            idToken: token, // user token
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload(); // henter payload fra ticket
        user.name = payload.name; // lagrer navn i user objektet
        user.email = payload.email; // lagrer email i user objektet
        user.picture = payload.picture; // lagrer bilde i user objektet
      }
      verify() // caller på den funksjonen verify
      .then(()=>{ // hvis verifikasjon er ok
          req.user = user; // sender user objektet til req.user
          next(); // går videre til neste middleware
      })
      .catch(err=>{ // hvis verifikasjon feiler
          res.redirect("/login") // sender tilbake til login side
      })

}
// for å få web appen til å kjøre på port 6969
app.listen(PORT, () =>{
    console.log("Server started on port http://localhost:6969/");
});