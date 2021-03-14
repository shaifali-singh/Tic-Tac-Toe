const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const{
  userJoin,
  getUserSymbol,
  getOpponent,
  userLeave
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
io.on('connection',socket => {
    // console.log(socket);
    var user_name;
 socket.on('joinGame',username => {
     user_name = username;
 });

 userJoin(socket,user_name);
 var o = getOpponent(socket);
//  console.log(o);
 if(o)
 {
    //start game for current player

    socket.emit("game.begin", 
        getUserSymbol(socket.id)
      );
      //start game for opponent
      o.emit("game.begin",
        getUserSymbol(o.id)
      );
 }


 socket.on("make.move",data => {
   if(!getOpponent(socket))
    return;
  //send the move to both players  
  socket.emit("move.made", data);
  getOpponent(socket).emit("move.made", data);

  });  

  socket.on("disconnect", function () {
    
    if (getOpponent(socket)) {
      getOpponent(socket).emit("opponent.left");
    }
    userLeave(socket);
  });

});




const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

