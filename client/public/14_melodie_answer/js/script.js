// Connecting to server. Don't touch this :-) 
let socket = io();







// ##### ##### ##### CONNECTION  ##### ##### ##### //
// ##### ##### ##### CONNECTION  ##### ##### ##### //
// ##### ##### ##### CONNECTION  ##### ##### ##### //

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











// ##### ##### ##### PLAYER  ##### ##### ##### //
// ##### ##### ##### PLAYER  ##### ##### ##### //
// ##### ##### ##### PLAYER  ##### ##### ##### //

// Vorlage für Spieler
class Player {
    constructor(myID) {
        this.role // = role
        this.icon // = icon
        this.color // = color
    }
}

// Spieler
let players = {
    list: [],
    me: ""
}









// ##### ##### ##### GAME  ##### ##### ##### //
// ##### ##### ##### GAME  ##### ##### ##### //
// ##### ##### ##### GAME  ##### ##### ##### //

class Game {
    constructor(myID) {
        this.state
        this.question
        this.player_list = []
    }


    reset() {
        // status auf 0 setzen
        this.state = 1
        this.question = 0
    }



    ask_for_infos() {

    }

}

let game = new Game()











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



function getPlayerList(params) {
    // spieler auslesen
    // andere anfragen nach Liste (ID, Icon und Farbe)

}


// Status Anzeige
function set_state(status) {
    if (status == 1) {
        $(".content>div").hide() // alle verstecken
        $("div.question").show() // Status Fragestellung wieder zeigen

        // Prüfen auf Spielerstatus
        if (players.me) {

        } else {

        }

    } else if (status == 2) {
        $(".content>div").hide() // alle verstecken
        $("div.answering").show() // Status Antworteingabe wieder zeigen
    } else if (status == 3) {
        $(".content>div").hide() // alle verstecken
        $("div.final_answer").show() // Status Antwortvergleich wieder zeigen
    } else {
        $(".content>div").hide() // alle verstecken
        $("div.register").show() // Status Auswahlbildschirm wieder zeigen
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

        case "game":
            // funktionen zum aufrufen
            game.reset()
            switch (input.value) {
                case "reset":
                    // funktionen zum aufrufen
                    game.reset()

                    break;

                default:
                    break;
            }

            case "game":

                break;

            default:
                break;
    }
});