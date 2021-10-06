const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
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
    allowNull: false,
  },
});

module.exports = User;

// class User {
//   constructor(
//     email,
//     password,
//     name,
//     cartProducts = [],
//     purchasedProducts = [],
//     favoriteProducts = [],
//     notifications = []
//   ) {
//     this.email = email;
//     this.password = password;
//     this.name = name;
//     this.cartProducts = cartProducts;
//     this.purchaseProducts = purchasedProducts;
//     this.favoriteProducts = favoriteProducts;
//     this.notifications = notifications;
//   }

//   signUp() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }
// }
