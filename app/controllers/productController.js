const Mongoose = require('mongoose')
const helpers = require('../helpers')
const { dbService } = require('../services')
const { ERROR_TYPES, MESSAGES } = require('../utils/constants')
const { productModel, categoryModel } = require('./../models')
const { pipeline } = require('nodemailer/lib/xoauth2')

const productController = {}
const getProdPipeline = (userId) => {
    return [
        {
            $lookup: {
                from: "wishlist",
                let: { product_Id: "$_id", userId: Mongoose.Types.ObjectId(userId) },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$$product_Id", "$productId"] },
                                    { $eq: ["$userId", "$$userId",], }
                                ]
                            }
                        }
                    }
                ],
                as: "wishlist"
            }
        },
        {
            $lookup: {
                from: "cart",
                let: { product_Id: "$_id", userId: Mongoose.Types.ObjectId(userId) },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$$product_Id", "$productId"] },
                                    { $eq: ["$userId", "$$userId",], }
                                ]
                            }
                        }
                    }
                ],
                as: "inCart"
            }
        },
        {
            $lookup: {
                from: "category",
                let: { category_Id: "$category" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$$category_Id", "$_id"]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            name: 1
                        }
                    },
                ],
                as: "category"
            },

        },
        {
            $unwind: "$category"
        },
        {
            $project: {
                name: 1,
                mrp: 1,
                discount: 1,
                category: { $cond: [1, '$category.name', ''] },
                description: 1,
                imageUrl: 1,
                details: 1,
                wishlist: {
                    $cond: {
                        if: {
                            $arrayElemAt: ["$wishlist", 0]
                        },
                        then: true,
                        else: false
                    }
                },
                inCart: {
                    $cond: {
                        if: {
                            $arrayElemAt: ["$inCart", 0]
                        },
                        then: true,
                        else: false
                    }
                },
            }
        }
    ]
}
let matchTxtPipeline = (searchText) => {
    return [
        {
            $match: {

                $or: [
                    {
                        name: { $regex: searchText, $options: "i" }
                    },
                    {
                        description: { $regex: searchText, $options: "i" }
                    },
                    {
                        details: { $regex: searchText, $options: "i" }
                    },
                    {
                        category: { $regex: searchText, $options: "i" }
                    },
                ]

            }
        }
    ]
}

productController.addCategory = async (payload) => {
    let result;
    await dbService.create(categoryModel, { name: payload.name })
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, { categoryId: res._id })
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

productController.getCategory = async (payload) => {
    let result;
    await dbService.find(categoryModel, {}, { name: 1 })
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res)
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

productController.uploadImage = async (payload) => {

    if (payload.file.filename)
        return helpers.createSuccessResponse(MESSAGES.FILE_UPLOADED_SUCCESSFULLY, { filePath: payload.file.path })
    return helpers.createErrorResponse(MESSAGES.FILE_REQUIRED_IN_PAYLOAD, ERROR_TYPES.BAD_REQUEST)
}

productController.addProduct = async (payload) => {
    let result;
    await dbService.create(productModel, { name: payload.name, mrp: payload.mrp, discount: payload.discount, description: payload.description, category: payload.category, details: payload.details, category: payload.category, imageUrl: payload.imageUrl, totalQuantity: payload.totalQuantity })
        .then((res) => {
            result = helpers.createSuccessResponse(MESSAGES.SUCCESS, { productId: res._id })
        })
        .catch((err) => {
            result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
        })
    return result;
}

productController.getProducts = async (payload) => {
    let result;
    let user = payload.user;
    let search = payload.searchTxt;
    let pipeline = getProdPipeline(user.userId)
    if (user.role == 'admin') {
        await dbService.find(productModel)
            .then((res) => {
                result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res)
            })
            .catch((err) => {
                result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
            })
    } else if (search) {
        await productModel.aggregate([...matchTxtPipeline(search), ...pipeline])
            .then((res) => {
                result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res)
            })
            .catch((err) => {
                result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
            })
    } else {
        await productModel.aggregate(pipeline)
            .then((res) => {
                result = helpers.createSuccessResponse(MESSAGES.SUCCESS, res)
            })
            .catch((err) => {
                result = helpers.createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
            })
    }
    return result;

}

productController.searchProduct = async (payload) => {
    let result;
    let user = payload.user;
    let search = payload.search;

    return result;
}

module.exports = productController