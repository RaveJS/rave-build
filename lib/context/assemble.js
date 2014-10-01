/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var assembleAppContext = require('rave/lib/auto/assembleAppContext');

module.exports = create;

function create (config) {
	return assembleAppContext(config);
}
