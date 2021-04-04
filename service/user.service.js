const User = require('../dataBase/models/User');

module.exports = {
    findUser: (userObject) => User.findOne(userObject),

    createUser: (userObject) => User.create(userObject),

    deleteUser: (userId) => User.findByIdAndDelete(userId),

    updateUserById: (userId, updateObject) => User.updateOne({ _id: userId }, { $set: updateObject })
};
