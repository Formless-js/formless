"use strict";

var util = require("util");
var BaseField = require("./baseField");

function SelectField() {
	this.template = "selectField.html";
}

util.inherits(SelectField, BaseField);

module.exports = SelectField;
