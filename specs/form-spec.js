// jshint jasmine: true

"use strict";

var Form = require("../formless");

var basicForm = require("./assets/basicForm");

describe("form", function () {
	var form;

	beforeEach(function () {
		form = new Form(basicForm);
	});

	it("should initialize with basic JSON", function () {
		expect(Object.keys(form.fields).length).toEqual(3);
	});

	it("should validate required fields", function (done) {
		form.fill({
			firstName: "Surdu",
			nickname: "nick"
		});

		form.validate(function (err) {
			expect(err.lastName).not.toBeUndefined();
			done();
		});
	});
});
