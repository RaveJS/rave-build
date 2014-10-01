/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var context = require('../lib/context');
var bundle = require('../lib/bundle');

module.exports = createBundle;

function createBundle (io, config) {
	var ctx = context(io)(config);
	var bndl = ctx.then(bundle(io));
	// todo: add loader & promise shims in here, too
	return Promise.all([ ctx, bndl ])
		.then(serializeAll);
}

function serializeAll (things) {
	return Promise.all(things.map(serializeOne))
		.then(function (serialized) {
			return serialized.join('\n\n');
		});
}

function serializeOne (thing) {
	return thing.serialize();
}
