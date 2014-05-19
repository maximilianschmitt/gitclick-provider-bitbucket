'use strict';

var Promise = require('bluebird');

var instance;

var ApiMock = function(config) {
	this.username = config.username;
	this.password = config.password;
	instance = this;
};

ApiMock.prototype = {
	repos: {
		create: function(options) {
			return Promise.resolve({
				name: options.name,
				owner: instance.username,
				has_issues: options.has_issues,
				has_wiki: options.has_wiki,
				is_private: options.is_private,
				scm: 'hg',
				slug: options.name
			});
		}
	}
};

module.exports = ApiMock;