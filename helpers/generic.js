const { ObjectId } = require('mongodb');

const throwErrorObject = (errMsg, statusCode) => {
  const error = new Error(errMsg);
  error.statusCode = statusCode;
  throw error;
};

const getMongoDbId = (id) => {
  try {
    const _id = new ObjectId(id); // If id provided is mongoDB id
    return { _id };
  } catch (err) {
    return { providerID: id }; // If id provided is Google provider ID
  }
};

exports.throwErrorObject = throwErrorObject;
exports.getMongoDbId = getMongoDbId;
