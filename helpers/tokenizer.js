const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config/config');

module.exports = () => {
    const access_token = jwt.sign({}, JWT_SECRET, { expiresIn: '1d' });
    const refresh_token = jwt.sign({}, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return {
        access_token,
        refresh_token
    };
};
