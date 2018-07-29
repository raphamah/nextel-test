const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../config/user.validation");
var User = require("../controllers/user.controller.js");
const router = express.Router(); // eslint-disable-line new-cap

router.route("/")

	.post(validate(paramValidation.register), User.register);

router.route("/sign_in")

	.post(validate(paramValidation.signIn), User.sign_in);

module.exports = router;