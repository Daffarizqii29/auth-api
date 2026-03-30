import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import DeleteReplyUseCase from '../DeleteReplyUseCase.js';

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCaseParam = { threadId: 'thread-123', commentId: 'comment-123', replyId: 'reply-123' };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    mockThreadRepository.verifyAvailableThread = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableCommentInThread = vi.fn().mockResolvedValue();
    mockReplyRepository.verifyAvailableReplyInComment = vi.fn().mockResolvedValue();
    mockReplyRepository.verifyReplyOwner = vi.fn().mockResolvedValue();
    mockReplyRepository.deleteReply = vi.fn().mockResolvedValue();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCaseParam, 'user-123');

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.verifyAvailableCommentInThread).toBeCalledWith(useCaseParam.commentId, useCaseParam.threadId);
    expect(mockReplyRepository.verifyAvailableReplyInComment).toBeCalledWith(useCaseParam.replyId, useCaseParam.commentId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCaseParam.replyId, 'user-123');
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCaseParam.replyId);
  });
});
