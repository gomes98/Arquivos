const EditorController = require('../controllers/Editor');

module.exports = (app) => {
    app.put('/api/editor/', EditorController.put);
    app.get('/api/editor/', EditorController.get);
}