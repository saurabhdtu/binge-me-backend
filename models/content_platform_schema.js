const mongoose = require('mongoose');
const Joi = require('joi');

const subscriptionPlan = Joi.object({
    name:Joi.string().optional(),
    duration: Joi.string().required(),
    cost: Joi.string().required(),
    benefits: Joi.array().items(Joi.string())
});
const contentPlatformJoiSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    subscriptionPlans: Joi.array().items(subscriptionPlan)
});

function validateContentPlatform(contentPlatform) {
    const { error } = contentPlatformJoiSchema.validate(contentPlatform);
    return error;
}
// const subscriptionSchema = new mongoose.Schema({
//     duration: {
//         type: String,
//         minLength: 2,
//         required: true
//     },
//     cost: {
//         type: String,
//         required: true
//     }
// });

const contentSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 255,
        required: true,
        unique: true
    },
    subscriptionPlans: Array
});

const ContentPlatform = mongoose.model("Content_Platform", contentSchema);
// const SubscriptionPlan = mongoose.model("Subscription_Plan", subscriptionPlan);

exports.validateContentPlatform = validateContentPlatform;
exports.ContentPlatform = ContentPlatform;
// exports.SubscriptionPlan = SubscriptionPlan;