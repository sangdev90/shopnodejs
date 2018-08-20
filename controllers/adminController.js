var express = require('express');
var router = express.Router();
var multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator/check');

var Category = require('../models/category.js');
var Product = require('../models/product.js');
var Order = require('../models/order.js');
var OrderDetail = require('../models/order_detail.js');
var Cart = require('../models/cart.js');
var User  = require('../models/user.js');

// store file
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/product');
	},
	filename: function (req, file, cb) {
		file.originalname = Date.now() +'-'+ file.originalname;
		cb(null, file.originalname);
	}
});

var upload = multer({ storage: storage }).single('fImage');

module.exports = {
	admin: function (req, res, next) {
		res.render('admin/admin', {'user': req.user});
	},
	adminLogin: function (req, res, next) {

		User.findOne({username: req.body.username}, function (err, user) {
			if (err) throw err;
			if (user) {
				if (!user.comparePassword(req.body.password, user.password)) {
					return res.status(401).json({message: 'password wrong'});
				} else {
					var token = jwt.sign({username: user.username, _id: user._id}, 'secret');
					res.cookie('auth-token', token);
					res.redirect('/admin');
				}
			} else {
				res.status(401).json({message: 'user not found'});
			}
		});
	},
	getCate: function (req, res, next) {
		res.render('admin/add_cate', {'user': req.user});
	},
	createCate: function (req, res, next) {
		var body = req.body;
		var newCate = new Category();
		Category.find().sort({'id': -1}).skip(0).limit(1).exec(function (err, result) {
			if (err) throw err;
			let index = result[0].id;
			newCate.id = index+1;
			newCate.name = body.txtName;
			newCate.save(function (err, result) {
				if (err) throw err;
				console.log('save new cate success !');
			});
		});
	},
	getProduct: function (req, res, next) {
		Category.find().exec(function (err, result) {
			if (err) throw err;
			res.render('admin/add_product', {'user': req.user, 'listCates': result});
		});

	},
	createProduct: function (req, res, next) {
		upload(req, res, function(err) {
			if (err) throw err;
			var body = req.body;
			var newProduct = new Product();
			Product.find().sort({'id': -1}).skip(0).limit(1).exec(function (err, result) {
				if (err) throw err;
				let index = result[0].id;
				newProduct.id = index+1;
				newProduct.name = body.txtName;
				newProduct.description = body.txtDesc;
				newProduct.price = body.numPrice;
				newProduct.image = req.file.originalname;
				newProduct.category_id = body.slcCate;
				newProduct.save(function (err, result) {
					if (err) throw err;
					console.log('save new product success !');
				});
			});
		});

	},
	getUser: function (req, res, next) {
		res.render('admin/add_user', {'user': req.user});
	},
	createUser: function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		var body = req.body;
		var newUser = new User();
		newUser.username = body.txtName;
		newUser.email = body.txtEmail;
		newUser.password = newUser.hashPassword(body.txtPass);
		newUser.level = body.numLevel;
		newUser.save(function (err, result) {
			if (err) {
				throw err;
			}
			console.log(result);
		});
	}
}