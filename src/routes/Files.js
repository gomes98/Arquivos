const FilesController = require('../controllers/Files');

module.exports = (app) => {
    app.post('/api/file',  FilesController.post);
    app.put('/api/file/',  FilesController.put);
    app.delete('/api/file/',  FilesController.delete);
    app.get('/api/file',  FilesController.get);
}