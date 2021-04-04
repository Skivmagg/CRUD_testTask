const { Schema, model } = require('mongoose');

const { dataBaseTablesEnum: { USER } } = require('../../constant');

const userSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    status: { type: String, default: 'Pending'},
    isDeleted: { type: Boolean, default: false},
    token: { type: String, required: false},
    resetPasswordToken: { type: String, required: false}
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = model(USER, userSchema);
