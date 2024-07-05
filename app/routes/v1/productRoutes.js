'use strict';

const { Joi } = require('../../utils/joiUtils');
const { productController } = require('../../controllers');

module.exports = [
    {
        method: 'POST',
        path: '/product/addCategory',
        auth: true,
        adminAuth: true,
        joiSchemaForSwagger: {
            headers: {
                authorization: Joi.string().required()
            },
            body: {
                name: Joi.string().required(),
            }
        },
        handler: productController.addCategory
    },
    {
        method: 'GET',
        path: '/product/categories',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: productController.getCategory
    },
    {
        method: 'POST',
        path: '/product/add',
        auth: true,
        adminAuth: true,
        joiSchemaForSwagger: {
            group: 'product',
            description: 'add new Product',
            model: 'AddProduct',
            body: {
                name: Joi.string().required(),
                mrp: Joi.number().required(),
                discount: Joi.number().required(),
                description: Joi.string().required(),
                details: Joi.string(),
                imageUrl: Joi.string().required(),
                category: Joi.string().required(),
                totalQuantity: Joi.number().required(),
            }
        },
        handler: productController.addProduct
    },
    {
        method: 'POST',
        path: '/product/image',
        auth: true,
        adminAuth: true,
        joiSchemaForSwagger: {
            group: 'product',
            description: 'add image to product',
            model: 'AddImage',
            formData: {
                file: {
                    productImage: 1
                }
            }
        },
        handler: productController.uploadImage
    },
    {

        method: 'GET',
        path: '/product',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'product',
            description: 'get Product',
            model: 'Product',
            headers: {
                authorization: Joi.string().required()
            },
            body: {
                searchTxt: Joi.string()
            }
        },
        handler: productController.getProducts
    },
]