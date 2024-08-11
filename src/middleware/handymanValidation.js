const Joi = require('joi');

exports.jois = {
    // Handyman module API's payload validation
    addHandymansPayload: Joi.object().keys({
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        contact: Joi.string().required(),
        password: Joi.string().required().min(8),

        google_signup: Joi.string().allow(''),
        latitude: Joi.string().allow(''),
        longitude: Joi.string().allow(''),
        photo: Joi.string().allow(''),
        address: Joi.string().allow(''),
        city: Joi.string().allow(''),
        state: Joi.string().allow(''),
        country: Joi.string().allow(''),
        experience: Joi.string().allow('')
    }),

    editHandymansPayload: Joi.object().keys({
        user_id: Joi.number().required(),
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        contact: Joi.string().required(),
        password: Joi.string().required().min(8),

        google_signup: Joi.string().allow(''),
        latitude: Joi.string().allow(''),
        longitude: Joi.string().allow(''),
        photo: Joi.string().allow(''),
        address: Joi.string().allow(''),
        city: Joi.string().allow(''),
        state: Joi.string().allow(''),
        country: Joi.string().allow(''),
        experience: Joi.string().allow('')
    }),

    activateDeactivateHandymanPayload: Joi.object().keys({
        handyman_user_id: Joi.number().required(),
    }),

    handyManEarningInsightPayload: Joi.object().keys({
        handyman_user_id: Joi.number().required(),
    }),
}