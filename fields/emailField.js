"use strict";

var util = require("util");
var BaseField = require("./baseField");
var validator = require("email-validator");

function emailValidator(callback) {
	callback(validator.validate(this.value || "") || "The email address is invalid");
}

function EmailField() {
	this.template = "inputField.html";
	this.specificValidators = [emailValidator];
}

util.inherits(EmailField, BaseField);

module.exports = EmailField;
