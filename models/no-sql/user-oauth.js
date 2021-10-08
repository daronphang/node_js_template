const { getDb } = require('../../util/database-nosql');

class OAuthUser {
  constructor(
    providerID,
    email,
    name,
    provider,
    requesterAccessToken,
    requesterRefreshToken,
  ) {
    this.providerID = providerID;
    this.email = email;
    this.name = name;
    this.provider = provider;
    this.requesterAccessToken = requesterAccessToken;
    this.requesterRefreshToken = requesterRefreshToken;
  }

  signUp() {
    return getDb().collection('COLLECTION_NAME').insertOne(this);
  }
}

module.exports = OAuthUser;
