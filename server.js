var express = require('express');
var app = express();
const http = require('http').createServer(app);
var path = require('path');
var bodyParser = require('body-parser')
var io = require('socket.io')(http);
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/monaqua");

var monaquaSchema = new mongoose.Schema({
    date: String,
    temperature: String
  });

var TemperatureLog = mongoose.model("TemperatureLog", monaquaSchema);

var currentTemp = '20.1';

var jsonParser = bodyParser.json();

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/js/index.js', (req, res) => {
    res.sendFile(__dirname + '/js/index.js');
});

app.get('/mystyle.css', (req, res) => {
    res.setHeader('Content-type', 'text/css');
    res.sendFile(__dirname + '/mystyle.css');
});

app.get('/current-temp', (req, res) => {
    res.send(currentTemp);
});

app.post('/', jsonParser, (req, res) => {
    console.log(req.body.temperature);
    currentTemp = req.body.temperature;

    var tempLogRecord = new TemperatureLog({"date":new Date(Date.now()).toLocaleString("en-ZA"),"temperature":currentTemp});
    tempLogRecord.save()
        .then(item => {

            var jsonData = [];

            TemperatureLog.find({}, function(err, temperatureLogs) {
                temperatureLogs.forEach(function(temperatureLog) {
                    jsonData.push({x: temperatureLog.date, y: parseFloat(temperatureLog.temperature)});
                }); 
                io.sockets.emit('temperature',{"currentTemp":currentTemp,"chartData":jsonData});
              });
           
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });

});

io.sockets.on('connection', function(socket){
    
    console.log('connected');

    var jsonData = [];

    TemperatureLog.find({}, function(err, temperatureLogs) {
        temperatureLogs.forEach(function(temperatureLog) {
            jsonData.push({x: temperatureLog.date, y: parseFloat(temperatureLog.temperature)});
        }); 
        io.sockets.emit('temperature',{"currentTemp":currentTemp,"chartData":jsonData});
    });
    
    socket.on('disconnect', function(){
        console.log('disconnected');
    })
});

http.listen(9001, () => {
    console.log('listening on *:9001');
  });