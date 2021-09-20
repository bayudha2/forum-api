const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, ids) {
    const { content } = newComment;
    const { thread_id, credentialId } = ids;
    const is_delete = false;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, credentialId, thread_id, is_delete],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async verifyOwner(credentialId, comment_id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [comment_id, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Akses tidak ditemukan');
    }
  }

  async checkComment(comment_id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [comment_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async getCommentbyThreadId(thread_id) {
    const query = {
      text: 'SELECT id, date, content, owner, is_delete FROM comments WHERE thread_id = $1',
      values: [thread_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getCommentIds(thread_id) {
    const query = {
      text: 'SELECT id FROM comments WHERE thread_id = $1',
      values: [thread_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async likeComment(ids) {
    const id = `like-${this._idGenerator()}`;
    const { comment_id, credentialId } = ids;

    const query = {
      text: 'INSERT INTO commentlikes VALUES($1, $2, $3) RETURNING id',
      values: [id, credentialId, comment_id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async unlikeComment(ids) {
    const { comment_id, credentialId } = ids;
    const query = {
      text: 'DELETE FROM commentlikes WHERE owner = $1 AND comment_id = $2',
      values: [credentialId, comment_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkCommentLike(ids) {
    const { comment_id, credentialId } = ids;
    const query = {
      text: 'SELECT * from commentlikes WHERE owner = $1 AND comment_id = $2',
      values: [credentialId, comment_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getTotalLike(thread_id) {
    const query = {
      text: 'SELECT commentlikes.id, commentlikes.comment_id FROM commentlikes LEFT JOIN comments ON comments.id = commentlikes.comment_id WHERE comments.thread_id = $1',
      values: [thread_id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteComment(comment_id) {
    const is_delete = true;
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2 RETURNING is_delete',
      values: [is_delete, comment_id],
    };

    const result = await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
