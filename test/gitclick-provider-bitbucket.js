/* global describe, it, before, beforeEach, after */
'use strict';

var ApiMock = require('./api-mock');
var proxyquire = require('proxyquire');
var testUtil = require('gitclick-test-util');

var bitbucketProvider = proxyquire('../lib/gitclick-provider-bitbucket', { './api': ApiMock });

describe('bitbucketProvider', function() {
	describe('createRepository', function() {
		testUtil.testProvider(bitbucketProvider);
	});
});
