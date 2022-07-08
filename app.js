const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server,{
    options:{
        cors:'*'
    }
});

const port = 3001;
const userConnected= []

io.on('connection', (socket) => {
    //console.log('Conexion exitosa....');
    socket.on('join',(data)=>{
        // Unirse a la sala
        //console.log('Uniendose a la sala')
            socket.join(data.roomName);
            userConnected.push(data);
            // Emitir a Dispositivos la conexion
            socket.to(data.roomName).broadcast.emit('new-user', data);
    
            socket.on('disconnect',() => { 
                
                socket.to(data.roomName).broadcast.emit('bye-user', data);
                // Eliminar sala al cerrar sesión
                const pos = userConnected.findIndex(us => us.idPeer === data.idPeer);
                if (pos >= 0)
                userConnected.splice(pos, 1);
                
                console.log("Usuarios Conectados actualmente")
                console.log(userConnected)
        
            })// fin on disconnect

            
    })//fin on join

    socket.on('admin',()=>{
        socket.to('admin').broadcast.emit('admin-users-conected', userConnected);
        console.log("admin server socket");
        console.log(userConnected);
    })//fin on admin


})// fin connection socket

server.listen(port, ()=>{
    console.log(`Server running port ${ port }`);
})