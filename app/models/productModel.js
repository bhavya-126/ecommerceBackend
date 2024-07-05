'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');
const categoryModel = require('./categoryModel');

const { Schema } = MONGOOSE;

// const productSchema = new 

const productSchema = new Schema({
    name: { type: String },
    mrp: { type: Number },
    discount: { type: Number },
    category: { type: MONGOOSE.Schema.Types.ObjectId, ref: categoryModel },
    totalQuantity: { type: Number },
    details: { type: String },
    description: { type: String },
    imageUrl: { type: String },
}, {
    timestamps: true,
    versionKey: false,
    collection: 'product',
})

module.exports = MONGOOSE.model('product', productSchema);