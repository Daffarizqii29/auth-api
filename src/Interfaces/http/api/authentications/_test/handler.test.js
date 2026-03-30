import { vi } from 'vitest';
import AuthenticationsHandler from '../handler.js';
import LoginUserUseCase from '../../../../../Applications/use_case/LoginUserUseCase.js';
import RefreshAuthenticationUseCase from '../../../../../Applications/use_case/RefreshAuthenticationUseCase.js';
import LogoutUserUseCase from '../../../../../Applications/use_case/LogoutUserUseCase.js';

describe('AuthenticationsHandler', () => {
  it('should call next with error when postAuthenticationHandler fails', async () => {
    const error = new Error('fail');
    const loginUserUseCase = { execute: vi.fn().mockRejectedValue(error) };
    const container = { getInstance: vi.fn().mockReturnValue(loginUserUseCase) };
    const handler = new AuthenticationsHandler(container);
    const req = { body: { username: 'user', password: 'secret' } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    await handler.postAuthenticationHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(LoginUserUseCase.name);
    expect(loginUserUseCase.execute).toBeCalledWith(req.body);
    expect(next).toBeCalledWith(error);
  });

  it('should call next with error when putAuthenticationHandler fails', async () => {
    const error = new Error('fail');
    const refreshAuthenticationUseCase = { execute: vi.fn().mockRejectedValue(error) };
    const container = { getInstance: vi.fn().mockReturnValue(refreshAuthenticationUseCase) };
    const handler = new AuthenticationsHandler(container);
    const req = { body: { refreshToken: 'refresh_token' } };
    const res = { json: vi.fn() };
    const next = vi.fn();

    await handler.putAuthenticationHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(RefreshAuthenticationUseCase.name);
    expect(refreshAuthenticationUseCase.execute).toBeCalledWith(req.body);
    expect(next).toBeCalledWith(error);
  });

  it('should call next with error when deleteAuthenticationHandler fails', async () => {
    const error = new Error('fail');
    const logoutUserUseCase = { execute: vi.fn().mockRejectedValue(error) };
    const container = { getInstance: vi.fn().mockReturnValue(logoutUserUseCase) };
    const handler = new AuthenticationsHandler(container);
    const req = { body: { refreshToken: 'refresh_token' } };
    const res = { json: vi.fn() };
    const next = vi.fn();

    await handler.deleteAuthenticationHandler(req, res, next);

    expect(container.getInstance).toBeCalledWith(LogoutUserUseCase.name);
    expect(logoutUserUseCase.execute).toBeCalledWith(req.body);
    expect(next).toBeCalledWith(error);
  });
});
