"use strict";

var util = require("util");
var BaseField = require("./baseField");

function TextField() {
}

util.inherits(TextField, BaseField);

TextField.prototype.render = 	function (renderer) {
		return renderer.render("inputField.html", this);
};


module.exports = TextField;