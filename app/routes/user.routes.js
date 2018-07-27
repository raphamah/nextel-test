const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../config/user.validation');
var User = require('../controllers/user.controller.js');
const router = express.Router(); // eslint-disable-line new-cap
const permissions = require('../middlewares/permissions.js');

router.route('/')

  .get(permissions.typeAdmin, permissions.havePermissions, validate(paramValidation.paginate), User.findPaginate);

router.route('/:id')

  .put(permissions.typeAdmin, permissions.havePermissions, validate(paramValidation.update), User.update)

  .delete(permissions.typeAdmin, permissions.havePermissions, User.delete);

module.exports = router;