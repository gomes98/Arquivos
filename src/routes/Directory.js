const DirController = require('../controllers/Directory');

module.exports = (app) => {
    app.post('/api/directory',  DirController.post);
    app.put('/api/directory/',  DirController.put);
    app.delete('/api/directory/',  DirController.delete);
    app.get('/api/directory',  DirController.get);
}