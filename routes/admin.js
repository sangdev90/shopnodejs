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
		if (req.user.level === 1) {
			next();
		} else {
			res.send('Account not permision !');
		}
	} else {
		res.render('admin/admin_login');
	}
}
var adminLogin = function (req, res, next) {
	if (req.user.level === 1) {
		next();
	} else {
		res.render('admin/admin_login');
	}
}

router.get('/', loggedin, adminController.admin);
router.get('/login',loggedin, adminController.admin);
router.get('/logout', adminController.logout);
router.post('/login',passport.authenticate('local', {
	failureRedirect: '/admin/login',
	successRedirect: '/admin'
}), adminController.adminLogin);

router.get('/add-cate',loggedin, adminController.getCate);
router.post('/add-cate',loggedin, adminController.createCate);

router.get('/add-product',loggedin, adminController.getProduct);
router.post('/add-product', adminController.createProduct);

router.get('/add-user',loggedin, adminController.getUser);
router.post('/add-user',[
	check('txtName').not().isEmpty().withMessage('username not empty !'),
	check('txtPass').not().isEmpty().withMessage('password not empty !'),
	check('txtRe-Pass').not().equals(check('txtPass')).withMessage('re-password not match !'),
	check('txtEmail').isEmail().withMessage('email not empty !'),
	check('numLevel').not().isEmpty().withMessage('level not empty !'),
	], adminController.createUser);

module.exports = router;
