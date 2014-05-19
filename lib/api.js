'use strict';

var Promise       = require('bluebird');
var superagent    = require('superagent');
var ProviderError = require('gitclick-util').errors.ProviderError;
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
			var url = instance.apiUrl + '/repositories/' + username + '/' + options.name;

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

				throw new ProviderError(res.error.message);
			});
		}
	}
};

module.exports = BitbucketApi;