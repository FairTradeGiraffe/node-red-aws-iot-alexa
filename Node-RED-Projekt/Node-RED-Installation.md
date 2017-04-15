# node-red-aws-iot-alexa
Control your RaspberryPi with your voice via aws-iot over mqtt in node-red.

Tutorialvideo: https://youtube.com/INCOMMINGVIDEO

AWS IoT auf dem Raspberry Pi installieren

Anleitung von Amazon direkt: 
http://docs.aws.amazon.com/de_de/iot/latest/developerguide/iot-sdk-setup.html
http://docs.aws.amazon.com/de_de/iot/latest/developerguide/iot-device-sdk-node.html

Sofern es ein ganz frisch aufgesetzter Raspberry Pi ist:
```
sudo apt-get update

sudo apt-get upgrade
```
Danach eine neue Paketquelle hinzufügen, um die neuste NodeJS-Version zu erhalten:
```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

sudo apt-get install nodejs
```
Nun einmal Node-Red global installieren: 
```
sudo npm install -g --unsafe-perm node-red
```
Jetzt einen Projektordner erstellen, wodrin wir arbeiten werden:
```
cd /home/pi

mkdir Node-RED-Projekt

cd Node-RED-Projekt/
```
In den Node-RED-Projekt- Ordner einmal den "certs"-Ordner mit root-CA.crt, private.pem.key, public.pem.key, certificate.pem.crt reinkopieren. Am besten mit dem Programm Bitvise SSH Client und dann per SFTP dort hochladen.

Dann noch das AWS-IoT Paket von Amazon installieren:
```
npm install aws-iot-device-sdk
```
Nun einen Cronjob anlegen, damit der Node-RED-Server immer automatisch mitgestartet wird, wenn der RaspberryPi einmal neugestartet wird.

Dazu einmal mit dem root-Benutzer anmelden:
```
su (danach fragt er nach dem Passwort, dies einmal eingeben, sofern es vorher mit "sudo passwd" vergeben wurde)
```
Danach folgenden Befehl aufrufen:
```
crontab -e
```
Hier könnte er fragen, welcher Editor benutzt werden soll... ich würde "nano" empfehlen -> Taste 2 drücken

Nun öffnet er einen Cronjob, runterscrollen mit den Pfeiltasten bis ans Ende der "#" und dort folgendes einfügen:
```
@reboot sleep 30 && node-red
```
Dann einmal speichern mit STRG + O und aus dem Dokument raus mit STRG + X.

Jetzt könnt ihr den RaspberryPi neustarten und er lädt nach 30 Sekunden Verzögerung den Node-RED Webserver.

Um Node-RED zu konfigurieren, geht ihr im Browser auf:

http://IP-ADRESSE-DES-RaspberryPi:1880 , also zum Beispiel:  http://192.168.1.41:1880 

Node-RED zusammenbauen:

Wählt aus der Leiste links den Baustein "mqtt" und zieht ihn in die Mitte. Klickt ihn dann doppelt an und geht auf das Stiftsymbol neben Server und fügt dort den HTTPS Link vom Amazon AWS IoT Thing ein (XXXXXXX.iot.eu-west-1.amazonaws.com). 

Stellt den Port auf 8883 um.

Klickt dann die Checkbox "Enable secure SSL/TLS connection" und klickt auf den Stift. Wählt hier den Pfad für die Zertifikate und Schlüssel aus, die ihr auf dem RaspberryPi hochgeladen habt.

```
Bei Certificate:  /home/pi/Node-RED-Projekt/certs/certificate.pem.crt
Bei Private Key: /home/pi/Node-RED-Projekt/certs/private.pem.key
Bei CA Certificate: /home/pi/Node-RED-Projekt/certs/root-CA.crt
```
 Dann sagt ihr oben "Done" und dann nochmal "Done" für das andere Menü davor. Dann seid ihr wieder im "Edit mqtt in node" Menü und tragt dort bei Topic "/lampe" ein. Die QoS setzt ihr auf 0. Optional könnt ihr nun auch noch einen Namen vergeben, in diesem Beispiel "Lampe".
 
 Danach wählt ihr unten in der Liste links den "rpi gpio". Diesen zieht ihr in die Mitte und doppelklickt ihn. Dann stellt ihr den GPIO auf Pin40(GPIO21). Type ist Digital Output. Optional die Checkbox "Initialise pin state?" und dort auf low (0).
 
 Praktisch ist nun noch eine Debugnode. Dazu in der Liste bei output, auf debug gehen und in die Mitte ziehen.
 
 Nun einfach die MQTT-Lampe (Lila) mit dem Pin 40 (Blau) und dem Debug(msg.payload - Grün) verbinden.
 
 An den Nodes sind noch 3 blaue Punkte. Dies bedeutet es ist noch nicht gespeichert worden. Deshalb oben rechts einmal auf "Deploy". 
 
 Nun könnt ihr Alexa fragen: "Alexa, sage Himbeere schalte das licht an" und die LED auf dem RaspberryPi Board sollte anfangen zu leuchten. 



Solltet ihr den Webserver einmal manuell starten müssen gebt im Terminal folgendes ein:
```
node-red
```
Bedenkt dabei, dass die Konfigurationen vom Benutzer abhängig sind.

Das heißt, wenn ihr den Node-RED immer als root Benutzer bearbeitet habt, wird er unter dem Pi-Benutzer leer sein, oder der Server wird erst garnicht starten, da er vom root verwendet wird.
