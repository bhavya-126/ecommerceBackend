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
    await dbService.find(cartModel, { userId: payload.user.userId })
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res)
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

module.exports = cartController;