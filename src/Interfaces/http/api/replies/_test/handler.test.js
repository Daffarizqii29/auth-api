import { vi } from 'vitest';
import RepliesHandler from '../handler.js';
import AddReplyUseCase from '../../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../../Applications/use_case/DeleteReplyUseCase.js';

describe('RepliesHandler', () => {
  it('should call next with error when postReplyHandler fails', async () => {
    const error = new Error('fail');
    const addReplyUseCase = { execute: vi.fn().mockRejectedValue(error) };
    const container = { getInstance: vi.fn().mockReturnValue(addReplyUseCase) };
    const handler = new RepliesHandler(container);
    const req = {
      body: { content: 'reply' },
      params: { threadId: 'thread-123', commentId: 'comment-123' },
      user: { id: 'user-123' },
    };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    await handler.postReplyHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(AddReplyUseCase.name);
    expect(addReplyUseCase.execute).toBeCalledWith(req.body, req.params, req.user.id);
    expect(next).toBeCalledWith(error);
  });

  it('should call next with error when deleteReplyHandler fails', async () => {
    const error = new Error('fail');
    const deleteReplyUseCase = { execute: vi.fn().mockRejectedValue(error) };
    const container = { getInstance: vi.fn().mockReturnValue(deleteReplyUseCase) };
    const handler = new RepliesHandler(container);
    const req = {
      params: { threadId: 'thread-123', commentId: 'comment-123', replyId: 'reply-123' },
      user: { id: 'user-123' },
    };
    const res = { json: vi.fn() };
    const next = vi.fn();

    await handler.deleteReplyHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(DeleteReplyUseCase.name);
    expect(deleteReplyUseCase.execute).toBeCalledWith(req.params, req.user.id);
    expect(next).toBeCalledWith(error);
  });
});
