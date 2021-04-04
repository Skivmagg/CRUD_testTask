const emailActionsEnum = require('../constant/emailActions.enum');

module.exports = {
    [emailActionsEnum.ACTIVATION]: {
        templateName: 'activation',
        subject: 'Activate your account'
    },

    [emailActionsEnum.RESETPASSWORD]: {
        templateName: 'reset',
        subject: 'Reset your password'
    }
};
