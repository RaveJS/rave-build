/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var path = require('path');

module.exports = loader;

function loader (io) {
	return function (context) {
		var raveMeta, fpath;

		raveMeta = context.packages.rave;
		fpath = path.join(raveMeta.location, ensureExt('.js', raveMeta.main));

		return {
			serialize: function () { return io.read(fpath); }
		};
	};
}

function ensureExt (ext, name) {
	return path.extname(name)
		? name
		: name + ext;
}
