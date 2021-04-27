const FilesRoute = require('./Files');
const EditorRoute = require('./Editor');
const DirRoute = require('./Directory');

module.exports = (app) => {
    FilesRoute(app);
    EditorRoute(app);
    DirRoute(app);
}