const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userJoiSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    profileImage: Joi.string().uri(),
    socialId: Joi.string().required().min(1),
    socialToken: Joi.string().required().min(10),
    socialMethod: Joi.string().required().min(1),
    email: Joi.string().email().required(),
    countryCode: Joi.string().max(6),
    mobile: Joi.string().length(10),
    isDeleted: Joi.bool().default(false)
});

const userJoiSchemaUpdate = Joi.object({
    name: Joi.string().min(2).max(255),
    profileImage: Joi.string().uri(),
    countryCode: Joi.string().max(6),
    mobile: Joi.string().length(10),
    isDeleted: Joi.bool()
});


function validateUser(user, isUpdate) {
    const { error } = isUpdate ? userJoiSchemaUpdate.validate(user) : userJoiSchema.validate(user);
    return error;
}

const userMongoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 255
    },
    profileImage: String,
    socialId: {
        type: String,
        minLength: 10,
        required: true,
        unique: true
    },
    email: {
        type: String,
        minLength: 3,
        required: true,
        unique: true
    },
    isEmailVerified: {
        type: Boolean
    },
    countryCode: String,
    mobile: {
        type: String,
        maxLength: 10
    },
    isMobileVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: Boolean,
    isDeleted: {
        type: Boolean,
        default: false
    }
});

userMongoSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtSecretKey'));
}

const User = mongoose.model("User", userMongoSchema);


exports.validateUser = validateUser;
exports.User = User;