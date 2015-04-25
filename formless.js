var path = require("path");
var extend = require('node.extend');

var nj = require('./renderers/nunjucks');

var modelParser = null;

var defaultConfig = {
	useBootstrap: true,
	renderer: nj,
	modelParser: null,
	templatesPath: path.join(__dirname, 'templates')
}

var renderer = new nj(defaultConfig.templatesPath);

var typeMap = {
	"text": require("./fields/textField")
}

function Formless(model) {
	this.fields = {};

	if (modelParser) {
		model = modelParser.parse(model);
	}

	for (var f = 0; f < model.length; f++) {
		var modelField = model[f];
		var FieldClass = typeMap[modelField.type];
		var formField = new FieldClass();
		formField.init(modelField);
		this.fields[modelField.name] = formField;
	}
}

Formless.configure = function (newConfig) {
	var config = extend(defaultConfig, newConfig);

	if (config.templatesPath === defaultConfig.templatesPath && config.useBootstrap) {
		config.templatesPath += "/bootstrap";
	}

	modelParser = config.modelParser;
	renderer = new config.renderer(config.templatesPath);
};


Formless.prototype = {
	fill: function (values) {
		for (var valueName in values) {
			if (this.fields[valueName]) {
				this.fields[valueName].value = values[valueName];
			}
		}
	},

	isValid: function () {
		var isValid = true;

		for (var fieldName in this.fields) {
			var field = this.fields[fieldName];
			var result = field.validate();

			if (result !== true) {
				if (typeof result === "string") {
					field.error = result;
				}
				isValid = false;
			}
		}

		return isValid;
	},

	render: function () {
		if (!renderer) {
			throw Error("Please provide a renderer for Formidable");
		}

		var output = "";

		for (var fieldName in this.fields) {
			var field = this.fields[fieldName];
			output += field.render(renderer);
		}

		return output;
	}
};

module.exports = Formless;
