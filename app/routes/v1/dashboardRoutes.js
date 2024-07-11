'use strict';

const { dashboardController } = require('../../controllers');
const { Joi } = require('../../utils/joiUtils');

module.exports = [
    {
        method: 'GET',
        path: '/dashboard/statics',
        auth: true,
        adminAuth: true,
        joiSchemaForSwagger: {
            group: 'dashboard',
            description: 'Get Statics',
            model: 'statics',
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: dashboardController.getStatics
    },
    {
        method: 'GET',
        path: '/dashboard/outOfStock',
        auth: true,
        adminAuth: true,
        joiSchemaForSwagger: {
            group: 'dashboard',
            description: 'Get Out of Stock Products',
            model: 'outOfStock',
            headers: {
                authorization: Joi.string().required()
            },
            query: {
                pageNo: Joi.number().required(),
                limit: Joi.number().default(4)
            }
        },
        handler: dashboardController.outOfStockProducts
    },
    {
        method: 'GET',
        path: '/dashboard/maxorder',
        auth: true,
        adminAuth: true,
        joiSchemaForSwagger: {
            group: 'dashboard',
            description: 'Get Products with max order',
            model: 'max order',
            headers: {
                authorization: Joi.string().required()
            },
            query: {
                pageNo: Joi.number().required(),
                limit: Joi.number().default(4)
            }
        },
        handler: dashboardController.productWithMaxOrders
    },
    {
        method: 'GET',
        path: '/dashboard/pendingOrders',
        auth: true,
        adminAuth: true,
        joiSchemaForSwagger: {
            group: 'dashboard',
            description: 'Get pending order',
            model: 'pending order',
            headers: {
                authorization: Joi.string().required()
            },
            query: {
                pageNo: Joi.number().required(),
                limit: Joi.number().default(4)
            }
        },
        handler: dashboardController.pendingOrders
    }
]