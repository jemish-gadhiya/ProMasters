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

class ProviderController {

    addEditServiceAddress = async (req, res) => {
        try {
            let { service_address_id = 0, address, latitude = "", longitude = "" } = req.body;
            let { user_id, role } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                if (service_address_id === 0) {
                    await dbWriter.serviceAddress.create({
                        user_id: user_id,
                        address: address,
                        latitude: latitude,
                        longitude: longitude
                    });

                    new SuccessResponse("Address added successfully.", {}).send(res);
                } else {
                    let addressData = await dbReader.serviceAddress.findOne({
                        where: {
                            service_address_id: service_address_id,
                            user_id: user_id,
                            is_deleted: 0
                        }
                    });
                    addressData = JSON.parse(JSON.stringify(addressData));
                    if (!addressData) {
                        throw new Error("Service address not found.");
                    } else {
                        await dbWriter.serviceAddress.update({
                            address: address,
                            latitude: latitude,
                            longitude: longitude
                        }, {
                            where: { service_address_id: service_address_id, user_id: user_id }
                        });

                        new SuccessResponse("Address updated successfully.", {}).send(res);
                    }
                }
            }

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getAllServiceAddress = async (req, res) => {
        try {
            let { user_id, role } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let addressData = await dbReader.serviceAddress.findAll({
                    where: {
                        user_id: user_id,
                        is_deleted: 0
                    }
                });
                addressData = JSON.parse(JSON.stringify(addressData));
                new SuccessResponse("Service address get successfully.", { data: addressData }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getActiveServiceAddress = async (req, res) => {
        try {
            let { user_id, role } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let addressData = await dbReader.serviceAddress.findAll({
                    where: {
                        user_id: user_id,
                        is_active: 1,
                        is_deleted: 0
                    }
                });
                addressData = JSON.parse(JSON.stringify(addressData));
                new SuccessResponse("Service address get successfully.", { data: addressData }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deleteServiceAddress = async (req, res) => {
        try {
            let { service_address_id } = req.body;
            let { user_id, role } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let addressData = await dbReader.serviceAddress.findOne({
                    where: {
                        service_address_id: service_address_id,
                        user_id: user_id,
                        is_deleted: 0
                    }
                });
                addressData = JSON.parse(JSON.stringify(addressData));
                if (!addressData) {
                    throw new Error("Service address not found.");
                } else {
                    await dbWriter.serviceAddress.update({
                        is_deleted: 1
                    }, {
                        where: { service_address_id: service_address_id, user_id: user_id }
                    });

                    new SuccessResponse("Address deleted successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    dactiveServiceAddress = async (req, res) => {
        try {
            let { service_address_id } = req.body;
            let { user_id, role } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let addressData = await dbReader.serviceAddress.findOne({
                    where: {
                        service_address_id: service_address_id,
                        user_id: user_id,
                        is_deleted: 0
                    }
                });
                addressData = JSON.parse(JSON.stringify(addressData));
                if (!addressData) {
                    throw new Error("Service address not found.");
                } else {
                    await dbWriter.serviceAddress.update({
                        is_active: (addressData?.is_active === 0) ? 1 : 0
                    }, {
                        where: { service_address_id: service_address_id, user_id: user_id }
                    });

                    new SuccessResponse("Address updated successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

}

module.exports = ProviderController;