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
}, {
    timestamps: true,
    versionKey: false,
    collection: 'order'
})

module.exports = MONGOOSE.model('order', orderSchema)