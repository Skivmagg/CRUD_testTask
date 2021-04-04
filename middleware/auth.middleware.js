const jwt = require('jsonwebtoken');

const { constants } = require('../constant');
const { errorCodesEnum } = require('../constant');
const { O_Auth, User } = require('../dataBase/models');
const { JWT_SECRET, JWT_REFRESH_SECRET, JWT_ACTIVATION_SECRET } = require('../config/config');
const ErrorHandler = require('../error/ErrorHandler');
const { errorMessage } = require('../message');

module.exports = {
    checkAccessTokenMiddleware: async (req, res, next) => {
        try {
            const access_token = req.get(constants.AUTHORIZATION);

            if (!access_token) {
                throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                    errorMessage.TOKEN_IS_REQUIRED.customCode,
                    errorMessage.TOKEN_IS_REQUIRED.message);
            }

            jwt.verify(access_token, JWT_SECRET, (err) => {
                if (err) {
                    throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                        errorMessage.TOKEN_NOT_VALID.customCode,
                        errorMessage.TOKEN_NOT_VALID.message);
                }
            });

            const tokens = await O_Auth.findOne({ access_token }).populate('user');

            if (!tokens) {
                throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                    errorMessage.TOKEN_IS_REQUIRED.customCode,
                    errorMessage.TOKEN_IS_REQUIRED.message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkRefreshTokenMiddleware: async (req, res, next) => {
        try {
            const refresh_token = req.get(constants.AUTHORIZATION);

            if (!refresh_token) {
                throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                    errorMessage.TOKEN_IS_REQUIRED.customCode,
                    errorMessage.TOKEN_IS_REQUIRED.message);
            }

            jwt.verify(refresh_token, JWT_REFRESH_SECRET, (err) => {
                if (err) {
                    throw new ErrorHandler(errorCodesEnum.UNAUTHORIZED,
                        errorMessage.TOKEN_NOT_VALID.customCode,
                        errorMessage.TOKEN_NOT_VALID.message);
                }
            });

            const tokens = await O_Auth.findOne({ refresh_token });

            if (!tokens) {
                throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                    errorMessage.TOKEN_IS_REQUIRED.customCode,
                    errorMessage.TOKEN_IS_REQUIRED.message);
            }

            req.badTokens = tokens;

            next();
        } catch (e) {
            next(e);
        }
    },

    isUserExist: async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({email, isDeleted: false});

            if (!user || user.isDeleted) {
                throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                    errorMessage.USER_NOT_FOUND.customCode,
                    errorMessage.USER_NOT_FOUND.message);
            }

            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },

    isUserActive: async (req, res, next) => {
        try {
            const { user } = req;

            if (user.status === 'Pending') {
                throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                    errorMessage.USER_NOT_ACTIVATED.customCode,
                    errorMessage.USER_NOT_ACTIVATED.message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkActivationToken: async (req, res, next) => {
        try {
            const { activationToken } = req.params;

            jwt.verify(activationToken, JWT_ACTIVATION_SECRET, (err) => {
                if (err) {
                    throw new ErrorHandler(errorCodesEnum.UNAUTHORIZED,
                        errorMessage.ACTIVATION_TOKEN_NOT_VALID.customCode,
                        errorMessage.ACTIVATION_TOKEN_NOT_VALID.message);
                }
            });

            req.activationToken = activationToken;

            next();
        } catch (e) {
            next(e);
        }
    }

};
