const EmailTemplates = require('email-templates');
const mailer = require('nodemailer');
const path = require('path');

const templateParser = new EmailTemplates({
    views: {
        root: path.join(process.cwd(), 'email-templates')
    }
});

const ErrorHandler = require('../error/ErrorHandler');
const { errorCodesEnum } = require('../constant');
const { errorMessage } = require('../message');

const { ROOT_EMAIL, ROOT_EMAIL_PASSWORD } = require('../config/config');
const templatesInfo = require('../email-templates');

const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: ROOT_EMAIL,
        pass: ROOT_EMAIL_PASSWORD
    }
});

const sendMail = async (userMail, action, context) => {
    try {
        const templateInfo = templatesInfo[action];

        if (!templateInfo) {
            throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                errorMessage.WRONG_EMAIL_ACTION.customCode,
                errorMessage.WRONG_EMAIL_ACTION.message);
        }

        const html = await templateParser.render(templateInfo.templateName, context);

        return transporter.sendMail({
            from: 'NO REPLY',
            to: userMail,
            subject: templateInfo.subject,
            html
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    sendMail
};
