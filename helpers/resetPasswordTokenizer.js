const jwt = require('jsonwebtoken');
const { JWT_RESET_SECRET } = require('../config/config');

module.exports = () => {
    const reset_token = jwt.sign({}, JWT_RESET_SECRET, { expiresIn: '10m' });

    return reset_token;
};
