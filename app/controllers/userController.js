const otpGenerator = require('otp-generator');

const helpers = require('../helpers');
const { userModel, otpModel, productModel, wishlistModel } = require('../models');
const { MESSAGES, ERROR_TYPES } = require('../utils/constants');
const commonFunctions = require('../utils/utils');
const { dbService, sendEmail } = require('./../services')

let userController = {}

userController.login = async (payload) => {
    let user = await dbService.findOne(userModel, { email: payload.email });
    if (!user) {
        return helpers.createErrorResponse(MESSAGES.INVALID_EMAIL, ERROR_TYPES.BAD_REQUEST)
    }
    if (commonFunctions.compareHash(payload.password, user.password)) {

        return helpers.createSuccessResponse(MESSAGES.LOGGED_IN_SUCCESSFULLY, { token: commonFunctions.encryptJwt({ userId: user._id, email: user.email, user: user.name, role: user.role }) })
    } else {
        return helpers.createErrorResponse(MESSAGES.INVALID_PASSWORD, ERROR_TYPES.BAD_REQUEST)
    }
}

userController.registerUser = async (payload) => {
    let result;
    await dbService.create(userModel, { name: payload.name, email: payload.email, password: commonFunctions.hashPassword(payload.password), role: payload.role })
        .then((res) => {
            let user = { userId: res._id, email: payload.email, name: payload.name }
            let otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            dbService.create(otpModel, { userId: user.userId, otp })
            sendEmail(user.email, otp)
            result = helpers.createSuccessResponse(MESSAGES.OTP_SENT_TO_YOUR_EMAIL, { ...user })
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

userController.verifyUser = async (payload) => {
    let user = await dbService.findOne(userModel, { _id: payload.userId });
    let otp = await otpModel.findOne({ userId: payload.userId }, { otp: 1 }).sort({ createdAt: -1 });
    if (user && otp.otp === payload.otp) {
        await dbService.findOneAndUpdate(userModel, { _id: payload.userId }, { isVerified: true })
        let token = commonFunctions.encryptJwt({ userId: user._id, email: user.email, user: user.name, role: user.role });
        return helpers.createSuccessResponse(MESSAGES.EMAIL_VERIFIED, { token })
    }
    else {
        return helpers.createErrorResponse(MESSAGES.OTP_INVALID, ERROR_TYPES.BAD_REQUEST)
    }
}

userController.updateUser = async (payload) => {
    let query = { _id: payload.user.userId }
    let doc = {
        $set: {
            address: payload.address
        }
    }
    let result
    await userModel.findOneAndUpdate(query, doc, { new: true })
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.USER_UPDATED_SUCCESSFULLY, { ...res._doc })
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

userController.getProfile = async (payload) => {
    let userId = payload.user.userId;
    let user = await dbService.findOne(userModel, { _id: userId }, { password: 0 });
    if (user) {
        return helpers.createSuccessResponse(MESSAGES.SUCCESS, user)
    }
    return helpers.createErrorResponse(MESSAGES.NO_USER_FOUND, ERROR_TYPES.DATA_NOT_FOUND)
}

userController.wishlistItem = async (payload) => {
    let userId = payload.user.userId;
    let productId = payload.productId;
    let result;
    await dbService.find(wishlistModel, { userId, productId })
        .then(async (res) => {
            if (res.length > 0) {
                await wishlistModel.deleteOne({ userId, productId })
                result = helpers.createSuccessResponse(MESSAGES.REMOVED_FROM_WISHLIST, res)
            } else {
                await dbService.create(wishlistModel, { userId, productId })
                result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res)
            }

        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

userController.getWishlist = async (payload) => {
    let userId = payload.user.userId;
    let wishlist, result;

    await wishlistModel.find({ userId }, { _id: 0, productId: 1, })
        .populate('productId')
        .then((res) => {
            wishlist = []
            res.forEach((item) => {
                wishlist.push(item.productId)
            })
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, wishlist)
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

module.exports = userController