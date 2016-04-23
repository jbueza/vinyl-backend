const express = require('express');
const router = express.Router();
const config = require('konfig')();
const SC = require('node-soundcloud');
const _ = require('lodash');
const SpotifyService = require('../services/SpotifyService')();

// Initialize client
SC.init({
  id: config.soundcloud.clientID,
  secret: config.soundcloud.clientSeret,
  uri: config.soundcloud.redirectUri
});

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

router.get('/soundcloud/tracks', function(req, res) {
  const params = req.query;

  SC.get('/tracks', {
    q: params.q,
    license: 'cc-by-sa'
  }, function(err, result) {
    console.log(err);

    return res.json(result);
  });
});



router.get('/spotify/search', function(req, res) {
  SpotifyService.search({
    query: req.query
  }, function(err, result) {
    if (err) {
      return res.send(400, {
        error: err.message
      });
    }

    return res.json(result);
  });
});

router.get('/spotify/albums', function(req, res) {
  SpotifyService.getAlbums({}, function(err, result) {
    if (err) {
      return res.send(400, {
        error: err.message
      });
    }

    console.log('whats')

    return res.json(result);
  });
});

router.get('/spotify/albums/:id', function(req, res) {
  SpotifyService.getTracksByAlbum({
    albumId: req.params.id
  }, function(err, result) {
    if (err) {
      return res.send(400, {
        error: err.message
      });
    }

    return res.json(result);
  });
});


// router.get('/blah', function(req, res) {
//   var albumArt = require('album-art');
//   albumArt('Taylor Swift', '1989', 'mega', function(err, url) {
//     console.log(url);

//     return res.json({ url: url });
//     //=> http://path/to/beatles/abbey_road_large.jpg
//   });
// });

module.exports = router;
