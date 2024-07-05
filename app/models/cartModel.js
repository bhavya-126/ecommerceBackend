'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');
const userModel = require('./userModel');
const productModel = require('./productModel');

const { Schema } = MONGOOSE;

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: userModel },
    productId: { type: Schema.Types.ObjectId, ref: productModel },
    quantity: { type: Number, default: 1 },
},{
    timestamps: true,
    versionKey: false,
    collection: 'cart'
})

module.exports = MONGOOSE.model('cart', cartSchema);  