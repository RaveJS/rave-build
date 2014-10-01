/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var createCodeFinder = require('rave/lib/createCodeFinder');

module.exports = rewriteHtmlFile;

// find start of comment, start of <html> tag, attr name, start of attr value,
// or end of <html tag>
var docAttrsRx = /(<html)\s+|\s([a-z][a-z0-9\-]*)|(>)/i;
var startOfDocTag = 1;
var attributeName = 2;
var endOfTag = 3;

var quotesAndCommentsRx = /(''?|""?|<--)/;

var skippers = {
	"''": false,
	'""': false,
	"'": /\\\\'|[^\\]'/g,
	'"': /\\\\"|[^\\]"/g,
	'<--': /-->/
};

var finder = createCodeFinder(docAttrsRx, quotesAndCommentsRx, skipQuotesAndComments);

function rewriteHtmlFile (io, context) {
	if (context.isQuietMode) {
		// remove all debug attributes
		return function (html) {
			return transformDebugAttrs(html, disableAttr);
		};
	}
	else {
		// restore debug attrs
		return function (html) {
			return transformDebugAttrs(html, enableAttr);
		};
	}
}

function transformDebugAttrs (source, transform) {
	var inDocTag, output, sourcePos, attrName;

	output = '';
	sourcePos = 0;

	finder(source, function (matches) {
		if (matches[startOfDocTag]) {
			inDocTag = true;
		}
		else if (matches[attributeName]) {
			if (inDocTag) {
				attrName = matches[attributeName];
				output += source.slice(sourcePos, matches.index - 1)
					+ transform(attrName);
				sourcePos = matches.index + attrName.length;
			}
		}
		else if (matches[endOfTag]) {
			// stop looking. we've reached the end of the <html> tag
			if (inDocTag) return false;
		}
	});

	output += source.slice(sourcePos);

	return output;

}

function disableAttr (attr) {
	return attr.replace(/\bdebug\b/, 'x-debug');
}

function enableAttr (attr) {
	return attr.replace(/\bx-debug\b/, 'debug');
}

function skipQuotesAndComments (matches) {
	var unwanted, rx, index;

	unwanted = matches.pop();
	if (!unwanted) return -1;

	rx = skippers[unwanted];
	if (!rx) return -1;

	index = matches.index + matches[0].length
	rx.lastIndex = index;
	if (!rx.exec(source)) {
		throw new Error(
				'Unterminated comment or string at '
				+ index + ' near ' + matches.input.slice(index - 50, 100)
		);
	}

	return rx.lastIndex;
}
