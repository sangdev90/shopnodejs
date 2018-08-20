var express = require('express');
var router = express.Router();
var passport = require('passport');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');


var Category = require('../models/category.js');
var Product = require('../models/product.js');
var Order = require('../models/order.js');
var OrderDetail = require('../models/order_detail.js');
var Cart = require('../models/cart.js');

var User  = require('../models/user.js');

var adminController = require('../controllers/adminController');
var publicController = require('../controllers/publicController');


var loggedin = function (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/login');
	}
}
var adminLogin = function (req, res, next) {
	if (req.user) {
		next();
	} else {
		res.render('admin/admin_login');
	}
}

router.get('/admin', adminLogin, adminController.admin);
router.post('/admin/login', adminController.adminLogin);

router.get('/admin/add-cate', adminController.getCate);
router.post('/admin/add-cate', adminController.createCate);

router.get('/admin/add-product', adminController.getProduct);
router.post('/admin/add-product', adminController.createProduct);

router.get('/admin/add-user', adminController.getUser);
router.post('/admin/add-user',[
	check('txtName').not().isEmpty().withMessage('username not empty !'),
	check('txtPass').not().isEmpty().withMessage('password not empty !'),
	check('txtRe-Pass').not().equals(check('txtPass')).withMessage('re-password not match !'),
	check('txtEmail').isEmail().withMessage('email not empty !'),
	check('numLevel').not().isEmpty().withMessage('level not empty !'),
	], adminController.createUser);

module.exports = router;
