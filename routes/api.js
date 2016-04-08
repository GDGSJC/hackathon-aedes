'use strict'

const
  router       = require('express').Router(),
  ocorrencia   = require('../modules/ocorrencia'),
  multiparty   = require('multiparty'),
  path         = require('path'),
  app          = require('../app'),

  LIST_ALL     = '/ocorrencias',
  LIST_BY_TEAM = '/ocorrencias/team/:team',
  GET_DETAILS  = '/ocorrencias/:ocurid',
  ADD          = '/ocorrencias/team/:team',
  DEL          = '/ocorrencias/:ocurid',
  ATTACH       = '/ocorrencias/:ocurid/attach';

router.get(LIST_ALL, function(req, res, next) {

  ocorrencia.query({}).then(function (result) {
    _resOK(res, result);
  }).catch(function (err) {
    _resError(res, err);
  });
});

router.get(LIST_BY_TEAM, function(req, res, next) {
  ocorrencia.query({ team: req.params.team }).then(function (result) {
    _resOK(res, result);
  }).catch(function (err) {
    _resError(res, err);
  });
});

router.get(GET_DETAILS, function(req, res, next) {
  ocorrencia.query({ _id: req.params.ocurid }).then(function (result) {
    _resOK(res, result);
  }).catch(function (err) {
    _resError(res, err);
  });
});

router.post(ADD, function(req, res, next) {

  let app = require('../app');
  Promise.resolve().then(function () {
    return ocorrencia.parse(req);
  }).then (function (model) {

    // socket emit
    app.ioSocket.emit('new point', model);

    return ocorrencia.add(model);
  }).then(function (result) {
    _resOK(res, result);
  }).catch(function (err) {
    _resError(res, err);
  });
});

router.delete(DEL, function(req, res, next) {
  Promise.resolve().then(function () {
    return ocorrencia.del(req.params.ocurid);
  }).then(function (result) {
    _resOK(res, result);
  }).catch(function (err) {
    _resError(res, err);
  });
});

router.post(ATTACH, function(req, res, next) {
   new multiparty.Form({
     autoFiles: true,
     uploadDir: __dirname + '/../public/upload'
   }).parse(req, function(err, fields, files) {
     if (err) {
       return _resError(res, err)
     }
     let fileName;
     for (var input in files) {
       // the name in coming is unknown, so take the first
       if (files.hasOwnProperty(input)) {
         fileName = files[input][0].path;
         break;
       }
     }
     if (!fileName) {
       return _resError(res, new Error("File missing"));
     }
     fileName = '/upload/' + path.basename(fileName);
     ocorrencia.attach(req.params.ocurid, fileName).then(function (result) {
       _resOK(res, fileName);
     }).catch(function (err) {
       _resError(res, err);
     });
   });
});

function _resError(res, e) {
  let msg = e.message || e;
  console.log(msg);
  res.status(500).json({
    status: 'ERROR',
    error: msg
  });
}

function _resOK(res, result) {
  res.json({
    status: 'OK',
    result: result || []
  });
}

module.exports = router;
