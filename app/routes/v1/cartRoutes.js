'use strict';

const { Joi } = require('../../utils/joiUtils');
const { cartController } = require('./../../controllers')

module.exports = [
    {
        method: 'POST',
        path: '/cart',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'cart',
            description: 'Add product to cart',
            model: 'AddProductToCart',
            body: {
                productId: Joi.string().required(),
                quantity: Joi.number()
            },
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: cartController.addToCart
    },
    {
        method: 'GET',
        path: '/cart',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'cart',
            description: 'get cart details',
            model: 'Cart',
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: cartController.getCartData
    }
]