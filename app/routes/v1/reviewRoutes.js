'use strict';

const { Joi } = require('../../utils/joiUtils');
const { reviewController } = require('../../controllers');

module.exports = [
    {
        method: 'POST',
        path: '/review',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'review',
            description: 'add new review',
            model: 'AddReview',
            headers: {
                authorization: Joi.string().required()
            },
            query: {
                productId: Joi.string().required()
            },
            body: {
                rating: Joi.number().required(),
                review: Joi.string().required()
            }
        },
        handler: reviewController.addReview
    },
    {
        method: 'GET',
        path: '/review',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'review',
            description: 'get all review',
            model: 'getReview',
            headers: {
                authorization: Joi.string().required()
            },
            query: {
                productId: Joi.string().required()
            }
        },
        handler: reviewController.getReview
    },
]