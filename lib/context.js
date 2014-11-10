/** @license MIT License (c) copyright 2014 original authors */
/** @author John Hann */
/** @author Brian Cavalier */

var crawl = require('rave/lib/crawl');
var assemble = require('./context/assemble');
var toJson = require('./context/toJson');

module.exports = context;

function context (io) {
	return function (config) {
		return crawl(config.raveMeta).then(function (meta) {
			var ctx = shallowCopy(config);
			ctx.packages = meta.packages;
			ctx.metadata = meta.roots;
			ctx = assemble(ctx);
			ctx.serialize = serialize;
			return ctx;
		});
	}
}

function shallowCopy (ob) {
	var result = {};
	for (var p in ob) result[p] = ob[p];
	return result;
}

function serialize () {
	return 'define("rave/_/context", function () { return '
		+ toJson(this)
		+ '\n});';
}
