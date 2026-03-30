import { describe, it, expect, vi } from 'vitest';
import createAuthenticationMiddleware from '../authentication.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

describe('createAuthenticationMiddleware', () => {
  it('should set req.user and call next when token is valid', async () => {
    const mockPayload = { id: 'user-123', username: 'dicoding' };
    const mockVerifyAccessToken = vi.fn().mockResolvedValue(mockPayload);
    const mockGetInstance = vi.fn().mockReturnValue({
      verifyAccessToken: mockVerifyAccessToken,
    });

    const container = {
      getInstance: mockGetInstance,
    };

    const middleware = createAuthenticationMiddleware(container);

    const req = {
      headers: {
        authorization: 'Bearer access_token',
      },
    };
    const res = {};
    const next = vi.fn();

    await middleware(req, res, next);

    expect(mockGetInstance).toBeCalledWith(AuthenticationTokenManager.name);
    expect(mockVerifyAccessToken).toBeCalledWith('access_token');
    expect(req.user).toEqual(mockPayload);
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith();
  });

  it('should call next with error when authorization header is not provided', async () => {
    const container = {
      getInstance: vi.fn(),
    };

    const middleware = createAuthenticationMiddleware(container);

    const req = {
      headers: {},
    };
    const res = {};
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].message).toBe('AUTHENTICATION_MIDDLEWARE.NO_AUTH_HEADER');
  });

  it('should call next with error when token type is not Bearer', async () => {
    const container = {
      getInstance: vi.fn(),
    };

    const middleware = createAuthenticationMiddleware(container);

    const req = {
      headers: {
        authorization: 'Basic access_token',
      },
    };
    const res = {};
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].message).toBe('AUTHENTICATION_MIDDLEWARE.NO_AUTH_HEADER');
  });

  it('should call next with error when bearer token is missing', async () => {
    const container = {
      getInstance: vi.fn(),
    };

    const middleware = createAuthenticationMiddleware(container);

    const req = {
      headers: {
        authorization: 'Bearer',
      },
    };
    const res = {};
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].message).toBe('AUTHENTICATION_MIDDLEWARE.NO_AUTH_HEADER');
  });

  it('should call next with error when verifyAccessToken throws error', async () => {
    const mockError = new Error('token tidak valid');
    const mockVerifyAccessToken = vi.fn().mockRejectedValue(mockError);
    const mockGetInstance = vi.fn().mockReturnValue({
      verifyAccessToken: mockVerifyAccessToken,
    });

    const container = {
      getInstance: mockGetInstance,
    };

    const middleware = createAuthenticationMiddleware(container);

    const req = {
      headers: {
        authorization: 'Bearer access_token',
      },
    };
    const res = {};
    const next = vi.fn();

    await middleware(req, res, next);

    expect(mockGetInstance).toBeCalledWith(AuthenticationTokenManager.name);
    expect(mockVerifyAccessToken).toBeCalledWith('access_token');
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(mockError);
  });
});
