const { findUser } = require('../models/user-sql');
const { throwErrorObject } = require('../helpers/generic');

exports.getUser = (req, res, next) => {
  let queryUser;
  if (req.body.email) queryUser = { email: req.body.email };
  else {
    const _id = req.body._id || req._id;  // for OAuth users (provider ID)
    queryUser = { _id };
  }

  findUser(queryUser)
    .then((user) => {
      if (!user) {
        throwErrorObject(
          'No user found in database. Unable to perform operation.',
          404,
        );
      if (user.isOAuth && queryUser.email) {
        throwErrorObject(
          'User has already registered through OAuth. Unable to login with email and password.',
          404,
        );
      }
      }
      req.user = user;
      return next();
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return res.status(err.statusCode).json({ message: err.message });
    });
};
