// load the things we need (express, fetch, bodyparser, axios)
var express = require('express');
var app = express();
const bodyParser  = require('body-parser');
const fetch = require("node-fetch");

app.use(express.static("public"));
const axios = require('axios');
app.use(bodyParser.urlencoded({extended: true}));

// set the view engine to ejs
app.set('view engine', 'ejs');

// Home page of the website, will render the index page which is the home page
app.get('/', function(req, res) {

    res.render('pages/test');
    
  
});


// the data from the selected language will be inserted into this endpoint using post
app.post('/process_form', function(req, res){

    // created a variable to hold the selected input from the user 
    var lang = req.body.song

    // print variable username to console
  

    // using axios we get the data from the API that was provided
    // will be using the GET method 
    
    axios.get(`https://ergast.com/api/f1/2021/${lang}/results.json`)
    .then((response) => {
      
        // insert the response from the api into the variable data in JSON form
        var data = response.data;
                // display the data to the console 
                console.log((data["MRData"]["RaceTable"]["Races"][0]["Results"][0]["Driver"]["givenName"]))
                console.log((data["MRData"]["RaceTable"]["Races"][0]["Results"][0]["Driver"]["familyName"]))

                driver = data["MRData"]["RaceTable"]["Races"][0]["Results"][0]["Driver"]
                raceName = data["MRData"]["RaceTable"]["Races"][0]
                time =  data["MRData"]["RaceTable"]["Races"][0]["Results"][0]

                // render the page index.ejs(home page) and inserts the data["results"] into it, since we don't need the amount of tracks that are in the array
                // i will not use data and instead data["results"]
              res.render('pages/index.ejs',
              {
              race: raceName,
              driver: driver,
              time : time
               });
            
    
        
    
    })
  });
// port that we are using
const port = 3000
// connection to the port
app.listen(port, () => {
    // dislays that we establish conneciton to the port
    console.log(`Front-end app listening at http://localhost:${port}`)
})