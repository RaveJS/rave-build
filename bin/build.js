/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var raveBuild = require('../rave-build');
var path = require('path');

var args = process.argv.slice(2);

// this is temporary
var config = eval('(' + args[0] + ')');
config.raveMeta = config.raveMeta.split(/\s*,\s*/).map(ensureAbsolute);
config.baseUrl = process.cwd();

raveBuild.build(config).catch(fail);

function ensureAbsolute (url) {
	return path.join(process.cwd(), url);
}

function fail (ex) {
	setTimeout(function () { throw ex; }, 0);
}
