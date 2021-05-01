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
exports.wbs = app => {

    app.wbskt.on('connection', (socket) => {
        conexoes.push(socket)
        //quando receber a mensagem do socket
        socket.on('chatSend', message => {
            console.log(`${socket.conn.remoteAddress} - ${message}`);
            socket.emit('chatReceive', `EU: ${message}`)
            conexoes.forEach(ele => {
                socket.to(ele.id).emit('chatReceive', `${socket.conn.remoteAddress} - ${message}`)
            })
        })
        //quando o socket desconectar
        socket.on('disconnect', _ => {
            let index = conexoes.findIndex((ele) => {
                return ele.id == socket.id
            })
            conexoes = conexoes.slice(index, 1)
        })
    })
}

exports.sendAll = (mensagem) => {
    console.log(`Enviado para Todos ${JSON.stringify(mensagem)}`);
    conexoes.forEach(ele => {
        ele.emit('fileChange', mensagem)
    })
}