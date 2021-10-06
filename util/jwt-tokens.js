const jwt = require('jsonwebtoken');

const _refreshTokens = [{ test: 'dummy' }];

const generateTokens = function (_id, type) {
  return new Promise((resolve, reject) => {
    const tokens = {};
    // Check if user has already logged in
    if (_refreshTokens.find((obj) => obj._id === _id) && type !== 'REFRESH') {
      return reject(
        new Error('User has already logged in. No tokens generated.'),
      );
    }

    // Generate access token
    tokens.accessToken = jwt.sign(
      { _id },
      'SECRET_KEY',
      { expiresIn: '1h' }, // 5mins expiration
    );

    // Generate refresh token and push to storage for /login only
    if (type === 'LOGIN') {
      tokens.refreshToken = jwt.sign({ _id }, 'SECRET_REFRESH_KEY', {
        expiresIn: '2h',
      });

      _refreshTokens.push({ refreshToken: tokens.refreshToken, _id });
    }

    return Object.keys(tokens).length === 0
      ? reject(new Error('Unable to generate tokens. Please try again.'))
      : resolve(tokens);
  });
};

const getRefreshTokens = () => {
  if (_refreshTokens.length > 0) {
    return _refreshTokens;
  }
  throw Error('No refresh tokens exist in database.');
};

exports.generateTokens = generateTokens;
exports.getRefreshTokens = getRefreshTokens;
