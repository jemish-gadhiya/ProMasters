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
const {
    Op,
    where
} = require('sequelize');
const { required } = require('joi');

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
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));
            new SuccessResponse("Service get successfully.", {
                data: serviceData
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
                    as: "service_rating",
                    model: dbReader.serviceRating,
                    where: {
                        is_deleted: 0,
                        rating_type: 1
                    }
                }]
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));
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

    listServiceForUser = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let {
                service_user_id,
                rating,
                min_amount,
                max_amount,
                category
            } = req.body;

            // Build the where conditions
            let serviceWhereConditions = {
                is_deleted: 0
            };

            if (service_user_id) {
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
                rating_type: 0
            };

            if (rating) {
                serviceRatingWhereConditions.rating = rating;
            }

            let serviceData = await dbReader.service.findAll({
                where: serviceWhereConditions,
                include: [{
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
            new SuccessResponse("Service retrieved successfully.", {
                data: serviceData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    };

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
                    is_active: 1,
                    is_deleted: 0
                }
            });
            let couponAmount = 0;
            if (couponData) {
                couponAmount = couponData?.coupon_amount;
            }

            if (booking_id == 0) {
                let serviceBookingData = await dbReader.serviceBooking.create({
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
                })
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
                        date: e.date
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
            serviceHandymanData = JSON.parse(JSON.stringify(serviceHandymanData))
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
                service_id
            } = req.body
            let {
                user_id,
                role
            } = req;

            let data = await dbReader.service.findOne({
                where: {
                    service_id: service_id,
                    is_deleted: 0
                },
                include: [{
                    required: true,
                    model: dbReader.serviceBooking,
                    where: {
                        is_deleted: 0
                    }
                }]
            })
            data = JSON.parse(JSON.stringify(data))
            if (data) {
                await dbWriter.serviceBooking.update({
                    booking_status: status
                }, {
                    where: {
                        service_id: service_id,
                        is_deleted: 0
                    }
                })
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
                        attributes: ["user_id", "name", 'email', "contact", "role", "photo", "address", "city", "state", "country",],
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

                    if (status === 2) { //If status is completed then add respective service amount to provider's wallet.
                        let provider_id = serviceBookingData?.Service?.user_id,
                            service_id = serviceBookingData?.Service?.service_id,
                            amount = (serviceBookingData?.service_amount * serviceBookingData?.booking_service_qty) - serviceBookingData?.discount_amount - serviceBookingData?.commission_amount - serviceBookingData?.coupen_amount - serviceBookingData?.tax_amount;

                        await dbWriter.wallet.create({
                            provider_id: provider_id,
                            service_id: service_id,
                            amount: amount
                        });
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
				subQuery:false,
                include: [{
                    required: true,
                    model: dbReader.serviceBooking,
                    where: {
                        is_deleted: 0,
                        service_booking_id: service_booking_id
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
                            include: [{
								required: false,
                                model: dbReader.serviceRating,
                                where: {
                                    is_deleted: 0
                                }
                            }]
                        }]
                    }, {
                        required: false,
                        model: dbReader.users,
                        attributes: ["user_id", "name", "username", "email", "photo", "is_active", "created_at"],
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
}

module.exports = ProviderController;
