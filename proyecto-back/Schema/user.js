const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../auth/generateTokens');
const getUserInfo = require('../lib/getUserInfo');
const Token = require('../Schema/token');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

UserSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew) {
        const document = this;
        bcrypt.hash(document.password, 10, (err, hash) => {
            if (err) {
                return next(err);
            } else {
                document.password = hash;
                next();
            }
        });
    } else {
        next();
    }
});

UserSchema.statics.usernameExists = async function(username) {
    const result = await this.findOne({ username });
    return result !== null;
};

UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.createAccessToken = function() {
    return generateAccessToken(getUserInfo(this));
};

UserSchema.methods.createRefreshToken = async function() {
    const refreshToken = generateRefreshToken(getUserInfo(this));
    try {
        await new Token({ token: refreshToken }).save();
        return refreshToken;
    } catch (error) {
        console.error(error);
        throw new Error('Error al crear el token de actualización');
    }
};

module.exports = mongoose.model('User', UserSchema);
