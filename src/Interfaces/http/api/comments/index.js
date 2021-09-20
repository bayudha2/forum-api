const routes = require('./routes');
const CommentsHandler = require('./handler');

module.exports = {
  name: 'comments',
  register: async (server, { injections }) => {
    const commentsHandler = new CommentsHandler(injections);
    server.route(routes(commentsHandler));
  },
};
