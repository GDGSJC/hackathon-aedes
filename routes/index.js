'use strict'

const
  express = require('express'),
  router = express.Router(),

  LIST_ALL = '/ocorrencias',
  LIST_BY_TEAM = '/team/:team/ocorrencias',
  GET_DETAILS = '/team/:team/ocorrencias/:ocurid',
  ADD = '/team/:team/ocorrencias';

router.get(LIST_ALL, function(req, res, next) {
  res.json([]);
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
