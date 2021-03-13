const app = require('express')()
const cors = require('cors')()
app.use(cors)
const http = require('http').createServer(app)

const io = require('socket.io')(http)

app.get('/',(req,res)=>{
    res.json({
        msg:'Socket server instance for vote-app.'
    })
})

io.on('connection',socket=>{
    var id = socket.id
    console.log(`${id} connected.`);
    socket.on('createRoom',data=>{
        console.log(data);
        socket.emit('createdRoom',{
            roomId:id,
            msg:'Your room is created.'
        })
        socket.to(id).emit('roomConfirmed',data)
    })

    socket.on('disconnect',()=>{
        console.log(`${id} disconnected.`);
    })

    socket.on('joinRoom',roomId=>{
        // if(io.of("/").adapter.rooms[roomId] == null || io.of("/").adapter.rooms[roomId] == undefined){
        //     console.log("Invalid room id");
        //     socket.emit('roomNotFound',{
        //         msg:'Room id is invalid or room does not exist',
        //     })
        // }else{
        //     socket.join(roomId)
        //     console.log(`${id} joined room ${roomId}`);
        //     socket.emit('Room is joined')
        // }
        console.log(io.of("/").adapter.rooms);
    })

})
io.on('disconnect',()=>console.log('User disconnected'))

http.listen(3000,()=>console.log("Server port : 3000"))