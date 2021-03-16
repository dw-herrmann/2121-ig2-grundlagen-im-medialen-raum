// Connecting to server. Don't touch this :-) 
let socket = io();

// Check nach Verbindung
socket.on('connected', function (msg) {
    console.log(msg);
});


// Rollenverteilung
let roles = [
    questioner = {},
    answerer = {}
]

// Noten als Name
let notes = ["c1", "h", "a", "g", "f", "e", "d", "c"]
// Töne
const sounds = {
    instrument_1: {
        c2: "link zur Sound-Datei.mp3",
        h: "link zur Sound-Datei.mp3",
        a: "link zur Sound-Datei.mp3"
        // usw
    }
}


// Aktueller Status der Runde 
// (Fragestellung = 1, Antworteingabe = 2, Antwortvergleich = 3)
let state

// Variable für Frage pro Runde
let question;

// Antworten
// pro Spieler ein Antwort-Objekt
// answer.push( new Answer({col_1:"a", col_2:"a", col_3:"a", col_4:"a", col_5:"a", col_6:"a", col_7:"a", col_8:"a"}) )
let answers = []

// Vorlage für Antworten Objekt
// 
class Answer {
    constructor(selected) {

    }

    // gespeicherte Melodie abspielen
    play_melody() {
        // Schleife, die pro Spalte ausgewählten Ton abspielt
        // jquery hilft vermutlich sehr bei

    }

}


// Funktion, die nach jeder Runde alles zurücksetzt und variablen leert
// question, answers, state
function reset() {}




















// Incoming events 
socket.on('serverEvent', function (message) {
    console.log(message);

});