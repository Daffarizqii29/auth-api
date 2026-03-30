import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import DeleteCommentUseCase from '../DeleteCommentUseCase.js';

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCaseParam = { threadId: 'thread-123', commentId: 'comment-123' };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.verifyAvailableThread = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableCommentInThread = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentOwner = vi.fn().mockResolvedValue();
    mockCommentRepository.deleteComment = vi.fn().mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCaseParam, 'user-123');

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.verifyAvailableCommentInThread).toBeCalledWith(useCaseParam.commentId, useCaseParam.threadId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCaseParam.commentId, 'user-123');
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCaseParam.commentId);
  });
});
