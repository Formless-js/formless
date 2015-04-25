var util = require("util");
var BaseField = require("./baseField");

function TextField(fieldInfo) {
}

util.inherits(TextField, BaseField);

TextField.prototype.render = 	function (renderer) {
		return renderer.render("textField.html", this);
};


module.exports = TextField;
