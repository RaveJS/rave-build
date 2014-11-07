/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var context = require('../lib/context');
var bundle = require('../lib/bundle');
var loader = require('../lib/loader');
var when = require('when');

module.exports = createBundle;

function createBundle (io, config) {
	var ctx = context(io)(config);
	var bndl = ctx.then(bundle(io));
	var ldr = ctx.then(loader(io));
	return when.map([ ldr, ctx, bndl ], serializeOne)
		.then(function (serialized) {
			return serialized.join('\n\n');
		});
}

function serializeOne (thing) {
	return thing.serialize();
}
