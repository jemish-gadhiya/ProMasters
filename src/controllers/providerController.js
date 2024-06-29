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

    //Service address module API's
    addEditServiceAddress = async (req, res) => {
        try {
            let { service_address_id = 0, address, latitude = "", longitude = "" } = req.body;
            let { user_id, role } = req;

            console.log("user role is :", role);
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

    deactiveServiceAddress = async (req, res) => {
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


    //Category module API's
    addEditCategory = async (req, res) => {
        try {
            let { category_id = 0, name, image } = req.body;
            let { user_id, role } = req;

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
                        where: { category_id: category_id }
                    });

                    new SuccessResponse("Category updated successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getAllCategory = async (req, res) => {
        try {
            let { user_id, role } = req;
            let categoryData = await dbReader.category.findAll({
                where: {
                    is_deleted: 0
                }
            });
            categoryData = JSON.parse(JSON.stringify(categoryData));
            new SuccessResponse("Category get successfully.", { data: categoryData }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getActiveCategory = async (req, res) => {
        try {
            let { user_id, role } = req;
            let categoryData = await dbReader.category.findAll({
                where: {
                    is_enable: 1,
                    is_deleted: 0
                }
            });
            categoryData = JSON.parse(JSON.stringify(categoryData));
            new SuccessResponse("Category get successfully.", { data: categoryData }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deleteCategory = async (req, res) => {
        try {
            let { category_id } = req.body;
            let { user_id, role } = req;

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
                    where: { category_id: category_id }
                });

                new SuccessResponse("Category deleted successfully.", {}).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deactiveCategory = async (req, res) => {
        try {
            let { category_id } = req.body;
            let { user_id, role } = req;

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
                    where: { category_id: category_id }
                });

                new SuccessResponse("Category updated successfully.", {}).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    //Service Module
    addEditService = async (req, res) => {
        try {
            let { service_id = 0, service_name, category_id, service_address_id, service_type, price, discount, duration_hours, duration_mins, image_link, is_featured, gallery_images = [] } = req.body;
            let { user_id, role } = req;

            if (role !== 2) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                if (service_id === 0) {
                    let newService = await dbWriter.service.create({
                        service_name: service_name,
                        category_id: category_id,
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
                            service_name: service_name,
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
            let { service_id } = req.body;
            let { user_id, role } = req;

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
                    where: { service_id: service_id, }
                });

                new SuccessResponse("Service deleted successfully.", {}).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    getServiceByCategory = async (req, res) => {
        try {
            let { category_id } = req.body
            let { user_id, role } = req;
            let serviceData = await dbReader.service.findAll({
                where: {
                    category_id: category_id,
                    is_deleted: 0
                }
            });
            serviceData = JSON.parse(JSON.stringify(serviceData));
            new SuccessResponse("Service get successfully.", { data: serviceData }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    getServiceById = async (req, res) => {
        try {
            let { service_id } = req.body
            let { user_id, role } = req;
            let serviceData = await dbReader.service.findOne({
                where: {
                    service_id: service_id,
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
            new SuccessResponse("Service get successfully.", { ...serviceData }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

}

module.exports = ProviderController;
