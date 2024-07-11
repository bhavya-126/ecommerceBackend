const MONGOOSE = require('mongoose');

const helpers = require('../helpers');
const { MESSAGES, ERROR_TYPES } = require('../utils/constants');
const { dbService } = require('./../services')
const { orderModel, orderDetailsModel, userModel } = require('./../models');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

let orderController = {};
const matchUserIdPipeline = (userId) => {
    return [
        {
            $match: {
                $expr: {
                    $eq: ["$userId", MONGOOSE.Types.ObjectId(userId)]
                }
            }
        },
    ]
}
const orderPipeline = (pageNo, limit) => {
    return [
        {
            $lookup: {
                from: "orderDetail",
                let: {
                    orderId: "$_id"
                },
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
                            _id: 0, orderId: 0
                        }
                    }

                ],
                as: "items"
            }
        },
        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "product",
                localField: "items.productId",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $unwind: "$product"
        },
        {
            $project: {
                userId: 0,
                product: {
                    mrp: 0,
                    discount: 0,
                    description: 0,
                    category: 0,
                    totalQuantity: 0,
                    createdAt: 0,
                    updatedAt: 0
                }
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: pageNo * limit
        },
        {
            $limit: limit
        }
    ]
}

orderController.placeOrder = async (payload) => {
    let result = helpers.createSuccessResponse(MESSAGES.SUCCESS,);
    let prodInCart, userAddress, orderId;
    cartModel.find({ userId: payload.user.userId }).populate('productId')
        .then((cartData) => {
            prodInCart = cartData;
        })
        .then(async (res) => {
            let user = await dbService.findOne(userModel, { _id: payload.user.userId });
            userAddress = user.address;
        })
        .then(async () => {
            await dbService.create(orderModel, { userId: payload.user.userId, address: userAddress })
                .then((res) => {
                    orderId = res._id;
                })
        })
        .then(() => {
            prodInCart.forEach(async (item) => {
                if (item.quantity <= item.productId.totalQuantity) {
                    await productModel.updateOne({ _id: item.productId._id }, {
                        $set: {
                            totalQuantity: item.productId.totalQuantity - item.quantity
                        }
                    })
                    await dbService.create(orderDetailsModel, { orderId: orderId, productId: item.productId._id, quantity: item.quantity, mrp: item.productId.mrp, discount: item.productId.discount, status: payload.status })
                    await dbService.deleteOne(cartModel, { userId: payload.user.userId, productId: item.productId._id })
                    result = helpers.createSuccessResponse(MESSAGES.ORDER_PLACED)
                }
                else {
                    throw new Error(MESSAGES.OUT_OF_STOCK);
                }
            });
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
            console.log("error in order", err);
        })
    return result;
}

orderController.getOrderHistory = async (payload) => {
    let result, pipeline, pageNo = Number(payload.pageNo), limit = Number(payload.limit);
    if (payload.user.role === 'admin') {
        pipeline = [{ $match: { status: 'pending' } }, ...orderPipeline(pageNo, limit),];
    } else {
        pipeline = [...matchUserIdPipeline(payload.user.userId), ...orderPipeline(pageNo, limit)]
    }
    let count = await dbService.count(orderModel, { userId: payload.user.userId })
    await orderModel.aggregate(pipeline)
        .then(async (res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, { product: res, count });
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

orderController.updateOrder = async (payload) => {
    let updateDoc = {};
    if (payload.status === 'delivered' && payload.user.role !== 'admin') {
        return helpers.createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED)
    }
    payload.status ? (updateDoc.status = payload.status) : true;
    payload.address ? (updateDoc.address = payload.address) : true;
    await orderModel.updateOne({ _id: payload.orderId }, updateDoc)
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.ORDER_UPDATED)
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

module.exports = orderController