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
	},

	validate: function () {
		if (this.required) {
			return !!this.value || "This field is required";
		}
		return true;
	},

	render: function () {
		throw Error("Render not implemented for field of type '" + this.type + "'")
	}
}

module.exports = BaseField;
