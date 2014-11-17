/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var fs = require('fs');
var path = require('path');
var when = require('when');

exports.read = read;
exports.write = write;
exports.delete = _delete;
exports.join = path.join;
exports.relative = relative;

var Promise = when.Promise;

function read (filename) {
	return new Promise(function (resolve, reject) {
		fs.readFile(filename, function (err, content) {
			if (err) reject(err);
			else resolve(content.toString());
		});
	});
}


function write (filename, content) {

	return tryWrite()
		.catch(needsDir, function () {
			return mkdir(path.dirname(filename))
				.then(tryWrite);
		});

	function tryWrite () {
		return new Promise(function (resolve, reject) {
			fs.writeFile(filename, content, function (err) {
				if (err) reject(err);
				else resolve(content);
			});
		});
	}

	function needsDir (err) {
		return err.code === 'ENOENT';
	}
}

function _delete (filename) {
	return new Promise(function (resolve, reject) {
		fs.unlink(filename, function (err) {
			if (err) reject(Err);
			else resolve();
		})
	})
}

function relative (from, to) {
	return path.relative(from, to);
}

/**
 * Promise-based "mkdir -p"
 * @param  {String} folder full path to ensure exists
 * @return {Promise} promise that fulfills once the full path exists, with
 *  the full path as the value.
 */
function mkdir (folder) {
	var folders;

	// path.relative('', folder) converts to native path separators so
	// that we're splitting on the correct separator, i.e. path.sep
	folders = path.relative('', folder).split(path.sep);

	return when.reduce(folders, function(pathSoFar, folder) {

		pathSoFar = path.join(pathSoFar, folder);

		return new Promise(function (resolve, reject) {
			fs.mkdir(pathSoFar, function (err) {
				if (err && err.code !== 'EEXIST') {
					reject(err);
				} else {
					resolve(pathSoFar);
				}
			});
		});

	}, '');
}
