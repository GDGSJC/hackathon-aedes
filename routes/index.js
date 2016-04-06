'use strict'

const
  MongoClient = require('mongodb').MongoClient,
  mongoUri = 'mongodb://gdg:sjc@ds019470.mlab.com:19470/hackaton',
  express = require('express'),
  router = express.Router(),

  LIST_ALL = '/ocorrencias',
  LIST_BY_TEAM = '/team/:team/ocorrencias',
  GET_DETAILS = '/team/:team/ocorrencias/:ocurid',
  ADD = '/team/:team/ocorrencias';

router.get(LIST_ALL, function(req, res, next) {
  MongoClient.connect(mongoUri, function(err, db) {
    if (err) {
      res.json(['Connection failure']);
    } else {
      res.json(['Connected correctly to server']);
    }
    db.close();
  });
});

router.get(LIST_BY_TEAM, function(req, res, next) {
  res.json({
    team: req.params.team,
    result: []
  });
});

router.get(GET_DETAILS, function(req, res, next) {
  res.json(req.params);
});

router.post(ADD, function(req, res, next) {
  res.json(req.params);
});

module.exports = router;
