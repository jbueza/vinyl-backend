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


console.log(process.env);


module.exports = () => {

  function search(params, cb) {
    return cb();
  }

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


  return {
    search: search,
    getAlbums: getAlbums
  };
};
