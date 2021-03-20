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
    })

    socket.on('disconnect',()=>{
        console.log(`${id} disconnected.`);
    })

    socket.on('joinRoom',roomId=>{
        var iterator = io.of("/").adapter.rooms
        var flag = false
        var status = ''
        var msg = ''
        if(iterator.size != 0){
            for(const item of iterator){
                if(roomId == item[0]){
                    flag = true
                    break
                }
            }
        }
        if(flag){
            msg = 'Room joined successfully'
            status = 'pass'
            socket.join(roomId)
            socket.broadcast.emit('roomJoined',{
                roomId:roomId,
                socketId:id,
            })
        }else{
            msg = 'Invalid room id or room does not exist'
            status = 'fail'
        }
        socket.emit('roomStatus',{
            status:status,
            msg:msg
        })

    })

    socket.on('endRoom',()=>{
        socket.emit('results',"These are the results of polling.")
    })

})

http.listen(3000,()=>console.log("Server port : 3000"))