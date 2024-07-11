const helpers = require('../helpers');
const { orderDetailsModel, userModel, productModel } = require('../models');
const { MESSAGES, ERROR_TYPES } = require('../utils/constants');
const { dbService } = require('./../services');


let dashboardController = {};

dashboardController.getStatics = async () => {
    let result;
    try {
        let productCount = await dbService.count(productModel);
        let userCount = await dbService.count(userModel);
        let sales = await orderDetailsModel.aggregate([
            {
                $set: {
                    discount: {
                        $subtract: [100, "$discount"]
                    }
                }
            },
            {
                $set: {
                    amount: {
                        $multiply: ["$mrp", "$discount", 0.01, "$quantity"]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalMoney: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $project: {
                    _id: 0
                }
            },
        ]);

        result = helpers.createSuccessResponse(MESSAGES.SUCCESS, { userCount, sales: sales[0].totalMoney, productCount });

    } catch (err) {
        result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
    }
    return result;
}

dashboardController.outOfStockProducts = async (payload) => {
    let result;
    try {
        let count = await dbService.count(productModel, { totalQuantity: { $lte: 5 } });
        let products = await productModel.aggregate([
            {
                $match: {
                    $expr: {
                        $lte: ["$totalQuantity", 5]
                    }
                }
            },
            {
                $sort: {
                    totalQuantity: 1
                }
            },
            {
                $skip: payload.pageNo * payload.limit
            },
            {
                $limit: payload.limit
            }
        ])

        result = helpers.createSuccessResponse(MESSAGES.SUCCESS, { products, count });
    } catch (err) {
        console.log("error in out of stock", err);
        result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST);
    }
    return result;
}

dashboardController.productWithMaxOrders = async (payload) => {
    let res, result;
    try {
        res = await orderDetailsModel.aggregate([
            {
                $group: {
                    _id: "$productId",
                    orderQuantity: {
                        $sum: "$quantity"
                    }
                }
            },
            {
                $sort: {
                    orderQuantity: -1
                }
            },
            {

                $project: {
                    _id: 0,
                    product: "$_id",
                    orderQuantity: 1,
                }
            },
            {
                $skip: payload.pageNo * payload.limit
            },
            {
                $limit: payload.limit
            }
        ])

        res = await orderDetailsModel.populate(res, { path: "product", model: productModel, select: " imageUrl name mrp discount totalQuantity" })
        result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res);
    } catch (err) {
        result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST);
    }
    return result;
}
dashboardController.pendingOrders = async (payload) => {
    let result;

    try {
        let count = await dbService.count(orderDetailsModel, { status: "pending" })
        let orders = await orderDetailsModel.aggregate([
            {
                $match: {
                    status: "pending"
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: payload.pageNo * payload.limit
            },
            {
                $limit: payload.limit
            }
        ]);

        await orderDetailsModel.populate(orders, { path: "productId", model: productModel })

        result = helpers.createSuccessResponse(MESSAGES.SUCCESS, { product: orders, count });
    } catch (err) {
        result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST);
    }

    return result;
}

module.exports = dashboardController;