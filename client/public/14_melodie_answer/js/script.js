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
        c3: new Audio("../sound/C3.m4a"),
        h: new Audio("../sound/H.m4a"),
        a: new Audio("../sound/A.m4a"),
        g: new Audio("../sound/G.m4a"),
        f: new Audio("../sound/F.m4a"),
        e: new Audio("../sound/E.m4a"),
        d: new Audio("../sound/D.m4a"),
        c4: new Audio("../sound/C4.m4a")
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
    play_singleSound(){
        $(".melody_box div  div:nth-child(1)").mousedown(c3.play())
        $(".melody_box div  div:nth-child(2)").click(c3.play())
        $(".melody_box div  div:nth-child(3)").click()
        $(".melody_box div  div:nth-child(4)").click()
        $(".melody_box div  div:nth-child(5)").click()
        $(".melody_box div  div:nth-child(6)").click()
        $(".melody_box div  div:nth-child(7)").click()
    }
    // gespeicherte Melodie abspielen
    play_melody() {
        // Schleife, die pro Spalte ausgewählten Ton abspielt
        // jquery hilft vermutlich sehr bei

    }
}

        $(".melody_box div  div:nth-child(1)").mousedown(sounds.instrument_1.c3.play())
        $(".melody_box div  div:nth-child(2)").mousedown(c3.play())
        $(".melody_box div  div:nth-child(3)").click()
        $(".melody_box div  div:nth-child(4)").click()
        $(".melody_box div  div:nth-child(5)").click()
        $(".melody_box div  div:nth-child(6)").click()
        $(".melody_box div  div:nth-child(7)").click()


$("#sounds.instrument_1.c3").trigger('load') 

function play_audio(task) {
    if (task == 'play') {
        
    }
}


// Funktion, die nach jeder Runde alles zurücksetzt und variablen leert
// question, answers, state
function reset() {}

function mousedown() {
    $(".melody_box div  div:nth-child(1)").play(sounds.instrument_1.c3.play)
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