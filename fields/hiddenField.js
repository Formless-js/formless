"use strict";

var util = require("util");
var BaseField = require("./baseField");

function HiddenField() {
	this.template = "hiddenField.html";
}

util.inherits(HiddenField, BaseField);

module.exports = HiddenField;
