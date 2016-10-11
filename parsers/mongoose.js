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
			if (model.schema.paths.hasOwnProperty(fieldName)) {
				var mongoField = model.schema.paths[fieldName];
				var formlessOptions;

				if (mongoField.instance !== "Array") {
					formlessOptions = mongoField.options.formless;
				}
				else {
					formlessOptions = mongoField.options.type[0].formless;
				}

				// if we don't find the option in the field itself or we ex
				if (formlessOptions === undefined || this.ignoreFields.indexOf(mongoField.path) !== -1) {
					continue;
				}

				// inherit all options from the `formless` property
				var field = JSON.parse(JSON.stringify(formlessOptions));

				field.type = formlessOptions.type || typeMappings[mongoField.instance];

				if (!field.type) {
					throw Error("Can't parse field " + model.modelName + "." + fieldName + " of type " + mongoField.instance);
				}

				field.name = fieldName;
				field.required = mongoField.isRequired;

				fields.push(field);
			}
		}

		return fields;
	}
};

module.exports = MongooseParser;
