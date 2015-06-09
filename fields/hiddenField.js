var util = require("util");
var BaseField = require("./baseField");

function HiddenField(fieldInfo) {
}

util.inherits(HiddenField, BaseField);

HiddenField.prototype.render = 	function (renderer) {
		return renderer.render("inputField.html", this);
};


module.exports = HiddenField;
