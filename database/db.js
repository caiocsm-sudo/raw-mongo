const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const mongoConnectionString = 'mongodb+srv://seagayi:chiseagayi@front.1lvvmaz.mongodb.net/';
let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(mongoConnectionString)
      .then((client) => {
        dbConnection = client.db('bookstore');
        return cb();
      })
      .catch((e) => {
        console.log('there was an error during connection: ' + e);
        return cb(e);
      });
  },
  getDb: () => {
    return dbConnection
  }
}
