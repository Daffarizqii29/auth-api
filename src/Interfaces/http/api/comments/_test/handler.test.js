import { describe, it, expect, vi } from 'vitest';
import CommentsHandler from '../handler.js';
import AddCommentUseCase from '../../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../../Applications/use_case/DeleteCommentUseCase.js';
import ToggleCommentLikeUseCase from '../../../../../Applications/use_case/ToggleCommentLikeUseCase.js';

describe('CommentsHandler', () => {
  it('should call next with error when postCommentHandler fails', async () => {
    const error = new Error('fail');
    const addCommentUseCase = { execute: vi.fn().mockRejectedValue(error) };
    const container = { getInstance: vi.fn().mockReturnValue(addCommentUseCase) };
    const handler = new CommentsHandler(container);
    const req = {
      body: { content: 'comment' },
      params: { threadId: 'thread-123' },
      user: { id: 'user-123' },
    };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    await handler.postCommentHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(AddCommentUseCase.name);
    expect(addCommentUseCase.execute).toBeCalledWith(req.body, req.params, req.user.id);
    expect(next).toBeCalledWith(error);
  });

  it('should call next with error when deleteCommentHandler fails', async () => {
    const error = new Error('fail');
    const deleteCommentUseCase = { execute: vi.fn().mockRejectedValue(error) };
    const container = { getInstance: vi.fn().mockReturnValue(deleteCommentUseCase) };
    const handler = new CommentsHandler(container);
    const req = {
      params: { threadId: 'thread-123', commentId: 'comment-123' },
      user: { id: 'user-123' },
    };
    const res = { json: vi.fn() };
    const next = vi.fn();

    await handler.deleteCommentHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(DeleteCommentUseCase.name);
    expect(deleteCommentUseCase.execute).toBeCalledWith(req.params, req.user.id);
    expect(next).toBeCalledWith(error);
  });

  it('should handle putCommentLikeHandler correctly', async () => {
    const toggleCommentLikeUseCase = { execute: vi.fn().mockResolvedValue() };
    const container = { getInstance: vi.fn().mockReturnValue(toggleCommentLikeUseCase) };
    const handler = new CommentsHandler(container);
    const req = {
      params: { threadId: 'thread-123', commentId: 'comment-123' },
      user: { id: 'user-123' },
    };
    const res = { json: vi.fn() };
    const next = vi.fn();

    await handler.putCommentLikeHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(ToggleCommentLikeUseCase.name);
    expect(toggleCommentLikeUseCase.execute).toBeCalledWith(req.params, req.user.id);
    expect(res.json).toBeCalledWith({
      status: 'success',
    });
    expect(next).not.toBeCalled();
  });

  it('should call next with error when putCommentLikeHandler fails', async () => {
    const error = new Error('fail');
    const toggleCommentLikeUseCase = { execute: vi.fn().mockRejectedValue(error) };
    const container = { getInstance: vi.fn().mockReturnValue(toggleCommentLikeUseCase) };
    const handler = new CommentsHandler(container);
    const req = {
      params: { threadId: 'thread-123', commentId: 'comment-123' },
      user: { id: 'user-123' },
    };
    const res = { json: vi.fn() };
    const next = vi.fn();

    await handler.putCommentLikeHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(ToggleCommentLikeUseCase.name);
    expect(toggleCommentLikeUseCase.execute).toBeCalledWith(req.params, req.user.id);
    expect(next).toBeCalledWith(error);
  });
});
