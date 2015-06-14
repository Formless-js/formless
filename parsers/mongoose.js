var typeMappings = {
	"String": "text"
};

function MongooseParser() {
	this.ignoreFields = ["_id", "__v"];
}

MongooseParser.prototype = {
	addIgnoreFields: function (fieldsToIgnore) {
		this.ignoreFields.push.apply(this.ignoreFields, fieldsToIgnore);
	},

	parse: function (model) {
		fields = [];
		for (var fieldName in model.schema.paths) {
			var mongoField = model.schema.paths[fieldName];
 			var fieldOptions = mongoField.options.formless || {};

			if (fieldOptions.ignore || this.ignoreFields.indexOf(mongoField.path) !== -1) {
				continue;
			}

			var field = {
				type: fieldOptions.inputType || typeMappings[mongoField.instance],
				name: fieldName,
				required: mongoField.isRequired,
				placeholder: fieldOptions.placeholder || ""
			};

			fields.push(field);
		}

		return fields;
	}
};

module.exports = MongooseParser;
