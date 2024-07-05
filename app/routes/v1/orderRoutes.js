'use strict';

const { Joi } = require('../../utils/joiUtils');
const { orderController } = require('../../controllers');

module.exports = [
    {
        method: 'POST',
        path: '/placeOrder',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'order',
            description: 'Place Order',
            model: 'PlaceOrder',
            body: {
                items: Joi.array()
                    .items(Joi.object({
                        productId: Joi.string().required(),
                        quantity: Joi.number().required(),
                        mrp: Joi.number().required(),
                        discount: Joi.number().required()
                    }))
                    .required()
            },
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: orderController.placeOrder
    },
    {
        method: 'GET',
        path: '/order',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'order',
            description: 'Get Orders',
            model: 'GetOrders',
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: orderController.getOrderHistory
    }
]