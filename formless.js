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
	this.validators = [];


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

	validate: function (callback) {
		if (typeof(callback) !== "function") {
			throw Error("'" + callback + "' is not a function");
		}

		var errors;
		var remainingValidations = Object.keys(this.fields).length;
		remainingValidations += this.validators.length;

		for (var fieldName in this.fields) {
			var field = this.fields[fieldName];

			(function (field) {
				field.validate(function (fieldErrors) {
					remainingValidations--;
					if (fieldErrors) {
						field.errors = fieldErrors;
						errors = errors || {};
						errors[field.name] = fieldErrors;
					}

					if (remainingValidations === 0) {
						callback.call(this, errors);
					}
				});
			})(field)
		}
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
