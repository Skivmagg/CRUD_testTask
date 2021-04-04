const jwt = require('jsonwebtoken');
const { JWT_ACTIVATION_SECRET } = require('../config/config');

module.exports = () => {
    const activation_token = jwt.sign({}, JWT_ACTIVATION_SECRET, { expiresIn: '60m' });

    return activation_token;
};
