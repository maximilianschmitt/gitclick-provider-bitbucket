/* global describe, it, before, beforeEach, after */
'use strict';

var rewire         = require('rewire');
var testUtil       = require('gitclick-test-util');

var BitbucketProvider = rewire('../lib/gitclick-provider-bitbucket');
BitbucketProvider.__set__('Api', require('./api-mock'));

testUtil.testProvider(BitbucketProvider);