/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var build = require('./bundle/build');

module.exports = bundle;

function bundle (io) {
	return function (context) {
		return build(io, context)
			.then(function (output) {
				return {
					serialize: function () { return output(); }
				};
			});
	};
}
