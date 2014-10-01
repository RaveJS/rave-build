/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var findEs5ModuleTypes = require('rave/lib/find/es5ModuleTypes');

module.exports = find;

find.findFromMeta = findFromMeta;
find.findFromSource = findFromSource;

function find (io) {
	return function (pkg) {
		var moduleType, main;

		moduleType = findFromMeta(pkg);

		if (moduleType) {
			return Promise.resolve(moduleType);
		}
		else if (!pkg.main) {
			return Promise.reject(new Error(
				'Cannot determine moduleType for '
				+ pkg.name
				+ '. Please override in bower.json or package.json.'
			));
		}
		else {
			main = io.join(pkg.location, pkg.main);
			if (!/\.js$/.test(main)) main += '.js';
			return io.read(main)
				.then(findFromSource);
		}
	};
}

function findFromMeta (meta) {
	var moduleType = meta.moduleType;
	if (moduleType) {
		if (moduleType.indexOf('amd') >= 0) {
			return 'amd';
		}
		else if (moduleType.indexOf('node') >= 0) {
			return 'node';
		}
		else {
			return 'globals';
		}
	}
}

function findFromSource (source) {
	var typeFlags = findEs5ModuleTypes(source, true);
	return typeFlags.isAmd
		? 'amd'
		: typeFlags.isCjs ? 'node' : 'globals';
}
