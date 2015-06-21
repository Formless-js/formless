// jshint loopfunc: true

"use strict";

var extend = require("node.extend");
var utils = require("utils-js");

var defaultFieldInfo = {
	required: false
};

function nameToLabel(name) {
	// split the name on capital letters, underscore or dash
	var parts = name.split(/(?=[A-Z])|_|-/);

	// make the first letter of each word caps
	parts = parts.map(function (part) {
			return part.charAt(0).toUpperCase() + part.slice(1);
	});

	return parts.join(" ");
}


function requiredValidator(callback) {
	if (this.required && !this.value) {
		callback("This field is required");
	}
	else {
		callback(true);
	}
}

function BaseField() {
}

BaseField.prototype = {
	init: function (userFieldInfo) {
		var fieldInfo = utils.clone(defaultFieldInfo);
		extend(fieldInfo, userFieldInfo);

		this.type = fieldInfo.type;
		this.label = fieldInfo.label || nameToLabel(fieldInfo.name);
		this.name = fieldInfo.name;
		this.required = fieldInfo.required;
		this.placeholder = fieldInfo.placeholder;

		this.validators = [requiredValidator];
	},

	serialize: function (value) {
		return value;
	},

	deserialize: function (value) {
		return value;
	},

	addValidator: function (validator) {
		this.validators.push(validator);
		return this;
	},

	validate: function (callback) {
		if (typeof(callback) !== "function") {
			throw Error("'" + callback + "' is not a function");
		}

		var remainingValidations = this.validators.length;
		var errors;

		for (var f = 0; f < this.validators.length; f++) {
			var validate = this.validators[f];

			validate.call(this, function (error) {
				remainingValidations--;
				if (error !== true) {
					errors = errors || [];
					errors.push(error);
				}

				if (remainingValidations === 0) {
					callback(errors);
				}
			});
		}
	},

	render: function (renderer) {
		if (!this.template) {
			throw Error("Template property not defined for field type" + this.type);
		}

		var context = utils.clone(this);
		context.value = this.serialize(context.value);

		return renderer.render(this.template, context);
	}
};

module.exports = BaseField;
