// Connecting to server. Don't touch this :-) 
let socket = io();






// ##### ##### ##### CONNECTION  ##### ##### ##### //
// ----- ----- ----- CONNECTION  ----- ----- ----- //
// ##### ##### ##### CONNECTION  ##### ##### ##### //

// Check nach Verbindung
socket.on('connected', function (msg) {
    console.log(msg);
    send("getinfo")
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
        this.answer = []
    }

    get_user_by_avatar(avatar) {

        // stellt name auf id um
        if (jQuery.type(avatar) == "string") {
            avatar = ui.avatars.list.indexOf(avatar)
        }

        // speichert alle player avatar-ids in array
        let temp_user_array = []

        game.player_list.active.forEach(function (element, index) {

            temp_user_array.push(element.avatar)
        })

        return temp_user_array.indexOf(avatar)
    }

    get_avatar_by_user(user) {

        return user.avatar
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
            player: players.me,
            avatar_used: players.me.avatar
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

            ui.check_avatars()

        }

        this.update_send()
    }


    // CLIENT updates player list
    cliend_update_player_list(input) {
        // wenn cliend, update list
        if (players.me.index != 0) {
            this.player_list = input.value.list
            // console.log("player list updated. all: " + this.player_list.all.length + ", active: " + this.player_list.active.length);
        }

        ui.update()
    }



    update_send() {
        // wenn cliend, update list
        if (players.me.index == 0) {
            // sende game update
            send("game", {
                order: "update",
                content: game,
                ui: ui
            })
        }
    }


    update_receive(temp_game, temp_ui) {

        // wenn cliend, update list
        if (players.me.index != 0) {
            this.question = temp_game.question
            this.state = temp_game.state
            this.player_list = temp_game.player_list

            if (temp_ui != undefined) {
                ui.avatars = temp_ui.avatars
            }
        }

        ui.update()
    }



    // CLIENT new game
    reset() {
        console.log("reset");

        // status auf 0 setzen
        if (players.me.index == 0) {
            // Game Parameter zurücksetzen
            this.state = 1
            this.question = 0
        }

        // Spielerparameter zurücksetzen
        players.me.answer = []
        this.send_own_player()

    }

}

let game = new Game()






// ##### ##### ##### UI  ##### ##### ##### //
// ----- ----- ----- UI  ----- ----- ----- //
// ##### ##### ##### UI  ##### ##### ##### //

class UI {
    constructor() {
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

        // console.log("selects " + this.avatars.list[players.me.avatar]);

        game.send_own_player()
    }


    check_avatars() {
        // set each avatar unused
        ui.avatars.used.forEach(function (element, index) {
            element = 0
            ui.avatars.used[index] = 0
        });

        // check wich avatars are used
        if (game.player_list.active.length != 0) {
            console.log("active players: " + game.player_list.active.length);

            game.player_list.active.forEach(function (element) {

                let used_avatar = players.me.get_avatar_by_user(element)

                ui.avatars.used[used_avatar] = 1
            })
        }

    }



    // // Zeigt aktive Spielerliste oben links an
    show_players() {
        let add_to_html = []

        // console.log(game.player_list.active);

        // jeden Player ansehen
        for (let index = 0; index < game.player_list.active.length; index++) {
            add_to_html.push(
                '<div class="' + ui.avatars.list[game.player_list.active[index].avatar] + '"> <img class="playeremoji" src="img/' + ui.avatars.list[game.player_list.active[index].avatar] + '.svg" width="20"> </div>'
            )
        }

        $("div.player div").empty();
        $("div.player div").append(add_to_html);

        add_to_html = []

    }

    // HOST sends question
    submit_question(input) {

        game.question = input
        game.state = 2


        // sende game update mit Antwort
        send("game", {
            order: "question",
            content: game
        })
    }



    submit_answer() {

        let answer = []
        $('.melody_box').children().each(function (index) {

            $(this).children().each(function (index_inner) {

                if ($(this).hasClass("changeColor")) {
                    answer[index] = index_inner
                }
            })

            if (answer[index] == undefined) {
                answer[index] = "pause"
            }

        })

        players.me.answer = answer.reverse()

        game.send_own_player()


    }

    play_answer(clicked_player) {

        let counter = game.player_list.active[clicked_player].answer.length

        // Töne abspielen
        playSound()

        function playSound() {

            let melody = game.player_list.active[clicked_player].answer

            counter--

            if (melody[counter] != "pause") {

                sounds.instrument_2[melody[counter]].currentTime = 0
                sounds.instrument_2[melody[counter]].play()

            }


            if (counter > 0) {
                setTimeout(() => {
                    playSound();
                }, 300);
            }
        }

    }

    show_answer() {

        // debug()

        // Icons verstecken
        $(".final_answer .position_svg > div").each(function () {

            // icon id
            let icon_name = $(this).attr('class').split(' ')[0]

            let icon_id = ui.avatars.list.indexOf(icon_name)


            if (
                ui.avatars.used[icon_id] == 0 ||
                ui.avatars.used[icon_id] == undefined
            ) {
                $(this).hide()
            } else {
                $(this).show()
            }
        })


        // Antworten verstecken
        $(".final_answer .playbutton > button").each(function () {

            // icon id
            let icon_id = ui.avatars.list.indexOf($(this).attr('class'))

            if (ui.avatars.used[icon_id] == 0) {
                $(this).hide()
            } else {
                $(this).show()

                let player = game.player_list.active[players.me.get_user_by_avatar(icon_id)]

                if (player != undefined) {

                    if (player.answer.length == 0) {
                        $(this).prop('disabled', true);
                    } else {
                        $(this).prop('disabled', false);
                    }

                }
            }

        })

    }

    show_reset_button() {
        if (players.me.index != 0) {
            $(".final_answer .button_container").hide()
        } else {
            $(".final_answer .button_container").show()
        }
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
            $("body > .player").show()
            $(".content>div").hide() // alle verstecken
            $("div.register").show() // Status Fragestellung wieder zeigen

        } else {

            if (game.state == 1) {
                $("body > .player").show() // Zeigt Spieler
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

            } else if (game.state == 2 || game.state == 3) {
                if (players.me.answer.length > 0) {
                    console.log("state 3");
                    $("body > .player").hide() // versteckt Spieler
                    $(".content>div").hide() // alle verstecken
                    $("div.final_answer").show() // Status Antwortvergleich wieder zeigen
                } else {
                    console.log("state 2");
                    $("body > .player").show() // Zeigt Spieler
                    $(".content>div").hide() // alle verstecken
                    $("div.answering").show() // Status Antworteingabe wieder zeigen
                }
            }
        }
    }




    show_avatars() {

        $(".register .avatar > div").each(function (element) {

            // console.log("avatar: " + element + ", used " + ui.avatars.used[element]);

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


    show_question() {
        $(".variable_question").text(game.question)
    }

    highlight_me() {

        if (players.me.avatar != undefined) {

            $(".player > div").find("." + ui.avatars.list[players.me.avatar]).addClass("hey_thats_me")
            $(".final_answer .position_svg").find("." + ui.avatars.list[players.me.avatar]).addClass("hey_thats_me")

            console.log("me " + players.me.avatar);
            console.log("me " + ui.avatars.list[players.me.avatar]);
        }

    }





    // UI auf neusten stand updaten
    update() {

        console.log("update");
        this.check_avatars()
        this.show_avatars()

        this.show_question()
        this.show_now_state()

        this.show_players()
        this.show_answer()
        this.show_reset_button()

        this.highlight_me()
    }
}


let ui = new UI()














































// ##### ##### ##### EVENT LISTENER  ##### ##### ##### //
// ----- ----- ----- EVENT LISTENER  ----- ----- ----- //
// ##### ##### ##### EVENT LISTENER  ##### ##### ##### //


/* State 0 - Anmeldung */

// bei klick auf avatar
$(".avatar > div").click(function () {

    ui.check_avatars()
    ui.select_avatar(this)

    ui.update()
});



/* State 1 - Fragestellung */
$(".questioner input").keyup(function (handler) {

    // Antwort senden
    if (handler.keyCode == 13) {

        ui.submit_question(this.value)
    }
});

$(".questioner .button").click(function () {
    // Antwort senden
    ui.submit_question($(".questioner input")[0].value)
});




/* State 2 - Antwort */
$(".answering button.submit").click(function () {

    ui.submit_answer()

    ui.update()

});


/* State 3 - Antworten anhören */
$(".final_answer .playbutton > button").click(function () {

    let clicked_player = players.me.get_user_by_avatar($(this).attr('class'))

    ui.play_answer(clicked_player)
})

/* State 3 - reset */
$(".final_answer .button_container .new_round").click(function () {

    send("reset")
})












$(".answering button.play").click(function () {
    playMelody();
})

let playCounter = 1;

function playMelody() {


    if (playCounter == 9) {
        playCounter = 1;
        $(".melody_box").find('.active').removeClass('active');
        return;
    }

    let playIndex = $(".melody_box div:nth-child(" + playCounter + ")").find('.changeColor').index();

    if (playIndex !== -1) {
        sounds.instrument_2[playIndex].pause()
        sounds.instrument_2[playIndex].currentTime = 0;
        sounds.instrument_2[playIndex].play()
    }

    $(".melody_box").find('.active').removeClass('active');
    $(".melody_box div:nth-child(" + playCounter + ")").addClass('active');


    playCounter++;

    setTimeout(() => {
        playMelody();
    }, 300);

};









// let notes = ["./sound/C3.mp3","./sound/H.mp3","./sound/A.mp3","./sound/G.mp3","./sound/F.mp3","./sound/E.mp3",
// "./sound/D.mp3","./sound/C4.mp3"
// ]
// let note = []

// for (i=0; i<notes.length; i++) {
//     note[i]= new Audio("Audio/"+notes[i]);
//   }



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
        // console.log("clicked on " + index + "'th tone")

        tone.play()

        $(this).parent().find('.changeColor').removeClass('changeColor')
        $(this).addClass('changeColor')

    });

}



















/* Events erhalten und interpretieren */
socket.on('serverEvent', function (input) {
    // input = {domain:"thema", value:"daten"}

    console.log(input.domain);


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

                case "question":
                    // funktionen zum aufrufen
                    game.update_receive(input.value.content)

                    break;

                case "update":
                    // game updaten
                    game.update_receive(input.value.content, input.value.ui)

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

                default:
                    break;
            }
            break;


        case "getinfo":
            // eigenen Player überprüfen
            game.send_own_player()

            break;

        case "reset":
            // funktionen zum aufrufen
            game.reset()

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












// debug

function debug() {
    console.log(players);
    console.log(game);
    console.log(ui);
}

// if (players.me.index == 0) {
//     players.me.answer = [7, "pause", 7, "pause", 7, "pause", 7, "pause"]
//     players.me.avatar = 2
//     game.state = 3
//     ui.avatars.used[0] = 1
// } else if (players.me.index == 0) {
//     ui.avatars.used[2] = 1

// }
// ui.avatars.used[3] = 1

// send("players", {
//     who: "own",
//     player: {
//         id: "a",
//         index: 2,
//         avatar: 3,
//         answer: [4, 3, 4, 3, 4, 3, 4, 3]
//     }
// })
// send("players", {
//     who: "own",
//     player: {
//         id: "b",
//         index: 3,
//         avatar: 0,
//         answer: [1, 2, 1, 2, 1, 2, 1, 2]
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