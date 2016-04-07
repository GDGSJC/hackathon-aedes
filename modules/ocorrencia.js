'use strict';

const

  COLLECTION = 'ocorrencias',

  db         = require('../modules/db'),
  ObjectId   = require('mongodb').ObjectId,
  util       = require('util'),
  ocurTypes  = {
    '0': 'Lixo',
    '1': 'Caixa d\'água',
    '2': 'Piscina',
    '3': 'Calha',
    '4': 'Vazos',
    '5': 'Terreno vazio',
    '6': 'Casa/Predio abandonado',
    '7': 'Outro'
  };

function _parse(req) {
  let c = req.body.coordinates;
  let t = req.body.type;
  let d = req.body.description;
  let team = req.params.team;

  if (!(c && util.isArray(c) && c.length == 2 && util.isNumber(c[0]) && util.isNumber(c[1]))) {
    throw new Error('Parser error (coordinates)');
  }
  if (!(t in ocurTypes)) {
    throw new Error('Parser error');
  }

  return {
    coordinates: c,
    type: t,
    description: d,
    datetime: new Date(),
    images: [],
    team: team
  };
}

function _query (query) {
  return new Promise (function (resolve, reject) {
    db(function(err, db) {
      if (err) {
        return reject('Connection failure');
      }
      if ('_id' in query) {
        query._id = ObjectId(query._id);
      }
      console.log('Query', query);
      let col = db.collection(COLLECTION);
      col.find(query).toArray(function(e, docs) {
        if(e) {
          reject(e)
        } else {
          console.log("Result ", docs.length);
          resolve(docs);
        }
        db.close();
      });
    });
  });
}

function _attach (ocurId, attachName) {
  return new Promise (function (resolve, reject) {
    db(function(err, db) {
      let col = db.collection(COLLECTION);
      console.log(attachName);
      col.updateOne({ _id: ObjectId(ocurId) }, { $addToSet: { images: attachName }}, function(err, doc){
        if (err) {
          reject(err);
        } else {
          console.log('OK');
          resolve();
        }
        db.close();
      });
    });
  });
}

function _add (model) {
  return new Promise (function (resolve, reject) {
    db(function(err, db) {
      let col = db.collection(COLLECTION);
      col.insertOne(model, {}, function (e, result) {
        if (e) {
          reject(e)
        } else {
          resolve(result.insertedId);
        }
        db.close();
      });
    });
  });
}

function _del (ocurId) {
  return new Promise (function (resolve, reject) {
    db(function(err, db) {
      let col = db.collection(COLLECTION);
      col.deleteOne({_id: ObjectId(ocurId) }, function (e, result) {
        if (e) {
          reject(e)
        } else {
          resolve();
        }
        db.close();
      });
    });
  });
}

exports.query    = _query;
exports.add      = _add;
exports.del      = _del;
exports.parse    = _parse;
exports.attach   = _attach;
