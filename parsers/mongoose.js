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
			if (this.ignoreFields.indexOf(fieldName) !== -1) {
				continue;
			}

			var mongoField = model.schema.paths[fieldName];

			var field = {
				type: mongoField.options.fieldType || typeMappings[mongoField.instance],
				name: fieldName,
				required: mongoField.isRequired,
				placeholder: mongoField.options.placeholder || ""
			};

			fields.push(field);
		}

		return fields;
	}
};

module.exports = MongooseParser;
