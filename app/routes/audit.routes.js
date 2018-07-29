const express = require("express");
var AuditEvent = require("../controllers/audit.controller.js");
const router = express.Router(); // eslint-disable-line new-cap

router.route("/")

	.post(AuditEvent.subscribe);

module.exports = router;