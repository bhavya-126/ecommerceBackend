'use strict';

const { API_AUTH_KEY } = require('../../config');
const CONFIG = require('../../config');
const { decryptJwt } = require('../utils/utils');
const { createErrorResponse } = require('../helpers');
const dbService = require('./dbService');
const { conversationRoomModel, sessionModel, userModel } = require('../models');
const {
    MESSAGES, ERROR_TYPES, NORMAL_PROJECTION, TOKEN_TYPES
} = require('../utils/constants');
const CONSTANTS = require('../utils/constants');
const helpers = require('../helpers');
const commonFunctions = require('../utils/utils');


const authService = {};

authService.authenticateUser = (adminAuth) => (req, res, next) => {
    try {
        let token = req.headers['authorization']?.split(' ')[1];
        let result = commonFunctions.decryptJwt(token);
        req.user = result;
        if (adminAuth && req.user.role !== 'admin') {
            return res.status(403).json(helpers.createErrorResponse(MESSAGES.FORBIDDEN, ERROR_TYPES.FORBIDDEN))
        }
        next()
    }
    catch (err) {
        res.status(401).json(createErrorResponse(err.message, ERROR_TYPES.UNAUTHORIZED))
    }
}


/*
 * function to authenticate socket token
 */
authService.socketAuthentication = async (socket, next) => {
    try {
        const session = await decryptJwt(socket.handshake.query.authorization);
        if (!session) {
            return next({ success: false, message: MESSAGES.UNAUTHORIZED });
        }

        const user = await dbService.findOne(userModel, { _id: session.userId }, NORMAL_PROJECTION);
        if (!user) {
            return next({ success: false, message: MESSAGES.UNAUTHORIZED });
        }
        const userId = session.userId.toString();
        socket.join(userId); // -- user to join room
        socket.userId = userId;

        const groupData = await dbService.find(conversationRoomModel, { 'members.userId': { $eq: socket.userId } });
        if (!groupData) {
            return ({ success: false, message: MESSAGES.NOT_FOUND });
        }

        for (let i = 0; i < groupData.length; i++) {
            socket.join(groupData[i].uniqueCode);
        }

        return next();
    } catch (err) {
        return next({ success: false, message: MESSAGES.SOMETHING_WENT_WRONG });
    }
};

module.exports = authService;
