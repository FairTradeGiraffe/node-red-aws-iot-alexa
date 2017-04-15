'use strict';

/*
 * App ID für den Skill
 */
var APP_ID = "Deine-APP_ID-von-dem-Skill";

/*
 * Verbindungsvariablen für AWS IoT
 */
var config = {};
config.IOT_BROKER_ENDPOINT      = "XXXXXXXXX.iot.eu-west-1.amazonaws.com".toLowerCase();
config.IOT_BROKER_REGION        = "eu-west-1";

//Einbinden von benötigten Bibliotheken (aws-sdk & alexa-sdk)
var AWS = require('aws-sdk');
var Alexa = require("alexa-sdk");

AWS.config.region = config.IOT_BROKER_REGION;
//Client für IoT Kommunikation starten mit den Verbindungsdaten die oben angegeben sind
var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});
//Topic definieren, damit Node-RED später weiß zu welchem es gehört
var topic = "/lampe";

//Alexa Instanz aufbauen
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//Alexa Intentshandler definieren
var handlers = {
    'PushMessage': function (payload, tell) {
        var params = {
            topic: topic,
            payload: payload,
            qos:0
        };
        iotData.publish(params, (err, data) => {
            if (!err){
                console.log('Nachricht übermittelt mit Inhalt: '+ tell);
                this.emit(':tell', tell);
            }   
        });
    },
    'LaunchRequest': function () {
        this.emit('StartIntent');
    },
    'StartIntent': function () {
        this.emit('PushMessage', '1', 'Leuchte wird angeschaltet.');
    },
    'StopIntent': function () {
        this.emit('PushMessage', '0', 'Leuchte wird ausgeschaltet.');
    },
    "Unhandled": function () {
        this.emit(':tell', 'Irgendwas lief schief.');
    }
};