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


// Holt sich Spielerliste
socket.on('newUsersEvent', function (myID, myIndex, userList) {

    // eigenen Player überprüfen
    game.send_own_player({
        trigger: "newUsersEvent",
        myID: myID,
        myIndex: myIndex,
        userList: userList
    })

});











// ##### ##### ##### PLAYER  ##### ##### ##### //
// ##### ##### ##### PLAYER  ##### ##### ##### //
// ##### ##### ##### PLAYER  ##### ##### ##### //

// Vorlage für Spieler
class Player {
    constructor(myID) {
        this.id = ""
        this.index = ""
        this.role = 1
        this.icon = 1
        this.color = 1
    }
}



// Spieler
let players = {
    me: new Player,
    list: []
}









// ##### ##### ##### GAME  ##### ##### ##### //
// ##### ##### ##### GAME  ##### ##### ##### //
// ##### ##### ##### GAME  ##### ##### ##### //

class Game {
    constructor(myID) {
        this.state
        this.question
        this.player_list;
    }



    send_own_player(input) {
        // updated eigenen user
        if (input.trigger == "newUsersEvent") {
            players.me.id = input.myID
            players.me.index = input.myIndex
        }

        // eigenen Player verschicken
        send('players', {
            who: 'own',
            player: players.me
        })

    }


    host_update_all(input) {

        // wenn host
        if (players.me.index == 0) {

            // falls spieler vorhanden, update, ansonsten füge hinzu
            this.player_list = "test"
            console.log("id = " + input.value.player.id);
            
            
            if (input.value.player.id) {
                
            }

            // sende geupdatete liste
            send("players", {
                who: "all",
                list: this.player_list
            })

        }
    }


    
    cliend_update_player_list(input) {
        console.log( input.value)
        // wenn cliend
        if (players.me.index != 0) {
            
            this.player_list = input.value.list

        }
    }










    // reset() {
    //     // status auf 0 setzen
    //     this.state = 1
    //     this.question = 0
    // }


    // ask_for_infos() {

    // }

}

let game = new Game()











// Holt sich Spielerliste
socket.on('newUsersEvent', function (myID, myIndex, userList) {

    // eigenen Player überprüfen
    game.send_own_player({
        trigger: "newUsersEvent",
        myID: myID,
        myIndex: myIndex,
        userList: userList
    })

});








// Noten als Name
let notes = ["c3", "h", "a", "g", "f", "e", "d", "c4"]
// Töne
const sounds = {
    instrument_1: {
        c3: new Audio("./sound/C3.mp3"),
        h: new Audio("./sound/H.mp3"),
        a: new Audio("./sound/A.mp3"),
        g: new Audio("./sound/G.mp3"),
        f: new Audio("./sound/F.mp3"),
        e: new Audio("./sound/E.mp3"),
        d: new Audio("./sound/D.mp3"),
        c4: new Audio("./sound/C4.mp3")
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

$(".melody_box div  div:nth-child(1)").click(function() {
    console.log("c4")
    sounds.instrument_1.c4.play()
});
$(".melody_box div  div:nth-child(2)").click(function() {
    console.log("h")
    sounds.instrument_1.h.play()
});
$(".melody_box div  div:nth-child(3)").click(function() {
    console.log("a")
    sounds.instrument_1.a.play()
});
$(".melody_box div  div:nth-child(4)").click(function() {
    console.log("g")
    sounds.instrument_1.g.play()
});
$(".melody_box div  div:nth-child(5)").click(function() {
    console.log("f")
    sounds.instrument_1.f.play()
});
$(".melody_box div  div:nth-child(6)").click(function() {
    console.log("e")
    sounds.instrument_1.e.play()
});
$(".melody_box div  div:nth-child(7)").click(function() {
    console.log("d")
    sounds.instrument_1.d.play()
});
$(".melody_box div  div:nth-child(8)").click(function() {
    console.log("c3")
    sounds.instrument_1.c3.play()
});


// Funktion, die nach jeder Runde alles zurücksetzt und variablen leert
// question, answers, state
function reset() {}

function getPlayerList(params) {
    // spieler auslesen
    // andere anfragen nach Liste (ID, Icon und Farbe)
    // bli bla böubb

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
    // console.log(input);

    switch (input.domain) {
        case "status":
            // funktionen zum aufrufen
            set_state(input.value)

            break;

        case "game":
            switch (input.value) {
                case "reset":
                    // funktionen zum aufrufen
                    game.reset()

                    break;

                default:
                    break;
            }
            break;

        case "players":
            switch (input.value.who) {
                case "own":
                    // funktionen zum aufrufen
                    game.host_update_all(input)
                    break;

                case "all":
                    // Spielerliste updaten
                    game.cliend_update_player_list(input)
                    break;

                default:
                    break;
            }
            break;

        case "game":

            break;

        default:
            break;
    }
});