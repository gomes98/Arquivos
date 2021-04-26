const FilesRoute = require('./Files');
const EditorRoute = require('./Editor');

module.exports = (app) => {
    FilesRoute(app);
    EditorRoute(app);
}