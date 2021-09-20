const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, ids) {
    const { content } = newReply;
    const { comment_id, credentialId } = ids;
    const is_delete = false;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, credentialId, comment_id, is_delete],
    };
    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async verifyOwner(credentialId, reply_id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [reply_id, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Akses tidak ditemukan');
    }
  }

  async checkReply(reply_id) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [reply_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async getReplyByThreadId(thread_id) {
    const query = {
      text: 'select  replies.id, replies.content, replies.date, replies.owner, replies.comment_id, replies.is_delete from comments left join replies on replies.comment_id=comments.id where comments.thread_id = $1 and replies.comment_id=comments.id',
      values: [thread_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteReply(reply_id) {
    const is_delete = true;
    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2 RETURNING is_delete',
      values: [is_delete, reply_id],
    };

    const result = await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
