// Connecting to server. Don't touch this :-) 
let socket = io();



function commandMoveBox(box) {
    // console.log("button wurde geklickt");
    socket.emit('serverEvent', box.id);
}


socket.on('connected', function (msg) {
    console.log(msg);
});

// Incoming events 
socket.on('serverEvent', function (message) {
    console.log(message);

    let button1 = document.getElementById("button1");

    if (message == "up") {
        let y = button1.offsetTop;
        y = y + 20;
        button1.style.top = y + "px";
    }

    if (message == "down") {
        let y = button1.offsetTop;
        y = y - 20;
        button1.style.top = y + "px";
    }

    if (message == "left") {
        let x = button1.offsetLeft;
        x = x - 20;
        button1.style.left = x + "px";
    }

    if (message == "right") {
        let x = button1.offsetLeft;
        x = x + 20;
        button1.style.left = x + "px";
    }

});
