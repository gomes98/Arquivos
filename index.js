const express = require('express');
const fileUpload = require('express-fileupload');
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors');

//verificando se o diretorio files existe 
const fs = require('fs')
if (!fs.existsSync(`./files/`)) {
    console.log("Crie um Diretorio com o Nome files");
}
if (!fs.existsSync(`./static/`)) {
    console.log("Crie um Diretorio com o Nome static e insira o html");
}

const app = express();
app.use(cors());

const httpServer = http.createServer(app);
const skt = new socketio.Server(httpServer, { cors: { origin: '*' } })

app.wbskt = skt

require('./src/websocket/index').wbs(app)
    //inserindo a função envia para todos no app
app.wbsktSend = require('./src/websocket/index').sendAll

app.use(express.urlencoded({ extended: true }));
// default options
app.use(fileUpload());
//servindo as paginas
app.use('/',express.static('static'));
app.use('/api/download/', express.static('./files'));
//rotas da aplicação
require('./src/Routes/index')(app);
//porta
httpServer.listen(8000)
console.log(`Servidor na Porta 8000`);