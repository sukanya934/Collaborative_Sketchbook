//make socket connection
var socket = io();
//var socket=io.connect("http://localhost:3000/home");

let x = 0;
let y = 0;
var canvas;
var context;
let dragging = false;
let eraser = false;
let history = [];
let color;
let width;
//let index=-1;

socket.on('update_sketch', (data) => {

    let { x1, y1, x2, y2, color, width } = JSON.parse(data);
    console.log(JSON.parse(data));
    console.log(x1, y1, x2, y2, color, width);

    drawLine(context, x1, y1, x2, y2, color, width)
})




function drawLine(context, x1, y1, x2, y2, color = selected_color, width = selected_width) {
    //Debugging Purpose

    // socket.emit('update_sketch',JSON.stringify({x1,y1,x2,y2,color}));
    //console.log(JSON.stringify({x1,y1,x2,y2,color}));
    // socket.emit('update_sketch', JSON.stringify({ x1, y1, x2, y2, color, width }))// {
    // console.log(JSON.stringify({ x1, y1, x2, y2, color }));
    //  console.log(data);
    // document.body.innerHTML = '';
    // document.write(data.description);
    //    });
    context.beginPath();
    // console.log(color);
    //console.log(x1,y1,x2,y2);
    context.strokeStyle = color;
    context.lineWidth = width;
    context.lineCap = 'round';
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    // console.log(context);
    context.closePath();
    //console.log(context.closePath());
    history.push(context.getImageData(0, 0, canvas.width, canvas.height));

}

function dragStart(e) {
    dragging = true;
    x = e.offsetX;
    y = e.offsetY;
    //console.log(x);
}
function drag(e) {
    if (dragging === true) {
        //console.log(x);
        drawLine(context, x, y, e.offsetX, e.offsetY, color, width);
        x = e.offsetX;
        y = e.offsetY;
        //console.log(x);
    }
}
function dragStop(e) {
    dragging = false;
    drawLine(context, x, y, e.offsetX, e.offsetY, color, width);
    x = 0;
    y = 0;
}


function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    //Debugging Purpose

    // var toDrawUrl = localStorage.getItem('url');
    //window.href.location(toDrawUrl);
    //console.log(toDrawUrl);
    canvas.lineCap = 'round';

    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    //load();
}



window.addEventListener('load', init, false);

let selected_color = 'red';
let selected_width = 1;

function selectColor(color) {
    selected_color = color;
}



function clearDrawing() {
    //console.log('hello');
    var result = confirm("Want to Clear ?");
    if (result) {
        //Logic to delete the item
        socket.emit('forceDisconnect');
        context.clearRect(0, 0, canvas.width, canvas.height);
        history = [];
        //Debugging Purpose

        // // index= -1;
        // socket.on('disconnect', function () {
        //     console.log('disconnected event');
        //     //socket.manager.onClientDisconnect(socket.id); --> endless loop with this disconnect event on server side
        //     //socket.disconnect(); --> same here
        //   });

        console.log(history);
    }
}


function undoDrawing() {

    history.pop();

    //Debugging Purpose

    //     console.log(history);
    //     var retore_img=history[history.length-1]
    //    console.log(history[history.length-1]);
    //console.log(history[history.length])
    context.putImageData(history[history.length - 1], 0, 0);
    //console.log(context.putImageData(history[history.length-1],0,0));
    //console.log(history);
    //console.log(history[history.length-1]);
    // var snap=history[history.length-1];
    // var snapShot=(context.putImageData(snap,0,0));
    //console.log(snapShot);
    // console.log(context.putImageData(snap,0,0));
    // context.strokeStyle='white';
    //}
}

function save() {
    var dataUrl = canvas.toDataURL();
    //console.log(canvas);
    //console.log(canvas.toDataURL());
    //localStorage.setItem('url', dataUrl);
    $.ajax({
        type: "POST",
        url: "/save",
        data: {
            imgBase64: dataUrl
        },

    }).done(function (o) {
        console.log('saved');
    })


}

function load() {
    //var url = window.localStorage.getItem ("url");
    // console.log(url);
    $.ajax({
        type: "GET",
        url: "/read",


    }).done(function (data) {
        console.log(data);
        init();
        var img = new Image();
        img.onload = function (e) {
            context.drawImage(img, 0, 0);
        };
        img.src = data;
    })
}

async function drawImage(url) {
    let img = new Image();
    await new Promise(r => img.onload = r, img.src = url);
    context.drawImage(img, 0, 0);
}




