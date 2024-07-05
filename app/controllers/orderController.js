const MONGOOSE = require('mongoose');

const helpers = require('../helpers');
const { MESSAGES, ERROR_TYPES } = require('../utils/constants');
const { dbService } = require('./../services')
const { orderModel, orderDetailsModel } = require('./../models')

let orderController = {};
const orderPipeline = (userId) => {
    return [

        {
            $match: {
                "userId": MONGOOSE.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "orderDetail",
                let: { orderId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$$orderId", "$orderId"]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            orderId: 0

                        }
                    }
                ],
                as: "items"
            }
        }
    ]
}

orderController.placeOrder = async (payload) => {
    let result;
    await dbService.create(orderModel, { userId: payload.user.userId })
        .then((res) => {
            payload.items.map(async (item) => {
                await dbService.create(orderDetailsModel, { ...item, orderId: res._id })
            })
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, { orderId: res._id });

        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

orderController.getOrderHistory = async (payload) => {
    let result;
    await orderModel.aggregate(orderPipeline(payload.user.userId))
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res);
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

module.exports = orderController