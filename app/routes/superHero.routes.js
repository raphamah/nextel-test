const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../config/super-hero.validation');
var SuperHero = require('../controllers/superHero.controller.js');
const router = express.Router(); // eslint-disable-line new-cap
const permissions = require('../middlewares/permissions.js');
router.route('/')

  .get(validate(paramValidation.paginate), permissions.typeStandard, permissions.havePermissions, SuperHero.findPaginate)

  .post(validate(paramValidation.create), permissions.typeAdmin, permissions.havePermissions, SuperHero.create);

router.route('/help')

  .get(permissions.typeStandard, permissions.havePermissions, SuperHero.helpMe);

router.route('/id/:id')

  .get(permissions.typeStandard, permissions.havePermissions, SuperHero.findOne)

  .put(permissions.typeAdmin, permissions.havePermissions, validate(paramValidation.update), SuperHero.update)

  .delete(permissions.typeAdmin, permissions.havePermissions, SuperHero.update);



module.exports = router;