'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');

const { Schema } = MONGOOSE;

/** *********** Category Model ********** */

const categorySchema = new Schema({
    name: { type: String, unique: true },
}, {
    timestamps: true,
    versionKey: false,
    collection: 'category',
})

module.exports = MONGOOSE.model('category', categorySchema);