/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var context = require('../lib/context');
var path = require('path');

module.exports = makeBootFile;

var template = "(function(d,s){s=(d.head||d.getElementsByTagName('head')[0]).appendChild(d.createElement('script'));s.async=!1;s.src='{raveSource}';}(document));";

function makeBootFile (io, config) {
	var ctx = context(io)(config);
	return ctx.then(function (context) {
		return createBootScript(io, context);
	});
}

function createBootScript (io, context) {
	// 1. find where rave.js is
	// 2. output a boot.js file that points to rave.js
	var ravePkg = context.packages.rave;
	var raveMain = ensureExt('.js', io.join(ravePkg.location, ravePkg.main));
	raveMain = io.relative(context.baseUrl, raveMain);
	return template.replace(/\{raveSource\}/, raveMain);
}

function ensureExt (ext, name) {
	return path.extname(name)
		? name
		: name + ext;
}
