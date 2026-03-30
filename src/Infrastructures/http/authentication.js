import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager.js';

const createAuthenticationMiddleware = (container) => async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error('AUTHENTICATION_MIDDLEWARE.NO_AUTH_HEADER');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new Error('AUTHENTICATION_MIDDLEWARE.NO_AUTH_HEADER');
    }

    const authenticationTokenManager = container.getInstance(AuthenticationTokenManager.name);
    const payload = await authenticationTokenManager.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export default createAuthenticationMiddleware;