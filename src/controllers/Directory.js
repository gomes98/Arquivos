const fs = require('fs').promises;
const fs1 = require('fs');

exports.post = async (req, res, next) => {
    let dir = req.query.directory ? `${req.query.directory}/` : '' 
    if(!req.body.dirName){
        return res.status(400).send() 
    }
    fs1.mkdir(`./files/${dir}${req.body.dirName}`, { recursive: true }, (err) => {
        if (err) throw err;
        return res.status(200).send({dirName : req.body.dirName}) 
      });
};


exports.put = async (req, res, next) => {
    let dir = req.query.directory ? `${req.query.directory}/` : '' 
    if (!req.body.dirName || !req.body.newDirName) {
        return res.status(400).send()
    }
    fs.rename(`./files/${dir}${req.body.fileName}`, `./files/${dir}${req.body.newFileName}`).then(_ => {
        req.app.wbsktSend({ op: "renameD", fileName: req.body.dirName, newFileName: req.body.newDirName })
        res.status(204).send()
    }).catch(err => {
        res.status(404).send({ error: err.code })
    })
};

exports.delete = async (req, res, next) => {
    let dir = req.query.directory ? `${req.query.directory}/` : '' 
    if (!req.body.dirName) {
        return res.status(400).send({ error: "No Dir" })
    }
    fs.rmdir(`./files/${dir}${req.body.dirName}`).then(_ => {
        req.app.wbsktSend({ op: "delete", file: req.body.dirName })
        res.status(204).send()
    }).catch(err => {
        res.status(404).send({ error: err.code })
    })
};

exports.get = async (req, res, next) => {
    let arquivos = await listarArquivosDoDiretorio(`./files`); // coloque o caminho do seu diretorio
    res.send(arquivos)
};

async function listarArquivosDoDiretorio(diretorio) {
    let arquivos = [];

    let listaDeArquivos = await fs.readdir(diretorio);
    for (let k in listaDeArquivos) {
        let stat = await fs.stat(diretorio + '/' + listaDeArquivos[k]);
        if (stat.isDirectory())
            await listarArquivosDoDiretorio(diretorio + '/' + listaDeArquivos[k], arquivos);
        else
            arquivos.push({fileName : listaDeArquivos[k], info: await getFilesizeInBytes(diretorio + '/' + listaDeArquivos[k])});
    }
    return arquivos;
}

async function getFilesizeInBytes(filename) {
    var stats = await fs1.statSync(filename);
    var fileSizeInBytes = stats.size;
    return {size: fileSizeInBytes, mtime: stats.mtime};
}