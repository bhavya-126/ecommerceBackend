const MONGOOSE = require('mongoose');
const userModel = require('./userModel');

const { Schema } = MONGOOSE;

const otpSchema = new Schema({
    userId: { type: MONGOOSE.Schema.Types.ObjectId, ref: userModel },
    otp: { type: String },
    createdAt: { type: Date, default: Date.now, expires: 60},
}, {
    // timestamps: true,
    versionKey: false,
    collection: 'otp',
})

module.exports = MONGOOSE.model('otp', otpSchema);