// module.exports = app => {
//     var conexoes = [];

//     app.wbskt.on('connection', (socket) => {
//         conexoes.push(socket)
//         console.log(socket.client.conn.remoteAddress);
//         // socket.emit('avalilable', JSON.stringify(cons))
//         console.log(`Nova Conexao WBSKT ${socket.id}`);

//         //quando receber a mensagem do socket
//         socket.on('message', message => {
//             console.log(message);
//             socket.emit('received', `EU: ${message}`)
//             conexoes.forEach(ele =>{
//                 socket.to(ele.id).emit('received', `${socket.conn.remoteAddress} - ${message}`)
//             })
//         })
//         //quando o socket desconectar
//         socket.on('disconnect', _ => {
//             let index = conexoes.findIndex((ele) =>{
//                 return ele.id == socket.id 
//             })
//             conexoes = conexoes.slice(index,1)
//         })
//     })

// }
var conexoes = [];
exports.wbs = app =>{

    app.wbskt.on('connection', (socket) => {
        conexoes.push(socket)
        console.log(socket.client.conn.remoteAddress);
        // socket.emit('avalilable', JSON.stringify(cons))
        console.log(`Nova Conexao WBSKT ${socket.id}`);

        //quando receber a mensagem do socket
        socket.on('message', message => {
            console.log(message);
            socket.emit('received', `EU: ${message}`)
            conexoes.forEach(ele =>{
                socket.to(ele.id).emit('received', `${socket.conn.remoteAddress} - ${message}`)
            })
        })
        //quando o socket desconectar
        socket.on('disconnect', _ => {
            let index = conexoes.findIndex((ele) =>{
                return ele.id == socket.id 
            })
            conexoes = conexoes.slice(index,1)
        })
    })
}

exports.sendAll = (mensagem) =>{
    conexoes.forEach(ele =>{
        console.log(ele.id);
        ele.emit('received', `${mensagem}`)
    })        
}