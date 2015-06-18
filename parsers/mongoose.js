"use strict";

var typeMappings = {
	"String": "text",
	"Date": "date",
	"Number": "number",
	"Array": "select"
};

function MongooseParser() {
	this.ignoreFields = ["_id", "__v"];
}

MongooseParser.prototype = {
	parse: function (model) {
		var fields = [];
		for (var fieldName in model.schema.paths) {
			var mongoField = model.schema.paths[fieldName];
 			var formlessOptions;

			if (mongoField.instance !== "Array") {
				formlessOptions = mongoField.options.formless || {};
			}
			else {
				formlessOptions = mongoField.options.type[0].formless || {};
			}

			if (formlessOptions.ignore || this.ignoreFields.indexOf(mongoField.path) !== -1) {
				continue;
			}

			var fieldType = formlessOptions.type || typeMappings[mongoField.instance];

			if (!fieldType) {
				throw Error("Can't parse field " + model.modelName + "." + fieldName + " of type " + mongoField.instance);
			}

			var field = {
				type: fieldType,
				name: fieldName,
				required: mongoField.isRequired || false, // due to a bug in node.js's 'extend'
				placeholder: formlessOptions.placeholder || ""
			};

			fields.push(field);
		}

		return fields;
	}
};

module.exports = MongooseParser;
