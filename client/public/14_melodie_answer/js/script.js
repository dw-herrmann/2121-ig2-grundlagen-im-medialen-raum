// Connecting to server. Don't touch this :-) 
let socket = io();

// Spieler
let players = {
    list: [],
    me: ""
}

// Check nach Verbindung
socket.on('connected', function (msg) {
    console.log(msg);
});


/* Funktion zum Senden */
function send(domain, value) {
    socket.emit('serverEvent', {
        domain: domain,
        value: value
    });
}




// Holt sich Spielerliste
socket.on('newUsersEvent', function (myID, myIndex, userList) {

    // checkt nach eigener ID
    players.me.id = myID

    userList[0].since
    userList.forEach(element => {

        if (players.me.id == element.id) {
            players.me.since = element.since
        }
    });

});






// Vorlage für Spieler
class Player {
    constructor(myID) {
        this.role // = role
        this.icon // = icon
        this.color // = color
    }

    // bei erstem Spieler Spielerliste anfragen
    getOtherPlayers() {

        // ToDo Eigene ID erfassen

        // Anfrage an andere Spieler stellen

        // Anfragen vergleichen
        // Neuste Anfrage 
    }

    getStatus() {

    }
}



// Noten als Name
let notes = ["c3", "h", "a", "g", "f", "e", "d", "c4"]
// Töne
const sounds = {
    instrument_1: {
        c3: "../sound/C3.m4a",
        h: "../sound/H.m4a",
        a: "../sound/A.m4a",
        g: "../sound/G.m4a",
        f: "../sound/F.m4a",
        e: "../sound/E.m4a",
        d: "../sound/D.m4a",
        c4: "../sound/C4.m4a"
    }
}










// Aktueller Status der Runde 
// (0 = Auswahlbildschirm, 1 = Fragestellung, 2 = Antworteingabe, 3 = Antwortvergleich)
let state

// Variable für Frage pro Runde
let question

// Antworten
// pro Spieler ein Antwort-Objekt
// answer.push( new Answer({col_1:"a", col_2:"a", col_3:"a", col_4:"a", col_5:"a", col_6:"a", col_7:"a", col_8:"a"}) )
let answers = []

// Vorlage für Antworten Objekt
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


function getPlayerList(params) {
    // spieler auslesen
    // andere anfragen nach Liste (ID, Icon und Farbe)

}


// Status Anzeige
function set_state(status) {
    if (status == 1) {
        // alle verstecken
        $(".content>div").hide()

        // Status Fragestellung wieder zeigen
        $("div.question").show()

        // Prüfen auf 
        if (players.me) {

        } else {

        }

    } else if (status == 2) {

        // alle verstecken
        $(".content>div").hide()

        // Status Antworteingabe wieder zeigen
        $("div.answering").show()
    } else if (status == 3) {

        // alle verstecken
        $(".content>div").hide()

        // Status Antwortvergleich wieder zeigen
        $("div.final_answer").show()
    } else {

        // alle verstecken
        $(".content>div").hide()

        // Status Auswahlbildschirm wieder zeigen
        $("div.register").show()
    }
}






















/* Events erhalten und interpretieren */
socket.on('serverEvent', function (input) {
    // input = {domain:"thema", value:"daten"}

    switch (input.domain) {
        case "status":
            // funktionen zum aufrufen
            set_state(input.value)

            break;

        default:
            break;
    }
});