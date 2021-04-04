const fs = require('fs-extra').promises;

const { emailActionsEnum } = require('../constant');
const { passwordHasher } = require('../helpers');
const { activationTokenizer, resetPasswordTokenizer } = require('../helpers');
const { userService, mailService, fileService } = require('../service');
const { successMessage } = require('../message');

module.exports = {
     createUser: async (req, res, next) => {
        try {
            const {
                body: { password, email, username },
                avatar
            } = req;

            const hashPassword = await passwordHasher.hash(password);
            const activationToken = await activationTokenizer();

            const user = await userService.createUser({ ...req.body, password: hashPassword, token: activationToken});

            if (avatar) {
                const {
                    uploadPath,
                    finalFilePath,
                    fileDir
                } = fileService.fileDirBuilder(avatar.name, 'photos', user._id, 'user');

                await fs.mkdir(fileDir, { recursive: true });
                await avatar.mv(finalFilePath);

                await userService.updateUserById(user._id, { avatar: uploadPath });
            }

            await mailService.sendMail(email, emailActionsEnum.ACTIVATION, { userName: username, token: activationToken });

            res.json(successMessage.USER_CREATED);
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const {
                body: { password },
                params: { userId },
                avatar,
                user
            } = req;

            const hashPassword = await passwordHasher.hash(password);

            if (avatar) {
                await fileService.deleteFile(user.avatar);
                const {
                    uploadPath,
                    finalFilePath,
                    fileDir
                } = fileService.fileDirBuilder(avatar.name, 'photos', user._id, 'user');

                await fs.mkdir(fileDir, { recursive: true });
                await avatar.mv(finalFilePath);

                await userService.updateUserById(user._id, { avatar: uploadPath });
            }

            await userService.updateUserById(userId, { ...req.body, password: hashPassword });

            res.json(successMessage.USER_UPDATED);
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const {
                user
            } = req;

            await userService.updateUserById(user._id, {user, isDeleted: true});

            res.json(successMessage.USER_DELETED);
        } catch (e) {
            next(e);
        }
    },

    forgotPassword: async (req, res, next) => {
        try {
            const {
                body: { email },
            } = req;
            const user = await userService.findUser({ email, isDeleted: false });

            const resetPasswordToken = resetPasswordTokenizer();

            await userService.updateUserById(user._id, {user, resetPasswordToken});

            await mailService.sendMail(email, emailActionsEnum.RESETPASSWORD, { userName: user.username, token: resetPasswordToken });

            res.json(successMessage.PASSWORD_RESET_EMAIL_SENT);
        } catch (e) {
            next(e);
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            const { user, body: { newPassword } } = req;

            const newPass = await passwordHasher.hash(newPassword);

            await userService.updateUserById(user._id, {user, password: newPass, resetPasswordToken: null});

            res.json(successMessage.RESET_DONE);
        } catch (e) {
            next(e);
        }
    }
};
