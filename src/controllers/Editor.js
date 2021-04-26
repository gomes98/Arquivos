const fs = require('fs');
// const fs1 = require('fs');

exports.put = async(req, res, next) => {
    if (!req.body.data || !req.body.fileName) {
        return res.status(400).send()
    }
    console.log(req.body.data, req.body.fileName);
    fs.writeFile(`./files/${req.body.fileName}`, req.body.data, function(err) {
        if (err) throw err;
        req.app.wbsktSend({ op: "edt", file: req.body.fileName })
        return res.status(204).send()
    });
};

exports.get = async(req, res, next) => {
    if (!req.query.fileName) {
        return res.status(400).send()
    }
    console.log(req.query.fileName);
    fs.readFile(`./files/${req.query.fileName}`, function(err, data) {
        if (err) throw err;
        // req.app.wbsktSend({ op: "edt", file: req.body.fileName })
        return res.status(200).send(data)
    });
}