const { Schema } = require('mongoose');
const helpers = require('../helpers');
const { dbService } = require('../services');
const { MESSAGES, ERROR_TYPES } = require('../utils/constants');
const { reviewModel } = require('./../models')

let reviewController = {}

reviewController.addReview = async (payload) => {
    let result;
    await dbService.create(reviewModel, { userId: payload.user.userId, product: payload.productId, rating: payload.rating, review: payload.review })
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.REVIEW_ADDED)
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

reviewController.getReview = async (payload) => {
    let result;
    await reviewModel.find({ product: payload.productId }).populate('userId', 'name email')
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res)
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

module.exports = reviewController