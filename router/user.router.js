const router = require('express').Router();

const userController = require('../controller/user.controller');
const { userMiddlewares, fileMiddleware, authMiddleware } = require('../middleware');

router.post('/',
    userMiddlewares.checkIsUserValid,
    fileMiddleware.checkFileMiddleware,
    fileMiddleware.checkAvatar,
    userMiddlewares.isUserRegistered,
    userController.createUser);

router.patch('/:userId',
    userMiddlewares.checkId,
    fileMiddleware.checkFileMiddleware,
    fileMiddleware.checkAvatar,
    userMiddlewares.checkIdInBase,
    userMiddlewares.isUserRegistered,
    authMiddleware.checkAccessTokenMiddleware,
    userController.updateUser);

router.post('/forgotPassword',
    authMiddleware.checkAccessTokenMiddleware,
    userController.forgotPassword);

router.post('/forgotPassword/:resetPasswordToken',
    userMiddlewares.checkResetToken,
    userMiddlewares.checkOldPassword,
    userController.resetPassword);

router.delete('/:userId',
    userMiddlewares.checkId,
    userMiddlewares.checkIdInBase,
    authMiddleware.checkAccessTokenMiddleware,
    userController.deleteUser);

module.exports = router;
