import { vi } from 'vitest';
import ThreadsHandler from '../handler.js';
import AddThreadUseCase from '../../../../../Applications/use_case/AddThreadUseCase.js';
import GetThreadDetailUseCase from '../../../../../Applications/use_case/GetThreadDetailUseCase.js';

describe('ThreadsHandler', () => {
  it('should call next with error when postThreadHandler fails', async () => {
    const error = new Error('fail');
    const addThreadUseCase = { execute: vi.fn().mockRejectedValue(error) };
    const container = { getInstance: vi.fn().mockReturnValue(addThreadUseCase) };
    const handler = new ThreadsHandler(container);
    const req = { body: { title: 'title', body: 'body' }, user: { id: 'user-123' } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    await handler.postThreadHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(AddThreadUseCase.name);
    expect(addThreadUseCase.execute).toBeCalledWith(req.body, req.user.id);
    expect(next).toBeCalledWith(error);
  });

  it('should call next with error when getThreadDetailHandler fails', async () => {
    const error = new Error('fail');
    const getThreadDetailUseCase = { execute: vi.fn().mockRejectedValue(error) };
    const container = { getInstance: vi.fn().mockReturnValue(getThreadDetailUseCase) };
    const handler = new ThreadsHandler(container);
    const req = { params: { threadId: 'thread-123' } };
    const res = { json: vi.fn() };
    const next = vi.fn();

    await handler.getThreadDetailHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(GetThreadDetailUseCase.name);
    expect(getThreadDetailUseCase.execute).toBeCalledWith(req.params);
    expect(next).toBeCalledWith(error);
  });
});
