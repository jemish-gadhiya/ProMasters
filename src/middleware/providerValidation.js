const Joi = require('joi');

exports.jois = {
    addEditServiceAddressPayload: Joi.object().keys({
        service_address_id: Joi.number().valid(0).required(),
        address: Joi.string().required(),
        latitude: Joi.string(),
        longitude: Joi.string(),
    }),

    deleteServiceAddressPayload: Joi.object().keys({
        service_address_id: Joi.number().required(),
    }),

    dactiveServiceAddressPayload: Joi.object().keys({
        service_address_id: Joi.number().required(),
    }),

}