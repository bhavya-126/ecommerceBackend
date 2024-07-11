'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');
const userModel = require('./userModel');
const productModel = require('./productModel');

const { Schema } = MONGOOSE;

let orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
    address: {
        houseNo: { type: String },
        area: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: Number },
    },
}, {
    timestamps: true,
    versionKey: false,
    collection: 'order'
})

module.exports = MONGOOSE.model('order', orderSchema)