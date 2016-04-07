'use strict'

const
  MongoClient = require('mongodb').MongoClient,
  mongoUri = 'mongodb://gdg:sjc@ds019470.mlab.com:19470/hackaton';

module.exports = function (callback) {
  MongoClient.connect(mongoUri, function(err, db) {
    callback(err, db);
  });
};
