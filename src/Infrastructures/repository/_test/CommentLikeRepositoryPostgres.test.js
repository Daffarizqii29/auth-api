import { describe, it, expect, afterEach, afterAll } from 'vitest';
import pool from '../../database/postgres/pool.js';
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.js';

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyLike function', () => {
    it('should return false when like is not available', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, () => '123');

      const result = await commentLikeRepositoryPostgres.verifyLike('comment-123', 'user-123');

      expect(result).toBe(false);
    });

    it('should return true when like is available', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await CommentLikesTableTestHelper.addLike({
        id: 'comment-like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, () => '123');

      const result = await commentLikeRepositoryPostgres.verifyLike('comment-123', 'user-123');

      expect(result).toBe(true);
    });
  });

  describe('addLike function', () => {
    it('should persist like into database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, () => '123');

      await commentLikeRepositoryPostgres.addLike('comment-123', 'user-123');

      const likes = await CommentLikesTableTestHelper.findLikesByCommentId('comment-123');
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toBe('comment-like-123');
      expect(likes[0].comment_id).toBe('comment-123');
      expect(likes[0].owner).toBe('user-123');
    });
  });

  describe('deleteLike function', () => {
    it('should delete like from database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await CommentLikesTableTestHelper.addLike({
        id: 'comment-like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, () => '123');

      await commentLikeRepositoryPostgres.deleteLike('comment-123', 'user-123');

      const likes = await CommentLikesTableTestHelper.findLikesByCommentId('comment-123');
      expect(likes).toHaveLength(0);
    });
  });
});
