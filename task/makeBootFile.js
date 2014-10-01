/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

module.exports = makeBootFile;

var template = "(function(d,s){s=(d.head||d.getElementsByTagName('head')[0]).appendChild(d.createElement('script'));s.async=!1;s.src='{raveSource}';}(document));";

function makeBootFile (io, context) {
	if (context.isBuiltMode) {
		return function () {
			return "TODO: this should be the built application";
		};
	}
	else {
		return function () {
			return createBootScript(io.join, context);
		};
	}
}

function createBootScript (join, context) {
	// 1. find where rave.js is
	// 2. output a boot.js file that points to rave.js
	var ravePkg = context.packages.rave;
	var raveMain = join(ravePkg.location, ravePkg.main);
	return template.replace(/\{raveSource\}/, raveMain);
}
