var extend = require('node.extend');

var defaultFieldInfo = {
	required: false
};

function nameToLabel(name) {
	// split the name on capital letters, underscore or dash
	var parts = name.split(/(?=[A-Z])|_|-/);

	// make the first letter of each word caps
	parts = parts.map(function (part) {
			return part.charAt(0).toUpperCase() + part.slice(1);
	})

	return parts.join(" ")
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
	init: function (fieldInfo) {
		var fieldInfo = extend(defaultFieldInfo, fieldInfo);

		this.type = fieldInfo.type;
		this.label = fieldInfo.label || nameToLabel(fieldInfo.name);
		this.name = fieldInfo.name;
		this.required = fieldInfo.required;
		this.placeholder = fieldInfo.placeholder;

		this.validators = [requiredValidator];
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
		var errors = [];

		for (var f = 0; f < this.validators.length; f++) {
			var validate = this.validators[f];

			validate.call(this, function (error) {
				remainingValidations--;
				if (error !== true) {
					errors.push(error);
				}

				if (remainingValidations === 0) {
					callback(errors);
				}
			})
		}
	},

	render: function () {
		throw Error("Render not implemented for field of type '" + this.type + "'")
	}
}

module.exports = BaseField;
