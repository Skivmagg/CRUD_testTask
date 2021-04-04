const jwt = require('jsonwebtoken');

const { JWT_RESET_SECRET } = require('../config/config');
const { errorCodesEnum } = require('../constant');
const { User } = require('../dataBase/models');
const ErrorHandler = require('../error/ErrorHandler');
const { passwordHasher } = require('../helpers');
const { errorMessage } = require('../message');
const { userValidator } = require('../validators');

module.exports = {
    checkId: async (req, res, next) => {
        try {
            const { userId } = req.params;

            const { error } = await userValidator.userIdValidator.validate(userId);

            if (error) {
                throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                    errorMessage.BAD_REQUEST.customCode,
                    errorMessage.BAD_REQUEST.message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkIdInBase: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);

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

    checkIsUserValid: (req, res, next) => {
        try {
            const { error } = userValidator.createUserValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                    errorMessage.BAD_REQUEST.customCode,
                    errorMessage.BAD_REQUEST.message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isUserRegistered: async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email, isDeleted: false });

            if (user && !user.isDeleted) {
                throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                    errorMessage.USER_IS_REGISTERED.customCode,
                    errorMessage.USER_IS_REGISTERED.message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkResetToken: async (req, res, next) => {
        try {
            const { resetPasswordToken } = req.params;

            jwt.verify(resetPasswordToken, JWT_RESET_SECRET, (err) => {
                if (err) {
                    throw new ErrorHandler(errorCodesEnum.UNAUTHORIZED,
                        errorMessage.RESET_TOKEN_NOT_VALID.customCode,
                        errorMessage.RESET_TOKEN_NOT_VALID.message);
                }
            });

            req.resetPasswordToken = resetPasswordToken;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkOldPassword: async (req, res, next) => {
        try {
            const {
                body: { password },
                resetPasswordToken } = req;

            const user = await User.findOne({ resetPasswordToken });

            passwordHasher.compare(password, user.password);

            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    }
};
