const Joi = require('joi');

exports.jois = {
    // Service address module API's payload validation
    addEditServiceAddressPayload: Joi.object().keys({
        service_address_id: Joi.number().allow(0).required(),
        address: Joi.string().required(),
        latitude: Joi.string(),
        longitude: Joi.string(),
    }),

    deleteServiceAddressPayload: Joi.object().keys({
        service_address_id: Joi.number().required(),
    }),

    deactiveServiceAddressPayload: Joi.object().keys({
        service_address_id: Joi.number().required(),
    }),


    // Category module API's payload validation
    addEditCategoryPayload: Joi.object().keys({
        category_id: Joi.number().allow(0).required(),
        name: Joi.string().required(),
        image: Joi.string().required(),
    }),

    getCategoryByIdPayload: Joi.object().keys({
        category_id: Joi.number().required(),
    }),

    deleteCategoryPayload: Joi.object().keys({
        category_id: Joi.number().required(),
    }),

    deactiveCategoryPayload: Joi.object().keys({
        category_id: Joi.number().required(),
    }),

    purchaseSubscriptionForProviderPayload: Joi.object().keys({
        subscription_plan_id: Joi.number().required(),
        due_date: Joi.string().required(),
        payment_type: Joi.string().required(),
        card_details: Joi.string().required(),
    }),


    changeServiceProgressStatusPayload: Joi.object().keys({
        service_booking_id: Joi.number().required(),
        status: Joi.number().allow(0).required(),
    }),


    servicePaymentFromUserPayload: Joi.object().keys({
        service_booking_id: Joi.number().required(),
    }),

}