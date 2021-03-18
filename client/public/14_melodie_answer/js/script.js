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
    constructor() {
        this.id
        this.index
        this.avatar = 1
        this.answer = ""
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
    constructor() {
        this.state
        this.question
        this.player_list = {
            all: [],
            active: []
        }
        this.avatars = [
            "koala",
            "giraffe",
            "elefant",
            "leo"
        ]
    }

    // ##### COMMUNICATION  ##### //
    // ----- COMMUNICATION  ----- //
    // ##### COMMUNICATION  ##### //

    // CLIENT sents player info to HOST
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


    // HOST sends updated player list to CLIENTS
    host_update_player_list(input) {
        // wenn host
        if (players.me.index == 0) {
            // host hinzufügen
            let old_player_list = {
                all: [],
                active: []
            }
            if (this.player_list.length == 0) {
                this.player_list.all.push(players.me)
            }
            // trägt alle IDs in array ein
            this.player_list.all.forEach(element => {
                old_player_list.all.push(element.id)
            });

            // falls ID bereits existiert
            if (old_player_list.all.includes(input.value.player.id)) {
                // Position herausfinden und updaten
                let pos = old_player_list.all.indexOf(input.value.player.id)
                this.player_list.all[pos] = input.value.player
            } else {
                // player hinzufügem
                this.player_list.all.push(input.value.player)
            }


            // falls ID bereits existiert
            if (old_player_list.all.includes(input.value.player.id)) {
                // Position herausfinden und updaten
                let pos = old_player_list.all.indexOf(input.value.player.id)
                this.player_list.all[pos] = input.value.player
            } else {
                // player hinzufügem
                this.player_list.all.push(input.value.player)
            }
            // sortiert nach index
            function compare(a, b) {
                if (a.index < b.index) {
                    return -1;
                }
                if (a.index > b.index) {
                    return 1;
                }
                return 0;
            }
            // sortieren
            this.player_list.all.sort(compare);
            // active leeren
            this.player_list.active = []
            for (let index = 0; index < this.player_list.all.length; index++) {
                if (this.player_list.all[index].avatar != false) {
                    this.player_list.active.push(this.player_list.all[index])
                }
            }

            // sende geupdatete liste
            send("players", {
                who: "list",
                list: this.player_list
            })
            console.log("player list updated. all: " + this.player_list.all.length + ", active: " + this.player_list.active.length);
        }
    }



    // CLIENT updates player list
    cliend_update_player_list(input) {
        // wenn cliend, update list
        if (players.me.index != 0) {
            this.player_list = input.value.list
            console.log("player list updated. all: " + this.player_list.all.length + ", active: " + this.player_list.active.length);
        }
    }
    // CLIENT new game
    reset() {
        // status auf 0 setzen
        this.state = 1
        this.question = 0
    }
}

let game = new Game()



















// ##### ##### ##### UI  ##### ##### ##### //
// ----- ----- ----- UI  ----- ----- ----- //
// ##### ##### ##### UI  ##### ##### ##### //

class UI {
    constructor(myID) {
        this.avatars = {
            list: [
                "koala",
                "giraffe",
                "elefant",
                "leo"
            ],
            used: [
                0,
                0,
                0,
                0
            ]
        }
    }
    select_avatar() {}



    // // Zeigt aktive Spielerliste oben links an
    show_players() {
        let add_to_html = []
        console.log(game.player_list.active);

        // jeden Player ansehen
        for (let index = 0; index < game.player_list.active.length; index++) {
            add_to_html.push(
                '<div style="color:#4BA9DC;"> <img class="playeremoji" src="img/' + ui.avatars.list[game.player_list.active[index].avatar] + '.svg" width="20"> </div>'
            )
        }
        console.log(add_to_html);

        $("div.player div").empty();
        $("div.player div").append(add_to_html);

    }
}


let ui = new UI()























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

//Töne abspielen
// prüft zeile (tonlage)
$(".melody_box div  div:nth-child(1)").click(function () {
    console.log("c4")
    sounds.instrument_1.c4.play()
});

$(".melody_box div  div:nth-child(2)").click(function () {
    console.log("h")
    sounds.instrument_1.h.play()
});
$(".melody_box div  div:nth-child(3)").click(function () {
    console.log("a")
    sounds.instrument_1.a.play()
});
$(".melody_box div  div:nth-child(4)").click(function () {
    console.log("g")
    sounds.instrument_1.g.play()
});
$(".melody_box div  div:nth-child(5)").click(function () {
    console.log("f")
    sounds.instrument_1.f.play()
});
$(".melody_box div  div:nth-child(6)").click(function () {
    console.log("e")
    sounds.instrument_1.e.play()
});
$(".melody_box div  div:nth-child(7)").click(function () {
    console.log("d")
    sounds.instrument_1.d.play()
});
$(".melody_box div  div:nth-child(8)").click(function () {
    console.log("c3")
    sounds.instrument_1.c3.play()
});

$(".melody_box div  div").click(function () {
    $(this).parent().find('.changeColor').removeClass('changeColor')
    $(this).addClass('changeColor')
});




// Status Anzeige
function set_state(status) {
    if (status == 1) {
        $(".content>div").hide() // alle verstecken
        $("div.question").show() // Status Fragestellung wieder zeigen

        // Prüfen auf Spielerstatus
        if (players.me.index == 0) {
            $("div.question>div").hide() // alle verstecken
            $("div.questioner").show() // Status Fragestellung wieder zeigen
        } else {
            $("div.question>div").hide() // alle verstecken
            $("div.answerer").show() // Status Fragestellung wieder zeigen
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
                    // funktionen zum verschicken
                    game.host_update_player_list(input)
                    break;

                case "list":
                    // Spielerliste updaten
                    game.cliend_update_player_list(input)
                    ui.show_players()
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

// send("players", {
//     who: "own",
//     player: {
//         id: "a",
//         index: 2,
//         avatar: 0,
//         answer: ""
//     }
// })
// send("players", {
//     who: "own",
//     player: {
//         id: "b",
//         index: 3,
//         avatar: 0,
//         answer: ""
//     }
// })
// send("players", {
//     who: "own",
//     player: {
//         id: "c",
//         index: 4,
//         avatar: 1,
//         answer: ""
//     }
// })
// send("players", {
//     who: "own",
//     player: {
//         id: "d",
//         index: 5,
//         avatar: 1,
//         answer: ""
//     }
// })
// send("players", {
//     who: "own",
//     player: {
//         id: "e",
//         index: 6,
//         avatar: 2,
//         answer: ""
//     }
// })