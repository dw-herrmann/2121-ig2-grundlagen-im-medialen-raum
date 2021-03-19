// Connecting to server. Don't touch this :-) 
let socket = io();






// ##### ##### ##### CONNECTION  ##### ##### ##### //
// ----- ----- ----- CONNECTION  ----- ----- ----- //
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
// ----- ----- ----- PLAYER  ----- ----- ----- //
// ##### ##### ##### PLAYER  ##### ##### ##### //

// Vorlage für Spieler
class Player {
    constructor() {
        this.id
        this.index
        this.avatar

        // Antworten
        // pro Spieler ein Antwort-Objekt
        // answer.push( new Answer({col_1:"a", col_2:"a", col_3:"a", col_4:"a", col_5:"a", col_6:"a", col_7:"a", col_8:"a"}) )
        this.answer = ""
    }
}



// Spieler
let players = {
    me: new Player,
    list: []
}









// ##### ##### ##### GAME  ##### ##### ##### //
// ----- ----- ----- GAME  ----- ----- ----- //
// ##### ##### ##### GAME  ##### ##### ##### //

class Game {
    constructor() {
        // (1 = Fragestellung, 2 = Antworteingabe, 3 = Antwortvergleich)
        this.state = 1
        // Variable für Frage pro Runde
        this.question
        this.player_list = {
            all: [],
            active: []
        }
    }

    // ##### COMMUNICATION  ##### //
    // ----- COMMUNICATION  ----- //
    // ##### COMMUNICATION  ##### //

    // CLIENT sents player info to HOST
    send_own_player(input = {}) {

        // updated eigenen user
        if (input.hasOwnProperty("trigger")) {
            if (input.trigger == "newUsersEvent") {
                players.me.id = input.myID
                players.me.index = input.myIndex
            }
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
                // player hinzufügen
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
                if (
                    this.player_list.all[index].avatar !== false &&
                    this.player_list.all[index].avatar !== undefined
                ) {
                    this.player_list.active.push(this.player_list.all[index])
                }
            }

            // sende geupdatete liste
            send("players", {
                who: "list",
                list: this.player_list
            })
            console.log("player list updated. all: " + this.player_list.all.length + ", active: " + this.player_list.active.length);

            // sende game update
            send("game", {
                order: "quest",
                content: this.player_list
            })
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


    
    update_game(input) {
        // wenn cliend, update list
        if (players.me.index != 0) {
            this.player_list = input
        }
    }


    // HOST sends question
    send_question(input) {

        console.log(input);

        this.question = input

        game.state = 2
        // ui.update()

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



    select_avatar(input) {

        let selected = $(input).attr('class')

        // Setzt bei Spieler Avatar
        players.me.avatar = ui.avatars.list.indexOf(selected)

        // Setzt Avatar auf used
        ui.avatars.used[ui.avatars.list.indexOf(selected)] = 1

        console.log("selects " + this.avatars.list[players.me.avatar]);

        game.send_own_player()
    }



    // // Zeigt aktive Spielerliste oben links an
    show_players() {
        let add_to_html = []

        // jeden Player ansehen
        for (let index = 0; index < game.player_list.active.length; index++) {
            add_to_html.push(
                '<div style="color:#4BA9DC;"> <img class="playeremoji" src="img/' + ui.avatars.list[game.player_list.active[index].avatar] + '.svg" width="20"> </div>'
            )
        }

        $("div.player div").empty();
        $("div.player div").append(add_to_html);

        add_to_html = []

    }


    submit_answer() {

        let answer = []

        $('.melody_box').children().each(function () {

            for (let index = 0; index < $('.melody_box > div').length; index++) {
                console.log(
                    $('.melody_box > div')[index].value

                );

            }

        });

        console.log(answer).value;
    }




    // show now-state
    show_now_state() {

        // already select 
        if (
            // falls "players.me.avatar" nicht existiert
            // players.me.avatar == false ||
            players.me.avatar == undefined
        ) {
            // verstecke 
            console.log("state 0");
            $("body > .player").hide() // alle verstecken
            $(".content>div").hide() // alle verstecken

        } else {

            if (game.state == 1) {
                console.log("state 1");
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

            } else if (game.state == 2) {
                console.log("state 2");
                $(".content>div").hide() // alle verstecken
                $("div.answering").show() // Status Antworteingabe wieder zeigen
            } else if (game.state == 3) {
                console.log("state 3");
                $(".content>div").hide() // alle verstecken
                $("div.final_answer").show() // Status Antwortvergleich wieder zeigen
            } else {
                console.log("state 4");
                $(".content>div").hide() // alle verstecken
                $("div.register").show() // Status Auswahlbildschirm wieder zeigen
            }
        }
    }




    show_avatars() {

        $(".register .avatar > div").each(function (element) {

            console.log("avatar: " + element + ", used " + ui.avatars.used[element]);

            if (ui.avatars.used[element] == 1) {
                $(
                    $(".register .avatar > div")[element]
                ).addClass('selected')
            } else {
                $(
                    $(".register .avatar > div")[element]
                ).removeClass('selected')
            }
        })

    }





    // UI auf neusten stand updaten
    update() {

        console.log("update");
        this.show_avatars()

        this.show_players()

        this.show_now_state()

    }
}


let ui = new UI()














































// ##### ##### ##### EVENT LISTENER  ##### ##### ##### //
// ----- ----- ----- EVENT LISTENER  ----- ----- ----- //
// ##### ##### ##### EVENT LISTENER  ##### ##### ##### //



// bei klick auf avatar
$(".avatar > div").click(function () {

    ui.select_avatar(this)

    ui.update()
});



// bei klick auf avatar
$(".questioner input").keyup(function (handler) {

    // Antwort senden
    if (handler.keyCode == 13) {

        game.send_question(this.value)
    }
    console.log(this);
});

$(".questioner .button").click(function () {

    // Antwort senden
    game.send_question($(".questioner input")[0].value)
});




// bei klick auf Antwort senden
$(".answering > button.submit").click(function () {

    ui.submit_answer()

    ui.update()
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
    },
    instrument_2: [
        new Audio("./sound/C4.mp3"),
        new Audio("./sound/H.mp3"),
        new Audio("./sound/A.mp3"),
        new Audio("./sound/G.mp3"),
        new Audio("./sound/F.mp3"),
        new Audio("./sound/E.mp3"),
        new Audio("./sound/D.mp3"),
        new Audio("./sound/C3.mp3")
    ]
}






//Töne abspielen
// prüft zeile (tonlage)
for (let index = 0; index <= $(".melody_box > div").length; index++) {

    $(".melody_box div  div:nth-child(" + index + ")").click(function () {

        let tone = sounds.instrument_2[index - 1]

        tone.currentTime = 0
        console.log("clicked on " + index + "'th tone")

        tone.play()

        $(this).parent().find('.changeColor').removeClass('changeColor')
        $(this).addClass('changeColor')

    });

}





/*

// überarbeitet zu einer kurzen for Schleife

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

*/




































/* Events erhalten und interpretieren */
socket.on('serverEvent', function (input) {
    // input = {domain:"thema", value:"daten"}


    switch (input.domain) {
        case "status":
            // funktionen zum aufrufen
            set_state(input.value)

            break;

        case "game":
            switch (input.value.order) {
                case "reset":
                    // funktionen zum aufrufen
                    game.reset()

                    break;

                case "update":
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
//         avatar: 3,
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