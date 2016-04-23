const express = require('express');
const router = express.Router();
const config = require('konfig')();
const SC = require('node-soundcloud');
const _ = require('lodash');
// Initialize client
SC.init({
  id: config.soundcloud.clientID,
  secret: config.soundcloud.clientSeret,
  uri: config.soundcloud.redirectUri
});

console.log(config);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/init', function(req, res) {
  const url = SC.getConnectUrl();

  res.writeHead(301, { Location: url });
  res.end();
});

router.get('/oauth/soundcloud', function(req, res) {
  const code = req.query.code;

  SC.authorize(code, function(err, accessToken) {
    if (err) {
      throw err;
    } else {
      // Client is now authorized and able to make API calls
      console.log('access token:', accessToken);
      res.json({
        token: accessToken
      });
    }
  });
});

router.get('/tracks', function(req, res) {
  const params = req.query;

  SC.get('/tracks', {
    q: params.q,
    license: 'cc-by-sa'
  }, function(err, result) {
    console.log(err);
    console.log(result);
    //use original instead of t500x500

    // var obj = _.map(result, (row) => {
    //   var x = {
    //     id: row.id
    //   }
    // })

    res.json(result);
  });
});

module.exports = router;
