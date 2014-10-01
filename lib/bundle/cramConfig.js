/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

module.exports = cramConfig;

var converters = {
	'amd': identity,
	'node': createConfigurer(createCjsm11Config),
	'globals': createConfigurer(createLegacyConfig)
};

function cramConfig (findModuleType) {
	return function (context) {
		return Promise.all(convertPackages(findModuleType, context.packages))
			.then(assembleConfig(context));
	};
}

function assembleConfig (context) {
	return function (pkgs) {
console.log(pkgs);
		return {
//			baseUrl: './',
			main: context.app.main,
			packages: pkgs
		};
	};
}

function convertPackages (findModuleType, pkgs) {
	// packags are doubled, but that's currently necessary
	return Object.keys(pkgs).map(function (key) {
		return convertPackage(findModuleType, pkgs[key], key);
	});
}

function convertPackage (findModuleType, pkg, name) {
	return findModuleType(pkg).then(function (moduleType) {
		var convert = converters[moduleType];

		if (!convert) {
			throw new Error('Cannot determine converter for ' + name);
		}

		return convert({
			name: name,
			location: pkg.location,
			main: pkg.main,
			deps: pkg.deps
		});
	});
}

function createCjsm11Config (pkg) {
	return {
		loader: 'curl/loader/cjsm11'
	};
}

function createLegacyConfig (pkg) {
	return {
		loader: 'curl/loader/legacy',
		// Note: cram will ony work if the required packages have main modules
		requires: depsToRequires(pkg.deps || {}),
		exports: 'self' // Rave doesn't support exports so pass a known global
	}
}

function createConfigurer (createCfg) {
	return function (pkg) {
		pkg.config = createCfg(pkg);
		return pkg;
	}
}

function depsToRequires (deps) {
	return Object.keys(deps).map(function (key) { return deps[key]; })
}

function identity (pkg) {
	return pkg;
}
