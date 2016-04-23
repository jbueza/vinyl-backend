'use strict';

const config = require('konfig')();
const Spotify = require('spotify-web');
const xml2js = require('xml2js');
const _ = require('lodash');
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientID,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUri
});



module.exports = () => {

  function getClient(cb) {

    Spotify.login(config.spotify.username, config.spotify.password, function(err, spotify) {
      if (err) {
        return cb(err);
      }
      return cb(undefined, spotify);

    });

  };

  function search(params, cb) {
    Spotify.login(config.spotify.username, config.spotify.password, function(err, spotify) {
      if (err) {
        return cb(err);
      }

      spotify.search(params.query, function(err, xml) {
        if (err) {
          return cb(err);
        }

        spotify.disconnect();

        var parser = new xml2js.Parser();
        parser.on('end', function(data) {
          return cb(undefined, data);
        });
        parser.parseString(xml);
      });
    });
  };

  function getAlbums(params, cb) {
    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', { limit: 10, offset: 20 }, function(err, data) {
      if (err) {
        console.error('Something went wrong!');
        return cb(err);
      } else {

        var result = _.map(data.body.items, function(row) {
          var obj = {
            id: row.id,
            coverArt: row.images[0].url,
            uri: row.uri,
            name: row.name,
            type: row.type,
            href: row.href,
            externalUrl: row.external_urls.spotify
          }

          return obj;
        });

        return cb(undefined, result);
      }
    });
  };

  function getTracksByAlbum(params, cb) {

    var id = params.albumId;

    getClient(function(err, spotify) {
      console.log('getting client');
      spotify.get('spotify:album:7u6zL7kqpgLPISZYXNTgYk', function(err, album) {
        console.log(album);
        console.log(err);
        return cb(undefined, album)
      });
    });


  };

  return {
    search: search,
    getAlbums: getAlbums,
    getTracksByAlbum: getTracksByAlbum
  };
};
