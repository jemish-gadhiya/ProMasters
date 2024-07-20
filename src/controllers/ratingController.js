const {
    NextFunction,
    Request,
    response
} = require('express');
const {
    SuccessResponse,
    BadRequestError,
    ApiError,
    UAParser,
} = require('../core/index');
const {
    generateRandomNo
} = require('../helpers/helpers');
const {
    dbReader,
    dbWriter
} = require('../models/dbconfig');
const index_1 = require("../core/index");
const nodeMailerController_1 = require("./nodeMailerController");
var crypto = new index_1.crypto_1();
const jwt = require("jsonwebtoken");
require('dotenv').config()
const enumerationController = require("./enumurationController");
var ObjectMail = new nodeMailerController_1();
var EnumObject = new enumerationController();

class RatingController {

    saveRating = async (req, res) => {
        try {
            let {
                rating_reciever_id,
                rating,
                rating_type,
                description
            } = req.body
            let {
                user_id,
                role
            } = req;
            let ratingData = await dbWriter.serviceRating.create({
                rating_reciever_id: rating_reciever_id,
                rating: rating,
                rating_type: rating_type,
                description: description,
                user_id: user_id
            })
            ratingData = JSON.parse(JSON.stringify(ratingData));
            new SuccessResponse("Request successful.", {
                data: ratingData
            }).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    listRatingForService = async (req, res) => {
        try {
            let {
                service_id,
            } = req.body;
            let {
                role
            } = req;
            let serviceRatingData = await dbReader.serviceRating.findAll({
                where: {
                    rating_type: 1,
                    rating_reciever_id: service_id
                },
                include: [{
                    required: false,
                    model: dbReader.users,
                    attributes: ["user_id", "name", "username", "email", "photo", "is_active", "created_at"],
                    where: {
                        is_deleted: 0,
                        is_active: 1
                    }
                }, {
                    required: false,
                    model: dbReader.service,
                    where: {
                        is_deleted: 0,
                    },
                    include: [{
                        model: dbReader.category,
                        where: {
                            is_deleted: 0,
                        },
                    }]
                }]
            })
            serviceRatingData = JSON.parse(JSON.stringify(serviceRatingData))
            new SuccessResponse("Request successful.", {
                data: serviceRatingData
            }).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    deleteRating = async (req, res) => {
        try {
            let {
                service_rating_id
            } = req.body;
            let {
                user_id,
                role
            } = req;
            await dbReader.serviceRating.update({
                is_deleted: 1
            }, {
                where: {
                    service_rating_id: service_rating_id,
                    is_deleted: 0
                }
            })
            new SuccessResponse("Request successful.", {}).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }


    editRating = async (req, res) => {
        try {
            let {
                rating_id,
                rating,
                description
            } = req.body
            let {
                user_id,
                role
            } = req;
            await dbWriter.serviceRating.update({
                rating: rating,
                description: description
            }, {
                where: {
                    service_rating_id: rating_id
                }
            })
            new SuccessResponse("Request successful.", {}).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    listRatingForUserRatedService = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let serviceRatingData = await dbReader.serviceRating.findAll({
                where: {
                    rating_type: 1,
                    user_id: user_id
                },
                include: [{
                    required: false,
                    model: dbReader.service,
                    where: {
                        is_deleted: 0,
                    },
                    include: [{
                        required: false,
                        model: dbReader.category,
                        where: {
                            is_deleted: 0,
                        },
                    }]
                }]
            })
            serviceRatingData = JSON.parse(JSON.stringify(serviceRatingData))
            new SuccessResponse("Request successful.", {
                data: serviceRatingData
            }).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    saveFavouriteService = async (req, res) => {
        try {
            let {
                service_id,
                is_favourited
            } = req.body
            let {
                user_id,
                role
            } = req;
            let serviceData = await dbReader.favouritedService.findOne({
                where: {
                    service_id: service_id,
                    user_id: user_id,
                }
            })
            if (serviceData) {
                await dbReader.favouritedService.update({
                    is_deleted: is_favourited == 1 ? 0 : 1
                }, {
                    where: {
                        service_id: service_id,
                        user_id: user_id,
                    }
                })
            } else {
                let favouritedServiceData = await dbWriter.favouritedService.create({
                    service_id: service_id,
                    user_id: user_id,
                })
                favouritedServiceData = JSON.parse(JSON.stringify(favouritedServiceData));
            }
            new SuccessResponse("Request successful.", {}).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    listFavouriteService = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let favouritedServiceData = await dbReader.favouritedService.findAll({
                where: {
                    is_deleted: 0,
                    user_id: user_id
                },
                include: [{
                    required: false,
                    model: dbReader.service,
                    where: {
                        is_deleted: 0,
                    },
                    include: [{
                        model: dbReader.category,
                        where: {
                            is_deleted: 0,
                        },
                    }]
                }]
            })
            favouritedServiceData = JSON.parse(JSON.stringify(favouritedServiceData))
            new SuccessResponse("Request successful.", {
                data: favouritedServiceData
            }).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
}

module.exports = RatingController;