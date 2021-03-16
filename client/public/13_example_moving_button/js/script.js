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

    let movingBox = document.getElementById("movingBox");

    if (message == "up") {
        let y = movingBox.offsetTop;
        y = y + 20;
        movingBox.style.top = y + "px";
    }

    if (message == "down") {
        let y = movingBox.offsetTop;
        y = y - 20;
        movingBox.style.top = y + "px";
    }

    if (message == "left") {
        let x = movingBox.offsetLeft;
        x = x - 20;
        movingBox.style.left = x + "px";
    }

    if (message == "right") {
        let x = movingBox.offsetLeft;
        x = x + 20;
        movingBox.style.left = x + "px";
    }

});
