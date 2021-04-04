const { User } = require('../dataBase/models');
const { authService } = require('../service');
const { successMessage } = require('../message');

module.exports = {
    authUser: async (req, res, next) => {
        try {
            const { user, body: { password } } = req;

            await authService.createTokens(password, user);

            res.json(successMessage.USER_LOGGED);
        } catch (e) {
            next(e);
        }
    },

    createNewTokens: async (req, res, next) => {
        try {
            const { badTokens } = req;

            await authService.refreshTokens(badTokens);

            res.json(successMessage.TOKENS_REFRESHED);
        } catch (e) {
            next(e);
        }
    },

    activateAccount: async (req, res, next) => {
        try {
            const { activationToken } = req;

            await User.findOneAndUpdate({ token: activationToken }, { status: 'Active' });

            res.json(successMessage.USER_ACTIVATED);
        } catch (e) {
            next(e);
        }
    }

};
