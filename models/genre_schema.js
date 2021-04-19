const mongoose = require('mongoose')
const Joi = require('joi');
const { bool } = require('joi');

const genreSchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    isDeleted: Joi.bool().default(false)
})

function validateGenre(genre) {
    const { error } = genreSchema.validate(genre)
    console.log(genre)
    return error;
}

const genreMongooseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
        unique: true,
        set: v => v.toLowerCase()
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const Genre = mongoose.model('Genre', genreMongooseSchema)
exports.genreValidator = validateGenre;
exports.Genre = Genre;


