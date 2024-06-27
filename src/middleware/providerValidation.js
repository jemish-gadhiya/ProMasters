const Joi = require('joi');

exports.jois = {
    // Service address module API's payload validation
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


    // Category module API's payload validation
    addEditCategoryPayload: Joi.object().keys({
        category_id: Joi.number().valid(0).required(),
        name: Joi.string().required(),
        image: Joi.string().required(),
    }),

    deleteCategoryPayload: Joi.object().keys({
        category_id: Joi.number().required(),
    }),

    dactiveCategoryPayload: Joi.object().keys({
        category_id: Joi.number().required(),
    }),

}