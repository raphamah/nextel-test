const express = require("express");

const routesUser = require("./app/routes/user.routes.js");
const routesSuperHero = require("./app/routes/superHero.routes.js");
const routesSuperPower = require("./app/routes/superPower.routes.js");
const routesAudit = require("./app/routes/audit.routes.js");
const routesAuth = require("./app/routes/auth.routes.js");

const auth = require("./app/middlewares/auth.js");

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) =>
	res.send("OK")
);
router.use("/user", auth, routesUser);
router.use("/super_heroes", auth, routesSuperHero);
router.use("/super_powers", auth, routesSuperPower);
router.use("/audit_event", auth, routesAudit);
router.use("/auth", routesAuth);

module.exports = router;
