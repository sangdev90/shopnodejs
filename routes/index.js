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

/* GET home page. */
router.get('/', publicController.getIndex);


router.get('/logout', publicController.getLogout);
router.get('/login', publicController.getLogin);
router.get('/signup', publicController.getSignup);
router.post('/login', passport.authenticate('local', {
	failureRedirect: '/login',
	successRedirect: '/'
}), publicController.userLogin);

router.post('/signup', publicController.createUser);

router.get('/delete/:id', publicController.deleteOrder);

router.get('/update/:id/:quantity', publicController.updateCart);

router.get('/add-cart/:id', publicController.addCart);

router.get('/cart', publicController.getCart);

router.get('/menu', publicController.getMenu);

router.get('/category/:id', publicController.getCate);

router.get('/product-detail/:cate/:id', publicController.getDetailProduct);

router.get('/checkout', publicController.getCheckout);
router.post('/checkout', publicController.createTransaction);


// router.get('/admin', loggedin, adminController.admin);
// router.post('/admin/login', adminController.adminLogin);

// router.get('/admin/add-cate', loggedin, adminController.getCate);
// router.post('/admin/add-cate', adminController.createCate);

// router.get('/admin/add-product', loggedin, adminController.getProduct);
// router.post('/admin/add-product', adminController.createProduct);

// router.get('/admin/add-user', loggedin, adminController.getUser);
// router.post('/admin/add-user',[
// 	check('txtName').not().isEmpty().withMessage('username not empty !'),
// 	check('txtPass').not().isEmpty().withMessage('password not empty !'),
// 	check('txtRe-Pass').not().equals(check('txtPass')).withMessage('re-password not match !'),
// 	check('txtEmail').isEmail().withMessage('email not empty !'),
// 	check('numLevel').not().isEmpty().withMessage('level not empty !'),
// 	], adminController.createUser);
module.exports = router;
