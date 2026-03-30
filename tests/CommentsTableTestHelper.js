/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', threadId = 'thread-123', content = 'sebuah komentar', owner = 'user-123', isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments(id, thread_id, content, owner, is_delete) VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, content, owner, isDelete],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments RESTART IDENTITY CASCADE');
  },
};

export default CommentsTableTestHelper;
