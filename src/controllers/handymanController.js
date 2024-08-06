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
const moment = require('moment');
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

                    let sub_data = await dbReader.subscription.findOne({
                        where: {
                            user_id: user_id,
                            is_deleted: 0
                        },
                        include: [{
                            require: true,
                            model: dbReader.subscriptionPlan,
                            where: {
                                is_deleted: 0,
                            },
                        }]
                    });
                    sub_data = JSON.parse(JSON.stringify(sub_data));

                    console.log("sub_data ::: ", sub_data);

                    if (sub_data) {
                        let tot_handyman_data = await dbReader.users.findAll({
                            where: {
                                provider_id: user_id,
                                is_deleted: 0
                            }
                        });
                        tot_handyman_data = JSON.parse(JSON.stringify(tot_handyman_data));

                        console.log("tot_handyman_data :::: ", tot_handyman_data);
                        if (tot_handyman_data?.length) {
                            if (tot_handyman_data?.length >= sub_data?.SubscriptionPlan?.no_handyman) {
                                throw new Error("Create handyman limit reached.");
                            }
                        }
                    } else {
                        let sub_plan_data = await dbReader.subscriptionPlan.findOne({
                            where: {
                                amount: 0,
                                is_deleted: 0
                            }
                        });
                        sub_plan_data = JSON.parse(JSON.stringify(sub_plan_data));

                        if (sub_plan_data) {
                            const currentDate = moment();
                            const oneMonthLater = currentDate.add(1, 'months');
                            const formattedDate = oneMonthLater.format('DD-MM-YYYY');
                            await dbWriter.subscription.create({
                                user_id: user_id,
                                subscription_plan_id: sub_plan_data?.subscription_plan_id,
                                amount: 0,
                                due_date: formattedDate,
                            });
                        }
                    }

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
                    }, {
                        required: false,
                        model: dbReader.service,
                        where: {
                            is_deleted: 0
                        },
                        include: [{
                            required: false,
                            as: "service_rating",
                            model: dbReader.serviceRating,
                            where: {
                                is_deleted: 0
                            },
                            include: [{
                                attributes: ["user_id", "name", "email", "contact", "photo"],
                                required: false,
                                model: dbReader.users,
                                where: {
                                    is_deleted: 0
                                },
                            }]
                        }]
                    }]
                });
                handymanTotServiceDoneData = JSON.parse(JSON.stringify(handymanTotServiceDoneData));

                let tot_earning = 0, tot_ratings = [], upcoming_services = 0, todays_services = 0;

                for (let i = 0; i < handymanTotServiceDoneData.length; i++) {
                    let pData = handymanTotServiceDoneData[i];
                    tot_earning = parseFloat(tot_earning) + (parseFloat(pData?.service_amount * pData?.booking_service_qty) - pData?.discount_amount - pData?.commission_amount - pData?.coupen_amount - pData?.tax_amount);

                    if (pData?.Service?.service_rating) {
                        tot_ratings = tot_ratings.push(pData?.Service?.service_rating);
                    }

                    if (moment(pData?.booking_datetime).format("DD-MM-YYYY") > moment().format("DD-MM-YYYY")) {
                        upcoming_services = upcoming_services + 1;
                    }

                    if (moment(pData?.booking_datetime).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY")) {
                        todays_services = todays_services + 1;
                    }
                }

                new SuccessResponse("Get data successfully.", {
                    data: {
                        totalServiceDone: handymanTotServiceDoneData?.length || 0,
                        totalEarnings: tot_earning.toFixed(2) || 0,
                        totRatings: tot_ratings.length,
                        upcomingServices: upcoming_services,
                        todaysServices: todays_services,
                        reviewData: tot_ratings
                    }
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

}

module.exports = ProviderController;
