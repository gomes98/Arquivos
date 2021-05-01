const fs = require('fs').promises;
const fs1 = require('fs');
const dirTree = require('../utils/directory-tree');

exports.post = async (req, res, next) => {
    let dir = req.query.directory ? `${req.query.directory}/` : '' 
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.file;
    uploadPath = `./files/${dir}${ sampleFile.name}`
    // uploadPath = './files/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
        req.app.wbsktSend({ op: "add", file: sampleFile.name })
        res.status(204).send()
    });
};

exports.create = async (req, res, next) => {
    let dir = req.query.directory ? `${req.query.directory}/` : '' 
    if (!req.body.fileContent || !req.body.fileName) {
        return res.status(400).send()
    }
    fs1.writeFile(`./files/${dir}${req.body.fileName}`, req.body.fileContent, function (err) {
        if (err) throw err;
        req.app.wbsktSend({ op: "created", file: req.body.fileName })
        return res.status(204).send()
    });
};

exports.put = async (req, res, next) => {
    let dir = req.query.directory ? `${req.query.directory}/` : '' 
    if (!req.body.fileName || !req.body.newFileName) {
        return res.status(400).send()
    }
    fs.rename(`./files/${dir}${req.body.fileName}`, `./files/${dir}${req.body.newFileName}`).then(_ => {
        req.app.wbsktSend({ op: "rename", fileName: req.body.fileName, newFileName: req.body.newFileName })
        res.status(204).send()
    }).catch(err => {
        res.status(404).send({ error: err.code })
    })
};

exports.delete = async (req, res, next) => {
    let dir = req.query.directory ? `${req.query.directory}/` : '' 
    if (!req.body.fileName) {
        return res.status(400).send({ error: "No file" })
    }
    fs.unlink(`./files/${dir}${req.body.fileName}`).then(_ => {
        req.app.wbsktSend({ op: "delete", file: req.body.fileName })
        res.status(204).send()
    }).catch(err => {
        res.status(404).send({ error: err.code })
    })
};

exports.get = async (req, res, next) => {
    let directory = req.query.directory ? req.query.directory : ''
    await listarArquivosDoDiretorio(`./files${directory}`).then(ret => {
        res.send(ret)

    }).catch(err => {
        res.status(404).send({ error: err.code })
    });
};
exports.getTree = async (req, res, next) => {
    let arquivos = dirTree("./files", { attributes: ['mode', 'mtime'] });
    res.send([arquivos])
};

async function listarArquivosDoDiretorio(diretorio, arquivos) {
    if (!arquivos)
        arquivos = [];

    let listaDeArquivos = await fs.readdir(diretorio);
    for (let k in listaDeArquivos) {
        let stat = await fs.stat(diretorio + '/' + listaDeArquivos[k]);
        if (stat.isDirectory()) {
            arquivos.push({ fileName: diretorio + '/' + listaDeArquivos[k], dir: true, info: await getFilesizeInBytes(diretorio + '/' + listaDeArquivos[k]) });
            // await listarArquivosDoDiretorio(diretorio + '/' + listaDeArquivos[k], arquivos);
        }
        else {
            arquivos.push({ fileName: diretorio + '/' + listaDeArquivos[k], dir: false, info: await getFilesizeInBytes(diretorio + '/' + listaDeArquivos[k]) });
        }
    }
    return arquivos;
}

async function getFilesizeInBytes(filename) {
    var stats = await fs1.statSync(filename);
    var fileSizeInBytes = stats.size;
    return { size: fileSizeInBytes, mtime: stats.mtime };
}