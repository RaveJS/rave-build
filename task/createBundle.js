/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var context = require('../lib/context');
var bundle = require('../lib/bundle');
var loader = require('../lib/loader');
var when = require('when');
var build = require('rave/build/build');

module.exports = createBundle;

function createBundle (io, config) {
	console.log('Creating complete bundle...');
	var ctx = context(io)(config)
		.then(logTap('Created bundled context.'));
	var bndl = ctx.then(bundle(io))
		.then(logTap('Created application bundle.'));
	return when.map([ ctx, bndl ], serializeOne)
		.then(logTap('Creating complete (rave + context + app) bundle...'))
		.then(function (serialized) {
			return build(serialized[0], serialized[1])
				.then(logTap('Created complete bundle.'));
		});
}

function serializeOne (thing) {
	return thing.serialize();
}

function logTap (message) {
	return function (value) {
		console.log(message);
		return value;
	};
}
