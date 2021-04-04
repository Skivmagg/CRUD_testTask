const { O_Auth } = require('../dataBase/models');
const { passwordHasher, tokenizer } = require('../helpers');

module.exports = {
    createTokens: async (password, user) => {
        await passwordHasher.compare(password, user.password);

        const tokens = tokenizer();

        await O_Auth.create({ ...tokens, user: user._id });

        return tokens;
    },

    refreshTokens: async (badTokens) => {
        await O_Auth.findByIdAndRemove(badTokens._id);

        const tokens = tokenizer();

        await O_Auth.create({ ...tokens, user: badTokens._user_id });

        return tokens;
    }
};
