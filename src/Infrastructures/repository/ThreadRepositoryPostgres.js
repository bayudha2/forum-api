const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread, credentialId) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const accessId = credentialId;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, accessId],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async checkThread(thread_id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [thread_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadById(thread_id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [thread_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async insertUsernameOnThread(thread, threadUsername) {
    const threads = thread;
    const usernames = threadUsername;

    threads.map((item) => {
      usernames.map((username) => {
        if (username.id === item.owner) {
          item.username = username.username;
          delete item.owner;
          return item;
        }
      });
    });
    return thread[0];
  }

  async getThread(thread_id) {
    const query_thread = {
      text: 'select threads.id, title, body, date, username from threads left join users on users.id=threads.owner where threads.id = $1 and users.id = threads.owner',
      values: [thread_id],
    };

    const query_comment = {
      text: 'select comments.id, username, date, content, is_delete from comments left join users on users.id=comments.owner where comments.thread_id = $1 and users.id = comments.owner;',
      values: [thread_id],
    };

    const query_reply = {
      text: 'select replies.comment_id ,replies.id, replies.content, replies.date, username, replies.is_delete from comments left join replies on replies.comment_id=comments.id left join users on users.id=replies.owner where comments.thread_id = $1 and replies.comment_id=comments.id',
      values: [thread_id],
    };

    const result_thread = await this._pool.query(query_thread);
    const result_comment = await this._pool.query(query_comment);
    const result_reply = await this._pool.query(query_reply);

    // Check Deleted
    const checkDeletedComment = result_comment.rows.map((comment) => {
      if (comment.is_delete === true) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.is_delete;
      return comment;
    });
    const checkDeletedReply = result_reply.rows.map((reply) => {
      if (reply.is_delete === true) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.is_delete;
      return reply;
    });

    // Ascending
    const sortedDateComment = checkDeletedComment.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    const sortedDateReply = checkDeletedReply.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    const comments = sortedDateComment;
    const replies = sortedDateReply;

    /* Insert replies to correct comments */
    comments.map((comment) => {
      comment.replies = [];
      replies.map((reply) => {
        if (reply.comment_id === comment.id) {
          comment.replies.push(reply);
          delete reply.comment_id;
          return comment;
        }
      });
    });

    const getThread = {
      ...result_thread.rows[0],
      comments,
    };

    return getThread;
  }
}

module.exports = ThreadRepositoryPostgres;
