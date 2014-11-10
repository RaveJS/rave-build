/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var createBundle = require('./task/createBundle');
var io = require('./lib/io/node');

global.Promise = require('when/es6-shim/Promise');

// temporary:
require('when/monitor');

module.exports = build;

var args = process.argv.slice(2);

build(args);

function build (args) {
	// this is temporary
	var config = eval('(' + args[0] + ')');
	config.raveMeta = config.raveMeta.split(/\s*,\s*/).map(ensureAbsolute);
	config.baseUrl = process.cwd();
	return createBundle(io, config)
		.then(out)
		.catch(fail);
}

function out (contents) {
	return io.write('./boot.js', contents);
}

function fail (ex) {
	throw ex;
}

function ensureAbsolute (url) {
	return io.join(process.cwd(), url);
}
