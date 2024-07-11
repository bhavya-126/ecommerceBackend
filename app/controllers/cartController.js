const helpers = require('../helpers');
const { MESSAGES, ERROR_TYPES } = require('../utils/constants');
const { cartModel } = require('./../models')
const { dbService } = require('./../services')

let cartController = {};

cartController.addToCart = async (payload) => {
    let result;

    await dbService.create(cartModel, { userId: payload.user.userId, productId: payload.productId, quantity: payload.quantity })
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS)
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

cartController.getCartData = async (payload) => {
    let result;
    await cartModel.find({ userId: payload.user.userId }, { _id: 0, productId: 1, quantity: 1 }).populate('productId', { name: 1, mrp: 1, discount: 1, imageUrl: 1, totalQuantity: 1 })

        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res)
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

cartController.updateCart = async (payload) => {
    let result;
    await cartModel.updateOne( { productId: payload.productId, userId: payload.user.userId }, { quantity: payload.quantity })
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res)
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

cartController.deleteCartItem = async (payload) => {
    let result;
    await dbService.deleteOne(cartModel, { productId: payload.productId, userId: payload.user.userId })
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res)
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

module.exports = cartController;