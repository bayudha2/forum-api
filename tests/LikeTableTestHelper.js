/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeTableTestHelper = {
  async addLike({
    id = 'like-1',
    credentialId = 'user-123',
    comment_id = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO commentlikes VALUES($1, $2, $3) RETURNING id',
      values: [id, credentialId, comment_id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM commentlikes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM commentlikes WHERE 1=1');
  },
};

module.exports = LikeTableTestHelper;
