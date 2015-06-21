"use strict";

var BaseField = require("./baseField");

var util = require("util");
var moment = require("moment");

function DateField() {
	this.template = "inputField.html";
}

util.inherits(DateField, BaseField);

DateField.prototype.serialize = function (value) {
	return moment(value).format("YYYY-MM-DD");
};

DateField.prototype.deserialize = function (value) {
	return moment(value).toDate();
};


module.exports = DateField;
