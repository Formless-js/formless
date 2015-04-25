var nunjucks  = require('nunjucks');

module.exports = function (path) {
	return nunjucks.configure(path, {
		autoescape: true
	});

}
