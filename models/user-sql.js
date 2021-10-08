const { Sequelize } = require('sequelize');

const sequelize = require('../util/database-sql');

const User = sequelize.define('user', {
  _id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  isOAuth: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  provider: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  providerId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  requesterAccessToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  requesterRefreshToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

const signUp = function (isOAuth, firstName, lastName, email, hashedPw) {
  return User.findOrCreate({
    where: { email },
    defaults: {
      isOAuth,
      firstName,
      lastName,
      password: hashedPw,
    },
  });
};

const signUpOAuth = function (
  isOAuth,
  provider,
  providerId,
  requesterAccessToken,
  requesterRefreshToken,
  firstName,
  lastName,
  email,
) {
  return User.findOrCreate({
    where: { email },
    defaults: {
      isOAuth,
      provider,
      providerId,
      requesterAccessToken,
      requesterRefreshToken,
      firstName,
      lastName,
    },
  });
};

// queryUser is an object i.e. {email: "example@gmail.com"}
const findUser = (queryUser) => User.findOne({ where: queryUser });

exports.User = User;
exports.signUp = signUp;
exports.signUpOAuth = signUpOAuth;
exports.findUser = findUser;
