/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var build = require('./bundle/build');

module.exports = bundle;

var cfgFile = './.cram/temp/cram-app-config.json';
var appOutFile = './.cram/temp/cram-app-output.js';

// TODO: run a second build that creates the extensions bundle

function bundle (io) {
	return function (context) {
		return build(io, context, cfgFile, appOutFile, context.app.main)
			.then(function (output) {
				return {
					serialize: function () { return output(); }
				};
			});
	};
}
