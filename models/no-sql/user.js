const { getDb } = require('../../util/database-nosql');

class User {
  constructor(email, password, name) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  signUp() {
    return getDb().collection('COLLECTION_NAME').insertOne(this);
  }

  // queryUser is an object i.e. {email: "example@gmail.com"}
  static findUser(queryUser) {
    return getDb().collection('COLLECTION_NAME').findOne(queryUser);
  }
}

module.exports = User;
