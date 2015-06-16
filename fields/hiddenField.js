"use strict";

var util = require("util");
var BaseField = require("./baseField");

function HiddenField() {
}

util.inherits(HiddenField, BaseField);

HiddenField.prototype.render = 	function (renderer) {
		return renderer.render("hiddenField.html", this);
};


module.exports = HiddenField;
