Ihr müsst NodeJS (https://nodejs.org) auf dem Rechner installiert haben (Neustart erforderlich, nach der Installation) und in dem Alexa-Files Ordner dann einmal Shift+Rechtsklick, dann auf "Eingabeaufforderung hier öffnen" und in der CMD folgendes eingeben:

```
npm init -y
```

gefolgt von:

```
npm install alexa-sdk --save
```

Dies installiert dann sowohl die Abhängigkeit "alexa-sdk", als auch "aws-sdk", welche wir beide benötigen. 

Nun müsst ihr noch die "index.js" Datei anpassen! Skill ID und IoT Link.
```
config.IOT_BROKER_ENDPOINT      = "XXXXXXXXX.iot.eu-west-1.amazonaws.com".toLowerCase(); //Hier dein IoT-Link zwischen die Anführungszeichen.
var APP_ID = "Deine-APP_ID-von-dem-Skill"; //Hier deine App-Skill-ID
```

Dann habt ihr einen "node_modules" Ordner, welchen ihr mit der "index.js" Datei in einen ZIP-Ordner packt.

Dazu den Ordner und die index.js Datei markieren und Rechtsklick -> Senden an -> ZIP komprimierter Ordner.

Dieser wird dann im AWS Lambda hochgeladen.
