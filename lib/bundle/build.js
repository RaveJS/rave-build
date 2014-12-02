/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var cramConfig = require('./cramConfig');
var findModuleType = require('../find/moduleType');
var cram = require('cram');

module.exports = build;

function build (io, context, cfgFile, outFile, main) {
	var toConfig = cramConfig(findModuleType(io));

	return toConfig(addMain(context))
		.then(writeCfg)
		.then(function () {
			return cram({
				configFiles: [cfgFile],
				output: outFile
			});
		})
		.then(clearCramTurds)
		.then(deleteCfg)
		.then(function () { return readOutput; });

	function addMain (context) {
		context.main = main;
		return context;
	}

	function writeCfg (cramCfg) {
		return io.write(cfgFile, JSON.stringify(cramCfg));
	}

	function deleteCfg () {
		//return io.delete(cfgFile);
	}

	function readOutput () {
		return io.read(outFile);
	}

	function clearCramTurds () {
		delete global.define;
	}
}
