'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');
const userModel = require('./userModel');
const productModel = require('./productModel');

const { Schema } = MONGOOSE;

const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: userModel
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: productModel
    },
    rating:{
        type: Number,
        enum: [1, 2, 3, 4, 5]
    },
    review:{
        type: String
    }
},{
    timestamps: true,
    versionKey: false,
    collection: 'review'
})

module.exports = MONGOOSE.model('review', reviewSchema);