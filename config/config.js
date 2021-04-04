module.exports = {
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/test',
    JWT_SECRET: process.env.JWT_SECRET || 'SECRET',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'REFRESH SECRET',
    JWT_ACTIVATION_SECRET: process.env.JWT_ACTIVATION_SECRET || 'ACTIVATION SECRET',
    JWT_RESET_SECRET: process.env.JWT_RESET_SECRET || 'JWT_RESET_SECRET',
    PORT: 5000,

    ROOT_EMAIL: process.env.ROOT_EMAIL || 'test@gmail.com',
    ROOT_EMAIL_PASSWORD: process.env.ROOT_EMAIL_PASSWORD || 'QWERTY'
};
