const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../config/super-power.validation");
var SuperPower = require("../controllers/superPower.controller.js");
const router = express.Router(); // eslint-disable-line new-cap
const permissions = require("../middlewares/permissions.js");

router.route("/")

	.get(validate(paramValidation.paginate), permissions.typeStandard, permissions.havePermissions, SuperPower.findPaginate)

	.post(permissions.typeAdmin, permissions.havePermissions, validate(paramValidation.create), SuperPower.create);

router.route("/:id")

	.get(permissions.typeStandard, permissions.havePermissions, SuperPower.findOne)

	.put(permissions.typeAdmin, permissions.havePermissions, validate(paramValidation.update), SuperPower.update)

	.delete(permissions.typeAdmin, permissions.havePermissions, SuperPower.update);

module.exports = router;