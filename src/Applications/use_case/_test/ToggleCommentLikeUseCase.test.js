import { describe, it, expect, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import CommentLikeRepository from '../../../Domains/commentLikes/CommentLikeRepository.js';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.js';

describe('ToggleCommentLikeUseCase', () => {
  it('should orchestrating the add like action correctly when comment has not been liked', async () => {
    const useCaseParam = { threadId: 'thread-123', commentId: 'comment-123' };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableCommentInThread = vi.fn().mockResolvedValue();
    mockCommentLikeRepository.verifyLike = vi.fn().mockResolvedValue(false);
    mockCommentLikeRepository.addLike = vi.fn().mockResolvedValue();
    mockCommentLikeRepository.deleteLike = vi.fn().mockResolvedValue();

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    await toggleCommentLikeUseCase.execute(useCaseParam, 'user-123');

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.verifyAvailableCommentInThread)
      .toBeCalledWith(useCaseParam.commentId, useCaseParam.threadId);
    expect(mockCommentLikeRepository.verifyLike)
      .toBeCalledWith(useCaseParam.commentId, 'user-123');
    expect(mockCommentLikeRepository.addLike)
      .toBeCalledWith(useCaseParam.commentId, 'user-123');
    expect(mockCommentLikeRepository.deleteLike).not.toBeCalled();
  });

  it('should orchestrating the delete like action correctly when comment has been liked', async () => {
    const useCaseParam = { threadId: 'thread-123', commentId: 'comment-123' };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableCommentInThread = vi.fn().mockResolvedValue();
    mockCommentLikeRepository.verifyLike = vi.fn().mockResolvedValue(true);
    mockCommentLikeRepository.addLike = vi.fn().mockResolvedValue();
    mockCommentLikeRepository.deleteLike = vi.fn().mockResolvedValue();

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    await toggleCommentLikeUseCase.execute(useCaseParam, 'user-123');

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.verifyAvailableCommentInThread)
      .toBeCalledWith(useCaseParam.commentId, useCaseParam.threadId);
    expect(mockCommentLikeRepository.verifyLike)
      .toBeCalledWith(useCaseParam.commentId, 'user-123');
    expect(mockCommentLikeRepository.deleteLike)
      .toBeCalledWith(useCaseParam.commentId, 'user-123');
    expect(mockCommentLikeRepository.addLike).not.toBeCalled();
  });
});
