require('dotenv').config();
const express = require("express");
const https = require("https"); 
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    // use this part of the code for the weather in Santa Cruz de la Sierra
    // const url = "https://api.openweathermap.org/data/2.5/weather?lat=-17.89147093&lon=-63.32256244&appid=b096485df19b1d3d1d88c6193018d0a9&units=metric"
    const query = req.body.cityName;
    const appID = process.env.APIKEY;
    const metric = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appID + "&units=" + metric
    https.get(url, function(response) {
        console.log("Status code of the weather API is: " + response.statusCode);
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const icon = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
            const weatherDescription = weatherData.weather[0].description;
            res.write("<h1>The temperature in " + query + " is " + temp + " celcius</h1><br><p>The weather description is: " + weatherDescription + "</p>");
            res.write("<img src=" + icon + ">");
            res.write("<p>Country: " + weatherData.sys.country + "</p>");
            res.send();
            // use res.write() and then res.send() to send everything you have written.
        });
    });
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});


    