
const  Joi = require('joi');


exports.jois = {
    loginPayload: Joi.object().keys({
        email:Joi.string().email().required(),
        password:Joi.string().label("password").required(),
    }),
    logoutPayload: Joi.object().keys({
        token:Joi.string().required(),
    }),
    validateResetPasswordTokenPayload: Joi.object().keys({
        token:Joi.string().required(),
    }),
    forgetPasswordPayload: Joi.object().keys({
        email:Joi.string().required(),
    }),
    resetUserPasswordPayload: Joi.object().keys({
        email:Joi.string().required(),
        confirmPassword:Joi.string().required(),
        newPassword:Joi.string().required(),
    }),

    
}
