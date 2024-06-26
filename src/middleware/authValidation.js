const Joi = require('joi');


exports.jois = {
    loginPayload: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().label("password").required(),
    }),

    registerPayload: Joi.object().keys({
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        contact: Joi.string().required(),
        password: Joi.string().required().min(8),

        google_signup: Joi.string(),
        latitude: Joi.string(),
        longitude: Joi.string(),
        role: Joi.string(),
        photo: Joi.string(),
        address: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        experience: Joi.string()
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
        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .error(errors => {
                return errors.map(error => {
                    switch (error.type) {
                        case 'any.empty':
                            return { message: 'Confirm password is required' };
                        case 'any.only':
                            return { message: 'Passwords do not match' };
                        default:
                            return error;
                    }
                });
            })
    }),




}
