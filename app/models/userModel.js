'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');

const { Schema } = MONGOOSE;

/** *********** User Model ********** */
const userSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true },
  mobile: { type: String },
  role: { type: String, default: 'user' },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  address: {
    houseNo: { type: String },
    area: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: Number },
  },

}, { timestamps: true, versionKey: false, collection: 'users' });

module.exports = MONGOOSE.model('users', userSchema);
