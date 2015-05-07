'use strict';

var Promise       = require('bluebird');
var superagent    = require('superagent');
var agent         = superagent.agent();

var instance;

var BitbucketApi = function(config) {
  instance = this;
  
  this.apiUrl = 'https://api.bitbucket.org/2.0';
  this.username = config.username;
  this.password = config.password;
};

BitbucketApi.prototype = {
  repos: {
    create: function(options) {
      var username = instance.username;
      var password = instance.password;
      var owner = options.team || instance.username;

      // to support teams, use teamId as owner in this url:
      var url = instance.apiUrl + '/repositories/' + owner + '/' + options.name;

      return new Promise(function(resolve, reject) {
        agent
        .post(url)
        .auth(username, password)
        .set('Accept', 'application/json')
        .send(options)
        .end(resolve);
      })
      .then(function(res) {
        if (res.ok) return res.body;

        try {
          res = JSON.parse(res.text);
        } catch(e) {
          res = { error: { message: 'Unknown error' } };
        }

        throw new Error(res.error.message);
      });
    }
  }
};

module.exports = BitbucketApi;
