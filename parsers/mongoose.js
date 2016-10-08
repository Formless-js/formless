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

				if (mongoField.options.formless === undefined || this.ignoreFields.indexOf(mongoField.path) !== -1) {
					continue;
				}

				if (mongoField.instance !== "Array") {
					formlessOptions = mongoField.options.formless || {};
				}
				else {
					formlessOptions = mongoField.options.type[0].formless || {};
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
