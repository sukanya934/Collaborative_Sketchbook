const express = require("express");
const app = express();
const router = require('./router/routes.js');

// for .env port applied below codes 
// const dotenv = require('dotenv');
// dotenv.config();
//const homerouter=require('./router/home_socket.js');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const history_snap = [];
//var socket=require ('socket.io');

//var io=socket({wsEngine:'ws'});
// console.log(io);
let io = app.io;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.set('view-engine', 'ejs');
app.use(morgan('dev'));

//const MONGODB_URI='mongodb+srv://sukanya:sketchbook@cluster0.3xxlv.mongodb.net/test?retryWrites=true&w=majority'
const mongodbUrl=process.env.MONGODB_URI || 'mongodb://localhost/test'
mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('database connection succesful'))
  .catch((err) => console.error(err));
router.use(bodyparser.urlencoded({ extended: true }));

app.use("/", router);
app.use("/register", router);
app.use("/login", router);
app.use("/home", router);
app.use("/logout", router);
app.use("/save", router);
app.use("/read", router);
var server = app.listen(port, (req, res) => {
  console.log(`Server is running at port ${port}`);
})


 //socket impleentation
io = require("socket.io")(server, {
  allowEIO3: true // false by default
});

io.on('connection', (socket) => {
  console.log(`A user is connected ${socket.id}`);
  console.log('syncings canvas from history');
  // console.log(socket);
  for (let item of history_snap)

    socket.emit('update_sketch', item);
  //console.log(socket.emit('update_sketch',item));-->true
  socket.on('update_sketch', function (data) {
    //console.log(data);
    history_snap.push(data);
    console.log(history_snap);
    socket.broadcast.emit('update_sketch', history_snap);

  })
  socket.on('forceDisconnect', function () {
    socket.disconnect();
    //console.log('hello');
  });
});



  //socket.broadcast.emit('clear')
  // socket.on('disconnect', function () {
  //   console.log('disconnected event');
  //   //socket.manager.onClientDisconnect(socket.id); --> endless loop with this disconnect event on server side
  //   //socket.disconnect(); --> same here
  // });
    //socket.on('disconnect', function(){});


//var client = 0;
// io.on('connection',function(socket){
//   //client ++;
//   console.log(`connection with socket made successfully ${socket.id}`);
//   console.log('syncings canvas from history');
//   // io.sockets.emit('update_sketch',{ description: client + ' clients connected!'});
//   //  socket.on('disconnect', function () {
//   //     client--;
//   //     io.sockets.emit('update_sketch',{ description: client + ' clients connected!'});
//    });

//    io.on('clear_canvas',function(){
//     //     //console.log('hello');
//     // context.clearRect(0, 0, canvas.width, canvas.height);
//     history=[];
//     //     // index= -1;
//     console.log(history);
//     io.emit('clear_canvas')
// })
  //for (let item of history)
  // socket.emit('update_sketch',function(data){
  //   console.log(data);
  //   socket.broadcast.emit('update_sketch',data);
  //})


// io.on("connection", (socket) => {
//   socket.on("update item", (arg1, arg2, callback) => {
//     console.log(arg1); // 1
//     console.log(arg2); // { name: "updated" }
//     callback({
//       status: "ok"
//     });
//   });
// });

