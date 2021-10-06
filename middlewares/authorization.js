const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const accessToken = req.cookies.accessToken || '';
  if (!accessToken) {
    return res.status(403).json({
      message: 'No access token attached in cookie. Access forbidden.',
    });
  }

  try {
    const userObj = jwt.verify(accessToken, 'SECRET_KEY');
    req._id = userObj._id;
    return next();
  } catch (err) {
    return res.status(403).json({
      message: 'Invalid or expired access token. Access forbidden.',
      error: err.message,
    });
  }
};
