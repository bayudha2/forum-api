/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'sebuah comment',
    date = 'waktu',
    credentialId = 'user-123',
    thread_id = 'thread-123',
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, content, date, credentialId, thread_id, is_delete],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async checkIs_delete(comment_id) {
    const query = {
      text: 'SELECT is_delete FROM comments WHERE id = $1',
      values: [comment_id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
