/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'sebuah balasan',
    date = 'waktu',
    credentialId = 'user-123',
    comment_id = 'comment-123',
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, content, date, credentialId, comment_id, is_delete],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async checkIs_delete(reply_id) {
    const query = {
      text: 'SELECT is_delete FROM replies WHERE id = $1',
      values: [reply_id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
