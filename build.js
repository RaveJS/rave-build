/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var createBundle = require('./task/createBundle');
var io = require('./lib/io/node');

global.Promise = require('when/es6-shim/Promise');

// temporary:
require('when/monitor');

var args = process.argv.slice(2);

build(args);

function build (args) {
	// this is temporary
	var context = eval('(' + args[0] + ')');
	context.raveMeta = context.raveMeta.split(/\s*,\s*/).map(ensureAbsolute);
	return createBundle(io, context)
		.then(out)
		.catch(fail);
}

function out (contents) {
	return io.write('./bundle.js', contents);
}

function fail (ex) {
	throw ex;
}

function ensureRelative (url) {
	if (!/^\.{1,2}\//.test(url)) {
		url = './' + url;
	}
	return url;
}

function ensureAbsolute (url) {
	return io.join(process.cwd(), url);
}
