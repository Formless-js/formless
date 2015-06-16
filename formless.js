 // jshint loopfunc: true

"use strict";

var path = require("path");
var extend = require("node.extend");

var nj = require("./renderers/nunjucks");

var defaultConfig = {
	useBootstrap: true,
	renderer: nj,
	modelParser: null,
	templatesPath: path.join(__dirname, "templates")
};

var typeMap = {
	"text": require("./fields/inputField"),
	"hidden": require("./fields/hiddenField"),
	"date": require("./fields/inputField"),
	"number": require("./fields/inputField"),
};

function Formless(model, userConfig) {
	this.fields = {};
	this.validators = [];

	var config = extend(defaultConfig, userConfig);

	if (config.templatesPath === defaultConfig.templatesPath && config.useBootstrap) {
		config.templatesPath = path.join(__dirname, "templates/bootstrap");
	}

	this.modelParser = config.modelParser;
	this.renderer = new config.renderer(config.templatesPath);

	if (this.modelParser) {
		model = this.modelParser.parse(model);
	}

	for (var f = 0; f < model.length; f++) {
		var modelField = model[f];
		var FieldClass = typeMap[modelField.type];

		if (!FieldClass) {
			throw Error("Unknown field type: " + modelField.type);
		}

		var formField = new FieldClass();
		formField.init(modelField);
		this.fields[modelField.name] = formField;
	}
}

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
			})(field);
		}
	},

	render: function () {
		if (!this.renderer) {
			throw Error("Please provide a renderer for Formless");
		}

		var output = "";

		for (var fieldName in this.fields) {
			var field = this.fields[fieldName];
			output += field.render(this.renderer);
		}

		return output;
	}
};

module.exports = Formless;
