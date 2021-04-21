const fs = require('fs').promises;

exports.post = async (req, res, next) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.file;
    uploadPath = './files/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
        res.status(204).send()
    });
};

exports.put = async (req, res, next) => {
    if(!req.body.fileName || !req.body.newFileName){
        return res.status(400).send()
    }
    fs.rename(`./files/${req.body.fileName}`, `./files/${req.body.newFileName}`).then(_ => {
        res.status(204).send()
    }).catch(err => {
        res.status(404).send({ error: err.code })
    })
};

exports.delete = async (req, res, next) => {
    if (!req.body.fileName) {
        return res.status(400).send({ error: "No file" })
    }
    fs.unlink(`./files/${req.body.fileName}`).then(_ => {
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
            arquivos.push(listaDeArquivos[k]);
    }
    return arquivos;
}