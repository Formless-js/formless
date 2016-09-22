"use strict";

var util = require("util");
var BaseField = require("./baseField");

function PasswordField() {
	this.template = "inputField.html";
}

util.inherits(PasswordField, BaseField);

module.exports = PasswordField;
