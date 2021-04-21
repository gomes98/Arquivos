const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.expressModule = express

app.use(express.urlencoded({extended : true}));
// default options
app.use(fileUpload());
//servindo as paginas
app.use(express.static('static'));
//rotas da aplicação
require('./src/Routes/index')(app);
//porta
app.listen(8000);

