const Joi = require('joi');


exports.jois = {
    loginPayload: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().label("password").required(),
        platform: Joi.string().allow(''),
        device_token: Joi.string().allow(''),
        device_info: Joi.object().allow({}).required(),
        role: Joi.number().required(),
    }),

    registerPayload: Joi.object().keys({
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        contact: Joi.string().required(),
        password: Joi.string().required().min(8),
        role: Joi.number().required(),

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

    validateOTPPayload: Joi.object().keys({
        email: Joi.string().email(),
        otp: Joi.string().required(),
        type: Joi.string().required(),
    }),

    logoutPayload: Joi.object().keys({
        token: Joi.string().required(),
    }),

    forgetPasswordPayload: Joi.object().keys({
        email: Joi.string().email().required(),
    }),

    forgotPasswordOTPCheckPayload: Joi.object().keys({
        email: Joi.string().email(),
        otp: Joi.string().required()
    }),

    resetUserPasswordPayload: Joi.object().keys({
        email: Joi.string().required(),
        newPassword: Joi.string().required(),
        confirmPassword: Joi.string().required()
    }),

    resendEmailOTPPayload: Joi.object().keys({
        email: Joi.string().email().required(),
    }),

    resendSMSOTPPayload: Joi.object().keys({
        email: Joi.string().email().required(),
        contact: Joi.string().required(),
    }),

    addEditServiceTaxPayload: Joi.object().keys({
        tax_id: Joi.number().allow(0).required(),
        tax_name: Joi.string().required(),
        tax_amount: Joi.number().allow(0).required(),
        tax_amount_type: Joi.number().required(),
    }),

    deleteServiceTaxPayload: Joi.object().keys({
        tax_id: Joi.number().required()
    }),


    addEditComissionPayload: Joi.object().keys({
        comission_id: Joi.number().allow(0).required(),
        description: Joi.string().required(),
        comission_amount: Joi.number().allow(0).required(),
        comission_amount_type: Joi.number().required(),
    }),

    deleteComissionPayload: Joi.object().keys({
        comission_id: Joi.number().required()
    }),


    addEditProviderComissionPayload: Joi.object().keys({
        comission_id: Joi.number().required(),
        provider_id: Joi.number().required()
    }),
}
