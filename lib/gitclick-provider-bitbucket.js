'use strict';

var Promise  = require('bluebird');
var Api      = require('./api');

var prompt = function(opts) {
  return new Promise(function(res) {
    require('inquirer').prompt(opts, res);
  });
};

var bitbucketProvider = {
  createRepository: function(options, auth) {
    var api = new Api(auth);
    return api.repos.create(forgeOptions(options)).then(parseRepository);
  },
  prompt: function() {
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
  }
};

function forgeOptions(options) {
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
}

function parseRepository(apiResponse) {
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

module.exports = bitbucketProvider;
