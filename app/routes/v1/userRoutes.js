'use strict';

const { Joi } = require('../../utils/joiUtils');
const { userController } = require('../../controllers');

module.exports = [
    {
        method: 'POST',
        path: '/user/register',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'register a new user',
            model: 'UserRegister',
            body: {
                name: Joi.string().required(),
                email: Joi.string().email().required().isValidEmail(),
                mobile: Joi.string().required(),
                password: Joi.string().required(),
                role: Joi.string().valid('user', 'admin'),
            }
        },
        handler: userController.registerUser
    },
    {
        method: 'POST',
        path: '/user/login',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'login a user',
            model: 'UserLogin',
            body: {
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            }
        },
        handler: userController.login
    },
    {
        method: 'POST',
        path: '/user/verify',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'verify a user',
            model: 'UserVerify',
            body: {
                otp: Joi.string().required().length(6),
                userId: Joi.string().required()
            }
        },
        handler: userController.verifyUser
    },
    {
        method: 'GET',
        path: '/user/profile',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'user',
            description: 'get user profile',
            model: 'UserProfile',
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: userController.getProfile
    },
    {
        method: 'PUT',
        path: '/user',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'user',
            description: 'update user profile',
            model: 'UserProfile',
            headers: {
                authorization: Joi.string().required()
            },
            body: {
                name: Joi.string(),
                mobile: Joi.string(),
                address: Joi.object({
                    houseNo: Joi.string().required(),
                    area: Joi.string().required(),
                    city: Joi.string().required(),
                    state: Joi.string().required(),
                    pincode: Joi.number().required()
                }).required()
            }
        },
        handler: userController.updateUser
    },
    {
        method: 'POST',
        path: '/user/wishlist',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'wishlist',
            description: 'add product to wishlist',
            model: 'addToWishlist',
            headers: {
                authorization: Joi.string().required()
            },
            body: {
                productId: Joi.string().required()
            }
        },
        handler: userController.wishlistItem
    },
    {
        method: 'GET',
        path: '/user/wishlist',
        auth: true,
        adminAuth: false,
        joiSchemaForSwagger: {
            group: 'wishlist',
            description: 'get wishlist',
            model: 'Wishlist',
            query: {
                pageNo: Joi.number(),
                limit: Joi.number().default(5)
            },
            headers: {
                authorization: Joi.string().required()
            },
        },
        handler: userController.getWishlist
    }
];