const routes = require('./routes');
const RepliesHandler = require('./handler');

module.exports = {
  name: 'replies',
  register: async (server, { injections }) => {
    const repliesHandler = new RepliesHandler(injections);
    server.route(routes(repliesHandler));
  },
};
