//TODO: move to separate projects
"use strict";
var nunjucks  = require('nunjucks');

module.exports = function (path) {
	return nunjucks.configure(path);
};
