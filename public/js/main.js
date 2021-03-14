const Message = document.getElementById('win-display');
const box = document.querySelectorAll('.box');
const backButton = document.getElementById('back-btn');
const replayButton = document.getElementById('replay-btn');

const username = Qs.parse(location.search,{
    ignoreQueryPrefix: true,
});

var symbol,myTurn,opponentleft=true;

const socket = io();

//Entered the game
socket.emit('joinGame', username);

socket.on('game.begin',s =>{
    opponentleft = false;
   symbol=s;

   if(symbol == 'X')
    myTurn = true;
   else
    myTurn = false;
status();
});

document.querySelectorAll('.box').forEach(box =>{
    box.addEventListener('click', e => {
        //handle click
        if(!myTurn)
         return;

        if(e.target.textContent != '')
         return;

        socket.emit("make.move", {
            symbol: symbol,
            position: box.id,
          });
      });
});

socket.on("move.made", data => {
   if(symbol != data.symbol)
    myTurn = true;
   else
    myTurn = false;

   
   if(!isgameTied() && !isgameWon())
   {
        document.getElementById(data.position).innerHTML = data.symbol;
   
    if(data.symbol == 'X')
     document.getElementById(data.position).style.color = '#EE6C4D' ;
    else
     document.getElementById(data.position).style.color = '#98C1D9' ;
   }
      

    if(isgameWon())
    {
        if(!myTurn)
         Message.innerHTML = "Game Over! You won.";
        else
         Message.innerHTML = "Game Over! You lost.";
    }
    else
    {
        if(isgameTied())
         Message.innerHTML = "Game Drawn.";
        else
        status();
    }
   
});

function status(){
    if(myTurn)
    Message.innerHTML = "Your Turn";
        
   else
    Message.innerHTML = "Your Opponent's Turn" ;
}

function isgameTied()
{
    var a = true;
   box.forEach(box =>{
       if(!box.innerHTML)
        a=false;
   });

   return a;
}

function isgameWon()
{
    // One of the rows must be equal to either of these
    // value for
    // the game to be over
    matches = ["XXX", "OOO"],
    // These are all of the possible combinations
    // that would win the game
    rows = [
      box[0].innerHTML + box[1].innerHTML + box[2].innerHTML ,
      box[3].innerHTML + box[4].innerHTML + box[5].innerHTML ,
      box[6].innerHTML + box[7].innerHTML + box[8].innerHTML ,
      box[0].innerHTML + box[3].innerHTML + box[6].innerHTML ,
      box[1].innerHTML + box[4].innerHTML + box[7].innerHTML ,
      box[2].innerHTML + box[5].innerHTML + box[8].innerHTML ,
      box[0].innerHTML + box[4].innerHTML + box[8].innerHTML ,
      box[6].innerHTML + box[4].innerHTML + box[2].innerHTML ,
      //   state.c0 + state.c1 + state.c2,
    //   state.a0 + state.b1 + state.c2,
    //   state.a2 + state.b1 + state.c0,
    //   state.a0 + state.b0 + state.c0,
    //   state.a1 + state.b1 + state.c1,
    //   state.a2 + state.b2 + state.c2,
    ];

  // to either 'XXX' or 'OOO'
  for (var i = 0; i < rows.length; i++) {
    if (rows[i] === matches[0] || rows[i] === matches[1]) {
      return true;
    }
  }
  return false;
}

socket.on("opponent.left", function () {
    opponentleft = true;
    if(!isgameTied()&&!isgameWon())
     Message.innerHTML = "Your opponent left the game!!";
});


backButton.addEventListener('click', () => {
    if(isgameWon()||isgameTied() || opponentleft)
     window.location = '../index.html';
    else
    {
    const leaveRoom = confirm('The game is not over!! Are you sure you want to leave the game?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
}
  });

replayButton.addEventListener('click', () => {
    if(isgameWon()||isgameTied() || opponentleft)
     window.location = '../game.html';
    else
    {
    const leaveRoom = confirm('The game is not over!! Are you sure you want to restart the game?');
    if (leaveRoom) {
      window.location = '../game.html';
    } else {
    }
}
  });



  
  
  

