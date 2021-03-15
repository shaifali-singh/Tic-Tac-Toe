var users = {}, player_left;

//join user for game
function userJoin(user ,username){

    users[user.id] = {
        opponent : player_left,
        symbol : 'X',
        username : username,
        user : user
    }
    if(player_left)
    {
        users[user.id].symbol = 'O';
        users[player_left].opponent = user.id;
        // console.log(users[player_left]);
        player_left = null;
        
    }
    else
     player_left = user.id;
//    console.log(username+ " "+player_left);
}
function getUserSymbol(id)
{
    return users[id].symbol;
}

function getOpponent(user)
{
    if(!users[user.id].opponent)
     return;
    else
     return users[users[user.id].opponent].user;
}

function userLeave(user)
{
    
    // console.log(player_left+" "+user.id);
     
   if(users[user.id].opponent)
    users[users[user.id].opponent].opponent = null;
   delete users[user.id];
//    console.log(users);
   if(player_left == user.id)
    player_left = null;
}

module.exports = {
    userJoin,
    getOpponent,
    getUserSymbol,
    userLeave
};