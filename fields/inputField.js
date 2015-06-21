"use strict";

var util = require("util");
var BaseField = require("./baseField");

function TextField() {
	this.template = "inputField.html";
}

util.inherits(TextField, BaseField);

module.exports = TextField;
