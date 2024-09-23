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
const notificationController = require("./notificationController");
var ObjectMail = new nodeMailerController_1();
var EnumObject = new enumerationController();
var NotificationObject = new notificationController();
const moment = require('moment');

const {
    Op,
    where
} = require('sequelize');
const {
    required
} = require('joi');

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class ProviderController {

    //Service address module API's
    addEditServiceAddress = async (req, res) => {
        try {
            let {
                service_address_id = 0, address, latitude = "", longitude = ""
            } = req.body;
            let {
                user_id,
                role
            } = req;

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
                            where: {
                                service_address_id: service_address_id,
                                user_id: user_id
                            }
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
            let {
                user_id,
                role
            } = req;

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
                new SuccessResponse("Service address get successfully.", {
                    data: addressData
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getActiveServiceAddress = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;

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
                new SuccessResponse("Service address get successfully.", {
                    data: addressData
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deleteServiceAddress = async (req, res) => {
        try {
            let {
                service_address_id
            } = req.body;
            let {
                user_id,
                role
            } = req;

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
                let serviceAddressData = await dbReader.service.findAll({
                    where: {
                        service_address_id: service_address_id,
                        is_deleted: 0
                    }
                });
                serviceAddressData = JSON.parse(JSON.stringify(serviceAddressData));
                if (serviceAddressData.length > 0) {
                    throw new Error(`This service address is associated to ${serviceAddressData.length} service.`);
                }
                if (!addressData) {
                    throw new Error("Service address not found.");
                } else {
                    await dbWriter.serviceAddress.update({
                        is_deleted: 1
                    }, {
                        where: {
                            service_address_id: service_address_id,
                            user_id: user_id
                        }
                    });

                    new SuccessResponse("Address deleted successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deactiveServiceAddress = async (req, res) => {
        try {
            let {
                service_address_id
            } = req.body;
            let {
                user_id,
                role
            } = req;

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
                        where: {
                            service_address_id: service_address_id,
                            user_id: user_id
                        }
                    });

                    new SuccessResponse("Address updated successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }


    //Category module API's
    addEditCategory = async (req, res) => {
        try {
            let {
                category_id = 0, name, image
            } = req.body;
            let {
                user_id,
                role
            } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                if (category_id === 0) {
                    await dbWriter.category.create({
                        name: name,
                        image: image
                    });

                    new SuccessResponse("Category added successfully.", {}).send(res);
                } else {
                    let categoryData = await dbReader.category.findOne({
                        where: {
                            category_id: category_id,
                            is_deleted: 0
                        }
                    });
                    categoryData = JSON.parse(JSON.stringify(categoryData));
                    if (!categoryData) {
                        throw new Error("Category not found.");
                    } else {
                        await dbWriter.category.update({
                            name: name,
                            image: image
                        }, {
                            where: {
                                category_id: category_id
                            }
                        });

                        new SuccessResponse("Category updated successfully.", {}).send(res);
                    }
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getAllCategory = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let categoryData = await dbReader.category.findAll({
                where: {
                    is_deleted: 0
                }
            });
            categoryData = JSON.parse(JSON.stringify(categoryData));
            new SuccessResponse("Category get successfully.", {
                data: categoryData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getActiveCategory = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let categoryData = await dbReader.category.findAll({
                where: {
                    is_enable: 1,
                    is_deleted: 0
                }
            });
            categoryData = JSON.parse(JSON.stringify(categoryData));
            new SuccessResponse("Category get successfully.", {
                data: categoryData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getCategoryById = async (req, res) => {
        try {
            let {
                category_id
            } = req.body;
            let {
                user_id,
                role
            } = req;
            let categoryData = await dbReader.category.findOne({
                where: {
                    category_id: category_id,
                    is_deleted: 0
                }
            });
            // categoryData = JSON.parse(JSON.stringify(categoryData));
            new SuccessResponse("Category get successfully.", {
                data: categoryData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deleteCategory = async (req, res) => {
        try {
            let {
                category_id
            } = req.body;
            let {
                user_id,
                role
            } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let categoryData = await dbReader.category.findOne({
                    where: {
                        category_id: category_id,
                        is_deleted: 0
                    }
                });
                categoryData = JSON.parse(JSON.stringify(categoryData));
                if (!categoryData) {
                    throw new Error("Category data not found.");
                } else {
                    await dbWriter.category.update({
                        is_deleted: 1
                    }, {
                        where: {
                            category_id: category_id
                        }
                    });

                    new SuccessResponse("Category deleted successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deactiveCategory = async (req, res) => {
        try {
            let {
                category_id
            } = req.body;
            let {
                user_id,
                role
            } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let categoryData = await dbReader.category.findOne({
                    where: {
                        category_id: category_id,
                        is_deleted: 0
                    }
                });
                categoryData = JSON.parse(JSON.stringify(categoryData));
                if (!categoryData) {
                    throw new Error("Category data not found.");
                } else {
                    await dbWriter.category.update({
                        is_enable: (categoryData?.is_enable === 0) ? 1 : 0
                    }, {
                        where: {
                            category_id: category_id
                        }
                    });

                    new SuccessResponse("Category updated successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    //Service Module
    addEditService = async (req, res) => {
        try {
            let {
                service_id = 0, service_name, category_id, description, service_address_id, service_type, price, discount, duration_hours, duration_mins, image_link, is_featured, gallery_images = []
            } = req.body;
            let {
                user_id,
                role
            } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                if (service_id === 0) {
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

                    if (sub_data) {
                        let tot_service_data = await dbReader.service.findAll({
                            where: {
                                user_id: user_id,
                                is_deleted: 0
                            }
                        });
                        tot_service_data = JSON.parse(JSON.stringify(tot_service_data));


                        if (tot_service_data?.length) {
                            if (tot_service_data?.length >= sub_data?.SubscriptionPlan?.no_service) {
                                throw new Error("Create service limit reached.");
                            }

                            let no_of_featured_services = tot_service_data?.map(e => e?.is_featured == 1)?.length;
                            if (no_of_featured_services >= sub_data?.SubscriptionPlan?.no_featured_service) {
                                throw new Error("Create featured service limit reached.");
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

                    let newService = await dbWriter.service.create({
                        name: service_name,
                        description: description,
                        category_id: category_id,
                        user_id: user_id,
                        service_address_id: service_address_id,
                        service_type: service_type,
                        price: price,
                        discount: discount,
                        duration_hours: duration_hours,
                        duration_mins: duration_mins,
                        image_link: image_link,
                        is_featured: is_featured,
                        status: 0,
                    });
                    newService = JSON.parse(JSON.stringify(newService))
                    let arr = []
                    if (gallery_images.length) {
                        gallery_images.forEach((element) => {
                            arr.push({
                                service_id: newService.service_id,
                                url: element.url
                            })
                        });
                        await dbWriter.serviceAttachment.bulkCreate(arr);
                    }
                    new SuccessResponse("Service added successfully.", {}).send(res);
                } else {
                    let serviceData = await dbReader.service.findOne({
                        where: {
                            service_id: service_id,
                            user_id: user_id,
                            is_deleted: 0
                        }
                    });
                    serviceData = JSON.parse(JSON.stringify(serviceData));
                    if (!serviceData) {
                        throw new Error("Service address not found.");
                    } else {
                        await dbWriter.service.update({
                            name: service_name,
                            description: description,
                            category_id: category_id,
                            service_address_id: service_address_id,
                            service_type: service_type,
                            price: price,
                            discount: discount,
                            duration_hours: duration_hours,
                            duration_mins: duration_mins,
                            image_link: image_link,
                            is_featured: is_featured,
                        }, {
                            where: {
                                service_id: service_id,
                                user_id: user_id,
                            }
                        });
                        let arr = []
                        if (gallery_images.length) {
                            await dbWriter.serviceAttachment.update({
                                is_deleted: 1
                            }, {
                                where: {
                                    service_id: service_id
                                }
                            })
                            gallery_images.forEach((element) => {
                                arr.push({
                                    service_id: service_id,
                                    url: element.url
                                })
                            });
                            await dbWriter.serviceAttachment.bulkCreate(arr);
                        }
                        new SuccessResponse("Service updated successfully.", {}).send(res);
                    }
                }
            }

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deleteService = async (req, res) => {
        try {
            let {
                service_id
            } = req.body;
            let {
                user_id,
                role
            } = req;

            let serviceData = await dbReader.service.findOne({
                where: {
                    service_id: service_id,
                    is_deleted: 0
                }
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));
            let serviceBookingData = await dbReader.serviceBooking.findAll({
                where: {
                    service_id: service_id,
                    is_deleted: 0
                }
            });
            serviceBookingData = JSON.parse(JSON.stringify(serviceBookingData));
            if (serviceBookingData.length > 0) {
                throw new Error(`This service has ${serviceBookingData.length} service booking.`);
            }
            if (!serviceData) {
                throw new Error("Service data not found.");
            } else {
                await dbWriter.service.update({
                    is_deleted: 1
                }, {
                    where: {
                        service_id: service_id,
                    }
                });

                new SuccessResponse("Service deleted successfully.", {}).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getServiceByCategory = async (req, res) => {
        try {
            let {
                category_id
            } = req.body
            let {
                user_id,
                role
            } = req;

            let serviceData = await dbReader.service.findAll({
                where: {
                    category_id: category_id,
                    is_deleted: 0
                },
                include: [{
                    model: dbReader.category,
                    where: {
                        is_deleted: 0,
                    },
                }, {
                    attributes: ['user_id', 'name', 'email', 'contact', 'photo'],
                    model: dbReader.users,
                    where: {
                        role: 2,
                        is_deleted: 0
                    }
                }, {
                    required: false,
                    model: dbReader.serviceAttachment,
                    where: {
                        is_deleted: 0
                    }
                }, {
                    required: false,
                    as: "service_rating",
                    model: dbReader.serviceRating,
                    where: {
                        is_deleted: 0,
                        rating_type: 1
                    }
                }]
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));

            var temp = [];
            if (serviceData) {
                for (let i = 0; i < serviceData?.length; i++) {

                    let cnt = 0,
                        avg_rating = 0;

                    if (serviceData[i]?.service_rating?.length > 0) {
                        for (let j = 0; j < serviceData[i]?.service_rating?.length; j++) {
                            cnt = parseFloat(cnt) + parseFloat(serviceData[i]?.service_rating[j]?.rating)
                        }
                        avg_rating = parseFloat(parseFloat(cnt) / serviceData[i]?.service_rating?.length).toFixed(2);
                    }
                    temp.push({
                        ...serviceData[i],
                        avaerage_rating: avg_rating
                    })
                }
            }

            new SuccessResponse("Service get successfully.", {
                data: temp
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getServiceById = async (req, res) => {
        try {
            let {
                service_id
            } = req.body
            let {
                user_id,
                role
            } = req;
            let serviceData = await dbReader.service.findOne({
                where: {
                    service_id: service_id,
                    is_deleted: 0
                },
                include: [{
                    model: dbReader.category,
                    where: {
                        is_deleted: 0,
                    },
                }, {
                    required: false,
                    model: dbReader.serviceAddress,
                    where: {
                        is_deleted: 0,
                    },
                }, {
                    model: dbReader.users,
                    where: {
                        role: 2,
                        is_deleted: 0
                    }
                }, {
                    required: false,
                    model: dbReader.serviceAttachment,
                    where: {
                        is_deleted: 0
                    }
                }, {
                    required: false,
                    model: dbReader.serviceBookingHandyman,
                    where: {
                        is_deleted: 0
                    }
                }, {
                    required: false,
                    model: dbReader.favouritedService,
                    where: {
                        is_deleted: 0,
                        user_id: user_id
                    }
                }, {
                    required: false,
                    as: "service_rating",
                    model: dbReader.serviceRating,
                    where: {
                        is_deleted: 0,
                        rating_type: 1
                    },
                    include: [{
                        required: false,
                        model: dbReader.users,
                        attributes: ["user_id", "name", "username", "email", "photo", "is_active", "created_at"],
                        where: {
                            is_deleted: 0,
                            is_active: 1
                        }
                    }]
                }]
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));
            let total_rating = 0;
            if (serviceData.service_rating.length) {
                serviceData.service_rating.forEach((ele) => {
                    total_rating = total_rating + parseFloat(ele.rating)
                })
            }
            serviceData.total_rating = parseFloat(total_rating) ? parseFloat(total_rating / serviceData.service_rating.length) : 0;
            new SuccessResponse("Service get successfully.", {
                ...serviceData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    listServiceForProvider = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let serviceData = await dbReader.service.findAll({
                where: {
                    user_id: user_id,
                    is_deleted: 0
                },
                include: [{
                    model: dbReader.serviceAttachment,
                    where: {
                        is_deleted: 0
                    }
                }, {
                    required: false,
                    as: "service_rating",
                    model: dbReader.serviceRating,
                    where: {
                        is_deleted: 0,
                        rating_type: 1
                    }
                }]
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));

            let cnt = 0,
                avg_rating = 0,
                temp = [];

            for (let i = 0; i < serviceData?.length; i++) {
                if (serviceData[i]?.service_rating?.length > 0) {
                    for (let j = 0; j < serviceData[i]?.service_rating?.length; j++) {
                        cnt = parseFloat(cnt) + parseFloat(serviceData[i]?.service_rating[j]?.rating)
                    }
                    avg_rating = parseFloat(parseFloat(cnt) / serviceData[i]?.service_rating?.length).toFixed(2);
                }
                temp.push({
                    ...serviceData[i],
                    avaerage_rating: avg_rating
                })
            }

            new SuccessResponse("Service get successfully.", {
                data: temp
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    listServiceForUser = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let {
                service_user_id = [],
                    rating,
                    min_amount,
                    max_amount,
                    category
            } = req.body;

            // Build the where conditions
            let serviceWhereConditions = {
                is_deleted: 0
            };

            if (service_user_id.length) {
                serviceWhereConditions.user_id = service_user_id;
            }

            if (min_amount && max_amount) {
                serviceWhereConditions.price = {
                    [Op.between]: [min_amount, max_amount]
                };
            } else if (min_amount) {
                serviceWhereConditions.price = {
                    [Op.gte]: min_amount
                };
            } else if (max_amount) {
                serviceWhereConditions.price = {
                    [Op.lte]: max_amount
                };
            }

            if (category) {
                serviceWhereConditions.category_id = category;
            }

            let serviceRatingWhereConditions = {
                is_deleted: 0,
                rating_type: 1
            };

            if (rating) {
                serviceRatingWhereConditions.rating = rating;
            }

            let serviceData = await dbReader.service.findAll({
                where: serviceWhereConditions,
                include: [{
                        model: dbReader.category,
                        where: {
                            is_deleted: 0,
                        },
                    }, {
                        required: false,
                        model: dbReader.serviceAttachment,
                        where: {
                            is_deleted: 0
                        }
                    },
                    {
                        required: false,
                        model: dbReader.users,
                        where: {
                            role: 2,
                            is_deleted: 0
                        }
                    },
                    {
                        required: false,
                        as: "service_rating",
                        model: dbReader.serviceRating,
                        where: serviceRatingWhereConditions
                    }
                ]
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));
            //console.log("serviceData", serviceData);
            let temp = [];
            let discountedServices = [];
            serviceData.forEach((e) => {
                let average_rating = 0;
                if (e?.service_rating.length) {
                    let total_rating = 0;
                    e?.service_rating?.forEach((ele) => {
                        total_rating = parseFloat(total_rating) + parseFloat(ele.rating)
                    })
                    average_rating = parseFloat(parseFloat(total_rating) / e.service_rating.length);
                }
                if (e.discount && e.discount > 0) {
                    discountedServices.push(e);
                }

                temp.push({
                    ...e,
                    average_rating: average_rating
                });
            })
            new SuccessResponse("Service retrieved successfully.", {
                data: temp,
                discounted_services: discountedServices
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    };
    getProviderDetail = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let userData = await dbReader.users.findOne({
                attributes: ["user_id", "name", "username", "email", "contact", "email", "role", "photo", "address", "city", "state", "country", "experience", "is_email_verified", "is_sms_verified", "is_active", "created_at"],
                where: {
                    user_id: user_id,
                    is_deleted: 0
                },
                include: [{
                    model: dbReader.service,
                    where: {
                        is_deleted: 0
                    },
                    include: [{
                        required: false,
                        model: dbReader.serviceBookingHandyman,
                        where: {
                            is_deleted: 0
                        },
                        include: [{
                            model: dbReader.users,
                            attributes: ["user_id", "name", "username", "email", "photo", "is_active", "created_at"],
                            where: {
                                is_deleted: 0,
                                is_active: 1
                            },
                        }]
                    }, {
                        as: "service_rating",
                        model: dbReader.serviceRating,
                        where: {
                            is_deleted: 0,
                            rating_type: 1
                        }
                    }, {
                        model: dbReader.category,
                        where: {
                            is_deleted: 0
                        }
                    }]
                }, {
                    model: dbReader.serviceRating,
                    where: {
                        is_deleted: 0,
                        rating_type: 2
                    }
                }]
            });
            userData = JSON.parse(JSON.stringify(userData));
            new SuccessResponse("Get provider detail successfully.", {
                ...userData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    addServiceBooking = async (req, res) => {
        try {
            let {
                booking_id,
                booking_date_time,
                service_id,
                booking_address,
                booking_latitude,
                booking_longitude,
                service_booking_qty,
                coupan_id
            } = req.body
            let {
                user_id,
                role
            } = req;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 4; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters[randomIndex];
            }
            let serviceData = await dbReader.service.findOne({
                where: {
                    service_id: service_id,
                    is_deleted: 0
                }
            })
            serviceData = JSON.parse(JSON.stringify(serviceData))
            let serviceAmount = 0,
                serviceDiscountAmount = 0;

            serviceAmount = serviceData.price || 0;
            serviceDiscountAmount = serviceData.discount || 0;

            // if (serviceData && serviceData.price) {
            // let price = serviceData.price;
            // let discount = serviceData.discount / 100; // Convert discount percentage to a decimal
            // serviceAmount = price - (price * discount);
            // }

            let comissionData = await dbReader.providerComission.findOne({
                where: {
                    provider_id: serviceData.user_id,
                    is_deleted: 0
                },
                include: [{
                    model: dbReader.comission,
                    where: {
                        is_deleted: 0
                    }
                }]
            });
            comissionData = JSON.parse(JSON.stringify(comissionData))

            let comissionAmount = 0;
            if (comissionData) {
                if (comissionData?.Commission?.comission_amount_type === 1) {
                    comissionAmount = comissionData?.Commission?.comission_amount;
                } else {
                    let comissionPercentage = comissionData?.Commission?.comission_amount / 100; // Convert discount percentage to a decimal
                    comissionAmount = (serviceData.price * comissionPercentage).toFixed(2);
                }
            }

            // console.log("==>comission data are :: ", comissionData);

            let taxData = await dbReader.tax.findOne({
                where: {
                    is_active: 1,
                    is_deleted: 0
                }
            });
            let taxAmount = 0;
            if (taxData) {
                if (taxData?.tax_amount_type === 1) {
                    taxAmount = taxData?.tax_amount;
                } else {
                    let taxPercentage = taxData?.tax_amount / 100; // Convert discount percentage to a decimal
                    taxAmount = (serviceData.price * taxPercentage).toFixed(2);
                }
            }

            let couponData = await dbReader.coupan.findOne({
                where: {
                    coupon_id: coupan_id,
                    is_active: 1,
                    is_deleted: 0
                }
            });
            let couponAmount = 0;
            if (couponData) {
                couponAmount = couponData?.coupon_amount;
            }

            if (booking_id == 0) {
                let serviceBookingData = await dbWriter.serviceBooking.create({
                    service_id: service_id,
                    booking_no: code,
                    booked_by: user_id,
                    booking_datetime: booking_date_time,
                    booking_address: booking_address,
                    booking_address_latitude: booking_latitude,
                    booking_address_longitude: booking_longitude,
                    booking_service_qty: service_booking_qty,
                    coupen_id: coupan_id,
                    service_amount: serviceAmount,
                    tax_amount: taxAmount || 0,
                    discount_amount: serviceDiscountAmount || 0,
                    commission_amount: comissionAmount || 0,
                    coupen_amount: couponAmount || 0,
                    booking_service_status: 0,
                    created_at: new Date(),
                    booking_service_status_updated_by: user_id
                });
                serviceBookingData = JSON.parse(JSON.stringify(serviceBookingData));
                let userData = await dbReader.users.findOne({
                    attributes: ['name'],
                    where: {
                        user_id: user_id
                    }
                });

                await dbWriter.serviceBookingHistory.create({
                    service_booking_id: serviceBookingData.service_booking_id,
                    title: "New booking",
                    description: "New booking added by " + userData.name,
                })
                let tokens = []
                let device_token = await dbReader.usersLoginLogs.findAll({
                    attributes: ['device_token'],
                    where: {
                        user_id: serviceData.user_id,
                        is_deleted: 0,
                        is_logout: 0
                    }
                })
                if (device_token.length) {
                    device_token = JSON.parse(JSON.stringify(device_token));
                    device_token.forEach((element) => {
                        if (element.device_token && !tokens.includes(element.device_token)) {
                            tokens.push(element.device_token);
                        }
                    });
                }
                const message = {
                    title: 'New Booking',
                    body: `${userData.name} has booked ${serviceData.name} service`,
                };

                let notificatiom = NotificationObject.sendPushNotification(tokens, message)
                let notificationData = await dbReader.notification.create({
                    user_id: serviceData.user_id,
                    title: 'New Booking',
                    description: `${userData.name} has booked ${serviceData.name} service`,
                    is_read: 0,
                    service_id:serviceData.service_id
                })

                new SuccessResponse("Service booked successfully.", {
                    data: serviceBookingData
                }).send(res);
            } else {
                await dbReader.serviceBooking.update({
                    booking_datetime: booking_date_time,
                }, {
                    where: {
                        booking_id: booking_id,
                        is_deleted: 0
                    }
                });
                new SuccessResponse("Service booking updated successfully.", {}).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    saveUserAvailibility = async (req, res) => {
        try {
            let {
                availibility_date = []
            } = req.body
            let {
                user_id,
                role
            } = req;
            let arr = []
            await dbReader.userAvailibility.update({
                is_deleted: 0
            }, {
                where: {
                    user_id: user_id,
                    is_deleted: 0
                }
            })
            if (availibility_date.length) {
                availibility_date.forEach((e) => {
                    arr.push({
                        user_id: user_id,
                        date: e.date,
                        from_time: e.from,
                        to_time: e.to
                    })
                })
            }
            let availibilityData = await dbWriter.userAvailibility.bulkCreate(arr)
            availibilityData = JSON.parse(JSON.stringify(availibilityData))

            new SuccessResponse("Request Successful.", {
                data: availibilityData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    assignServiceHandyman = async (req, res) => {
        try {
            let {
                handyman_user_id,
                service_id,
                service_booking_id
            } = req.body
            let {
                user_id,
                role
            } = req;

            let serviceHandymanData = await dbWriter.serviceBookingHandyman.create({
                service_booking_id: service_booking_id,
                service_id: service_id,
                user_id: handyman_user_id,
                created_at: new Date()
            })
            let serviceData = await dbReader.service.findOne({
                attributes: ['name'],
                where: {
                    service_id: service_id,
                    is_deleted: 0
                }
            })
            let userData = await dbReader.users.findOne({
                attributes: ['name'],
                where: {
                    user_id: handyman_user_id
                }
            })
            let tokens = [],
                handymanTokens = []
            let service_booking_detail = await dbReader.serviceBooking.findOne({
                where: {
                    service_booking_id: service_booking_id
                }
            })
            let handyman_device_token = await dbReader.usersLoginLogs.findAll({
                attributes: ['device_token'],
                where: {
                    user_id: handyman_user_id,
                    is_deleted: 0,
                    is_logout: 0
                }
            })
            if (handyman_device_token.length) {
                handyman_device_token = JSON.parse(JSON.stringify(handyman_device_token));
                handyman_device_token.forEach((element) => {
                    if (element.device_token && !handymanTokens.includes(element.device_token)) {
                        handymanTokens.push(element.device_token);
                    }
                });
            }
            const message = {
                title: 'Assigned Service',
                body: `${serviceData.name} service has been assigned to you`,
            };
            let notificatiom = NotificationObject.sendPushNotification(handymanTokens, message)
            serviceHandymanData = JSON.parse(JSON.stringify(serviceHandymanData))
            let notificationData = await dbReader.notification.create({
                user_id: handyman_user_id,
                title: 'Assigned Service',
                description: `${serviceData.name} service has been assigned to you`,
                is_read: 0,
                service_id:serviceData.service_id
            })

            //for user-notfication
            let device_token = await dbReader.usersLoginLogs.findAll({
                attributes: ['device_token'],
                where: {
                    user_id: service_booking_detail.booked_by,
                    is_deleted: 0,
                    is_logout: 0
                }
            })
            if (device_token.length) {
                device_token = JSON.parse(JSON.stringify(device_token));
                device_token.forEach((element) => {
                    if (element.device_token && !tokens.includes(element.device_token)) {
                        tokens.push(element.device_token);
                    }
                });
            }
            const message1 = {
                title: 'Assigned Service',
                body: `${serviceData.name} service has been assigned to ${userData.name} handyman`,
            };
            NotificationObject.sendPushNotification(tokens, message1)
            serviceHandymanData = JSON.parse(JSON.stringify(serviceHandymanData))
            await dbWriter.serviceBookingHistory.create({
                service_booking_id: service_booking_id,
                title: "Assign Handyman",
                description: `${serviceData.name} service has been assigned to ${userData.name} handyman`,
            })
            let notificationData1 = await dbReader.notification.create({
                user_id: service_booking_detail.booked_by,
                title: 'Assigned Handyman',
                description: `${serviceData.name} service has been assigned to ${userData.name} handyman`,
                is_read: 0,
                service_id:serviceData.service_id
            })
            new SuccessResponse("Request Successful.", {
                data: serviceHandymanData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    listServiceBookingForProvider = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let serviceData = await dbReader.service.findAll({
                where: {
                    user_id: user_id,
                    is_deleted: 0
                },
                include: [{
                    required: true,
                    model: dbReader.serviceBooking,
                    where: {
                        is_deleted: 0
                    },
                    include: [{
                        model: dbReader.users,
                        attributes: ["user_id", "name", "username", "email", "photo", "is_active", "created_at"],
                        where: {
                            is_deleted: 0,
                            is_active: 1
                        }
                    }]
                }]
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));
            new SuccessResponse("Service get successfully.", {
                data: serviceData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    updateServiceBookingStatus = async (req, res) => {
        try {
            let {
                status,
                service_booking_id
            } = req.body
            let {
                user_id,
                role
            } = req;

            let data = await dbReader.serviceBooking.findOne({
                where: {
                    service_booking_id: service_booking_id,
                    is_deleted: 0
                },
            })
            data = JSON.parse(JSON.stringify(data))
            if (data) {
                await dbWriter.serviceBooking.update({
                    booking_status: status
                }, {
                    where: {
                        service_booking_id: service_booking_id,
                        is_deleted: 0
                    }
                })
                if (status == 1) {
                    let serviceData = await dbReader.service.findOne({
                        attributes: ['name'],
                        where: {
                            is_deleted: 0,
                            service_id: data.service_id
                        }
                    })
                    let userData = await dbReader.users.findOne({
                        attributes: ['name'],
                        where: {
                            user_id: user_id
                        }
                    })
                    let tokens = []
                    let device_token = await dbReader.usersLoginLogs.findAll({
                        attributes: ['device_token'],
                        where: {
                            user_id: data.booked_by,
                            is_deleted: 0,
                            is_logout: 0
                        }
                    })
                    if (device_token.length) {
                        device_token = JSON.parse(JSON.stringify(device_token));
                        device_token.forEach((element) => {
                            if (element.device_token && !tokens.includes(element.device_token)) {
                                tokens.push(element.device_token);
                            }
                        });
                    }
                    const message = {
                        title: 'Booking Accepted',
                        body: `${userData.name} has accepted ${serviceData.name} service`,
                    };

                    let notificatiom = NotificationObject.sendPushNotification(tokens, message)
                    let notificationData = await dbReader.notification.create({
                        user_id: data.booked_by,
                        title: 'Booking Accepted',
                        description: `${userData.name} has accepted ${serviceData.name} service`,
                        is_read: 0,
                        service_id:serviceData.service_id
                    })
                }
                new SuccessResponse("Request Successful.", {}).send(res);
            } else {
                throw new BadRequestError("Service Booking not found.")
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    listProviderForFilter = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let providerData = await dbReader.users.findAll({
                where: {
                    role: 2,
                    is_deleted: 0
                },
            });
            providerData = JSON.parse(JSON.stringify(providerData));
            new SuccessResponse("Provider get successfully.", {
                data: providerData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getComissionOfProvider = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let comissionData = await dbReader.providerComission.findOne({
                    where: {
                        provider_id: user_id,
                        is_deleted: 0
                    },
                    include: [{
                        required: false,
                        model: dbReader.comission,
                        where: {
                            is_deleted: 0
                        }
                    }]
                });
                new SuccessResponse("Service address get successfully.", {
                    data: comissionData
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    providerDashboardAnalyticsData = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {

                let responseData = {
                    total_booking: 0,
                    total_service: 0,
                    total_handyman: 0,
                    total_earning: 0,
                    monthly_earning: []
                }

                let providerBookingsData = await dbReader.serviceBooking.findAll({
                    where: {
                        is_deleted: 0
                    },
                    include: [{
                        required: true,
                        model: dbReader.service,
                        where: {
                            is_deleted: 0,
                            user_id: user_id
                        }
                    }]
                });
                providerBookingsData = JSON.parse(JSON.stringify(providerBookingsData));

                let providerServicesData = await dbReader.service.findAll({
                    where: {
                        is_deleted: 0,
                        user_id: user_id
                    }
                });
                providerServicesData = JSON.parse(JSON.stringify(providerServicesData));

                let providerHandymanData = await dbReader.users.findAll({
                    where: {
                        is_deleted: 0,
                        provider_id: user_id
                    }
                });
                providerHandymanData = JSON.parse(JSON.stringify(providerHandymanData));

                let providerEarning = 0;
                let monthsData = [{
                    month: "01",
                    earning: 0
                }, {
                    month: "02",
                    earning: 0
                }, {
                    month: "03",
                    earning: 0
                }, {
                    month: "04",
                    earning: 0
                }, {
                    month: "05",
                    earning: 0
                }, {
                    month: "06",
                    earning: 0
                }, {
                    month: "07",
                    earning: 0
                }, {
                    month: "08",
                    earning: 0
                }, {
                    month: "09",
                    earning: 0
                }, {
                    month: "10",
                    earning: 0
                }, {
                    month: "11",
                    earning: 0
                }, {
                    month: "12",
                    earning: 0
                }]
                for (let i = 0; i < providerBookingsData.length; i++) {
                    let pData = providerBookingsData[i];
                    if (pData?.booking_service_status === 2) {
                        providerEarning = parseFloat(providerEarning) + (parseFloat(pData?.service_amount * pData?.booking_service_qty) - pData?.discount_amount - pData?.commission_amount - pData?.coupen_amount - pData?.tax_amount);
                    }

                    for (let j = 0; j < monthsData.length; j++) {
                        if (monthsData[j]?.month === (new Date(pData?.booking_datetime)?.getMonth() + 1).toString().padStart(2, '0') && pData?.booking_service_status === 2) {
                            monthsData[j].earning = parseFloat(parseFloat(monthsData[j]?.earning) + (parseFloat(pData?.service_amount * pData?.booking_service_qty) - pData?.discount_amount - pData?.commission_amount - pData?.coupen_amount - pData?.tax_amount)).toFixed(2);
                        }
                    }
                }

                responseData.total_booking = providerServicesData?.length || 0;
                responseData.total_service = providerServicesData?.length || 0;
                responseData.total_handyman = providerHandymanData?.length || 0;
                responseData.total_earning = providerEarning.toFixed(2) || 0;
                responseData.monthly_earning = monthsData;

                new SuccessResponse("Provider dashboard analytics data get successfully.", {
                    data: responseData
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    paymentDetailsForProvider = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {



                let bookingsData = await dbReader.serviceBooking.findAll({
                    where: {
                        is_deleted: 0
                    },
                    include: [{
                        attributes: [],
                        required: true,
                        model: dbReader.service,
                        where: {
                            is_deleted: 0,
                            user_id: user_id
                        }
                    }, {
                        attributes: ["user_id", "name", 'email', "contact", "role", "photo", "address", "city", "state", "country", ],
                        required: false,
                        model: dbReader.users,
                        where: {
                            is_deleted: 0
                        }
                    }, {
                        required: false,
                        model: dbReader.serviceBookingPayment,
                        where: {
                            is_deleted: 0
                        }
                    }]
                });
                bookingsData = JSON.parse(JSON.stringify(bookingsData));


                new SuccessResponse("Payment details get successfully.", {
                    data: bookingsData
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    purchaseSubscriptionForProvider = async (req, res) => {
        try {
            let {
                subscription_plan_id,
                due_date,
                payment_type,
                card_details
            } = req.body;

            let {
                user_id,
                role
            } = req;

            let planData = await dbReader.subscriptionPlan.findOne({
                where: {
                    subscription_plan_id: subscription_plan_id,
                    is_deleted: 0,
                    is_active: 1
                }
            })
            planData = JSON.parse(JSON.stringify(planData));

            if (!planData) {
                throw new Error("Subscription plan data not found.");
            } else {
                let amount = planData?.amount;

                let newSubscription = await dbWriter.subscription.create({
                    user_id: user_id,
                    subscription_plan_id: subscription_plan_id,
                    amount: amount,
                    due_date: due_date,
                });

                //console.log("---> newSubscription ::", newSubscription);


                //Here below transaction id get from the payment transaction, we have to get this id once we done the payment.
                let transaction_id = "ABCDTEST1234@@@",
                    status = 1;


                let subscription_id = newSubscription?.dataValues?.subscription_id;


                //console.log("subscription id is :: ", subscription_id);

                let subscriptionPaymentData = await dbWriter.subscriptionPayment.create({
                    subscription_id: subscription_id,
                    payment_type: payment_type,
                    status: status,
                    transaction_id: transaction_id,
                    receipt: "",
                    card_details: card_details
                });

                //console.log("subscriptionPaymentData ::: ", subscriptionPaymentData);
                new SuccessResponse("Subscription purchased successfully.", {}).send(res);
            }

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getUserSubscriptionForProvider = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let subscriptionData = await dbReader.subscription.findOne({
                    where: {
                        user_id: user_id,
                        is_deleted: 0
                    },
                    include: [{
                        required: false,
                        model: dbReader.subscriptionPayment,
                        where: {
                            is_deleted: 0
                        }
                    }]
                });
                new SuccessResponse("Subscription data get successfully.", {
                    data: subscriptionData
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    changeServiceProgressStatus = async (req, res) => {
        try {
            let {
                service_booking_id,
                status
            } = req.body;
            let {
                user_id,
                role
            } = req;

            if (role === 1) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let serviceBookingData = await dbReader.serviceBooking.findOne({
                    where: {
                        service_booking_id: service_booking_id,
                        is_deleted: 0
                    },
                    include: [{
                        required: true,
                        model: dbReader.service
                    }]
                });
                serviceBookingData = JSON.parse(JSON.stringify(serviceBookingData));

                if (!serviceBookingData) {
                    throw new Error("Service booking data not found.");
                } else {
                    await dbWriter.serviceBooking.update({
                        booking_service_status: status,
                        booking_service_status_updated_by: user_id
                    }, {
                        where: {
                            service_booking_id: service_booking_id,
                        }
                    });
                    let provider_id = serviceBookingData?.Service?.user_id;
                    if (status === 2) { //If status is completed then add respective service amount to provider's wallet.
                        //let provider_id = serviceBookingData?.Service?.user_id,
                        let service_id = serviceBookingData?.Service?.service_id,
                            amount = (serviceBookingData?.service_amount * serviceBookingData?.booking_service_qty) - serviceBookingData?.discount_amount - serviceBookingData?.commission_amount - serviceBookingData?.coupen_amount - serviceBookingData?.tax_amount;

                        await dbWriter.wallet.create({
                            provider_id: provider_id,
                            service_id: service_id,
                            amount: amount
                        });
                    }

                    let notificationStatus = status === 0 ? 'pending' : status === 1 ? 'in_progress' : status === 2 ? 'completed' : status === 3 ? 'cancelled' : ""
                    let device_token = await dbReader.usersLoginLogs.findAll({
                        attributes: ['device_token'],
                        where: {
                            user_id: [provider_id, serviceBookingData.booked_by],
                            is_deleted: 0,
                            is_logout: 0
                        }
                    })
                    let tokens = [];
                    if (device_token.length) {
                        device_token = JSON.parse(JSON.stringify(device_token));
                        device_token.forEach((element) => {
                            if (element.device_token && !tokens.includes(element.device_token)) {
                                tokens.push(element.device_token);
                            }
                        });
                    }
                    const message = {
                        title: 'Service Status',
                        body: `Your service status is changed to ${notificationStatus}`,
                    };
                    NotificationObject.sendPushNotification(tokens, message)
                    let notificationData = await dbReader.notification.create({
                        user_id: data.booked_by,
                        title: 'Booking Accepted',
                        description: `${userData.name} has accepted ${serviceData.name} service`,
                        is_read: 0,
                        service_id:serviceData.service_id
                    })
                    if (status === 2) {
                        await dbWriter.serviceBookingHistory.create({
                            service_booking_id: service_booking_id,
                            title: "Completed Service",
                            description: `Your service status is changed to ${notificationStatus}`,
                        })
                    }

                    new SuccessResponse("Status updated successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getProviderWalletDetails = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let walletData = await dbReader.wallet.findAll({
                    where: {
                        provider_id: user_id,
                        is_deleted: 0
                    },
                    include: [{
                        required: false,
                        model: dbReader.service,
                        where: {
                            is_deleted: 0
                        }
                    }]
                });
                walletData = JSON.parse(JSON.stringify(walletData));

                new SuccessResponse("Wallet data get successfully.", {
                    data: walletData
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getServiceBookingDetailById = async (req, res) => {
        try {
            let {
                service_booking_id
            } = req.body
            let {
                user_id,
                role
            } = req;
            let serviceData = await dbReader.service.findOne({
                where: {
                    is_deleted: 0
                },
                subQuery: false,
                include: [{
                    required: true,
                    model: dbReader.serviceBooking,
                    where: {
                        is_deleted: 0,
                        service_booking_id: service_booking_id
                    },
                    include: [{
                        required: false,
                        model: dbReader.coupan,
                        where: {
                            is_deleted: 0
                        }
                    }, {
                        required: false,
                        model: dbReader.serviceBookingHandyman,
                        where: {
                            is_deleted: 0
                        },
                        include: [{
                            model: dbReader.users,
                            attributes: ["user_id", "name", "username", "email", "contact", "photo", "is_active", "created_at"],
                            where: {
                                is_deleted: 0,
                                is_active: 1
                            },
                            include: [{
                                required: false,
                                model: dbReader.serviceRating,
                                where: {
                                    is_deleted: 0,
                                    rating_type: 3
                                }
                            }]
                        }]
                    }, {
                        required: false,
                        model: dbReader.users,
                        attributes: ["user_id", "name", "username", "email", "photo", "contact", "is_active", "created_at"],
                        where: {
                            is_deleted: 0,
                            is_active: 1
                        }
                    }, {
                        required: false,
                        model: dbReader.serviceBookingPayment,
                        where: {
                            is_deleted: 0
                        }
                    }]
                }, {
                    attributes: ['user_id', 'name', 'email', 'contact', 'photo', 'address', 'city', 'state', 'country', 'username'],
                    model: dbReader.users,
                    where: {
                        role: 2,
                        is_deleted: 0
                    }
                }, {
                    required: false,
                    as: "service_rating",
                    model: dbReader.serviceRating,
                    where: {
                        is_deleted: 0,
                        rating_type: 1
                    },
                    include: [{
                        attributes: ['user_id', 'name', 'email', 'contact', 'photo', 'address', 'city', 'state', 'country', 'username'],
                        model: dbReader.users,
                        where: {
                            is_deleted: 0
                        }
                    }]
                }]
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));

            let cnt = 0,
                avg_rating = 0,
                temp = null;
            if (serviceData?.service_rating?.length > 0) {
                for (let j = 0; j < serviceData?.service_rating?.length; j++) {
                    cnt = parseFloat(cnt) + parseFloat(serviceData?.service_rating[j]?.rating)
                }
                avg_rating = parseFloat(parseFloat(cnt) / serviceData?.service_rating?.length).toFixed(2);
            }
            temp = {
                ...serviceData,
                avaerage_rating: avg_rating
            };

            let newData = [];
            if (serviceData?.ServiceBookings?.length > 0) {
                for (let i = 0; i < serviceData?.ServiceBookings?.length; i++) {

                    let temp_service_booking_handyman = [];
                    for (let j = 0; j < serviceData?.ServiceBookings[i]?.ServiceBookingHandymans?.length; j++) {
                        let handyman_user_avg_rating = 0,
                            c = 0; //, tmp = { ...serviceData?.ServiceBookings[i]?.ServiceBookingHandymans[j]?.User };
                        if (serviceData?.ServiceBookings[i]?.ServiceBookingHandymans[j]?.User?.ServiceRatings?.length > 0) {
                            for (let k = 0; k < serviceData?.ServiceBookings[i]?.ServiceBookingHandymans[j]?.User?.ServiceRatings?.length; k++) {
                                c = parseFloat(c) + parseFloat(serviceData?.ServiceBookings[i]?.ServiceBookingHandymans[j]?.User?.ServiceRatings[k]?.rating);
                            }
                            handyman_user_avg_rating = parseFloat(parseFloat(c) / serviceData?.ServiceBookings[i]?.ServiceBookingHandymans[j]?.User?.ServiceRatings?.length).toFixed(2);
                        }
                        // tmp = { ...serviceData?.ServiceBookings[i], avaerage_rating: handyman_user_avg_rating };
                        // newData.push(tmp);

                        temp_service_booking_handyman.push({
                            ...serviceData?.ServiceBookings[i]?.ServiceBookingHandymans[j],
                            avaerage_rating: handyman_user_avg_rating
                        });
                    }
                    newData.push({
                        ...serviceData?.ServiceBookings[i],
                        ServiceBookingHandymans: temp_service_booking_handyman
                    });
                }
            }

            let returnData = {
                ...temp,
                ServiceBookings: newData
            };

            new SuccessResponse("Service get successfully.", {
                data: returnData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    getServiceBookingHistory = async (req, res) => {
        try {
            let {
                service_booking_id
            } = req.body
            let {
                user_id,
                role
            } = req;
            let serviceBookingHistoryData = await dbReader.serviceBookingHistory.findAll({
                where: {
                    is_deleted: 0,
                    service_booking_id: service_booking_id
                },
            });
            serviceBookingHistoryData = JSON.parse(JSON.stringify(serviceBookingHistoryData));
            new SuccessResponse("Service history get successfully.", {
                data: serviceBookingHistoryData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    getUserServiceBookingByStatus = async (req, res) => {
        try {
            let {
                status
            } = req.body
            let {
                user_id,
                role
            } = req;
            let serviceBookingData = await dbReader.serviceBooking.findAll({
                where: {
                    is_deleted: 0,
                    booked_by: user_id,
                    booking_status: status
                },
                include: [{
                    model: dbReader.service,
                    where: {
                        is_deleted: 0
                    },
                    include: [{
                        model: dbReader.users,
                        where: {
                            is_deleted: 0
                        }
                    }]
                }]
            });
            serviceBookingData = JSON.parse(JSON.stringify(serviceBookingData));
            new SuccessResponse("Service history get successfully.", {
                data: serviceBookingData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    getHandymanAssignedServiceBookingByStatus = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let serviceData = await dbReader.service.findAll({
                where: {
                    is_deleted: 0
                },
                include: [{
                    model: dbReader.users,
                    where: {
                        is_deleted: 0
                    }
                }, {
                    required: true,
                    model: dbReader.serviceBooking,
                    where: {
                        is_deleted: 0
                    },
                    include: [{
                        model: dbReader.serviceBookingHandyman,
                        where: {
                            user_id: user_id,
                            is_deleted: 0
                        }
                    }, {
                        model: dbReader.users,
                        attributes: ["user_id", "name", "username", "email", "photo", "is_active", "created_at"],
                        where: {
                            is_deleted: 0,
                            is_active: 1
                        }
                    }]
                }]
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));
            // let serviceBookingData = await dbReader.serviceBooking.findAll({
            //     where: whereCondition,
            //     include: [{
            //         model:dbReader.serviceBookingHandyman,
            //         where:{
            //             user_id:user_id,
            //             is_deleted:0
            //         }
            //     },{
            //         model: dbReader.service,
            //         where: {
            //             is_deleted: 0
            //         },
            //         include: [{
            //             model: dbReader.users,
            //             where: {
            //                 is_deleted: 0
            //             }
            //         }]
            //     }]
            // });
            // serviceBookingData = JSON.parse(JSON.stringify(serviceBookingData));
            new SuccessResponse("Request successful.", {
                data: serviceData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    //Manage payment flow
    paymentIntentForPurchaseSubscription = async (req, res) => {
        try {
            let {
                subscription_plan_id
            } = req.body;

            let {
                user_id,
                role
            } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {

                let userData = await dbReader.users.findOne({
                    where: {
                        user_id: user_id,
                        is_deleted: 0
                    }
                });
                userData = JSON.parse(JSON.stringify(userData));
                if (!userData) {
                    throw new Error("User data not found.");
                } else {
                    let sub_data = await dbReader.subscriptionPlan.findOne({
                        where: {
                            subscription_plan_id: subscription_plan_id,
                            is_deleted: 0
                        }
                    });
                    sub_data = JSON.parse(JSON.stringify(sub_data));

                    if (sub_data) {
                        const amountInFils = Math.round(parseFloat(sub_data?.amount) * 100);
                        const paymentIntent = await stripe.paymentIntents.create({
                            amount: amountInFils,
                            currency: "aed",
                            payment_method_types: ['card'],
                        });


                        // Create subscription record
                        const currentDate = moment();
                        const oneMonthLater = currentDate.add(1, 'months');
                        const formattedDate = oneMonthLater.format('DD-MM-YYYY');
                        const subscription_data = await dbWriter.subscription.create({
                            user_id: user_id,
                            subscription_plan_id: subscription_plan_id,
                            amount: sub_data?.amount,
                            due_date: formattedDate,
                            is_deleted: 1
                        });

                        await dbWriter.subscriptionPayment.create({
                            subscription_id: subscription_data?.subscription_id,
                            payment_type: "card",
                            status: 0,
                            transaction_id: paymentIntent.client_secret,
                            receipt: "",
                            card_details: ""
                        });

                        res.status(200).json({
                            clientSecret: paymentIntent.client_secret,
                            data: paymentIntent
                        });
                    } else {
                        throw new Error("Subscription plan data not found.");
                    }
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }


    // purchaseSubscription = async (req, res) => {
    //     try {
    //         let {
    //             subscription_plan_id,
    //             card_token
    //         } = req.body;

    //         let {
    //             user_id,
    //             role
    //         } = req;

    //         if (role !== 2) {
    //             throw new Error("User don't have permission to perform this action.");
    //         } else {

    //             let userData = await dbReader.users.findOne({
    //                 where: {
    //                     user_id: user_id,
    //                     is_deleted: 0
    //                 }
    //             });
    //             userData = JSON.parse(JSON.stringify(userData));
    //             if (!userData) {
    //                 throw new Error("User data not found.");
    //             } else {
    //                 let sub_data = await dbReader.subscriptionPlan.findOne({
    //                     where: {
    //                         subscription_plan_id: subscription_plan_id,
    //                         is_deleted: 0
    //                     }
    //                 });
    //                 sub_data = JSON.parse(JSON.stringify(sub_data));

    //                 if (sub_data) {

    //                     const charge = await stripe.charges.create({
    //                         amount: sub_data?.amount, // $50.00 in cents
    //                         currency: 'aed',
    //                         source: card_token,
    //                         description: 'Subscription - ' + userData?.email,
    //                     });


    //                     console.log("charge data are ::::: ", charge);

    //                     if (charge && charge?.id) {

    //                         // Create subscription record
    //                         const currentDate = moment();
    //                         const oneMonthLater = currentDate.add(1, 'months');
    //                         const formattedDate = oneMonthLater.format('DD-MM-YYYY');
    //                         const subscription_data = await dbWriter.subscription.create({
    //                             user_id: user_id,
    //                             subscription_plan_id: subscription_plan_id,
    //                             amount: sub_data?.amount,
    //                             due_date: formattedDate,
    //                         });

    //                         //Create subscription success payment record
    //                         await dbWriter.subscriptionPayment.create({
    //                             subscription_id: subscription_data?.subscription_id,
    //                             payment_type: "card",
    //                             status: 1,
    //                             transaction_id: charge?.id,
    //                             receipt: charge,
    //                             card_details: charge
    //                         });
    //                     } else {
    //                         console.log("charge :: ", charge);
    //                         throw new Error("payment fail");
    //                     }
    //                 } else {
    //                     throw new Error("Subscription plan data not found.");
    //                 }
    //             }
    //         }
    //     } catch (e) {
    //         ApiError.handle(new BadRequestError(e.message), res);
    //     }
    // }









    servicePaymentFromUser = async (req, res) => {
        try {
            let {
                service_booking_id
            } = req.body;

            let {
                user_id,
                role
            } = req;

            if (role !== 1) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let serviceBookingData = await dbReader.serviceBooking.findOne({
                    where: {
                        service_booking_id: service_booking_id,
                        is_deleted: 0
                    }
                });
                serviceBookingData = JSON.parse(JSON.stringify(serviceBookingData));
                if (!serviceBookingData) {
                    throw new Error("Service address not found.");
                } else {
                    //console.log("service Booking data are :::: ", serviceBookingData);

                    let payable_amount = parseFloat(serviceBookingData?.service_amount * serviceBookingData?.booking_service_qty) - serviceBookingData?.discount_amount - serviceBookingData?.commission_amount - serviceBookingData?.coupen_amount - serviceBookingData?.tax_amount;
                    //console.log("Payable amount ::: ", payable_amount);
                    if (payable_amount) {
                        // Convert amount from AED to fils and ensure it's an integer
                        const amountInFils = Math.round(parseFloat(payable_amount) * 100);

                        const paymentIntent = await stripe.paymentIntents.create({
                            amount: amountInFils,
                            currency: "aed",
                            payment_method_types: ['card'],
                        });

                        //console.log("paymentIntent ::: ", paymentIntent);


                        //Check for payment data if it is already exist or not and if not exist then create payment entry with statu pending and with the payment intent id and record already exist then update the payment intent id
                        let serviceBookingPaymentData = await dbReader.serviceBookingPayment.findOne({
                            where: {
                                service_booking_id: service_booking_id,
                                user_id: user_id,
                                is_deleted: 0
                            }
                        });
                        serviceBookingPaymentData = JSON.parse(JSON.stringify(serviceBookingPaymentData));
                        if (serviceBookingPaymentData) {

                            await dbWriter.serviceBookingPayment.update({
                                payment_intent_id: paymentIntent.id,
                            }, {
                                where: {
                                    service_booking_id: service_booking_id,
                                    user_id: user_id,
                                    is_deleted: 0
                                }
                            });
                        } else {
                            await dbWriter.serviceBookingPayment.create({
                                service_booking_id: service_booking_id,
                                payment_status: 0,
                                payment_method: "card",
                                amount: parseFloat(payable_amount),
                                description: "",
                                payment_intent_id: paymentIntent.id,
                                user_id: user_id,
                            });
                        }

                        res.status(200).json({
                            clientSecret: paymentIntent.client_secret,
                            data: paymentIntent
                        });
                    } else {
                        throw new Error("Payable amount is not valid.");
                    }
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    stripeWebHook = async (req, res) => {
        try {
            const sig = req.headers['stripe-signature'];
            const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

            let event;
            try {
                event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
            } catch (err) {
                res.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }

            const paymentWebHookData = event.data.object;
            if (event.type === 'payment_intent.succeeded' || event.type === 'charge.succeeded') {
                let serviceBookingData = await dbReader.serviceBookingPayment.findOne({
                    where: {
                        payment_intent_id: paymentWebHookData.id,
                    }
                });
                serviceBookingData = JSON.parse(JSON.stringify(serviceBookingData));
                if (serviceBookingData) {
                    await dbWriter.serviceBookingPayment.update({
                        payment_intent_id: "",
                        payment_status: 1,
                        description: JSON.stringify(paymentWebHookData),
                    }, {
                        where: {
                            payment_intent_id: paymentWebHookData.id,
                        }
                    });
                }

                let subscriptionData = await dbReader.subscriptionPayment.findOne({
                    where: {
                        transaction_id: paymentWebHookData.id,
                    }
                });
                subscriptionData = JSON.parse(JSON.stringify(subscriptionData));
                if (subscriptionData) {
                    await dbWriter.subscriptionPayment.update({
                        transaction_id: "",
                        payment_status: 1,
                        receipt: JSON.stringify(paymentWebHookData)
                    }, {
                        where: {
                            transaction_id: paymentWebHookData.id,
                        }
                    });

                    await dbWriter.subscription.update({
                        is_deleted: 0
                    }, {
                        where: {
                            subscription_id: subscriptionData?.subscription_id,
                        }
                    });
                }
            } else if (event.type === 'payment_intent.payment_failed' || event.type === 'charge.failed') {

                let serviceBookingData = await dbReader.serviceBookingPayment.findOne({
                    where: {
                        payment_intent_id: paymentWebHookData.id,
                    }
                });
                serviceBookingData = JSON.parse(JSON.stringify(serviceBookingData));
                if (serviceBookingData) {
                    await dbWriter.serviceBookingPayment.update({
                        payment_intent_id: "",
                        payment_status: 2,
                        description: JSON.stringify(paymentWebHookData),
                    }, {
                        where: {
                            payment_intent_id: paymentWebHookData.id,
                        }
                    });
                }
            }

            res.status(200).end();
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }


    //Old Approach Create stripe account for user and link bank with it and store it with the user details.
    createProviderStripeAccount = async (req, res) => {
        try {
            let {
                routing_number,
                account_number
            } = req.body;
            let {
                user_id,
                role
            } = req;

            let userData = await dbReader.users.findOne({
                where: {
                    user_id: user_id,
                    is_deleted: 0
                }
            });
            userData = JSON.parse(JSON.stringify(userData));
            if (!userData) {
                throw new Error("User data not found.");
            } else {
                let stripe_account_id = userData?.stripe_account_id,
                    stripe_bank_account_id = userData?.stripe_bank_account_id;

                if (stripe_account_id && stripe_bank_account_id) {
                    new SuccessResponse("User's stripe account already up to date.", {
                        stripe_account_id: stripe_account_id,
                        stripe_bank_account_id: stripe_bank_account_id
                    }).send(res);
                } else {
                    if (!stripe_account_id) {
                        const account = await stripe.accounts.create({
                            type: 'express', // Use 'express' or 'standard' depending on your needs
                            country: 'AE', // Set the country code to UAE
                            email: userData?.email,
                            capabilities: {
                                card_payments: {
                                    requested: true
                                },
                                transfers: {
                                    requested: true
                                },
                            },
                        });
                        stripe_account_id = account.id;
                    }

                    if (stripe_account_id && !stripe_bank_account_id) {
                        const bank_account = stripe.accounts.createExternalAccount(
                            stripe_account_id, // Replace with the ID of the connected account
                            {
                                external_account: {
                                    object: 'bank_account',
                                    country: 'AE',
                                    currency: 'aed',
                                    account_holder_name: userData?.name,
                                    account_holder_type: 'individual', // or 'company'
                                    routing_number: routing_number, // Replace with the appropriate bank code or SWIFT code
                                    account_number: account_number, // Replace with the appropriate bank account number
                                },
                            }
                        );
                        stripe_bank_account_id = bank_account.id;
                    }

                    await dbWriter.users.update({
                        stripe_account_id: stripe_account_id,
                        stripe_bank_account_id: stripe_bank_account_id
                    }, {
                        where: {
                            user_id: user_id
                        }
                    });

                    new SuccessResponse("User's stripe account setup done successfully.", {
                        stripe_account_id: stripe_account_id,
                        stripe_bank_account_id: stripe_bank_account_id
                    }).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }


    //New approach to save bank account number and bank account routing number with user data
    saveBankAccountAndRoutingDetails = async (req, res) => {
        try {
            let {
                account_number,
                routing_number
            } = req.body;
            let {
                user_id,
                role
            } = req;

            let userData = await dbReader.users.findOne({
                where: {
                    user_id: user_id,
                    is_deleted: 0
                }
            });
            userData = JSON.parse(JSON.stringify(userData));
            if (!userData) {
                throw new Error("User data not found.");
            } else {


                await dbWriter.users.update({
                    bank_account_number: account_number,
                    routing_number: routing_number
                }, {
                    where: {
                        user_id: user_id
                    }
                });

                new SuccessResponse("Bank details  updated successfully.", {
                    bank_account_number: account_number,
                    routing_number: routing_number
                }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    // transferToProvider = async (req, res) => {
    //     try {
    //         let {
    //             role
    //         } = req;
    //         const { amount, user_id } = req.body;

    //         if (role !== 4) {
    //             throw new Error("User don't have permission to perform this action.");
    //         } else {

    //             let userData = await dbReader.users.findOne({
    //                 where: {
    //                     user_id: user_id,
    //                     is_deleted: 0
    //                 }
    //             });
    //             userData = JSON.parse(JSON.stringify(userData));
    //             if (!userData) {
    //                 throw new Error("User data not found.");
    //             } else {
    //                 if (userData?.stripe_account_id) {
    //                     const transfer = await stripe.transfers.create({
    //                         amount,
    //                         currency: 'usd',
    //                         destination: providerAccountId,
    //                     });
    //                     console.log("transfer data is :: ", transfer);
    //                     res.status(200).json({ transfer });
    //                 } else {
    //                     throw new Error("User stripe account not linked.");
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // };
}

module.exports = ProviderController;
