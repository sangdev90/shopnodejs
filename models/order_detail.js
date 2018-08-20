var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var order_detail = new Schema({
	cart_id: {type:String},
	product_id:  {type: Number, required : true},
	quantity: {type: Number , required : true , default : 1},
}, {collection : "cart_detail"});

module.exports = mongoose.model('order_detail',order_detail);