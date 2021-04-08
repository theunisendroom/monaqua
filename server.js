var express = require('express');
var app = express();
const http = require('http').createServer(app);
var path = require('path');
var bodyParser = require('body-parser')
var io = require('socket.io')(http);
var mongoose = require("mongoose");
const mdq = require('mongo-date-query');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/monaqua");

var monaquaSchema = new mongoose.Schema({
    date: Date,
    waterTemperature: Number,
    airTemperature:  Number,
    humidity: Number,
    heatIndex: Number,
    lightIntensity: Number
  });

var DataLog = mongoose.model("DataLog", monaquaSchema);

var waterTemperature = 0.0;
var airTemperature = 0.0;
var humidity = 0.0;
var heatIndex = 0.0;
var lightIntensity = 0.0;

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
    res.send(waterTemperature);
});

app.post('/', jsonParser, (req, res) => {
    console.log(req.body.temperature);
    waterTemperature = req.body.temperature;
    airTemperature = req.body.airTemperature;
    humidity = req.body.humidity;
    heatIndex = req.body.heatIndex;
    lightIntensity = req.body.lightIntensity;

    var tempLogRecord = new DataLog({"date":new Date(Date.now()),"waterTemperature":waterTemperature,"airTemperature":airTemperature,"humidity":humidity,"heatIndex":heatIndex,"lightIntensity":lightIntensity});
    tempLogRecord.save()
        .then(item => {

            var waterTemps = [];
            var airTemperatures = [];
            var humidities = [];
            var heatIndexes = [];
            var lightIntensities = [];

            DataLog.aggregate(
                [
                {
                    '$match': {
                        'date': {'$gte': new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
                    },
                },
                {
                    $group: {
                    _id: {$dateToString: { format: "%Y-%m-%d %H:00", date: "$date", timezone: "+02"}},
                    waterTemperatureUnrounded: {$avg: '$waterTemperature' },
                    airTemperatureUnrounded: { $avg: '$airTemperature' },
                    humidityUnrounded: { $avg: '$humidity' },
                    heatIndexUnrounded: { $avg: '$heatIndex' },
                    lightIntensityUnrounded: { $avg: '$lightIntensity' }
                    }
                },
                {
                    $addFields:{
                    waterTemperature: { $round: ["$waterTemperatureUnrounded", 2] },
                    airTemperature: { $round: ["$airTemperatureUnrounded", 2] },
                    humidity: { $round: ["$humidityUnrounded", 2] },
                    heatIndex: { $round: ["$heatIndexUnrounded", 2] },
                    lightIntensity: { $round: ["$lightIntensityUnrounded", 2] }
                    }
                },
                { $sort : { _id: 1 } }
                ],
            
                function(err, dataLogs) {
                    if (err) {
                        console.log(err);
                    } else {
                        dataLogs.forEach(function(dataLog) {
                            // console.log(dataLog);
                            waterTemps.push({x: dataLog._id, y: dataLog.waterTemperature});
                            airTemperatures.push({x: dataLog._id, y: dataLog.airTemperature});
                            humidities.push({x: dataLog._id, y: dataLog.humidity});
                            heatIndexes.push({x: dataLog._id, y: dataLog.heatIndex});
                            lightIntensities.push({x: dataLog._id, y: dataLog.lightIntensity});
                        }); 
                        io.sockets.emit('waterTemperature',{"waterTemperature":waterTemperature,"chartData":waterTemps});
                        io.sockets.emit('airTemperature',{"airTemperature":airTemperature,"chartData":airTemperatures});
                        io.sockets.emit('humidity',{"humidity":humidity,"chartData":humidities});
                        io.sockets.emit('heatIndex',{"heatIndex":heatIndex,"chartData":heatIndexes});
                        io.sockets.emit('lightIntensity',{"lightIntensity":lightIntensity,"chartData":lightIntensities});
                    }
                }
              );
           
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });

});

io.sockets.on('connection', function(socket){
    
    console.log('connected');

    var waterTemps = [];
    var airTemperatures = [];
    var humidities = [];
    var heatIndexes = [];
    var lightIntensities = [];

    DataLog.aggregate(
        [
        {
            '$match': {
                'date': {'$gte': new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
            },
        },
        {
            $group: {
            _id: {$dateToString: { format: "%Y-%m-%d %H:00", date: "$date", timezone: "+02"}},
            waterTemperatureUnrounded: {$avg: '$waterTemperature' },
            airTemperatureUnrounded: { $avg: '$airTemperature' },
            humidityUnrounded: { $avg: '$humidity' },
            heatIndexUnrounded: { $avg: '$heatIndex' },
            lightIntensityUnrounded: { $avg: '$lightIntensity' }
            }
        },
        {
            $addFields:{
            waterTemperature: { $round: ["$waterTemperatureUnrounded", 2] },
            airTemperature: { $round: ["$airTemperatureUnrounded", 2] },
            humidity: { $round: ["$humidityUnrounded", 2] },
            heatIndex: { $round: ["$heatIndexUnrounded", 2] },
            lightIntensity: { $round: ["$lightIntensityUnrounded", 2] }
            }
        },
        { $sort : { _id: 1 } }
        ],
    
        function(err, dataLogs) {
            if (err) {
                console.log(err);
            } else {
                dataLogs.forEach(function(dataLog) {
                    // console.log(dataLog);
                    waterTemps.push({x: dataLog._id, y: dataLog.waterTemperature});
                    airTemperatures.push({x: dataLog._id, y: dataLog.airTemperature});
                    humidities.push({x: dataLog._id, y: dataLog.humidity});
                    heatIndexes.push({x: dataLog._id, y: dataLog.heatIndex});
                    lightIntensities.push({x: dataLog._id, y: dataLog.lightIntensity});
                }); 
                io.sockets.emit('waterTemperature',{"waterTemperature":waterTemperature,"chartData":waterTemps});
                io.sockets.emit('airTemperature',{"airTemperature":airTemperature,"chartData":airTemperatures});
                io.sockets.emit('humidity',{"humidity":humidity,"chartData":humidities});
                io.sockets.emit('heatIndex',{"heatIndex":heatIndex,"chartData":heatIndexes});
                io.sockets.emit('lightIntensity',{"lightIntensity":lightIntensity,"chartData":lightIntensities});
            }
        }
    );
    
    socket.on('disconnect', function(){
        console.log('disconnected');
    })
});

http.listen(9001, () => {
    console.log('listening on *:9001');
  });