'use strict';

const config = require('konfig')();
const SC = require('node-soundcloud');
const _ = require('lodash');
var SpotifyWebApi = require('spotify-web-api-node');

if (process.env.NODE_ENV === 'production') {
  config = {
    soundcloud: {
      clientID: process.env.SOUNDCLOUD_CLIENT_ID,
      clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    }
  }
}


// Initialize client
SC.init({
  id: config.soundcloud.clientID,
  secret: config.soundcloud.clientSeret,
  uri: config.soundcloud.redirectUri
});



module.exports = () => {

  function login(params, cb) {
    const code = params.code;

    SC.authorize(code, function(err, accessToken) {
      if (err) {
        return cb(err);
      } else {
        return cb(undefined, { accessToken: accessToken });

      }
    });
  };

  function search(params, cb) {
    SC.get('/tracks', {
      q: params.q,
      license: 'cc-by-sa'
    }, function(err, result) {
      if (err) {
        return cb(err);
      }

      return cb(undefined, result);
    });
  }

  return {
    login: login,
    search: search
  };
};
