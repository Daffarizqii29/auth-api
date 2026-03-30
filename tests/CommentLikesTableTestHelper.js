/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const CommentLikesTableTestHelper = {
  async addLike({ id = 'comment-like-123', commentId = 'comment-123', owner = 'user-123' }) {
    const query = {
      text: 'INSERT INTO comment_likes(id, comment_id, owner) VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await pool.query(query);
  },

  async findLikesByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comment_likes RESTART IDENTITY CASCADE');
  },
};

export default CommentLikesTableTestHelper;
