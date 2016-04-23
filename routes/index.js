const express = require('express');
const router = express.Router();
const _ = require('lodash');
const SoundCloudService = require('../services/SoundCloudService')();
const SpotifyService = require('../services/SpotifyService')();

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
  SoundCloudService.login({
    code: code
  }, function(err, result) {
    if (err) {
      return res.send(400, {
        error: err.message
      });
    }
    return res.json(result);
  })

});

router.get('/soundcloud/tracks', function(req, res) {
  const params = req.query;
  SoundCloudService.search({
    q: params.q,
    license: 'cc-by-sa'
  }, function(err, result) {
    if (err) {
      return res.send(400, {
        error: err.message
      });
    }
    return res.json(result);
  })

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
