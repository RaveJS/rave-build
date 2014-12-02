/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var createBundle = require('./task/createBundle');
var makeBootFile = require('./task/makeBootFile');
var io = require('./lib/io/node');

global.Promise = require('when/es6-shim/Promise');

// temporary:
require('when/monitor');

exports.build = build;
exports.unbuild = unbuild;

function build (config) {
	return createBundle(io, config)
		.then(out)
		.catch(fail);
}

function unbuild (config) {
	return makeBootFile(io, config)
		.then(out)
		.catch(fail);
}

function out (contents) {
	return io.write('./boot.js', contents);
}

function fail (ex) {
	throw ex;
}
