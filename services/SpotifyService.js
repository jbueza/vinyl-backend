'use strict';



const xml2js = require('xml2js');
const _ = require('lodash');
var SpotifyWebApi = require('spotify-web-api-node');

const config = {
  spotify: {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  }
}

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientID,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUri
});

module.exports = () => {

  function search(params, cb) {
    return cb();
  }

  function getAlbums(params, cb) {
    //spotify:album:4sb0eMpDn3upAFfyi4q2rw
    //spotify:album:0Y4QAA8YOOyMfqs4a8i2OK
    //spotify:album:14IOe7ahxQPTwUYUQX3IFi
    //spotify:album:3Oj8FdHcV6kAiOVWfkqRaA
    //spotify:album:500FEaUzn8lN9zWFyZG5C2
    //spotify:album:6w4iHE8FlMASJVepo3bAJW
    //spotify:album:4WD4pslu83FF6oMa1e19mF
    //spotify:album:1Zp3jrBB28aWXm0aXzV9GN
    //spotify:album:2w1YJXWMIco6EBf0CovvVN
    //spotify:album:2guirTSEqLizK7j9i1MTTZ
    spotifyApi.getAlbums([
        '4sb0eMpDn3upAFfyi4q2rw',
        '0Y4QAA8YOOyMfqs4a8i2OK',
        '14IOe7ahxQPTwUYUQX3IFi',
        '3Oj8FdHcV6kAiOVWfkqRaA',
        '500FEaUzn8lN9zWFyZG5C2',
        '6w4iHE8FlMASJVepo3bAJW',
        '4WD4pslu83FF6oMa1e19mF',
        '1Zp3jrBB28aWXm0aXzV9GN',
        '2w1YJXWMIco6EBf0CovvVN',
        '2guirTSEqLizK7j9i1MTTZ'
      ])
      .then(function(data) {
        var result = _.map(data.body.albums, function(row) {
          var obj = {
            id: row.id,
            coverArt: row.images[0].url,
            uri: row.uri,
            name: row.name,
            type: row.type,
            href: row.href,
            externalUrl: row.external_urls.spotify,
            tracks: _.map(row.tracks.items, function(track) {
              var trackObj = {
                id: track.id,
                name: track.name,
                artists: track.artists,
                discNumber: track.disc_number,
                trackNumber: track.track_number,
                previewUrl: track.preview_url,
                uri: track.uri,
                externalUrl: track.external_urls.spotify,
                duration: track.duration
              };

              return trackObj;
            })
          }

          return obj;
        });

        return cb(undefined, result);
      }, function(err) {
        return cb(err);
      });
  };


  return {
    search: search,
    getAlbums: getAlbums
  };
};
