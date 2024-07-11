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
            query: {
                pageNo: Joi.number().required(),
                limit: Joi.number().default(5)
            },
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: orderController.getOrderHistory
    },
    {
        method: 'PUT',
        path: '/order',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'order',
            description: 'update Orders',
            model: 'updateOrders',
            headers: {
                authorization: Joi.string().required()
            },
            body: {
                status: Joi.string(),
                address: Joi.object({
                    houseNo: Joi.string().required(),
                    area: Joi.string().required(),
                    city: Joi.string().required(),
                    state: Joi.string().required(),
                    pincode: Joi.number().required()
                })
            },
            query: {
                orderId: Joi.string().objectId().required()
            }
        },
        handler: orderController.updateOrder
    }
]