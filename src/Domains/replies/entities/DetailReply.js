class DetailReply {
  _checkDeleteReply(replies) {
    replies.map((reply) => {
      if (reply.is_delete === true) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.is_delete;
      return reply;
    });
    return replies;
  }

  _sortDate(replies) {
    replies.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    return replies;
  }

  _insertUsernameOnReply(replies, repliesUsername) {
    const reply = replies;
    const usernames = repliesUsername;

    reply.map((item) => {
      usernames.map((username) => {
        if (username.id === item.owner) {
          item.username = username.username;
          delete item.owner;
          return item;
        }
      });
    });

    return reply;
  }
}

module.exports = DetailReply;
