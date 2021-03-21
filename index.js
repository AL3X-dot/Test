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

// checkValidRoom = ()=>{
//     var iterator = io.of("/").adapter.rooms
//     var flag = false
//     var status = ''
//     var msg = ''
//     if(iterator.size != 0){
//         for(const item of iterator){
//             if(roomId == item[0]){
//                 flag = true
//                 break
//             }
//         }
//     }
//     if(flag)
//         return true
//     return false
// }



io.on('connection',socket=>{

    //General for both creator as well as user
    var id = socket.id
    var options = {}
    console.log(`${id} connected.`);


    socket.on('disconnect',()=>{
        console.log(`${id} disconnected.`);
    })



    //Events generally for Room Creator
    socket.on('createRoom',data=>{
        console.log('Options recieved for the room:');
        console.log(data);
        options = data
        socket.emit('createdRoom',{
            roomId:id,
            msg:'Your room is created.'
        })
        io.to(id).emit('data',data)
    })
    
    socket.on('sendData',id=>{
        console.log('Sending data to new client');
        io.to(id).emit('data',options)
    })

    socket.on('endRoom',()=>{
        socket.emit('results',"These are the results of polling.")
    })
    


    //Events generally for room joiner
    socket.on('joinRoom',roomId=>{
        socket.join(roomId)
        socket.broadcast.emit('newVoter',id)
        socket.emit('roomStatus',{
            status:'pass',
            msg:'room joined'
        })
    })

    socket.on('voted',data=>{
        console.log('Vote recieved');
        console.log(data);
        socket.broadcast.emit('voteResult',data.id)
    })

})

http.listen(3000,()=>console.log("Server port : 3000"))