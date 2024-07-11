'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');
const orderModel = require('./orderModel');
const productModel = require('./productModel');

const { Schema } = MONGOOSE;

let orderDetailSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: orderModel
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: productModel
    },
    quantity: {
        type: Number
    },
    mrp: {
        type: Number
    },
    discount: {
        type: Number
    }
}, {
    versionKey: false,
    collection: 'orderDetail'
})

module.exports = MONGOOSE.model('OrderDetail', orderDetailSchema);