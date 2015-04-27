'use strict';

var _        = require('underscore');
var gutil    = require('gitclick-util');
var util     = require('util');
var Promise  = require('bluebird');
var Api      = require('./api');
var Provider = gutil.Provider;

var prompt = function(opts) {
  return new Promise(function(res) {
    require('inquirer').prompt(opts, res);
  });
};

var BitbucketProvider = function() {
	Provider.apply(this, arguments);

	this.api = new Api(this.config.auth);
};

util.inherits(BitbucketProvider, Provider);

BitbucketProvider.prompt = function() {
	return prompt([
		{
			name: 'username',
			message: 'Bitbucket Username (E-Mail does NOT work!)',
			type: 'input'
		},
		{
			name: 'password',
			message: 'Bitbucket Password',
			type: 'password'
		}
	]);
};

_.extend(BitbucketProvider.prototype,
	{
		createRepository: function(options) {
			var request = this.forgeOptions(this.extendOptions(options));
			
			return this.api.repos.create(request)
			.then(this.parseRepository);
		},

		forgeOptions: function(options) {
			var result = {};

			result.name = options.name;

			if (typeof options.issues !== 'undefined') {
				result.has_issues = options.issues;
			}

			if (typeof options.wiki !== 'undefined') {
				result.has_wiki = options.wiki;
			}

			if (typeof options.private !== 'undefined') {
				result.is_private = options.private;
			}

			return result;
		},

		parseRepository: function(apiResponse) {
			return {
				name: apiResponse.name,
				owner: apiResponse.owner,
				issues: apiResponse.has_issues,
				wiki: apiResponse.has_wiki,
				private: apiResponse.is_private,
				cloneUrl: 'https://' + apiResponse.owner + '@bitbucket.org/' + apiResponse.owner + '/' + apiResponse.slug,
				sshUrl: 'ssh://' + apiResponse.scm + '@bitbucket.org/' + apiResponse.owner + '/' + apiResponse.slug
			};
		}
	}
);

module.exports = BitbucketProvider;