/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var cramConfig = require('./cramConfig');
var findModuleType = require('../find/moduleType');
var cram = require('cram');

module.exports = build;

var cfgFile = './.temp-cram-config.json';
var outFile = './.temp-cram-output.js';

function build (io, context) {
	var toConfig = cramConfig(findModuleType(io));

	return toConfig(context)
		.then(writeCfg)
		.then(function () {
			return cram({
				// loader: "", // script to insert at top of bundle
				configFiles: [cfgFile],
				output: outFile
			});
		})
		.then(deleteCfg)
		.then(function () { return readOutput; });

	function writeCfg (cramCfg) {
		return io.write(cfgFile, JSON.stringify(cramCfg));
	}

	function deleteCfg () {
		//return io.delete(cfgFile);
	}

	function readOutput () {
		return io.read(outFile);
	}
}
