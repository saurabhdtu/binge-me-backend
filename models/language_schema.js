const mongoose = require('mongoose')
const Joi = require('joi');
const { bool } = require('joi');

const languageJoiSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    isoCode: Joi.string().max(10).required(),
    isDeleted: Joi.bool().default(false)
})

function validateLanguage(language) {
    const { error } = languageJoiSchema.validate(language)
    console.log(language)
    return error;
}

const languageMongoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
        unique: true,
        set: v => v.toLowerCase()
    },
    isoCode: {
        type: String,
        required: true,
        maxLength: 10,
        unique: true,
        set: v => v.toLowerCase()
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const Language = mongoose.model('Language', languageMongoSchema)

exports.langValidator = validateLanguage
exports.Language = Language


