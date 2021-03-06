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
}

module.exports = ThreadRepositoryPostgres;
