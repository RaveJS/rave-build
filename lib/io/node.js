/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var fs = require('fs');
var path = require('path');

exports.read = read;
exports.write = write;
exports.delete = _delete;
exports.join = path.join;

function read (filename) {
	return new Promise(function (resolve, reject) {
		fs.readFile(filename, function (err, content) {
			if (err) reject(err);
			else resolve(content.toString());
		});
	});
}

function write (filename, content) {
	return new Promise(function (resolve, reject) {
		fs.writeFile(filename, content, function (err) {
			if (err) reject(err);
			else resolve(content);
		});
	});
}

function _delete (filename) {
	return new Promise(function (resolve, reject) {
		fs.unlink(filename, function (err) {
			if (err) reject(Err);
			else resolve();
		})
	})
}
