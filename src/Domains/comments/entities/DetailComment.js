class DetailComment {
  _checkDeleteComment(payload) {
    payload.map((comment) => {
      if (comment.is_delete === true) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.is_delete;
      return comment;
    });
    return payload;
  }

  _insertCountLike(comments, totalLike) {
    comments.map((item) => {
      item.likeCount = 0;
      totalLike.map((like) => {
        if (item.id === like.comment_id) {
          item.likeCount += 1;
          return item;
        }
      });
    });
    return comments;
  }

  _sortDate(payload) {
    payload.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    return payload;
  }

  _insertUsernameOnComment(comments, commentUsername) {
    const comment = comments;
    const usernames = commentUsername;

    comment.map((item) => {
      usernames.map((username) => {
        if (username.id === item.owner) {
          item.username = username.username;
          delete item.owner;
          return item;
        }
      });
    });
    return comment;
  }

  _insertReplyToComment(comments, replies) {
    comments.map((comment) => {
      comment.replies = [];
      replies.map((reply) => {
        if (reply.comment_id === comment.id) {
          comment.replies.push(reply);
          delete reply.comment_id;
        }
      });
    });
    return comments;
  }
}

module.exports = DetailComment;
