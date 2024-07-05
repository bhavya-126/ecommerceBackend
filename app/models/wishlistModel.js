'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');
const userModel = require('./userModel');
const productModel = require('./productModel');


const wishlistSchema = new MONGOOSE.Schema({
    userId: { type: MONGOOSE.Schema.Types.ObjectId, ref: userModel },
    productId: { type: MONGOOSE.Schema.Types.ObjectId, ref: productModel },
}, {
    timestamps: true,
    versionKey: false,
    collection: 'wishlist'
})

module.exports = MONGOOSE.model('wishlist', wishlistSchema);