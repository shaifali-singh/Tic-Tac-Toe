const {username} = Qs.parse(location.search,{
    ignoreQueryPrefix:true,
})

const socket = io();

//Entered the game
socket.emit('joinGame', {username});