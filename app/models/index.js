'use strict';

const reviewModel = require('./reviewModel');


/** ******************************
 **** Managing all the models ***
 ********* independently ********
 ******************************* */
module.exports = {
  sessionModel: require('./sessionModel'),
  userModel: require('./userModel'),
  dbVersionModel: require('./dbVersionModel'),
  adminModel: require('./adminModel'),
  otpModel: require('./otpModel'),
  productModel: require('./productModel'),
  categoryModel: require('./categoryModel'),
  wishlistModel: require('./wishlistModel'),
  cartModel: require('./cartModel'),
  orderModel: require('./orderModel'),
  orderDetailsModel: require('./orderDetailsModel'),
  reviewModel: require('./reviewModel')
};
