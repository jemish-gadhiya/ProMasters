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

    addHandyman = async (req, res) => {
        try {
            let { name, username, email, contact, password, google_signup = "", latitude = "", longitude = "", photo = "", address = "", city = "", state = "", country = "", experience = "" } = req.body;
            let { user_id, role } = req;

            if (role === 2) {
                let userData = await dbReader.users.findOne({
                    attributes: ["user_id", "email", "username", "is_deleted"],
                    where: {
                        email: email,
                        is_deleted: 0
                    }
                });
                userData = JSON.parse(JSON.stringify(userData));
                if (userData) {
                    throw new Error("Email address already registered.");
                } else {
                    let userNameData = await dbReader.users.findOne({
                        attributes: ["user_id", "email", "username", "is_deleted"],
                        where: {
                            username: username,
                            is_deleted: 0
                        }
                    });
                    userNameData = JSON.parse(JSON.stringify(userNameData));
                    if (userNameData) {
                        throw new Error("Username already registered.");
                    } else {
                        password = crypto.encrypt(password.toString(), true).toString();
                        let email_otp = generateRandomNo(6).toString(),
                            sms_otp = "123456"//await generateRandomNo(6).toString();

                        await dbWriter.users.create({
                            name: name,
                            username: username,
                            email: email,
                            contact: contact,
                            password: password,
                            google_signup: google_signup,
                            latitude: latitude,
                            longitude: longitude,
                            role: 3,//Here static role : 3 is added because we are going to register handyman
                            photo: photo,
                            address: address,
                            city: city,
                            state: state,
                            country: country,
                            experience: experience,
                            email_otp: email_otp,
                            sms_otp: sms_otp,
                            provider_id: user_id
                        });

                        let payload = {
                            email: email,
                            email_otp: email_otp,
                            templateIdentifier: EnumObject.templateIdentifier.get('registerEmailOTP').value,
                        }
                        await ObjectMail.ConvertData(payload, function (data) { });

                        //Need to delevop the sms otp send flow here. this is pending as client confirmation is pending

                        new SuccessResponse("Handyman addedd successfully.", {}).send(res);
                    }
                }
            } else {
                throw new Error("User don't have permission to perform this action.");
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    editHandyman = async (req, res) => {
        try {
            let { user_id, name = "", username = "", email = "", contact = "", password = "", google_signup = "", latitude = "", longitude = "", photo = "", address = "", city = "", state = "", country = "", experience = "" } = req.body;
            let { role } = req;

            if (role === 2) {
                let handymanUserData = await dbReader.users.findOne({
                    attributes: ["user_id", "email", "username", "is_deleted"],
                    where: {
                        user_id: user_id,
                        is_deleted: 0
                    }
                });
                handymanUserData = JSON.parse(JSON.stringify(handymanUserData));


                if (handymanUserData) {
                    if (handymanUserData.email !== email) {
                        let uData = await dbReader.users.findOne({
                            attributes: ["user_id", "email", "username", "is_deleted"],
                            where: {
                                email: email,
                                is_deleted: 0
                            }
                        });
                        uData = JSON.parse(JSON.stringify(uData));
                        if (uData) {
                            throw new Error("Email address already registered.");
                        }
                    }

                    if (handymanUserData.username !== username) {
                        let userNameData = await dbReader.users.findOne({
                            attributes: ["user_id", "email", "username", "is_deleted"],
                            where: {
                                email: email,
                                is_deleted: 0
                            }
                        });
                        userNameData = JSON.parse(JSON.stringify(userNameData));
                        if (userNameData) {
                            throw new Error("Username already registered.");
                        }
                    }


                    password = crypto.encrypt(password.toString(), true).toString();

                    name = (handymanUserData.name === name) ? handymanUserData.name : name;
                    username = (handymanUserData.username === username) ? handymanUserData.username : username;
                    email = (handymanUserData.email === email) ? handymanUserData.email : email;
                    contact = (handymanUserData.contact === contact) ? handymanUserData.contact : contact;
                    password = (handymanUserData.password === password) ? handymanUserData.password : password;
                    google_signup = (handymanUserData.google_signup === google_signup) ? handymanUserData.google_signup : google_signup;
                    latitude = (handymanUserData.latitude === latitude) ? handymanUserData.latitude : latitude;
                    longitude = (handymanUserData.longitude === longitude) ? handymanUserData.longitude : longitude;
                    photo = (handymanUserData.photo === photo) ? handymanUserData.photo : photo;
                    address = (handymanUserData.address === address) ? handymanUserData.address : address;
                    city = (handymanUserData.city === city) ? handymanUserData.city : city;
                    state = (handymanUserData.state === state) ? handymanUserData.state : state;
                    country = (handymanUserData.country === country) ? handymanUserData.country : country;
                    experience = (handymanUserData.experience === experience) ? handymanUserData.experience : experience;


                    await dbWriter.users.update({
                        name: name,
                        username: username,
                        email: email,
                        contact: contact,
                        password: password,
                        google_signup: google_signup,
                        latitude: latitude,
                        longitude: longitude,
                        photo: photo,
                        address: address,
                        city: city,
                        state: state,
                        country: country,
                        experience: experience
                    }, {
                        where: {
                            user_id: user_id,
                        }
                    });

                    new SuccessResponse("Handyman edited successfully.", {}).send(res);
                } else {
                    throw new Error("User data not found.");
                }
            } else {
                throw new Error("User don't have permission to perform this action.");
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getAllHandymanByPovider = async (req, res) => {
        try {
            let { user_id, role } = req;

            if (role === 2) {
                let handymanUserData = await dbReader.users.findAll({
                    attributes: ["user_id", "name", "username", "email", "contact", "google_signup", "latitude", "longitude", "photo", "address", "city", "state", "country", "experience", "is_active"],
                    where: {
                        provider_id: user_id,
                        is_deleted: 0
                    }
                });
                handymanUserData = JSON.parse(JSON.stringify(handymanUserData));

                new SuccessResponse("Handyman get successfully.", {
                    handymanUserData
                }).send(res);
            } else {
                throw new Error("User don't have permission to perform this action.");
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    activateDeactivateHandyman = async (req, res) => {
        try {
            let { handyman_user_id } = req.body;
            let { user_id, role } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let handymanData = await dbReader.users.findOne({
                    where: {
                        user_id: handyman_user_id,
                        provider_id: user_id,
                        is_deleted: 0
                    }
                });
                handymanData = JSON.parse(JSON.stringify(handymanData));
                if (!handymanData) {
                    throw new Error("Handyman data not found.");
                } else {
                    await dbWriter.users.update({
                        is_active: (handymanData?.is_active === 0) ? 1 : 0
                    }, {
                        where: { user_id: handyman_user_id, provider_id: user_id }
                    });

                    new SuccessResponse("Handyman status updated successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getCompletedServiceCountForHandyman = async (req, res) => {
        try {
            let { user_id, role } = req;

            if (role !== 3) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let handymanTotServiceDoneData = await dbReader.serviceBooking.findAll({
                    where: {
                        is_deleted: 0,
                        booking_service_status: 2
                    },
                    include: [{
                        required: true,
                        model: dbReader.serviceBookingHandyman,
                        where: {
                            user_id: user_id,
                            is_deleted: 0
                        }
                    }]
                });
                handymanTotServiceDoneData = JSON.parse(JSON.stringify(handymanTotServiceDoneData));

                new SuccessResponse("Get data successfully.", {
                    data: {
                        totalServiceDone: handymanTotServiceDoneData?.length || 0
                    }
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    getDashboardDetailForHandyman = async (req, res) => {
        try {
            let { user_id, role } = req;

            if (role !== 3) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let handymanTotServiceDoneData = await dbReader.serviceBooking.findAll({
                    where: {
                        is_deleted: 0,
                        booking_service_status: 2
                    },
                    include: [{
                        required: true,
                        model: dbReader.serviceBookingHandyman,
                        where: {
                            user_id: user_id,
                            is_deleted: 0
                        }
                    }]
                });
                handymanTotServiceDoneData = JSON.parse(JSON.stringify(handymanTotServiceDoneData));


                
                new SuccessResponse("Get data successfully.", {
                    data: {
                        totalServiceDone: handymanTotServiceDoneData?.length || 0
                    }
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

}

module.exports = ProviderController;
