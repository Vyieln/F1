// load the things we need (express, fetch, bodyparser, axios)
var express = require('express');
var app = express();
const bodyParser  = require('body-parser');
const fetch = require("node-fetch");

app.use(express.static("public"));
const axios = require('axios');
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');


app.get('/', function(req, res) {

    res.render('pages/index');
    
  
});

app.get('/test', function(req, res) {

  res.render('pages/index(new)');
  

});



app.get('/leaderboard', function(req,res){
  

let one = `http://ergast.com/api/f1/current/driverStandings.json`
let two = `https://ergast.com/api/f1/current/constructorStandings.json`
let three = 'http://127.0.0.1:5000/api/friends/all'
const requestOne = axios.get(one);
const requestTwo = axios.get(two);
const requestThree = axios.get(three)

axios.all([requestOne,requestTwo,requestThree])
.then(axios.spread((...response)=> {
  const responseOne = response[0]
  const responseTwo = response[1]
  const responseThree = response[2]
  console.log(responseThree["data"])
  var three = responseThree["data"]
  var round = responseOne["data"]["MRData"]["StandingsTable"]["StandingsLists"][0]
  var driver = responseOne["data"]["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]
  var constructor = responseTwo["data"]["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]
  res.render('pages/test',
  {
    driversround : three,
    round: round,
    driver:driver,
    constructor: constructor
  })
}))

});
// the data from the selected language will be inserted into this endpoint using post
app.post('/process_form', function(req, res){

    var lang = req.body.song
    let one = `https://ergast.com/api/f1/2021/${lang}/results.json`
    let two = `http://ergast.com/api/f1/2021/${lang}/qualifying.json`

    const requestOne = axios.get(one);
    const requestTwo = axios.get(two);




  axios.all([requestOne,requestTwo])
  .then(axios.spread((...response) => {
    const responseOne = response[0]
    const responseTwo = response[1]


    console.log(
      responseOne["data"]["MRData"]["RaceTable"]["Races"][0]["Results"][0]["Driver"]["familyName"],
      responseTwo["data"]["MRData"]["RaceTable"]["Races"][0]["QualifyingResults"][0]["Q1"]
      //["MRData"]["RaceTable"]["Races"][0]["Results"]["QualifyingResults"][0]["Q1"]
      );
        driver = responseOne["data"]["MRData"]["RaceTable"]["Races"][0]["Results"][0]["Driver"]
        raceName = responseOne["data"]["MRData"]["RaceTable"]["Races"][0]
        time = responseOne["data"]["MRData"]["RaceTable"]["Races"][0]["Results"][0]
        Qual = responseTwo["data"]["MRData"]["RaceTable"]["Races"][0]["QualifyingResults"][0]
        // render the page index.ejs(home page) and inserts the data["results"] into it, since we don't need the amount of tracks that are in the array
        // i will not use data and instead data["results"]
        res.render('pages/index.ejs',
        {
          race: raceName,
          driver: driver,
          time : time,
          Qual : Qual
        });


  })).catch(errors => {

  })
});
    //var data = response.data;
  
            // display the data to the console 
           // console.log(data)
           // console.log((dataconsole.log((data[0]["MRData"]["RaceTable"]["Races"][0]["Results"][0]["Driver"]["familyName"]))
           

           // driver = data[0]["MRData"]["RaceTable"]["Races"][0]["Results"][0]["Driver"]
          //  raceName = data[0]["MRData"]["RaceTable"]["Races"][0]
           // time =  data[0]["MRData"]["RaceTable"]["Races"][0]["Results"][0]

            // render the page index.ejs(home page) and inserts the data["results"] into it, since we don't need the amount of tracks that are in the array
            // i will not use data and instead data["results"]
       //   res.render('pages/index.ejs',
        //  {
        //  race: raceName,
        //  driver: driver,
         // time : time
        //   });
        


 // });
//});






    
 //   axios.get(`https://ergast.com/api/f1/2021/${lang}/results.json`)
   // .then((response) => {
      
        // insert the response from the api into the variable data in JSON form
      //  var data = response.data;
     //   var qualdata = responseq;
                // display the data to the console 
        //        console.log((data["MRData"]["RaceTable"]["Races"][0]["Results"][0]["Driver"]["givenName"]))
        //        console.log((data["MRData"]["RaceTable"]["Races"][0]["Results"][0]["Driver"]["familyName"]))
//console.log((qualdata["MRData"]["RaceTable"]["Races"][0]["Results"]["QualifyingResults"][0]["Q1"]))
//
              //  driver = data["MRData"]["RaceTable"]["Races"][0]["Results"][0]["Driver"]
             //   raceName = data["MRData"]["RaceTable"]["Races"][0]
             //   time =  data["MRData"]["RaceTable"]["Races"][0]["Results"][0]

                // render the page index.ejs(home page) and inserts the data["results"] into it, since we don't need the amount of tracks that are in the array
                // i will not use data and instead data["results"]
       //       res.render('pages/index.ejs',
          //    {
         //     race: raceName,
          //    driver: driver,
           //   time : time
          //     });
          //  
    //
        
 
// port that we are using
const port = 3000
// connection to the port
app.listen(port, () => {
    // dislays that we establish conneciton to the port
    console.log(`Front-end app listening at http://localhost:${port}`)
})