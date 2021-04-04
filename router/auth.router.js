const router = require('express').Router();

const { authController } = require('../controller');
const { authMiddleware } = require('../middleware');

router.post('/',
    authMiddleware.isUserExist,
    authMiddleware.isUserActive,
    authController.authUser);

router.post('/activate/:activationToken',
    authMiddleware.checkActivationToken,
    authController.activateAccount)

router.post('/refresh',
    authMiddleware.checkRefreshTokenMiddleware,
    authController.createNewTokens);

module.exports = router;
